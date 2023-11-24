const defaultConfig = {
  name: 'Material Controls',
  controlSet: 'full',
}

class GuiMeshStandardMaterialModule {
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
    this.folder.add(this.obj, 'transparent')
    .name('transparent')
    .onChange(event => {
      this.obj.transparent = event
    })

    this.folder.add(this.obj, 'opacity')
    .min(0.1)
    .max(1)
    .step(0.01)
    .name('opacity')
    .onChange(event => {
      this.obj.needsUpdate = true
    })

    this.folder.add(this.obj, 'visible')
    this.folder.addColor(this.obj, 'emissive')

    this.folder.add(this.obj, 'roughness')
    .min(0)
    .max(1)
    .step(0.01)

    this.folder.add(this.obj, 'metalness')
    .min(0)
    .max(1)
    .step(0.01)

    // this.folder.add(this.obj, 'flatShading')

    this.folder.add(this, 'revert').name('Revert')
  }

  minimalControlSet() {

  }
}

export default GuiMeshStandardMaterialModule