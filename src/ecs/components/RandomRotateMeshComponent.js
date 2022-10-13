import * as THREE from 'three'
import * as Utils from '../../util'
import { ECSComponent } from '../ECSComponent.js'

class RandomRotateMeshComponent extends ECSComponent {

    constructor ( proxy, range ) {

        super( proxy )

        this.Mesh = this.Proxy.getComponent( 'Mesh' ).getMesh()
        this.Range = new THREE.Vector3(
            Utils.Math.random( -this.range, this.range ),
            Utils.Math.random( -this.range, this.range ),
            Utils.Math.random( -this.range, this.range )
        )

    }
    
    update ( dT ) {

        this.Mesh.rotation.x += dT * this.Range.x
        this.Mesh.rotation.y += dT * this.Range.y
        this.Mesh.rotation.z += dT * this.Range.z

    }

}

RandomRotateMeshComponent.prototype.$name = 'RandomRotateMesh'

export { RandomRotateMeshComponent }