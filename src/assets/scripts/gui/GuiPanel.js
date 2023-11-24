import GuiModuleConstructors from '@scripts/gui/GuiModuleConstructors'
import ThreeObjectConstructors from '@scripts/classes/ThreeObjectConstructors'
import EventBus from '@scripts/services/EventBus'
import GUI from 'lil-gui'
import helpersConfig from '@scripts/gui/helpers-config'
import * as THREE from 'three'
import { buildGeometry, createWireframe, buildGui } from '@scripts/utils/render-utils'

const defaultConfig = {
  title: 'Three.js Controls',
  width: 300,
  startOpen: true,
  id: 'controls',
  theme: 'dark',
  closeFolders: true,
  controlSet: 'full',
  showHelpers: true,
  showFunctions: true,
  showStats: false,
  showSceneControls: true,
  segmentConfig: {
    color: 0xffffff,
    transparent: false,
    opacity: 1,
    depthTest: true,
  },
  showControls: [
    'geometry',
    // 'camera',
    'mesh',
    'material',
    'light',
  ]
}

class GuiPanel {
  constructor(assets, config={}) {
    // SCENE AND PANEL DATA
    this.config = { ...defaultConfig, ...config }
    this.functions = assets.functions
    this.scene = assets.scene
    this.sceneObjects = this.returnSceneObjects()
    this.mesh = this.sceneObjects.objects.mesh.object
    this.material = this.sceneObjects.objects.mesh.object.material
    this.wireframe = null
    this.geometry = this.sceneObjects.objects.mesh.object.geometry
    this.camera = assets.camera
    this.renderer = assets.renderer

    // SEND EVENT TO HIDE GUI PANEL
    EventBus.subscribe('KeyDown', this.hideControls.bind(this))
    
    // STORE FOR GUI ELEMENTS
    this.GuiElements = {
      instance: null,
      folders: [],
      controllers: [],
    }

    this.configureGuiWrapper()
    this.configureChangeGeometry()
    this.configureSceneHelpers()
    this.configureFunctionControls()
    this.configureSceneControls()

    // ADD PANELS
    if ( this.config.hasOwnProperty('showControls') && this.config.showControls.length > 0 ) {
      this.config.showControls.forEach(key => {
        this.buildObjectControlPanels(key)
      })
    }

    // CLOSE FOLDERS
    if ( this.config.closeFolders ) {
      this.GuiWrapper.folders.forEach(folder => {
        folder.close()
      })
    }



    EventBus.subscribe('GeometryUpdated', this.updateWireframeControl.bind(this))
  }

  configureGuiWrapper() {
    // BUILD GUI WRAPPER
    this.GuiWrapper = new GUI({
      title: this.config.title,
      width: this.config.width,
      open: this.config.open,
    })

    // ADD ID AND ATTRIBUTES
    this.GuiWrapper.domElement.setAttribute('id', `mxt-gui--${this.config.id}`)
    this.GuiWrapper.domElement.setAttribute(`mxt_theme_${this.config.theme}`, '')

    // OPEN OR CLOSE PANEL
    if ( !this.config.startOpen ) this.GuiWrapper.close()

    // ADD GUI INSTANCE TO STORE
    this.GuiElements.instance = this.GuiWrapper
  }
  
  configureChangeGeometry() {
    this.geometryData = {
      currentGeometry: this.geometry.type,
      selectedGeometry: this.geometry.type,
      availableGeometries: this.getAvailableGeometries(),
    }

    const currentGeometryController = this.GuiWrapper
    .add(this.geometryData, 'currentGeometry')
    .name('current geometry')
    .disable()
    .title='gui_text_currentGeometry'

    const availableGeometryController = this.GuiWrapper
    .add(this.geometryData, 'selectedGeometry', [...this.geometryData.availableGeometries])
    .name('available geometries')
    .onChange(type => this.updateGeometry(type, this.geometryData.currentGeometry))
    .title='gui_dropdown_availableGeometries'

    this.buildControllersArray(this.GuiWrapper)
  }

