import * as ArrayUtils from './arrays.js'

export class RendererStorageTable {

    constructor () {

        this.active = []

        this.Collection = {}

    }

    activate ( name, waitTime = 0 ) {

        setTimeout( () => {

            if ( !this.active.includes( name ) ) {

                this.active.push( name )
    
                this.Collection[ name ].active = true
    
            }

        }, waitTime * 1000 )

    }

    add ( name, renderer ) {

        this.Collection[ name ] = renderer

        if ( this.Collection[ name ].active ) this.activate( name )

    }

    check ( name ) {

        if ( this.Collection[ name ] ) return true
        else return false

    }

    deactivate ( name, waitTime = 0 ) {

        setTimeout( () => {

            if ( this.active.includes( name ) ) {

                ArrayUtils.removeValue( this.active, name )
    
                this.Collection[ name ].active = false
    
            }

        }, waitTime * 1000 )

    }

    get ( name ) {

        return this.Collection[ name ]

    }

    remove ( name ) {

        if ( this.check( name ) ) {

            this.deactivate( name )

            delete this.Collection[ name ]

        }

    }

}