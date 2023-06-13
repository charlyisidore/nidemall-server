const Base = require('./base.js');

module.exports = class AdminOrderController extends Base {
  async listAction() {
    /** @type {string?} */
    const nickname = this.get('nickname');
    /** @type {string?} */
    const consignee = this.get('consignee');
    /** @type {string?} */
    const orderSn = this.get('orderSn');
    /** @type {Date?} */
    const start = this.get('start');
    /** @type {Date?} */
    const end = this.get('end');
    /** @type {number[]?} */
    const orderStatusArray = this.get('orderStatusArray');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {OrderService} */
    const orderService = this.service('order');

    const data = await orderService.queryVoSelective(
      nickname,
      consignee,
      orderSn,
      start,
      end,
      orderStatusArray,
      page,
      limit,
      sort,
      order
    );

    return this.success(data);
  }

  async channelAction() {
    return this.success('todo');
  }

  async detailAction() {
    return this.success('todo');
  }

  async refundAction() {
    return this.success('todo');
  }

  async shipAction() {
    return this.success('todo');
  }

  async payAction() {
    return this.success('todo');
  }

  async deleteAction() {
    return this.success('todo');
  }

  async replyAction() {
    return this.success('todo');
  }
};
