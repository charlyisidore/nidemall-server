const EventEmitter = require('node:events');

/**
 * Base class for services.
 */
module.exports = class BaseService extends think.Service {
  constructor() {
    super();
    this._eventEmitter = new EventEmitter();
  }

  /**
   * Add an event listener.
   * @param {string} eventName 
   * @param {(...args: any[]) => void} listener 
   * @returns {this}
   */
  on(eventName, listener) {
    this._eventEmitter.on(eventName, listener);
    return this;
  }

  /**
   * Create a model and emit a `model` event.
   * @see {DbService}
   * @param {string} name 
   * @param {any?} config 
   * @param {string?} module 
   * @returns {think.Model}
   */
  model(name, config, module) {
    let model = super.model(name, config, module);
    this._eventEmitter.emit('model', model);
    return model;
  }
}
