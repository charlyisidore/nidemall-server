const Base = require('./base.js');

module.exports = class AdminAftersaleController extends Base {
  async listAction() {
    /** @type {number?} */
    const orderId = this.get('orderId');
    /** @type {string?} */
    const aftersaleSn = this.get('aftersaleSn');
    /** @type {number?} */
    const status = this.get('status');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');

    const aftersaleList = await aftersaleService.querySelective(orderId, aftersaleSn, status, page, limit, sort, order);

    return this.successList(aftersaleList);
  }

  async receptAction() {
    return this.success('todo');
  }

  async ['batch-receptAction']() {
    return this.success('todo');
  }

  async rejectAction() {
    return this.success('todo');
  }

  async ['batch-rejectAction']() {
    return this.success('todo');
  }

  async refundAction() {
    return this.success('todo');
  }
};
