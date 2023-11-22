import perspectiveCameraConfig from './perspective-camera-config'
import { PerspectiveCamera as Camera } from 'three'

class PerspectiveCamera {
  constructor(config = {}) {
    this.config = { ...perspectiveCameraConfig, ...config }
    this.camera = new Camera(
      this.config.fov,
      this.config.aspect,
      this.config.near,
      this.config.far
    );

    if ( this.config.hasOwnProperty('position') ) {
      this.camera.position.set(this.config.position.x, this.config.position.y, this.config.position.z)
    }

    for ( let key in this.config ) {
      if (
        this.config.hasOwnProperty(key)
        && this.camera[key] !== undefined
        && !['fov', 'aspect', 'near', 'far', 'position'].includes(key)
      ) {
        this.camera[key] = this.config[key]
      }
    }

    this.object = this.camera
  }
}

export default PerspectiveCamera