import * as Geometries from '../../geometries'
import * as THREE from 'three'
import * as Utils from '../../util'
import { ECSComponent } from '../ECSComponent.js'
import { SimplexNoise } from 'simplex-noise-esm'

class TerrainChunk {

    constructor ( proxy, x, y ) {

        this.simplexSX = x
        this.simplexSY = y

        this.Proxy = proxy

        this.Geometry = new Geometries.SimplexPlaneGeometry(
            this.Proxy.chunkSize, this.Proxy.chunkSize,
            this.Proxy.chunkSegments, this.Proxy.chunkSegments,

            this.Proxy.flat,

            this.Proxy.Simplex, this.simplexSX, this.simplexSY, 
            this.Proxy.chunkSimplexRangeX, this.Proxy.chunkSimplexRangeY, 
            this.Proxy.chunkSimplexAmp, 
            
            this.Proxy.peakAmp, this.Proxy.peakStartHeight,

            this.Proxy.seaLevel
        ).toNonIndexed()

        this.Geometry.computeVertexNormals()

        this.Mesh = new THREE.Mesh( this.Geometry, this.Proxy.Material )
        this.Mesh.position.set( x, 0, y )
        this.Mesh.rotateX( Math.PI / -2 )
        this.Mesh.receiveShadow = true

        this.Proxy.chunks.push( this )
        this.Proxy.chunkMeshes.push( this.Mesh )
        this.Proxy.Groups.Ground.add( this.Mesh )

    }

}

class TerrainComponent extends ECSComponent {

    constructor ( proxy, parent, params = {} ) {

        super( proxy )

        this.chunkMeshes = []
        this.chunkSegments = Utils.Script.checkParam( params, 'chunkSegments', 32 )
        this.chunkSimplexAmp = Utils.Script.checkParam( params, 'chunkSimplexAmp', 0.75 )
        this.chunkSimplexRangeX = Utils.Script.checkParam( params, 'chunkSimplexRangeX', 0.125 )
        this.chunkSimplexRangeY = Utils.Script.checkParam( params, 'chunkSimplexRangeY', 0.125 )
        this.chunkSize = Utils.Script.checkParam( params, 'chunkSize', 1 )
        this.chunks = []
        this.chunksX = Utils.Script.checkParam( params, 'chunksX', 5 )
        this.chunksXSize = this.chunksX * this.chunkSize
        this.chunksY = Utils.Script.checkParam( params, 'chunksY', 5 )
        this.chunksYSize = this.chunksY * this.chunkSize
        this.flat = Utils.Script.checkParam( params, 'flat', false )
        this.peakAmp = Utils.Script.checkParam( params, 'peakAmp', 0.05 )
        this.peakStartHeight = Utils.Script.checkParam( params, 'peakStartHeight', 0.45 )
        this.seaLevel = Utils.Script.checkParam( params, 'seaLevel', 0.5 )
        this.underWaterOffset = Utils.Script.checkParam( params, 'underWaterOffset', 0.01 )
        this.vertexColoring = Utils.Script.checkParam( params, 'vertexColoring', true )

        this.Colors = {
            Mountain: [ 
                new THREE.Color( 0x4a4a4a ), 
                new THREE.Color( 0x666666 ),
                new THREE.Color( 0x787878 )
            ],
            Grass: {
                Dry: [
                    new THREE.Color( 0x6da300 ),
                    new THREE.Color( 0x619100 ),
                    new THREE.Color( 0x558000 )
                ],
                Wet: [
                    new THREE.Color( 0x1b3d00 ),
                    new THREE.Color( 0x224d00 ),
                    new THREE.Color( 0x2a5e00 )
                ],
            },
            Sand: [
                new THREE.Color( 0xc7ba4a )
            ],
            Snow: [
                new THREE.Color( 0xffffff )
            ],
        }

        this.Material = Utils.Script.checkParam( params, 'material', 
            new THREE.MeshPhongMaterial( {
                shininess: 0,
                vertexColors: true,
            } ) 
        )

        this.Parent = parent
        this.Simplex = new SimplexNoise()

        this.Groups = {
            Ground: new THREE.Group(),
            Water: new THREE.Group(),
        }

        this.addGroups()

    }

