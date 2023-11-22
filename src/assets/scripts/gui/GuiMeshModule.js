import GUI from 'lil-gui'
const defaultConfig = {

}

class GuiMeshModule {
  constructor(panel, config={}) {
    this.config = { ...defaultConfig, ...config }
    this.controlSet = this.config.controlSet

    this.folder = panel.addFolder(this.config.name)

    this.build()
  }

  fullControlSet() {

  }

  minimalControlSet() {

  }

  build() {

  }
}

export default GuiMeshModule