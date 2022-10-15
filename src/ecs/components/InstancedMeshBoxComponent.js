import * as THREE from 'three'
import { ECSComponent } from '../ECSComponent.js'

class InstancedMeshBoxComponent extends ECSComponent {

    constructor ( proxy, objectScale ) {

        super( proxy )

        this.Mesh = this.Proxy.getComponent( 'InstancedMesh' )

        this.countCubeRoot = Math.cbrt( this.Mesh.count )

        const POSITION = new THREE.Vector3()

        let count = 0
        let oX = -this.countCubeRoot * objectScale.x, 
        oY = -this.countCubeRoot * objectScale.y, 
        oZ = -this.countCubeRoot * objectScale.z
        
        for ( let z = 0; z < this.countCubeRoot; z++ ) {

            oY = -this.countCubeRoot * objectScale.y

            for ( let y = 0; y < this.countCubeRoot; y++ ) {
                
                oX = -this.countCubeRoot * objectScale.x

                for ( let x = 0; x < this.countCubeRoot; x++ ) {

                    POSITION.set( oX, oY, oZ )

                    this.Mesh.setInstancePosition( count, POSITION )

                    count++
                    oX += objectScale.x * 2

                }

                oY += objectScale.y * 2

            }

            oZ += objectScale.z * 2

        }

    }

}

InstancedMeshBoxComponent.prototype.$name = 'InstancedMeshBox'

export { InstancedMeshBoxComponent }