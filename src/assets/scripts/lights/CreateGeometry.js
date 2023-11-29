import * as THREE from 'three'

const CreateGeometry = (config) => {
  const geometry = config.geometry instanceof THREE.Geometry
    ? config.geometry
    : new THREE[geometry](...config.geometryConfig)

  const material = config.material instanceof THREE.Material
    ? config.material
    : new THREE[material](...config.materialConfig)

  const mesh = new THREE.Mesh(geometry, material)

  const texture = config.texture instanceof THREE.Texture
    ? config.texture
    : new THREE.TextureLoader().load(config.texture)

  texture.colorSpace = THREE.SRGBColorSpace

  switch (config.map) {
    case 'matcap':
      material.matcap = texture
      break
    case 'map':
      material.map = texture
      break
    default:
      break
  }

  return {
    geometry,
    material,
    mesh,
    texture
  }
}

export default CreateGeometry