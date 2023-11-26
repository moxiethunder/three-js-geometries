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
    matcap: '/textures/matcaps/8.png',
  }
  
  const materialsConfig = {
    MeshBasicMaterial: (textures) => ({
      showLight: false,
      material: {
        map: prepareTexture(textures.doorColor, {
          colorSpace: THREE.SRGBColorSpace
        }),
        color: '#ffffff',
        wireframe: false,
        transparent: true,
        opacity: 0.5,
        alphaMap: prepareTexture(textures.doorAlpha, {
          colorSpace: THREE.SRGBColorSpace
        }),
        side: THREE.DoubleSide,
      }
    }),
    MeshStandardMaterial: (textures) => ({
      showLight: true,
      material: {
        metalness: 1,
        roughness: 0,
        // map: prepareTexture(textures.doorColor, {
        //   colorSpace: THREE.SRGBColorSpace
        // }),
        // aoMap: textures.doorAmbientOcclusion,
        // displacementMap: textures.doorHeight,
        // metalnessMap: textures.doorMetalness,
        // roughnessMap: textures.doorRoughness,
        // normalMap: textures.doorNormal,
        // alphaMap: textures.doorAlpha,
        // aoMapIntensity: 1,
        // displacementScale: 0.1,
        // normalScale: new THREE.Vector2(0.5, 0.5),
        transparent: true,
        side: THREE.DoubleSide,
      }
    }),
    MeshPhysicalMaterial: (textures) => ({
      showLight: true,
      material: {
        metalness: 0,
        roughness: 0,
        sheen: 0,
        sheenRoughness: 0,
        sheenColor: '#ffffff',
        clearcoat: 0,
        clearcoatRoughness: 0,
        transmission: 1,
        ior: 1.5,
        thickness: 0.5,
        // map: prepareTexture(textures.doorColor, {
        //   colorSpace: THREE.SRGBColorSpace
        // }),
        // aoMap: textures.doorAmbientOcclusion,
        // displacementMap: textures.doorHeight,
        // metalnessMap: textures.doorMetalness,
        // roughnessMap: textures.doorRoughness,
        // normalMap: textures.doorNormal,
        // alphaMap: textures.doorAlpha,
        // aoMapIntensity: 1,
        // displacementScale: 0.1,
        // normalScale: new THREE.Vector2(0.5, 0.5),
        transparent: true,
        side: THREE.DoubleSide,
      }
    }),
    MeshNormalMaterial: () => ({
      showLight: false,
      material: {
        transparent: true,
        flatShading: false,
        side: THREE.DoubleSide,
      }
    }),
    MeshMatcapMaterial: (texture) => ({
      showLight: false,
      material: {
        transparent: true,
        flatShading: false,
        matcap: prepareTexture(texture, {
          colorSpace: THREE.SRGBColorSpace
        }),
        side: THREE.DoubleSide,
      }
    }),
    MeshDepthMaterial:() => ({showLight: false, material: {}}),
    MeshLambertMaterial:() => ({showLight: true, material: {}}),
    MeshPhongMaterial:() => ({
      showLight: true,
      material: {
        transparent: true,
        flatShading: false,
        shininess: 100,
        specular: '#1188ff',
        side: THREE.DoubleSide,
      }
    }),
    MeshToonMaterial: (textures) => ({
      showLight: true,
      material: {
        color: '#ffffff',
        fog: true,
        gradientMap: prepareTexture(textures.gradient, {
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          generateMipmaps: false,
        }),
        side: THREE.DoubleSide,
      }
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
    if ( !config.hasOwnProperty('showLight') || !config.hasOwnProperty('material') ) {
      console.error(`Material config for ${type} is invalid`)
      return null
    }
    
    return {
      showLight: config.showLight,
      material: new Material({ ...config.material, ...overrides })
    }
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
    MeshStandardMaterial: createMaterial('MeshStandardMaterial', {
      doorColor: loadedTextures.doorColor,
      doorAmbientOcclusion: loadedTextures.doorAmbientOcclusion,
      doorHeight: loadedTextures.doorHeight,
      doorMetalness: loadedTextures.doorMetalness,
      doorNormal: loadedTextures.doorNormal,
      doorRoughness: loadedTextures.doorRoughness,
      doorAlpha: loadedTextures.doorAlpha,
    }),
    MeshPhysicalMaterial: createMaterial('MeshPhysicalMaterial', {
      doorColor: loadedTextures.doorColor,
      doorAmbientOcclusion: loadedTextures.doorAmbientOcclusion,
      doorHeight: loadedTextures.doorHeight,
      doorMetalness: loadedTextures.doorMetalness,
      doorNormal: loadedTextures.doorNormal,
      doorRoughness: loadedTextures.doorRoughness,
      doorAlpha: loadedTextures.doorAlpha,
    }),
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
      { color: '#ffffff' }
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