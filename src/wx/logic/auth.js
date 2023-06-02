module.exports = class extends think.Logic {
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

  login_by_weixinAction() {
    this.allowMethods = 'POST';

    this.rules = {
      code: {
        string: true,
        required: true,
      },
      userInfo: {
        object: true,
        required: true,
        children: {
          country: {
            string: true,
            required: true,
          },
          province: {
            string: true,
            required: true,
          },
          city: {
            string: true,
            required: true,
          },
          language: {
            string: true,
            required: true,
          },
          gender: {
            string: true,
            required: true,
          },
          nickName: {
            string: true,
            required: true,
          },
          avatarUrl: {
            string: true,
            required: true,
          },
        },
      },
    };
  }

  regCaptchaAction() {
    this.allowMethods = 'POST';

    this.rules = {
      mobile: {
        string: true,
        mobile: 'zh-CN',
        required: true,
      },
    };
  }

  registerAction() {
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
      mobile: {
        string: true,
        mobile: 'zh-CN',
        required: true,
      },
      code: {
        string: true,
        required: true,
      },
      wxCode: {
        string: true,
      },
    };
  }

  resetAction() {
    this.allowMethods = 'POST';

    this.rules = {
      password: {
        string: true,
        required: true,
      },
      mobile: {
        string: true,
        required: true,
      },
      code: {
        string: true,
        required: true,
      },
    };
  }

  bindPhoneAction() {
    this.allowMethods = 'POST';

    this.rules = {
      encryptedData: {
        string: true,
        required: true,
      },
      iv: {
        string: true,
        required: true,
      },
    };
  }

  logoutAction() {
    this.allowMethods = 'POST';
  }
};
