import * as Dimensional from 'dimensional-engine'

// Define engine constant

const ENGINE = new Dimensional.System( { animUpdateInterval: 75 } )

// Some constants need for this program

const SETTINGS = {
    CAMERA_ZOOM_OUT_MULT: 0.5,
    CUBESIZE: 0.1,
    CUBEX: 9,
    CUBEY: 9,
    CUBEZ: 9,
    RAND_COLOR: Dimensional.Utils.Math.randomThreeColor(),
}

const BG_COLOR = new Dimensional.Three.Color( 
    SETTINGS.RAND_COLOR.r / 8, 
    SETTINGS.RAND_COLOR.g / 8, 
    SETTINGS.RAND_COLOR.b / 8 
)

const CUBE_GEOMETRY = new ENGINE.Three.IcosahedronGeometry( SETTINGS.CUBESIZE, 0 )
const MATERIAL_NORMAL = new ENGINE.Three.MeshNormalMaterial()
const MATERIAL_COLORED = new ENGINE.Three.MeshPhongMaterial( { color: SETTINGS.RAND_COLOR } )
const TESTING = false

/**
 * Here we create our custom component. It will be a 9*9*9 grid of cube-shaped
 * meshes, giving us 729 draw calls per frame. Most low-end modern computers 
 * allow for this amount of draw calls before dipping below 60 FPS.
 */

class MeshBoxComponent extends ENGINE.ECS.Component {

    constructor ( proxy, material, scene ) {

        super( proxy )

        this.Group = new ENGINE.Three.Group()
        this.Material = material
        this.Position = new ENGINE.Three.Vector3()

        this.Range = new ENGINE.Three.Vector3(
            Dimensional.Utils.Math.random( 2, 4 ),
            Dimensional.Utils.Math.random( 2, 4 ),
            Dimensional.Utils.Math.random( 2, 4 )
        )

        this.Scene = scene

    }

    async onBuild () {

        for ( 
            let z = -SETTINGS.CUBEZ * SETTINGS.CUBESIZE; 
            z < SETTINGS.CUBEZ * SETTINGS.CUBESIZE; 
            z += SETTINGS.CUBESIZE * 2 
        ) {

            for ( 
                let y = -SETTINGS.CUBEY * SETTINGS.CUBESIZE; 
                y < SETTINGS.CUBEY * SETTINGS.CUBESIZE; 
                y += SETTINGS.CUBESIZE * 2 ) {

                for ( 
                    let x = -SETTINGS.CUBEX * SETTINGS.CUBESIZE; 
                    x < SETTINGS.CUBEX * SETTINGS.CUBESIZE; 
                    x += SETTINGS.CUBESIZE * 2 
                ) {

                    this.Position.set( x, y, z )

                    await ENGINE.Managers.ECS.assemble( 'Cube', this.Position, this.Material, this.Group )

                }

            }

        }

        this.Scene.add( this.Group )

    }

    async onRemoval () {

        this.Scene.remove( this.Group )

    }

    onAnimUpdate ( dT, eT ) {

        this.Group.scale.setScalar( Dimensional.Utils.Math.bob( eT, 4, 0 ) )

    }

    onUpdate ( dT, eT ) {

        this.Group.rotation.x += dT / this.Range.x 
        this.Group.rotation.z += dT / this.Range.z

    }

}

MeshBoxComponent.prototype.$name = 'MeshBox'

// Create assemblies

ENGINE.Managers.ECS.createAssembly( 'Camera', async ( e, params ) => {

    e.setName( 'Camera' )
    await e.addComponent( ENGINE.ECS.CameraComponent, params )

} )

ENGINE.Managers.ECS.createAssembly( 'Cube', async ( e, posVec, material, parent ) => {

    await e.addComponent( ENGINE.ECS.MeshComponent, CUBE_GEOMETRY, material )
    await e.addComponent( ENGINE.ECS.RandomRotateMeshComponent, 5 )

    const MESH_COMP = e.getComponent( 'Mesh' )
    MESH_COMP.Mesh.position.copy( posVec )
    MESH_COMP.addTo( parent )

} )

ENGINE.Managers.ECS.createAssembly( 'Light', async ( e, params ) => {

    e.setName( 'Light' )
    await e.addComponent( ENGINE.ECS.DirectionalLightComponent, params )

} )

ENGINE.Managers.ECS.createAssembly( 'Mesh Box', async ( e, material, scene ) => {

    e.setName( 'Mesh Box' )
    await e.addComponent( MeshBoxComponent, material, scene )

} )

// Build engine start method

ENGINE.onStart = async () => {

    // Build scene

    const SCENE1 = await ENGINE.Managers.Scene.buildScene( 'Main', { 
        background: BG_COLOR
    } )

    const SCENE2 = await ENGINE.Managers.Scene.buildScene( 'Colored', { 
        background: BG_COLOR
    } )

    // Assemble entities

    await ENGINE.Managers.ECS.assemble( 'Camera', {
        position: new ENGINE.Three.Vector3( 0, SETTINGS.CUBEY * SETTINGS.CAMERA_ZOOM_OUT_MULT * 10, 0 )
    } )

    const CAMERA = await ENGINE.Managers.ECS.assemble( 'Camera', {
        position: new ENGINE.Three.Vector3(
            SETTINGS.CUBEX * SETTINGS.CAMERA_ZOOM_OUT_MULT, 
            SETTINGS.CUBEY * SETTINGS.CAMERA_ZOOM_OUT_MULT,
            SETTINGS.CUBEZ * SETTINGS.CAMERA_ZOOM_OUT_MULT 
        )
    } )

    await ENGINE.Managers.ECS.assemble( 'Mesh Box', MATERIAL_NORMAL, SCENE1 )
    await ENGINE.Managers.ECS.assemble( 'Mesh Box', MATERIAL_COLORED, SCENE2 )

    await ENGINE.Managers.ECS.assemble( 'Light', {
        parent: SCENE2,
        position: new ENGINE.Three.Vector3( 100, 100, 100 ),
    } )

    // Build renderer and activate it

    await ENGINE.Managers.Renderer.buildRenderer( 'Main', SCENE2, CAMERA.call( 'Camera', 'getCamera' ) )
    await ENGINE.Managers.Renderer.Renderers.activate( 'Main' )

    ENGINE.Tools.RendererInterface.selectCamera( 'Camera#2' )
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