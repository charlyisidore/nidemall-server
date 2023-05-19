const Base = require('./base.js');

module.exports = class extends Base {
  static AUTH_INVALID_ACCOUNT = 700;
  static AUTH_CAPTCHA_UNMATCH = 703;
  static AUTH_NAME_REGISTERED = 704;
  static AUTH_MOBILE_REGISTERED = 705;
  static AUTH_INVALID_MOBILE = 707;
  static AUTH_OPENID_UNACCESS = 708;

  async loginAction() {
    const authService = this.service('auth');
    const userService = this.service('user');

    const username = this.post('username');
    const password = this.post('password');

    if (undefined === username || undefined === password) {
      return this.badArgument();
    }

    const userList = await userService.queryByUsername(username);

    if (userList.length > 1) {
      return this.serious();
    } else if (userList.length == 0) {
      return this.fail(this.constructor.AUTH_INVALID_ACCOUNT, '账号不存在');
    }

    const [user] = userList;

    if (!await authService.comparePassword(password, user.password)) {
      return this.fail(this.constructor.AUTH_INVALID_ACCOUNT, '账号密码不对');
    }

    user.lastLoginTime = new Date();
    user.lastLoginIp = this.ip;

    if (!await userService.updateById(user)) {
      return this.updatedDataFailed();
    }

    const token = authService.createToken(user.id);

    return this.success({
      token,
      userInfo: {
        nickname: username,
        avatarUrl: user.avatar,
      },
    });
  }

  async login_by_weixinAction() {
    return this.success('todo');
  }

  async resetAction() {
    return this.success('todo');
  }

  async bindPhoneAction() {
    return this.success('todo');
  }

  async logoutAction() {
    return this.success('todo');
  }

  isMobileSimple(input) {
    return /^[1]\d{10}$/.test(input);
  }
};
