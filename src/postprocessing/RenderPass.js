import { Pass } from 'three/examples/jsm/postprocessing/Pass.js'

class RenderPass extends Pass {

	constructor ( renderer ) {

		super()

		this.Renderer = renderer

		this.clear = true
		this.clearDepth = false
		this.needsSwap = false

	}

	render ( webGLRenderer, writeBuffer, readBuffer ) {

		webGLRenderer.setRenderTarget( this.renderToScreen ? null : readBuffer )

		webGLRenderer.clear( webGLRenderer.autoClearColor, webGLRenderer.autoClearDepth, webGLRenderer.autoClearStencil )
		webGLRenderer.render( this.Renderer.Scene, this.Renderer.Camera )

	}

}

export { RenderPass }