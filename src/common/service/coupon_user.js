module.exports = class extends think.Service {
  static STATUS = {
    USABLE: 0,
    USED: 1,
    EXPIRED: 2,
    OUT: 3,
  };

  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} couponId 
   */
  countUserAndCoupon(userId, couponId) {
    return this.model('coupon_user')
      .where({
        userId,
        couponId,
        deleted: false,
      })
      .count();
  }

  /**
   * 
   * @param {object} couponUser 
   */
  add(couponUser) {
    const now = new Date();
    return this.model('coupon_user')
      .add(Object.assign(couponUser, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number?} userId 
   * @param {number?} couponId 
   * @param {number?} status 
   * @param {number?} page 
   * @param {number?} limit 
   * @param {string?} sort 
   * @param {string?} order 
   * @returns 
   */
  queryList(userId, couponId, status, page, limit, sort, order) {
    const model = this.model('coupon_user');

    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, { userId });
    }

    if (!think.isNullOrUndefined(couponId)) {
      Object.assign(where, { couponId });
    }

    if (!think.isNullOrUndefined(status)) {
      Object.assign(where, { status });
    }

    model.where(where);

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    if (!think.isNullOrUndefined(page) && !think.isNullOrUndefined(limit)) {
      model.page(page, limit);
    }

    return model.select();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number?} couponId 
   */
  queryAll(userId, couponId) {
    return this.queryList(
      userId,
      couponId,
      this.constructor.STATUS.USABLE,
      null,
      null,
      'addTime',
      'DESC'
    );
  }
}