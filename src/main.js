import '@styles/main.scss'
import ThreeJsScene from '@scripts/classes/ThreeJsScene.js'

const sizes = {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
}

const sceneConfig = {
  type: 'camera',
  canvas: 'threejs-cube',
  background: 'black',
  mesh: {
    dims: [1, 1, 1],
    properties: {
      color: 'red',
      wireframe: false,
      roughness: 0.5,
      metalness: 0.5,
    },
    rotation: {
      x: Math.PI * 0.125,
      y: Math.PI * 0.25,
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
    intensity: 0.25,
  },
  pointLight: {
    position: [1, 2, 1],
    color: 'white',
    intensity: 5,
    distance: 1000,
    decay: 2,
  },
  showControls: true,
  showInfo: true,
  controlsId: 'animation-controls',
  infoId: 'info-panel',
}

const SCENE = new ThreeJsScene(sceneConfig).init()