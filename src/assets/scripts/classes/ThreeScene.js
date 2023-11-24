import * as THREE from 'three'
import ThreeObjectConstructors from '@scripts/classes/ThreeObjectConstructors'
import defaultSceneConfig from './default-scene-config'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { setPixelRatio } from '@scripts/utils/render-utils'
import AnimationRotation from '@scripts/services/animations/animate-rotation'
import GuiPanel from '@scripts/gui/GuiPanel'
import { isEmpty } from '@scripts/utils/utils'
import GUI from 'lil-gui'

class ThreeScene {
  constructor(config={}) {
    //merge default config with passed config
    this.config = { ...defaultSceneConfig, ...config }

    //create scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(this.config.sceneConfig.color)

    //create cameara and lighting
    this.camera = this.getThreeObject(this.config.cameraType, this.config.cameraConfig)
    this.light = this.configureLights()

    //create geometry and material
    this.geometry = this.getThreeObject(this.config.geometryType, this.config.geometryConfig, this.scene)
    this.material = this.getThreeObject(this.config.materialType, this.config.materialConfig)
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    if ( this.config.hasOwnProperty('meshConfig') && this.config.meshConfig.hasOwnProperty('rotation') ) {
      const { x, y, z } = this.config.meshConfig.rotation
      this.mesh.rotation.set(x, y, z)
    }

    if ( this.config.hasOwnProperty('showSegments') && this.config.showSegments === true ) {
      this.wireframeGeometry = new THREE.WireframeGeometry(this.geometry)
      this.wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: false, opacity: 1 })
      this.wireframe = new THREE.LineSegments(this.wireframeGeometry, this.wireframeMaterial)
      this.wireframe.depthTest = false

      this.mesh.add(this.wireframe)
    }
  }
  
  // FACTORY METHODS
  getThreeObject(type, config={}, scene) {
    if ( ThreeObjectConstructors[type] ) {
      return new ThreeObjectConstructors[type](config,scene).object
    } else {
      console.error(`No object found with type ${type}`)
      return null
    }
  }

  // CONFIGURATION METHODS
  configureLights() {
    return this.config.lightTypes.reduce((acc, curr) => {
      const { name, config } = curr
      const light = this.getThreeObject(name, config)
      return [ ...acc, light ]
    }, [])
  }

  configureRenderer(element, position, requireCanvas) {
    if ( requireCanvas === false ) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      element[position](this.renderer.domElement)
    } else {
      const elementType = element.nodeName.toLowerCase()
      if ( elementType !== 'canvas' ) {
        console.error('Invalid config. If requireCanvas is true, the element must be a canvas element. Cannot initialize ThreeScene.')
        return
      }
      this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: element })
    }

    setPixelRatio(this.renderer)
    this.renderer.setSize(this.config.sceneConfig.sizes.width, this.config.sceneConfig.sizes.height)
  }

  configureOrbitControls() {
    if ( this.config.hasOwnProperty('orbitControls') && this.config.orbitControls === true ) {
      document.body.setAttribute('mxt_orbit-controls', '')
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
      this.orbitControls.enableDamping = true
      this.orbitControls.dampingFactor = 0.05
      this.orbitControls.screenSpacePanning = false

      return true
    } else return false
  }

  // SCENE BUILDING METHOD
  buildScene(element, position, bool) {
    // create renderer
    this.configureRenderer(element, position, bool)
    
    // create controls
    const orbitControls = this.configureOrbitControls()

    // add objects to scene
    this.scene.add(this.mesh)
    this.light.forEach(light => this.scene.add(light))

    // setup animation
    this.animationFunctions = AnimationRotation({
      startPaused: this.config.startPaused,
      scene: this.scene,
      camera: this.camera,
      mesh: this.mesh,
      controls: this.orbitControls,
      renderer: this.renderer,
    })

    // render scene
    if ( orbitControls && !this.config.animateMesh ) {
      this.animationFunctions.animateControls()
    } else if ( this.config.animateMesh ) {
      this.animationFunctions.animateMesh()
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }

  // GUI PANEL BUILDING METHOD
  buildGuiPanel() {
    if ( this.config.hasOwnProperty('showGUI') && this.config.showGUI ) {
      new GuiPanel(
        {
          functions: {
            'toggleAnimation': this.animationFunctions.toggleAnimation,
            'spinXY': this.animationFunctions.spinGeometryXY,
            'resetDefaults': this.animationFunctions.resetDefaults,
          },
          scene: this.scene,
          camera: this.camera,
          renderer: this.renderer,
        }
      )
    }
  }

  // INITIALIZATION METHOD
  init(config={}) {
    const { id='body', position='append', requireCanvas=false } = config

    const refElement = id === 'body'
      ? document.body
      : document.getElementById(id)

    if ( !refElement || ( position !== 'append' && position !== 'before' && position !== 'after' ) ) {
      console.error('Invalid config. Selector must be an ID, and position must be "append", "before" or "after". Cannot initialize ThreeScene.')
      return
    }

    this.buildScene(refElement, position, requireCanvas)
    this.buildGuiPanel()
  }
}

export default ThreeScene