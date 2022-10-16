import * as Dimensional from 'dimensional-engine'
import * as Settings from './settings.js'

// Define engine constant

const ENGINE = new Dimensional.System()

// Some constants need for this program

const MATERIAL_COLORED = new Dimensional.Three.MeshPhongMaterial( { color: Settings.RAND_COLOR } )

// Create assemblies

ENGINE.Managers.ECS.createAssembly( 'Camera', async ( e, params ) => {

    e.setName( 'Camera' )
    await e.addComponent( ENGINE.ECS.CameraComponent, params )

    await e.addComponent( ENGINE.ECS.OrbitCameraControlsComponent, {
        enableDamping: true
    } )

} )

ENGINE.Managers.ECS.createAssembly( 'Light', async ( e, params ) => {

    e.setName( 'Light' )
    await e.addComponent( ENGINE.ECS.DirectionalLightComponent, params )

} )

ENGINE.Managers.ECS.createAssembly( 'Terrain', async ( e ) => {

    e.setName( 'Terrain' )
    
    await e.addComponent( 
        ENGINE.ECS.TerrainComponent, 
        ENGINE.Managers.Scene.get( 'Main' ),
        {
            chunkSimplexAmp: 0.75,
            chunkSimplexRangeX: 0.125,
            chunkSimplexRangeY: 0.125,

            peakAmp: 4,
            peakStartHeight: 0.125,

            seaLevel: 0.5,
        }
    )

    await e.getComponent( 'Terrain' ).generate()

} )

// Build engine start method

ENGINE.onStart = async () => {

    // Build scenes

    await ENGINE.Managers.Scene.buildScene( 'Main', { 
        background: new Dimensional.Three.Color( 0x000000 )
    } )

    // Assemble entities

    await ENGINE.Managers.ECS.assemble( 'Camera', {
        name: 'Main',
        parent: ENGINE.Managers.Scene.get( 'Main' ),
        position: new Dimensional.Three.Vector3( 4, 4, 4 ),
    } )

    await ENGINE.Managers.ECS.assemble( 'Light', {
        parent: ENGINE.Managers.Scene.get( 'Main' ),
        position: new Dimensional.Three.Vector3( 100, 100, 100 ),
    } )

    // Build renderer and activate it

    await ENGINE.Managers.Renderer.buildRenderer( 
        'Main', 
        ENGINE.Managers.Scene.get( 'Main' ), 
        ENGINE.Managers.Camera.get( 'Main' )
    )

    await ENGINE.Managers.ECS.assemble( 'Terrain' )

    await ENGINE.Managers.Renderer.Renderers.activate( 'Main' )

    ENGINE.Tools.RendererInterface.selectCamera( 'Main' )
    ENGINE.Tools.RendererInterface.selectScene( 'Main' )

}

// Start engine

ENGINE.start()