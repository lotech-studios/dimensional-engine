import { Pass } from '../libs/three/examples/postprocessing/Pass.js'

/**
 * Depth-of-field post-process with bokeh shader
 */

class SceneDepthPass extends Pass {

	constructor ( renderer ) {

		super()

        this.Renderer = renderer

	}

	render ( webGLRenderer, writeBuffer, readBuffer/*, deltaTime, maskActive*/ ) {

        for ( let i of this.Renderer.DBM.array ) i.visible = false

		// Render depth into texture

		this.Renderer.Scene.overrideMaterial = this.Renderer.Materials.Depth

		webGLRenderer.setClearColor( 0xffffff )
		webGLRenderer.setClearAlpha( 1.0 )
		webGLRenderer.setRenderTarget( this.Renderer.Targets.Depth )
		webGLRenderer.clear()
		webGLRenderer.render( this.Renderer.Scene, this.Renderer.Camera )

		webGLRenderer.setRenderTarget( null )

        for ( let i of this.Renderer.dbp ) i.render( webGLRenderer, readBuffer )
		for ( let i of this.Renderer.DBM.array ) i.visible = true

		this.Renderer.Scene.overrideMaterial = null

	}

}

export { SceneDepthPass }