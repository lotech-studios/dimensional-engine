import { InterfaceTool, InterfaceToolAttribute } from './InterfaceTool.js'

class RenderInterfaceTool extends InterfaceTool {

    constructor ( engine ) {
        
        super( engine )

        this.Data = {
            fps: 0,
            memMax: 0,
            memMin: 0,
            ms: 0,
        }

        this.Selected = { 
            Camera: null, 
            Renderer: null, 
            Scene: null 
        }

        this.Time = {
            begin: performance.now(),
            frames: 0,
            prev: performance.now(),
        }

        this.createElements()
        this.hide()

    }

    createElements () {

        this.Elements.Main = document.createElement( 'div' )
        this.Elements.Main.style.position = 'absolute'
        this.Elements.Main.style.left = '8px'
        this.Elements.Main.style.top = '8px'
        this.Elements.Main.style.width = '340px'
        this.Elements.Main.style.height = '608px'
        this.Elements.Main.style.display = 'inline-block'
        this.Elements.Main.style.backgroundColor = 'rgba( 0, 0, 0, 0.75 )'
        this.Elements.Main.style.borderRadius = '4px'
        this.Elements.Main.style.pointerEvents = 'all' 
        this.Elements.Main.style.fontFamily = 'consolas'
        this.Elements.Main.style.zIndex = '9999999'
        this.Elements.Main.style.overflow = 'hidden'

        // renderer select

        this.Elements.RendererSelectLabel = document.createElement( 'div' )
        this.Elements.RendererSelectLabel.innerHTML = 'Renderer selected'
        this.Elements.RendererSelectLabel.style.color = 'white'
        this.Elements.RendererSelectLabel.style.margin = '0px 4px 0px 8px'
        this.Elements.RendererSelectLabel.style.fontSize = '14px'

        this.Elements.RendererSelectMenu = document.createElement( 'select' )
        this.Elements.RendererSelectMenu.style.margin = '0px 4px 0px 4px'
        this.Elements.RendererSelectMenu.style.fontFamily = 'consolas'
        this.Elements.RendererSelectMenu.style.backgroundColor = 'rgba( 0, 0, 0, 0.5 )'
        this.Elements.RendererSelectMenu.style.border = 'none'
        this.Elements.RendererSelectMenu.style.height = '20px'
        this.Elements.RendererSelectMenu.style.color = 'white'
        this.Elements.RendererSelectMenu.style.borderRadius = '4px'
        this.Elements.RendererSelectMenu.style.cursor = 'pointer'

        this.Elements.RendererSelectMenu.addEventListener( 'change', ( e ) => this.selectRenderer( e.target.value ) )

        this.Elements.RendererSelectRefresh = document.createElement( 'div' )
        this.Elements.RendererSelectRefresh.innerHTML = '↻'
        this.Elements.RendererSelectRefresh.style.margin = '0px 4px 0px 4px'
        this.Elements.RendererSelectRefresh.style.fontFamily = 'consolas'
        this.Elements.RendererSelectRefresh.style.backgroundColor = 'rgba( 0, 0, 0, 0.5 )'
        this.Elements.RendererSelectRefresh.style.border = 'none'
        this.Elements.RendererSelectRefresh.style.width = '20px'
        this.Elements.RendererSelectRefresh.style.height = '20px'
        this.Elements.RendererSelectRefresh.style.color = 'white'
        this.Elements.RendererSelectRefresh.style.borderRadius = '4px'
        this.Elements.RendererSelectRefresh.style.textAlign = 'center'
        this.Elements.RendererSelectRefresh.style.cursor = 'pointer'

        this.Elements.RendererSelectRefresh.addEventListener( 'pointerup', () => this.refreshRendererList() )

        this.Elements.RendererSelect = document.createElement( 'div' )
        this.Elements.RendererSelect.style.width = '100%'
        this.Elements.RendererSelect.style.height = '24px'
        this.Elements.RendererSelect.style.display = 'flex'
        this.Elements.RendererSelect.style.alignItems = 'center'
        this.Elements.RendererSelect.style.justifyContent = 'flex-start'

        this.Elements.RendererSelect.appendChild( this.Elements.RendererSelectLabel )
        this.Elements.RendererSelect.appendChild( this.Elements.RendererSelectMenu )
        this.Elements.RendererSelect.appendChild( this.Elements.RendererSelectRefresh )

        // camera select

        this.Elements.CameraSelectLabel = document.createElement( 'div' )
        this.Elements.CameraSelectLabel.innerHTML = 'Camera selected'
        this.Elements.CameraSelectLabel.style.color = 'white'
        this.Elements.CameraSelectLabel.style.margin = '0px 4px 0px 8px'
        this.Elements.CameraSelectLabel.style.fontSize = '14px'

        this.Elements.CameraSelectMenu = document.createElement( 'select' )
        this.Elements.CameraSelectMenu.style.margin = '0px 4px 0px 4px'
        this.Elements.CameraSelectMenu.style.fontFamily = 'consolas'
        this.Elements.CameraSelectMenu.style.backgroundColor = 'rgba( 0, 0, 0, 0.5 )'
        this.Elements.CameraSelectMenu.style.border = 'none'
        this.Elements.CameraSelectMenu.style.height = '20px'
        this.Elements.CameraSelectMenu.style.color = 'white'
        this.Elements.CameraSelectMenu.style.borderRadius = '4px'
        this.Elements.CameraSelectMenu.style.cursor = 'pointer'

        this.Elements.CameraSelectMenu.addEventListener( 'change', ( e ) => this.selectCamera( e.target.value ) )

        this.Elements.CameraSelectRefresh = document.createElement( 'div' )
        this.Elements.CameraSelectRefresh.innerHTML = '↻'
        this.Elements.CameraSelectRefresh.style.margin = '0px 4px 0px 4px'
        this.Elements.CameraSelectRefresh.style.fontFamily = 'consolas'
        this.Elements.CameraSelectRefresh.style.backgroundColor = 'rgba( 0, 0, 0, 0.5 )'
        this.Elements.CameraSelectRefresh.style.border = 'none'
        this.Elements.CameraSelectRefresh.style.width = '20px'
        this.Elements.CameraSelectRefresh.style.height = '20px'
        this.Elements.CameraSelectRefresh.style.color = 'white'
        this.Elements.CameraSelectRefresh.style.borderRadius = '4px'
        this.Elements.CameraSelectRefresh.style.textAlign = 'center'
        this.Elements.CameraSelectRefresh.style.cursor = 'pointer'

        this.Elements.CameraSelectRefresh.addEventListener( 'pointerup', () => this.refreshCameraList() )

        this.Elements.CameraSelect = document.createElement( 'div' )
        this.Elements.CameraSelect.style.width = '100%'
        this.Elements.CameraSelect.style.height = '24px'
        this.Elements.CameraSelect.style.display = 'flex'
        this.Elements.CameraSelect.style.alignItems = 'center'
        this.Elements.CameraSelect.style.justifyContent = 'flex-start'

        this.Elements.CameraSelect.appendChild( this.Elements.CameraSelectLabel )
        this.Elements.CameraSelect.appendChild( this.Elements.CameraSelectMenu )
        this.Elements.CameraSelect.appendChild( this.Elements.CameraSelectRefresh )

        // scene select

        this.Elements.SceneSelectLabel = document.createElement( 'div' )
        this.Elements.SceneSelectLabel.innerHTML = 'Scene selected'
        this.Elements.SceneSelectLabel.style.color = 'white'
        this.Elements.SceneSelectLabel.style.margin = '0px 4px 0px 8px'
        this.Elements.SceneSelectLabel.style.fontSize = '14px'

        this.Elements.SceneSelectMenu = document.createElement( 'select' )
        this.Elements.SceneSelectMenu.style.margin = '0px 4px 0px 4px'
        this.Elements.SceneSelectMenu.style.fontFamily = 'consolas'
        this.Elements.SceneSelectMenu.style.backgroundColor = 'rgba( 0, 0, 0, 0.5 )'
        this.Elements.SceneSelectMenu.style.border = 'none'
        this.Elements.SceneSelectMenu.style.height = '20px'
        this.Elements.SceneSelectMenu.style.color = 'white'
        this.Elements.SceneSelectMenu.style.borderRadius = '4px'
        this.Elements.SceneSelectMenu.style.cursor = 'pointer'

        this.Elements.SceneSelectMenu.addEventListener( 'change', ( e ) => this.selectScene( e.target.value ) )

        this.Elements.SceneSelectRefresh = document.createElement( 'div' )
        this.Elements.SceneSelectRefresh.innerHTML = '↻'
        this.Elements.SceneSelectRefresh.style.margin = '0px 4px 0px 4px'
        this.Elements.SceneSelectRefresh.style.fontFamily = 'consolas'
        this.Elements.SceneSelectRefresh.style.backgroundColor = 'rgba( 0, 0, 0, 0.5 )'
        this.Elements.SceneSelectRefresh.style.border = 'none'
        this.Elements.SceneSelectRefresh.style.width = '20px'
        this.Elements.SceneSelectRefresh.style.height = '20px'
        this.Elements.SceneSelectRefresh.style.color = 'white'
        this.Elements.SceneSelectRefresh.style.borderRadius = '4px'
        this.Elements.SceneSelectRefresh.style.textAlign = 'center'
        this.Elements.SceneSelectRefresh.style.cursor = 'pointer'

        this.Elements.SceneSelectRefresh.addEventListener( 'pointerup', () => {

            this.refreshSceneList()
            this.refreshSceneObjectList()

        } )

        this.Elements.SceneSelect = document.createElement( 'div' )
        this.Elements.SceneSelect.style.width = '100%'
        this.Elements.SceneSelect.style.height = '24px'
        this.Elements.SceneSelect.style.display = 'flex'
        this.Elements.SceneSelect.style.alignItems = 'center'
        this.Elements.SceneSelect.style.justifyContent = 'flex-start'

        this.Elements.SceneSelect.appendChild( this.Elements.SceneSelectLabel )
        this.Elements.SceneSelect.appendChild( this.Elements.SceneSelectMenu )
        this.Elements.SceneSelect.appendChild( this.Elements.SceneSelectRefresh )

        // scene objects

        this.Elements.SceneObjectsList = document.createElement( 'div' )
        this.Elements.SceneObjectsList.style.margin = '6px 0px 6px 8px'
        this.Elements.SceneObjectsList.style.width = 'calc( 100% - 16px )'
        this.Elements.SceneObjectsList.style.height = '256px'
        this.Elements.SceneObjectsList.style.display = 'inline-block'
        this.Elements.SceneObjectsList.style.overflowX = 'hidden'
        this.Elements.SceneObjectsList.style.overflowY = 'auto'
        this.Elements.SceneObjectsList.style.borderRadius = '4px'
        this.Elements.SceneObjectsList.style.backgroundColor = 'rgba( 0, 0, 0, 0.25 )'

        // Append all children to main

        this.createHeading( 'Renderers', 'rgba(0, 0, 0, 0.25)', '32px', '18px' )

        this.Elements.Main.appendChild( this.Elements.RendererSelect )
        this.Elements.Main.appendChild( this.Elements.CameraSelect )
        this.Elements.Main.appendChild( this.Elements.SceneSelect )
        this.Elements.Main.appendChild( this.Elements.SceneObjectsList )

        // attributes

        this.createHeading( 'In-frame Data', 'rgba(0, 0, 0, 0.25)', '24px', '16px' )
        this.createHeading( 'Updated every <div style="color:limegreen;display:inline;">1s<div>', 'rgba(0, 0, 0, 0.125)', '16px', '12px' )

        this.createAttribute( 'DrawCalls', 'Draw Calls', '', 'cyan' )
        this.createAttribute( 'Poly', 'Polygons', '', 'cyan' )
        this.createAttribute( 'Points', 'Points', '', 'cyan' )
        this.createAttribute( 'Lines', 'Lines', '', 'cyan' )
        this.createAttribute( 'Geometries', 'Geometries', '', 'magenta' )
        this.createAttribute( 'Textures', 'Textures', '', 'magenta' )

        this.createHeading( 'General Data', 'rgba(0, 0, 0, 0.25)', '24px', '16px' )
        this.createHeading( 'Updated every <div style="color:limegreen;display:inline;">1s<div>', 'rgba(0, 0, 0, 0.125)', '16px', '12px' )

        this.createAttribute( 'FPS', 'FPS', '', 'cyan' )
        this.createAttribute( 'Mem', 'Memory Usage', 'MB', 'magenta' )
        this.createAttribute( 'MS', 'Latency', 'MS', 'limegreen' )

        this.Engine.Managers.Interface.Elements.Main.appendChild( this.Elements.Main )

    }

