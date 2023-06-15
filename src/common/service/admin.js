const Base = require('./base.js');
const assert = require('node:assert');
const bcrypt = require('bcrypt');
const AccountError = require('../error/account.js');
const UnknownAccountError = require('../error/unknown_account.js');

module.exports = class AdminService extends Base {
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
  async findAdminById(id) {
    return this.model('admin')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {string} username 
   * @returns {Promise<Admin[]>} 
   */
  async findAdminByUsername(username) {
    return this.model('admin')
      .where({
        username,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {string?} username 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Admin[]}>}
   */
  async querySelective(username, page, limit, sort, order) {
    const model = this.model('admin');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(username)) {
      Object.assign(where, {
        username: ['LIKE', `%${username}%`],
      });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {Admin} admin 
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(admin) {
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
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('admin')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Admin} admin 
   * @returns {Promise<number>} The ID inserted
   */
  async add(admin) {
    const now = new Date();
    return this.model('admin')
      .add(Object.assign(admin, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Admin|Record<string, never>>}
   */
  async findById(id) {
    return this.model('admin')
      .field(this.constructor.FIELDS)
      .where({ id })
      .find();
  }

  /**
   * 
   * @returns {Promise<Admin[]>}
   */
  async all() {
    return this.model('admin')
      .where({
        deleted: false,
      })
      .select();
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
    await ctx.session('adminId', null);
    await ctx.session(null);
  }

  /**
   * 
   * @param {string} password 
   * @param {string} hash 
   */
  async comparePassword(password, hash) {
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
