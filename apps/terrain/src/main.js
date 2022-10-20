import * as Dimensional from 'dimensional-engine'
import * as Settings from './settings.js'

// Define engine constant

const ENGINE = new Dimensional.System()

// Create assemblies

const createTree = async ( terrain ) => {

    const GLTF_TREE = await ENGINE.Managers.Models.load( './public/models/tree.gltf' )
    const MESH_TREE = GLTF_TREE.scene.children[ 0 ]
    
    ENGINE.Managers.Renderer.get( 'Main' ).setupCSMMaterial( MESH_TREE.material )

    ENGINE.Managers.ECS.createAssembly( 'Forest', async ( e ) => {

        e.setName( 'Forest' )
    
        await e.addComponent( 
            ENGINE.ECS.InstancedMeshComponent, 
            MESH_TREE.geometry, MESH_TREE.material, 
            1000
        )

        const MESH_COMP = e.getComponent( 'InstancedMesh' )
        MESH_COMP.Mesh.castShadow = true
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
                color: 0x163200,
                map: ENGINE.Managers.Textures.get( 'polygons' ),
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

// Build engine load methods

ENGINE.onBeforeLoad = async () => {

    ENGINE.Managers.Textures.setStartBatch( [ './src/batches/textures.json' ] )

}

ENGINE.onLoaded = async () => {

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
    ENGINE.Tools.RendererInterface.selectCamera( 'Main' )
    ENGINE.Tools.RendererInterface.selectScene( 'Main' )

    // generate terrain

    await ENT_TERRAIN.getComponent( 'Terrain' )
        .generate( ENGINE.Managers.Renderer.get( 'Main' ) )

    ENGINE.Managers.Renderer.get( 'Main' ).setupCSMMaterial(
        ENT_TERRAIN.getComponent( 'Terrain' ).Material )

    await createTree( ENT_TERRAIN )

}

// Start engine

ENGINE.start()

window.ENGINE = ENGINE