    refreshCameraList () {

        this.Elements.CameraSelectMenu.innerHTML = ''

        for ( let i = 0; i < this.Engine.Managers.Camera.Cameras.array.length; i++ ) {

            const Element = document.createElement( 'option' )
            Element.innerHTML = this.Engine.Managers.Camera.Cameras.nameToIndex[ i ]

            this.Elements.CameraSelectMenu.appendChild( Element )

        }
        
    }

    refreshRendererList () {

        this.Elements.RendererSelectMenu.innerHTML = ''

        for ( const r in this.Engine.Managers.Renderer.Renderers.Collection ) {

            const Element = document.createElement( 'option' )
            Element.innerHTML = r

            this.Elements.RendererSelectMenu.appendChild( Element )

        }

        this.refreshCameraList()
        this.refreshSceneList()
        this.refreshSceneObjectList()
        
    }

    refreshSceneList () {

        this.Elements.SceneSelectMenu.innerHTML = ''

        for ( let i = 0; i < this.Engine.Managers.Scene.Scenes.array.length; i++ ) {

            const Element = document.createElement( 'option' )
            Element.innerHTML = this.Engine.Managers.Scene.Scenes.nameToIndex[ i ]

            this.Elements.SceneSelectMenu.appendChild( Element )

        }
        
    }

