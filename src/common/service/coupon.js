module.exports = class CouponService extends think.Service {
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
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Coupon[]}>}
   */
  queryList(page, limit, sort, order) {
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
      model.order({ [sort]: order })
    }

    return model.countSelect();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Coupon[]}>}
   */
  async queryAvailableList(userId, page, limit) {
    const { TYPE, STATUS } = this.getConstants();
    const model = this.model('coupon');

    const used = await this.model('coupon_user')
      .where({
        userId,
      });

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
   * 
   * @param {number} id 
   * @returns {Promise<Coupon|Record<string, never>>} 
   */
  findById(id) {
    return this.model('coupon')
      .where({ id })
      .find();
  }

  /**
   * 
   * @returns {Promise<Coupon[]>} 
   */
  queryRegister() {
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
   * 
   * @param {number} userId 
   */
  async assignForRegister(userId) {
    const { TIME_TYPE } = this.getConstants();
    const couponList = await this.queryRegister();

    for (const coupon of couponList) {
      const count = await couponUserService.countUserAndCoupon(userId, coupon.id);

      if (count > 0) {
        continue;
      }

      for (let limit = coupon.limit; limit > 0; --limit) {
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
      }
    }
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} couponId 
   * @param {number} userCouponId 
   * @param {number} checkedGoodsPrice 
   * @param {object[]} cartList 
   */
  async checkCoupon(userId, couponId, userCouponId, checkedGoodsPrice, cartList) {
    /** @type {CouponUserService} */
    const couponUserService = think.service('coupon_user');
    /** @type {GoodsService} */
    const goodsService = think.service('goods');

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

    const timeType = coupon.timeType;
    const days = coupon.days;
    const now = new Date();

    if (TIME_TYPE.TIME == timeType) {
      if (now < coupon.startTime || now > coupon.endTime) {
        return null;
      }
    } else if (TIME_TYPE.DAYS == timeType) {
      const addTime = couponUser.addTime;
      const expired = (new Date(addTime)).setDate(addTime.getDate() + days);

      if (now > expired) {
        return null;
      }
    } else {
      return null;
    }

    const cartMap = {};
    let goodsValueList = [...coupon.goodsValue];
    const goodsType = coupon.goodsType;

    if ([GOODS_TYPE.CATEGORY, GOODS_TYPE.ARRAY].includes(goodsType)) {
      for (const cart of cartList) {
        const key = (GOODS_TYPE.ARRAY == goodsType) ?
          cart.goodsId :
          (await goodsService.findById(cart.goodsId)).categoryId;

        const carts = (key in cartMap) ? cartMap[key] : [];
        carts.push(cart);
        cartMap[key] = carts;
      }

      goodsValueList = goodsValueList
        .filter((id) => Object.keys(cartMap).includes(id));

      let total = 0.;

      for (const goodsId of goodsValueList) {
        const carts = cartMap[goodsId];

        for (const cart of carts) {
          total += cart.price * cart.number;
        }
      }

      if (total < coupon.min) {
        return null;
      }
    }

    if (STATUS.NORMAL != coupon.status) {
      return null;
    }

    if (checkedGoodsPrice < coupon.min) {
      return null;
    }

    return coupon;
  }

  getConstants() {
    return {
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
}