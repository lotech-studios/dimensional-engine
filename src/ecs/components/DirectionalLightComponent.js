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

}

DirectionalLightComponent.prototype.$name = 'DirectionalLight'

export { DirectionalLightComponent }