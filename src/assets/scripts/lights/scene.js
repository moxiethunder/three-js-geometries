import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const Scene = () => {
  //FUNCTIONS
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    setPixelRatio()
  }

  const setPixelRatio = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  const rotateXY = (shape, xVal, yVal, elapsedTime) => {
    shape.rotation.x = xVal * elapsedTime
    shape.rotation.y = yVal * elapsedTime
  }

  const animateControls = () => {
    requestAnimationFrame(animateControls)
    const elapsedTime = clock.getElapsedTime()

    rotateXY(sphere, 0.1, 0.1, elapsedTime)
    rotateXY(torus, 0.1, 0.1, elapsedTime)
    rotateXY(icosa, 0.1, 0.1, elapsedTime)

    controls.update()
    renderer.render(scene, camera)
  }

  //SCENE CONFIGURATION
  const canvas = document.getElementById('scene')
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  const clock = new THREE.Clock()

  //CAMERA CONFIGURATION
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 25

  const torusGeometry = new THREE.TorusGeometry(4, 1.5, 30, 100)
  const icosaGeometry = new THREE.IcosahedronGeometry(5, 0)
  const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)
  const planeGeometry = new THREE.PlaneGeometry(75, 75)

  
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff
    // flatShading: true
  })
  
  const icosaMaterial = new THREE.MeshNormalMaterial({
    // flatShading: true
  })
  
  const sphereMaterial = new THREE.MeshToonMaterial({
    color: 0x0ff000,
    gradientMap: new THREE.TextureLoader().load('/textures/gradients/5.jpg')
  })
  
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xC0C0C0,
  })
  
  
  const torus = new THREE.Mesh(torusGeometry, torusMaterial)
  const icosa = new THREE.Mesh(icosaGeometry, torusMaterial)
  const sphere = new THREE.Mesh(sphereGeometry, torusMaterial)
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  torus.position.x = 15
  sphere.position.x = -15
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -9
  
  scene.add(torus, icosa, sphere, plane)
  
  const ambientLight = new THREE.AmbientLight(0x4e00ff, 0.25)
  // scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
  directionalLight.position.set(1, 0.25, 0)
  // scene.add(directionalLight)

  const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 2)
  // scene.add(hemisphereLight)
  
  const pointLight = new THREE.PointLight(0xff9000, 100, 1000)
  pointLight.position.set(5, -0.5, 10)
  // scene.add(pointLight)

  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 3, 3)
  // rectAreaLight.position.set(0, 7.75, 10)
  // rectAreaLight.lookAt(0, 0, 0)
  // scene.add(rectAreaLight)

  const spotLight = new THREE.SpotLight(0x78ff00, 27, 100, Math.PI * 0.5, 0.25, 1)
  spotLight.position.set(0, 4, 10)
  scene.add(spotLight)

  // console.log(rectAreaLight)
  // console.log(pointLight)
  console.log(spotLight)
  
  const gui = new GUI()
  gui.add(ambientLight, 'intensity').min(0).max(10).step(0.01)
  // gui.add(pointLight, 'intensity').min(0).max(200).step(0.01)
  // gui.add(pointLight.position, 'x').min(-10).max(10).step(0.01).name('position x')
  // gui.add(pointLight.position, 'y').min(-10).max(10).step(0.01).name('position y')
  // gui.add(pointLight.position, 'z').min(-10).max(10).step(0.01).name('position z')
  // gui.add(rectAreaLight, 'intensity').min(0).max(200).step(0.01)
  // gui.add(rectAreaLight, 'width').min(0).max(20).step(0.01)
  // gui.add(rectAreaLight, 'height').min(0).max(20).step(0.01)
  // gui.add(rectAreaLight.position, 'x').min(-10).max(10).step(0.01).name('position x')
  // gui.add(rectAreaLight.position, 'y').min(-10).max(10).step(0.01).name('position y')
  // gui.add(rectAreaLight.position, 'z').min(-10).max(10).step(0.01).name('position z')
  gui.add(spotLight, 'intensity').min(0).max(200).step(0.01)
  gui.add(spotLight, 'distance').min(0).max(200).step(0.01)
  gui.add(spotLight, 'angle').min(0).max(Math.PI * 2).step(0.01)
  gui.add(spotLight, 'penumbra').min(0).max(1).step(0.01)
  gui.add(spotLight.position, 'x').min(-10).max(10).step(0.01).name('position x')
  gui.add(spotLight.position, 'y').min(-10).max(10).step(0.01).name('position y')
  gui.add(spotLight.position, 'z').min(-10).max(10).step(0.01).name('position z')
  
  //RENDERER CONFIGURATION
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)
  setPixelRatio()

  //ORBIT CONTROLS CONFIGURATION
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  //ANIMATION CONTROLS
  animateControls()
  // renderer.render(scene, camera)

  //EVENT LISTENERS
  window.addEventListener('resize', onWindowResize)
}

export default Scene