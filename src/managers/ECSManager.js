import * as Utils from '../util'
import { ECSEntity } from '../ecs/ECSEntity.js'

class ECSManager {

    constructor ( engine ) {

        // Variables based on arguments

        this.Engine = engine

        //

        this.Assemblies = {}
        this.Entities = Utils.Script.createStorageTable()

    }

    /**
     * Adds an entity to the manager to be stored and updated.
     * @param { ECSEntity } entity The entity to add to the manager
     */

    async addEntity ( entity ) {

        this.Entities.add( entity )

        await entity.onBuild()

        if ( this.Engine.Tools.RendererInterface.Selected.Renderer ) {

            this.Engine.Tools.RendererInterface.refreshSceneObjectList()

        }

        this.Engine.Tools.ECSInterface.addEntityToList( entity, this.Entities.array.length - 1 )

    }

    /**
     * Builds and stores the custom entity of this assembly.
     * @param { String } name The name of the assembly you would like to build.
     * @param { ...any } args Any special arguments required for the assembly.
     */

    async assemble ( name, ...args ) {

        const ENTITY = new ECSEntity( this )

        await this.Assemblies[ name ]( ENTITY, ...args )
        await this.addEntity( ENTITY )

        return ENTITY

    }

    /**
     * Stores a method that allows the customization of an entity that be called
     * when neccessary to build.
     * @param { String }   name   The name of this assembly.
     * @param { Function } method Must be asynchronous. Arguments must start with <entity>.
     */

    createAssembly ( name, method ) {

        this.Assemblies[ name ] = method

    }

    /**
     * Removes an entity from the manager.
     * @param { String } id The ID / UUID of the entity.
     */

    async removeEntity ( id ) {

        if ( this.Entities.check( id ).byUUID() ) {

            const ENTITY = this.Entities.get( id ).byUUID()

            await ENTITY.remove()

            this.Entities.remove( id ).byUUID()

            if ( this.Engine.Tools.RendererInterface.Selected.Renderer ) {

                this.Engine.Tools.RendererInterface.refreshSceneObjectList()
    
            }

            this.Engine.Tools.ECSInterface.removeEntityFromList( ENTITY )

        }

    }

    update ( deltaTime, elapsedTime, updateAnim ) {

        for ( let entity of this.Entities.array ) {

            entity.update( deltaTime, elapsedTime, updateAnim )

        }

    }

}

export { ECSManager }