import * as Utils from '../util'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

class ModelManager {

    constructor ( engine ) {

        this.Engine = engine

        this.Loader = new GLTFLoader()
        this.Models = {}

    }

    async add ( name, file ) {

        this.Models[ name ] = await this.load( file )

    }

    async load ( file ) {

        return await this.Loader.loadAsync( file )

    }

}

ModelManager.prototype.isModelManager = true

export { ModelManager }