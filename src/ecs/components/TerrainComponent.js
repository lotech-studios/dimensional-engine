import * as Geometries from '../../geometries'
import * as THREE from 'three'
import * as Utils from '../../util'
import { ECSComponent } from '../ECSComponent.js'

class TerrainChunk {

    constructor ( proxy ) {

        this.Proxy = proxy

        this.Geometry = new Geometries.TerrainPlaneGeometry(
            this.Proxy.chunkSize, this.Proxy.chunkSize,
            this.Proxy.chunkSegments, this.Proxy.chunkSegments
        )

    }

}

class TerrainComponent extends ECSComponent {

    constructor ( proxy ) {

        super( proxy )

        this.chunkSegments = 32
        this.chunkSize = 1

        this.Material = Utils.Materials.createWireframeMaterial()

    }

}

TerrainComponent.prototype.$name = 'Terrain'

export { TerrainComponent }