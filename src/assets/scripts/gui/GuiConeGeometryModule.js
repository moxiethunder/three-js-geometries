import * as THREE from 'three'
import EventBus from '@scripts/services/EventBus'
const defaultConfig = {
  name: 'Cone Geometry Controls',
  controlSet: 'full',
}

class GuiConeGeometryModule {
  constructor(mesh, obj, panel, config={}) {
    this.config = { ...defaultConfig, ...config }
    this.mesh = mesh
    this.obj = obj
    this.wireframe = this.findWireframe()
    this.colorRGB = this.getWireframeColor()
    this.folder = panel.addFolder(this.config.name)

    this.config.controlSet === 'full'
      ? this.fullControlSet()
      : this.minimalControlSet()

    this.preset = this.folder.save()
    this.subscribeToEventBus()
  }

  fullControlSet() {
    this.folder.add(this.obj.parameters, 'openEnded')
    .name('open ended')
    .onChange(() => this.updateGeometry())
    .title='gui_checkbox_openEnded'

    this.folder.add(this.obj.parameters, 'radius')
    .min(0.1)
    .max(20)
    .step(0.1)
    .name('radius')
    .onChange(() => this.updateGeometry())
    .title='gui_slider_radius'

    this.folder.add(this.obj.parameters, 'height')
    .min(1)
    .max(10)
    .step(0.1)
    .name('height')
    .onChange(() => this.updateGeometry())
    .title='gui_slider_height'

    this.folder.add(this.obj.parameters,'radialSegments')
    .min(1)
    .max(50)
    .step(1)
    .name('radial segments')
    .onChange(() => this.updateGeometry())
    .title='gui_slider_radialSegments'

    this.folder.add(this.obj.parameters, 'heightSegments')
    .min(1)
    .max(50)
    .step(1)
    .name('height segments')
    .onChange(() => this.updateGeometry())
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
    this.mesh.geometry = new THREE.ConeGeometry(
      this.obj.parameters.radius,
      this.obj.parameters.height,
      this.obj.parameters.radialSegments,
      this.obj.parameters.heightSegments,
      this.obj.parameters.openEnded,
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

export default GuiConeGeometryModule