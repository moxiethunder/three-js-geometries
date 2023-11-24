import * as THREE from 'three'
import ThreeObjectConstructors from '@scripts/classes/ThreeObjectConstructors'
import GuiModuleConstructors from '@scripts/gui/GuiModuleConstructors'
import EventBus from '@scripts/services/EventBus'

export function setPixelRatio(renderer) {
  const pixelRatio = window.devicePixelRatio
  renderer.setPixelRatio(pixelRatio)

  return pixelRatio
}

export function buildGeometry(assets, type, wireframeConfig={}, objConfig={}) {
  const { mesh, wireframe, scene } = assets
  const objConstructor = ThreeObjectConstructors[type]

  if ( !objConstructor ) {
    console.error(`No object found with type ${type}`)
    return null
  }

  if ( mesh.geometry ) mesh.geometry.dispose()
  if ( wireframe ) {
    mesh.remove(wireframe)
    wireframe.geometry.dispose()
    wireframe.material.dispose()
  }

  
  const newGeometry = new objConstructor(objConfig, scene).object
  mesh.geometry = newGeometry
  
  const newWireframe = createWireframe(newGeometry, mesh, wireframeConfig)
  
  return {
    geometry: newGeometry,
    wireframe: newWireframe,
  }
}

export function buildGui() {
  
}

export function createWireframe(geometry, mesh, config) {
  const wireframeGeometry = new THREE.WireframeGeometry(geometry)
  const wireframeMaterial = new THREE.LineBasicMaterial(config.color)
  
  const newWireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
  
  setWireframeProperties(newWireframe, config)
  mesh.add(newWireframe)
  
  return newWireframe
}

export function setWireframeProperties(wireframe, config) {
  wireframe.depthTest = config.depthTest
  wireframe.visible = true
  wireframe.opacity = config.opacity
  wireframe.transparent = config.transparent
}