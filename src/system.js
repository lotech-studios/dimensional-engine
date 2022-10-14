
import * as THREE from 'three'
import * as ECS from './ecs'
import * as Utils from './util'

import * as ThreeNodes from 'three/examples/jsm/nodes/Nodes.js'

// Manager imports

import { ECSManager } from './managers/ECSManager.js'
import { InterfaceManager } from './managers/InterfaceManager.js'
import { RendererManager } from './managers/RendererManager.js'
import { CameraManager } from './managers/CameraManager.js'
import { SceneManager } from './managers/SceneManager.js'

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
        }

        this.Time = {
            delta: 0,
            elapsed: 0,
            last: 0,
        }

        // Defines etc.

        this.Three = THREE

        this.ECS = ECS

        this.Managers = {
            Camera: new CameraManager(),
            ECS: new ECSManager( this ),
            Interface: new InterfaceManager(),
            Renderer: new RendererManager( this ),
            Scene: new SceneManager(),
        }

        this.Tools = {
            ECSInterface: new ECSInterfaceTool( this ),
            RendererInterface: new RenderInterfaceTool( this ),
        }

        this.Utils = Utils

        this.ThreeNodes = ThreeNodes

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

                this.onRender()

                // Update ECS process
    
                this.Managers.ECS.update( this.Time.delta, this.Time.elapsed, this.updateAnim )
    
                // Update render process
    
                this.Managers.Renderer.update( this.Time.delta )
    
                if ( this.updateAnim ) this.updateAnim = false

                // Loop render process

                this.Tools.RendererInterface.end()

                this.render()

            } )
    
        }

    }

    async onStart ( engine = this ) { /** Stuff goes here */ }
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

        await this.buildEvents()
        await this.onStart( this )

        this.render()

    }

}

export { EngineSystem }