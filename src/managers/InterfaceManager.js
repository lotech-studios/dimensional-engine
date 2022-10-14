import * as Utils from '../util'

class InterfaceManager {

    constructor () {

        // non-nested variables

        this.renderOrder = []

        this.Elements = {
            Main: this.createUI(),

            States: {},
        }

        // storage Tables

        this.States = Utils.Script.createStorageTable()

        // init 

        this.buildState( 'Rendering' )
        this.buildState( 'Interface' )
        this.buildState( 'Dev', { displayed: false } )

    }

    async buildState ( name, params = {} ) {

        const STATE = new Utils.Interface.createState( this, name, params )

        this.States.add( STATE )

        this.Elements.States[ STATE.getUUID() ] = STATE.getElement()

        return STATE

    }

    createUI () {

        document.body.style.margin = '0px'
        document.body.style.overflow = 'hidden'

        const Element = document.createElement( 'ui' )
        Element.style.position = 'absolute'
        Element.style.left = '0px'
        Element.style.top = '0px'
        Element.style.width = '100vw'
        Element.style.height = '100vh'
        Element.style.display = 'inline-block'

        document.body.appendChild( Element )

        return Element

    }

    createElements ( html, parent ) {

        switch ( typeof parent ) {

            case 'undefined':

                parent = this.Elements.Main

                break

            case 'string':

                if ( parent.includes( 'state:' ) ) {

                    if ( parent.includes( 'state:uuid@' ) ) {

                        return this.States.get( parent.replace( 'state:uuid@' ) )
                            .byUUID().getElement()

                    }

                    if ( parent.includes( 'state:name@' ) ) {

                        return this.States.get( parent.replace( 'state:name@' ) )
                            .byName().getElement()

                    }

                }

                break

        }

        const PARENT = parent
        const ELEMENTS = new DOMParser().parseFromString( html, 'text/html' )
        
        ELEMENTS.body.childNodes.forEach( ( child ) => PARENT.appendChild( child ) )

    }

    getState ( value ) {

        return this.States.get( value )

    }

}

export { InterfaceManager }