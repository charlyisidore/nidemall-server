module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} id 
   */
  query(userId, id) {
    return this.model('address')
      .where({
        id,
        userId,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {number} userId 
   */
  findDefault(userId) {
    return this.model('address')
      .where({
        userId,
        isDefault: true,
        deleted: false,
      })
      .find();
  }
}