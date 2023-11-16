import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { getPointerPOS } from '@scripts/utils/utils.js'
import { findArrayObject } from '@scripts/utils/utils'
import { renderCameraData, renderMeshData } from '@scripts/utils/render-data.js'
import EventBus from '@scripts/services/EventBus.js'

class AnimateCamera {
  constructor(config) {
    this.canvas = config.canvas
    this.scene = config.scene
    this.mesh = config.mesh
    this.camera = config.camera
    this.renderer = config.renderer
    this.ogData = this.getOgData({
      arrayToCheck: this.scene.children,
      instance: THREE.PerspectiveCamera,
      props: ['position', 'fov']
    })

    this.vars = {
      isDragging: false,
      pointer: {
        x: 0,
        y: 0,
      },
      sizes: {
        width: this.canvas.width,
        height: this.canvas.height,
      },
      scroll: {
        sy: 0.05,
        dy: 0,
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    if ( this.vars.isDragging ) {
      this.panOnDrag()
      EventBus.publish('CameraUpdated', this.camera)
    }
    this.renderer.render(this.scene, this.camera)
  }
  
  setCameraCoords(e) {
    const { x, y } = getPointerPOS(e)
    const { width, height } = this.vars.sizes
    
    this.vars.pointer.x = x / width - 0.5
    this.vars.pointer.y = -(y / height - 0.5)
  }

  panOnDrag() {
    const targetX = Math.sin(this.vars.pointer.x * Math.PI * 2) * 3
    const targetZ = Math.cos(this.vars.pointer.x * Math.PI * 2) * 3
    const targetY = this.vars.pointer.y * 5
    
    gsap.to(this.camera.position, {
      x: targetX,
      z: targetZ,
      y: targetY,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        this.camera.lookAt(this.mesh.position)
      }
    })
  }

  zoomOnScroll(e) {
    const { deltaY } = e
    const data = this.vars.scroll
    data.dy = deltaY
    const camera = this.camera

    const newFov = Math.max(20, Math.min(150, camera.fov + deltaY * data.sy))

    gsap.to(camera, {
      fov: newFov,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    })

    EventBus.publish('CameraUpdated', this.camera)
  }

  attachEventListeners() {
    this.canvas.addEventListener('mousemove', e => {
      this.onMouseMove(e)
    })

    this.canvas.addEventListener('mousedown', e => {
      this.onMouseDown(e)
    })

    this.canvas.addEventListener('mouseup', e => {
      this.onMouseUp(e)
    })

    document.addEventListener('wheel', e => {
      this.zoomOnScroll(e)
    })
  }

  onMouseDown(e) {
    this.vars.isDragging = true
    this.canvas.setAttribute('data-grabbing', '')
  }

  onMouseMove(e) {
    this.setCameraCoords(e)
  }

  onMouseUp(e) {
    this.vars.isDragging = false
    this.canvas.removeAttribute('data-grabbing')
  }

  getOgData(data) {
    const { arrayToCheck, instance, props } = data;
    const info = findArrayObject(arrayToCheck, instance);
  
    return props.reduce((acc, prop) => {
      if (typeof info[prop] === 'object' && info[prop] !== null) {
        acc[prop] = info[prop].clone();
      } else {
        acc[prop] = info[prop];
      }
      return acc;
    }, {});
  }

  resetCamera() {
    this.camera.position.set(...this.ogData.position)
    this.camera.fov = this.ogData.fov
    this.camera.updateProjectionMatrix()
    this.camera.lookAt(this.mesh.position)
    EventBus.publish('CameraUpdated', this.camera)
  }

  init() {
    this.attachEventListeners()
    this.animate()
    return this
  }
}

export default AnimateCamera