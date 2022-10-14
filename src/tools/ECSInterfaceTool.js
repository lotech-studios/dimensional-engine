import { InterfaceTool } from './InterfaceTool.js'

class ECSInterfaceTool extends InterfaceTool {

    constructor ( engine ) {
        
        super( engine )

        this.createElements()
        // this.hide()

    }

    createElements () {

        this.Elements.Main = document.createElement( 'div' )
        this.Elements.Main.style.position = 'absolute'
        this.Elements.Main.style.left = '8px'
        this.Elements.Main.style.bottom = '8px'
        this.Elements.Main.style.width = '340px'
        this.Elements.Main.style.height = '330px'
        this.Elements.Main.style.display = 'inline-block'
        this.Elements.Main.style.backgroundColor = 'rgba( 0, 0, 0, 0.75 )'
        this.Elements.Main.style.borderRadius = '4px'
        this.Elements.Main.style.pointerEvents = 'all' 
        this.Elements.Main.style.fontFamily = 'consolas'
        this.Elements.Main.style.zIndex = '9999999'
        this.Elements.Main.style.overflow = 'hidden'

        this.Elements.EntityList = document.createElement( 'div' )
        this.Elements.EntityList.style.margin = '6px 0px 6px 8px'
        this.Elements.EntityList.style.width = 'calc( 100% - 16px )'
        this.Elements.EntityList.style.height = '256px'
        this.Elements.EntityList.style.display = 'inline-block'
        this.Elements.EntityList.style.overflowX = 'hidden'
        this.Elements.EntityList.style.overflowY = 'auto'
        this.Elements.EntityList.style.borderRadius = '4px'
        this.Elements.EntityList.style.backgroundColor = 'rgba( 0, 0, 0, 0.25 )'

        // Append all children to main

        this.createHeading( 'Entities', 'rgba(0, 0, 0, 0.25)', '32px', '18px' )

        this.Elements.Main.appendChild( this.Elements.EntityList )

        this.Engine.Managers.Interface.getState( 'Dev' ).byName()
            .appendChild( this.Elements.Main )

    }

    addEntityToList ( e, i ) {

        const Element = document.createElement( 'div' )
        Element.style.width = '100%'
        Element.style.height = '24px'
        Element.style.display = 'flex'
        Element.style.flexDirection = 'row'
        Element.style.alignItems = 'center'
        Element.style.justifyContent = 'flex-start'
        Element.style.whiteSpace = 'nowrap'
        Element.style.cursor = 'pointer'
        Element.id = `ecs-${ e.uuid }`
                
        if ( i % 2 == 0 ) Element.style.backgroundColor = 'rgba( 0, 0, 0, 0.25 )'
            
        // subs

        const Trash = document.createElement( 'div' )
        Trash.setAttribute( 'uuid', e.uuid )
        Trash.innerHTML = '✖'
        Trash.style.width = '24px'
        Trash.style.height = '24px'
        Trash.style.color = 'grey'
        Trash.style.fontSize = '16px'
        Trash.style.textAlign = 'center'
        Trash.style.margin = '0px 0px 0px 8px'

        Trash.addEventListener( 'pointerup', ( e ) => {

            const UUID = e.target.getAttribute( 'uuid' )

            console.log( UUID )

            this.Engine.Managers.ECS.removeEntity( UUID )

        } )

        const Name = document.createElement( 'div' )
        Name.innerHTML = e.name
        Name.style.color = 'white'
        Name.style.margin = '0px 8px 0px 8px'
        Name.style.fontSize = '14px'

        const UUID = document.createElement( 'div' )
        UUID.innerHTML = e.uuid
        UUID.style.color = 'cyan'
        UUID.style.margin = '0px 8px 0px 8px'
        UUID.style.fontSize = '12px'

        // append subs to main

        Element.appendChild( Trash )
        Element.appendChild( Name )
        Element.appendChild( UUID )

        // append all to list

        this.Elements.EntityList.appendChild( Element )

    }

    removeEntityFromList ( e ) {

        const Element = this.Elements.EntityList.querySelector( `div#ecs-${ e.uuid }` )
        Element.remove()

    }

}

export { ECSInterfaceTool }