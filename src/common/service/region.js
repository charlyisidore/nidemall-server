const Base = require('./base.js');

module.exports = class RegionService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @returns {Promise<Region[]>}
   */
  async getAll() {
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
  async queryByPid(pid) {
    return this.model('region')
      .where({
        pid,
      })
      .select();
  }
}
