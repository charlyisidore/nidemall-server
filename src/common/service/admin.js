const assert = require('node:assert');
const bcrypt = require('bcrypt');
const AccountError = require('../error/account.js');
const UnknownAccountError = require('../error/unknown_account.js');

module.exports = class AdminService extends think.Service {
  static FIELDS = [
    'id',
    'username',
    'avatar',
    'roleIds',
  ].join(',');

  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Admin|Record<string, never>>} 
   */
  findAdminById(id) {
    return this.model('admin')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {string} username 
   * @returns {Promise<Admin[]>} 
   */
  findAdminByUsername(username) {
    return this.model('admin')
      .where({
        username,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {Admin} admin 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(admin) {
    const now = new Date();
    return this.model('admin')
      .where({
        id: admin.id,
      })
      .update(Object.assign(admin, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Admin|Record<string, never>>}
   */
  findById(id) {
    return this.model('admin')
      .field(this.constructor.FIELDS)
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {string} username 
   * @param {string} password 
   * @param {any} ctx
   * @returns {Promise<Admin>}
   */
  async login(username, password, ctx) {
    if (think.isTrueEmpty(username)) {
      throw new AccountError('用户名不能为空');
    }

    if (think.isTrueEmpty(password)) {
      throw new AccountError('密码不能为空');
    }

    const adminList = await this.findAdminByUsername(username);

    assert(adminList.length < 2, '同一个用户名存在两个账户');

    if (0 == adminList.length) {
      throw new UnknownAccountError(`找不到用户（${username}）的帐号信息`);
    }

    const [admin] = adminList;

    if (!await this.comparePassword(password, admin.password)) {
      throw new UnknownAccountError(`找不到用户（${username}）的帐号信息`);
    }

    await ctx.session('adminId', admin.id);

    return admin;
  }

  /**
   * 
   * @param {any} ctx 
   */
  async logout(ctx) {
    await ctx.session(null);
  }

  /**
   * 
   * @param {string} password 
   * @param {string} hash 
   */
  comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * 
   * @param {string} password 
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  getConstants() {
    return {
      ADMIN_RESPONSE: {
        INVALID_NAME: 601,
        INVALID_PASSWORD: 602,
        NAME_EXIST: 602,
        ALTER_NOT_ALLOWED: 603,
        DELETE_NOT_ALLOWED: 604,
        INVALID_ACCOUNT: 605,
        INVALID_KAPTCHA: 606,
        INVALID_KAPTCHA_REQUIRED: 607,
      },
    };
  }
}