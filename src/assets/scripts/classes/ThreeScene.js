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

  configureStatsElement() {
    if ( this.config.hasOwnProperty('showStats') && this.config.showStats === true ) {
      this.stats = new Stats()
      document.body.appendChild(this.stats.dom)
    }
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

  configureHelpers() {
    if ( this.config.hasOwnProperty('helpers') && this.config.helpers.length > 0 ) {
      return this.helpers = this.config.helpers.reduce((acc, curr) => {
        const type = curr.type
        if ( type === 'CameraHelper') {
          const helper = new THREE.CameraHelper(this.camera)
          return [ ...acc, helper ]
        }

        if ( type === 'BoxHelper' ) {
          const helper = new THREE.BoxHelper(this.mesh, ...curr.config)
          return [ ...acc, helper ]
        }

        if ( type !== 'CameraHelper' || type !== 'BoxHelper' ) {
          const helper = new THREE[type](...curr.config)
          return [ ...acc, helper ]
        }

        return acc
      }, [])
    } else return false
  }

  // SCENE BUILDING METHOD
  buildScene(element, position, bool) {
    // create renderer
    this.configureRenderer(element, position, bool)

    // create controls & helpers
    const orbitControls = this.configureOrbitControls()
    const helpers = this.configureHelpers()
    this.configureStatsElement()

    // add objects to scene
    this.scene.add(this.mesh)
    this.light.forEach(light => this.scene.add(light))
    if ( helpers !== false && helpers !== undefined ) {
      helpers.forEach(helper => this.scene.add(helper))
    }

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

  }

  scratchFunction() {
    
    const geometry = this.geometry
    const mesh = this.mesh
    const material = this.material
    const camera = this.camera
    const lights = this.light

    // console.log(this.scene)

    // console.log(geometry, mesh, material, camera, lights)

    const guiFunctions = {
      toggleAnimation: this.animationFunctions.toggleAnimation,
    }

    this.animationFunctions.toggleAnimation()

    const guiArray = []

    const controlsGUI = new GUI({
      title: 'ThreeScene',
      width: 300,
    })

    const statsGUI = new GUI({
      title: 'Stats',
      width: 300,
    })

    controlsGUI.domElement.id = 'mxt-controlsGUI--controls'
    statsGUI.domElement.id = 'mxt-controlsGUI--stats'
    guiArray.push(controlsGUI, statsGUI)

    guiArray.forEach(modal => {
      modal.domElement.setAttribute('mxt_theme_dark', '')
    })

    controlsGUI.add(guiFunctions, 'toggleAnimation').name('Toggle Animation')
    controlsGUI.addColor(this.scene, 'background').name('scene background')
    controlsGUI.addColor(material, 'color').name('material color')

    const statsConfig = {
      meshRotationX: mesh.rotation.x,
      meshRotationY: mesh.rotation.y,
      meshRotationZ: mesh.rotation.z,
    }

    const statsArray = []

    const meshRotationXStat = statsGUI.add(statsConfig, 'meshRotationX').name('mesh rotation x')
    const meshRotationYStat = statsGUI.add(statsConfig, 'meshRotationY').name('mesh rotation y')
    const meshRotationZStat = statsGUI.add(statsConfig, 'meshRotationZ').name('mesh rotation z')

    meshRotationXStat.disable()
    meshRotationYStat.disable()
    meshRotationZStat.disable()

    statsArray.push(meshRotationXStat, meshRotationYStat, meshRotationZStat)

    statsArray.forEach(stat => {
      stat.domElement.setAttribute('mxt_appearance_normal', '')
    })

    const cameraFolder = controlsGUI.addFolder('Camera')
    const geometryFolder = controlsGUI.addFolder('Geometry')
    const meshFolder = controlsGUI.addFolder('Material')
    const pointLightFolder = controlsGUI.addFolder('Point Lighting')
    const ambientLightingFolder = controlsGUI.addFolder('Ambient Lighting')

    geometryFolder.add(material, 'wireframe').name('wireframe')
    geometryFolder.add(mesh.scale, 'x', 0.01, 30, 0.1).name('width')
    geometryFolder.add(mesh.scale, 'y', 0.01, 30, 0.1).name('height')
    geometryFolder.add(mesh.scale, 'z', 0.01, 30, 0.1).name('depth')

    meshFolder.add(mesh.position, 'x', -10, 10, 0.1).name('position x')
    meshFolder.add(mesh.position, 'y', -10, 10, 0.1).name('position y')
    meshFolder.add(mesh.position, 'z', -10, 10, 0.1).name('position z')

    meshFolder.add(mesh.rotation, 'x', -Math.PI, Math.PI, 0.01).name('rotation x').onChange(event => {
      meshRotationXStat.setValue(event)
    })
    meshFolder.add(mesh.rotation, 'y', -Math.PI, Math.PI, 0.01).name('rotation y')
    meshFolder.add(mesh.rotation, 'z', -Math.PI, Math.PI, 0.01).name('rotation z')

    pointLightFolder.add(lights[1].position, 'x', -10, 10, 0.1).name('position x')
    pointLightFolder.add(lights[1].position, 'y', -10, 10, 0.1).name('position y')
    pointLightFolder.add(lights[1].position, 'z', -10, 10, 0.1).name('position z')
    pointLightFolder.add(lights[1], 'intensity', 0, 50, 0.1).name('intensity')
    pointLightFolder.add(lights[1], 'decay', 0, 50, 0.1).name('decay')

    ambientLightingFolder.add(lights[0], 'intensity', 0, 50, 0.1).name('intensity')
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

    if ( this.config.hasOwnProperty('guiPanels') && !isEmpty(this.config.guiPanels) ) {
      new GuiPanel(
        {
          functions: {
            'toggle animation': this.animationFunctions.toggleAnimation,
            'spin XY': this.animationFunctions.spinGeometryXY,
            'reset defaults': this.animationFunctions.resetDefaults,
          },
          scene: this.scene,
          camera: this.camera,
          renderer: this.renderer
        },
        this.config.guiPanels
      )
    }

    // this.scratchFunction()
  }
}

export default ThreeScene