import { SphereGeometry as Geometry } from 'three'
const defaultConfig = {
  radius: 2,
  widthSegments: 12,
  heightSegments: 12,
}

class SphereGeometry {
  constructor(config={}, scene) {
    this.config = { ...defaultConfig, ...config }
    this.geometry = new Geometry(this.config.radius, this.config.widthSegments, this.config.heightSegments)

    this.object = this.geometry
  }
}

export default SphereGeometry