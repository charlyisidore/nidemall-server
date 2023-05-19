module.exports = class extends think.Logic {
  loginAction() {
    this.allowMethods = 'POST';
  }

  login_by_weixinAction() {
    this.allowMethods = 'POST';
  }

  regCaptchaAction() {
    this.allowMethods = 'POST';
  }

  registerAction() {
    this.allowMethods = 'POST';
  }

  resetAction() {
    this.allowMethods = 'POST';
  }

  bindPhoneAction() {
    this.allowMethods = 'POST';
  }

  logoutAction() {
    this.allowMethods = 'POST';
  }
};
