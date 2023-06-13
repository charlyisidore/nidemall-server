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
    /** @type {ExpressService} */
    const expressService = this.service('express');

    const vendors = expressService.getVendors();

    return this.success(vendors);
  }

  async detailAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');
    /** @type {UserService} */
    const userService = this.service('user');

    const order = await orderService.findById(id);
    const orderGoods = await orderGoodsService.queryByOid(id);
    const user = await userService.findUserVoById(order.userId);

    return this.success({
      order,
      orderGoods,
      user,
    });
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
