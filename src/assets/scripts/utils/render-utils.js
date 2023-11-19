export function setPixelRatio(renderer) {
  const pixelRatio = window.devicePixelRatio
  renderer.setPixelRatio(pixelRatio)

  return pixelRatio
}