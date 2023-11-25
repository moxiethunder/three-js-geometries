import '@styles/main.scss'
import EventBus from '@scripts/services/EventBus'
import { renderOnResize } from '@scripts/services/event-handlers'
import setupGlobalListeners from '@scripts/services/global-listeners'
import ThreeScene from '@scripts/classes/ThreeScene'
import Scene from '@scripts/practice/scene'

// const threeScene = new ThreeScene()
// threeScene.init({id: 'scene', requireCanvas: true})

// EventBus.subscribe('WindowResized', renderOnResize)
// setupGlobalListeners(threeScene)

Scene()