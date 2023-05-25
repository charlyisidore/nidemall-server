const Base = require('./base.js');

module.exports = class WxCouponController extends Base {
  static COUPON = {
    EXCEED_LIMIT: 740,
    RECEIVE_FAIL: 741,
    CODE_INVALID: 742,
  };

  async listAction() {
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {CouponService} */
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

    /** @type {CouponUserService} */
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
    /** @type {number?} */
    const cartId = this.get('cartId');
    /** @type {number?} */
    const grouponRulesId = this.get('grouponRulesId');

    /** @type {CartService} */
    const cartService = this.service('cart');
    /** @type {CouponService} */
    const couponService = this.service('coupon');
    /** @type {CouponUserService} */
    const couponUserService = this.service('coupon_user');
    /** @type {GrouponRulesService} */
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
    const userId = this.getUserId();
    /** @type {number} */
    const couponId = this.post('couponId');

    /** @type {CouponService} */
    const couponService = this.service('coupon');
    /** @type {CouponUserService} */
    const couponUserService = this.service('coupon_user');

    const { STATUS, TIME_TYPE, TYPE } = couponService.constructor;
    const { COUPON } = this.constructor;

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const coupon = await couponService.findById(couponId);
    if (think.isEmpty(coupon)) {
      return this.badArgumentValue();
    }

    const totalCoupons = await couponUserService.countCoupon(couponId);
    if (0 != coupon.total && totalCoupons >= coupon.total) {
      return this.fail(COUPON.EXCEED_LIMIT, '优惠券已领完');
    }

    const userCoupons = await couponUserService.countUserAndCoupon(userId, couponId);
    if (0 != coupon.limit && userCoupons >= coupon.limit) {
      return this.fail(COUPON.EXCEED_LIMIT, '优惠券已经领取过');
    }

    if (TYPE.REGISTER == coupon.type) {
      return this.fail(COUPON.RECEIVE_FAIL, '新用户优惠券自动发送');
    } else if (TYPE.CODE == coupon.type) {
      return this.fail(COUPON.RECEIVE_FAIL, '优惠券只能兑换');
    } else if (TYPE.COMMON != coupon.type) {
      return this.fail(COUPON.RECEIVE_FAIL, '优惠券类型不支持');
    }

    switch (coupon.status) {
      case STATUS.OUT:
        return this.fail(COUPON.EXCEED_LIMIT, '优惠券已领完');
      case STATUS.EXPIRED:
        return this.fail(COUPON.RECEIVE_FAIL, '优惠券已经过期');
    }

    const couponUser = {
      couponId,
      userId,
    };

    if (TIME_TYPE.TIME == coupon.timeType) {
      Object.assign(couponUser, {
        startTime: coupon.startTime,
        endTime: coupon.endTime,
      });
    } else {
      const startTime = new Date();
      const endTime = (new Date(startTime)).setDate(startTime.getDate() + coupon.days);

      Object.assign(couponUser, {
        startTime,
        endTime,
      });
    }

    await couponUserService.add(couponUser);

    return this.success();
  }

  async exchangeAction() {
    const userId = this.getUserId();
    /** @type {string} */
    const code = this.post('code');

    /** @type {CouponService} */
    const couponService = this.service('coupon');
    /** @type {CouponUserService} */
    const couponUserService = this.service('coupon_user');

    const { COUPON } = this.constructor;

    const coupon = await couponService.findByCode(code);
    if (think.isEmpty(coupon)) {
      return this.fail(COUPON.CODE_INVALID, '优惠券不正确');
    }

    const totalCoupons = await couponUserService.countCoupon(coupon.id);
    if (0 != coupon.total && totalCoupons >= coupon.total) {
      return this.fail(COUPON.EXCEED_LIMIT, '优惠券已兑换');
    }

    const userCoupons = await couponUserService.countUserAndCoupon(userId, coupon.id);
    if (0 != coupon.limit && userCoupons >= coupon.limit) {
      return this.fail(COUPON.EXCEED_LIMIT, '优惠券已兑换');
    }

    if (TYPE.REGISTER == coupon.type) {
      return this.fail(COUPON.RECEIVE_FAIL, '新用户优惠券自动发送');
    } else if (TYPE.COMMON == coupon.type) {
      return this.fail(COUPON.RECEIVE_FAIL, '优惠券只能领取，不能兑换');
    } else if (TYPE.CODE != coupon.type) {
      return this.fail(COUPON.RECEIVE_FAIL, '优惠券类型不支持');
    }

    switch (coupon.status) {
      case STATUS.OUT:
        return this.fail(COUPON.EXCEED_LIMIT, '优惠券已兑换');
      case STATUS.EXPIRED:
        return this.fail(COUPON.RECEIVE_FAIL, '优惠券已经过期');
    }

    const couponUser = {
      couponId: coupon.id,
      userId,
    };

    if (TIME_TYPE.TIME == coupon.timeType) {
      Object.assign(couponUser, {
        startTime: coupon.startTime,
        endTime: coupon.endTime,
      });
    } else {
      const startTime = new Date();
      const endTime = (new Date(startTime)).setDate(startTime.getDate() + coupon.days);

      Object.assign(couponUser, {
        startTime,
        endTime,
      });
    }

    await couponUserService.add(couponUser);

    return this.success();
  }

  async change(couponList) {
    /** @type {CouponService} */
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
