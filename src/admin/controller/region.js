const Base = require('./base.js');

module.exports = class AdminRegionController extends Base {
  async clistAction() {
    /** @type {number} */
    const id = this.get('id');
    /** @type {RegionService} */
    const regionService = this.service('region');

    const regionList = await regionService.queryByPid(id);

    return this.successList(regionList);
  }

  async listAction() {
    return this.success('todo');
  }
};
