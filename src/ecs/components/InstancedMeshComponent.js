import * as THREE from 'three'
import { ThreeObjectComponent } from './ThreeObjectComponent.js'

class InstancedMeshComponent extends ThreeObjectComponent {

    constructor ( proxy, geometry, material, count ) {

        super( proxy )

        this.count = count
        this.dummies = []
        this.objVar = 'Mesh'

        this.Geometry = geometry
        this.Material = material
        this.Mesh = new THREE.InstancedMesh( this.Geometry, this.Material, this.count )

        for ( let i = 0; i < this.count; i++ ) {

            this.dummies.push( new THREE.Object3D() )

        }

    }

    addInstancePosition ( index, vec3 ) {

        this.dummies[ index ].position.add( vec3 )
        this.dummies[ index ].updateMatrix()

        this.Mesh.setMatrixAt( index, this.dummies[ index ].matrix )
        this.updateMatrix()

    }

    addInstanceRotation ( index, vec3 ) {

        this.dummies[ index ].rotation.x += vec3.x
        this.dummies[ index ].rotation.y += vec3.y
        this.dummies[ index ].rotation.z += vec3.z
        this.dummies[ index ].updateMatrix()

        this.Mesh.setMatrixAt( index, this.dummies[ index ].matrix )
        this.updateMatrix()

    }

    addInstanceScale ( index, vec3 ) {

        if ( vec3 instanceof THREE.Vector3 ) this.dummies[ index ].scale.add( vec3 )
        else this.dummies[ index ].scale.addScalar( vec3 )

        this.dummies[ index ].updateMatrix()

        this.Mesh.setMatrixAt( index, this.dummies[ index ].matrix )
        this.updateMatrix()

    }

    getGeometry () {

        return this.Mesh.geometry

    }

    getMaterial () {

        return this.Mesh.material

    }

    setGeometry ( geometry ) {

        this.Mesh.geometry = geometry

    }

    setInstancePosition ( index, vec3 ) {

        this.dummies[ index ].position.copy( vec3 )
        this.dummies[ index ].updateMatrix()

        this.Mesh.setMatrixAt( index, this.dummies[ index ].matrix )
        this.updateMatrix()

    }

    setInstanceRotation ( index, vec3 ) {

        this.dummies[ index ].rotation.x = vec3.x
        this.dummies[ index ].rotation.y = vec3.y
        this.dummies[ index ].rotation.z = vec3.z
        this.dummies[ index ].updateMatrix()

        this.Mesh.setMatrixAt( index, this.dummies[ index ].matrix )
        this.updateMatrix()

    }

    setInstanceScale ( index, vec3 ) {

        if ( vec3 instanceof THREE.Vector3 ) this.dummies[ index ].scale.copy( vec3 )
        else this.dummies[ index ].scale.setScalar( vec3 )

        this.dummies[ index ].updateMatrix()

        this.Mesh.setMatrixAt( index, this.dummies[ index ].matrix )
        this.updateMatrix()

    }

    setMaterial ( material ) {

        this.Mesh.material = material

    }

    updateMatrix () {

        this.Mesh.instanceMatrix.needsUpdate = true

    }

}

InstancedMeshComponent.prototype.$name = 'InstancedMesh'

export { InstancedMeshComponent }