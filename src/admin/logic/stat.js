const Base = require('./base.js');

module.exports = class extends Base {
  userAction() {
    // this.requiresPermissions = 'admin:stat:user';
    this.allowMethods = 'GET';
  }

  orderAction() {
    // this.requiresPermissions = 'admin:stat:order';
    this.allowMethods = 'GET';
  }

  goodsAction() {
    // this.requiresPermissions = 'admin:stat:goods';
    this.allowMethods = 'GET';
  }
};
