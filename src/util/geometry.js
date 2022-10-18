import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export function merge ( parent, child ) {

    return BufferGeometryUtils.mergeBufferGeometries( [ parent, child ] )

}