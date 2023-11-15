import * as ICONS from '@scripts/lib/icons.js'
import { createDomElement, createSvgNode, setElementAttributes } from '@scripts/utils/utils.js'
import Modal from '@scripts/classes/Modal.js'

export class Info {
  constructor(config) {
    this.type = config.type
    this.icons = this.type === 'camera'
      ? ['drag', 'scroll']
      : ['drag']
  }

  createInfoElement(icon) {
    const element = createDomElement({
      icon,
      type: 'div',
      props: {
        'data-info-icon': '',
        'aria-label': `icon-${icon}`
      },
      classes: ['info-icon', `info-icon--${icon}`],
    })

    const label = createDomElement({type: 'span'})
    const labelText = element.firstChild.dataset.label
    label.textContent = labelText
    element.appendChild(label)

    return element
  }

  renderCameraData() {

  }

  renderMeshData() {

  }

  renderInstructions() {

  }

  mount(selector) {
    this.container = document.getElementById(selector)
    this.modal = new Modal({
      type: 'info',
      container: this.container,
      icon: ICONS.info,
    }).mount()

    this.icons.forEach(icon => {
      this.modal.appendChild(this.createInfoElement(icon))
    })
  }
}

export default Info