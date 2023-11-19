import EventBus from '@scripts/services/EventBus'
import createInput from '@scripts/components/create-input'
import { handleSceneInputs } from '@scripts/services/EventHandlers'
import rangeSlider from '@scripts/components/range-slider'

class Inputs {
  constructor(config) {
    this.scene = config.scene

    this.inputConfig = [
      {
        type: 'color',
        id: 'mesh-color',
        value: this.getInitialValue(this.scene.mesh.material.color),
      },
      {
        type: 'color',
        id: 'scene-color',
        value: this.getInitialValue(this.scene.scene.background),
      },
      {
        type: 'range',
        id: 'ambient-light',
        value: this.getInitialValue(this.scene.ambientLight.intensity),
        range: {
          min: 0,
          max: 25,
          step: 0.25,
        },
      },
      {
        type: 'range',
        id: 'point-light',
        value: this.getInitialValue(this.scene.pointLight.intensity),
        range: {
          min: 0,
          max: 100,
          step: 1,
        },
      },
    ]

    this.inputElements = this.inputConfig.map(config => {
      return createInput(config, this.scene)
    })

    EventBus.subscribe('InputUpdated', handleSceneInputs)
  }

  getInitialValue(property) {
    const type = property.constructor.name

    if ( type === 'Color' ) {
      return `#${property.getHexString()}`
    } else {
      return property
    }
  }

  mount(selector) {
    this.container = document.getElementById(selector)

    if ( !this.container ) {
      console.error(`No container found with selector ${selector}`)
      return null
    }

    this.inputElements.forEach((element, index) => {
      this.container.appendChild(element)
      const children = Array.from(element.children)
      
      if ( children.includes(element.querySelector('[data-range-item]')) ) {
        rangeSlider(element, this.inputConfig[index].value)
      }
    })


    return this
  }
}

export default Inputs