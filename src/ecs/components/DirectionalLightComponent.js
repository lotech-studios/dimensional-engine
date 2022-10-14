import * as ECS from '../'
import * as THREE from 'three'
import * as Utils from '../../util'

class DirectionalLightComponent extends ECS.Component {

    constructor ( proxy, params = {} ) {

        super( proxy )

        this.color = Utils.Script.checkParam( params, 'color', 0xffffff )
        this.intensity = Utils.Script.checkParam( params, 'intensity', 1 )

        this.Parent = Utils.Script.checkParam( params, 'parent', null )
        this.Position = Utils.Script.checkParam( params, 'position', new THREE.Vector3( 0, 100, 0 ) )

        this.Light = new THREE.DirectionalLight( this.color, this.intensity )

        if ( this.Parent ) this.addTo( this.Parent )

    }

    addTo ( object3D ) {

        this.Parent = object3D

        this.Parent.add( this.Light )

    }

    getLight () {

        return this.Light

    }

    async onRemoval () {

        this.removeFromParent()

    }

    removeFromParent () {

        if ( this.Parent ) this.Parent.remove( this.Light )

    }

    setColor ( color = 0xffffff ) {

        if ( color instanceof THREE.Color ) this.color = color
        else this.color = new THREE.Color( color )

    }

    setIntensity ( intensity ) {

        this.intensity = intensity

    }

    setParent ( parent ) {

        if ( this.Parent ) this.Parent.remove( this.Light )

        this.addTo( parent )

    }

}

DirectionalLightComponent.prototype.$name = 'DirectionalLight'

export { DirectionalLightComponent }