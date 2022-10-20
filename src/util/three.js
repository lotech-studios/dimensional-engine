import * as StringUtils from './strings.js'
import * as THREE from 'three'

export function removePrefix ( string ) {

    return StringUtils.slice( string, 6 )

}