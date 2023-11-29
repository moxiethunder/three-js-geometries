import GUI from 'lil-gui'
import * as THREE from 'three'

export const createGUI = (config) => {
  const { material, ambientLight, pointLight, spotLight, directionalLight, ico, torusKnot, plane, pointLightHelper, spotLightHelper, directionalLightHelper } = config
  //GUI
  const gui = new GUI({ width: 300 })
  
  //SPHERE
  // const sphereFolder = gui.addFolder('Sphere')
  // sphereFolder.add(sphere.position, 'x').min(-10).max(10).step(0.001).name('position x')
  // sphereFolder.add(sphere.position, 'y').min(-10).max(10).step(0.001).name('position y')
  // sphereFolder.add(sphere.position, 'z').min(-10).max(10).step(0.001).name('position z')
  
  //TORUS KNOT
  // const torusKnotFolder = gui.addFolder('Torus Knot')
  // torusKnotFolder.add(torusKnot.position, 'x').min(-10).max(10).step(0.001).name('position x')
  // torusKnotFolder.add(torusKnot.position, 'y').min(-10).max(10).step(0.001).name('position y')
  // torusKnotFolder.add(torusKnot.position, 'z').min(-10).max(10).step(0.001).name('position z')
  
  //CAMERA
  // const cameraFolder = gui.addFolder('Camera')
  // cameraFolder.add(config.camera.position, 'x').min(-10).max(10).step(0.001).name('camera x')
  // cameraFolder.add(config.camera.position, 'y').min(-10).max(10).step(0.001).name('camera y')
  // cameraFolder.add(config.camera.position, 'z').min(-10).max(10).step(0.001).name('camera z')
  
  //MATERIAL
  const materialFolder = gui.addFolder('Material').close()
  materialFolder.addColor(material, 'color').name('color')
  materialFolder.add(material, 'wireframe').name('wireframe')
  materialFolder.add(material, 'metalness').min(0).max(1).step(0.001).name('metalness')
  materialFolder.add(material, 'roughness').min(0).max(1).step(0.001).name('roughness')

  //AMBIENT LIGHT
  const ambientLightFolder = gui.addFolder('Ambient Light').close()
  ambientLightFolder.add(ambientLight, 'intensity').min(0).max(10).step(0.001).name('ambient intensity')

  //POINT LIGHT
  const pointLightFolder = gui.addFolder('Point Light').close()
  pointLightFolder.add(pointLight, 'visible')
  pointLightFolder.add(pointLightHelper, 'visible').name('show helper')
  pointLightFolder.addColor(pointLight, 'color').name('point color')
  pointLightFolder.add(pointLight, 'intensity').min(0).max(30).step(0.001).name('point intensity')
  pointLightFolder.add(pointLight.position, 'x').min(-10).max(10).step(0.001).name('point x')
  pointLightFolder.add(pointLight.position, 'y').min(-10).max(10).step(0.001).name('point y')
  pointLightFolder.add(pointLight.position, 'z').min(-10).max(10).step(0.001).name('point z')

  //SPOT LIGHT
  const spotLightFolder = gui.addFolder('Spot Light').close()
  spotLightFolder.add(spotLight, 'visible')
  spotLightFolder.add(spotLightHelper, 'visible').name('show helper')
  spotLightFolder.addColor(spotLight, 'color').name('spot color')
  spotLightFolder.add(spotLight, 'intensity').min(0).max(200).step(0.01)
  spotLightFolder.add(spotLight, 'distance').min(0).max(200).step(0.01)
  spotLightFolder.add(spotLight, 'angle').min(0).max(Math.PI * 2).step(0.01)
  spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.01)
  spotLightFolder.add(spotLight.position, 'x').min(-10).max(10).step(0.01).name('position x')
  spotLightFolder.add(spotLight.position, 'y').min(-10).max(10).step(0.01).name('position y')
  spotLightFolder.add(spotLight.position, 'z').min(-10).max(10).step(0.01).name('position z')

  //DIRECTIONAL LIGHT
  const directionalLightFolder = gui.addFolder('Directional Light').close()
  directionalLightFolder.add(directionalLight, 'visible')
  directionalLightFolder.add(directionalLightHelper, 'visible').name('show helper')
  directionalLightFolder.addColor(directionalLight, 'color').name('directional color')
  directionalLightFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('directional intensity')
  directionalLightFolder.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('directional x')
  directionalLightFolder.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('directional y')
  directionalLightFolder.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('directional z')
  // directionalLightFolder.add(directionalLight.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.001).name('directional rotation x')
  // directionalLightFolder.add(directionalLight.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('directional rotation y')
  // directionalLightFolder.add(directionalLight.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.001).name('directional rotation z')


  return gui
}

export const createLights = () => {
  // AMBIENT LIGHT
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)

  // POINT LIGHT
  const pointLight = new THREE.PointLight(0xff0000, 8.25, 100)
  pointLight.position.set(-0.95, 0.65, 1.4)
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1)

  // DIRECTIONAL LIGHT
  const directionalLight = new THREE.DirectionalLight(0x00ff00, 1)
  directionalLight.position.set(-3.75, 1.65, -3.75)
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.1, 0xffffff)

  // SPOT LIGHT
  const spotLight = new THREE.SpotLight(0x0000ff, 95, 10, 0.45, 0.25, 1)
  spotLight.position.set(-1.5, 1.75, 4.45)
  const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.1)

  console.log(spotLightHelper)

  return { ambientLight, pointLight, pointLightHelper, directionalLight, directionalLightHelper, spotLight, spotLightHelper }
}

export const createGeometries = () => {
  const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  material.metalness = 0.125
  material.roughness = 0.1

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    material
  )
  plane.rotation.x = -Math.PI * 0.5
  plane.position.y = -1.5
  
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.8, 0),
    material
  )
  ico.position.set(-1.25, 1, -1)

  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.65, 0.2, 24, 24),
    material
  )
  torusKnot.position.set(1.35, 0.075, 1.5)

  return { plane, ico, torusKnot, material }
}