import * as THREE from 'three'
import { ECSComponent } from '../ECSComponent.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

class OrbitCameraControlsComponent extends ECSComponent {

    constructor ( proxy, cameraCompName, options = {} ) {

        super( proxy )

        this.Camera = this.Proxy.getComponent( cameraCompName )
        this.Element = this.Engine.Managers.Interface.getState( 'Rendering' )
            .byName().getElement()

        this.Controls = new OrbitControls( this.Camera.get(), this.Element )

        for ( const o in options ) this.Controls[ o ] = options[ o ]

        this.Element.style.pointerEvents = 'all'

    }

    update () {

        this.Controls.update()

    }

}

OrbitCameraControlsComponent.prototype.$name = 'OrbitCameraControls'

export { OrbitCameraControlsComponent }