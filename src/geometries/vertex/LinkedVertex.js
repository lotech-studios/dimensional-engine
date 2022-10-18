class LinkedVertex {

    constructor ( geo, x, y ) {

        this.indexes = [] // [ 0, 1 ]
        this.x = x
        this.y = y

        this.Parent = geo

    }

    addIndex () {

        this.indexes.push( ...arguments )

    }

    getCoords () {

        return new Vector3( this.x, this.y, this.getHeight() )

    }

    getHeight () {

        return this.Parent.attributes.position.array[ ( this.indexes[ 0 ] * 3 ) + 2 ]
        
    }

    lower ( increment ) {

        const height = this.getHeight()

        this.setHeight( height - increment )

    }

    raise ( increment ) {

        const height = this.getHeight()

        this.setHeight( height + increment )

    }

    setHeight ( height ) {

        for ( let i = 0; i < this.indexes.length; i++ ) {

            this.Parent.attributes.position.array[ ( this.indexes[ i ] * 3 ) + 2 ] = height

        }

    }

}

LinkedVertex.prototype.isLinkedVertex = true

export { LinkedVertex }