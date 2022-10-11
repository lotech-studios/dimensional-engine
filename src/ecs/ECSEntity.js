import * as ArrayUtils from '../util/arrays.js'
import * as MathUtils from '../util/math.js'
import * as ScriptUtils from '../util/script.js'
import { ECSComponent } from './ECSComponent.js'

class ComponentStorageTable extends ScriptUtils.StorageTable {

    async add ( cc, entity, ...args ) {

        this.array.push( new cc( entity, ...args ) )
        this.nameToIndex.push( cc.prototype.$name )

        await this.array[ this.array.length - 1 ].onBuild()

    }

    check ( name ) {

        if ( this.nameToIndex.includes( name ) ) return true
        else return false

    }

    get ( name ) {

        const IX = ArrayUtils.getIndex( this.nameToIndex, name )

        return this.array[ IX ]

    }

    async remove ( name ) {

        const IX = ArrayUtils.getIndex( this.nameToIndex, name )

        await this.array[ IX ].onRemoval()
        
        ArrayUtils.removeIndex( this.nameToIndex, IX )
        ArrayUtils.removeIndex( this.array, IX )

    }

}

ComponentStorageTable.prototype.isComponentStorageTable = true

//

class ECSEntity {

    constructor ( manager ) {

        // Variables based on arguments

        this.Engine = manager.Engine
        this.Manager = manager

        //

        this.uuid = MathUtils.generateUUID()
        this.name = `ecs-entity#${ ECSEntity.prototype.$num }`

        this.Components = new ComponentStorageTable()

        // increase prototype count

        ECSEntity.prototype.$num++

    }

    // empty methods

    async onBuild () { /** stuff goes here */ }
    async onRemoval () { /** stuff goes here */ }

    /**
     * Adds a component to this entity.
     * @param { ECSComponent } cc   The class of the component you want to add.
     * @param { ...any }       args Any arguments needed for the component class.
     */

    async addComponent ( cc, ...args ) {

        if ( cc.prototype.$isECSComponent ) {

            await this.Components.add( cc, this, ...args )

        }

    }

    call ( cName, method, ...args ) {

        return this.getComponent( cName )[ method ]( ...args )

    }

    /**
     * Retrieves a component from this entity.
     * @param   { String }       name The name of the component to retrieve.
     * @returns { ECSComponent }      The component.
     */

    getComponent ( name ) {

        return this.Components.get( name )

    }

    /**
     * Retrieves the ID / UUID of this entity.
     * @returns { String } The ID / UUID of this entity.
     */

    getId () {

        return this.id

    }

    /**
     * Removes a component from this entity.
     * @param { String } name The name of the component to remove.
     */

    async remove () {

        for ( let n of this.Components.nameToIndex ) {

            await this.removeComponent( n )

        }

        await this.onRemoval()

    }

    async removeComponent ( name ) {

        if ( this.Components.check( name ) ) {

            await this.Components.remove( name )

        }

    }

    update ( deltaTime, elapsedTime, updateAnim ) {

        for ( let i = 0; i < this.Components.array.length; i++ ) {

            this.Components.array[ i ].update( deltaTime, elapsedTime, updateAnim )

        }

    }

}

ECSEntity.prototype.$num = 0
ECSEntity.prototype.isECSEntity = true

export { ECSEntity }