module.exports = class extends think.Service {
  static TYPE = {
    COMMON: 0,
    REGISTER: 1,
    CODE: 2,
  };

  static GOODS_TYPE = {
    ALL: 0,
    CATEGORY: 1,
    ARRAY: 2,
  };

  static STATUS = {
    NORMAL: 0,
    EXPIRED: 1,
    OUT: 2,
  };

  static TIME_TYPE = {
    DAYS: 0,
    TIME: 1,
  };

  static FIELDS = [
    'id',
    'name',
    'desc',
    'tag',
    'days',
    'startTime',
    'endTime',
    'discount',
    'min',
  ].join(',');

  constructor() {
    super();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   */
  queryList(page, limit, sort, order) {
    const model = this.model('coupon')
      .field(this.constructor.FIELDS)
      .where({
        type: this.constructor.TYPE.COMMON,
        status: this.constructor.STATUS.NORMAL,
        deleted: false,
      })
      .page(page, limit);

    if (undefined !== sort && undefined !== order) {
      model.order({ [sort]: order })
    }

    return model.select();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} page 
   * @param {number} limit 
   */
  async queryAvailableList(userId, page, limit) {
    const model = this.model('coupon');

    const used = await this.model('coupon_user')
      .where({
        userId,
      });

    const where = {
      type: this.constructor.TYPE.COMMON,
      status: this.constructor.STATUS.NORMAL,
      deleted: false,
    };

    if (used && used.length > 0) {
      Object.assign(where, {
        id: ['NOTIN', used.map((v) => v.couponId)],
      });
    }

    return model
      .field(this.constructor.FIELDS)
      .where(where)
      .order({ 'addTime': 'DESC' })
      .page(page, limit)
      .select();
  }
}