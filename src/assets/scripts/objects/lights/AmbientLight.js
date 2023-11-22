import ambientLightConfig from './ambient-light-config'
import { AmbientLight as Light } from 'three'

class AmbientLight {
  constructor(config={}) {
    this.config = { ...ambientLightConfig, ...config }
    this.light = new Light(this.config.color, this.config.intensity)
    
    this.object = this.light
  }

}

export default AmbientLight