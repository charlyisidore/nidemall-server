module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} type 
   * @param {number} gid 
   */
  count(userId, type, gid) {
    return this.model('collect')
      .where({
        userId,
        type,
        valueId: gid,
        deleted: false,
      })
      .count();
  }
}