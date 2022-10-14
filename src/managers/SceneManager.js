import * as ScriptUtils from '../util/script.js'
import * as THREE from '../../node_modules/three/build/three.module.js'

class SceneManager {

    constructor () {

        this.Scenes = ScriptUtils.createStorageTable()

    }

    async buildScene ( name, properties = {} ) {

        const SCENE = new THREE.Scene()
        SCENE.name = name

        for ( const p in properties ) SCENE[ p ] = properties[ p ]

        this.Scenes.add( SCENE )

        return SCENE

    }

    check ( name ) {

        return this.Scenes.check( name ).byName()

    }

    get ( name ) {

        return this.Scenes.get( name ).byName()

    }

    remove ( ...args ) {

        this.Scenes.remove( ...args ).byName()

    }

}

export { SceneManager }