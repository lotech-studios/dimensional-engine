import * as THREE from 'three'
import { ECSComponent } from '../ECSComponent.js'

class TerrainComponent extends ECSComponent {

    constructor ( proxy ) {

        super( proxy )

    }

}

TerrainComponent.prototype.$name = 'Terrain'

export { TerrainComponent }