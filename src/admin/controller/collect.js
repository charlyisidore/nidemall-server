const Base = require('./base.js');

module.exports = class AdminCollectController extends Base {
  async listAction() {
    /** @type {number?} */
    const userId = this.get('userId');
    /** @type {number?} */
    const valueId = this.get('valueId');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {CollectService} */
    const collectService = this.service('collect');

    const collectList = await collectService.querySelective(userId, valueId, page, limit, sort, order);

    return this.successList(collectList);
  }
};
