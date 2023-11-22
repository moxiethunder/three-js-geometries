import pointLightConfig from './point-light-config'
import { PointLight as Light } from 'three'

class PointLight {
  constructor(config={}) {
    this.config = { ...pointLightConfig, ...config }
    this.light = new Light(this.config.color, this.config.intensity, this.config.distance, this.config.decay)

    
    if ( this.config.hasOwnProperty('position') ) {
      this.light.position.set(this.config.position.x, this.config.position.y, this.config.position.z)
    }

    this.object = this.light
  }
}

export default PointLight