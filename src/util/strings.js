export function slice ( string, front, back ) {

    if ( front && !back ) return string.slice( front )
    else if ( front && back ) return string.slice( front, -back )
    else return string

}