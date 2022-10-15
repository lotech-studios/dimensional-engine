import * as ScriptUtils from '../../util/script.js'
import * as THREE from 'three'
import { ThreeObjectComponent } from './ThreeObjectComponent.js'

class CameraComponent extends ThreeObjectComponent {

    constructor ( proxy, params = {} ) {

        super( proxy )

        this.aspect = ScriptUtils.checkParam( params, 'aspect', 1 )
        this.displayHelper = ScriptUtils.checkParam( params, 'displayHelper', true )
        this.far = ScriptUtils.checkParam( params, 'far', 2000 )
        this.fov = ScriptUtils.checkParam( params, 'fov', 25 )
        this.name = ScriptUtils.checkParam( params, 'name', `Camera#${ CameraComponent.prototype.$num }` )
        this.near = ScriptUtils.checkParam( params, 'near', 0.01 )
        this.objVar = 'Camera'

        this.Parent = ScriptUtils.checkParam( params, 'parent', null )
        this.Position = ScriptUtils.checkParam( params, 'position', new THREE.Vector3() )
        this.Target = ScriptUtils.checkParam( params, 'target', null )
        this.Type = ScriptUtils.checkParam( params, 'type', THREE.PerspectiveCamera )

    }

    get () {

        return this.Camera

    }

    async onBuild () {

        // Build camera

        const TARGET = this.Target ? [ this.Target.x, this.Target.y, this.Target.z ] : [ 0, 0, 0 ]

        this.Camera = await this.Engine.Managers.Camera.buildCamera( 
            this.name, this.Type, this.fov, this.aspect, this.near, this.far )
        this.Camera.position.copy( this.Position )
        this.Camera.lookAt( ...TARGET  )
        this.Camera.helper = new THREE.CameraHelper( this.Camera )

        if ( this.Parent ) this.setParent( this.Parent )

    }

    update ( deltaTime, elapsedTime ) {

        if ( this.Target ) {

            this.Camera.lookAt( this.Target.x, this.Target.y, this.Target.z )

        }

    }

}

CameraComponent.prototype.$name = 'Camera'

export { CameraComponent }