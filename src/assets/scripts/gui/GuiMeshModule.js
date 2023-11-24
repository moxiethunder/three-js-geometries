const defaultConfig = {
  name: 'Mesh Controls',
  controlSet: 'full',
}

class GuiMeshModule {
  constructor(obj, panel, config={}) {
    this.obj = obj
    this.config = { ...defaultConfig, ...config }
    
    this.folder = panel.addFolder(this.config.name)
    
    if ( this.config.controlSet === 'full' ) this.fullControlSet()
    else this.minimalControlSet()

    this.preset = this.folder.save()
  }

  revert() {
    this.folder.load(this.preset)
  }

  fullControlSet() {
    const params = {
      rotation: {
        x: {step: 0.1, min: Math.PI * -2, max: Math.PI * 2},
        y: {step: 0.1, min: Math.PI * -2, max: Math.PI * 2},
        z: {step: 0.1, min: Math.PI * -2, max: Math.PI * 2},
      },
      position: {
        x: {step: 0.1, min: -10, max: 10},
        y: {step: 0.1, min: -10, max: 10},
        z: {step: 0.1, min: -10, max: 10},
      }
    }

    Object.entries(params).forEach(([key, value]) => {
      const threeObject = this.obj[key]
      Object.entries(value).forEach(([prop, config]) => {
        this.folder.add(threeObject, prop).step(config.step).min(config.min).max(config.max).name(`${key} ${prop}`)
      }) 
    })

    this.folder.add(this, 'revert').name('Revert')
  }

  minimalControlSet() {

  }
}

export default GuiMeshModule