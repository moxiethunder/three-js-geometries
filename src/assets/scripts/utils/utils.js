import * as ICONS from '@scripts/lib/icons.js'

export function getAspectRatio(config) {
  return config.width / config.height
}

export function createSvgNode(template) {
  const div = document.createElement('div')
  div.innerHTML = template.trim()
  return div.firstChild
}

export function addElementToDOM(element, parent, postion) {
  console.log(parent.children)
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
  const { type, props=null, classes=null, icon=null } = config
  const element = document.createElement(type)

  if ( props ) {
    Object.entries(props).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
  }

  if ( classes ) {
    element.classList.add(...classes)
  }

  if ( icon ) {
    const iconElement = createSvgNode(ICONS[icon])
    element.appendChild(iconElement)
  }

  return element
}

export function getPointerPOS(event) {
  if (!event) event = window.event
  const type = event.type
  let posX = 0
  let posY = 0


  const source =
    type === 'touchmove'
    ? event.touches[0]
    : event

  if (source.pageX || source.pageY) {
    posX = source.pageX
    posY = source.pageY
  } else if (source.clientX || source.clientY) {
    posX = source.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
    posY = source.clientY + document.body.scrollTop + document.documentElement.scrollTop
  }

  return {
    x: posX,
    y: posY,
  }
}