  configureSceneControls() {
    if ( !this.config.showSceneControls ) return

    this.wireframe = createWireframe(this.geometry, this.mesh, this.config.segmentConfig)

    this.sceneFolder = this.GuiWrapper.addFolder('Scene Controls')
    this.GuiElements.folders.push(this.sceneFolder)

    const materialColorControl = this.sceneFolder
    .addColor(this.material, 'color')
    .name('mesh color')
    .title='gui_color_materialColor'

    const wireframeColorControl = this.sceneFolder
    .addColor(this.wireframe.material, 'color')
    .name('segment color')
    .onChange(event => EventBus.publish('ColorUpdated', event))
    .title="gui_color_wireframeColor"

    const wireframeVisibilityControl = this.sceneFolder
    .add(this.wireframe, 'visible')
    .name('show segments')
    .onChange(event => this.wireframe.visible = event)
    .title="gui_checkbox_wireframeVisibility"

    const sceneBackgroundControl = this.sceneFolder
    .addColor(this.scene, 'background')
    .name('scene background')
    .title='gui_color_sceneBackground'
    
    const showWireframeControl = this.sceneFolder
    .add(this.material, 'wireframe')
    .name('wireframe')
    .onChange(event => this.material.wireframe = event)
    .title='gui_checkbox_showWireframe'

    this.buildControllersArray(this.sceneFolder)

    let preset = this.sceneFolder.save()
    let revert = {
      loadPreset: () => {
        this.sceneFolder.load(preset)
      }
    }

    this.sceneFolder.add(revert, 'loadPreset').name('revert')
  }

  configureFunctionControls() {
    if ( !this.config.showFunctions ) return
    this.functionsFolder = this.GuiWrapper.addFolder('Functions')
    this.functionsFolder.domElement.setAttribute('mxt_gui_functions', '')
    this.GuiElements.folders.push(this.functionsFolder)
    
    Object.keys(this.functions).forEach(key => {
      const parts = key.split(/(?=[A-Z])/)
      const name = parts.join(' ').toLowerCase()

      const controller = this.functionsFolder
      .add(this.functions, key)
      .name(name)
      .title=`gui_button_${key}`
    })

    this.buildControllersArray(this.functionsFolder)
  }

  configureSceneHelpers() {
    if ( !this.config.showHelpers ) return

    this.helperFolder = this.GuiWrapper.addFolder('Helpers')
    this.helperFolder.domElement.setAttribute('mxt_gui_helpers', '')
    this.GuiElements.folders.push(this.helperFolder)

    helpersConfig.forEach(item => {
      let helper

      switch (item.type) {
        case 'CameraHelper':
          helper = new THREE[item.type](this.camera);
          helper.visible = item.show
          break;
        case 'BoxHelper':
          helper = new THREE[item.type](this.mesh, ...item.config);
          helper.visible = item.show
          break;
        default:
          if (item.type !== 'CameraHelper' && item.type !== 'BoxHelper') {
            helper = new THREE[item.type](...item.config);
            helper.visible = item.show
          } else {
            return false;
          }
          break;
      }

      this.scene.add(helper)

      const title = item.type.charAt(0).toLowerCase() + item.type.slice(1)
      this.helperFolder
      .add(item, 'show')
      .name(item.name)
      .onChange(event => helper.visible = event)
      .title=`gui_checkbox_${title}`
    })

    this.buildControllersArray(this.helperFolder)
    this.sceneObjects = this.returnSceneObjects()
  }

  updateGeometry(type, previousType) {
    const newAssets = buildGeometry({
      mesh: this.mesh,
      wireframe: this.wireframe,
      scene: this.scene,
    }, type, this.config.segmentConfig)

    this.geometry = newAssets.geometry
    this.wireframe = newAssets.wireframe

    this.geometryData.currentGeometry = type

    for ( let i = 0; i < this.GuiWrapper.controllers.length; i++ ) {
      const controller = this.GuiWrapper.controllers[i]
      if ( controller.property === 'currentGeometry' ) {
        controller.updateDisplay()
      }
    }

    this.updateGeometryControlPanel(type, previousType)
  }

  updateGeometryControlPanel(currentType, previousType) {
    const guiFolders = this.GuiWrapper.folders
    const previousFolderName = previousType.split(/(?=[A-Z])/).join(' ')
    const previousFolderIndex = guiFolders.findIndex(folder => folder._title.includes(previousFolderName))
    
    const domFolders = this.GuiWrapper.domElement.querySelectorAll('.lil-gui')
    const targetFolder = domFolders[previousFolderIndex - 1]
    
    const constructor = new GuiModuleConstructors[`Gui${currentType}Module`](this.mesh, this.geometry, this.GuiWrapper)
    this.GuiElements.folders.push(constructor.folder)
    
    this.GuiWrapper.folders[previousFolderIndex].destroy()
    guiFolders.splice(previousFolderIndex, 0, constructor.folder)
    guiFolders.pop()
    
    targetFolder.after(constructor.folder.domElement)
    constructor.folder.close()
    constructor.folder.show()
  }

