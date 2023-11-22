import * as THREE from 'three'
import { setPixelRatio } from '@scripts/utils/render-utils'

export function renderOnResize(data) {
  const { e, scene } = data
  const { camera, renderer } = scene

  const width = window.innerWidth
  const height = window.innerHeight

  const aspectRatio = width / height
  
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  setPixelRatio(renderer)
}