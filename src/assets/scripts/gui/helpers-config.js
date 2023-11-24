const helpersConfig = [
  {
    type: 'CameraHelper',
    name: 'camera helper',
    show: false
  },
  {
    type: 'BoxHelper',
    name: 'box helper',
    config: [0xff0000],
    show: false
  },
  {
    type: 'AxesHelper',
    name: 'axes helper',
    config: [5],
    show: false
  },
  {
    type: 'GridHelper',
    name: 'grid helper',
    config: [10, 16, 0x0000ff, 0x808080],
    show: false
  },
  {
    type: 'PolarGridHelper',
    name: 'polar grid helper',
    config: [5, 8, 16, 64, 0x0000ff, 0x808080],
    show: false
  }
]

export default helpersConfig