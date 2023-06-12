const Base = require('./base.js');

module.exports = class AdminGoodsController extends Base {
  async listAction() {
    /** @type {number?} */
    const goodsId = this.get('goodsId');
    /** @type {string?} */
    const goodsSn = this.get('goodsSn');
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

    /** @type {GoodsService} */
    const goodsService = this.service('goods');

    const goodsList = await goodsService.querySelectiveGoods(goodsId, goodsSn, name, page, limit, sort, order);

    return this.successList(goodsList);
  }

  async catAndBrandAction() {
    return this.success('todo');
  }

  async updateAction() {
    return this.success('todo');
  }

  async deleteAction() {
    return this.success('todo');
  }

  async createAction() {
    return this.success('todo');
  }

  async detailAction() {
    return this.success('todo');
  }
};
