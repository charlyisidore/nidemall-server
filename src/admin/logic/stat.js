const Base = require('./base.js');

module.exports = class extends Base {
  userAction() {
    this.allowMethods = 'GET';
  }

  orderAction() {
    this.allowMethods = 'GET';
  }

  goodsAction() {
    this.allowMethods = 'GET';
  }
};
