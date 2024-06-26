const Base = require('./base.js');

module.exports = class CouponService extends Base {
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

  /**
   * .
   * @param {number} page .
   * @param {number} limit .
   * @param {string?} sort .
   * @param {string?} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Coupon[]}>}
   */
  async queryList(page, limit, sort, order) {
    const { TYPE, STATUS } = this.getConstants();
    const model = this.model('coupon')
      .field(this.constructor.FIELDS)
      .where({
        type: TYPE.COMMON,
        status: STATUS.NORMAL,
        deleted: false,
      })
      .page(page, limit);

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model.countSelect();
  }

  /**
   * .
   * @param {number} userId .
   * @param {number} page .
   * @param {number} limit .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Coupon[]}>}
   */
  async queryAvailableList(userId, page, limit) {
    const { TYPE, STATUS } = this.getConstants();
    const model = this.model('coupon');

    const used = await this.model('coupon_user')
      .where({ userId })
      .select();

    const where = {
      type: TYPE.COMMON,
      status: STATUS.NORMAL,
      deleted: false,
    };

    if (!think.isEmpty(used)) {
      Object.assign(where, {
        id: ['NOTIN', used.map((v) => v.couponId)],
      });
    }

    return model
      .field(this.constructor.FIELDS)
      .where(where)
      .order({ addTime: 'DESC' })
      .page(page, limit)
      .countSelect();
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<Coupon|Record<string, never>>} .
   */
  async findById(id) {
    return this.model('coupon')
      .where({ id })
      .find();
  }

  /**
   * .
   * @param {string} code .
   * @returns {Promise<Coupon|null>}
   */
  async findByCode(code) {
    const { TYPE, STATUS } = this.getConstants();
    const couponList = await this.model('coupon')
      .where({
        code,
        type: TYPE.CODE,
        status: STATUS.NORMAL,
        deleted: false,
      })
      .select();

    if (couponList.length > 1) {
      throw new Error('');
    }

    return couponList.length > 0 ? couponList[0] : null;
  }

  /**
   * .
   * @returns {Promise<Coupon[]>} .
   */
  async queryRegister() {
    const { TYPE, STATUS } = this.getConstants();
    return this.model('coupon')
      .where({
        type: TYPE.REGISTER,
        status: STATUS.NORMAL,
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {string?} name .
   * @param {number?} type .
   * @param {number?} status .
   * @param {number} page .
   * @param {number} limit .
   * @param {string} sort .
   * @param {string} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Coupon[]}>}
   */
  async querySelective(name, type, status, page, limit, sort, order) {
    const model = this.model('coupon');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(name)) {
      Object.assign(where, {
        name: ['LIKE', `%${name}%`],
      });
    }

    if (!think.isNullOrUndefined(type)) {
      Object.assign(where, { type });
    }

    if (!think.isNullOrUndefined(status)) {
      Object.assign(where, { status });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * .
   * @param {Coupon} coupon .
   * @returns {Promise<number>} The ID inserted
   */
  async add(coupon) {
    const now = new Date();
    return this.model('coupon')
      .add(Object.assign(coupon, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {Coupon} coupon .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(coupon) {
    const now = new Date();
    return this.model('coupon')
      .where({
        id: coupon.id,
      })
      .update(Object.assign(coupon, {
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('coupon')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  getRandomString(n) {
    return Array.from(
      Array(n),
      () => Math.floor(Math.random() * 36).toString(36)
    ).join('');
  }

  /**
   * .
   * @returns {string}
   */
  generateCode() {
    return this.getRandomString(8);
  }

  /**
   * .
   * @returns {Promise<Coupon[]>}
   */
  async queryExpired() {
    const { STATUS, TIME_TYPE } = this.getConstants();
    const now = new Date();
    return this.model('coupon')
      .where({
        status: STATUS.NORMAL,
        timeType: TIME_TYPE.TIME,
        endTime: ['<', think.datetime(now)],
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {number} userId .
   */
  async assignForRegister(userId) {
    /** @type {CouponUserService} */
    const couponUserService = think.service('coupon_user');

    const { TIME_TYPE } = this.getConstants();
    const couponList = await this.queryRegister();

    for (const coupon of couponList) {
      const count = await couponUserService.countUserAndCoupon(userId, coupon.id);

      if (count > 0) {
        continue;
      }

      for (let limit = coupon.limit; limit > 0; --limit) {
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
      }
    }
  }

  /**
   * .
   * @param {number} userId .
   * @param {number} couponId .
   * @param {number} userCouponId .
   * @param {number} checkedGoodsPrice .
   * @param {object[]} cartList .
   */
  async checkCoupon(userId, couponId, userCouponId, checkedGoodsPrice, cartList) {
    /** @type {CouponUserService} */
    const couponUserService = think.service('coupon_user');
    /** @type {GoodsService} */
    const goodsService = think.service('goods');
    /** @type {MathService} */
    const mathService = think.service('math');

    const { GOODS_TYPE, TIME_TYPE, STATUS } = this.getConstants();

    const coupon = await this.findById(couponId);
    if (think.isEmpty(coupon) || coupon.deleted) {
      return null;
    }

    let couponUser = await couponUserService.findById(userCouponId);
    if (think.isEmpty(couponUser)) {
      couponUser = await couponUserService.queryOne(userId, couponId);
    } else if (couponId != couponUser.couponId) {
      return null;
    }

    if (think.isEmpty(couponUser)) {
      return null;
    }

    // 检查是否超期
    const timeType = coupon.timeType;
    const days = coupon.days;
    const now = new Date();

    if (TIME_TYPE.TIME == timeType) {
      if (now < coupon.startTime || now > coupon.endTime) {
        return null;
      }
    } else if (TIME_TYPE.DAYS == timeType) {
      const addTime = new Date(couponUser.addTime);
      const expired = (new Date(addTime)).setDate(addTime.getDate() + days);

      if (now > expired) {
        return null;
      }
    } else {
      return null;
    }

    // 检测商品是否符合
    const cartMap = {};

    // 可使用优惠券的商品或分类
    let goodsValueList = [...coupon.goodsValue];
    const goodsType = coupon.goodsType;

    if ([GOODS_TYPE.CATEGORY, GOODS_TYPE.ARRAY].includes(goodsType)) {
      for (const cart of cartList) {
        const key = (GOODS_TYPE.ARRAY == goodsType)
          ? cart.goodsId
          : (await goodsService.findById(cart.goodsId)).categoryId;

        const carts = (key in cartMap) ? cartMap[key] : [];
        carts.push(cart);
        cartMap[key] = carts;
      }

      // 购物车中可以使用优惠券的商品或分类
      goodsValueList = goodsValueList
        .filter((id) => Object.keys(cartMap).includes(id));

      // 可使用优惠券的商品的总价格
      let total = 0.0;

      for (const goodsId of goodsValueList) {
        const carts = cartMap[goodsId];

        for (const cart of carts) {
          total += cart.price * cart.number;
        }
      }

      // 是否达到优惠券满减金额
      if (mathService.isFloatLessThan(total, coupon.min)) {
        return null;
      }
    }

    // 检测订单状态
    if (STATUS.NORMAL != coupon.status) {
      return null;
    }

    // 检测是否满足最低消费
    if (mathService.isFloatLessThan(checkedGoodsPrice, coupon.min)) {
      return null;
    }

    return coupon;
  }

  async checkCouponExpired() {
    think.logger.info('系统开启任务检查优惠券是否已经过期');

    /** @type {CouponUserService} */
    const couponUserService = think.service('coupon_user');

    const COUPON = this.getConstants();
    const COUPON_USER = this.getConstants();

    const couponList = await this.queryExpired();

    await Promise.all(
      couponList.map(async (coupon) => {
        Object.assign(coupon, {
          status: COUPON.STATUS.EXPIRED,
        });
        await this.updateById(coupon);
      })
    );

    const couponUserList = await couponUserService.queryExpired();

    await Promise.all(
      couponUserList.map(async (couponUser) => {
        Object.assign(couponUser, {
          status: COUPON_USER.STATUS.EXPIRED,
        });
        await couponUserService.update(couponUser);
      })
    );

    think.logger.info('系统结束任务检查优惠券是否已经过期');
  }

  getConstants() {
    return {
      RESPONSE: {
        EXCEED_LIMIT: 740,
        RECEIVE_FAIL: 741,
        CODE_INVALID: 742,
      },
      TYPE: {
        COMMON: 0,
        REGISTER: 1,
        CODE: 2,
      },
      GOODS_TYPE: {
        ALL: 0,
        CATEGORY: 1,
        ARRAY: 2,
      },
      STATUS: {
        NORMAL: 0,
        EXPIRED: 1,
        OUT: 2,
      },
      TIME_TYPE: {
        DAYS: 0,
        TIME: 1,
      },
    };
  }
};
