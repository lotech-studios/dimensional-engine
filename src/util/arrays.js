export function getIndex ( array, value ) {

    return array.indexOf( value )

}

export function removeIndex ( array, index ) {

    array.splice( index, 1 )

}

export function removeValue ( array, value, iterations = 'once' ) {

    if ( iterations == 'all' ) {

        for ( let i = 0; i < array.length; i++ ) {

            if ( array[ i ] == value ) removeIndex( array, i )

        }

    } else {

        const IX = getIndex( array, value )

        removeIndex( array, IX )

    }

}