    addGroups () {

        for ( const g in this.Groups ) {

            this.Parent.add( this.Groups[ g ] )

        }

    }

    async buildChunks () {

        const XSE = ( this.chunksXSize / 2 ) + this.chunkSize
        const XSS = ( this.chunksXSize / -2 ) + this.chunkSize
        const YSE = ( this.chunksYSize / 2 ) + this.chunkSize
        const YSS = ( this.chunksYSize / -2 ) + this.chunkSize

        for ( let y = YSS; y < YSE; y++ ) {

            for ( let x = XSS; x < XSE; x++ ) {

                const CHUNK = new TerrainChunk( this, x, y )

            }

        }

    }

    async buildGroups () {

        this.chunkMeshes.length = 0
        this.chunks.length = 0

        for ( const g in this.Groups ) {

            this.Groups[ g ].children.length = 0

        }

    }

    async buildWater ( renderer ) {

        // water shader for later

        // uniform float amount;
        //         uniform float time;

        //         float generateOffset(float x, float z, float val1, float val2, float time) {
                    
        //             float speed = 0.25;
                    
        //             float radiansX = ((mod(x + z * x * val1, amount) / amount) + (time * speed) * mod(x * 0.8 + z, 1.5)) * 2.0 * 3.14;
        //             float radiansZ = ((mod(val2 * (z * x + x * z), amount) / amount) + (time * speed) * 2.0 * mod(x, 2.0)) * 2.0 * 3.14;
                    
        //             return amount * 0.5 * (sin(radiansZ) + cos(radiansX));

        //         }
                
        //         vec3 applyDistortion(vec3 vertex, float time) {

        //             float xd = generateOffset(vertex.x, vertex.y, 0.2, 0.1, time);
        //             float yd = generateOffset(vertex.x, vertex.y, 0.1, 0.3, time);
        //             float zd = generateOffset(vertex.x, vertex.y, 0.15, 0.2, time);

        //             return vertex + vec3(xd, zd, yd);
        //         }

        //         void main() {

        //             vec3 nVert = applyDistortion( position, time );
	                
        //             vec3 transformed = nVert.xyz;

        //         }

    }

