import GuiModuleConstructors from '@scripts/gui/GuiModuleConstructors'
import EventBus from '@scripts/services/EventBus'
import GUI from 'lil-gui'

const defaultConfig = {
  title: 'Three.js Controls',
  width: 300,
  startOpen: true,
}

class GuiPanel {
  constructor(assets, config={}) {
    this.functions = assets.functions
    this.scene = assets.scene
    this.camera = assets.camera
    this.renderer = assets.renderer
    this.config = { ...defaultConfig, ...config }

    this.controlPanel = new GUI({
      title: this.config.title,
      width: this.config.width,
      open: this.config.open,
    })

    if ( this.config.showFunctions ) {
      Object.keys(this.functions).forEach(key => {
        this.controlPanel.add(this.functions, key).name(key)
      })
    }

    if ( !this.config.startOpen ) this.controlPanel.close()

    if ( this.config.showStats ) {

    }

    console.log(this.camera, this.scene, this.renderer, this.config)

    EventBus.subscribe('DragMove', this.testing.bind(this))
  }

  addModules() {

  }

  testing(data) {
  }

  mount() {

  }
}

export default GuiPanel