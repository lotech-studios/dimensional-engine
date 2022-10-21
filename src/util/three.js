import * as StringUtils from './strings.js'
import * as THREE from 'three'

export function isLibString ( string ) {

    return string.includes( 'THREE.' )

}

export function removeLibPrefix ( string ) {

    return StringUtils.slice( string, 6 )

}

export function retrieveLibString ( string ) {

    return THREE[ removeLibPrefix( string ) ]

}