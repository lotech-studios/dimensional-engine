import * as CANNON from 'cannon-es'
import { Manager } from './Manager.js'

class PhysicsManager extends Manager {

    constructor ( engine ) {

        super( engine )

        this.Lib = CANNON

    }

    async init () {}
 
}

export { PhysicsManager }