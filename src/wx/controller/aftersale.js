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
    const userId = this.getUserId();
    /** @type {number} */
    const orderId = this.get('orderId');
    /** @type {number} */
    const type = this.get('type');
    /** @type {number} */
    const amount = this.get('amount');
    /** @type {string} */
    const reason = this.get('reason');
    /** @type {string[]} */
    const pictures = this.get('pictures');
    /** @type {string} */
    const comment = this.get('comment');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');
    /** @type {OrderService} */
    const orderService = this.service('order');

    const AFTERSALE = aftersaleService.getConstants();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const order = await orderService.findById(orderId, userId);

    if (think.isEmpty(order)) {
      return this.badArgumentValue();
    }

    if (!orderService.isConfirmStatus(order) && !orderService.isAutoConfirmStatus(order)) {
      return this.fail(AFTERSALE.RESPONSE.UNALLOWED, '不能申请售后');
    }

    const orderAmount = order.actualPrice - order.freightPrice;

    if (amount > orderAmount) {
      return this.fail(AFTERSALE.RESPONSE.INVALID_AMOUNT, '退款金额不正确');
    }

    if ([AFTERSALE.STATUS.RECEPT, AFTERSALE.STATUS.REFUND].includes(order.aftersaleStatus)) {
      return this.fail(AFTERSALE.RESPONSE.INVALID_AMOUNT, '已申请售后');
    }

    await aftersaleService.deleteByOrderId(orderId, userId);

    await aftersaleService.add({
      orderId,
      type,
      amount,
      reason,
      pictures,
      comment,
      status: AFTERSALE.STATUS.REQUEST,
      aftersaleSn: await aftersaleService.generateAftersaleSn(userId),
      userId,
    });

    await orderService.updateAftersaleStatus(orderId, AFTERSALE.STATUS.REQUEST);

    return this.success();
  }
};
