const defaultConfig = {
  name: 'AmbientLight Controls',
  controlSet: 'full',
}

class GuiAmbientLightModule {
  constructor(obj, panel, config={}) {
    this.config = { ...defaultConfig, ...config }
    this.obj = obj

    this.folder = panel.addFolder(this.config.name)
    
    if ( this.config.controlSet === 'full' ) this.fullControlSet()
    else this.minimalControlSet()

    this.preset = this.folder.save()
  }

  revert() {
    this.folder.load(this.preset)
  }

  fullControlSet() {
    

    this.folder.add(this, 'revert').name('Revert')
  }

  minimalControlSet() {

  }
}

export default GuiAmbientLightModule