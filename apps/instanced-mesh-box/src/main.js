import * as Dimensional from 'dimensional-engine'
import * as Settings from './settings.js'

// Define engine constant

const ENGINE = new Dimensional.System( { animUpdateInterval: 60 } )

// Some constants need for this program

const BG_COLOR = new Dimensional.Three.Color( 
    Settings.RAND_COLOR.r / 8, 
    Settings.RAND_COLOR.g / 8, 
    Settings.RAND_COLOR.b / 8 
)

const CUBE_GEOMETRY = new Dimensional.Three.IcosahedronGeometry( Settings.CUBE_SIZE / 1.5, 0 )
const MATERIAL_NORMAL = new Dimensional.Three.MeshNormalMaterial()
const MATERIAL_COLORED = new Dimensional.Three.MeshPhongMaterial( { color: Settings.RAND_COLOR } )
const TESTING = false

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

ENGINE.Managers.ECS.createAssembly( 'Mesh Box', async ( e, material, objectScale, scene ) => {

    e.setName( 'Mesh Box' )

    await e.addComponent( 
        ENGINE.ECS.InstancedMeshComponent, 
        CUBE_GEOMETRY, 
        material, 
        Settings.SIZE_COUNT * Settings.SIZE_COUNT * Settings.SIZE_COUNT
    )

    await e.addComponent( ENGINE.ECS.InstancedMeshBoxComponent, objectScale )
    await e.addComponent( ENGINE.ECS.RandomRotateInstancedMeshComponent, 5 )

    const MESH_COMP = e.getComponent( 'InstancedMesh' )
    MESH_COMP.setParent( scene )

} )

// Build engine start method

ENGINE.onStart = async () => {

    // Build scenes

    const SCENE1 = await ENGINE.Managers.Scene.buildScene( 'Normals', { 
        background: BG_COLOR
    } )

    const SCENE2 = await ENGINE.Managers.Scene.buildScene( 'Colored', { 
        background: BG_COLOR
    } )

    // Assemble entities

    await ENGINE.Managers.ECS.assemble( 'Camera', {
        position: new Dimensional.Three.Vector3( 0, Settings.SIZE_COUNT * Settings.CAMERA_ZOOM_OUT_MULT * 10, 0 )
    } )

    const CAMERA = await ENGINE.Managers.ECS.assemble( 'Camera', {
        parent: SCENE2,
        position: new Dimensional.Three.Vector3(
            Settings.SIZE_COUNT * Settings.CAMERA_ZOOM_OUT_MULT, 
            Settings.SIZE_COUNT * Settings.CAMERA_ZOOM_OUT_MULT,
            Settings.SIZE_COUNT * Settings.CAMERA_ZOOM_OUT_MULT 
        ),
    } )

    const SCALE = new Dimensional.Three.Vector3(
        Settings.CUBE_SIZE,
        Settings.CUBE_SIZE,
        Settings.CUBE_SIZE,
    )

    await ENGINE.Managers.ECS.assemble( 'Mesh Box', MATERIAL_NORMAL, SCALE, SCENE1 )
    await ENGINE.Managers.ECS.assemble( 'Mesh Box', MATERIAL_COLORED, SCALE, SCENE2 )

    await ENGINE.Managers.ECS.assemble( 'Light', {
        parent: SCENE2,
        position: new Dimensional.Three.Vector3( 100, 100, 100 ),
    } )

    // Build renderer and activate it

    await ENGINE.Managers.Renderer.buildRenderer( 'Main', SCENE2, CAMERA.call( 'Camera', 'get' ) )
    await ENGINE.Managers.Renderer.Renderers.activate( 'Main' )

    ENGINE.Tools.RendererInterface.selectCamera( 'Camera#3' )
    ENGINE.Tools.RendererInterface.selectScene( 'Colored' )

    /**
     * Here I made an interval where every 3 seconds, the animUpdateInterval will
     * be halved, starting at 60, for 12 seconds. Once the interval is complete,
     * it will start the interval all over again, as it usually does. This will
     * only start if the TESTING constant is <true>. This will begin after 12 seconds.
     * 
     * Pressing <Key F9> will allow you to see the change in the Renderer Tool panel.
     */

    if ( TESTING ) {

        setInterval ( () => {

            ENGINE.Settings.animUpdateInterval = 60
    
            setTimeout( () => ENGINE.Settings.animUpdateInterval = 30, 3000 )
            setTimeout( () => ENGINE.Settings.animUpdateInterval = 15, 6000 )
            setTimeout( () => ENGINE.Settings.animUpdateInterval = 7, 9000 )
    
        }, 12000 )

    }

}

// Start engine

ENGINE.start()