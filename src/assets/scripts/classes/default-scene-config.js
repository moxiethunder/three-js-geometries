const material = 'MeshStandardMaterial'
const camera = 'PerspectiveCamera'
const geometry = 'BoxGeometry'
const light = ['PointLight', 'AmbientLight']

const defaultSceneConfig = {
  // SCENE DATA
  sceneConfig: {
    sizes: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    color: 0x000000,
  },

  // OBJECTS
  materialType: material,
  cameraType: camera,
  geometryType: geometry,

  // OBJECT CONFIGS
  cameraConfig: {
    position: {
      x: 0.31,
      y: 1.61,
      z: 4.75,
    },
  },
  materialConfig: {
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

  // LIGHTS
  lightTypes: [
    {
      name: light[1],
      config: {
        intensity: 0.5,
      },
    },
    {
      name: light[0],
      config: {
        color: 0xffffff,
        intensity: 12,
        distance: 50,
        decay: 2,
        position: {
          x: 1,
          y: 2,
          z: 1,
        },
      },
    }
  ],

  // CONTOLS & HELPERS
  orbitControls: true,
  animateMesh: true,
  startPaused: true,
  showGUI: true,
  /**
   * See GuiPanel.js for more info
   * guiPanels: {
   * controlSet: 'full', // full || minimal
   * showHelpers: true,
   * showFunctions: true,
   * showStats: true,
   * showSegments: true,
   * showControls: [
   * 'scene',
   * 'camera',
   * 'mesh',
   * 'material',
   * 'light',
   * ]
   * }
   */
}

export default defaultSceneConfig