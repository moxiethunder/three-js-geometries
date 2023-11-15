import '@styles/main.scss'
import ThreeJsScene from '@scripts/classes/ThreeJsScene.js'

const sizes = {
  // width: window.innerWidth,
  // height: window.innerHeight
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
      x: Math.PI * 0,
      y: Math.PI * 0,
    }
  },
  camera: {
    fov: 75,
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
    intensity: 0.5,
  },
  pointLight: {
    position: [1, 2, 1],
    color: 'white',
    intensity: 7,
    distance: 1000,
    decay: 2,
  },
  showControls: true,
  showInfo: true,
  controlsId: 'animation-controls',
  infoId: 'info-panel',
}

const SCENE = new ThreeJsScene(sceneConfig).init()