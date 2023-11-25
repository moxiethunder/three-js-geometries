import GUI from 'lil-gui'
import EventBus from '@scripts/services/EventBus'

const createDebugGUI = (config, obj, lights, types) => {
  //FUNCTIONS
  const handleMaterialChange = (newType) => {
    const previousType = materialData.currentType
    materialData.currentType = newType
    materialData.previousType = previousType
    controllers.find(controller => controller.property === 'currentType').updateDisplay()
    EventBus.publish('UpdateMaterial', newType)
  }

  const findFirstFolder = () => {
    folders[0].domElement.setAttribute('mxt_gui_first', '')
  }

  //INITIALIZE GUI PANEL
  const debugWrapper = document.getElementById('mxt_debug_gui')
  const gui = new GUI({container: debugWrapper, ...config})
  gui.domElement.setAttribute('mxt_theme_dark', '')

  const controllers = gui.controllers
  const folders = gui.folders

  //MATERIAL TYPE CONFIG
  const materialData = {
    currentType: obj.type,
    previousType: null,
    availableTypes: types,
  }

  //CHANGE MATERIAL TYPE
  gui.add(materialData, 'currentType')
  .name('current material')
  .disable(true)
  .title='mxt_gui_materialType'
  
  gui.add(materialData, 'availableTypes', [...materialData.availableTypes])
  .name('available materials')
  .onChange(value => handleMaterialChange(value))
  .title='mxt_gui_availableTypes'

  //SHARED PROPERTIES CONTROLS
  gui.add(obj, 'visible')
  .name('show material')
  .title='mxt_gui_visible'

  gui.add(obj, 'wireframe')
  .name('show wireframe')
  .title='mxt_gui_wireframe'

  gui.addColor(obj, 'color')
  .name('material color')
  .title='mxt_gui_materialColor'

  gui.add(obj, 'transparent')
  .name('allow transparency')
  .title='mxt_gui_transparency'

  gui.add(obj, 'opacity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('material opacity')
  .title='mxt_gui_opacity'

  //AMBIENT LIGHT CONTROLS
  const ambientLightFolder = gui.addFolder('Ambient Light')
  ambientLightFolder.addColor(lights.ambient, 'color')
  .name('light color')
  .title='mxt_gui_ambientLightColor'

  ambientLightFolder.add(lights.ambient, 'intensity')
  .min(0)
  .max(50)
  .step(0.01)
  .name('light intensity')
  .title='mxt_gui_ambientLightIntensity'

  //POINT LIGHT CONTROLS
  const pointLightFolder = gui.addFolder('Point Light')

  pointLightFolder.addColor(lights.point, 'color')
  .name('light color')
  .title='mxt_gui_pointLightColor'

  pointLightFolder.add(lights.point, 'intensity')
  .min(0)
  .max(50)
  .step(0.01)
  .name('light intensity')
  .title='mxt_gui_pointLightIntensity'

  pointLightFolder.add(lights.point.position, 'x')
  .min(-10)
  .max(10)
  .step(0.01)
  .name('light position x')
  .title='mxt_gui_pointLightPositionX'

  pointLightFolder.add(lights.point.position, 'y')
  .min(-10)
  .max(10)
  .step(0.01)
  .name('light position y')
  .title='mxt_gui_pointLightPositionY'

  pointLightFolder.add(lights.point.position, 'z')
  .min(-10)
  .max(10)
  .step(0.01)
  .name('light position z')
  .title='mxt_gui_pointLightPositionZ'

  findFirstFolder()
  return gui
}

export default createDebugGUI