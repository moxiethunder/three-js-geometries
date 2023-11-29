import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createGUI, createLights, createGeometries } from './create-assets'

const Scene = () => {
  //FUNCTIONS
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    setPixelRatio()
  }

  function customZoom(event) {
    var zoomFactor = 0.1;
    var delta = event.wheelDelta ? event.wheelDelta : -event.detail;

    if (delta > 0) {
        camera.position.z -= zoomFactor;
    } else {
        camera.position.z += zoomFactor;
    }
    // camera.position.z = THREE.MathUtils.clamp(camera.position.z, minZ, maxZ);
    camera.updateProjectionMatrix();
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

    rotateXY(ico, 2, 2, elapsedTime)
    rotateXY(torusKnot, 2, 2, elapsedTime)

    controls.update()
    renderer.render(scene, camera)
  }

  //SCENE CONFIGURATION
  const canvas = document.getElementById('scene')
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  const clock = new THREE.Clock()

  //CAMERA CONFIGURATION
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.x = -4.25
  camera.position.y = 6
  camera.position.z = 5.25

  //GEOMETRY CONFIGURATION
  const { plane, ico, torusKnot, material } = createGeometries()
  scene.add(plane, ico, torusKnot)

  //LIGHT CONFIGURATION
  const { ambientLight, pointLight, pointLightHelper, directionalLight, directionalLightHelper, spotLight, spotLightHelper } = createLights()

  directionalLight.target = ico
  spotLight.target = torusKnot

  scene.add(ambientLight, pointLight, pointLightHelper, directionalLight, directionalLightHelper, spotLight, spotLightHelper)

  spotLightHelper.visible = false
  directionalLightHelper.visible = false
  pointLightHelper.visible = false

  //GUI CONFIGURATION
  const gui = createGUI({
    ambientLight,
    pointLight,
    directionalLight,
    spotLight,
    pointLightHelper,
    directionalLightHelper,
    spotLightHelper,
    ico,
    torusKnot,
    material,
    camera,
    plane
  })

  //RENDERER CONFIGURATION
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)
  setPixelRatio()

  //ORBIT CONTROLS CONFIGURATION
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  //ANIMATION CONTROLS
  animateControls()
  // renderer.render(scene, camera)

  //EVENT LISTENERS
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('wheel', customZoom)
}

export default Scene