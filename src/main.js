import '@styles/main.scss'
import EventBus from '@scripts/services/EventBus'
import { renderOnResize } from '@scripts/services/event-handlers'
import setupGlobalListeners from '@scripts/services/global-listeners'
import ThreeScene from '@scripts/classes/ThreeScene'

/**
 * Add MeshStandardMaterial tranparency and opacity to GUI
 * Write color functions for GUI pickers
 * Create a style theme for GUI
 * Add font to site - space mono and space grostesque
 * Create hide/show functions for GUI
 * Create function to collapse/expand all folders
 */


const threeScene = new ThreeScene()
threeScene.init({id: 'scene', requireCanvas: true})

EventBus.subscribe('WindowResized', renderOnResize)
setupGlobalListeners(threeScene)