module.exports = class CouponUserService extends think.Service {
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
   * @returns {Promise<number>} The total number
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
   * @param {CouponUser} couponUser 
   * @returns {Promise<number>} The ID inserted
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
   * @returns {Promise<CouponUser[]>} 
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

  /**
   * 
   * @param {number} id 
   * @returns {Promise<CouponUser|Record<string, never>>}
   */
  findById(id) {
    return this.model('coupon_user')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {CouponUser} couponUser 
   * @returns {Promise<number>} The number of rows affected
   */
  update(couponUser) {
    const now = new Date();
    return this.model('coupon_user')
      .where({
        id: couponUser.id,
      })
      .update(Object.assign(couponUser, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} orderId 
   * @returns {Promise<Order[]>}
   */
  findByOid(orderId) {
    return this.model('coupon_user')
      .where({
        orderId,
        deleted: false,
      })
      .select();
  }
}