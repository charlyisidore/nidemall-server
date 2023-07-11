const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    this.allowMethods = 'GET';
  }

  aboutAction() {
    this.allowMethods = 'GET';
  }
};
