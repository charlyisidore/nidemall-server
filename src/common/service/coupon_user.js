const Base = require('./base.js');

module.exports = class CouponUserService extends Base {
  /**
   * .
   * @param {number} couponId .
   * @returns {Promise<number>}
   */
  async countCoupon(couponId) {
    return this.model('coupon_user')
      .where({
        couponId,
        deleted: false,
      })
      .count();
  }

  /**
   * .
   * @param {number} userId .
   * @param {number} couponId .
   * @returns {Promise<number>} The total number
   */
  async countUserAndCoupon(userId, couponId) {
    return this.model('coupon_user')
      .where({
        userId,
        couponId,
        deleted: false,
      })
      .count();
  }

  /**
   * .
   * @param {CouponUser} couponUser .
   * @returns {Promise<number>} The ID inserted
   */
  async add(couponUser) {
    const now = new Date();
    return this.model('coupon_user')
      .add(Object.assign(couponUser, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {number?} userId .
   * @param {number?} couponId .
   * @param {number?} status .
   * @param {number?} page .
   * @param {number?} limit .
   * @param {string?} sort .
   * @param {string?} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: CouponUser[]}>}
   */
  async queryList(userId, couponId, status, page, limit, sort, order) {
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

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    if (!think.isNullOrUndefined(page) && !think.isNullOrUndefined(limit)) {
      model.page(page, limit);
    }

    return model
      .where(where)
      .countSelect();
  }

  /**
   * .
   * @param {number} userId .
   * @param {number?} couponId .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: CouponUser[]}>}
   */
  async queryAll(userId, couponId) {
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
   * .
   * @param {number} userId .
   * @param {number} couponId .
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
   * .
   * @param {number} id .
   * @returns {Promise<CouponUser|Record<string, never>>}
   */
  async findById(id) {
    return this.model('coupon_user')
      .where({ id })
      .find();
  }

  /**
   * .
   * @param {CouponUser} couponUser .
   * @returns {Promise<number>} The number of rows affected
   */
  async update(couponUser) {
    const now = new Date();
    return this.model('coupon_user')
      .where({
        id: couponUser.id,
      })
      .update(Object.assign(couponUser, {
        updateTime: now,
      }));
  }

  async queryExpired() {
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
   * .
   * @param {number} orderId .
   * @returns {Promise<CouponUser[]>}
   */
  async findByOid(orderId) {
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
};
