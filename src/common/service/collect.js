module.exports = class CollectService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} type 
   * @param {number} gid 
   * @returns {Promise<number>} The total number
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