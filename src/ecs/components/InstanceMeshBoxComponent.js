import * as ECS from '../'
import * as THREE from 'three'

class InstancedMeshBoxComponent extends ECS.Component {

    constructor ( proxy, dimensions, objectScale ) {

        super( proxy )

        this.Mesh = this.Proxy.getComponent( 'InstancedMesh' )

        const POSITION = new THREE.Vector3()

        let count = 0
        let oX = 0, oY = 0, oZ = 0
        
        for ( 
            let z = -dimensions.z * objectScale.z; 
            z < dimensions.z * objectScale.z; 
            z += objectScale.z * 2 
        ) {

            for ( 
                let y = -dimensions.y * objectScale.y; 
                y < dimensions.y * objectScale.y; 
                y += objectScale.y * 2 
            ) {

                for ( 
                    let x = -dimensions.x * objectScale.x; 
                    x < dimensions.x * objectScale.x; 
                    x += objectScale.x * 2 
                ) {

                    POSITION.set( x, y, z )

                    this.Mesh.setInstancePostion( count, POSITION )

                    oX++

                }

                oY++

            }

            oZ++

        }

    }

}

InstancedMeshBoxComponent.prototype.$name = 'InstancedMeshBox'

export { InstancedMeshBoxComponent }