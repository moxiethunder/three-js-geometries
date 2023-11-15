import * as THREE from 'three'
import Modal from '@scripts/classes/Modal.js'
import { createDomElement, findArrayObject } from '@scripts/utils/utils.js'
import * as ICONS from '@scripts/lib/icons.js'

class Controls {
  constructor(config) {
    this.scene = config.scene
    this.controls = config.controls
    this.cameraZoom = this.scene.camera.position.z
    this.canvas = this.scene.canvas
    this.type = config.type

    if ( this.type === 'mesh') {
      this.fnToggleAnimation = this.scene.animateScene.toggleAnimation.bind(this.scene.animateScene)
      this.fnReset = this.scene.animateScene.resetCamera.bind(this.scene.animateScene)
      this.fnZoom = this.scene.animateScene.zoomCamera.bind(this.scene.animateScene)
    }

    if ( this.type === 'camera') {
      this.fnReset = this.scene.animateScene.resetCamera.bind(this.scene.animateScene)
    }

    this.data = {
      toggleAnimation: {
        type: 'button',
        domElement: null,
        fn: this.fnToggleAnimation,
        props: {
          id: 'btn-toggle-animation',
          type: 'button',
          'data-control-button': '',
          'data-action-toggle-animation': '',
          'aria-label': 'Toggle animation'
        },
        classes: ['btn', 'btn--toggle-animation'],
      },
      reset: {
        type: 'button',
        domElement: null,
        fn: this.fnReset,
        props: {
          id: 'btn-reset',
          type: 'button',
          'data-control-button': '',
          'data-action-reset': '',
          'aria-label': 'Reset camera'
        },
        classes: ['btn', 'btn--reset'],
      },
      zoomIn: {
        type: 'button',
        domElement: null,
        fn: this.fnZoom,
        props: {
          id: 'btn-zoom--in',
          type: 'button',
          'data-control-button': '',
          'data-btn-zoom': '',
          'data-action-zoom': 'in',
          'aria-label': 'Zoom in'
        },
        classes: ['btn', 'btn--zoom-in'],
      },
      zoomOut: {
        type: 'button',
        domElement: null,
        fn: this.fnZoom,
        props: {
          id: 'btn-zoom-out',
          type: 'button',
          'data-control-button': '',
          'data-btn-zoom': '',
          'data-action-zoom': 'out',
          'aria-label': 'Zoom out'
        },
        classes: ['btn', 'btn--zoom-out'],
      },
    }
  }

  createControlElement(name) {
    if ( name === 'zoom') {
      Object.assign(this.data.zoomIn, {icon: 'zoomIn'})
      Object.assign(this.data.zoomOut, {icon: 'zoomOut'})
      this.data.zoomIn.domElement = createDomElement(this.data.zoomIn)
      this.data.zoomOut.domElement = createDomElement(this.data.zoomOut)
    } else {
      Object.assign(this.data[name], {icon: name})
      this.data[name].domElement = createDomElement(this.data[name])
    }
  }

  mount(selector) {
    this.container = document.getElementById(selector)
    
    if (!this.container) {
      console.error(`No container found with selector ${selector}`)
      return
    }

    this.modal = new Modal({
      type: 'controls',
      container: this.container,
      icon: ICONS.settings,
    }).mount()

    this.canvas.setAttribute('data-playing', true)
    this.canvas.setAttribute('data-zoom', this.cameraZoom)

    Object.entries(this.controls).forEach(([key, val]) => {
      if ( !val ) return
      this.createControlElement(key)
    })

    Object.values(this.data).forEach(val => {
      const { domElement, fn } = val
      if ( !domElement || !fn ) return

      domElement.addEventListener('click', fn)
      this.modal.appendChild(domElement)
    })
  }
}

export default Controls