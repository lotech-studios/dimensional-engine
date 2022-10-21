import * as Constants from './constants.js'
import * as PostProcessing from '../postprocessing'
import * as ScriptUtils from '../util/script.js'
import * as THREE from 'three'
import CSM from 'three-csm/src/CSM.js'
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
            shadowsEnabled: ScriptUtils.checkParam( params, 'shadowsEnabled', true ),
            shadowType: ScriptUtils.checkParam( params, 'shadowType', THREE.PCFSoftShadowMap ),

            Size: new Vector2( 
                ScriptUtils.checkParam( params, 'width', 'window-x' ), 
                ScriptUtils.checkParam( params, 'height', 'window-y' )
            ),

            CSM: {
                enabled: true,

                cascades: 3,
                fade: true,
                lightDirection: new THREE.Vector3( 1, -1, 1 ).normalize(),
                lightFar: 5000,
	            lightNear: 0.1,
                maxFar: 10,
	            shadowBias: 0,
                shadowMapSize: 2048,
                splitsCallback: Constants.CSM_SPLITS_CALLBACK,
            }
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
        this.Renderer.shadowMap.enabled = this.Settings.shadowsEnabled
        this.Renderer.shadowMap.type = this.Settings.shadowType

        if ( this.Settings.CSM.enabled ) {

            this.CSM = new CSM( {
                maxFar: this.Settings.CSM.maxFar,
                cascades: this.Settings.CSM.cascades,
                shadowMapSize: this.Settings.CSM.shadowMapSize,
                lightDirection: this.Settings.CSM.shadowMapSize.lightDirection,
                camera: this.Camera,
                parent: this.Scene,
                mode: 'custom',
                customSplitsCallback: this.Settings.CSM.splitsCallback,
                lightFar: this.Settings.CSM.lightFar,
                lightNear: this.Settings.CSM.lightNear,
                shadowBias: this.Settings.CSM.shadowBias,
            } )
    
            this.CSM.fade = this.Settings.CSM.fade

            for ( const m in this.Manager.Engine.Managers.Materials.Materials ) {

                const MATERIAL = this.Manager.Engine.Managers.Materials.Materials[ m ]

                if ( MATERIAL.csm ) this.setupCSMMaterial( MATERIAL )

            }

        }
        
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

        if ( this.Settings.CSM.enabled ) this.CSM.update( this.Camera.matrix )

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

    setupCSMMaterial ( material ) {

        if ( this.Settings.CSM.enabled ) this.CSM.setupMaterial( material )

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