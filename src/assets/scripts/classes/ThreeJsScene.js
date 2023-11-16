import * as THREE from 'three'
import { getAspectRatio, hasProperty } from '@scripts/utils/utils.js'
import AnimateCube from '@scripts/classes/AnimateCube.js'
import AnimateCamera from '@scripts/classes/AnimateCamera.js'
import Controls from '@scripts/classes/Controls.js'
import Info from '@scripts/classes/Info.js'

class ThreeJsScene {
  constructor(config = {}) {
    //defaults for config
    const {
      type = 'none',
      showControls = false,
      showInfo = false,
      background = 'black',
      mesh = {
        dims: [2, 2, 2],
        properties: {
          color: 'blue',
          wireframe: false,
        },
        rotation: {
          x: 0,
          y: 0,
        },
      },
      orthoCamera = {
        aspect: {
          width: 800,
          height: 600
        },
        left: -1,
        right: 1,
        top: 1,
        bottom: -1,
        near: -3,
        far: 100,
      },
      camera = {
        fov: 32,
        position: [0, 0, 8],
        aspect: {
          width: 800,
          height: 600
        },
      },
      renderer = {
        width: 800,
        height: 600
      },
    } = config

    //set from config if present, otherwise use defaults
    this.canvas = document.getElementById(config.canvas)
    
    if ( !this.canvas ) {
      console.error(`No canvas element found with an ID of ${config.canvas}`)
      return
    }
    
    this.type = config.type || type
    this.showControls = config.showControls || showControls
    this.showInfo = config.showInfo || showInfo
    this.controlsId = config.controlsId
    this.infoId = config.infoId
    this.controls = this.type === 'mesh'
      ? {
          toggleAnimation: true,
          reset: true,
          zoom: true,
        }
      : {
          reset: true,
        }

    this.background = config.background || background
    this.mesh = config.mesh || mesh
    this.orthoCamera = config.orthoCamera || orthoCamera
    this.camera = config.camera || camera
    this.renderer = config.renderer || renderer

    this.ambientLight = hasProperty(config, 'ambientLight')
      ? config.ambientLight
      : false
    this.pointLight = hasProperty(config, 'pointLight')
      ? config.pointLight
      : false

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(this.background)
  }
  
  setMesh() {
    const { dims, properties, rotation } = this.mesh
    const geometry = new THREE.BoxGeometry(...dims)
    const material = new THREE.MeshStandardMaterial(properties)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.set(rotation.x, rotation.y, rotation.z = 0)

    return mesh
  }

  // setOrthoCamera() {
  //   const { aspect, left, right, top, bottom, near, far } = this.orthoCamera
  //   const aspectRatio = getAspectRatio(aspect)
  //   const camera = new THREE.OrthographicCamera(left * aspectRatio, right * aspectRatio, top, bottom, near, far)

  //   return camera
  // }

  setCamera() {
    const { fov, position, aspect } = this.camera
    const camera = new THREE.PerspectiveCamera(fov, getAspectRatio(aspect))
    camera.position.set(...position)

    return camera
  }

  setAmbientLight() {
    const { color, intensity } = this.ambientLight
    const light = new THREE.AmbientLight(color, intensity)

    return light
  }

  setPointLight() {
    const { position, color, intensity, distance, decay } = this.pointLight
    const light = new THREE.PointLight(color, intensity, distance, decay)
    light.position.set(...position)

    return light
  }

  setRender() {
    const { width, height } = this.renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    })
    renderer.setSize(width, height)

    return renderer
  }

  init() {
    this.root = document.documentElement
    this.mesh = this.setMesh()
    // this.orthoCamera = this.setOrthoCamera()
    this.camera = this.setCamera()
    
    // this.scene.add(this.mesh, this.orthoCamera)
    this.scene.add(this.mesh, this.camera)
    
    if ( this.pointLight ) {
      const pointLight = this.setPointLight()
      this.scene.add(pointLight)
    }
    
    if ( this.ambientLight ) {
      const ambientLight = this.setAmbientLight()
      this.scene.add(ambientLight)
    }
    
    this.renderer = this.setRender()

    const assets = {
      canvas: this.canvas,
      scene: this.scene,
      mesh: this.mesh,
      // camera: this.orthoCamera,
      camera: this.camera,
      renderer: this.renderer,
    }

    if ( this.showInfo && this.type !== 'none' ) {
      if ( this.infoId === undefined ) {
        console.error('No selector for info panel provided')
        return
      }

      this.infoPanel = new Info({type: this.type, scene: this}).mount(this.infoId)
    }

    if ( this.type === 'mesh' ) {
      this.animateScene = new AnimateCube(assets).init()
      this.root.setAttribute('data-mesh-controls', '')
    } else if ( this.type === 'camera' ) {
      this.animateScene = new AnimateCamera(assets).init()
      this.root.setAttribute('data-camera-controls', '')
    } else {
      this.renderer.render(this.scene, this.camera)
      this.root.setAttribute('data-no-controls', '')
    }

    if ( this.showControls && this.type !== 'none' ) {
      if ( this.controlsId === undefined ) {
        console.error('No selector for controls panel provided')
        return
      }

      this.controlsPanel = new Controls({type: this.type, scene: this, controls: this.controls}).mount(this.controlsId)
    }

    return this
  }
}

export default ThreeJsScene