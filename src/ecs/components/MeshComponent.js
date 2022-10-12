import * as THREE from 'three'
import { ECSComponent } from '../ECSComponent.js'

class MeshComponent extends ECSComponent {

    constructor ( proxy, geometry, material ) {

        super( proxy )

        this.Mesh = new THREE.Mesh( geometry, material )

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

        if ( this.Mesh.parent ) this.Mesh.parent.remove ( this.Mesh )

    }

    setGeometry ( geometry ) {

        this.Mesh.geometry = geometry

    }

    setMaterial ( material ) {

        this.Mesh.material = material

    }

    setMesh ( mesh ) {

        this.Mesh = mesh

    }

}

MeshComponent.prototype.$name = 'Mesh'

export { MeshComponent }