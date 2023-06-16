const Base = require('./base.js');

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
      const grouponLinkId = this.get('grouponLinkId');

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
      const ORDER = orderService.getConstants();

      const freight = await systemService.getFreight();
      const freightLimit = await systemService.getFreightLimit();
      const orderUnpaid = await systemService.getOrderUnpaid();
      const now = new Date();

      if (think.isNullOrUndefined(userId)) {
        return this.unlogin();
      }

      if (grouponRulesId) {
        const rules = await grouponRulesService.findById(grouponRulesId);

        if (think.isEmpty(rules)) {
          return this.badArgument();
        }

        if (GROUPON_RULES.RULE_STATUS.DOWN_EXPIRE == rules.status) {
          return this.fail(GROUPON.RESPONSE.EXPIRED, '团购已过期!');
        }

        if (GROUPON_RULES.RULE_STATUS.DOWN_ADMIN == rules.status) {
          return this.fail(GROUPON.RESPONSE.OFFLINE, '团购已下线!');
        }

        if (grouponLinkId) {
          if ((await grouponService.countGroupon(grouponLinkId)) > (rules.discountMember - 1)) {
            return this.fail(GROUPON.RESPONSE.FULL, '团购活动人数已满!');
          }

          if (await grouponService.hasJoin(grouponLinkId, userId)) {
            return this.fail(GROUPON.RESPONSE.JOIN, '团购活动已经参加!');
          }

          const groupon = await grouponService.queryById(grouponLinkId, userId);

          if (!think.isEmpty(groupon) && groupon.creatorUserId == userId) {
            return this.fail(GROUPON.RESPONSE.JOIN, '团购活动已经参加!');
          }
        }
      }

      const checkedAddres = await addressService.query(addressId, userId);

      if (think.isEmpty(checkedAddres)) {
        return this.badArgument();
      }

      let grouponPrice = 0.;
      const grouponRules = await grouponRulesService.findById(grouponRulesId);

      if (!think.isEmpty(grouponRules)) {
        grouponPrice = grouponRules.discount;
      }

      let checkedGoodsList = null;

      if (!cartId) {
        checkedGoodsList = await cartService.queryByUidAndChecked(userId);
      } else {
        const cart = await cartService.findById(cartId);
        checkedGoodsList = [cart];
      }

      if (checkedGoodsList.length == 0) {
        return this.badArgumentValue();
      }

      let checkedGoodsPrice = 0.;
      for (const checkGoods of checkedGoodsList) {
        if (!think.isEmpty(grouponRules) && grouponRules.goodsId == checkGoods.goodsId) {
          checkedGoodsPrice += (checkGoods.price - grouponPrice) * checkGoods.number;
        } else {
          checkedGoodsPrice += checkGoods.price * checkGoods.number;
        }
      }

      let couponPrice = 0.;
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

      let freightPrice = 0.;
      if (checkedGoodsPrice < freightLimit) {
        freightPrice = freight;
      }

      const integralPrice = 0.;
      const orderTotalPrice = Math.max(0., checkedGoodsPrice + freightPrice - couponPrice);
      const actualPrice = orderTotalPrice - integralPrice;

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
        grouponPrice: think.isEmpty(grouponRules) ? 0. : grouponPrice,
      };

      order.id = await orderService.add(order);

      for (const cartGoods of checkedGoodsList) {
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

      if (cartId) {
        await cartService.deleteById(cartId);
      } else {
        await cartService.clearGoods(userId);
      }

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

      if (couponId && couponId != -1) {
        const couponUser = await couponUserService.findById(userCouponId);

        Object.assign(couponUser, {
          status: COUPON_USER.STATUS.USED,
          usedTime: now,
          orderId: order.id,
        });

        await couponUserService.update(couponUser);
      }

      if (grouponRulesId) {
        const groupon = {
          orderId: order.id,
          status: GROUPON.STATUS.NONE,
          userId,
          rulesId: grouponRulesId,
        };

        if (grouponLinkId) {
          const baseGroupon = await grouponService.queryById(grouponLinkId);

          Object.assign(groupon, {
            creatorUserId: baseGroupon.creatorUserId,
            grouponId: grouponLinkId,
            shareUrl: baseGroupon.shareUrl,
          });

          await grouponService.createGroupon(groupon);
        } else {
          Object.assign(groupon, {
            creatorUserId: userId,
            creatorUserTime: now,
            grouponId: 0,
          });

          grouponLinkId = await grouponService.createGroupon(groupon);
        }
      }

      let payed = false;

      // Deal with float precision
      if (order.actualPrice < 0.001) {
        payed = true;

        await orderService.updateSelective({
          id: order.id,
          orderStatus: ORDER.STATUS.PAY,
        });

        const groupon = await grouponService.queryByOrderId(order.id);

        if (!think.isEmpty(groupon)) {
          const grouponRules = await grouponRulesService.findById(groupon.rulesId);

          if (groupon.grouponId == 0) {
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

        // TODO
        // await notifyService.notifyMail('新订单通知', order.toString());
        // await notifyService.notifySmsTemplateSync(order.mobile, NotifyService.PAY.SUCCEED, order.orderSn.substr(8, 14));
      } else {
        taskService.addTask(
          () => orderService.orderUnpaidTask(order.id),
          now.getTime() + orderUnpaid * 60 * 1000,
          `OrderUnpaidTask:${order.id}`
        );
      }

      return this.success({
        orderId: order.id,
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

      const handleOption = orderService.build(order);

      if (!handleOption.cancel) {
        return this.fail(ORDER.RESPONSE.INVALID_OPERATION, '订单不能取消');
      }

      Object.assign(order, {
        orderStatus: ORDER.STATUS.CANCEL,
        endTime: now,
      });

      if (!await orderService.updateWithOptimisticLocker(order)) {
        // Update data no longer available
        throw new Error('更新数据已失效');
      }

      const orderGoodsList = await orderGoodsService.queryByOid(orderId);

      for (const orderGoods of orderGoodsList) {
        if (!await goodsProductService.addStock(orderGoods.productId, orderGoods.number)) {
          // Failed to increase the inventory of a product
          throw new Error('商品货品库存增加失败');
        }
      }

      await orderService.releaseCoupon(orderId);

      return this.success();
    });
  }

  async prepayAction() {
    return this.transaction(async () => {
      const userId = this.getUserId();
      /** @type {number} */
      const orderId = this.post('orderId');

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
        result = await weixinService.createOrder({
          outTradeNo: order.orderSn,
          openid: user.weixinOpenid,
          body: `订单：${order.orderSn}`,
          totalFee: Math.floor(order.actualPrice * 100.),
          spbillCreateIp: this.ip,
        });
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

  async paynotifyAction() {
    return this.transaction(async () => {
      // TODO
      console.log(`============ PAY NOTIFY 1 ============`);
      console.log(this.post());
      console.log(this.file());

      // return this.fail(-1);

      /** @type {GrouponService} */
      const grouponService = this.service('groupon');
      /** @type {GrouponRulesService} */
      const grouponRulesService = this.service('groupon_rules');
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

      // const result = await weixinService.parsePayNotify(xml);

      // console.log(result);

      console.log(`============ PAY NOTIFY 3 ============`);

      // TODO: parse order notify result
      // try {
      //   result = wxPayService.parseOrderNotifyResult(xmlResult);

      //   if(!WxPayConstants.ResultCode.SUCCESS.equals(result.getResultCode())){
      //       logger.error(xmlResult);
      //       throw new WxPayException("微信通知支付失败！");
      //   }
      //   if(!WxPayConstants.ResultCode.SUCCESS.equals(result.getReturnCode())){
      //       logger.error(xmlResult);
      //       throw new WxPayException("微信通知支付失败！");
      //   }
      // } catch (WxPayException e) {
      //     e.printStackTrace();
      //     return WxPayNotifyResponse.fail(e.getMessage());
      // }

      think.logger.info('处理腾讯支付平台的订单支付');
      think.logger.info(result);

      // TODO: check XML response syntax (camel case?)
      const orderSn = result.outTradeNo;
      const payId = result.transationId;

      // https://github.com/Wechat-Group/WxJava/blob/cb34973efe26574da9027a8a39672fe8c38aea86/weixin-java-pay/src/main/java/com/github/binarywang/wxpay/bean/result/BaseWxPayResult.java#L126
      const totalFee = this.fenToYuan(result.totalFee);

      const order = await orderService.findBySn(orderSn);

      if (think.isEmpty(order)) {
        // TODO: weixinService.fail
        return weixinService.fail(`订单不存在 sn=${orderSn}`);
      }

      // TODO: hasPayed()
      if (this.hasPayed(order)) {
        // TODO: weixinService.success
        return weixinService.success('订单已经处理成功!');
      }

      if (totalFee != order.actualPrice) {
        // TODO: weixinService.fail
        return weixinService.fail(`${order.orderSn} : 支付金额不符合 totalFee=${totalFee}`);
      }

      const now = new Date();

      Object.assign(order, {
        payId,
        payTime: now,
        orderStatus: ORDER.STATUS.PAY,
      });

      if (!await orderService.updateWithOptimisticLocker(order)) {
        // TODO: weixinService.fail
        return weixinService.fail('更新数据已失效');
      }

      const groupon = await grouponService.queryByOrderId(order.id);

      if (!think.isEmpty(groupon)) {
        const grouponRules = await grouponRulesService.findById(groupon.rulesId);

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
          // TODO: weixinService.fail
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

      // TODO: order.toString()
      await notifyService.notifyMail('新订单通知', order.toString());
      await notifyService.notifySmsTemplate(
        order.mobile,
        NOTIFY.TYPE.PAY_SUCCEED,
        order.orderSn.substring(8, 14)
      );

      await taskService.removeTask(`OrderUnpaidTask:${order.id}`);

      return weixinService.success('处理成功!');
    });
  }

  async refundAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const orderId = this.get('orderId');

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

    Object.assign(order, {
      orderStatus: ORDER.STATUS.REFUND,
    });

    if (!await orderService.updateWithOptimisticLocker(order)) {
      return this.updatedDateExpired();
    }

    // TODO
    // await notifyService.notifyMail('退款申请', order.toString());

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

    await orderService.deleteById(orderId);
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

  /**
   * https://github.com/Wechat-Group/WxJava/blob/cb34973efe26574da9027a8a39672fe8c38aea86/weixin-java-pay/src/main/java/com/github/binarywang/wxpay/bean/result/BaseWxPayResult.java#L126
   */
  fenToYuan(fen) {
    return (fen / 100.).toFixed(2);
  }
};
