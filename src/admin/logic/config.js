const Base = require('./base.js');

module.exports = class extends Base {
  mallAction() {
    this.allowMethods = 'GET,POST';
  }

  expressAction() {
    this.allowMethods = 'GET,POST';
  }

  orderAction() {
    this.allowMethods = 'GET,POST';
  }

  wxAction() {
    this.allowMethods = 'GET,POST';
  }
};
