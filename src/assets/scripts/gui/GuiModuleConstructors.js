import GuiBoxGeometryModule from '@scripts/gui/GuiBoxGeometryModule'
import GuiSphereGeometryModule from '@scripts/gui/GuiSphereGeometryModule'
import GuiConeGeometryModule from '@scripts/gui/GuiConeGeometryModule'
import GuiMeshModule from '@scripts/gui/GuiMeshModule'
import GuiMeshStandardMaterialModule from '@scripts/gui/GuiMeshStandardMaterialModule'
import GuiAmbientLightModule from '@scripts/gui/GuiAmbientLightModule'
import GuiPointLightModule from '@scripts/gui/GuiPointLightModule'
import GuiLightsModule from '@scripts/gui/GuiLightsModule'
import GuiPerspectiveCameraModule from '@scripts/gui/GuiPerspectiveCameraModule'

const GuiModuleConstructors = {
  GuiBoxGeometryModule,
  GuiSphereGeometryModule,
  GuiMeshModule,
  GuiMeshStandardMaterialModule,
  GuiAmbientLightModule,
  GuiPointLightModule,
  GuiLightsModule,
  GuiPerspectiveCameraModule,
  GuiConeGeometryModule,
}

export default GuiModuleConstructors