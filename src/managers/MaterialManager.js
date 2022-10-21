import * as Utils from '../util'

class MaterialManager {

    constructor ( engine ) {

        this.Engine = engine

        this.startBatch = []

        this.Materials = {}

    }

    /**
     * Adds a THREE.Material to this manager to be stored.
     * 
     * @param { string }         name     The name the material will be stored under.
     * @param { THREE.Material } material The content of the material.
     */

    async add ( name, material, csm = true ) {

        this.Materials[ name ] = material
        this.Materials[ name ].csm = csm

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
         *      "list": { 
         *          "name": {
         *              "type": "THREE.MeshPhongMaterial",
         *              "csm": true,
         *              
         *              "options": {
         *                  "color": "#ff00ff",
         *                  "flatShading": true,
         *                  "map": "<stored@> polygons",
         *                  "vertexColors": true
         *                  ...
         *              }
         *          }
         *          ...
         *      } 
         * }
         */

        const DATA = await Utils.Files.loadJSON( jsonURL )

        for ( const m in DATA.list ) {

            const OPTIONS = {}

            const CSM = DATA.list[ m ].csm != undefined ? DATA.list[ m ].csm : true
            const TYPE = Utils.Three.isLibString( DATA.list[ m ].type ) ?
                Utils.Three.retrieveLibString( DATA.list[ m ].type ) : DATA.list[ m ].type

            for ( const o in DATA.list[ m ].options ) {

                const OPTION = DATA.list[ m ].options[ o ]

                if ( o == 'map' ) {

                    if ( OPTION.includes( '<stored@> ' ) ) {

                        OPTIONS[ o ] = await this.Engine.Managers.Textures.get( OPTION.slice( 10 ) )

                    }

                } else OPTIONS[ o ] = OPTION

            }

            await this.add( m, new TYPE( OPTIONS ), CSM )

        }

    }

    /**
     * Return the stored material based upon the name.
     * 
     * @param   { string }         name The name of the material to retrieve.
     * @returns { THREE.Material }      The material.
     */

     get ( name ) {

        return this.Materials[ name ]

    }

    /**
     * Interprets, loads, and adds an array.
     * 
     * @param { Array } array The array batch to be interpreted, loaded, and added.
     */

    async loadBatch ( array ) {

        for ( let i of array ) {

            if ( Array.isArray( i ) ) {

                await this.add( ...i )

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

export { MaterialManager }