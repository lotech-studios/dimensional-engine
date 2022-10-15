import * as THREE from 'three'
import { ECSComponent } from '../ECSComponent.js'

class ThreeObjectComponent extends ECSComponent {

    constructor ( proxy ) {

        super( proxy )

        this.objVar = 'Object3D'

    }

    addPosition ( vec3 ) {

        this[ this.objVar ].position.add( vec3 )

    }

    addRotation ( vec3 ) {

        this[ this.objVar ].rotation.x += vec3.x
        this[ this.objVar ].rotation.y += vec3.y
        this[ this.objVar ].rotation.z += vec3.z

    }

    addScale ( vec3 ) {

        if ( vec3 instanceof THREE.Vector3 ) this[ this.objVar ].scale.add( vec3 )
        else this[ this.objVar ].scale.addScalar( vec3 )

    }

    addTo ( object3D ) {

        object3D.add( this[ this.objVar ] )
 
    }

    get () {

        return this[ this.objVar ]

    }

    async onRemoval () {

        this.removeFromParent()

    }

    removeFromParent () {

        if ( this[ this.objVar ].parent ) {

            this[ this.objVar ].parent.remove ( this[ this.objVar ] )

        }

    }

    set ( object ) {

        this[ this.objVar ] = object

    }

    setParent ( parent ) {

        this.removeFromParent()

        this.addTo( parent )

    }

    setPosition ( vec3 ) {

        this[ this.objVar ].position.copy( vec3 )

    }

    setRotation ( vec3 ) {

        this[ this.objVar ].rotation.x = vec3.x
        this[ this.objVar ].rotation.y = vec3.y
        this[ this.objVar ].rotation.z = vec3.z

    }

    setScale ( vec3 ) {

        if ( vec3 instanceof THREE.Vector3 ) this[ this.objVar ].scale.copy( vec3 )
        else this[ this.objVar ].scale.setScalar( vec3 )

    }

}

ThreeObjectComponent.prototype.$name = 'ThreeObject'

export { ThreeObjectComponent }