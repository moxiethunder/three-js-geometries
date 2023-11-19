import '@styles/main.scss'
import ThreeJsScene from '@scripts/classes/ThreeJsScene'
import EventBus from '@scripts/services/EventBus'
import { rerenderScene } from '@scripts/services/EventHandlers'

EventBus.subscribe('WindowResized', rerenderScene)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const sceneConfig = {
  type: 'mesh',
  canvas: 'threejs-cube',
  background: '#242424',
  mesh: {
    dims: [1, 1, 1],
    properties: {
      color: '#ffffff',
      wireframe: false,
      roughness: 0.5,
      metalness: 0.5,
    },
    rotation: {
      x: 0,
      y: 0,
      // x: Math.PI * 0.125,
      // y: Math.PI * 0.25,
    }
  },
  camera: {
    fov: 65,
    position: [0, 0, 2],
    aspect: {
      width: sizes.width,
      height: sizes.height,
    }
  },
  renderer: {
    width: sizes.width,
    height: sizes.height,
  },
  ambientLight: {
    color: '#ffffff',
    intensity: 0.75,
  },
  pointLight: {
    position: [1, 2, 1],
    color: 'white',
    intensity: 12,
    distance: 1000,
    decay: 2,
  },
  showControlPanel: true,
  showInfoPanel: true,
  showSceneControls: true,
  controlsId: 'animation-controls',
  infoId: 'info-panel',
  sceneControlsId: 'scene-controls',
}

const SCENE = new ThreeJsScene(sceneConfig).init()

window.addEventListener('resize', (e) => {
  EventBus.publish('WindowResized', {e, sizes, SCENE})
})