const Base = require('./base.js');

module.exports = class WxGrouponController extends Base {
  async listAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {GrouponRulesService} */
    const grouponRulesService = this.service('groupon_rules');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const grouponRuleVoList = await grouponRulesService.wxQueryList(page, limit, sort, order);

    return this.successList(grouponRuleVoList);
  }

  async detailAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const grouponId = this.get('grouponId');

    /** @type {ExpressService} */
    const expressService = this.service('express');
    /** @type {GrouponService} */
    const grouponService = this.service('groupon');
    /** @type {GrouponRulesService} */
    const grouponRulesService = this.service('groupon_rules');
    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {OrderGoodsService} */
    const orderGoodsService = this.service('order_goods');
    /** @type {UserService} */
    const userService = this.service('user');

    const ORDER = orderService.getConstants();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const groupon = await grouponService.queryById(grouponId, userId);

    if (think.isEmpty(groupon)) {
      return this.badArgumentValue();
    }

    const grouponRules = await grouponRulesService.findById(groupon.rulesId);

    if (think.isEmpty(grouponRules)) {
      return this.badArgumentValue();
    }

    const order = await orderService.findById(groupon.orderId, userId);

    if (think.isEmpty(order)) {
      return this.fail(ORDER.RESPONSE.UNKNOWN, '订单不存在');
    }

    if (order.userId != userId) {
      return this.fail(ORDER.RESPONSE.INVALID, '不是当前用户的订单');
    }

    const orderVo = {
      id: order.id,
      orderSn: order.orderSn,
      addTime: order.addTime,
      consignee: order.consignee,
      mobile: order.mobile,
      address: order.address,
      goodsPrice: order.goodsPrice,
      freightPrice: order.freightPrice,
      actualPrice: order.actualPrice,
      orderStatusText: orderService.orderStatusText(order),
      handleOption: orderService.build(order),
      expCode: order.shipChannel,
      expNo: order.shipSn,
    };

    const orderGoodsVoList = (await orderGoodsService.queryByOid(order.id))
      .map((orderGoods) => ({
        id: orderGoods.id,
        orderId: orderGoods.orderId,
        goodsId: orderGoods.goodsId,
        goodsName: orderGoods.goodsName,
        number: orderGoods.number,
        retailPrice: orderGoods.price,
        picUrl: orderGoods.picUrl,
        goodsSpecificationValues: orderGoods.specifications,
      }));

    const result = {};

    if (ORDER.STATUS.SHIP == order.orderStatus) {
      const expressInfo = await expressService.getExpressInfo(order.shipChannel, order.shipSn);

      Object.assign(result, {
        expressInfo,
      });
    }

    const creator = await userService.findUserVoById(groupon.creatorUserId);

    const joiners = [creator];

    const linkGrouponId = groupon.grouponId ?
      groupon.grouponId :
      groupon.id;

    const groupons = await grouponService.queryJoinRecord(linkGrouponId);

    for (const grouponItem of groupons) {
      joiners.push(await userService.findUserVoById(grouponItem.userId));
    }

    Object.assign(result, {
      orderInfo: orderVo,
      orderGoods: orderGoodsVoList,
      linkGrouponId,
      creator,
      joiners,
      groupon,
      rules,
    });

    return this.success(result);
  }

  async joinAction() {
    return this.success('todo');
  }

  async myAction() {
    return this.success('todo');
  }
};
