import GUI from 'lil-gui'
import EventBus from '@scripts/services/EventBus'
import { isEmpty } from '@scripts/utils/utils'

const createDebugGUI = (guiConfig, currentMaterial, materialsObject, availableMaterials, lights={}) => {
  //FUNCTIONS
  const handleMaterialChange = (newType) => {
    const previousType = materialData.currentType
    materialData.previousType = previousType
    materialData.currentType = newType
    materialData.currentMaterial = materialsObject[newType]
    materialData.showLight = materialsObject[newType].showLight

    const needsUpdate = gui.controllers.find(controller => controller.property === 'currentType')
    needsUpdate.updateDisplay()

    destroySharedControls()
    destroyLightControls()
    buildSharedControls()
    buildLightControls()
    if ( folders.length > 0 ) findFirstFolder()
    EventBus.publish('UpdateMaterial', newType)
  }

  const findFirstFolder = () => {
    folders[0].domElement.setAttribute('mxt_gui_first', '')
  }

  const buildChangeMaterialControls = () => {
    gui.add(materialData, 'currentType')
    .name('current material')
    .disable(true)
    .title='mxt_gui_materialType'
    
    gui.add(materialData, 'selectedType', [... materialData.availableTypes])
    .name('available materials')
    .onChange(value => handleMaterialChange(value))
    .title='mxt_gui_availableTypes'
  }

  const destroySharedControls = () => {
    const sharedControls = gui.controllers.filter(control => control.property !== 'currentType' && control.property !== 'selectedType')
    sharedControls.forEach(control => control.destroy())
  }

  const destroyLightControls = () => {
    const lightControls = gui.folders.filter(folder => folder._title.toLowerCase().includes('light'))
    if ( lightControls.length > 0 ) {
      lightControls.forEach(control => control.destroy())
    }
  }

  const buildSharedControls = () => {
    const currentMaterial = materialData.currentMaterial.material
    if ( currentMaterial.hasOwnProperty('visible') ) {
      gui.add(currentMaterial, 'visible')
      .name('show material')
      .title='mxt_gui_visible'
    }

    if ( currentMaterial.hasOwnProperty('wireframe') ) {
      gui.add(currentMaterial, 'wireframe')
    .name('show wireframe')
    .title='mxt_gui_wireframe'
  }

    if ( currentMaterial.hasOwnProperty('color') ) {
      gui.addColor(currentMaterial, 'color')
    .name('material color')
    .title='mxt_gui_materialColor'
    }

    if ( currentMaterial.hasOwnProperty('transparent') ) {
      gui.add(currentMaterial, 'transparent')
      .name('allow transparency')
      .title='mxt_gui_transparency'
    }

    if ( currentMaterial.hasOwnProperty('opacity') ) {
      gui.add(currentMaterial, 'opacity')
      .min(0)
      .max(1)
      .step(0.01)
      .name('material opacity')
      .title='mxt_gui_opacity'
    }

    if ( currentMaterial.hasOwnProperty('roughness') ) {
      gui.add(currentMaterial, 'roughness')
      .min(0)
      .max(1)
      .step(0.01)
      .name('roughness')
      .title='mxt_gui_roughness'
    }

    if ( currentMaterial.hasOwnProperty('metalness') ) {
      gui.add(currentMaterial, 'metalness')
      .min(0)
      .max(1)
      .step(0.01)
      .name('metalness')
      .title='mxt_gui_metalness'
    }

    if ( currentMaterial.hasOwnProperty('_transmission') ) {
      gui.add(currentMaterial, '_transmission')
      .min(0)
      .max(1)
      .step(0.01)
      .name('transmission')
      .title='mxt_gui_transmission'
    }

    console.log(currentMaterial)

    if ( currentMaterial.hasOwnProperty('ior') ) {
      gui.add(currentMaterial, 'ior')
      .min(1)
      .max(10)
      .step(0.01)
      .name('ior')
      .title='mxt_gui_ior'
    }

    if ( currentMaterial.hasOwnProperty('thickness') ) {
      gui.add(currentMaterial, 'thickness')
      .min(0)
      .max(1)
      .step(0.01)
      .name('thickness')
      .title='mxt_gui_thickness'
    }

    // if ( currentMaterial.hasOwnProperty('_iridescence') ) {
    //   gui.add(currentMaterial, '_iridescence')
    //   .min(0)
    //   .max(1)
    //   .step(0.01)
    //   .name('iridescence')
    //   .title='mxt_gui_iridescence'
    // }

    // if ( currentMaterial.hasOwnProperty('iridescenceIOR') ) {
    //   gui.add(currentMaterial, 'iridescenceIOR')
    //   .min(1)
    //   .max(2.33)
    //   .step(0.001)
    //   .name('iridescenceIOR')
    //   .title='mxt_gui_iridescenceIOR'
    // }

    // if ( currentMaterial.hasOwnProperty('iridescenceThicknessRange') ) {
    //   gui.add(currentMaterial.iridescenceThicknessRange, '0')
    //   .min(1)
    //   .max(1000)
    //   .step(1)
    //   .name('irediscence thickness range A')
    //   .title='mxt_gui_iridescenceThicknessRange0'
    // }

    // if ( currentMaterial.hasOwnProperty('iridescenceThicknessRange') ) {
    //   gui.add(currentMaterial.iridescenceThicknessRange, '1')
    //   .min(1)
    //   .max(1000)
    //   .step(1)
    //   .name('irediscence thickness range B')
    //   .title='mxt_gui_iridescenceThicknessRange1'
    // }

    // if ( currentMaterial.hasOwnProperty('_sheen') ) {
    //   gui.add(currentMaterial, '_sheen')
    //   .min(0)
    //   .max(1)
    //   .step(0.01)
    //   .name('sheen')
    //   .title='mxt_gui_sheen'
    // }

    // console.log(currentMaterial)

    // if ( currentMaterial.hasOwnProperty('sheenRoughness') ) {
    //   gui.add(currentMaterial, 'sheenRoughness')
    //   .min(0)
    //   .max(1)
    //   .step(0.01)
    //   .name('sheen roughness')
    //   .title='mxt_gui_sheenRoughness'
    // }

    // if ( currentMaterial.hasOwnProperty('sheenColor') ) {
    //   gui.addColor(currentMaterial, 'sheenColor')
    //   .name('sheen color')
    //   .title='mxt_gui_sheenColor'
    // }

    // if ( currentMaterial.hasOwnProperty('_clearcoat') ) {
    //   gui.add(currentMaterial, '_clearcoat')
    //   .min(0)
    //   .max(1)
    //   .step(0.01)
    //   .name('clearcoat')
    //   .title='mxt_gui_clearcoat'
    // }

    // if ( currentMaterial.hasOwnProperty('clearcoatRoughness') ) {
    //   gui.add(currentMaterial, 'clearcoatRoughness')
    //   .min(0)
    //   .max(1)
    //   .step(0.01)
    //   .name('clearcoat roughness')
    //   .title='mxt_gui_clearcoatRoughness'
    // }

    if ( currentMaterial.hasOwnProperty('flatShading') ) {
      gui.add(currentMaterial, 'flatShading')
      .name('flat shading')
      .onChange(value => console.log(currentMaterial.flatShading))
      .title='mxt_gui_flatShading'
    }

    if ( currentMaterial.hasOwnProperty('shininess') ) {
      gui.add(currentMaterial, 'shininess')
      .min(0)
      .max(1000)
      .step(1)
      .name('material shininess')
      .title='mxt_gui_shininess'
    }
    
    if ( currentMaterial.hasOwnProperty('specular') ) {
      gui.addColor(currentMaterial, 'specular')
      .name('material specular')
      .title='mxt_gui_specular'
    }
  }

  const buildLightControls = () => {
    if ( typeof lights !== 'object' || lights === null || Array.isArray(lights) ) {
      console.error('createDebugGUI: lights must be an obj.materialect')
    } else {
      if ( !isEmpty(lights) && lights.hasOwnProperty('ambient') && materialData.showLight ) {
        buildAmbientLightControls()
      }
      if ( !isEmpty(lights) && lights.hasOwnProperty('point') && materialData.currentMaterial.showLight ) {
        buildPointLightControls()
      }
    }
  }

  const buildAmbientLightControls = () => {
    const ambientLightFolder = gui.addFolder('Ambient Light').close()
    ambientLightFolder.addColor(lights.ambient, 'color')
    .name('light color')
    .title='mxt_gui_ambientLightColor'

    ambientLightFolder.add(lights.ambient, 'intensity')
    .min(0)
    .max(50)
    .step(0.01)
    .name('light intensity')
    .title='mxt_gui_ambientLightIntensity'
  }

  const buildPointLightControls = () => {
    const pointLightFolder = gui.addFolder('Point Light').close()

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
  }

  //INITIALIZE GUI PANEL
  const debugWrapper = document.getElementById('mxt_debug_gui')
  const gui = new GUI({container: debugWrapper, ...guiConfig})
  gui.domElement.setAttribute('mxt_theme_dark', '')

  //GUI CHILDREN
  const controllers = gui.controllers
  const folders = gui.folders

  //MATERIAL TYPE CONFIG
  const materialData = {
    currentMaterial: materialsObject[currentMaterial],

    showLight: materialsObject[currentMaterial].showLight,

    currentType: materialsObject[currentMaterial].material.type,
    selectedType: materialsObject[currentMaterial].material.type,
    previousType: null,
    availableTypes: availableMaterials,
  }

  //CHANGE MATERIAL TYPE
  buildChangeMaterialControls()

  //SHARED PROPERTIES CONTROLS
  buildSharedControls()

  //LIGHT CONTROLS
  buildLightControls()

  if ( folders.length > 0 ) findFirstFolder()
  return gui
}

export default createDebugGUI