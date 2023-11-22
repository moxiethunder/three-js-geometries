import { Clock } from 'three'
import gsap from 'gsap'

function AnimationRotation(objects) {
  const { startPaused, scene, mesh, camera, controls, renderer } = objects

  let meshAnimation, controlAnimation

  const CONTAINER = renderer.domElement
  const DELAY = 250
  const VELOCITY = Math.PI * 0.1
  let CLOCK = new Clock()
  
  let isDragging = false
  let isRotating = true
  let rotationPosition = { x: 0, y: 0 }
  let isPaused = startPaused
  let resume = false

  const defaults = {
    cameraX: {
      obj: camera.position,
      prop: 'x',
      value: camera.position.x,
    },
    cameraY: {
      obj: camera.position,
      prop: 'y',
      value: camera.position.y,
    },
    cameraZ: {
      obj: camera.position,
      prop: 'z',
      value: camera.position.z,
    },
    meshX: {
      obj: mesh.rotation,
      prop: 'x',
      value: mesh.rotation.x,
    },
    meshY: {
      obj: mesh.rotation,
      prop: 'y',
      value: mesh.rotation.y,
    },
  }

  function animateMesh() {
    if ( controls !== undefined ) CONTAINER.setAttribute('mxt_grabbable', '')

    if ( isPaused ) {
      isRotating = false
      CLOCK.stop()
      renderer.render(scene, camera)
      
      if ( controls !== undefined ) {
        controlAnimation = requestAnimationFrame(animateControls)
        controls.update()
      }

      isPaused = false
      return
    }

    meshAnimation = requestAnimationFrame(animateMesh)
    
    if (!isDragging && isRotating) {
      const elapsedTime = CLOCK.getElapsedTime()
      
      mesh.rotation.x = rotationPosition.x + elapsedTime * VELOCITY
      mesh.rotation.y = rotationPosition.y + elapsedTime * VELOCITY
      
      if ( controls !== undefined ) {
        controls.update()
      }

      camera.lookAt(mesh.position)
    }

    renderer.render(scene, camera)
  }

  function animateControls() {
    CONTAINER.setAttribute('mxt_grabbable', '')

    controlAnimation = requestAnimationFrame(animateControls)

    if ( !isDragging && isRotating ) {
      controls.update()
    }

    renderer.render(scene, camera)
  }

  function spinGeometryXY() {
    if ( isRotating ) {
      resume = true
      isRotating = false
      CLOCK.stop()
    }

    gsap.to(mesh.rotation, {
      duration: 0.5,
      x: mesh.rotation.x + Math.PI * 2,
      y: -mesh.rotation.y + Math.PI * 2,
      ease: 'power1.inOut',
      onComplete: () => {
        if ( resume ) {
          isRotating = true
          startAnimation()
        }
      }
    })
  }

  function startAnimation() {
    setTimeout(() => {
      CLOCK.start()
      rotationPosition = { x: mesh.rotation.x, y: mesh.rotation.y }
      isRotating = true
    }, DELAY)
  }

  function toggleAnimation() {
    if ( isRotating ) {
      resume = false
      isRotating = false
      CLOCK.stop()
    } else {
      cancelAnimationFrame(controlAnimation)
      animateMesh()
      startAnimation()
    }
  }

  function resetDefaults() {
    const entries = Object.values(defaults).forEach(value => {
      const { obj, prop, value: defaultValue } = value
      obj[prop] = defaultValue
    })
    camera.lookAt(mesh.position)
  }

  function onMouseDown(e) {
    isDragging = true
    isRotating = false
    rotationPosition = { x: mesh.rotation.x, y: mesh.rotation.y }
    if ( controls !== undefined ) CONTAINER.setAttribute('mxt_grabbing', '')
  }

  function onMouseMove(e) {
    if ( !isRotating ) {
      addEventListeners()
    }
  }

  function onMouseUp(e) {
    isDragging = false
    if ( controls !== undefined ) CONTAINER.removeAttribute('mxt_grabbing')
    startAnimation()
  }

  function addEventListeners() {
    CONTAINER.addEventListener('mousedown', onMouseDown)
    CONTAINER.addEventListener('mousemove', onMouseMove)
    CONTAINER.addEventListener('mouseup', onMouseUp)
  }

  function removeEventListener(type, listener) {
    CONTAINER.removeEventListener(type, listener)
  }

  return {
    animateMesh,
    animateControls,
    toggleAnimation,
    spinGeometryXY,
    resetDefaults,
  }
}

export default AnimationRotation