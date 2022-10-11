import * as RendererUtils from '../util/renderers.js'
import * as ScriptUtils from '../util/script.js'
import * as THREE from '../../node_modules/three/build/three.module.js'
import { Renderer } from '../core/Renderer.js'

class RendererManager {

    constructor ( engine ) {

        this.Engine = engine
        this.Renderers = new RendererUtils.RendererStorageTable()

        this.Settings = {
            PostProcessing: {
                enabled: true,
            },
            Shadows: {
                enabled: true,
                
                Map: {
                    type: THREE.BasicShadowMap,
                },
            },
        }

    }

    async addDepthBasedMesh ( rendererName, mesh ) {

        const RENDERER = this.Renderers.get( rendererName )

        await RENDERER.addDepthBasedMesh( mesh )

    }

    async addDepthBasedPass ( rendererName, pc, ...pcArgs ) {

        const RENDERER = this.Renderers.get( rendererName )

        await RENDERER.addDepthBasedPass( pc, ...pcArgs )

    }

    async removeDepthBasedMesh ( rendererName, mesh ) {

        const RENDERER = this.Renderers.get( rendererName )

        await RENDERER.removeDepthBasedMesh( mesh.uuid )

    }

    async buildRenderer ( name, scene, camera, params = {} ) {

        console.log( scene )
        console.log( camera )

        const RENDERER = new Renderer( this, scene, camera, params )
        RENDERER.append( document.body )

        this.Renderers.add( name, RENDERER )

        console.log( this.Engine )

        this.Engine.Tools.RendererInterface.selectRenderer( name )
        this.Engine.Tools.RendererInterface.refreshRendererList()

    }

    get ( name ) {

        return this.Renderers.get( name )

    }

    resize () {

        for ( const r in this.Renderers.Collection ) {

            this.Renderers.Collection[ r ].resize()

        }

    }

    update ( deltaTime ) {

        for ( let i of this.Renderers.active ) {

            this.Renderers.Collection[ i ].render( deltaTime )

        }

    }

}

export { RendererManager }