  buildObjectControlPanels(name) {
    if ( name === 'geometry') {
      const name = this.geometry.type
      const fn = `Gui${name}Module`
      this[`${name}Controls`] = new GuiModuleConstructors[fn](this.mesh, this.geometry, this.GuiWrapper)

      this.GuiElements.folders.push(this[`${name}Controls`].folder)
    }

    if ( name === 'mesh') {
      const name = this.mesh.type
      const fn = `Gui${name}Module`
      this.meshControls = new GuiModuleConstructors[fn](this.mesh, this.GuiWrapper)

      this.GuiElements.folders.push(this.meshControls.folder)
    }

    if ( name === 'material') {
      const name = this.material.type
      const fn = `Gui${name}Module`
      this.materialControls = new GuiModuleConstructors[fn](this.material, this.GuiWrapper)

      this.GuiElements.folders.push(this.materialControls.folder)
    }

    if ( name === 'camera') {
      const name = this.camera.type
      const fn = `Gui${name}Module`
      this.cameraControls = new GuiModuleConstructors[fn](this.mesh, this.camera, this.GuiWrapper)

      this.GuiElements.folders.push(this.cameraControls.folder)
    }

    if ( name === 'light') {
      const lights = Object.values(this.sceneObjects.objects).filter(value => value.category === 'light').reduce((acc, curr) => {
        return [...acc, curr.object]
      }, [])

      this.lightControls = new GuiModuleConstructors.GuiLightsModule(lights, this.GuiWrapper)

      this.GuiElements.folders.push(this.lightControls.folder)
    }
  }

  getAvailableGeometries() {
    return Object.keys(GuiModuleConstructors).filter(item => item.includes('Geometry')).map(item => item.replace('Gui', '').replace('Module', ''))
  }

  changeGeometry(type) {
    const constructor = ThreeObjectConstructors[type]

    if ( !constructor ) {
      console.error(`No object found with type ${type}`)
      return null
    }

    if ( this.mesh.geometry ) this.mesh.geometry.dispose()
    if ( this.wireframe) {
      this.mesh.remove(this.wireframe)
      this.wireframe.geometry.dispose()
      this.wireframe.material.dispose()
    }
    
    const newGeometry = new constructor({}, this.scene)
    this.geometry = newGeometry.object
    this.mesh.geometry = this.geometry

    this.wireframe = createWireframe(this.geometry, this.mesh, this.config.segmentConfig, setWireframeProperties)
  }
  
  returnSceneObjects() {
    const children = this.scene.children

    const reducer = (acc, curr) => {
      const str = curr.type
      const parts = str.split(/(?=[A-Z])/)
      const objectName = curr.type.toLowerCase().includes('helper')
        ? 'helpers'
        : 'objects'

      acc[objectName][curr.type.toLowerCase()] = {
        name: parts.join(' ').toLowerCase(),
        category: parts[parts.length - 1].toLowerCase(),
        object: curr,
        type: curr.type
      }

      return acc
    }

    return children.reduce(reducer, { objects: {}, helpers: {} })
  }

  hideControls(e) {
    if ( e.shiftKey && ( e.key === 'h' || e.key === 'H' ) ) {
      this.GuiWrapper.show(this.GuiWrapper._hidden)
    }
  }

  updateWireframeControl(wireframe) {
    const wireframeColor = this.GuiElements.controllers.find(controller => controller.title.endsWith('wireframeColor'))
    wireframeColor.object = wireframe.material
    const wireframeVisibility = this.GuiElements.controllers.find(controller => controller.title.endsWith('wireframeVisibility'))
    wireframeVisibility.object = wireframe

    wireframeColor.updateDisplay()
    wireframeVisibility.updateDisplay()
    if ( this.wireframe ) {
      this.mesh.remove(this.wireframe)
      this.wireframe.geometry.dispose()
      this.wireframe.material.dispose()
    }
    this.wireframe = wireframe
  }

  buildControllersArray(folder) {
    this.GuiElements.controllers.push(...folder.controllers)
  }
}

export default GuiPanel