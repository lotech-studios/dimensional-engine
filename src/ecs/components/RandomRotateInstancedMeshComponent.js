import * as THREE from 'three'
import * as Utils from '../../util'
import { ECSComponent } from '../ECSComponent.js'

class RandomRotateInstancedMeshComponent extends ECSComponent {

    constructor ( proxy, range ) {

        super( proxy )

        this.range = range
        this.ranges = []

        this.Mesh = this.Proxy.getComponent( 'InstancedMesh' )
        this.Rotation = new THREE.Vector3()

        for ( let i = 0; i < this.Mesh.count; i++ ) {

            this.ranges.push( new THREE.Vector3(
                Utils.Math.random( -this.range, this.range ),
                Utils.Math.random( -this.range, this.range ),
                Utils.Math.random( -this.range, this.range )
            ) )

        }

    }
    
    update ( dT ) {

        for ( let i = 0; i < this.Mesh.count; i++ ) {

            this.Rotation.set( 
                dT * this.ranges[ i ].x, 
                dT * this.ranges[ i ].y, 
                dT * this.ranges[ i ].z 
            )

            this.Mesh.addInstanceRotation( i, this.Rotation )

        }

    }

}

RandomRotateInstancedMeshComponent.prototype.$name = 'RandomRotateInstancedMesh'

export { RandomRotateInstancedMeshComponent }