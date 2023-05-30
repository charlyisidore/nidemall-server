const assert = require('node:assert');

module.exports = class UserService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<User|Record<string, never>>} 
   */
  findById(id) {
    return this.model('user')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<User|Record<string, never>>} 
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
   * 
   * @param {string} openid 
   * @returns {Promise<User|Record<string, never>>} 
   */
  queryByOid(openid) {
    return this.model('user')
      .where({
        weixinOpenid: openid,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {User} user 
   * @returns {Promise<number>} The ID inserted
   */
  add(user) {
    const now = new Date();
    return this.model('user')
      .add(Object.assign(user, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {User} user 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(user) {
    const now = new Date();
    return this.model('user')
      .where({ id: user.id })
      .update(Object.assign(user, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {string} username 
   * @returns {Promise<User[]>} 
   */
  queryByUsername(username) {
    return this.model('user')
      .where({
        username,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {string} openid 
   * @returns {Promise<User[]>} 
   */
  queryByOpenid(openid) {
    return this.model('user')
      .where({
        weixinOpenid: openid,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} userId 
   */
  async getInfo(userId) {
    const user = await this.findById(userId);

    assert.ok(user, '用户不存在');

    return {
      nickName: user.nickname,
      avatarUrl: user.avatar,
    };
  }
}