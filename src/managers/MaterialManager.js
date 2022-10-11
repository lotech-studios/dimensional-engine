import * as ScriptUtils from '../util/script.js'

class MaterialManager {

    constructor () {

        this.Materials = ScriptUtils.createStorageTable()

    }

    async loadFromJSON ( file ) {

        const RESPONSE = await fetch( file )
        const DATA = await RESPONSE.json()

        for ( const m in DATA ) {

            

            this.Materials.add()

        }

    }

}

export { MaterialManager }