import * as THREE from 'three'

class TextureManager {

    constructor ( engine ) {

        this.Engine = engine

        this.Loader = new THREE.TextureLoader()
        this.Textures = {}

    }

    async addURL ( name, imageURL )  {

        this.Textures[ name ] = await this.loadURL( imageURL )

    }

    async loadURL ( imageURL ) {

        return await this.Loader.loadAsync( imageURL )

    }

}

TextureManager.prototype.isTextureManager = true

export { TextureManager }