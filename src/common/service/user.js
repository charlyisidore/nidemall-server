const Base = require('./base.js');
const assert = require('node:assert');

module.exports = class UserService extends Base {
  /**
   * .
   * @param {number} id .
   * @returns {Promise<User|Record<string, never>>} .
   */
  async findById(id) {
    return this.model('user')
      .where({ id })
      .find();
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<User|Record<string, never>>} .
   */
  async findUserVoById(id) {
    const user = await this.findById(id);

    if (think.isEmpty(user)) {
      return {};
    }

    return {
      nickname: user.nickname,
      avatar: user.avatar,
    };
  }

  /**
   * .
   * @param {string} openid .
   * @returns {Promise<User|Record<string, never>>} .
   */
  async queryByOid(openid) {
    return this.model('user')
      .where({
        weixinOpenid: openid,
        deleted: false,
      })
      .find();
  }

  /**
   * .
   * @param {User} user .
   * @returns {Promise<number>} The ID inserted
   */
  async add(user) {
    const now = new Date();
    return this.model('user')
      .add(Object.assign(user, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {User} user .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(user) {
    const now = new Date();
    return this.model('user')
      .where({ id: user.id })
      .update(Object.assign(user, {
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {string?} username .
   * @param {string?} mobile .
   * @param {number} page .
   * @param {number} limit .
   * @param {string} sort .
   * @param {string} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: User[]}>}
   */
  async querySelective(username, mobile, page, limit, sort, order) {
    const model = this.model('user');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(username)) {
      Object.assign(where, {
        username: ['LIKE', `%${username}%`],
      });
    }

    if (!think.isTrueEmpty(mobile)) {
      Object.assign(where, {
        mobile,
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
   * .
   * @returns {Promise<number>} The total number
   */
  async count() {
    return this.model('user')
      .where({
        deleted: false,
      })
      .count();
  }

  /**
   * .
   * @param {string} username .
   * @returns {Promise<User[]>} .
   */
  async queryByUsername(username) {
    return this.model('user')
      .where({
        username,
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {string} mobile .
   * @returns {Promise<User[]>} .
   */
  async queryByMobile(mobile) {
    return this.model('user')
      .where({
        mobile,
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {string} openid .
   * @returns {Promise<User[]>} .
   */
  async queryByOpenid(openid) {
    return this.model('user')
      .where({
        weixinOpenid: openid,
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {number} userId .
   */
  async getInfo(userId) {
    const user = await this.findById(userId);

    assert.ok(!think.isEmpty(user), '用户不存在');

    return {
      nickName: user.nickname,
      avatarUrl: user.avatar,
    };
  }
};
