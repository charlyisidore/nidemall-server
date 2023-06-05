module.exports = class CouponUserService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} couponId 
   * @returns {Promise<number>}
   */
  countCoupon(couponId) {
    return this.model('coupon_user')
      .where({
        couponId,
        deleted: false,
      })
      .count();
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
   * @returns {Promise<CouponUser[]>} 
   */
  queryAll(userId, couponId) {
    const { STATUS } = this.getConstants();
    return this.queryList(
      userId,
      couponId,
      STATUS.USABLE,
      null,
      null,
      'addTime',
      'DESC'
    );
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} couponId 
   * @returns {Promise<CouponUser|null>}
   */
  async queryOne(userId, couponId) {
    const { STATUS } = this.getConstants();
    const couponUserList = await this.queryList(
      userId,
      couponId,
      STATUS.USABLE,
      1,
      1,
      'addTime',
      'DESC'
    );
    return couponUserList.length > 0 ? couponUserList[0] : null;
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

  queryExpired() {
    const { STATUS } = this.getConstants();
    const now = new Date();
    return this.model('coupon_user')
      .where({
        status: STATUS.USABLE,
        endTime: ['<', think.datetime(now)],
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} orderId 
   * @returns {Promise<CouponUser[]>}
   */
  findByOid(orderId) {
    return this.model('coupon_user')
      .where({
        orderId,
        deleted: false,
      })
      .select();
  }

  getConstants() {
    return {
      STATUS: {
        USABLE: 0,
        USED: 1,
        EXPIRED: 2,
        OUT: 3,
      },
    };
  }
}