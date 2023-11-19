import * as THREE from 'three'
import { setPixelRatio } from '@scripts/utils/render-utils'
import rangeSlider from '@scripts/components/range-slider'

export function rerenderScene(data) {
  const { e, sizes, SCENE } = data
  const { camera, renderer } = SCENE

  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  const aspectRatio = sizes.width / sizes.height
  
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  setPixelRatio(renderer)
}

export function handleSceneInputs(data) {
  const { e, sceneData, info, value, element } = data
  const { scene } = sceneData
  const mesh = scene.children.find(child => child instanceof THREE.Mesh)
  const pointLight = scene.children.find(child => child instanceof THREE.PointLight)
  const ambientLight = scene.children.find(child => child instanceof THREE.AmbientLight)
  const type = e.type
  const target = e.target
  const dataset = target.dataset

  if ( type === 'input' ) {
    if ( 'meshColor' in dataset ) {
      mesh.material.color.set(target.value)
      info.textContent = target.value
    }
    
    if ( 'sceneColor' in dataset ) {
      scene.background.set(target.value)
      info.textContent = target.value
    }
    
    if ( 'ambientLight' in dataset ) {
      ambientLight.intensity = parseFloat(target.value)
      info.textContent = parseFloat(target.value).toFixed(2)
    }
    
    if ( 'pointLight' in dataset ) {
      pointLight.intensity = parseInt(target.value)
      info.textContent = parseInt(target.value).toFixed(2)
    }
  }

  if ( Array.from(element.children).includes(element.querySelector('[data-range-item]'))) {
    rangeSlider(element, value, e)
  }
}