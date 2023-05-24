const Base = require('./base.js');

module.exports = class WxCouponController extends Base {
  async listAction() {
    const page = this.get('page');
    const limit = this.get('limit');
    const sort = think.camelCase(this.get('sort'));
    const order = this.get('order');

    const couponService = this.service('coupon');

    const couponList = await couponService.queryList(page, limit, sort, order);

    return this.success({
      total: couponList.count,
      pages: couponList.totalPages,
      limit: couponList.pageSize,
      page: couponList.currentPage,
      list: couponList.data,
    });
  }

  async mylistAction() {
    const userId = this.getUserId();
    const status = this.get('status');
    const page = this.get('page');
    const limit = this.get('limit');
    const sort = think.camelCase(this.get('sort'));
    const order = this.get('order');

    const couponUserService = this.service('coupon_user');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const couponUserList = await couponUserService.queryList(
      userId,
      null,
      status,
      page,
      limit,
      sort,
      order
    );

    const couponVoList = await this.change(couponUserList.data);

    return this.success({
      total: couponUserList.count,
      pages: couponUserList.totalPages,
      limit: couponUserList.pageSize,
      page: couponUserList.currentPage,
      list: couponVoList,
    });
  }

  async selectlistAction() {
    const userId = this.getUserId();
    const cartId = this.get('cartId');
    const grouponRulesId = this.get('grouponRulesId');

    const cartService = this.service('cart');
    const couponService = this.service('coupon');
    const couponUserService = this.service('coupon_user');
    const grouponRulesService = this.service('groupon_rules');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
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
      const cart = await cartService.findById(cartId, userId);
      if (think.isEmpty(cart)) {
        return this.badArgumentValue();
      }
      checkedGoodsList = [cart];
    }

    let checkedGoodsPrice = 0.;

    for (const cart of checkedGoodsList) {
      if (!think.isEmpty(grouponRules) && grouponRules.goodsId == cart.goodsId) {
        checkedGoodsPrice += (cart.price - grouponPrice) * cart.number;
      } else {
        checkedGoodsPrice += cart.price * cart.number;
      }
    }

    const couponUserList = await couponUserService.queryAll(userId);
    const couponVoList = await this.change(couponUserList);

    for (const couponVo of couponVoList) {
      const coupon = await couponService.checkCoupon(
        userId,
        couponVo.cid,
        checkedGoodsPrice,
        checkedGoodsList
      );

      couponVo.available = !think.isEmpty(coupon);
    }

    return this.success({
      total: couponVoList.length,
      pages: 1,
      limit: 0,
      page: 1,
      list: couponVoList,
    });
  }

  async receiveAction() {
    return this.success('todo');
  }

  async exchangeAction() {
    return this.success('todo');
  }

  async change(couponList) {
    const couponService = this.service('coupon');

    return await Promise.all(
      couponList.map(async (couponUser) => {
        const coupon = await couponService.findById(couponUser.couponId);
        return {
          id: couponUser.id,
          cid: coupon.id,
          name: coupon.name,
          desc: coupon.desc,
          tag: coupon.tag,
          min: coupon.min,
          discount: coupon.discount,
          startTime: couponUser.startTime,
          endTime: couponUser.endTime,
        };
      })
    );
  }
};
