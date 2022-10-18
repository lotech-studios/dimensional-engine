import {
	MeshDepthMaterial,
	NoBlending,
	RGBADepthPacking,
	ShaderMaterial,
	UniformsUtils,
    Vector3,
} from 'three'
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'
import { BokehShader } from 'three/examples/jsm/shaders/BokehShader.js'

/**
 * Depth-of-field post-process with bokeh shader
 */

class BokehPass extends Pass {

	constructor ( renderer, params ) {

		super()

        this.Renderer = renderer

		const focus = ( params.focus !== undefined ) ? params.focus : 1.0
		const aspect = ( params.aspect !== undefined ) ? params.aspect : this.Renderer.Camera.aspect
		const aperture = ( params.aperture !== undefined ) ? params.aperture : 0.0125
		const maxblur = ( params.maxblur !== undefined ) ? params.maxblur : 1.0

		// depth material

		this.materialDepth = new MeshDepthMaterial()
		this.materialDepth.depthPacking = RGBADepthPacking
		this.materialDepth.blending = NoBlending

		// bokeh material

		if ( BokehShader === undefined ) {

			console.error( 'THREE.BokehPass relies on BokehShader' )

		}

		const bokehShader = BokehShader
		const bokehUniforms = UniformsUtils.clone( bokehShader.uniforms )

		bokehUniforms[ 'tDepth' ].value = this.Renderer.Targets.Depth.texture

		bokehUniforms[ 'focus' ].value = focus
		bokehUniforms[ 'aspect' ].value = aspect
		bokehUniforms[ 'aperture' ].value = aperture
		bokehUniforms[ 'maxblur' ].value = maxblur
		bokehUniforms[ 'nearClip' ].value = this.Renderer.Camera.near
		bokehUniforms[ 'farClip' ].value = this.Renderer.Camera.far

		this.materialBokeh = new ShaderMaterial( {
			defines: Object.assign( {}, bokehShader.defines ),
			uniforms: bokehUniforms,
			vertexShader: bokehShader.vertexShader,
			fragmentShader: bokehShader.fragmentShader
		} )

		this.uniforms = bokehUniforms
		this.needsSwap = false

		this.fsQuad = new FullScreenQuad( this.materialBokeh )

	}

	render ( renderer, readBuffer/*, deltaTime, maskActive*/ ) {

		// Render bokeh composite

		if ( this.Renderer.Camera.Intersect ) {

			this.uniforms[ 'focus' ].value = this.Renderer.Camera.Intersect.distance

		}

		this.uniforms[ 'tColor' ].value = readBuffer.texture
		
		this.fsQuad.render( renderer )

	}

}

export { BokehPass }