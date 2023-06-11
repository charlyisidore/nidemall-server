const Base = require('./base.js');

module.exports = class AdminFootprintController extends Base {
  async listAction() {
    /** @type {number?} */
    const userId = this.get('userId');
    /** @type {number?} */
    const goodsId = this.get('goodsId');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {FootprintService} */
    const footprintService = this.service('footprint');

    const footprintList = await footprintService.querySelective(userId, goodsId, page, limit, sort, order);

    return this.successList(footprintList);
  }
};
