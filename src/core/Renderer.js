import * as ScriptUtils from '../util/script.js'
import * as THREE from '../../node_modules/three/build/three.module.js'
// import WebGPURenderer from '../../node_modules/three/examples/jsm/renderers/webgpu/WebGPURenderer.js'
import { Vector2 } from '../math/Vector2.js'

class Renderer {

    constructor ( manager, scene, camera, params = {} ) {

        // Argument based variables

        this.active = ScriptUtils.checkParam( params, 'active', true )
        this.useWebGPU = ScriptUtils.checkParam( params, 'active', false )  
        this.name = ScriptUtils.checkParam( params, 'name', `renderer#${ Renderer.prototype.$num }` )
        this.pointerEvents = ScriptUtils.checkParam( params, 'pointerEvents', 'all' )

        this.Manager = manager

        // Non-nested variables

        this.dbp = [] // depth based pass

        // Storage tables
        
        this.DBM = ScriptUtils.createStorageTable() // depth based meshes

        // Objects

        this.Camera = camera
        this.Scene = scene

        // Build settings for renderer

        this.Settings = {
            postProcessing: ScriptUtils.checkParam( params, 'postProcessing', false ),

            Size: new Vector2( 
                ScriptUtils.checkParam( params, 'width', 'window-x' ), 
                ScriptUtils.checkParam( params, 'height', 'window-y' )
            ),
        }

        // Materials and such

        this.Materials = {
            Depth: new THREE.MeshDepthMaterial()
        }

        this.Materials.Depth.depthPacking = THREE.RGBADepthPacking
        this.Materials.Depth.blending = THREE.NoBlending 

        // Update renderer count

        Renderer.prototype.$num++

    }

    async addDepthBasedPass ( pc, ...pcArgs ) {

        this.dbp.push( new pc( this, ...pcArgs ) )

    }

    append ( element ) {

        element.appendChild( this.Renderer.domElement )

    }

    async onBuild () {

        // Initialize renderer

        this.Renderer = this.useWebGPU ? new WebGPURenderer() : new THREE.WebGLRenderer()
        this.Renderer.setPixelRatio( window.devicePixelRatio )
        this.Renderer.active = this.active
        this.Renderer.name = this.name
        this.Renderer.domElement.style.pointerEvents = this.pointerEvents
        
        // Sizing and targets

        const PXLRATIO = this.Renderer.getPixelRatio()
        const SIZEX = this.Settings.Size.getEquivalent( 'x' )
        const SIZEY = this.Settings.Size.getEquivalent( 'y' )
        const TARGSIZEX = SIZEX * PXLRATIO
        const TARGSIZEY = SIZEY * PXLRATIO

        this.Targets = {
            Color: new THREE.WebGLRenderTarget( TARGSIZEX, TARGSIZEY ),
            Depth: new THREE.WebGLRenderTarget( TARGSIZEX, TARGSIZEY, {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter
            } ),
        }

        this.resize()
        
        this.Manager.Engine.Managers.Interface.getState( 'Rendering' ).byName()
            .appendChild( this.Renderer.domElement )

        if ( this.useWebGPU ) return this.Renderer.init()

    }

    async removeDepthBasedMesh ( uuid ) {

        if ( RENDERER.DBM.check( uuid ).byUUID() ) {

            RENDERER.DBM.remove( uuid ).byUUID()

        }

    }

    render ( deltaTime ) {

        if ( this.Settings.postProcessing ) this.Composer.render( deltaTime )
        else this.Renderer.render( this.Scene, this.Camera )

    }

    resize () {

        const PXLRATIO = this.Renderer.getPixelRatio()
        const SIZEX = this.Settings.Size.getEquivalent( 'x' )
        const SIZEY = this.Settings.Size.getEquivalent( 'y' )
        const TARGSIZEX = SIZEX * PXLRATIO
        const TARGSIZEY = SIZEY * PXLRATIO

        this.Renderer.setSize( SIZEX, SIZEY )
        this.Targets.Color.setSize( TARGSIZEX, TARGSIZEY )
        this.Targets.Depth.setSize( TARGSIZEX, TARGSIZEY )

        this.updateCamera()

    }

    setCamera ( camera ) {

        this.Camera = camera

        this.updateCamera()

    }

    setScene ( scene ) {

        this.Scene = scene

    }

    updateCamera () {

        const SIZEX = this.Settings.Size.getEquivalent( 'x' )
        const SIZEY = this.Settings.Size.getEquivalent( 'y' )

        this.Camera.aspect = SIZEX / SIZEY
        this.Camera.updateProjectionMatrix()

    }

}

Renderer.prototype.$num = 0
Renderer.prototype.isRenderer = true

export { Renderer }