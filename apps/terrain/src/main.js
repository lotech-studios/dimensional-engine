import * as Dimensional from 'dimensional-engine'
import * as Settings from './settings.js'

// Define engine constant

const ENGINE = new Dimensional.System()

// Some constants need for this program

const MATERIAL_COLORED = new Dimensional.Three.MeshPhongMaterial( { color: Settings.RAND_COLOR } )

// Create assemblies

const createTree = async () => {

    const COLOR_GREEN = new Dimensional.Three.Color( 0x00ff00 )
    const COLOR_PURPLE = new Dimensional.Three.Color( 0xff00ff )

    const GLTF_TREE = await ENGINE.Managers.Models.load( './public/models/tree.gltf' )

    console.log( GLTF_TREE )

    const MESH_TREE = GLTF_TREE.scene.children[ 0 ]
    MESH_TREE.translateY( 0.1 )
    MESH_TREE.scale.setScalar( 0.01, 0.01, 0.01 )

    MESH_TREE.material.onBeforeCompile = ( shader ) => {

        MESH_TREE.material.shader = shader

        shader.uniforms[ 'time' ] = { value: 0.0 }  

        shader.vertexShader = `
            uniform float time;

            float N (vec2 st) { // https://thebookofshaders.com/10/
                return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
            }
            
            float smoothNoise( vec2 ip ){ // https://www.youtube.com/watch?v=zXsWftRdsvU
                vec2 lv = fract( ip );
              vec2 id = floor( ip );
              
              lv = lv * lv * ( 3. - 2. * lv );
              
              float bl = N( id );
              float br = N( id + vec2( 1, 0 ));
              float b = mix( bl, br, lv.x );
              
              float tl = N( id + vec2( 0, 1 ));
              float tr = N( id + vec2( 1, 1 ));
              float t = mix( tl, tr, lv.x );
              
              return mix( b, t, lv.y );
            }

            ${ shader.vertexShader }
        `

        shader.vertexShader = shader.vertexShader.replace( '#include <begin_vertex>', `
            // #include <begin_vertex>

            float t = time * 2.;

            vec4 mvxPosition = vec4( position, 1.0 );
            #ifdef USE_INSTANCING
                mvxPosition = instanceMatrix * mvxPosition;
            #endif

            // DISPLACEMENT

            float noise = smoothNoise(mvxPosition.xz * 0.5 + vec2(0., t));
            noise = pow(noise * 0.5 + 0.5, 2.) * 2.;

            // here the displacement is made stronger on the blades tips.
            float dispPower = 1. - cos( mvxPosition.y * 3.1416 * 0.05 );

            float displacement = noise * ( 0.1 * dispPower );
            mvxPosition.z -= displacement;
            mvxPosition.x -= displacement;

            vec3 transformed = mvxPosition.xyz;
        ` )

        shader.vertexShader = shader.vertexShader.replace( '#include <fog_vertex>', `
            #include <fog_vertex>

            vec4 modelViewPosition = modelViewMatrix * mvxPosition;
            gl_Position = projectionMatrix * modelViewPosition;
        ` )

        ENGINE.onRender = ( dT, eT ) => {

            MESH_TREE.material.shader.uniforms[ 'time' ].value += ENGINE.Time.delta
        
        }

    }

    ENGINE.Managers.ECS.createAssembly( 'Forest', async ( e ) => {

        e.setName( 'Forest' )
    
        await e.addComponent( 
            ENGINE.ECS.InstancedMeshComponent, 
            MESH_TREE.geometry, MESH_TREE.material, 
            1000
        )

        const MESH_COMP = e.getComponent( 'InstancedMesh' )
        MESH_COMP.setParent( ENGINE.Managers.Scene.get( 'Main' ) )

        for ( let i = 0; i < 1000; i++ ) {

            const VEC = new Dimensional.Three.Vector3(
                Dimensional.Utils.Math.random( -2, 2 ),
                0,
                Dimensional.Utils.Math.random( -2, 2 )
            )

            MESH_COMP.setInstanceScale( i, 0.0025 )
            MESH_COMP.setInstancePosition( i, VEC )

        }
    
    } )

    await ENGINE.Managers.ECS.assemble( 'Forest' )

}

ENGINE.Managers.ECS.createAssembly( 'Light', async ( e ) => {

    e.setName( 'Light' )

    await e.addComponent( ENGINE.ECS.DirectionalLightComponent, {
        parent: ENGINE.Managers.Scene.get( 'Main' ),
        position: new Dimensional.Three.Vector3( 100, 100, 100 ),
    } )

    await e.addComponent( ENGINE.ECS.HemiLightComponent, {
        intensity: 0.25,
        parent: ENGINE.Managers.Scene.get( 'Main' ),
        position: new Dimensional.Three.Vector3( 0, 100, 0 ),
    } )

} )

ENGINE.Managers.ECS.createAssembly( 'Terrain', async ( e ) => {

    e.setName( 'Terrain' )
    
    await e.addComponent( 
        ENGINE.ECS.TerrainComponent, 
        ENGINE.Managers.Scene.get( 'Main' ),
        { 
            flat: true,
            vertexColoring: false,

            material: new Dimensional.Three.MeshPhongMaterial( {
                color: 0x326400,
                shininess: 0,
            } )
        }
    )

    await e.addComponent( 
        ENGINE.ECS.TerrainCameraComponent, 
        {
            name: 'Main',
            parent: ENGINE.Managers.Scene.get( 'Main' ),
            position: new Dimensional.Three.Vector3( 4, 4, 4 ),
        } 
    )

    await e.addComponent( 
        ENGINE.ECS.OrbitCameraControlsComponent, 
        'TerrainCamera',
        {
            enableDamping: true,
            screenSpacePanning: false,
        } 
    )

} )

// Build engine start method

ENGINE.onStart = async () => {

    // Build scenes

    await ENGINE.Managers.Scene.buildScene( 'Main', { 
        background: new Dimensional.Three.Color( 0x000000 )
    } )

    // Assemble entities

    await ENGINE.Managers.ECS.assemble( 'Light' )

    const ENT_TERRAIN = await ENGINE.Managers.ECS.assemble( 'Terrain' )

    // Build renderer and activate it

    await ENGINE.Managers.Renderer.buildRenderer( 
        'Main', 
        ENGINE.Managers.Scene.get( 'Main' ), 
        ENGINE.Managers.Camera.get( 'Main' ),
        {
            postProcessing: false,
        }

    )

    // activate renderer

    await ENGINE.Managers.Renderer.Renderers.activate( 'Main' )

    // generate terrain

    await ENT_TERRAIN.getComponent( 'Terrain' )
        .generate( ENGINE.Managers.Renderer.get( 'Main' ) )

    ENGINE.Tools.RendererInterface.selectCamera( 'Main' )
    ENGINE.Tools.RendererInterface.selectScene( 'Main' )

    await createTree()

}

// Start engine

ENGINE.start()

window.ENGINE = ENGINE