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

        this.Geometry = new Geometries.TerrainPlaneGeometry(
            this.Proxy.chunkSize, this.Proxy.chunkSize,
            this.Proxy.chunkSegments, this.Proxy.chunkSegments,

            this.Proxy.Simplex, this.simplexSX, this.simplexSY, 
            this.Proxy.chunkSimplexRangeX, this.Proxy.chunkSimplexRangeY, 
            this.Proxy.chunkSimplexAmp, 
            
            this.Proxy.peakAmp, this.Proxy.peakStartHeight,

            this.Proxy.seaLevel
        )

        this.Mesh = new THREE.Mesh( this.Geometry, this.Proxy.Material )
        this.Mesh.position.set( x, 0, y )
        this.Mesh.rotateX( Math.PI / -2 )

        this.Proxy.chunks.push( this )
        this.Proxy.Groups.Ground.add( this.Mesh )

    }

}

class TerrainComponent extends ECSComponent {

    constructor ( proxy, parent, params = {} ) {

        super( proxy )

        this.chunkSegments = Utils.Script.checkParam( params, 'chunkSegments', 32 )
        this.chunkSimplexAmp = Utils.Script.checkParam( params, 'chunkSimplexAmp', 0.025 )
        this.chunkSimplexRangeX = Utils.Script.checkParam( params, 'chunkSimplexRangeX', 1 )
        this.chunkSimplexRangeY = Utils.Script.checkParam( params, 'chunkSimplexRangeY', 1 )
        this.chunkSize = Utils.Script.checkParam( params, 'chunkSize', 1 )
        this.chunks = []
        this.chunksX = Utils.Script.checkParam( params, 'chunksX', 5 )
        this.chunksXSize = this.chunksX * this.chunkSize
        this.chunksY = Utils.Script.checkParam( params, 'chunksY', 5 )
        this.chunksYSize = this.chunksY * this.chunkSize
        this.peakAmp = Utils.Script.checkParam( params, 'peakAmp', 0.05 )
        this.peakStartHeight = Utils.Script.checkParam( params, 'peakStartHeight', 0.0125 )
        this.seaLevel = Utils.Script.checkParam( params, 'seaLevel', 0.5 )

        this.Material = Utils.Materials.createWireframeMaterial()
        this.Parent = parent
        this.Simplex = new SimplexNoise()

        this.Groups = {
            Ground: new THREE.Group(),
        }

        this.addGroups()

    }

    addGroups () {

        for ( const g in this.Groups ) {

            this.Parent.add( this.Groups[ g ] )

        }

    }

    async buildChunks () {

        for ( let y = this.chunksYSize / -2; y < this.chunksYSize / 2; y++ ) {

            for ( let x = this.chunksXSize / -2; x < this.chunksXSize / 2; x++ ) {

                const CHUNK = new TerrainChunk( this, x, y )

            }

        }

    }

    async buildGroups () {

        this.chunks.length = 0

        for ( const g in this.Groups ) {

            this.Groups[ g ].children.length = 0

        }

    }

    async generate () {

        await this.buildGroups()
        await this.buildChunks()

    }

}

TerrainComponent.prototype.$name = 'Terrain'

export { TerrainComponent }