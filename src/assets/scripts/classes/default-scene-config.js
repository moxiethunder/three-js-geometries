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

  // OBJECTS & CONFIGS
  materialType: material,
  materialConfig: {},
  cameraType: camera,
  cameraConfig:{},
  geometryType: geometry,
  geometryConfig:{},

  // LIGHTS
  lightTypes: [
    {
      name: light[0],
      config: {},
    },
    {
      name: light[1],
      config: {},
    },
  ],

  // CONTOLS & HELPERS
  orbitControls: false,
  animateMesh: false,
  guiPanels: {
    controlSet: 'full', // full || minimal
    showSceneHelpers: true,
    showFunctions: true,
    showStats: true,
    showControls: [
      'scene',
      'camera',
      'mesh',
      'material',
      'light',
    ]
  },
  helpers: [
    // {
    //   type: 'CameraHelper',
    // },
    // {
    //   type: 'BoxHelper',
    //   config: [0xffff00]
    // },
    // {
    //   type: 'AxesHelper',
    //   config: [5]
    // },
    // {
    //   type: 'GridHelper',
    //   config: [10, 16, 0x0000ff, 0x808080]
    // },
    // {
    //   type: 'PolarGridHelper',
    //   config: [5, 8, 16, 64, 0x0000ff, 0x808080]
    // }
  ],
}

export default defaultSceneConfig