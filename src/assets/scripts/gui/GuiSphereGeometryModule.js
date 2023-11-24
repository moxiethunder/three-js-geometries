import * as THREE from 'three'
import EventBus from '@scripts/services/EventBus'
const defaultConfig = {
  name: 'Sphere Geometry Controls',
  controlSet: 'full',
}

class GuiSphereGeometryModule {
  constructor(mesh, obj, panel, isHidden=false, config={}) {
    this.config = { ...defaultConfig, ...config }
    this.mesh = mesh
    this.obj = obj
    this.wireframe = this.findWireframe()
    this.colorRGB = this.getWireframeColor()
    this.folder = isHidden
      ? panel.addFolder(this.config.name).hide()
      : panel.addFolder(this.config.name)

    this.config.controlSet === 'full'
      ? this.fullControlSet()
      : this.minimalControlSet()

    this.preset = this.folder.save()
    this.subscribeToEventBus()
  }

  fullControlSet() {    
    this.folder.add(this.obj.parameters, 'radius')
    .min(0.1)
    .max(20)
    .step(0.1)
    .name('radius')
    .onChange(() => this.updateGeometry())
    .onFinishChange(() => this.updateGeometry())
    .title='gui_slider_radius'

    this.folder.add(this.obj.parameters, 'widthSegments')
    .min(1)
    .max(50)
    .step(1)
    .name('widthSegments')
    .onChange(() => this.updateGeometry())
    .onFinishChange(() => this.updateGeometry())
    .title='gui_slider_widthSegments'

    this.folder.add(this.obj.parameters, 'heightSegments')
    .min(1)
    .max(50)
    .step(1)
    .name('heightSegments')
    .onChange(() => this.updateGeometry())
    .onFinishChange(() => this.updateGeometry())
    .title='gui_slider_heightSegments'


    this.folder.add(this, 'revert').name('Revert')
  }

  minimalControlSet() {

  }

  updateGeometry() {
    this.disposeGeometry()
    this.createGeometry()
    this.updateWireframe()
    EventBus.publish('GeometryUpdated', this.wireframe)
  }
  
  disposeGeometry() {
    if ( this.mesh.geometry ) this.mesh.geometry.dispose()
    if ( this.wireframe ) {
      this.mesh.remove(this.wireframe)
      this.wireframe.geometry.dispose()
      this.wireframe.material.dispose()
    }
  }
  
  createGeometry() {
    this.mesh.geometry = new THREE.SphereGeometry(
      this.obj.parameters.radius,
      this.obj.parameters.widthSegments,
      this.obj.parameters.heightSegments,
    )
  }

  updateWireframe() {
    const wireframeGeometry = new THREE.WireframeGeometry(this.mesh.geometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: this.colorRGB })
    this.wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    this.mesh.add(this.wireframe)
  }

  findWireframe() {
    return this.mesh.children.find(child => child instanceof THREE.LineSegments)
  }

  getWireframeColor() {
    return this.wireframe 
      ? this.wireframe.material.color
      : new THREE.Color(0xffffff)
  }

  subscribeToEventBus() {
    EventBus.subscribe('ColorUpdated', (event) => {
      this.colorRGB = event.getRGB(event)
    })
  }

  revert() {
    this.folder.load(this.preset)
  }
}

export default GuiSphereGeometryModule