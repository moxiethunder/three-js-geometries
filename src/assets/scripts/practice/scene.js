import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import configureMaterials from '@scripts/practice/material-config.js'
import createDebugGUI from '@scripts/practice/gui.js'
import EventBus from '@scripts/services/EventBus'

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

    rotateXY(torus, 0.1, -0.15, elapsedTime)
    rotateXY(sphere, 0.1, -0.15, elapsedTime)
    rotateXY(plane, 0.1, -0.15, elapsedTime)

    controls.update()
    renderer.render(scene, camera)
  }

  const updateMaterial = (material) => {
    const mapsLib = [
      'map', 'alphaMap', 'aoMap', 'bumpMap', 'displacementMap', 'emissiveMap', 'envMap', 'lightMap', 'metalnessMap', 'normalMap', 'roughnessMap', 'specularMap', 'gradientMap', 'clearcoatMap', 'clearcoatRoughnessMap', 'clearcoatNormalMap', 'transmissionMap', 'sheenMap', 'thicknessMap', 'emissiveMap',
    ]
    const meshes = [plane, sphere, torus]
    const newMaterial = materials[material]
    
    meshes.forEach(mesh => {
      if ( mesh.material ) {
        mesh.material.dispose()

        mapsLib.forEach(type => {
          if ( mesh.material[type] ) mesh.material[type].dispose()
        })
      }

      mesh.material = newMaterial
    })

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

  //TEXTURES & MATERIALS CONFIGURATION
  const { loader, textures, materials, types } = configureMaterials()

  //GUI CONFIGURATION
  const debugGUI = createDebugGUI({ 
    title: 'Debug GUI'
  }, materials.MeshBasicMaterial, {ambient: ambientLight, point: pointLight}, types)

  //OBJECTS CONFIGURATION
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materials.MeshBasicMaterial)
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), materials.MeshBasicMaterial)
  const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), materials.MeshBasicMaterial)

  //OBJECTS POSITIONING
  sphere.position.x = -1.5
  torus.position.x = 1.5

  //SCENE ADDITIONS
  scene.add(plane, sphere, torus, ambientLight, pointLight)

  //ORBIT CONTROLS CONFIGURATION
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  //ANIMATION CONTROLS
  animateControls()

  //EVENT LISTENERS
  window.addEventListener('resize', onWindowResize)
  EventBus.subscribe('UpdateMaterial', updateMaterial)
}

export default Scene