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
    this.requiresAuthentication = true;
    this.allowMethods = 'POST';
  }

  infoAction() {
    this.requiresAuthentication = true;
    this.allowMethods = 'GET';
  }
};
