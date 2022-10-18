import * as THREE from 'three'
import * as Utils from '../util'
import * as Vertexes from './vertex'

class LinkedPlaneGeometry extends THREE.BufferGeometry {

	constructor ( width = 1, height = 1, widthSegments = 1, heightSegments = 1 ) {

		super()

		this.type = 'TerrainPlaneGeometry'

		this.parameters = {
			width: width,
			height: height,
			widthSegments: widthSegments,
			heightSegments: heightSegments
		}

        this.Vertices = {
            indexed: [],
            XY: {},
        }

        let xList = []
        let yList = []

        const XY = {}

		const width_half = width / 2
		const height_half = height / 2

		const gridX = Math.floor( widthSegments )
		const gridY = Math.floor( heightSegments )

		const gridX1 = gridX + 1
		const gridY1 = gridY + 1

		const segment_width = width / gridX
		const segment_height = height / gridY

		//

		const indices = []
		const vertices = []
		const normals = []
		const uvs = []

		for ( let iy = 0; iy < gridY1; iy ++ ) {

			const y = iy * segment_height - height_half

			for ( let ix = 0; ix < gridX1; ix ++ ) {

				const x = ix * segment_width - width_half
                const ny = - y

				vertices.push( x, - y, 0 )

                const tx = Number( x.toFixed( 4 ) )
                const ty = Number( ny.toFixed( 4 ) )
                const xyString = `${ tx },${ ty }`
    
                if ( !xList.includes( tx ) ) xList.push( tx )
                if ( !yList.includes( ty ) ) yList.push( ty )
    
                if ( !XY[ xyString ] ) XY[ xyString ] = []
    
                XY[ xyString ].push( ( iy * gridX1 ) + ix )

				normals.push( 0, 0, 1 )

				uvs.push( ix / gridX )
				uvs.push( 1 - ( iy / gridY ) )

			}

		}

		for ( let iy = 0; iy < gridY; iy ++ ) {

			for ( let ix = 0; ix < gridX; ix ++ ) {

				const a = ix + gridX1 * iy
				const b = ix + gridX1 * ( iy + 1 )
				const c = ( ix + 1 ) + gridX1 * ( iy + 1 )
				const d = ( ix + 1 ) + gridX1 * iy

				if ( iy % 2 == 0 ) {

                    if ( ix % 2 == 0 ) {

                        indices.push( a, b, d )
                        indices.push( b, c, d )

                    } else {

                        indices.push( a, b, c )
                        indices.push( a, c, d )

                    }

                } else {

                    if ( ix % 2 != 0 ) {

                        indices.push( a, b, d )
                        indices.push( b, c, d )

                    } else {

                        indices.push( a, b, c )
                        indices.push( a, c, d )

                    }

                }

			}

		}

        xList = Utils.Array.sortLowestToHighest( xList )
        yList = Utils.Array.sortLowestToHighest( yList )

        for ( let ly = 0; ly < yList.length; ly++ ) {

            for ( let lx = 0; lx < xList.length; lx++ ) {

                const lxyString = `${ xList[ lx ] },${ yList[ ly ] }`
                const n = ( ly * xList.length ) + lx

                const Vertex = new Vertexes.LinkedVertex( this, xList[ lx ], yList[ ly ] )
                Vertex.addIndex( ...XY[ lxyString ] )

                this.Vertices.indexed.push( Vertex )
                this.Vertices.XY[ lxyString ] = n

            }

        }

		this.setIndex( indices )
		this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) )
		this.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) )
		this.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) )

	}

	static fromJSON ( data ) {

		return new TerrainPlaneGeometry( data.width, data.height, data.widthSegments, data.heightSegments )

	}

    lowerVertex ( x, y, increment ) {

        const index = this.Vertices.XY[ `${ x },${ y }` ]

        this.Vertices.indexed[ index ].lower( increment )
        this.attributes.position.needsUpdate = true
        this.computeVertexNormals()
        this.computeFaceNormals()

    }

    raiseVertex ( x, y, increment ) {

        const index = this.Vertices.XY[ `${ x },${ y }` ]

        this.Vertices.indexed[ index ].raise( increment )
        this.attributes.position.needsUpdate = true
        this.computeVertexNormals()
        this.computeFaceNormals()

    }

    setVertexHeight ( x, y, height ) {

        const index = this.Vertices.XY[ `${ x },${ y }` ]

        this.Vertices.indexed[ index ].setHeight( height )
        this.attributes.position.needsUpdate = true
        this.computeVertexNormals()
        this.computeFaceNormals()

    }

    setVertexHeightIX ( index, height ) {

        this.Vertices.indexed[ index ].setHeight( height )
        this.attributes.position.needsUpdate = true
        this.computeVertexNormals()
        this.computeFaceNormals()

    }

}

LinkedPlaneGeometry.prototype.isLinkedPlaneGeometry = true

export { LinkedPlaneGeometry }