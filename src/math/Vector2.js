class Vector2 {

    constructor ( x, y ) {

        this.x = x ? x : 0
        this.y = y ? y : 0

    }

    getEquivalent ( value ) {

        switch ( this[ value ] ) {

            case 'window-x':

                return window.innerWidth

            case 'window-y':

                return window.innerHeight

            default:

                return this[ value ]

        }

    }

    set ( x, y ) {

        this.x = x
        this.y = y

    }

}

export { Vector2 }