import * as THREE from 'three'

export function createWireframeMaterial ( color = 0xffffff ) {

    return new THREE.MeshBasicMaterial( { color: color, wireframe: true } )

}