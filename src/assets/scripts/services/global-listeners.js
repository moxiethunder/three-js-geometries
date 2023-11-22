import EventBus from '@scripts/services/EventBus'

const setupGlobalListeners = (scene) => {
  let isDragging = false

  window.addEventListener('resize', (e) => {
    EventBus.publish('WindowResized', {e, scene})
  })
  window.addEventListener('mousedown', e => {
    isDragging = true
    // EventBus.publish('DragStart', {e, isDragging, scene})
  })
  
  window.addEventListener('mouseup', e => {
    isDragging = false
    // EventBus.publish('DragEnd', {e, isDragging, scene})
  })
  
  window.addEventListener('mousemove', e => {
    if ( isDragging ) EventBus.publish('DragMove', {e, isDragging, scene})
  })
}

export default setupGlobalListeners