class Vector3 {

    constructor ( x, y, z ) {

        this.x = x ? x : 0
        this.y = y ? y : 0
        this.z = z ? z : 0

    }

    set ( x, y, z ) {

        this.x = x
        this.y = y
        this.z = z

    }

}

export { Vector3 }