import * as THREE from 'three'
import EventBus from '@scripts/services/EventBus'
const defaultConfig = {
  name: 'Box Geometry Controls',
  controlSet: 'full',
}

class GuiBoxGeometryModule {
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
    const dimensions = ['width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments']

    const params = dimensions.map(dimension => ({
      name: dimension,
      min: dimension.includes('Segment') ? 1 : 0.1,
      max: dimension.includes('Segment') ? 20 : 30,
      step: dimension.includes('Segment') ? 1 : 0.1,
    }))

    params.forEach(param => {
      this.folder.add(this.obj.parameters, param.name)
      .min(param.min)
      .max(param.max)
      .step(param.step)
      .name(param.name)
      .onChange(() => this.updateGeometry())
      .onFinishChange(() => this.updateGeometry())
    })

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
    this.mesh.geometry = new THREE.BoxGeometry(
      this.obj.parameters.width,
      this.obj.parameters.height,
      this.obj.parameters.depth,
      this.obj.parameters.widthSegments,
      this.obj.parameters.heightSegments,
      this.obj.parameters.depthSegments,
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

export default GuiBoxGeometryModule