module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   */
  findById(id) {
    return this.model('user')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {string} openid 
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
   * @param {object} user 
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
   * @param {object} user 
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
   */
  queryByOpenid(openId) {
    return this.model('user')
      .where({
        weixinOpenid: openid,
        deleted: false,
      })
      .select();
  }
}