const Base = require('./base.js');

module.exports = class WxAftersaleController extends Base {
  async listAction() {
    const userId = this.getUserId();
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
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const aftersaleList = await aftersaleService.queryList(
      userId,
      status,
      page,
      limit,
      sort,
      order
    );

    const aftersaleVoList = await Promise.all(
      aftersaleList.data.map(async (aftersale) => {
        const goodsList = await orderGoodsService.queryByOid(aftersale.orderId);

        return {
          aftersale,
          goodsList,
        }
      })
    );

    return this.successList(aftersaleVoList, aftersaleList);
  }

  async detailAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const orderId = this.get('orderId');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');
    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const order = await orderService.findById(orderId, userId);

    if (think.isEmpty(order)) {
      return this.badArgumentValue();
    }

    const orderGoodsList = await orderGoodsService.queryByOid(orderId);
    const aftersale = await aftersaleService.findByOrderId(orderId, userId);

    return this.success({
      aftersale,
      order,
      orderGoods: orderGoodsList,
    });
  }

  async submitAction() {
    return this.success('todo');
  }
};
