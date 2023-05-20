const Base = require('./base.js');

module.exports = class extends Base {
  static AUTH_INVALID_ACCOUNT = 700;
  static AUTH_CAPTCHA_UNMATCH = 703;
  static AUTH_NAME_REGISTERED = 704;
  static AUTH_MOBILE_REGISTERED = 705;
  static AUTH_INVALID_MOBILE = 707;
  static AUTH_OPENID_UNACCESS = 708;
  static AUTH_OPENID_BINDED = 709;

  static DEFAULT_AVATAR = 'https://yanxuan.nosdn.127.net/80841d741d7fa3073e0ae27bf487339f.jpg?imageView&quality=90&thumbnail=64x64';

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
    const authService = this.service('auth');
    const couponService = this.service('coupon');
    const userService = this.service('user');
    const weixinService = this.service('weixin');

    const code = this.post('code');
    const userInfo = this.post('userInfo');

    if (undefined === code || undefined === userInfo) {
      return this.badArgument();
    }

    let sessionKey = null;
    let openid = null;

    try {
      const response = await weixinService.login(code, userInfo);

      sessionKey = response.session_key;
      openid = response.openid;
    } catch (e) {
      console.error(e);
      think.logger.error(e.toString());
    }

    if (!sessionKey || !openid) {
      return this.fail();
    }

    const now = new Date();
    let user = await userService.queryByOid(openid);

    if (!user) {
      user = {
        username: openid,
        password: openid,
        weixinOpenid: openid,
        avatar: userInfo.avatarUrl,
        nickname: userInfo.nickname,
        gender: userInfo.gender,
        userLevel: 0,
        status: 0,
        lastLoginTime: now,
        lastLoginIp: this.ip,
        sessionKey,
      };

      await userService.add(user);
      await couponService.assignForRegister(user.id);
    } else {
      Object.assign(user, {
        lastLoginTime: now,
        lastLoginIp: this.ip,
        sessionKey,
      });

      if (!(await userService.updateById(user))) {
        return this.updatedDataFailed();
      }
    }

    const token = authService.createToken(user.id);

    return this.success({
      token,
      userInfo,
    });
  }

  async regCaptchaAction() {
    return this.success('todo');
  }

  async registerAction() {
    const authService = this.service('auth');
    const userService = this.service('user');
    const weixinService = this.service('weixin');

    const username = this.post('username');
    const password = this.post('password');
    const mobile = this.post('mobile');
    const code = this.post('code');
    const wxCode = this.post('wxCode');

    if (!username || !password || !mobile || !code) {
      return this.badArgument();
    }

    let userList = await userService.queryByUsername(username);
    if (userList.length > 0) {
      return this.fail(this.constructor.AUTH_NAME_REGISTERED, '用户名已注册');
    }

    userList = await userService.queryByMobile(mobile);
    if (userList.length > 0) {
      return this.fail(this.constructor.AUTH_MOBILE_REGISTERED, '手机号已注册');
    }

    if (!this.isMobileSimple(mobile)) {
      return this.fail(this.constructor.AUTH_INVALID_MOBILE, '手机号格式不正确');
    }

    const cacheCode = CaptchaCodeManager.getCachedCaptcha(mobile);

    if (!cacheCode || cacheCode != code) {
      return this.fail(this.constructor.AUTH_CAPTCHA_UNMATCH, '验证码错误');
    }

    let openid = '';

    if (!wxCode) {
      try {
        const response = await weixinService.login(code, userInfo);

        openid = response.openid;
      } catch (e) {
        console.error(e);
        think.logger.error(e.toString());
        return this.fail(this.constructor.AUTH_OPENID_UNACCESS, 'openid 获取失败');
      }

      userList = await userService.queryByOpenid(openid);

      if (userList.length > 1) {
        return this.serious();
      }

      if (userList.length == 1) {
        const [checkUser] = userList;

        if (checkUser.username != openid || checkUser.password != openid) {
          return this.fail(this.constructor.AUTH_OPENID_BINDED, 'openid已绑定账号');
        }
      }
    }

    const user = {
      username,
      password: authService.hashPassword(password),
      mobile,
      weixinOpenid: openid,
      avatar: this.constructor.DEFAULT_AVATAR,
      nickname: username,
      gender: 0,
      userLevel: 0,
      status: 0,
      lastLoginTime: new Date(),
      lastLoginIp: this.ip,
    };

    await userService.add(user);
    await couponService.assignForRegister(user.id);

    const userInfo = {
      nickname: username,
      avatarUrl: user.avatar,
    };

    const token = authService.createToken(user.id);

    return this.success({
      token,
      userInfo,
    });
  }

  async resetAction() {
    return this.success('todo');
  }

  async bindPhoneAction() {
    return this.success('todo');
  }

  async logoutAction() {
    if (!this.ctx.state.userId) {
      return this.unlogin();
    }

    return this.success();
  }

  isMobileSimple(input) {
    return /^[1]\d{10}$/.test(input);
  }
};
