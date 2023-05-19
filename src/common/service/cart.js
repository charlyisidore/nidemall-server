module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   */
  queryByUid(userId) {
    return this.model('cart')
      .where({
        userId,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} id 
   */
  deleteById(id) {
    return this.model('cart')
      .where({
        id,
      })
      .delete();
  }
}