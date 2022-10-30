import * as Dimensional from 'dimensional-engine'
import * as Settings from './settings.js'

// Define engine constant

const ENGINE = new Dimensional.System()

// Create assemblies

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
            csmEnabled: true,
            csmCascades: 4,
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

}

// Start engine

ENGINE.start()

window.ENGINE = ENGINE