import * as MathUtils from './util/math.js'
import * as ScriptUtils from './util/script.js'
import * as THREE from 'three'

// ECS imports

import { ECSComponent } from './ecs/ECSComponent.js'
import { ECSEntity } from './ecs/ECSEntity.js'

import { CameraComponent } from './ecs/components/CameraComponent.js'

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
            animUpdateInterval: ScriptUtils.checkParam( params, 'animUpdateInterval', 60 ),
            toolsShowing: ScriptUtils.checkParam( params, 'toolsShowing', false ),
        }

        this.Time = {
            delta: 0,
            elapsed: 0,
            last: 0,
        }

        // Defines etc.

        this.Three = THREE

        this.ECS = {
            Component: ECSComponent,
            Entity: ECSEntity,

            Components: {
                Camera: CameraComponent,
            },
        }

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

        this.Utils = {
            Math: MathUtils,
            Script: ScriptUtils,
        }

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

                // Loop render process

                this.Tools.RendererInterface.end()

                this.render()

            } )
    
        }

    }

    async onStart ( engine = this ) { /** Stuff goes here */ }

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

        if ( this.Settings.toolsShowing ) {

            for ( const t in this.Tools ) {

                if ( t.includes( 'Interface' ) ) this.Tools[ t ].hide()

            }

            this.Settings.toolsShowing = false

        } else {

            for ( const t in this.Tools ) {

                if ( t.includes( 'Interface' ) ) this.Tools[ t ].show()

            }

            this.Settings.toolsShowing = true
        }

    }

    async start () {

        await this.buildEvents()
        await this.onStart( this )

        this.render()

    }

}

export { EngineSystem }