import * as DB from '../database'
import * as Utils from '../util'

class Input {

    constructor () {

        this.active = [] // inputs active
        this.currentFrame = [] // inputs created during the current frame

    }

    addActive ( value ) {

        if ( !this.isActive( value ) ) this.active.push( value )

    }

    addCF ( value ) {

        if ( !this.isCF( value ) ) this.currentFrame.push( value )

    }

    isActive ( value ) {

        if ( this.active.includes( value ) ) return true
        else return false

    }

    isCF ( value ) {

        if ( this.currentFrame.includes( value ) ) return true
        else return false

    }

    removeActive ( value ) {

        if ( this.isActive( value ) ) Utils.Array.removeValue( this.active, value )

    }

    removeCF ( value ) {

        if ( this.isCF( value ) ) Utils.Array.removeValue( this.currentFrame, value )

    }

}

/**
 * Can be accessed in a variety of ways.
 * 
 * - <ENGINE>.Managers.Input
 * - <ENGINE>.Input
 * - window.DeviceInput
 * - DeviceInput
 * 
 * This can be done since it can rely on itself with no engine code.
 */

class InputManager {

    constructor ( engine ) {

        this.Engine = engine

        this.pointerDown = new Input()
        this.pointerUp = new Input()
        this.keyDown = new Input()
        this.keyUp = new Input()

        this.setup()

    }

    /**
     * Setup method for the events. Called in the constructor.
     */

    setup () {

        window.addEventListener( 'pointerdown', ( e ) => {

            this.pointerDown.addActive( e.button )
            this.pointerDown.addCF( e.button )

        } )

        window.addEventListener( 'pointerup', ( e ) => {

            this.pointerDown.removeActive( e.button )
            this.pointerUp.addCF( e.button )

        } )

        window.addEventListener( 'keydown', ( e ) => {

            this.keyDown.addActive( e.key )
            this.keyDown.addCF( e.button )

        } )

        window.addEventListener( 'keyup', ( e ) => {

            this.keyDown.removeActive( e.key )
            this.keyUp.addCF( e.button )

        } )

        window.DeviceInput = this
        window.Keys = DB.Keys

    }

    /**
     * This returns true if the specific key is being held down. Otherwise
     * it will always return false.
     * 
     * @param   { number }  key The key in which you want to check.
     * @returns { boolean }     If the key is being held down.
     */

    getKey ( key ) {

        return this.keyDown.isActive( key )

    }

    /**
     * This only returns true the frame the <keydown> event was called
     * and the specific key was hit. Otherwise, it is always false.
     * 
     * @param   { number }  key The key in which you want to check.
     * @returns { boolean }     If the <keydown> event was called.
     */

    getKeyDown ( key ) {

        return this.keyDown.isCF( key )

    }

    /**
     * This only returns true the frame the <keyup> event was called
     * and the specific key was hit. Otherwise, it is always false.
     * 
     * @param   { number }  key The key in which you want to check.
     * @returns { boolean }     If the <keyup> event was called.
     */

    getKeyUp ( key ) {

        return this.keyUp.isCF( key )

    }

    /**
     * This returns true if the specific button is being held down. Otherwise
     * it will always return false.
     * 
     * @param   { number }  button The button in which you want to check.
     * @returns { boolean }        If the button is being held down.
     */

    getPointerButton ( button ) {

        return this.pointerDown.isActive( button )

    }

    /**
     * This only returns true the frame the <pointerdown> event was called
     * and the specific button was hit. Otherwise, it is always false.
     * 
     * @param   { number }  button The button in which you want to check.
     * @returns { boolean }        If the <pointerdown> event was called.
     */

    getPointerButtonDown ( button ) {

        return this.pointerDown.isCF( button )

    }

    /**
     * This only returns true the frame the <pointerup> event was called
     * and the specific button was hit. Otherwise, it is always false.
     * 
     * @param   { number }  button The button in which you want to check.
     * @returns { boolean }        If the <pointerup> event was called.
     */

    getPointerButtonUp ( button ) {

        return this.pointerUp.isCF( button )

    }

    /**
     * Put this at the end of the render loop so the "one-time" events can
     * close out and not be active.
     */

    update () {

        if ( this.pointerDown.currentFrame.length > 0 ) this.pointerDown.currentFrame.length = 0
        if ( this.pointerUp.currentFrame.length > 0 ) this.pointerUp.currentFrame.length = 0
        if ( this.keyDown.currentFrame.length > 0 ) this.keyDown.currentFrame.length = 0
        if ( this.keyUp.currentFrame.length > 0 ) this.keyUp.currentFrame.length = 0

    }

}

InputManager.prototype.isInputManager = true

export { InputManager }