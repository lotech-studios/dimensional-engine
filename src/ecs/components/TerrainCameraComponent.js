import * as ScriptUtils from '../../util/script.js'
import * as THREE from 'three'
import { CameraComponent } from './CameraComponent.js'

class TerrainCameraComponent extends CameraComponent {

    constructor ( proxy, params = {} ) {

        super( proxy, params )

        this.Intersect = {}
        this.Raycaster = new THREE.Raycaster()
        this.RayVec = new THREE.Vector2()

    }

    update ( dT, eT ) {

        this.RayVec.x = ( ( window.innerWidth / 2 ) / window.innerWidth ) * 2 - 1
        this.RayVec.y = - ( ( window.innerHeight / 2 ) / window.innerHeight ) * 2 + 1

        this.Raycaster.setFromCamera( this.RayVec, this.Camera )

        const INTERSECTS = this.Raycaster.intersectObjects( this.Proxy.getComponent( 'Terrain' ).chunkMeshes )

        if ( INTERSECTS.length > 0 ) {

            this.Intersect = INTERSECTS[ 0 ]
            this.Camera.Intersect = this.Intersect

        }

    }

}

TerrainCameraComponent.prototype.$name = 'TerrainCamera'

export { TerrainCameraComponent }