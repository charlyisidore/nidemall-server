module.exports = class extends think.Logic {
  kaptchaAction() {
    this.allowMethods = 'GET';
  }

  loginAction() {
    this.allowMethods = 'POST';
  }

  logoutAction() {
    this.allowMethods = 'POST';
  }

  infoAction() {
    this.allowMethods = 'GET';
  }
};
