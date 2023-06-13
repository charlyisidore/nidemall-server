module.exports = class RegionService extends think.Service {
  constructor() {
    super();
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