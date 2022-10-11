class InterfaceToolAttribute {

    constructor ( tool, name, labelText, dataSuffix, dataColor ) {

        this.name = name ? name : 'Attribute'
        this.dataSuffix = dataSuffix ? dataSuffix : ''

        this.Tool = tool

        this.Tool.Elements[ `${ this.name }Label` ] = document.createElement( 'div' )
        this.Tool.Elements[ `${ this.name }Label` ].innerHTML = labelText ? labelText : 'Attribute'
        this.Tool.Elements[ `${ this.name }Label` ].style.color = 'white'
        this.Tool.Elements[ `${ this.name }Label` ].style.margin = '0px 4px 0px 8px'
        this.Tool.Elements[ `${ this.name }Label` ].style.fontSize = '14px'

        this.Tool.Elements[ `${ this.name }Count` ] = document.createElement( 'div' )
        this.Tool.Elements[ `${ this.name }Count` ].innerHTML = `~ ${ this.dataSuffix }`
        this.Tool.Elements[ `${ this.name }Count` ].style.color = dataColor ? dataColor : 'cyan'
        this.Tool.Elements[ `${ this.name }Count` ].style.margin = '0px 8px 0px 8px'
        this.Tool.Elements[ `${ this.name }Count` ].style.fontSize = '14px'

        this.Tool.Elements[ this.name ] = document.createElement( 'div' )
        this.Tool.Elements[ this.name ].style.width = '100%'
        this.Tool.Elements[ this.name ].style.height = '16px'
        this.Tool.Elements[ this.name ].style.display = 'flex'
        this.Tool.Elements[ this.name ].style.alignItems = 'center'
        this.Tool.Elements[ this.name ].style.justifyContent = 'flex-start'

        this.Tool.Elements[ this.name ].appendChild( this.Tool.Elements[ `${ this.name }Label` ] )
        this.Tool.Elements[ this.name ].appendChild( this.Tool.Elements[ `${ this.name }Count` ] )

        this.Tool.Elements.Main.appendChild( this.Tool.Elements[ this.name ] )

    }

    update ( data ) {

        this.Tool.Elements[ `${ this.name }Count` ].innerHTML = `${ data } ${ this.dataSuffix }`

    }

}



class InterfaceTool {

    constructor ( engine ) {

        this.Engine = engine

        this.displayed = true
        this.headings = 0

        this.Attributes = {}
        this.Elements = {}

        this.createMainElement()

    }

    createAttribute ( name, labelText, dataSuffix, dataColor ) {

        this.Attributes[ name ] = new InterfaceToolAttribute( this, name, labelText, dataSuffix, dataColor )

    }

    createHeading ( text, bgColor, height, fontSize ) {

        this.Elements[ `header#${ this.headings }` ] = document.createElement( 'div' )
        this.Elements[ `header#${ this.headings }` ].innerHTML = text ? text : 'Heading'
        this.Elements[ `header#${ this.headings }` ].style.width = '100%'
        this.Elements[ `header#${ this.headings }` ].style.backgroundColor = bgColor ? bgColor : 'rgba(0, 0, 0, 0.25)'
        this.Elements[ `header#${ this.headings }` ].style.height = height ? height : '32px'
        this.Elements[ `header#${ this.headings }` ].style.color = 'white'
        this.Elements[ `header#${ this.headings }` ].style.textAlign = 'center'
        this.Elements[ `header#${ this.headings }` ].style.lineHeight = height ? height : '32px'
        this.Elements[ `header#${ this.headings }` ].style.fontSize = fontSize ? fontSize : '18px'
        this.Elements[ `header#${ this.headings }` ].style.fontWeight = 'bold'

        this.Elements.Main.appendChild( this.Elements[ `header#${ this.headings }` ] )

        this.headings++

    }

    createMainElement () {

        this.Elements.Main = document.createElement( 'div' )
        this.Elements.Main.style.position = 'absolute'
        this.Elements.Main.style.left = '8px'
        this.Elements.Main.style.top = '8px'
        this.Elements.Main.style.width = '340px'
        this.Elements.Main.style.height = '340px'
        this.Elements.Main.style.display = 'inline-block'
        this.Elements.Main.style.backgroundColor = 'rgba( 0, 0, 0, 0.75 )'
        this.Elements.Main.style.borderRadius = '4px'
        this.Elements.Main.style.pointerEvents = 'all' 
        this.Elements.Main.style.fontFamily = 'consolas'
        this.Elements.Main.style.zIndex = '9999999'
        this.Elements.Main.style.overflow = 'hidden'

    }

    getElement () {

        return this.Elements.Main

    }

    hide () {

        if ( this.displayed ) {

            this.Elements.Main.style.display = 'none'

            this.displayed = false

        }

    }

    show () {

        if ( !this.displayed ) {

            this.Elements.Main.style.display = 'inline-block'

            this.displayed = true

        }

    }

}

export { InterfaceTool, InterfaceToolAttribute }