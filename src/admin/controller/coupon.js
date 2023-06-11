const Base = require('./base.js');

module.exports = class AdminCouponController extends Base {
  async listAction() {
    /** @type {string?} */
    const name = this.get('name');
    /** @type {number?} */
    const type = this.get('type');
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

    /** @type {CouponService} */
    const couponService = this.service('coupon');

    const couponList = await couponService.querySelective(name, type, status, page, limit, sort, order);

    return this.successList(couponList);
  }

  async listuserAction() {
    /** @type {number?} */
    const userId = this.get('userId');
    /** @type {number?} */
    const couponId = this.get('couponId');
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

    const couponUserList = await couponUserService.queryList(userId, couponId, status, page, limit, sort, order);

    return this.successList(couponUserList);
  }

  async createAction() {
    const coupon = this.post([
      'name',
      'desc',
      'tag',
      'min',
      'discount',
      'limit',
      'type',
      'total',
      'timeType',
      'days',
      'startTime',
      'endTime',
      'goodsType',
      'goodsValue',
    ].join(','));

    /** @type {CouponService} */
    const couponService = this.service('coupon');

    const { TYPE } = couponService.getConstants();

    if (TYPE.CODE == coupon.type) {
      Object.assign(coupon, {
        code: couponService.generateCode(),
      });
    }

    coupon.id = await couponService.add(coupon);

    return this.success(coupon);
  }

  async readAction() {
    /** @type {number} */
    const id = this.post('id');
    /** @type {CouponService} */
    const couponService = this.service('coupon');

    const coupon = await couponService.findById(id);

    return this.success(coupon);
  }

  async updateAction() {
    const coupon = this.post([
      'id',
      'name',
      'desc',
      'tag',
      'min',
      'discount',
      'limit',
      'type',
      'total',
      'timeType',
      'days',
      'startTime',
      'endTime',
      'goodsType',
      'goodsValue',
    ].join(','));

    /** @type {CouponService} */
    const couponService = this.service('coupon');

    if (!await couponService.updateById(coupon)) {
      return this.updatedDataFailed();
    }

    return this.success(coupon);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');
    /** @type {CouponService} */
    const couponService = this.service('coupon');

    await couponService.deleteById(id);

    return this.success();
  }
};
