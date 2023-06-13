module.exports = class RegionService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @returns {Promise<Region[]>}
   */
  getAll() {
    return this.model('region')
      .where({
        type: ['!=', 4],
      })
      .select();
  }

  /**
   * 
   * @param {number} pid 
   * @returns {Promise<Region[]>}
   */
  queryByPid(pid) {
    return this.model('region')
      .where({
        pid,
      })
      .select();
  }
}