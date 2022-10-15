import * as ECS from '../'
import * as THREE from 'three'

class InstancedMeshComponent extends ECS.Component {

    constructor ( proxy, geometry, material, count ) {

        super( proxy )

        this.count = count

        this.Dummy = new THREE.Object3D()
        this.Geometry = geometry
        this.Material = material
        this.Mesh = new THREE.InstancedMesh( this.Geometry, this.Material, this.count )

    }

    addTo ( object3D ) {

        object3D.add( this.Mesh )

    }

    getGeometry () {

        return this.Mesh.geometry

    }

    getMaterial () {

        return this.Mesh.material

    }

    getMesh () {

        return this.Mesh

    }

    async onRemoval () {

        this.removeFromParent()

    }

    removeFromParent () {

        if ( this.Mesh.parent ) this.Mesh.parent.remove ( this.Mesh )

    }

    setGeometry ( geometry ) {

        this.Mesh.geometry = geometry

    }

    setInstancePosition ( index, vec3 ) {

        this.Dummy.position.copy( vec3 )
        this.Dummy.updateMatrix()

        this.Mesh.setMatrixAt( index, this.Dummy.matrix )
        this.updateMatrix()

    }

    setInstanceScale ( index, vec3 ) {

        if ( vec3 instanceof THREE.Vector3 ) this.Dummy.scale.copy( vec3 )
        else this.Dummy.scale.setScalar( vec3 )

        this.Dummy.updateMatrix()

        this.Mesh.setMatrixAt( index, this.Dummy.matrix )
        this.updateMatrix()

    }

    setMaterial ( material ) {

        this.Mesh.material = material

    }

    setMesh ( mesh ) {

        this.Mesh = mesh

    }

    setParent ( parent ) {

        this.removeFromParent()

        this.addTo( parent )

    }

    updateMatrix () {

        this.Mesh.instanceMatrix.needsUpdate = true

    }

}

InstancedMeshComponent.prototype.$name = 'InstancedMesh'

export { InstancedMeshComponent }