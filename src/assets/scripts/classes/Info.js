import * as ICONS from '@scripts/lib/icons'
import { createDomElement, createSvgNode, setElementAttributes } from '@scripts/utils/utils'
import { renderCameraData, renderMeshData } from '@scripts/utils/render-data'
import Modal from '@scripts/classes/Modal'
import EventBus from '@scripts/services/EventBus'

export class Info {
  constructor(config) {
    this.count = 0
    this.scene = config.scene
    this.type = config.type
    this.icons = this.type === 'camera'
      ? ['drag', 'scroll']
      : ['drag']

    EventBus.subscribe('MeshUpdated', renderMeshData)
    EventBus.subscribe('CameraUpdated', renderCameraData)
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

  createInfoSet(config) {
    const { type='div', task, text, object } = config

    if ( !task || !text || object === undefined ) {
      console.error('Missing required parameters in config object')
      return null
    }

    const container = createDomElement({
      type: 'div',
      props: {[`data-info-${task}`]: '',},
      classes: ['info-node', `info-node__${task}`],
    })

    const dataContainer = createDomElement({
      type: 'span',
    })

    dataContainer.textContent = object.toFixed(2).toString()

    container.appendChild(dataContainer)
    container.appendChild(document.createTextNode(text))

    return container
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

    const zoomInfo = this.createInfoSet({
      task: 'zoom',
      text: 'Camera Z Position',
      object: this.scene.camera.position.z
    })

    const fovInfo = this.createInfoSet({
      task: 'fov',
      text: 'Camera FOV',
      object: this.scene.camera.fov
    })

    const rotXInfo = this.createInfoSet({
      task: 'rotation-x',
      text: 'Mesh X Rotation',
      object: this.scene.mesh.rotation.x
    })

    const rotYInfo = this.createInfoSet({
      task: 'rotation-y',
      text: 'Mesh Y Rotation',
      object: this.scene.mesh.rotation.y
    })

    this.modal.appendChild(zoomInfo)
    this.modal.appendChild(fovInfo)
    this.modal.appendChild(rotXInfo)
    this.modal.appendChild(rotYInfo)
  }
}

export default Info