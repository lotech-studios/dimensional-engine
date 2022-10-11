import * as ScriptUtils from '../../util/script.js'
import * as THREE from '../../../node_modules/three/build/three.module.js'
import { ECSComponent } from '../ECSComponent.js'

class CameraComponent extends ECSComponent {

    constructor ( proxy, params = {} ) {

        super( proxy )

        this.aspect = ScriptUtils.checkParam( params, 'aspect', 1 )
        this.far = ScriptUtils.checkParam( params, 'far', 2000 )
        this.fov = ScriptUtils.checkParam( params, 'fov', 25 )
        this.name = ScriptUtils.checkParam( params, 'name', `Camera#${ CameraComponent.prototype.$num }` )
        this.near = ScriptUtils.checkParam( params, 'near', 0.01 )

        this.Position = ScriptUtils.checkParam( params, 'position', new THREE.Vector3() )
        this.Target = ScriptUtils.checkParam( params, 'target', null )
        this.Type = ScriptUtils.checkParam( params, 'type', THREE.PerspectiveCamera )

        // Build camera

        const TARGET = this.Target ? [ this.Target.x, this.Target.y, this.Target.z ] : [ 0, 0, 0 ]

        this.Engine.Managers.Camera.buildCamera( this.name, this.Type, this.fov, this.aspect, this.near, this.far )

        this.Camera = this.Engine.Managers.Camera.get( this.name )
        this.Camera.position.copy( this.Position )
        this.Camera.lookAt( ...TARGET  )

        if ( params.parent ) params.parent.add( this.Camera )

    }

    addToCamera ( object3d ) {

        this.Camera.add( object3d )

    }

    getCamera () {

        return this.Camera

    }

    update ( deltaTime, elapsedTime ) {

        if ( this.Target ) {

            this.Camera.lookAt( this.Target.x, this.Target.y, this.Target.z )

        }

    }

}

CameraComponent.prototype.$name = 'Camera'

export { CameraComponent }