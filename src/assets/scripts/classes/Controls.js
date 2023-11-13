import { createDomElement } from '@scripts/utils/utils.js'

class Controls {
  constructor(config) {
    this.scene = config.scene
    this.fnPlay = this.scene.animateScene.startAnimation.bind(this.scene.animateScene)
    this.fnPause = this.scene.animateScene.stopAnimation.bind(this.scene.animateScene)
    this.fnZoom = this.scene.animateScene.zoomCamera.bind(this.scene.animateScene)
    this.fnReset = this.scene.animateScene.resetCamera.bind(this.scene.animateScene)
    this.playButton = config.controls.play
    this.pauseButton = config.controls.pause
    this.zoomButtons = config.controls.zoom
    this.resetButton = config.controls.reset

    this.cameraZoom = this.scene.camera.position.z
    this.canvas = this.scene.canvas
  }

  createControlElement(config, parent) {
    const control = createDomElement(config.data)
    control.innerText = config.label || ''
    control.addEventListener('click', (event) => config.fn(event, control))
    parent.appendChild(control)

    return control
  }

  mount(selector) {
    let btnPlay, btnPause, btnZoomIn, btnZoomOut
    this.container = document.getElementById(selector)

    if (!this.container) {
      console.error(`No container found with selector ${selector}`)
      return
    }

    this.canvas.setAttribute('data-playing', true)
    this.canvas.setAttribute('data-zoom', this.cameraZoom)

    if ( this.playButton ) {
      btnPlay = this.createControlElement({
        label: 'Play',
        fn: this.fnPlay,
        data: {
          type: 'button',
          props: {
            id: 'btn-play',
            type: 'button',
            'data-action-play': '',
            'aria-label': 'Play animation'
          },
          classes: ['btn', 'btn--play'],
        }
      }, this.container)
    }

    if ( this.pauseButton ) {
      btnPause = this.createControlElement({
        label: 'Pause',
        fn: this.fnPause,
        data: {
          type: 'button',
          props: {
            id: 'btn-pause',
            type: 'button',
            'data-action-pause': '',
            'aria-label': 'Pause animation'
          },
          classes: ['btn', 'btn--pause'],
        }
      }, this.container)
    }

    if ( this.resetButton ) {
      this.createControlElement({
        label: 'Reset',
        fn: this.fnReset,
        data: {
          type: 'button',
          props: {
            id: 'btn-reset',
            type: 'button',
            'data-action-reset': '',
            'aria-label': 'Reset camera'
          },
          classes: ['btn', 'btn--reset'],
        }
      }, this.container)
    }

    if ( this.zoomButtons ) {
      btnZoomIn = this.createControlElement({
        fn: this.fnZoom,
        data: {
          type: 'button',
          props: {
            id: 'btn-zoom--in',
            type: 'button',
            'data-btn-zoom': '',
            'data-action-zoom': 'in',
            'aria-label': 'Zoom in'
          },
          classes: ['btn', 'btn--zoom-in'],
        }
      }, this.container)

      btnZoomOut = this.createControlElement({
        fn: this.fnZoom,
        data: {
          type: 'button',
          props: {
            id: 'btn-zoom-out',
            type: 'button',
            'data-btn-zoom': '',
            'data-action-zoom': 'out',
            'aria-label': 'Zoom out'
          },
          classes: ['btn', 'btn--zoom-out'],
        }
      }, this.container)

      if ( this.playButton && btnPlay !== null ) {
        btnPlay.before(btnZoomOut)
      }
    }
  }
}

export default Controls