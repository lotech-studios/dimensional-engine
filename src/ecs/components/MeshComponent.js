import * as THREE from 'three'
import { ThreeObjectComponent } from './ThreeObjectComponent.js'

class MeshComponent extends ThreeObjectComponent {

    constructor ( proxy, geometry, material ) {

        super( proxy )

        this.objVar = 'Mesh'

        this.Mesh = new THREE.Mesh( geometry, material )

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

    setMaterial ( material ) {

        this.Mesh.material = material

    }

}

MeshComponent.prototype.$name = 'Mesh'

export { MeshComponent }