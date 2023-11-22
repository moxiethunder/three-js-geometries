import coneGeometryConfig from './cone-geometry-config'
import { ConeGeometry as Geometry } from 'three'

class ConeGeometry {
  constructor(config={}) {
    this.config = { ...coneGeometryConfig, ...config }
    this.geometry = new Geometry(this.config.radius, this.config.height, this.config.radialSegments, this.config.heightSegments, this.config.openEnded, this.config.thetaStart, this.config.thetaLength)

    this.object = this.geometry
  }
}

export default ConeGeometry