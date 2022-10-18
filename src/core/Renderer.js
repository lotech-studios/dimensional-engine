import * as PostProcessing from '../postprocessing'
import * as ScriptUtils from '../util/script.js'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { Vector2 } from '../math/Vector2.js'

class Renderer {

    constructor ( manager, scene, camera, params = {} ) {

        // Argument based variables

        this.active = ScriptUtils.checkParam( params, 'active', true )  
        this.name = ScriptUtils.checkParam( params, 'name', `renderer#${ Renderer.prototype.$num }` )
        this.pointerEvents = ScriptUtils.checkParam( params, 'pointerEvents', 'all' )

        this.Camera = camera
        this.Manager = manager
        this.Scene = scene

        // Storage tables
        
        this.DBM = ScriptUtils.createStorageTable() // depth based meshes

        // Objects
        
        this.Passes = {}

        // Build settings for renderer

        this.Settings = {
            postProcessing: ScriptUtils.checkParam( params, 'postProcessing', true ),

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

        // Initialize renderer

        this.Renderer = new THREE.WebGLRenderer()
        this.Renderer.setPixelRatio( window.devicePixelRatio )
        this.Renderer.active = this.active
        this.Renderer.outputEncoding = THREE.sRGBEncoding
        this.Renderer.name = this.name
        this.Renderer.domElement.style.pointerEvents = this.pointerEvents
        this.Renderer.gammaOutput = 2.2
        
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

        // composer

        this.Composer = new EffectComposer( this.Renderer )

        this.addPass( 'Render', new PostProcessing.RenderPass( this ) )
        this.addPass( 'Gamma', new ShaderPass( GammaCorrectionShader ) )
        this.addPass( 'SceneDepth', new PostProcessing.SceneDepthPass( this ) )
        this.addPass( 'Bokeh', new PostProcessing.BokehPass( this, {} ) )
        

        // Update renderer count

        Renderer.prototype.$num++

    }

   async addDepthBasedMesh ( mesh ) {

        this.DBM.add( mesh )

    }

    addPass ( name, pass ) {

        this.Passes[ name ] = pass

        this.Composer.addPass( this.Passes[ name ] )

    }

    append ( element ) {

        element.appendChild( this.Renderer.domElement )

    }

    async removeDepthBasedMesh ( uuid ) {

        if ( this.DBM.check( uuid ).byUUID() ) {

            this.DBM.remove( uuid ).byUUID()

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