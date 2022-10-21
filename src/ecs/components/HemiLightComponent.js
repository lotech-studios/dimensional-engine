import * as THREE from 'three'
import * as Utils from '../../util'
import { ECSComponent } from '../ECSComponent.js'

class HemiLightComponent extends ECSComponent {

    constructor ( proxy, params = {} ) {

        super( proxy )

        this.skyColor = Utils.Script.checkParam( params, 'skyColor', 0xffffff )
        this.groundColor = Utils.Script.checkParam( params, 'groundColor', 0xffffff )
        this.intensity = Utils.Script.checkParam( params, 'intensity', 1 )

        this.Parent = Utils.Script.checkParam( params, 'parent', null )
        this.Position = Utils.Script.checkParam( params, 'position', new THREE.Vector3( 0, 100, 0 ) )

        this.Light = new THREE.HemisphereLight( this.skyColor, this.groundColor, this.intensity )

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

    setIntensity ( intensity ) {

        this.intensity = intensity

    }

    setParent ( parent ) {

        if ( this.Parent ) this.Parent.remove( this.Light )

        this.addTo( parent )

    }

    onUpdate () {

        if ( DeviceInput.getPointerButtonDown( 0 ) ) {

            console.log( 'ass' )

        } else if ( DeviceInput.getPointerButtonUp( 0 ) ) {

            console.log( 'balls' )

        }

    }

}

HemiLightComponent.prototype.$name = 'HemiLight'

export { HemiLightComponent }