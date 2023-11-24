import { SpotLight as Light } from 'three'

const defaultConfig = {
  color: 0xffffff,
  intensity: 3,
  position: [10, 15, 20],
  target: [0, 0, 0],
  angle: Math.PI / 4,
  penumbra: 0.5,
  decay: 2,
  distance: 50,
}

class SpotLight {
  constructor(config={}) {
    this.config = { ...defaultConfig, ...config }
    this.light = new Light(this.config.color)
    this.light.intensity = this.config.intensity
    this.light.position.set(...this.config.position)
    this.light.angle = this.config.angle
    this.light.penumbra = this.config.penumbra
    this.light.decay = this.config.decay
    this.light.distance = this.config.distance

    this.object = this.light
  }
}

export default SpotLight