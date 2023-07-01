const Base = require('./base.js');

module.exports = class WxAuthController extends Base {
  static DEFAULT_AVATAR = 'https://yanxuan.nosdn.127.net/80841d741d7fa3073e0ae27bf487339f.jpg?imageView&quality=90&thumbnail=64x64';

  async loginAction() {
    /** @type {string} */
    const username = this.post('username');
    /** @type {string} */
    const password = this.post('password');

    /** @type {AuthService} */
    const authService = this.service('auth');
    /** @type {UserService} */
    const userService = this.service('user');

    const AUTH = authService.getConstants();

    if (think.isTrueEmpty(username) || think.isTrueEmpty(password)) {
      return this.badArgument();
    }

    const userList = await userService.queryByUsername(username);

    if (think.isEmpty(userList)) {
      return this.fail(AUTH.RESPONSE.INVALID_ACCOUNT, '账号不存在');
    }

    if (userList.length > 1) {
      return this.serious();
    }

    const [user] = userList;

    if (!await authService.comparePassword(password, user.password)) {
      return this.fail(AUTH.RESPONSE.INVALID_ACCOUNT, '账号密码不对');
    }

    user.lastLoginTime = new Date();
    user.lastLoginIp = this.ip;

    if (!await userService.updateById(user)) {
      return this.updatedDataFailed();
    }

    const token = await authService.createToken(user.id);

    return this.success({
      token,
      userInfo: {
        nickName: username,
        avatarUrl: user.avatar,
      },
    });
  }

  async login_by_weixinAction() {
    /** @type {string} */
    const code = this.post('code');
    const userInfo = this.post('userInfo');

    /** @type {AuthService} */
    const authService = this.service('auth');
    /** @type {CouponService} */
    const couponService = this.service('coupon');
    /** @type {UserService} */
    const userService = this.service('user');
    /** @type {WeixinService} */
    const weixinService = this.service('weixin');

    if (think.isNullOrUndefined(code) || think.isEmpty(userInfo)) {
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

    if (think.isNullOrUndefined(sessionKey) || think.isNullOrUndefined(openid)) {
      return this.fail();
    }

    const now = new Date();
    let user = await userService.queryByOid(openid);

    if (think.isEmpty(user)) {
      user = {
        username: openid,
        password: openid,
        weixinOpenid: openid,
        avatar: userInfo.avatarUrl,
        nickname: userInfo.nickName,
        gender: userInfo.gender,
        userLevel: 0,
        status: 0,
        lastLoginTime: now,
        lastLoginIp: this.ip,
        sessionKey,
      };

      user.id = await userService.add(user);
      await couponService.assignForRegister(user.id);
    } else {
      Object.assign(user, {
        lastLoginTime: now,
        lastLoginIp: this.ip,
        sessionKey,
      });

      if (!await userService.updateById(user)) {
        return this.updatedDataFailed();
      }
    }

    const token = await authService.createToken(user.id);

    return this.success({
      token,
      userInfo,
    });
  }

  async regCaptchaAction() {
    /** @type {string} */
    const mobile = this.post('mobile');

    /** @type {AuthService} */
    const authService = this.service('auth');
    /** @type {NotifyService} */
    const notifyService = this.service('notify');

    const AUTH = authService.getConstants();
    const NOTIFY = notifyService.getConstants();

    if (!notifyService.isSmsEnable()) {
      return this.fail(AUTH.RESPONSE.CAPTCHA_UNSUPPORT, '小程序后台验证码服务不支持');
    }

    const code = this.getRandomNum(6);

    if (!await authService.addCaptchaToCache(mobile, code)) {
      return this.fail(AUTH.RESPONSE.CAPTCHA_FREQUENCY, '验证码未超时1分钟，不能发送');
    }

    await notifyService.notifySmsTemplate(mobile, NOTIFY.TYPE.CAPTCHA, [code]);

    return this.success();
  }

  async registerAction() {
    /** @type {string} */
    const username = this.post('username');
    /** @type {string} */
    const password = this.post('password');
    /** @type {string} */
    const mobile = this.post('mobile');
    /** @type {string} */
    const code = this.post('code');
    /** @type {string} */
    const wxCode = this.post('wxCode');

    /** @type {AuthService} */
    const authService = this.service('auth');
    /** @type {CouponService} */
    const couponService = this.service('coupon');
    /** @type {UserService} */
    const userService = this.service('user');
    /** @type {WeixinService} */
    const weixinService = this.service('weixin');

    const AUTH = authService.getConstants();

    if (think.isTrueEmpty(username) ||
      think.isTrueEmpty(password) ||
      think.isTrueEmpty(mobile) ||
      think.isTrueEmpty(code)) {
      return this.badArgument();
    }

    let userList = await userService.queryByUsername(username);
    if (!think.isEmpty(userList)) {
      return this.fail(AUTH.RESPONSE.NAME_REGISTERED, '用户名已注册');
    }

    userList = await userService.queryByMobile(mobile);
    if (!think.isEmpty(userList)) {
      return this.fail(AUTH.RESPONSE.MOBILE_REGISTERED, '手机号已注册');
    }

    if (!/^[1]\d{10}$/.test(mobile)) {
      return this.fail(AUTH.RESPONSE.INVALID_MOBILE, '手机号格式不正确');
    }

    const cacheCode = await authService.getCachedCaptcha(mobile);

    if (think.isNullOrUndefined(cacheCode) || cacheCode != code) {
      return this.fail(AUTH.RESPONSE.CAPTCHA_UNMATCH, '验证码错误');
    }

    let openid = '';

    if (!think.isTrueEmpty(wxCode)) {
      try {
        const response = await weixinService.login(code);
        openid = response.openid;
      } catch (e) {
        console.error(e);
        think.logger.error(e.toString());
        return this.fail(AUTH.RESPONSE.OPENID_UNACCESS, 'openid 获取失败');
      }

      userList = await userService.queryByOpenid(openid);

      if (userList.length > 1) {
        return this.serious();
      }

      if (1 == userList.length) {
        const [checkUser] = userList;

        if (checkUser.username != openid || checkUser.password != openid) {
          return this.fail(AUTH.RESPONSE.OPENID_BINDED, 'openid已绑定账号');
        }
      }
    }

    const user = {
      username,
      password: await authService.hashPassword(password),
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

    user.id = await userService.add(user);
    await couponService.assignForRegister(user.id);

    const userInfo = {
      nickName: username,
      avatarUrl: user.avatar,
    };

    const token = await authService.createToken(user.id);

    return this.success({
      token,
      userInfo,
    });
  }

  async resetAction() {
    /** @type {string} */
    const password = this.post('password');
    /** @type {string} */
    const mobile = this.post('mobile');
    /** @type {string} */
    const code = this.post('code');

    /** @type {AuthService} */
    const authService = this.service('auth');
    /** @type {UserService} */
    const userService = this.service('user');

    const AUTH = authService.getConstants();

    const cacheCode = await authService.getCachedCaptcha(mobile);

    if (think.isNullOrUndefined(cacheCode) || cacheCode != code) {
      return this.fail(AUTH.RESPONSE.CAPTCHA_UNMATCH, '验证码错误');
    }

    const userList = await userService.queryByMobile(mobile);

    if (userList.length > 1) {
      return this.serious();
    }

    if (0 == userList.length) {
      return this.fail(AUTH.RESPONSE.MOBILE_UNREGISTERED, '手机号未注册');
    }

    const [user] = userList;

    user.password = await authService.hashPassword(password);

    if (!await userService.updateById(user)) {
      return this.updatedDataFailed();
    }

    return this.success();
  }

  async bindPhoneAction() {
    const userId = this.getUserId();
    /** @type {string} */
    const encryptedData = this.post('encryptedData');
    /** @type {string} */
    const iv = this.post('iv');

    /** @type {UserService} */
    const userService = this.service('user');
    /** @type {WeixinService} */
    const weixinService = this.service('weixin');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const user = await userService.findById(userId);
    const phoneNumberInfo = await weixinService.getPhoneNoInfo(user.sessionKey, encryptedData, iv);

    Object.assign(user, {
      mobile: phoneNumberInfo.phoneNumber,
    });

    if (!await userService.updateById(user)) {
      return this.updatedDataFailed();
    }

    return this.success();
  }

  async logoutAction() {
    const userId = this.getUserId();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    return this.success();
  }

  getRandomNum(n) {
    return Math.floor(Math.random() * (Math.pow(10, n) - 1))
      .toString()
      .padStart(n, '0');
  }
};
