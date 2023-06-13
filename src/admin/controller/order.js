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
    /** @type {number} */
    const orderId = this.get('orderId');
    /** @type {number} */
    const refundMoney = this.get('refundMoney');

    /** @type {CouponUserService} */
    const couponUserService = this.service('coupon_user');
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
    /** @type {WeixinService} */
    const weixinService = this.service('weixin');

    const ORDER = orderService.getConstants();
    const COUPON_USER = couponUserService.getConstants();

    const order = await orderService.findById(orderId);

    if (think.isEmpty(order)) {
      return this.badArgument();
    }

    if (order.actualPrice != refundMoney) {
      return this.badArgumentValue();
    }

    if (ORDER.STATUS.REFUND != order.orderStatus) {
      return this.fail(ORDER.ADMIN_RESPONSE.CONFIRM_NOT_ALLOWED, '订单不能确认收货');
    }

    // TODO
    // let wxPayRefundResult;
    // try {
    //   const totalFee = Math.floor(order.actualPrice * 100.);
    //   wxPayRefundResult = await weixinService.refund({
    //     outTradeNo: order.orderSn,
    //     outRefundNo: `refund_${order.orderSn}`,
    //     totalFee,
    //     refundFee: totalFee,
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

    Object.assign(order, {
      orderStatus: ORDER.STATUS.REFUND_CONFIRM,
      endTime: now,
      refundAmount: order.actualPrice,
      refundType: '微信退款接口',
      refundContent: wxPayRefundResult.refundId,
      refundTime: now,
    });

    if (!await orderService.updateWithOptimisticLocker(order)) {
      throw new Error('更新数据已失效');
    }

    const orderGoodsList = await orderGoodsService.queryByOid(orderId);

    await Promise.all(
      orderGoodsList.map(async (orderGoods) => {
        if (!await goodsProductService.addStock(orderGoods.productId, orderGoods.number)) {
          throw new Error('商品货品库存增加失败');
        }
      })
    );

    const couponUsers = await couponUserService.queryByOid(orderId);

    await Promise.all(
      couponUsers.map(async (couponUser) => {
        Object.assign(couponUser, {
          status: COUPON_USER.STATUS.USABLE,
          updateTime: now,
        });

        await couponUserService.update(couponUser);
      })
    );

    await notifyService.notifySmsTemplate(order.mobile, NOTIFY.TYPE.REFUND, order.orderSn.substring(8, 14));

    await logService.logOrderSucceed('退款', `订单编号 ${order.orderSn}`, this.ctx);

    return this.success();
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
