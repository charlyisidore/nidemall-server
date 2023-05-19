module.exports = class extends think.Service {
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
}