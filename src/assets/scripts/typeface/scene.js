import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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

    // rotateXY(cube, 0.1, 0.1, elapsedTime)

    controls.update()
    renderer.render(scene, camera)
  }

  //SCENE CONFIGURATION
  const canvas = document.getElementById('scene')
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#262837')
  const clock = new THREE.Clock()

  //CAMERA CONFIGURATION
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.x = 0.5
  camera.position.y = 0.5
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
  const matcapTexture = textureLoader.load('/textures/matcaps/matcapD.png')
  matcapTexture.colorSpace = THREE.SRGBColorSpace

  let textGeometry, textMesh
  //FONT LOADER
  const fontLoader = new FontLoader()
  fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
      textGeometry = new TextGeometry(
        'Hello Three.js',
        {
          font: font,
          size: 0.5,
          height: 0.2,
          curveSegments: 5,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 4
        }
      )

      textGeometry.center()
      
      const material = new THREE.MeshMatcapMaterial()
      material.matcap = matcapTexture
      textMesh = new THREE.Mesh(textGeometry, material)
      scene.add(textMesh)
      const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

      for ( let i = 0; i < 100; i++ ) {
        const donut = new THREE.Mesh(donutGeometry, material)

        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const randomValue = Math.random()
        donut.scale.set(randomValue, randomValue, randomValue)

        scene.add(donut)
      }
    }
  )

  //OBJECTS CONFIGURATION
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x00ff00 }))
  // scene.add(cube)

  //HELPERS
  const axesHelper = new THREE.AxesHelper(5)
  // scene.add(axesHelper)

  //SCENE ADDITIONS
  scene.add(ambientLight, pointLight)

  //ORBIT CONTROLS CONFIGURATION
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  //ANIMATION CONTROLS
  animateControls(cube)

  //EVENT LISTENERS
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('wheel', customZoom)
}

export default Scene