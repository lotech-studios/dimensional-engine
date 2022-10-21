import * as Controls from '../../controls'
import * as THREE from 'three'
import { ECSComponent } from '../ECSComponent.js'

class MapCameraControlsComponent extends ECSComponent {

    constructor ( proxy, cameraCompName, options = {} ) {

        super( proxy )

        this.Camera = this.Proxy.getComponent( cameraCompName )
        this.Element = this.Engine.Managers.Interface.getState( 'Rendering' )
            .byName().getElement()

        this.Controls = new Controls.MapControls( this.Camera.get(), this.Element )

        for ( const o in options ) this.Controls[ o ] = options[ o ]

        this.Element.style.pointerEvents = 'all'

    }

    onUpdate () {

        this.Controls.update()

    }

}

MapCameraControlsComponent.prototype.$name = 'MapCameraControls'

export { MapCameraControlsComponent }