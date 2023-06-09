const Base = require('./base.js');
const AuthenticationError = require('../../common/error/authentication.js');
const LockedAccountError = require('../../common/error/locked_account.js');
const UnknownAccountError = require('../../common/error/unknown_account.js');

module.exports = class AdminAuthController extends Base {
  async kaptchaAction() {
    return this.success('data:image/svg+xml;base64,');
  }

  async loginAction() {
    /** @type {string} */
    const username = this.post('username');
    /** @type {string} */
    const password = this.post('password');

    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {LogService} */
    const logService = this.service('log');

    const { ADMIN_RESPONSE } = adminService.getConstants();

    let admin = null;

    try {
      admin = await adminService.login(username, password, this.ctx);
    } catch (error) {
      switch (true) {
        case error instanceof UnknownAccountError:
          logService.logAuthFail('登录', '用户帐号或密码不正确', this.ctx);
          return this.fail(ADMIN_RESPONSE.INVALID_ACCOUNT, '用户帐号或密码不正确');

        case error instanceof LockedAccountError:
          logService.logAuthFail('登录', '用户帐号已锁定不可用');
          return this.fail(ADMIN_RESPONSE.INVALID_ACCOUNT, '用户帐号已锁定不可用');

        case error instanceof AuthenticationError:
          logService.logAuthFail('登录', '认证失败');
          return this.fail(ADMIN_RESPONSE.INVALID_ACCOUNT, '认证失败');
      }
    }

    const now = new Date();

    Object.assign(admin, {
      lastLoginIp: this.ip,
      lastLoginTime: now,
    });

    await adminService.updateById(admin);

    await logService.logAuthSucceed('登录', '', this.ctx);

    return this.success({
      token: this.cookie('thinkjs'),
      adminInfo: {
        nickName: admin.username,
        avatar: admin.avatar,
      },
    });
  }

  async logoutAction() {
    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {LogService} */
    const logService = this.service('log');

    await logService.logAuthSucceed('退出', '', this.ctx);
    await adminService.logout(this.ctx);
    return this.success();
  }

  async infoAction() {
    const admin = this.getAdmin();

    return this.success({
      name: admin.username,
      avatar: admin.avatar,
      roles: admin.roleIds,
      perms: ['*'],
    });
  }
};
