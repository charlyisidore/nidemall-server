const Base = require('./base.js');
const WxPayError = require('../../common/error/wx_pay.js');

module.exports = class WxOrderController extends Base {
  async listAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const showType = this.get('showType');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {GrouponService} */
    const grouponService = this.service('groupon');
    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const orderStatus = orderService.orderStatus(showType);
    const orderList = await orderService.queryByOrderStatus(
      userId,
      orderStatus,
      page,
      limit,
      sort,
      order
    );

    const orderVoList = await Promise.all(
      orderList.data.map(async (order) => {
        const groupon = await grouponService.queryByOrderId(order.id);
        const orderGoodsList = await orderGoodsService.queryByOid(order.id);

        return {
          id: order.id,
          orderSn: order.orderSn,
          actualPrice: order.actualPrice,
          orderStatusText: orderService.orderStatusText(order),
          handleOption: orderService.build(order),
          aftersaleStatus: order.aftersaleStatus,
          isGroupin: !think.isEmpty(groupon),
          goodsList: orderGoodsList.map((orderGoods) => ({
            id: orderGoods.id,
            goodsName: orderGoods.goodsName,
            number: orderGoods.number,
            picUrl: orderGoods.picUrl,
            specifications: orderGoods.specifications,
            price: orderGoods.price,
          })),
        };
      })
    );

    return this.successList(orderVoList, orderList);
  }

  async detailAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const orderId = this.get('orderId');

    /** @type {ExpressService} */
    const expressService = this.service('express');
    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');

    const ORDER = orderService.getConstants();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const order = await orderService.findById(orderId, userId);

    if (think.isEmpty(order)) {
      return this.fail(ORDER.RESPONSE.UNKNOWN, '订单不存在');
    }

    if (order.userId != userId) {
      return this.fail(ORDER.RESPONSE.INVALID, '不是当前用户的订单');
    }

    const orderVo = {
      id: order.id,
      orderSn: order.orderSn,
      message: order.message,
      addTime: order.addTime,
      consignee: order.consignee,
      mobile: order.mobile,
      address: order.address,
      goodsPrice: order.goodsPrice,
      couponPrice: order.couponPrice,
      freightPrice: order.freightPrice,
      actualPrice: order.actualPrice,
      orderStatusText: orderService.orderStatusText(order),
      handleOption: orderService.build(order),
      aftersaleStatus: order.aftersaleStatus,
      expCode: order.shipChannel,
      expName: expressService.getVendorName(order.shipChannel),
      expNo: order.shipSn,
    };

    const orderGoodsList = await orderGoodsService.queryByOid(order.id);

    const result = {
      orderInfo: orderVo,
      orderGoods: orderGoodsList,
      expressInfo: {},
    };

    if (ORDER.STATUS.SHIP === order.orderStatus) {
      const expressInfo = await expressService.getExpressInfo(order.shipChannel, order.shipSn);

      if (!think.isEmpty(expressInfo)) {
        Object.assign(result, {
          expressInfo,
        });
      }
    }

    return this.success(result);
  }

  async submitAction() {
    return this.transaction(async () => {
      const userId = this.getUserId();
      /** @type {number} */
      const cartId = this.get('cartId');
      /** @type {number} */
      const addressId = this.get('addressId');
      /** @type {number} */
      const couponId = this.get('couponId');
      /** @type {number?} */
      const userCouponId = this.get('userCouponId');
      /** @type {string?} */
      const message = this.get('message');
      /** @type {number?} */
      const grouponRulesId = this.get('grouponRulesId');
      /** @type {number?} */
      let grouponLinkId = this.get('grouponLinkId');

      /** @type {AddressService} */
      const addressService = this.service('address');
      /** @type {CartService} */
      const cartService = this.service('cart');
      /** @type {CouponService} */
      const couponService = this.service('coupon');
      /** @type {CouponUserService} */
      const couponUserService = this.service('coupon_user');
      /** @type {GoodsProductService} */
      const goodsProductService = this.service('goods_product');
      /** @type {GrouponService} */
      const grouponService = this.service('groupon');
      /** @type {GrouponRulesService} */
      const grouponRulesService = this.service('groupon_rules');
      /** @type {MathService} */
      const mathService = this.service('math');
      /** @type {NotifyService} */
      const notifyService = this.service('notify');
      /** @type {OrderService} */
      const orderService = this.service('order');
      /** @type {OrderGoodsService} */
      const orderGoodsService = this.service('order_goods');
      /** @type {QrCodeService} */
      const qrCodeService = this.service('qr_code');
      /** @type {SystemService} */
      const systemService = this.service('system');
      /** @type {TaskService} */
      const taskService = this.service('task');

      const COUPON_USER = couponUserService.getConstants();
      const GROUPON = grouponService.getConstants();
      const GROUPON_RULES = grouponRulesService.getConstants();
      const NOTIFY = notifyService.getConstants();
      const ORDER = orderService.getConstants();

      const freight = await systemService.getFreight();
      const freightLimit = await systemService.getFreightLimit();
      const orderUnpaid = await systemService.getOrderUnpaid();
      const now = new Date();

      if (think.isNullOrUndefined(userId)) {
        return this.unlogin();
      }

      // 如果是团购项目,验证活动是否有效
      if (grouponRulesId) {
        const rules = await grouponRulesService.findById(grouponRulesId);

        // 找不到记录
        if (think.isEmpty(rules)) {
          return this.badArgument();
        }

        // 团购规则已经过期
        if (GROUPON_RULES.RULE_STATUS.DOWN_EXPIRE == rules.status) {
          return this.fail(GROUPON.RESPONSE.EXPIRED, '团购已过期!');
        }

        // 团购规则已经下线
        if (GROUPON_RULES.RULE_STATUS.DOWN_ADMIN == rules.status) {
          return this.fail(GROUPON.RESPONSE.OFFLINE, '团购已下线!');
        }

        if (grouponLinkId) {
          // 团购人数已满
          if ((await grouponService.countGroupon(grouponLinkId)) > (rules.discountMember - 1)) {
            return this.fail(GROUPON.RESPONSE.FULL, '团购活动人数已满!');
          }

          // NOTE
          // 这里业务方面允许用户多次开团，以及多次参团，
          // 但是会限制以下两点：
          // （1）不允许参加已经加入的团购
          if (await grouponService.hasJoin(grouponLinkId, userId)) {
            return this.fail(GROUPON.RESPONSE.JOIN, '团购活动已经参加!');
          }

          // （2）不允许参加自己开团的团购
          const groupon = await grouponService.queryById(grouponLinkId, userId);

          if (!think.isEmpty(groupon) && groupon.creatorUserId == userId) {
            return this.fail(GROUPON.RESPONSE.JOIN, '团购活动已经参加!');
          }
        }
      }

      // 收货地址
      const checkedAddres = await addressService.query(addressId, userId);

      if (think.isEmpty(checkedAddres)) {
        return this.badArgument();
      }

      // 团购优惠
      let grouponPrice = 0.0;
      const grouponRules = await grouponRulesService.findById(grouponRulesId);

      if (!think.isEmpty(grouponRules)) {
        grouponPrice = grouponRules.discount;
      }

      // 货品价格
      let checkedGoodsList = null;

      if (!cartId) {
        checkedGoodsList = await cartService.queryByUidAndChecked(userId);
      } else {
        const cart = await cartService.findById(cartId);
        checkedGoodsList = [cart];
      }

      if (0 == checkedGoodsList.length) {
        return this.badArgumentValue();
      }

      let checkedGoodsPrice = 0.0;
      for (const checkGoods of checkedGoodsList) {
        // 只有当团购规格商品ID符合才进行团购优惠
        if (!think.isEmpty(grouponRules) && grouponRules.goodsId == checkGoods.goodsId) {
          checkedGoodsPrice += (checkGoods.price - grouponPrice) * checkGoods.number;
        } else {
          checkedGoodsPrice += checkGoods.price * checkGoods.number;
        }
      }

      // 获取可用的优惠券信息
      // 使用优惠券减免的金额
      let couponPrice = 0.0;
      if (couponId && couponId != -1) {
        const coupon = await couponService.checkCoupon(
          userId,
          couponId,
          userCouponId,
          checkedGoodsPrice,
          checkedGoodsList
        );

        if (think.isEmpty(coupon)) {
          return this.badArgumentValue();
        }

        couponPrice = coupon.discount;
      }

      // 根据订单商品总价计算运费，满足条件（例如88元）则免运费，否则需要支付运费（例如8元）；
      let freightPrice = 0.0;
      if (mathService.isFloatLessThan(checkedGoodsPrice, freightLimit)) {
        freightPrice = freight;
      }

      // 可以使用的其他钱，例如用户积分
      const integralPrice = 0.0;

      // 订单费用
      const orderTotalPrice = Math.max(0.0, checkedGoodsPrice + freightPrice - couponPrice);

      // 最终支付费用
      const actualPrice = orderTotalPrice - integralPrice;

      /** @type {Order} */
      const order = {
        userId,
        orderSn: await orderService.generateOrderSn(userId),
        orderStatus: ORDER.STATUS.CREATE,
        consignee: checkedAddres.name,
        mobile: checkedAddres.tel,
        message,
        address: `${checkedAddres.province}${checkedAddres.city}${checkedAddres.county} ${checkedAddres.addressDetail}`,
        goodsPrice: checkedGoodsPrice,
        freightPrice,
        couponPrice,
        integralPrice,
        orderPrice: orderTotalPrice,
        actualPrice,
        // 有团购
        grouponPrice: think.isEmpty(grouponRules) ? 0.0 : grouponPrice,
      };

      // 添加订单表项
      order.id = await orderService.add(order);
      const orderId = order.id;

      // 添加订单商品表项
      for (const cartGoods of checkedGoodsList) {
        // 订单商品
        const orderGoods = {
          orderId: order.id,
          goodsId: cartGoods.goodsId,
          goodsSn: cartGoods.goodsSn,
          productId: cartGoods.productId,
          goodsName: cartGoods.goodsName,
          picUrl: cartGoods.picUrl,
          price: cartGoods.price,
          number: cartGoods.number,
          specifications: cartGoods.specifications,
          addTime: now,
        };

        await orderGoodsService.add(orderGoods);
      }

      // 删除购物车里面的商品信息
      if (cartId) {
        await cartService.deleteById(cartId);
      } else {
        await cartService.clearGoods(userId);
      }

      // 商品货品数量减少
      for (const checkGoods of checkedGoodsList) {
        const productId = checkGoods.productId;
        const product = await goodsProductService.findById(productId);

        const remainNumber = product.number - checkGoods.number;

        if (remainNumber < 0) {
          throw new Error('下单的商品货品数量大于库存量');
        }

        if (!await goodsProductService.reduceStock(productId, checkGoods.number)) {
          throw new Error('商品货品库存减少失败');
        }
      }

      // 如果使用了优惠券，设置优惠券使用状态
      if (couponId && couponId != -1) {
        const couponUser = await couponUserService.findById(userCouponId);

        Object.assign(couponUser, {
          status: COUPON_USER.STATUS.USED,
          usedTime: now,
          orderId,
        });

        await couponUserService.update(couponUser);
      }

      // 如果是团购项目，添加团购信息
      if (grouponRulesId) {
        const groupon = {
          orderId,
          status: GROUPON.STATUS.NONE,
          userId,
          rulesId: grouponRulesId,
        };

        // 参与者
        if (grouponLinkId) {
          // 参与的团购记录
          const baseGroupon = await grouponService.queryById(grouponLinkId);

          Object.assign(groupon, {
            creatorUserId: baseGroupon.creatorUserId,
            grouponId: grouponLinkId,
            shareUrl: baseGroupon.shareUrl,
          });

          groupon.id = await grouponService.createGroupon(groupon);
        } else {
          Object.assign(groupon, {
            creatorUserId: userId,
            creatorUserTime: now,
            grouponId: 0,
          });

          groupon.id = await grouponService.createGroupon(groupon);
          grouponLinkId = groupon.id;
        }
      }

      // NOTE: 建议开发者从业务场景核实下面代码，防止用户利用业务BUG使订单跳过支付环节。
      // 如果订单实际支付费用是0，则直接跳过支付变成待发货状态
      let payed = false;

      // Avoid using `==` because of precision loss in float numbers
      if (mathService.isFloatEqual(0.0, order.actualPrice)) {
        payed = true;

        await orderService.updateSelective({
          id: orderId,
          orderStatus: ORDER.STATUS.PAY,
        });

        // 支付成功，有团购信息，更新团购信息
        const groupon = await grouponService.queryByOrderId(order.id);

        if (!think.isEmpty(groupon)) {
          const grouponRules = await grouponRulesService.findById(groupon.rulesId);

          if (0 == groupon.grouponId) {
            Object.assign(groupon, {
              shareUrl: await qrCodeService.createGrouponShareImage(grouponRules.goodsName, grouponRules.picUrl, groupon),
            });
          }

          groupon.status = GROUPON.STATUS.ON;

          if (!await grouponService.updateById(groupon)) {
            throw new Error('更新数据已失效');
          }

          const grouponList = await grouponService.queryJoinRecord(groupon.grouponId);

          if (groupon.groupondId && grouponList.length >= (grouponRules.discountMember - 1)) {
            for (const grouponActivity of grouponList) {
              grouponActivity.status = GROUPON.STATUS.SUCCEED;
              await grouponService.updateById(grouponActivity);
            }

            const grouponSource = await grouponService.queryById(groupon.grouponId);
            grouponSource.status = GROUPON.STATUS.SUCCEED;
            await grouponService.updateById(grouponSource);
          }
        }

        // 订单支付成功以后，会发送短信给用户，以及发送邮件给管理员
        await notifyService.notifyMail('新订单通知', orderService.orderToString(order));

        // 这里微信的短信平台对参数长度有限制，所以将订单号只截取后6位
        await notifyService.notifySmsTemplateSync(
          order.mobile,
          NOTIFY.TYPE.PAY_SUCCEED,
          [order.orderSn.substring(8, 14)]
        );
      } else {
        taskService.addTask(
          () => orderService.orderUnpaidTask(orderId),
          now.getTime() + orderUnpaid * 60 * 1000,
          `OrderUnpaidTask:${order.id}`
        );
      }

      return this.success({
        orderId,
        payed,
        grouponLinkId: (grouponRulesId ? grouponLinkId : 0),
      });
    });
  }

  async cancelAction() {
    return this.transaction(async () => {
      const userId = this.getUserId();
      /** @type {number} */
      const orderId = this.get('orderId');

      /** @type {GoodsProductService} */
      const goodsProductService = this.service('goods_product');
      /** @type {OrderService} */
      const orderService = this.service('order');
      /** @type {OrderGoodsService} */
      const orderGoodsService = this.service('order_goods');

      const ORDER = orderService.getConstants();

      const now = new Date();

      if (think.isNullOrUndefined(userId)) {
        return this.unlogin();
      }

      const order = await orderService.findById(orderId, userId);

      if (think.isEmpty(order) || order.userId != userId) {
        return this.badArgumentValue();
      }

      // 检测是否能够取消
      const handleOption = orderService.build(order);

      if (!handleOption.cancel) {
        return this.fail(ORDER.RESPONSE.INVALID_OPERATION, '订单不能取消');
      }

      // 设置订单已取消状态
      Object.assign(order, {
        orderStatus: ORDER.STATUS.CANCEL,
        endTime: now,
      });

      if (!await orderService.updateWithOptimisticLocker(order)) {
        // Update data no longer available
        throw new Error('更新数据已失效');
      }

      // 商品货品数量增加
      const orderGoodsList = await orderGoodsService.queryByOid(orderId);

      for (const orderGoods of orderGoodsList) {
        if (!await goodsProductService.addStock(orderGoods.productId, orderGoods.number)) {
          // Failed to increase the inventory of a product
          throw new Error('商品货品库存增加失败');
        }
      }

      // 返还优惠券
      await orderService.releaseCoupon(orderId);

      return this.success();
    });
  }

  async prepayAction() {
    return this.transaction(async () => {
      const userId = this.getUserId();
      /** @type {number} */
      const orderId = this.post('orderId');
      /** @type {number} */
      const apiVersion = this.post('apiVersion');

      /** @type {AuthService} */
      const authService = this.service('auth');
      /** @type {OrderService} */
      const orderService = this.service('order');
      /** @type {UserService} */
      const userService = this.service('user');
      /** @type {WeixinService} */
      const weixinService = this.service('weixin');

      const AUTH = authService.getConstants();
      const ORDER = orderService.getConstants();

      if (think.isNullOrUndefined(userId)) {
        return this.unlogin();
      }

      const order = await orderService.findById(orderId, userId);

      if (think.isEmpty(order) || order.userId != userId) {
        return this.badArgumentValue();
      }

      // 检测是否能够取消
      const handleOption = orderService.build(order);

      if (!handleOption.pay) {
        return this.fail(ORDER.RESPONSE.INVALID_OPERATION, '订单不能支付');
      }

      const user = await userService.findById(userId);

      if (think.isNullOrUndefined(user.weixinOpenid)) {
        return this.fail(AUTH.RESPONSE.OPENID_UNACCESS, '订单不能支付');
      }

      let result = null;
      try {
        switch (apiVersion) {
          case 3:
            result = await weixinService.createOrderV3({
              outTradeNo: order.orderSn,
              openid: user.weixinOpenid,
              body: `订单：${order.orderSn}`,
              totalFee: Math.floor(order.actualPrice * 100.0),
              spbillCreateIp: this.ip,
            });
            break;
          default: // 1
            result = await weixinService.createOrder({
              outTradeNo: order.orderSn,
              openid: user.weixinOpenid,
              body: `订单：${order.orderSn}`,
              // 元转成分
              totalFee: Math.floor(order.actualPrice * 100.0),
              spbillCreateIp: this.ip,
            });
            break;
        }
      } catch (e) {
        console.error(e);
        think.logger.error(e.toString());
        return this.fail(ORDER.RESPONSE.PAY_FAIL, '订单不能支付');
      }

      if (!await orderService.updateWithOptimisticLocker(order)) {
        return this.updatedDateExpired();
      }

      return this.success(result);
    });
  }

  async ['pay-notifyAction']() {
    return this.transaction(async () => {
      // TODO
      think.logger.info(`[pay-notifyAction]`);
      think.logger.info(`this.ctx.headers = ${JSON.stringify(this.ctx.headers)}`);
      think.logger.info(`this.post() = ${JSON.stringify(this.post())}`);
      think.logger.info(`this.ctx.request.body = ${JSON.stringify(this.ctx.request.body)}`);
      think.logger.info(`this.ctx.request.rawBody = ${JSON.stringify(this.ctx.request.rawBody)}`);

      /** @type {object|string} */
      let xml = this.post('xml') ?? this.ctx.request.rawBody;

      /** @type {GrouponService} */
      const grouponService = this.service('groupon');
      /** @type {GrouponRulesService} */
      const grouponRulesService = this.service('groupon_rules');
      /** @type {MathService} */
      const mathService = this.service('math');
      /** @type {NotifyService} */
      const notifyService = this.service('notify');
      /** @type {OrderService} */
      const orderService = this.service('order');
      /** @type {QrCodeService} */
      const qrCodeService = this.service('qr_code');
      /** @type {TaskService} */
      const taskService = this.service('task');
      /** @type {WeixinService} */
      const weixinService = this.service('weixin');

      const GROUPON = grouponService.getConstants();
      const NOTIFY = notifyService.getConstants();
      const ORDER = orderService.getConstants();

      if (think.isObject(xml)) {
        xml = Object.fromEntries(
          Object.entries(xml)
            .map(([key, [value]]) => [key, value])
        );
      }

      let result = null;
      try {
        result = weixinService.parseOrderNotifyResult(xml);

        if ('SUCCESS' != result.resultCode) {
          console.error(xml);
          think.logger.error(xml);
          throw new WxPayError('微信通知支付失败！');
        }

        if ('SUCCESS' != result.returnCode) {
          console.error(xml);
          think.logger.error(xml);
          throw new WxPayError('微信通知支付失败！');
        }
      } catch (e) {
        switch (true) {
          case e instanceof WxPayError:
          default:
            console.error(e);
            think.logger.error(e.toString());
            return weixinService.fail(e.message);
        }
      }

      think.logger.info('处理腾讯支付平台的订单支付');
      think.logger.info(result);

      const orderSn = result.outTradeNo;
      const payId = result.transationId;

      // 分转化成元
      const totalFee = weixinService.fenToYuan(result.totalFee);

      const order = await orderService.findBySn(orderSn);

      if (think.isEmpty(order)) {
        return weixinService.fail(`订单不存在 sn=${orderSn}`);
      }

      // 检查这个订单是否已经处理过
      if (orderService.hasPayed(order)) {
        return weixinService.success('订单已经处理成功!');
      }

      // 检查支付订单金额
      if (!mathService.isFloatEqual(order.actualPrice, totalFee)) {
        return weixinService.fail(`${order.orderSn} : 支付金额不符合 totalFee=${totalFee}`);
      }

      const now = new Date();

      Object.assign(order, {
        payId,
        payTime: now,
        orderStatus: ORDER.STATUS.PAY,
      });

      if (!await orderService.updateWithOptimisticLocker(order)) {
        return weixinService.fail('更新数据已失效');
      }

      // 支付成功，有团购信息，更新团购信息
      const groupon = await grouponService.queryByOrderId(order.id);

      if (!think.isEmpty(groupon)) {
        const grouponRules = await grouponRulesService.findById(groupon.rulesId);

        // 仅当发起者才创建分享图片
        if (think.isEmpty(groupon.grouponId)) {
          Object.assign(groupon, {
            shareUrl: await qrCodeService.createGrouponShareImage(
              grouponRules.goodsName,
              grouponRules.picUrl,
              groupon
            ),
          });
        }

        Object.assign(groupon, {
          status: GROUPON.STATUS.ON,
        });

        if (!await grouponService.updateById(groupon)) {
          return weixinService.fail('更新数据已失效');
        }

        const grouponList = await grouponService.queryJoinRecord(groupon.grouponId);

        if (!think.isEmpty(groupon.grouponId) && grouponList.length >= grouponRules.discountMember - 1) {
          await this.promiseAllFinished(
            grouponList.map(async (grouponActivity) => {
              Object.assign(grouponActivity, {
                status: GROUPON.STATUS.SUCCEED,
              });
              await grouponService.updateById(grouponActivity);
            })
          );

          const grouponSource = await grouponService.queryById(groupon.grouponId);
          Object.assign(grouponSource, {
            status: GROUPON.STATUS.SUCCEED,
          });
          await grouponService.updateById(grouponSource);
        }
      }

      // 订单支付成功以后，会发送短信给用户，以及发送邮件给管理员
      await notifyService.notifyMail('新订单通知', orderService.orderToString(order));

      // 这里微信的短信平台对参数长度有限制，所以将订单号只截取后6位
      await notifyService.notifySmsTemplate(
        order.mobile,
        NOTIFY.TYPE.PAY_SUCCEED,
        [order.orderSn.substring(8, 14)]
      );

      // 取消订单超时未支付任务
      taskService.removeTask(`OrderUnpaidTask:${order.id}`);

      return weixinService.success('处理成功!');
    });
  }

  async refundAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const orderId = this.get('orderId');

    /** @type {NotifyService} */
    const notifyService = this.service('notify');
    /** @type {OrderService} */
    const orderService = this.service('order');

    const ORDER = orderService.getConstants();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const order = await orderService.findById(orderId, userId);

    if (think.isEmpty(order)) {
      return this.badArgument();
    }

    if (order.userId != userId) {
      return this.badArgumentValue();
    }

    const handleOption = orderService.build(order);

    if (!handleOption.refund) {
      return this.fail(ORDER.RESPONSE.INVALID_OPERATION, '订单不能取消');
    }

    // 设置订单申请退款状态
    Object.assign(order, {
      orderStatus: ORDER.STATUS.REFUND,
    });

    if (!await orderService.updateWithOptimisticLocker(order)) {
      return this.updatedDateExpired();
    }

    await notifyService.notifyMail('退款申请', orderService.orderToString(order));

    return this.success();
  }

  async confirmAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const orderId = this.get('orderId');

    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');

    const ORDER = orderService.getConstants();

    const now = new Date();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const order = await orderService.findById(orderId, userId);

    if (think.isEmpty(order)) {
      return this.badArgument();
    }

    if (order.userId != userId) {
      return this.badArgumentValue();
    }

    const handleOption = orderService.build(order);

    if (!handleOption.confirm) {
      return this.fail(ORDER.RESPONSE.INVALID_OPERATION, '订单不能确认收货');
    }

    const comments = await orderGoodsService.getComments(orderId);

    Object.assign(order, {
      comments,
      orderStatus: ORDER.STATUS.CONFIRM,
      confirmTime: now,
    });

    if (!await orderService.updateWithOptimisticLocker(order)) {
      return this.updatedDateExpired();
    }

    return this.success();
  }

  async deleteAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const orderId = this.get('orderId');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');
    /** @type {OrderService} */
    const orderService = this.service('order');

    const ORDER = orderService.getConstants();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const order = await orderService.findById(orderId, userId);

    if (think.isEmpty(order)) {
      return this.badArgument();
    }

    if (order.userId != userId) {
      return this.badArgumentValue();
    }

    const handleOption = orderService.build(order);

    if (!handleOption.delete) {
      return this.fail(ORDER.RESPONSE.INVALID_OPERATION, '订单不能删除');
    }

    // 订单order_status没有字段用于标识删除
    // 而是存在专门的delete字段表示是否删除
    await orderService.deleteById(orderId);

    // 售后也同时删除
    await aftersaleService.deleteByOrderId(orderId, userId);

    return this.success();
  }

  async goodsAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const ogid = this.get('ogid');

    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const orderGoods = await orderGoodsService.findById(ogid);

    if (think.isEmpty(orderGoods)) {
      return this.success(null);
    }

    const order = await orderService.findById(orderGoods.orderId);

    if (order.userId != userId) {
      return this.badArgument();
    }

    return this.success(orderGoods);
  }

  async commentAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const orderGoodsId = this.get('orderGoodsId');
    /** @type {string} */
    const content = this.get('content');
    /** @type {number} */
    const star = this.get('star');
    /** @type {boolean} */
    const hasPicture = this.get('hasPicture');
    /** @type {string[]} */
    let picUrls = this.get('picUrls');

    /** @type {CommentService} */
    const commentService = this.service('comment');
    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');

    const ORDER = orderService.getConstants();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const orderGoods = await orderGoodsService.findById(orderGoodsId);

    if (think.isEmpty(orderGoods)) {
      return this.badArgumentValue();
    }

    const order = await orderService.findById(orderGoods.orderId, userId);

    if (think.isEmpty(order)) {
      return this.badArgumentValue();
    }

    if (!orderService.isConfirmStatus(order) && !orderService.isAutoConfirmStatus(order)) {
      return this.fail(ORDER.RESPONSE.INVALID_OPERATION, '当前商品不能评价');
    }

    if (order.userId != userId) {
      return this.fail(ORDER.RESPONSE.INVALID, '当前商品不属于用户');
    }

    if (-1 == orderGoods.comment) {
      // Current product evaluation time has expired
      return this.fail(ORDER.RESPONSE.COMMENT_EXPIRED, '当前商品评价时间已经过期');
    }

    if (0 != orderGoods.comment) {
      // Already evaluated
      return this.fail(ORDER.RESPONSE.COMMENTED, '订单商品已评价');
    }

    if (think.isNullOrUndefined(star) || star < 0 || star > 5) {
      return this.badArgumentValue();
    }

    if (!hasPicture) {
      picUrls = [];
    }

    const comment = {
      userId,
      type: 0,
      valueId: orderGoods.goodsId,
      star,
      content,
      hasPicture,
      picUrls,
    };

    comment.id = await commentService.save(comment);

    Object.assign(orderGoods, {
      comment: comment.id,
    });

    await orderGoodsService.updateById(orderGoods);

    Object.assign(order, {
      comments: Math.max(0, order.comments - 1),
    });

    await orderService.updateWithOptimisticLocker(order);

    return this.success();
  }
};
