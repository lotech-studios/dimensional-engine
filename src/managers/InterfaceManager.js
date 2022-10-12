class InterfaceManager {

    constructor () {

        this.Elements = {
            Main: this.createUI()
        }

        this.createElements( `
            <div id='ass' sex>
                <div></div>
                <div></div>
            </div>
            <div id='dick'>
                <div></div>
                <div></div>
            </div>
        ` )

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

        const PARENT = parent ? parent : this.Elements.Main
        const ELEMENTS = new DOMParser().parseFromString( html, 'text/html' )
        
        ELEMENTS.body.childNodes.forEach( ( child ) => PARENT.appendChild( child ) )

    }

}

export { InterfaceManager }