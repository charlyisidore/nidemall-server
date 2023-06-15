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
    return this.transaction(async () => {
    /** @type {number} */
    const orderId = this.post('orderId');
    /** @type {number} */
    const refundMoney = this.post('refundMoney');

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

    const COUPON_USER = couponUserService.getConstants();
    const NOTIFY = notifyService.getConstants();
    const ORDER = orderService.getConstants();

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

      await this.promiseAllFinished(
        orderGoodsList.map(async (orderGoods) => {
          if (!await goodsProductService.addStock(orderGoods.productId, orderGoods.number)) {
            throw new Error('商品货品库存增加失败');
          }
        })
      );

      const couponUsers = await couponUserService.queryByOid(orderId);

      await this.promiseAllFinished(
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
    });
  }

  async shipAction() {
    /** @type {number} */
    const orderId = this.post('orderId');
    /** @type {string} */
    const shipSn = this.post('shipSn');
    /** @type {string} */
    const shipChannel = this.post('shipChannel');

    /** @type {LogService} */
    const logService = this.service('log');
    /** @type {NotifyService} */
    const notifyService = this.service('notify');
    /** @type {OrderService} */
    const orderService = this.service('order');

    const NOTIFY = notifyService.getConstants();
    const ORDER = orderService.getConstants();

    const order = await orderService.findById(orderId);

    if (think.isEmpty(order)) {
      return this.badArgument();
    }

    if (ORDER.STATUS.PAY != order.orderStatus) {
      return this.fail(ORDER.ADMIN_RESPONSE.CONFIRM_NOT_ALLOWED, '订单不能确认收货');
    }

    const now = new Date();

    Object.assign(order, {
      orderStatus: ORDER.STATUS.SHIP,
      shipSn,
      shipChannel,
      shipTime: now,
    });

    if (!await orderService.updateWithOptimisticLocker(order)) {
      return this.updatedDateExpired();
    }

    await notifyService.notifySmsTemplate(order.mobile, NOTIFY.TYPE.SHIP, [shipChannel, shipSn]);

    await logService.logOrderSucceed('发货', `订单编号 ${order.orderSn}`, this.ctx);

    return this.success();
  }

  async payAction() {
    /** @type {number} */
    const orderId = this.post('orderId');
    /** @type {number} */
    const newMoney = this.post('newMoney');

    /** @type {OrderService} */
    const orderService = this.service('order');

    const { ADMIN_RESPONSE, STATUS } = orderService.getConstants();

    const order = await orderService.findById(orderId);

    if (think.isEmpty(order)) {
      return this.badArgument();
    }

    if (STATUS.CREATE != order.orderStatus) {
      return this.fail(ADMIN_RESPONSE.PAY_FAILED, '当前订单状态不支持线下收款');
    }

    Object.assign(order, {
      actualPrice: newMoney,
      orderStatus: STATUS.PAY,
    });

    if (!await orderService.updateWithOptimisticLocker(order)) {
      return this.fail(ADMIN_RESPONSE.PAY_FAILED, '更新数据已失效');
      // https://github.com/Wechat-Group/WxJava/blob/develop/weixin-java-pay/src/main/java/com/github/binarywang/wxpay/bean/notify/WxPayNotifyResponse.java
      // return WxPayNotifyResponse.fail("更新数据已失效");
    }

    return this.success();
  }

  async deleteAction() {
    /** @type {number} */
    const orderId = this.post('orderId');

    /** @type {LogService} */
    const logService = this.service('log');
    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');

    const { ADMIN_RESPONSE, STATUS } = orderService.getConstants();

    const order = await orderService.findById(orderId);

    if (think.isEmpty(order)) {
      return this.badArgument();
    }

    if (![
      STATUS.CANCEL,
      STATUS.AUTO_CANCEL,
      STATUS.CONFIRM,
      STATUS.AUTO_CONFIRM,
      STATUS.REFUND_CONFIRM,
    ].includes(order.orderStatus)) {
      return this.fail(ADMIN_RESPONSE.DELETE_FAILED, '订单不能删除');
    }

    await orderService.deleteById(orderId);
    await orderGoodsService.deleteByOrderId(orderId);

    await logService.logOrderSucceed('删除', `订单编号 ${order.orderSn}`, this.ctx);

    return this.success();
  }

  async replyAction() {
    /** @type {number} */
    const commentId = this.post('commentId');
    /** @type {string} */
    const content = this.post('content');

    /** @type {CommentService} */
    const commentService = this.service('comment');
    /** @type {OrderService} */
    const orderService = this.service('order');

    const { ADMIN_RESPONSE } = orderService.getConstants();

    const comment = await commentService.findById(commentId);

    if (think.isEmpty(comment)) {
      return this.badArgument();
    }

    if (!think.isTrueEmpty(comment.adminContent)) {
      return this.fail(ADMIN_RESPONSE.REPLY_EXIST, '订单商品已回复！');
    }

    Object.assign(comment, {
      content,
    });

    await commentService.updateById(comment);

    return this.success();
  }
};
