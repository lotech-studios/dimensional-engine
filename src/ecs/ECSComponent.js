class ECSComponent {

    constructor ( proxy ) {

        this.Engine = proxy.Engine
        this.Proxy = proxy
        
        ECSComponent.prototype.$num++

    }

    // Empty methods

    async onBuild () { /** stuff goes here */ }
    async onRemoval () { /** stuff goes here */ }
    
    onUpdate ( deltaTime, elapsedTime ) { /** stuff goes here */ }
    onAnimUpdate ( deltaTime, elapsedTime ) {/** stuff goes here */}

    //

    /**
     * Adds a property / variable to the proxy (as same name).
     * @param { String } property The property you wish to copy
     */

    addToProxy ( property ) {

        this.Proxy[ property ] = this[ property ]

    }

    update ( deltaTime, elapsedTime, updateAnim ) {

        this.onUpdate( deltaTime, elapsedTime )

        if ( updateAnim ) this.onAnimUpdate( deltaTime, elapsedTime )

    }

}

ECSComponent.prototype.$name = 'ECSComponent'
ECSComponent.prototype.$num = 0
ECSComponent.prototype.$requires = []
ECSComponent.prototype.$isECSComponent = true

export { ECSComponent }