import * as ArrayUtils from './arrays.js'

export class StorageTable {

    constructor () {

        this.array = []
        this.uuidToIndex = []
        this.nameToIndex = []

    }

    #checkBy ( type, value ) {

        const ARRAY = type == 'uuid' ? this.uuidToIndex : this.nameToIndex

        if ( ARRAY.includes( value ) ) return true
        else return false

    }

    #getBy ( type, value ) {

        const IX = ArrayUtils.getIndex( type == 'uuid' ? this.uuidToIndex : this.nameToIndex, value )

        return this.array[ IX ]

    }

    #removeBy ( type, args ) {

        for ( let a of args ) {

            const IX = ArrayUtils.getIndex( type == 'uuid' ? this.uuidToIndex : this.nameToIndex, a )

            ArrayUtils.removeIndex( this.array, IX )
            ArrayUtils.removeIndex( this.nameToIndex, IX )
            ArrayUtils.removeIndex( this.uuidToIndex, IX )

        }

    }

    add () {

        for ( let object of arguments ) {

            if ( object.uuid && object.name ) {

                this.array.push( object )
                this.uuidToIndex.push( object.uuid )
                this.nameToIndex.push( object.name )

            }

        }

    }

    check ( value ) {

        return {
            byUUID: () => this.#checkBy( 'uuid', value ),
            byName: () => this.#checkBy( 'name', value )
        }

    }

    get ( value ) {

        return {
            byUUID: () => this.#getBy( 'uuid', value ),
            byName: () => this.#getBy( 'name', value )
        }

    }

    remove () {

        return {
            byUUID: () => this.#removeBy( 'uuid', arguments ),
            byName: () => this.#removeBy( 'name', arguments )
        }

    }

}

export function checkParam ( object, name, defaultValue ) {

    return object[ name ] ? object[ name ] : defaultValue

}

export function createStorageTable () {

    return new StorageTable()

}