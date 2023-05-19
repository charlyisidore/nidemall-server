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
   * @param {object} user 
   */
  updateById(user) {
    return this.model('user')
      .where({ id: user.id })
      .update(user);
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
}