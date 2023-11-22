//This imports all of the classes used to configure and instantiate the various objects 

import ConeGeometry from '@scripts/objects/geometries/ConeGeometry'
import BoxGeometry from '@scripts/objects/geometries/BoxGeometry'
import MeshStandardMaterial from '@scripts/objects/materials/MeshStandardMaterial'
import AmbientLight from '@scripts/objects/lights/AmbientLight'
import PointLight from '@scripts/objects/lights/PointLight'
import DirectionalLight from '@scripts/objects/lights/DirectionalLight'
import PerspectiveCamera from '@scripts/objects/cameras/PerspectiveCamera'

const ThreeObjectConstructors = {
  ConeGeometry,
  BoxGeometry,
  MeshStandardMaterial,
  AmbientLight,
  PointLight,
  DirectionalLight,
  PerspectiveCamera
}

export default ThreeObjectConstructors