    async calculateColors () {

        // loop through chunks

        for ( let c of this.chunks ) {

            const ATTR_POSITION = c.Geometry.getAttribute( 'position' )

            // create color array and attribute

            const COLORS = new Float32Array( ATTR_POSITION.count * 3 )
            c.Geometry.setAttribute( 'color', new THREE.BufferAttribute( COLORS, 3 ) )

            const ATTR_COLOR = c.Geometry.getAttribute( 'color' )

            /**
             * Lower vertices below water so that the water clipping
             * is minimal if not non-existent already.
             */

            if ( !this.flat ) {

                for ( let i = 0; i < ATTR_POSITION.count; i++ ) {

                    if ( ATTR_POSITION.array[ ( i * 3 ) + 2 ] < 0 ) {
    
                        ATTR_POSITION.array[ ( i * 3 ) + 2 ] -= this.underWaterOffset
    
                    }
    
                }

            }

            /**
             * Determin colors and blending based uopin the height of
             * the vertex. This allows for a smooth blend between colors.
             * 
             * We also loop through the vertices 3 at a time so we can
             * access the geometry face by face.
             */

            if ( this.vertexColoring ) {

                for ( let i = 0; i < ATTR_POSITION.count; i += 3 ) {

                    const V_HEIGHT = ATTR_POSITION.array[ ( i * 3 ) + 2 ]
    
                    if ( !this.flat ) {
    
                        if ( V_HEIGHT < 0 ) {
    
                            const C1 = this.getRandomColor( this.Colors.Sand )
                            const C2 = this.getRandomColor( this.Colors.Sand )
        
                            const COLOR = C1.clone()
                                .lerp( C2.clone(), this.mathScale( V_HEIGHT, 0, -1, 0, 1 ) )
        
                            this.setFaceColor( ATTR_COLOR, i, COLOR )
        
                        } else if ( V_HEIGHT < 0.05 ) {
        
                            const C1 = this.getRandomColor( this.Colors.Grass.Dry )
                            const C2 = this.getRandomColor( this.Colors.Sand )
        
                            const COLOR = C1.clone()
                                .lerp( C2.clone(), this.mathScale( V_HEIGHT, 0.05, 0, 0, 1 ) )
        
                            this.setFaceColor( ATTR_COLOR, i, COLOR )
        
                        } else if ( V_HEIGHT < this.peakStartHeight * 0.9 ) {
        
                            const C1 = this.getRandomColor( this.Colors.Grass.Wet )
                            const C2 = this.getRandomColor( this.Colors.Grass.Dry )
        
                            const COLOR = C1.clone()
                                .lerp( C2.clone(), this.mathScale( V_HEIGHT, this.peakStartHeight * 0.9, 0.05, 0, 1 ) )
        
                            this.setFaceColor( ATTR_COLOR, i, COLOR )
        
                        } else if ( V_HEIGHT < this.peakStartHeight * 1.2 ) {
        
                            const C1 = this.getRandomColor( this.Colors.Mountain )
                            const C2 = this.getRandomColor( this.Colors.Grass.Wet )
        
                            const COLOR = C1.clone()
                                .lerp( C2.clone(), this.mathScale( V_HEIGHT, this.peakStartHeight * 1.2, this.peakStartHeight * 0.9, 0, 1 ) )
        
                            this.setFaceColor( ATTR_COLOR, i, COLOR )
        
                        } else {
        
                            const C1 = this.getRandomColor( this.Colors.Snow )
                            const C2 = this.getRandomColor( this.Colors.Mountain )
        
                            const COLOR = C1.clone()
                                .lerp( C2.clone(), this.mathScale( V_HEIGHT, 1 * this.chunkSimplexAmp, this.peakStartHeight * 1.2, 0, 1 ) )
        
                            this.setFaceColor( ATTR_COLOR, i, COLOR )
        
                        }
    
                    } else {
    
                        this.setFaceColor( ATTR_COLOR, i, this.getRandomColor( this.Colors.Grass.Wet ) )
    
                    }
    
                }
    
                ATTR_COLOR.needsUpdate = true

            }

        }

    }

    async calculateWaterDepth ( renderer ) {

        this.WaterMaterial.Shader.uniforms[ 'tDepth' ].value = renderer.Targets.Depth
        this.WaterMaterial.Shader.uniforms[ 'tEnv' ].value = renderer.Targets.Color

    }

    getRandomColor ( colors ) {

        return Utils.Array.getRandomValue( colors )

    }

    setFaceColor ( attr, i, color ) {

        attr.setXYZ( i, color.r, color.g, color.b )
        attr.setXYZ( i + 1, color.r, color.g, color.b )
        attr.setXYZ( i + 2, color.r, color.g, color.b )

    }

    async generate ( renderer ) {

        await this.buildGroups()
        await this.buildChunks()
        await this.calculateColors()
        await this.buildWater( renderer )

    }

    mathScale ( num, in_min, in_max, out_min, out_max ) {

        return ( ( num - in_min ) * ( out_max - out_min ) ) / ( in_max - in_min ) + out_min
    
    }
      

    updateAttr ( attr ) {

        attr.needsUpdate = true

    }

    update ( dT, eT ) {

        if ( this.WaterMaterial && this.WaterMaterial.Shader ) {

            this.WaterMaterial.Shader.uniforms.time.value += dT

        }

    }

}

TerrainComponent.prototype.$name = 'Terrain'

export { TerrainComponent }