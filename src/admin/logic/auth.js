module.exports = class extends think.Logic {
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
