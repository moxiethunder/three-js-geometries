import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

    rotateXY(cube, 0.1, 0.1, elapsedTime)

    controls.update()
    renderer.render(scene, camera)
  }

  //SCENE CONFIGURATION
  const canvas = document.getElementById('scene')
  const scene = new THREE.Scene()
  const clock = new THREE.Clock()

  //CAMERA CONFIGURATION
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 2

  //RENDERER CONFIGURATION
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)
  setPixelRatio()

  //LIGHTING CONFIGURATION
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  const pointLight = new THREE.PointLight(0xffffff, 30)
  pointLight.position.set(2, 3, 4)

  //TEXTURE LOADER
  const textureLoader = new THREE.TextureLoader()

  //OBJECTS CONFIGURATION
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x00ff00 }))

  //SCENE ADDITIONS
  scene.add(cube, ambientLight, pointLight)

  //ORBIT CONTROLS CONFIGURATION
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  //ANIMATION CONTROLS
  animateControls()

  //EVENT LISTENERS
  window.addEventListener('resize', onWindowResize)
}

export default Scene