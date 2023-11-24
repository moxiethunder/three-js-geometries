const defaultConfig = {
  name: 'Camera Controls',
  controlSet: 'full',
}

class GuiPerspectiveCameraModule {
  constructor(mesh, obj, panel, config={}) {
    this.obj = obj
    this.mesh = mesh
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
    this.folder.add(this.obj, 'fov')
    .min(35)
    .max(85)
    .step(0.5)
    .name('Field of View')
    .onChange(() => {
      this.obj.updateProjectionMatrix()
    })

    this.folder.add(this.obj.position, 'x')
    .min(-100)
    .max(100)
    .step(0.5)
    .name('X Position')
    .onChange(() => {
      this.obj.lookAt(this.mesh.position)
    })

    this.folder.add(this.obj.position, 'y')
    .min(-100)
    .max(100)
    .step(0.5)
    .name('Y Position')
    .onChange(() => {
      this.obj.lookAt(this.mesh.position)
    })

    this.folder.add(this.obj.position, 'z')
    .min(-100)
    .max(100)
    .step(0.5)
    .name('Z Position')
    .onChange(() => {
      this.obj.lookAt(this.mesh.position)
    })

    this.folder.add(this.obj.rotation, 'x')
    .min(-Math.PI * 2)
    .max(Math.PI * 2)
    .step(0.01)
    .name('X Rotation')

    this.folder.add(this.obj.rotation, 'y')
    .min(-Math.PI * 2)
    .max(Math.PI * 2)
    .step(0.01)
    .name('Y Rotation')
    
    this.folder.add(this.obj.rotation, 'z')
    .min(-Math.PI * 2)
    .max(Math.PI * 2)
    .step(0.01)
    .name('Z Rotation')

    this.folder.add(this, 'revert').name('Revert')
  }

  minimalControlSet() {

  }
}

export default GuiPerspectiveCameraModule