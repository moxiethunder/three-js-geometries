import * as THREE from 'three'

const configureMaterials = () => {
  const textures = {
    doorAlpha: '/textures/door/alpha.jpg',
    doorAmbientOcclusion: '/textures/door/ambientOcclusion.jpg',
    doorColor: '/textures/door/color.jpg',
    doorHeight: '/textures/door/height.jpg',
    doorMetalness: '/textures/door/metalness.jpg',
    doorNormal: '/textures/door/normal.jpg',
    doorRoughness: '/textures/door/roughness.jpg',
    gradient: '/textures/gradients/3.jpg',
    matcap: '/textures/matcaps/1.png',
  }
  
  const materialsConfig = {
    MeshBasicMaterial: (texture) => ({
      map: prepareTexture(texture.doorColor, {
        colorSpace: THREE.SRGBColorSpace
      }),
      color: '#ff0000',
      wireframe: false,
      transparent: true,
      opacity: 0.5,
      alphaMap: texture.doorAlpha,
      side: THREE.DoubleSide,
    }),
    MeshNormalMaterial: () => ({
      flatShading: true,
      side: THREE.DoubleSide,
    }),
    MeshMatcapMaterial: (texture) => ({
      matcap: prepareTexture(texture, {
        colorSpace: THREE.SRGBColorSpace
      }),
      side: THREE.DoubleSide,
    }),
    MeshDepthMaterial:() => ({}),
    MeshLambertMaterial:() => ({}),
    MeshPhongMaterial:() => ({
      shininess: 100,
      specular: '#1188ff',
      side: THREE.DoubleSide,
    }),
    MeshToonMaterial: (texture) => ({
      color: '#ffffff',
      fog: true,
      gradientMap: prepareTexture(texture.gradient, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        generateMipmaps: false,
      }),
      side: THREE.DoubleSide,
    })
  }
  
  
  const loadTextures = (loader) => {
    return Object.entries(textures).reduce((acc, [key, value]) => {
      acc[key] = loader.load(value)
      return acc
    }, {})
  }
  
  const createMaterial = (type, texture=null, overrides={}) => {
    const Material = THREE[type]
    
    if ( !Material ) {
      console.error(`No Three.js material named: ${type}`)
      return null
    }
    
    const config = materialsConfig[type](texture)
    return new Material({ ...config, ...overrides })
  }
  
  const prepareTexture = (texture, config={}) => {
    if ( !texture ) return
    for (let key in config) {
      texture[key] = config[key]
    }
    return texture
  }
  
  const textureLoader = new THREE.TextureLoader()
  const loadedTextures = loadTextures(textureLoader)
  const materialObjects = {
    MeshBasicMaterial: createMaterial(
      'MeshBasicMaterial',
      {doorColor: loadedTextures.doorColor, doorAlpha: loadedTextures.doorAlpha},
    ),
    MeshNormalMaterial: createMaterial('MeshNormalMaterial'),
    MeshMatcapMaterial: createMaterial('MeshMatcapMaterial', loadedTextures.matcap),
    MeshDepthMaterial: createMaterial('MeshDepthMaterial'),
    MeshLambertMaterial: createMaterial('MeshLambertMaterial'),
    MeshPhongMaterial: createMaterial('MeshPhongMaterial'),
    MeshToonMaterial: createMaterial(
      'MeshToonMaterial',
      {gradient: loadedTextures.gradient},
      { color: '#ff0000' }
    )
  }
  const materialTypes = Object.keys(materialObjects)

  return {
    loader: textureLoader,
    textures: loadedTextures,
    materials: materialObjects,
    types: materialTypes,
  }
}

export default configureMaterials