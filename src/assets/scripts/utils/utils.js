export function getAspectRatio(config) {
  return config.width / config.height
}

export function getCanvas(value) {
  const allCanvases = Array.from(document.querySelectorAll('[data-render]'))

  return allCanvases.find(canvas => canvas.dataset.render === value)
}

export function getDeltaTime(time) {
  const currentTime = Date.now()
  const deltaTime = currentTime - time

  return {
    currentTime,
    deltaTime
  }
}

export function hasProperty(obj, prop) {
  return obj.hasOwnProperty(prop) ? true : false
}


export function createDomElement(config) {
  const { type, props=null, classes=null } = config
  const element = document.createElement(type)

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
  }

  if (classes) {
    element.classList.add(...classes)
  }

  return element
}