    refreshSceneObjectList () {

        let count = 0

        this.Elements.SceneObjectsList.innerHTML = ''

        this.Selected.Scene.traverse( ( child ) => {

            if ( child.isMesh || child.isGroup ) {

                const Element = document.createElement( 'div' )
                Element.style.width = '100%'
                Element.style.height = '24px'
                Element.style.display = 'flex'
                Element.style.flexDirection = 'row'
                Element.style.alignItems = 'center'
                Element.style.justifyContent = 'flex-start'
                Element.style.whiteSpace = 'nowrap'
                Element.style.cursor = 'pointer'
                
                if ( count % 2 == 0 ) Element.style.backgroundColor = 'rgba( 0, 0, 0, 0.25 )'
            
                // subs

                const Eye = document.createElement( 'div' )
                Eye.setAttribute( 'uuid', child.uuid )
                Eye.innerHTML = '👁'
                Eye.style.width = '24px'
                Eye.style.height = '24px'
                Eye.style.color = child.visible && child.parent.visible ? 'limegreen' : 'grey'
                Eye.style.fontSize = '16px'
                Eye.style.margin = '0px 0px 0px 8px'

                Eye.addEventListener( 'pointerup', ( e ) => {

                    const uuid = e.target.getAttribute( 'uuid' )

                    this.Selected.Scene.traverse( ( _child ) => {

                        if ( _child.uuid == uuid ) {

                            if ( _child.visible ) _child.visible = false
                            else _child.visible = true

                        }

                    } )

                    this.refreshSceneObjectList()

                } )

                const Name = document.createElement( 'div' )
                Name.innerHTML = child.name.length > 0 ? child.name : 
                    child.isGroup ? 'Unnamed Group' : 'Unnamed Mesh'
                Name.style.color = 'white'
                Name.style.margin = '0px 8px 0px 8px'
                Name.style.fontSize = '14px'

                const Type = document.createElement( 'div' )
                Type.innerHTML = `${ child.isGroup ? 'Group' : 'Mesh' } ${ 
                    child.parent && !child.parent.isScene ? ` (P: ${ child.parent.name.length > 0 ? child.parent.name : 
                    child.parent.isGroup ? 'Unnamed Group' : 'Unnamed Mesh' })` : '' }`
                Type.style.color = 'magenta'
                Type.style.margin = '0px 8px 0px 4px'
                Type.style.fontSize = '12px'

                const UUID = document.createElement( 'div' )
                UUID.innerHTML = child.uuid
                UUID.style.color = 'cyan'
                UUID.style.margin = '0px 8px 0px 8px'
                UUID.style.fontSize = '12px'

                // append subs to main

                Element.appendChild( Eye )
                Element.appendChild( Name )
                Element.appendChild( Type )
                Element.appendChild( UUID )

                // append all to list

                this.Elements.SceneObjectsList.appendChild( Element )

                count++

            }

        } )

    }

