import * as Utils from '../util'

class MaterialManager {

    constructor ( engine ) {

        this.Engine = engine

        this.startBatch = []

        this.Materials = {}

    }

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

        for ( const m in DATA ) {

            

        }

    }

}

export { MaterialManager }