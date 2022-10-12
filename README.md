# Dimensional Engine

[![NPM Package][npm]][npm-url]

#### JavaScript 3D engine

Developed by [Nikolas Karinja](http://nikolaskarinja.com/)

The aim was to create a simple yet capable 3D game engine. It is an Entity Component System based game engine, written in JavaScript, and has [Three.js](https://www.npmjs.com/package/three) built in to it. You get all the functionalities of [Three.js](https://www.npmjs.com/package/three) but with pipeline of a game engine. I will admit, it's "functionality" was based on my needs for creating my games. 

## Installation

### npm

```
npm i --save dimensional-engine
```

### Script

```html
<script type='text/javascript' src='node_modules/dimensional-engine/build/dimensional-engine.var.js'></script>
```

### Script (ES6 Module)

```html
<script type='text/javascript' src='node_modules/dimensional-engine/build/dimensional-engine.esm.js'></script>
```

Keep in mind, the engine is built on ES6 and Node modules.

## Usage

- This version utilizes [`three@0.145.0`](https://github.com/mrdoob/three.js)
- Allows for dynamic building and updating components.
- Components can update either frame-based or interval-based (seperate and simultaneously).
- Everything built with the engine gets stored in the engine, allowing for easy and automatic access.
- Unless it is disabled, by pressing the **F9** key, you can access many tools/interfaces for managing and view the data of your program or game.
- Everything is designed to be built asynchronously, allowing for smooth error-less loading and creation.

#### Example

Here is program in which we create our custom component class, some entity assemblies, a basic scene and camera, a simple renderer, and tie that all together.

```javascript
import * as Dimensional from 'dimensional-engine'

// Define engine constant

const ENGINE = new Dimensional.System()

// Some constants need for this program

const SETTINGS = {
    CAMERA_ZOOM_OUT_MULT: 5,
    CUBESIZE: 1,
    CUBEX: 9,
    CUBEY: 9,
    CUBEZ: 9,
}

const CUBE_GEOMETRY = new ENGINE.Three.BoxGeometry( SETTINGS.CUBESIZE, SETTINGS.CUBESIZE, SETTINGS.CUBESIZE )
const MATERIAL = new ENGINE.Three.MeshNormalMaterial()
const TESTING = true

/**
 * Here we create our custom component. It will be a 9*9*9 grid of cube-shaped
 * meshes, giving us 729 draw calls per frame. Most low-end modern computers 
 * allow for this amount of draw calls before dipping below 60 FPS.
 */

class MeshBoxComponent extends ENGINE.ECS.Component {

    constructor ( proxy, scene ) {

        super( proxy )

        this.Group = new ENGINE.Three.Group()
        this.Position = new ENGINE.Three.Vector3()
        this.Scene = scene

    }

    async onBuild () {

        for ( let z = -SETTINGS.CUBEZ; z < SETTINGS.CUBEZ; z += SETTINGS.CUBESIZE * 2 ) {

            for ( let y = -SETTINGS.CUBEY; y < SETTINGS.CUBEY; y += SETTINGS.CUBESIZE * 2 ) {

                for ( let x = -SETTINGS.CUBEX; x < SETTINGS.CUBEX; x += SETTINGS.CUBESIZE * 2 ) {

                    this.Position.set( x, y, z )

                    await ENGINE.Managers.ECS.assemble( 'Cube', this.Position, this.Group )

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

        this.Group.rotation.x += dT / 2
        this.Group.rotation.z += dT / 2

    }

}

MeshBoxComponent.prototype.$name = 'MeshBox'

// Create assemblies

ENGINE.Managers.ECS.createAssembly( 'Camera', async ( e, params ) => {

    e.setName( 'Camera' )
    await e.addComponent( ENGINE.ECS.CameraComponent, params )

} )

ENGINE.Managers.ECS.createAssembly( 'Cube', async ( e, posVec, parent ) => {

    await e.addComponent( ENGINE.ECS.MeshComponent, CUBE_GEOMETRY, MATERIAL )

    const MESH_COMP = e.getComponent( 'Mesh' )
    MESH_COMP.Mesh.position.copy( posVec )
    MESH_COMP.addTo( parent )

} )

ENGINE.Managers.ECS.createAssembly( 'Mesh Box', async ( e, scene ) => {

    e.setName( 'Mesh Box' )
    await e.addComponent( MeshBoxComponent, scene )

} )

// Build engine start method

ENGINE.onStart = async () => {

    // Build scene

    const SCENE = await ENGINE.Managers.Scene.buildScene( 'Main' )

    // Assemble entities

    const CAMERA = await ENGINE.Managers.ECS.assemble( 'Camera', {
        position: new ENGINE.Three.Vector3(
            SETTINGS.CUBEX * SETTINGS.CAMERA_ZOOM_OUT_MULT, 
            SETTINGS.CUBEY * SETTINGS.CAMERA_ZOOM_OUT_MULT,
            SETTINGS.CUBEZ * SETTINGS.CAMERA_ZOOM_OUT_MULT 
        )
    } )

    await ENGINE.Managers.ECS.assemble( 'Mesh Box', SCENE )

    // Build renderer and activate it

    await ENGINE.Managers.Renderer.buildRenderer( 'Main', SCENE, CAMERA.call( 'Camera', 'getCamera' ) )
    await ENGINE.Managers.Renderer.Renderers.activate( 'Main' )

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
```

[npm]: https://shields.io/npm/v/dimensional-engine
[npm-url]: https://www.npmjs.com/package/dimensional-engine