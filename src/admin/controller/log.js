const Base = require('./base.js');

module.exports = class AdminLogController extends Base {
  async listAction() {
    /** @type {string?} */
    const name = this.get('name');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {LogService} */
    const logService = this.service('log');

    const logList = await logService.querySelective(name, page, limit, sort, order);

    return this.successList(logList);
  }
};
