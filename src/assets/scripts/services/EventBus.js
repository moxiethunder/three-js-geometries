class EvBus {
  // CameraUpdated in ./src/assets/scripts/classes/Info.js
  constructor() {
    this.listeners = {};
  }

  publish(event, data) {
    if ( !this.listeners[event] ) {
      console.error(`No such event: ${event} in EventBus`)
      return;
    }
    
    this.listeners[event].forEach(callback => callback(data))
  }
  
  subscribe(event, callback) {
    if ( !this.listeners[event] ) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  unsubscribe(event, callback) {
    if ( this.listeners[event] ) {
      this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback
      )
    }
  }
}

const EventBus = new EvBus();
export default EventBus;