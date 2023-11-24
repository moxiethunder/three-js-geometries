const defaultConfig = {
  name: 'Light Controls',
  controlSet: 'full',
}

class GuiLightModule {
  constructor(lights, panel, config={}) {
    this.config = { ...defaultConfig, ...config }
    this.lights = lights
    this.lightObj = this.lights.reduce((acc, curr) => {
      acc[curr.type] = curr
      return acc
    }, {})

    this.folder = panel.addFolder(this.config.name)
    
    if ( this.config.controlSet === 'full' ) this.fullControlSet()
    else this.minimalControlSet()

    this.preset = this.folder.save()
  }

  revert() {
    this.folder.load(this.preset)
  }

  fullControlSet() {
    const ambient = this.lightObj.AmbientLight
    const point = this.lightObj.PointLight

    this.folder.addColor(ambient, 'color').name('Ambient Color')
    this.folder.add(ambient, 'intensity')
    .min(0.1)
    .max(20)
    .step(0.1)
    .name('Ambient Intensity')

    this.folder.addColor(point, 'color').name('Point Color')
    this.folder.add(point, 'intensity')
    .min(0.1)
    .max(100)
    .step(0.1)
    .name('Point Intensity')
    // this.folder.add(point, 'distance')
    // .min(0)
    // .max(1000)
    // .step(1)
    // .name('Point Distance')
    // this.folder.add(point, 'decay')
    // .min(0)
    // .max(100)
    // .step(0.1)
    // .name('Point Decay')
    this.folder.add(point.position, 'x')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Point X')
    this.folder.add(point.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Point Y')
    this.folder.add(point.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Point Z')



    this.folder.add(this, 'revert').name('Revert')
  }

  minimalControlSet() {

  }
}

export default GuiLightModule