const Base = require('./base.js');

module.exports = class AdminAuthController extends Base {
  async kaptchaAction() {
    return this.success('todo');
  }

  async loginAction() {
    return this.success('todo');
  }

  async logoutAction() {
    return this.success('todo');
  }

  async infoAction() {
    return this.success('todo');
  }
};
