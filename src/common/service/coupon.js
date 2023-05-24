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

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
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
      .select();
  }

  /**
   * 
   * @param {number} id 
   */
  findById(id) {
    return this.model('coupon')
      .where({ id })
      .find();
  }

  /**
   * 
   */
  queryRegister() {
    return this.model('coupon')
      .where({
        type: this.constructor.TYPE.REGISTER,
        status: this.constructor.STATUS.NORMAL,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} userId 
   */
  async assignForRegister(userId) {
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

        if (this.constructor.TIME_TYPE.TIME == coupon.timeType) {
          Object.assign(couponUser, {
            startTime: coupon.startTime,
            endTime: coupon.endTime,
          });
        } else {
          const startTime = new Date();
          const endTime = (new Date(startTime)).setDate(startTime.getDate() + days);

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
    const couponUserService = think.service('coupon_user');
    const goodsService = think.service('goods');

    const coupon = await this.findById(couponId);
    if (!coupon || coupon.deleted) {
      return null;
    }

    let couponUser = await couponUserService.findById(userCouponId);
    if (!couponUser) {
      couponUser = await couponUserService.queryOne(userId, couponId);
    } else if (couponId != couponUser.couponId) {
      return null;
    }

    if (!couponUser) {
      return null;
    }

    const timeType = coupon.timeType;
    const days = coupon.days;
    const now = new Date();

    if (this.constructor.TIME_TYPE.TIME == timeType) {
      if (now < coupon.startTime || now > coupon.endTime) {
        return null;
      }
    } else if (this.constructor.TIME_TYPE.DAYS == timeType) {
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

    if ([
      this.constructor.GOODS_TYPE.CATEGORY,
      this.constructor.GOODS_TYPE.ARRAY,
    ].includes(goodsType)) {
      for (const cart of cartList) {
        const key = (this.constructor.GOODS_TYPE.ARRAY == goodsType) ?
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

    if (this.constructor.STATUS.NORMAL != coupon.status) {
      return null;
    }

    if (checkedGoodsPrice < coupon.min) {
      return null;
    }

    return coupon;
  }
}