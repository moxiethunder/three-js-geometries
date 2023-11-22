import meshStandardConfig from './mesh-standard-config'
import { MeshStandardMaterial as Material } from 'three'

class MeshStandardMaterial {
  constructor(config={}) {
    this.config = { ...meshStandardConfig, ...config }
    this.material = new Material(this.config)

    this.object = this.material
  }
}

export default MeshStandardMaterial