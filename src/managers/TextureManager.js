import * as Constants from '../core/constants.js'
import * as THREE from 'three'
import * as Utils from '../util'

class TextureManager {

    constructor ( engine ) {

        this.Engine = engine

        this.startBatch = []

        this.Loader = new THREE.TextureLoader()
        this.Textures = {}

    }

    /**
     * Interprets a JSON file based on a specific format and stores its
     * contents in this manager.
     * 
     * @param { string } jsonURL The URL to the JSON file you want interpreted.
     */

    async addFromJSON ( jsonURL ) {

        /**
         * JSON Format
         * 
         * Loads a JSON as long as it is in this format.
         *  
         * {
         *      "path": "../some/path",
         *      "list": { 
         *          "name": {
         *              "url": "./antother/url",
         *              
         *              "options": {
         *                  "wrapS": "THREE.ReapeatWrapping",
         *                  "wrapT": "THREE.ReapeatWrapping",
         *                  "magFilter": "THREE.NearestFilter",
         *                  "repeat": [ 4, 4 ]
         *                  ...
         *              }
         *          }
         *          ...
         *      } 
         * }
         */

        const DATA = await Utils.Files.loadJSON( jsonURL )

        if ( DATA.path ) this.Loader.setPath( DATA.path )

        for ( const d in DATA.list ) {

            await this.addFromURL( d, DATA.list[ d ].url, async ( texture ) => {

                for ( const o in DATA.list[ d ].options ) {

                    const OPTION = DATA.list[ d ].options[ o ]

                    if ( Array.isArray( OPTION ) ) {

                        if ( texture[ o ].isVector2 ) {

                            texture[ o ].set( ...OPTION )

                        }

                    } else if ( typeof OPTION == 'string' ) {

                        if ( OPTION.includes( 'THREE.' ) ) {

                            texture[ o ] = THREE[ OPTION.slice( 6 ) ]

                        }

                    } else texture[ o ] = OPTION[ o ]

                    texture.needsUpdate = true

                }

            } )

        }

    }

    /**
     * Adds a THREE.Texture to this manager to be stored.
     * 
     * @param { string } name     The name the texture will be stored under.
     * @param { string } imageURL URL for the THREE.TextureLoader to load.
     * @param { void }   onLoad   An async function containing what to do after the texture is loaded.
     */

    async addFromURL ( name, imageURL, onLoad = Constants.EMPTY_ASYNC_FUNC )  {

        this.Textures[ name ] = await this.loadFromURL( imageURL )

        await onLoad( this.Textures[ name ] )

    }

    /**
     * Return the stored texture based upon the name.
     * 
     * @param   { string }        name The name of the texture to retrieve.
     * @returns { THREE.Texture }      The texture.
     */

    get ( name ) {

        return this.Textures[ name ]

    }

    /**
     * Interprets, loads, and adds an array.
     * 
     * @param { Array } array The array batch to be interpreted, loaded, and added.
     */

    async loadBatch ( array ) {

        for ( let i of array ) {

            if ( Array.isArray( i ) ) {

                await this.addFromURL( ...i )

            } else {

                if ( typeof i == 'string' && i.includes( '.json' ) ) {

                    await this.addFromJSON( i )

                }

            }

        }

    }

    /**
     * Loads the <startBatch> array.
     */

    async loadStartBatch () {

        await this.loadBatch( this.startBatch )

    }

    /**
     * Returns a THREE.Texture based on the url.
     * 
     * @param   { string }        imageURL URL for the THREE.TextureLoader to load.
     * @returns { THREE.Texture }          The texture.
     */

    async loadFromURL ( imageURL ) {

        return await this.Loader.loadAsync( imageURL )

    }

    /**
     * Sets the batch array that will be interpreted, loaded, and added when the
     * engine is started.
     * 
     * @param   { Array } array The batch array to be interpreted, loaded, and added when the engine is started.
     * @returns { Array }       The batch array.
     */

    async setStartBatch ( array ) {

        this.startBatch = array

        return array

    }

}

TextureManager.prototype.isTextureManager = true

export { TextureManager }