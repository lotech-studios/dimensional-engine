import * as Dimensional from 'dimensional-engine'
import * as Settings from './settings.js'

// Define engine constant

const ENGINE = new Dimensional.System()

// Create assemblies

const createTree = async ( terrain ) => {

    ENGINE.Managers.ECS.createAssembly( 'Forest', async ( e ) => {

        let count = 1000

        const GLTF_TREE = await ENGINE.Managers.Models.load( `./public/models/birch-tree-${ Dimensional.Utils.Array.getRandomValue( [ 'orange', 'green' ] ) }-${ Math.round( Dimensional.Utils.Math.random( 0, 1 ) ) }.gltf` )
        const MESH_TREE = GLTF_TREE.scene.children[ 0 ]
    
        ENGINE.Managers.Renderer.get( 'Main' ).setupCSMMaterial( MESH_TREE.material )

        e.setName( 'Forest' )
    
        await e.addComponent( 
            ENGINE.ECS.InstancedMeshComponent, 
            MESH_TREE.geometry, MESH_TREE.material, 
            count
        )

        const MESH_COMP = e.getComponent( 'InstancedMesh' )
        MESH_COMP.Mesh.castShadow = true
        MESH_COMP.Mesh.receiveShadow = true
        MESH_COMP.setParent( ENGINE.Managers.Scene.get( 'Main' ) )

        for ( let i = 0; i < count; i++ ) {

            const POS_VEC = new Dimensional.Three.Vector3(
                Dimensional.Utils.Math.random( -2, 2 ), 0, Dimensional.Utils.Math.random( -2, 2 ) )

            const ROT_VEC = new Dimensional.Three.Vector3(
                0, Dimensional.Utils.Math.random( -Math.PI, Math.PI ), 0 )

            MESH_COMP.setInstanceScale( i, 0.0025 )
            MESH_COMP.setInstancePosition( i, POS_VEC )
            MESH_COMP.setInstanceRotation( i, ROT_VEC )

        }
    
    } )

    for ( let i = 0; i < 10; i++ ) {

        await ENGINE.Managers.ECS.assemble( 'Forest' )

    }

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

            material: await ENGINE.Managers.Materials.get( 'terrain' )
        }
    )

    await e.addComponent( 
        ENGINE.ECS.TerrainCameraComponent, 
        {
            name: 'Main',
            parent: ENGINE.Managers.Scene.get( 'Main' ),
            position: new Dimensional.Three.Vector3( 4, 4, -4 ),
        } 
    )

    await e.addComponent( 
        ENGINE.ECS.MapCameraControlsComponent, 
        'TerrainCamera',
        {
            enableDamping: true,
            screenSpacePanning: false,
            maxPolarAngle: Math.PI / 4,
            minPolarAngle: Math.PI / 4,
            maxDistance: 2,
            minDistance: 0.25,
        } 
    )

} )

// Build engine load methods

ENGINE.onBeforeLoad = async () => {

    await ENGINE.Managers.Textures.setStartBatch( [ './src/batches/textures.json' ] )
    await ENGINE.Managers.Materials.setStartBatch( [ './src/batches/materials.json' ] )

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

    await createTree( ENT_TERRAIN )

}

// Start engine

ENGINE.start()

window.ENGINE = ENGINE