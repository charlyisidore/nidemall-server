const Base = require('./base.js');

module.exports = class extends Base {
  kaptchaAction() {
    this.allowMethods = 'GET';
  }

  loginAction() {
    this.allowMethods = 'POST';

    this.rules = {
      username: {
        string: true,
        required: true,
      },
      password: {
        string: true,
        required: true,
      },
    };
  }

  logoutAction() {
    this.allowMethods = 'POST';
  }

  infoAction() {
    this.allowMethods = 'GET';
  }
};
