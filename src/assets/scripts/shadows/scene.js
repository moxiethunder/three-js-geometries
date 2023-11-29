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

    rotateXY(ico, -2, 5, elapsedTime)
    rotateXY(torusKnot, 3, -2, elapsedTime)

    controls.update()
    renderer.render(scene, camera)
  }

  //SCENE CONFIGURATION
  const canvas = document.getElementById('scene')
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  const clock = new THREE.Clock()

  //CAMERA CONFIGURATION
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.x = -10
  camera.position.y = 8
  camera.position.z = 5.5

  //GEOMETRY CONFIGURATION
  const { plane, ico, torusKnot, material } = createGeometries()
  scene.add(plane)
  scene.add(ico)
  // scene.add(torusKnot)

  //LIGHT CONFIGURATION
  const { ambientLight, pointLight, pointLightHelper, directionalLight, directionalLightHelper, spotLight, spotLightHelper } = createLights()

  const dirTarget = new THREE.Object3D()
  directionalLight.target = dirTarget
  scene.add(dirTarget)

  const spotTarget = new THREE.Object3D()
  spotLight.target = spotTarget
  spotTarget.position.set(2.35, -4, -0.25)
  scene.add(spotTarget)

  scene.add(ambientLight, pointLight, pointLightHelper, directionalLight, directionalLightHelper, spotLight, spotLightHelper)

  //DIRECTIONAL LIGHT CAMERA AND SHADOW CONFIGURATION
  const dirLightCamera = directionalLight.shadow.camera
  const dirLightShadow = directionalLight.shadow

  const dirLightCameraHelper = new THREE.CameraHelper(dirLightCamera)
  scene.add(dirLightCameraHelper)
  dirLightCameraHelper.visible = false

  dirLightShadow.mapSize.width = 512 * 4
  dirLightShadow.mapSize.height = 512 * 4
  dirLightCamera.near = 1
  dirLightCamera.far = 10

  const spotLightCamera = spotLight.shadow.camera
  const spotLightShadow = spotLight.shadow

  const spotLightCameraHelper = new THREE.CameraHelper(spotLightCamera)
  scene.add(spotLightCameraHelper)
  spotLightCameraHelper.visible = false

  spotLightShadow.mapSize.width = 512 * 4
  spotLightShadow.mapSize.height = 512 * 4
  spotLightCamera.near = 1
  spotLightCamera.far = 10

  //HIDE HELPERS
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
    plane,
    dirTarget,
    spotTarget,
    dirLightCamera,
    dirLightCameraHelper,
    spotLightCamera,
    spotLightCameraHelper,
  })

  //RENDERER CONFIGURATION
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)
  setPixelRatio()
  renderer.shadowMap.enabled = true

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