    selectCamera ( name ) {

        const CAMERA = this.Engine.Managers.Camera.get( name )

        this.Selected.Camera = CAMERA

        this.Elements.CameraSelectMenu.value = name

        this.Selected.Renderer.setCamera( CAMERA )

    }

    selectRenderer ( name ) {

        const RENDERER = this.Engine.Managers.Renderer.get( name )

        this.Selected.Renderer = RENDERER

        this.Elements.RendererSelectMenu.value = name

        this.selectScene( RENDERER.Scene.name )
        this.selectCamera( RENDERER.Camera.name )

    }

    selectScene ( name ) {

        const SCENE = this.Engine.Managers.Scene.get( name )

        this.Selected.Scene = SCENE

        this.Elements.SceneSelectMenu.value = name

        this.Selected.Renderer.setScene( SCENE )

    }

    begin () {

        if ( this.displayed ) this.Time.begin = performance.now()

    }

    end () {

        if ( this.displayed ) {

            this.Time.frames++

            const TIME = performance.now()

            this.Data.ms = Math.round( TIME - this.Time.begin )

            if ( TIME >= this.Time.prev + 1000 ) {

                this.Data.fps = Math.round( ( this.Time.frames * 1000 ) / ( TIME - this.Time.prev ) )

                this.Time.prev = TIME
                this.Time.frames = 0

                const MEMORY = performance.memory

                this.Data.memMin = Math.round( MEMORY.usedJSHeapSize / 1048576 )
                this.Data.memMax = Math.round( MEMORY.jsHeapSizeLimit  / 1048576 )

                if ( this.Selected.Renderer ) {

                    this.Attributes[ 'DrawCalls' ].update( this.Selected.Renderer.Renderer.info.render.calls )
                    this.Attributes[ 'Poly' ].update( this.Selected.Renderer.Renderer.info.render.triangles )
                    this.Attributes[ 'Points' ].update( this.Selected.Renderer.Renderer.info.render.points )
                    this.Attributes[ 'Lines' ].update( this.Selected.Renderer.Renderer.info.render.lines )

                    this.Attributes[ 'Geometries' ].update( this.Selected.Renderer.Renderer.info.memory.geometries )
                    this.Attributes[ 'Textures' ].update( this.Selected.Renderer.Renderer.info.memory.textures )

                }

                this.Attributes[ 'FPS' ].update( `${ this.Data.fps } (Anim: ${ this.Engine.Settings.animUpdateInterval })` )
                this.Attributes[ 'Mem' ].update( `${ this.Data.memMin } / ${ this.Data.memMax }` )
                this.Attributes[ 'MS' ].update( this.Data.ms )

            }
            
        }

    }

}

export { RenderInterfaceTool }