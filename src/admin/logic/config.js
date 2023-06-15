const Base = require('./base.js');

module.exports = class extends Base {
  mallAction() {
    switch (true) {
      case this.isGet:
        this.requiresPermissions = 'admin:config:mall:list';
        break;
      case this.isPost:
        this.requiresPermissions = 'admin:config:mall:updateConfigs';
        break;
    }

    this.allowMethods = 'GET,POST';
  }

  expressAction() {
    switch (true) {
      case this.isGet:
        this.requiresPermissions = 'admin:config:express:list';
        break;
      case this.isPost:
        this.requiresPermissions = 'admin:config:express:updateConfigs';
        break;
    }

    this.allowMethods = 'GET,POST';
  }

  orderAction() {
    switch (true) {
      case this.isGet:
        this.requiresPermissions = 'admin:config:order:list';
        break;
      case this.isPost:
        this.requiresPermissions = 'admin:config:order:updateConfigs';
        break;
    }

    this.allowMethods = 'GET,POST';
  }

  wxAction() {
    switch (true) {
      case this.isGet:
        this.requiresPermissions = 'admin:config:wx:list';
        break;
      case this.isPost:
        this.requiresPermissions = 'admin:config:wx:updateConfigs';
        break;
    }

    this.allowMethods = 'GET,POST';
  }
};
