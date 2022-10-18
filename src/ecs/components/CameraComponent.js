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
        this.Type = ScriptUtils.checkParam( params, 'type', THREE.PerspectiveCamera )

        this.Depth = {
            distance: 0,
        }

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
        this.Camera.Depth = this.Depth

        if ( this.Parent ) this.setParent( this.Parent )

    }

}

CameraComponent.prototype.$name = 'Camera'

export { CameraComponent }