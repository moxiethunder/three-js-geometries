export function renderCameraData(data) {
  const { position, fov } = data
  const posZContainer = document.querySelector('[data-info-zoom] span')
  const fovContainer = document.querySelector('[data-info-fov] span')
  posZContainer.textContent = position.z.toFixed(2).toString()
  fovContainer.textContent = fov.toFixed(2).toString()
}

export function renderMeshData(data) {
  const { rotation } = data
  const rotXContainer = document.querySelector('[data-info-rotation-x] span')
  const rotYContainer = document.querySelector('[data-info-rotation-y] span')
  
  let rotationX = rotation.x * (180 / Math.PI) % 360;
  let rotationY = rotation.y * (180 / Math.PI) % 360;

  rotationX = rotationX < 0 ? rotationX + 360 : rotationX;
  rotationY = rotationY < 0 ? rotationY + 360 : rotationY;
  
  rotXContainer.textContent = `${rotationX.toFixed().toString()}°`
  rotYContainer.textContent = `${rotationY.toFixed().toString()}°`
}