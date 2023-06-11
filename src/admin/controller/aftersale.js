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
    /** @type {number} */
    const id = this.post('id');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');
    /** @type {OrderService} */
    const orderService = this.service('order');

    const { ADMIN_RESPONSE, STATUS } = aftersaleService.getConstants();

    const aftersale = await aftersaleService.findById(id);

    if (think.isEmpty(aftersale)) {
      return this.fail(ADMIN_RESPONSE.NOT_ALLOWED, '售后不存在');
    }

    if (STATUS.REQUEST != aftersale.status) {
      return this.fail(ADMIN_RESPONSE.NOT_ALLOWED, '售后不能进行审核通过操作');
    }

    const now = new Date();

    Object.assign(aftersale, {
      status: STATUS.RECEPT,
      handleTime: now,
    });

    await aftersaleService.updateById(aftersale);

    await orderService.updateAftersaleStatus(aftersale.orderId, STATUS.RECEPT);

    return this.success();
  }

  async ['batch-receptAction']() {
    /** @type {number[]} */
    const ids = this.post('ids');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');

    const { STATUS } = aftersaleService.getConstants();

    const now = new Date();

    await Promise.all(
      ids.map(async (id) => {
        const aftersale = await aftersaleService.findById(id);

        if (think.isEmpty(aftersale)) {
          return;
        }

        if (STATUS.REQUEST != aftersale.status) {
          return;
        }

        Object.assign(aftersale, {
          status: STATUS.RECEPT,
          handleTime: now,
        });

        await aftersaleService.updateById(aftersale);

        await orderService.updateAftersaleStatus(aftersale.orderId, STATUS.RECEPT);
      })
    );

    return this.success();
  }

  async rejectAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');
    /** @type {OrderService} */
    const orderService = this.service('order');

    const { ADMIN_RESPONSE, STATUS } = aftersaleService.getConstants();

    const aftersale = await aftersaleService.findById(id);

    if (think.isEmpty(aftersale)) {
      return this.badArgumentValue();
    }

    if (STATUS.REQUEST != aftersale.status) {
      return this.fail(ADMIN_RESPONSE.NOT_ALLOWED, '售后不能进行审核拒绝操作');
    }

    const now = new Date();

    Object.assign(aftersale, {
      status: STATUS.REJECT,
      handleTime: now,
    });

    await aftersaleService.updateById(aftersale);

    await orderService.updateAftersaleStatus(aftersale.orderId, STATUS.REJECT);

    return this.success();
  }

  async ['batch-rejectAction']() {
    /** @type {number[]} */
    const ids = this.post('ids');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');

    const { STATUS } = aftersaleService.getConstants();

    const now = new Date();

    await Promise.all(
      ids.map(async (id) => {
        const aftersale = await aftersaleService.findById(id);

        if (think.isEmpty(aftersale)) {
          return;
        }

        if (STATUS.REQUEST != aftersale.status) {
          return;
        }

        Object.assign(aftersale, {
          status: STATUS.REJECT,
          handleTime: now,
        });

        await aftersaleService.updateById(aftersale);

        await orderService.updateAftersaleStatus(aftersale.orderId, STATUS.REJECT);
      })
    );

    return this.success();
  }

  async refundAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');
    /** @type {GoodsProductService} */
    const goodsProductService = this.service('goods_product');
    /** @type {LogService} */
    const logService = this.service('log');
    /** @type {NotifyService} */
    const notifyService = this.service('notify');
    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');

    const AFTERSALE = aftersaleService.getConstants();
    const NOTIFY = notifyService.getConstants();
    const ORDER = orderService.getConstants();

    const aftersale = await aftersaleService.findById(id);

    if (think.isEmpty(aftersale)) {
      return this.badArgumentValue();
    }

    if (AFTERSALE.STATUS.REQUEST != aftersale.status) {
      return this.fail(AFTERSALE.ADMIN_RESPONSE.NOT_ALLOWED, '售后不能进行退款操作');
    }

    const order = await orderService.findById(aftersale.orderId);

    // TODO
    // try {
    //   wxPayRefundRequest({
    //     outTradeNo: order.orderSn,
    //     outRefundNo: `refund_${order.orderSn}`,
    //     totalFree: Math.floor(order.actualPrice * 100.),
    //     refundFree: Math.floor(aftersale.amount * 100.),
    //   });
    // } catch (e) {
    //   switch (true) {
    //     case e instanceof WxPayError:
    //       think.logger.error(e.message, e);
    //       return this.fail(ORDER.ADMIN_RESPONSE.REFUND_FAILED, '订单退款失败');
    //   }
    // }
    // if ('SUCCESS' != wxPayRefundResult.returnCode) {
    //   think.logger.warn(`refund fail: ${wxPayRefundResult.returnMsg}`);
    //   return this.fail(ORDER.ADMIN_RESPONSE.REFUND_FAILED, '订单退款失败');
    // }
    // if ('SUCCESS' != wxPayRefundResult.resultCode) {
    //   think.logger.warn(`refund fail: ${wxPayRefundResult.returnMsg}`);
    //   return this.fail(ORDER.ADMIN_RESPONSE.REFUND_FAILED, '订单退款失败');
    // }
    return this.fail(-1, 'not implemented');

    const now = new Date();

    Object.assign(aftersale, {
      status: AFTERSALE.STATUS.REFUND,
      handleTime: now,
    });

    await aftersaleService.updateById(aftersale);

    await orderService.updateAftersaleStatus(aftersale.orderId, AFTERSALE.STATUS.REFUND);

    if (AFTERSALE.TYPE_GOODS.REQUIRED == aftersale.type) {
      const orderGoodsList = await orderGoodsService.queryByOid(aftersale.orderId);
      await Promise.all(
        orderGoodsList.map(async (orderGoods) => {
          await goodsProductService.addStock(orderGoods.productId, orderGoods.number);
        })
      );
    }

    await notifyService.notifySmsTemplate(order.mobile, NOTIFY.TYPE.REFUND, order.orderSn.substring(8, 14));

    await logService.logOrderSucceed('退款', `订单编号 ${order.orderSn} 售后编号 ${aftersale.aftersaleSn}`, this.ctx);

    return this.success();
  }
};
