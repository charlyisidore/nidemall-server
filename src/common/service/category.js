module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} offset 
   * @param {number} limit 
   * @returns 
   */
  queryL1(offset, limit) {
    const model = this.model('category')
      .where({
        level: 'L1',
        deleted: false,
      });
    if (undefined !== offset || undefined !== limit) {
      model.limit(offset, limit);
    }
    return model.select();
  }

  /**
   * 
   * @param {number} pid 
   * @returns 
   */
  queryByPid(pid) {
    return this.model('category')
      .where({
        pid,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} id 
   * @returns 
   */
  findById(id) {
    return this.model('category')
      .where({
        id,
        deleted: false,
      })
      .find();
  }
}