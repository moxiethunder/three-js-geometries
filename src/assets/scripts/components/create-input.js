import EventBus from '@scripts/services/EventBus'

function createInput(config, scene) {
  const { type, id } = config
  const nestedAttributes = getNestedObjects()

  const wrapper = document.createElement('div')
  const input = document.createElement('input')
  const label = document.createElement('label')
  const info = document.createElement('span')

  wrapper.classList.add('fieldset')
  input.setAttribute(`data-${id}`, '')
  input.setAttribute('data-scene-control', '')
  label.setAttribute('for', id)
  label.textContent = id.split('-').join(' ')

  setAttributes(input)
  
  
  if ( nestedAttributes.length > 0 ) {
    nestedAttributes.forEach(obj => {
      setAttributes(input, obj)
    })
  }
  
  if ( type !== 'range' ) {
    wrapper.appendChild(input)
    wrapper.appendChild(label)
    label.appendChild(info)
    info.textContent = config.value
  }
  
  if ( type === 'range' ) {
    const classNames = {
      range: 'custom-range',
      slider: 'custom-range--slider',
      fill: 'custom-range--fill',
      thumb: 'custom-range--thumb',
    }
    
    const elements = Object.entries(classNames).reduce((acc, [key, value]) => {
      const element = document.createElement('div')
      element.classList.add(value)
      acc[key] = element
      return acc
    }, {})
    
    const { range, slider, fill, thumb } = elements
    
    range.setAttribute('data-range-item', '')
    
    slider.appendChild(fill)
    range.appendChild(slider)
    range.appendChild(thumb)
    range.appendChild(input)
    wrapper.appendChild(range)
    wrapper.appendChild(label)
    label.appendChild(info)
    info.textContent = config.value.toFixed(2).toString()
  }

  input.addEventListener('input', (e) => {
    EventBus.publish('InputUpdated', {e, sceneData: scene, info, value: config.value, element: wrapper})
  })
  
  return wrapper
  
  function setAttributes(element, obj=config) {
    Object.entries(obj).forEach(([key, value]) => {
      if ( typeof value !== 'object' && value !== null ) {
        element.setAttribute(key, value)
      }
    })
  }

  function getNestedObjects() {
    return Object.values(config).map(value => {
      return typeof value === 'object' && value !== null
        ? value
        : false
    }).filter(Boolean)
  }
}

export default createInput