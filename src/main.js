import '@styles/main.scss'
import EventBus from '@scripts/services/EventBus'
import { renderOnResize } from '@scripts/services/event-handlers'
import setupGlobalListeners from '@scripts/services/global-listeners'
import ThreeScene from '@scripts/classes/ThreeScene'

/**
 * 
 * Fix sizes to pass into event listeners
 * Add wireframe in BoxGeometry to rotate animation
 * Check on OrbitControls açc12utoRotate property
 * Add MeshStandardMaterial tranparency and opacity to GUI
 * Write color functions for GUI pickers
 * Create a style theme for GUI
 * Add font to site - space mono and space grostesque
 * Create hide/show functions for GUI
 * Create function to collapse/expand all folders
 */


const threeScene = new ThreeScene({
  // showStats: true,
  // showSegments: true,
  orbitControls: true,
  animateMesh: true,
  startPaused: true,
  cameraConfig: {
    // focus: 5,
    position: {
      x: 0.31,
      y: 1.61,
      z: 4.75,
    },
  },
  materialConfig: {
    // emissive: 0x049ef4,
    color: 0xff0000,
    transparent: false,
    opacity: 1,
    roughness: 0.25,
    metalness: 0.75,
  },
  meshConfig: {
    rotation: {
      x: Math.PI * 0.125,
      y: Math.PI * 0.25,
      z: 0,
    },
  },
  lightTypes: [
    {
      name: 'AmbientLight',
      config: {
        intensity: 0.5,
      },
    },
    {
      name: 'PointLight',
      config: {
        color: 0xffffff,
        intensity: 12,
        distance: 1000,
        decay: 2,
        position: {
          x: 1,
          y: 2,
          z: 1,
        },
      },
    }
    // {
    //   name: 'DirectionalLight',
    //   config: {
    //     intensity: 5,
    //     position: {
    //       x: 0,
    //       y: 0,
    //       z: 0,
    //     },
    //   },
    // },
  ],
  helpers: [
    {
      type: 'AxesHelper',
      config: [5]
    }
  ]
})

threeScene.init({id: 'scene', requireCanvas: true})

EventBus.subscribe('WindowResized', renderOnResize)
setupGlobalListeners(threeScene)