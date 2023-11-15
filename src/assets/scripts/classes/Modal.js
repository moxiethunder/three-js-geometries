import { createDomElement, createSvgNode } from '@scripts/utils/utils.js'

class Modal {
  constructor(config) {
    this.type = config.type
    this.container = config.container
    this.containerID = this.container.id
    this.container.setAttribute('data-modal', '')
    this.container.setAttribute('aria-label', `modal-${this.type}`)
    this.icon = createSvgNode(config.icon)
    this.containerInner = createDomElement({
      type: 'div',
      props: {
        'data-collapsible': '',
        'aria-expanded': 'false',
      },
      classes: [this.containerID + '__inner'],
    })
  }

  mount() {
    this.container.appendChild(this.icon)
    this.container.appendChild(this.containerInner)
    this.icon.setAttribute('data-trigger', '')

    this.icon.addEventListener('click', () => {
      const isOpen = this.container.hasAttribute('data-modal-open')
      if ( isOpen ) {
        this.container.removeAttribute('data-modal-open')
        this.containerInner.setAttribute('aria-expanded', 'false')
        return
      }

      this.containerInner.setAttribute('aria-expanded', 'true')
      this.container.setAttribute('data-modal-open', '')
    })
    
    return this.containerInner
  }
}

export default Modal