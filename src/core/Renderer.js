import * as ScriptUtils from '../util/script.js'
import * as THREE from '../../node_modules/three/build/three.module.js'
import { Vector2 } from '../math/Vector2.js'

class Renderer {

    constructor ( manager, scene, camera, params = {} ) {

        // Argument based variables

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

        // Initialize renderer

        this.Renderer = new THREE.WebGLRenderer()
        this.Renderer.active = ScriptUtils.checkParam( params, 'active', true )
        this.Renderer.name = ScriptUtils.checkParam( params, 'name', `renderer#${ Renderer.prototype.$num }` )
        this.Renderer.domElement.style.pointerEvents = ScriptUtils.checkParam( params, 'pointerEvents', 'all' )
        this.Renderer.shadowMap.enabled = ScriptUtils.checkParam( params, 'enableShadows', true )
        this.Renderer.shadowMap.type = ScriptUtils.checkParam( params, 'shadowMapType', THREE.BasicShadowMap )

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

        // Update renderer count

        Renderer.prototype.$num++

    }

    async addDepthBasedPass ( pc, ...pcArgs ) {

        this.dbp.push( new pc( this, ...pcArgs ) )

    }

    append ( element ) {

        element.appendChild( this.Renderer.domElement )

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