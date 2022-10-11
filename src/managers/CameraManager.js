import * as ScriptUtils from '../util/script.js'

class CameraManager {

    constructor () {

        this.Cameras = ScriptUtils.createStorageTable()

    }

    async buildCamera ( name, cc, ...args ) {

        const CAMERA = new cc( ...args )
        CAMERA.name = name

        this.Cameras.add( CAMERA )

        return CAMERA

    }

    check ( name ) {

        return this.Cameras.check( name ).byName()

    }

    get ( name ) {

        return this.Cameras.get( name ).byName()

    }

    remove ( ...args ) {

        this.Cameras.remove( ...args ).byName()

    }

}

export { CameraManager }