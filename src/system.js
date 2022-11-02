import * as DB from './database'
import * as THREE from 'three'
import * as ECS from './ecs'
import * as Utils from './util'

// Manager imports

import * as Managers from './managers'

// Tool imports

import { ECSInterfaceTool } from './tools/ECSInterfaceTool.js'
import { RenderInterfaceTool } from './tools/RendererInterfaceTool.js'

class EngineSystem {

    constructor ( params = {} ) {

        this.updateAnim = false

        // Initial objects

        this.Clock = new THREE.Clock()

        this.Settings = {
            animUpdateInterval: Utils.Script.checkParam( params, 'animUpdateInterval', 60 ),
            devToolsShowing: Utils.Script.checkParam( params, 'devToolsShowing', false ),
            physicsEnabled: Utils.Script.checkParam( params, 'physicsEnabled', true )
        }

        this.Time = {
            delta: 0,
            elapsed: 0,
            last: 0,
        }

        // Defines etc.

        this.ECS = ECS
        this.Three = THREE
        this.Utils = Utils

        this.Managers = {
            Camera: new Managers.CameraManager( this ),
            ECS: new Managers.ECSManager( this ),
            Input: new Managers.InputManager( this ),
            Interface: new Managers.InterfaceManager(),
            Materials: new Managers.MaterialManager( this ),
            Models: new Managers.ModelManager( this ),
            Physics: new Managers.PhysicsManager( this ),
            Renderer: new Managers.RendererManager( this ),
            Scene: new Managers.SceneManager( this ),
            Textures: new Managers.TextureManager( this ),
        }

        this.Tools = {
            ECSInterface: new ECSInterfaceTool( this ),
            RendererInterface: new RenderInterfaceTool( this ),
        }

        this.Input = this.Managers.Input

        // Render method

        this.render = () => {
    
            requestAnimationFrame( ( timeNow ) => {

                this.Tools.RendererInterface.begin()

                this.Time.delta = this.Clock.getDelta()
                this.Time.elapsed = this.Clock.getElapsedTime()

                if ( !this.Time.last || timeNow - this.Time.last >= 1000 / ( this.Settings.animUpdateInterval + 1 ) ) {
    
                    this.Time.last = timeNow
                    this.updateAnim = true
    
                }

                // Update ECS process
    
                this.Managers.ECS.update( this.Time.delta, this.Time.elapsed, this.updateAnim )
    
                // Update render process
    
                this.Managers.Renderer.update( this.Time.delta )
    
                if ( this.updateAnim ) this.updateAnim = false

                this.onRender()

                // Loop render process

                this.Tools.RendererInterface.end()

                this.Managers.Input.update()

                this.render()

            } )
    
        }

    }

    async onBeforeLoad ( engine = this ) { /** Stuff goes here */ }
    async onLoaded ( engine = this ) { /** Stuff goes here */ }

    onRender () {}

    async buildEvents () {

        window.addEventListener( 'resize', () => {

            this.Managers.Renderer.resize()

        } )

        window.addEventListener( 'keyup', ( e ) => {

            switch ( e.key ) {

                case 'F9':

                    this.toggleTools()

                    break

            }

        } )

    }

    toggleTools () {

        if ( this.Settings.devToolsShowing ) {

            this.Managers.Interface.getState( 'Dev' ).byName().hide()

            this.Settings.devToolsShowing = false

        } else {

            this.Managers.Interface.getState( 'Dev' ).byName().show()

            this.Settings.devToolsShowing = true

        }

    }

    async start () {

        // check if physics is enabled for this instance

        if ( this.Settings.physicsEnabled ) {

            await this.Managers.Physics.init()

        }

        // load everything in order after dependencies are checked

        await this.onBeforeLoad( this )

        await this.Managers.Textures.loadStartBatch()
        await this.Managers.Materials.loadStartBatch()

        await this.buildEvents()
        await this.onLoaded( this )

        //

        this.render()

    }

}

export { EngineSystem }