import directionalLightConfig from './directional-light-config'
import { DirectionalLight as Light } from 'three'

class DirectionalLight {
  constructor(config={}) {
    this.config = { ...directionalLightConfig, ...config }
    this.light = new Light(this.config.color, this.config.intensity)

    
    if ( this.config.hasOwnProperty('position') ) {
      this.light.position.set(this.config.position.x, this.config.position.y, this.config.position.z)
    }

    this.object = this.light
  }
}

export default DirectionalLight