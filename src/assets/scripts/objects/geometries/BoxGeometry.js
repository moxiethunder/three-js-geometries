import boxGeometryConfig from './box-geometry-config'
import { BoxGeometry as Geometry, WireframeGeometry, LineBasicMaterial, LineSegments } from 'three'

class BoxGeometry {
  constructor(config={}, scene) {
    this.config = { ...boxGeometryConfig, ...config }
    this.geometry = new Geometry(this.config.width, this.config.height, this.config.depth, this.config.widthSegments, this.config.heightSegments, this.config.depthSegments)

    this.object = this.geometry
  }
}

export default BoxGeometry