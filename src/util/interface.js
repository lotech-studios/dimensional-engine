import * as Utils from './'

export class State {

    constructor ( manager, name, params = {} ) {

        // argument based variables

        this.name = name ? name : `State#${ State.prototype.$num }`

        this.Manager = manager

        // non-nested variables

        this.displayed = Utils.Script.checkParam( params, 'displayed', true )
        this.uuid = Utils.Math.generateUUID()

        // init

        this.Element = document.createElement( 'state' )
        this.Element.id = this.uuid
        this.Element.style.position = 'absolute'
        this.Element.style.left = '0px'
        this.Element.style.top = '0px'
        this.Element.style.width = '100vw'
        this.Element.style.height = '100vh'
        this.Element.style.display = 'inline-block'
        this.Element.style.pointerEvents = 'none'
        this.Element.setAttribute( 'name', this.name )

        this.Manager.Elements.Main.appendChild( this.Element )

        if ( !this.displayed ) this.hide()

        State.prototype.$num++

    }

    appendChild ( element ) {

        this.Element.appendChild( element )

    }

    getElement () {

        return this.Element

    }

    getName () {

        return this.name

    }

    getUUID () {

        return this.uuid

    }

    async hide ( waitTime = 0 ) {

        setTimeout( () => {

            this.Element.style.display = 'none'

            this.displayed = false

        }, waitTime * 1000 )

    }

    async show ( waitTime = 0 ) {

        setTimeout( () => {

            this.Element.style.display = 'inline-block'

            this.displayed = true

        }, waitTime * 1000 )

    }

}

State.prototype.$num = 0

export function createState ( manager, name, params = {} ) {

    return new State( manager, name, params )

}