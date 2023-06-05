const Base = require('./base.js');

module.exports = class WxCartController extends Base {
  indexAction() {
    return this.index(this.getUserId());
  }

  async addAction() {
    const userId = this.getUserId();
    /** @type {{ goodsId: number, productId: number, number: number }} */
    const cart = this.post([
      'goodsId',
      'productId',
      'number',
    ].join(','));

    /** @type {CartService} */
    const cartService = this.service('cart');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {GoodsProductService} */
    const goodsProductService = this.service('goods_product');

    const GOODS = goodsService.getConstants();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const { goodsId, productId, number } = cart;

    if (number <= 0) {
      return this.badArgument();
    }

    const goods = await goodsService.findById(goodsId);

    if (think.isEmpty(goods) || !goods.isOnSale) {
      return this.fail(GOODS.RESPONSE.UNSHELVE, '商品已下架')
    }

    const product = await goodsProductService.findById(productId);
    const existCart = await cartService.queryExist(goodsId, productId, userId);

    if (think.isEmpty(existCart)) {
      if (think.isEmpty(product) || number > product.number) {
        return this.fail(GOODS.RESPONSE.NO_STOCK, '库存不足');
      }

      Object.assign(cart, {
        id: null,
        goodsSn: goods.goodsSn,
        goodsName: goods.name,
        picUrl: think.isTrueEmpty(product.url) ? goods.picUrl : product.url,
        price: product.price,
        specifications: product.specifications,
        userId,
        checked: true,
      });

      await cartService.add(cart);
    } else {
      const num = existCart.number + number;
      if (num > product.number) {
        return this.fail(GOODS.RESPONSE.NO_STOCK, '库存不足');
      }

      existCart.number = num;
      if (!await cartService.updateById(existCart)) {
        return this.updatedDataFailed();
      }
    }

    return this.goodsCount(userId);
  }

  async fastaddAction() {
    const userId = this.getUserId();
    /** @type {{ goodsId: number, productId: number, number: number }} */
    const cart = this.post([
      'goodsId',
      'productId',
      'number',
    ].join(','));

    /** @type {CartService} */
    const cartService = this.service('cart');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {GoodsProductService} */
    const goodsProductService = this.service('goods_product');

    const GOODS = goodsService.getConstants();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const { goodsId, productId, number } = cart;

    if (number <= 0) {
      return this.badArgument();
    }

    const goods = await goodsService.findById(goodsId);

    if (think.isEmpty(goods) || !goods.isOnSale) {
      return this.fail(GOODS.RESPONSE.UNSHELVE, '商品已下架')
    }

    const product = await goodsProductService.findById(productId);
    const existCart = await cartService.queryExist(goodsId, productId, userId);

    if (think.isEmpty(existCart)) {
      if (think.isEmpty(product) || number > product.number) {
        return this.fail(GOODS.RESPONSE.NO_STOCK, '库存不足');
      }

      Object.assign(cart, {
        id: null,
        goodsSn: goods.goodsSn,
        goodsName: goods.name,
        picUrl: think.isTrueEmpty(product.url) ? product.url : goods.picUrl,
        price: product.price,
        specifications: product.specifications,
        userId,
        checked: true,
      });

      cart.id = await cartService.add(cart);
    } else {
      if (number > product.number) {
        return this.fail(GOODS.RESPONSE.NO_STOCK, '库存不足');
      }

      existCart.number = number;

      if (!await cartService.updateById(existCart)) {
        return this.updatedDataFailed();
      }
    }

    return this.success(
      think.isEmpty(existCart) ?
        cart.id :
        existCart.id
    );
  }

  async updateAction() {
    const userId = this.getUserId();
    /** @type {{ id: number, goodsId: number, productId: number, number: number }} */
    const cart = this.post([
      'id',
      'goodsId',
      'productId',
      'number',
    ].join(','));

    /** @type {CartService} */
    const cartService = this.service('cart');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {GoodsProductService} */
    const goodsProductService = this.service('goods_product');

    const GOODS = goodsService.getConstants();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const { id, goodsId, productId, number } = cart;

    if (number <= 0) {
      return this.badArgument();
    }

    const existCart = await cartService.findById(id, userId);

    if (think.isEmpty(existCart) || existCart.goodsId != goodsId || existCart.productId != productId) {
      return this.badArgumentValue();
    }

    const goods = await goodsService.findById(goodsId);
    if (think.isEmpty(goods) || !goods.isOnSale) {
      return this.fail(GOODS.RESPONSE.UNSHELVE, '商品已下架');
    }

    const product = await goodsProductService.findById(productId);
    if (think.isEmpty(product) || product.number < number) {
      return this.fail(GOODS.RESPONSE.UNSHELVE, '库存不足');
    }

    Object.assign(existCart, {
      number,
    });

    if (!await cartService.updateById(existCart)) {
      return this.updatedDataFailed();
    }

    return this.success();
  }

  async checkedAction() {
    const userId = this.getUserId();
    /** @type {number[]} */
    const productIds = this.post('productIds');
    /** @type {boolean} */
    const isChecked = this.post('isChecked');

    /** @type {CartService} */
    const cartService = this.service('cart');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    if (think.isEmpty(productIds)) {
      return this.badArgument();
    }

    await cartService.updateCheck(userId, productIds, isChecked);

    return this.index(userId);
  }

  async deleteAction() {
    const userId = this.getUserId();
    /** @type {number[]} */
    const productIds = this.post('productIds');

    /** @type {CartService} */
    const cartService = this.service('cart');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    if (think.isEmpty(productIds)) {
      return this.badArgument();
    }

    await cartService.delete(productIds, userId);

    return this.index(userId);
  }

  goodscountAction() {
    return this.goodsCount(this.getUserId());
  }

  async checkoutAction() {
    const userId = this.getUserId();
    /** @type {number?} */
    const cartId = this.get('cartId');
    /** @type {number?} */
    let addressId = this.get('addressId');
    /** @type {number?} */
    let couponId = this.get('couponId');
    /** @type {number?} */
    let userCouponId = this.get('userCouponId');
    /** @type {number?} */
    const grouponRulesId = this.get('grouponRulesId');

    /** @type {AddressService} */
    const addressService = this.service('address');
    /** @type {CartService} */
    const cartService = this.service('cart');
    /** @type {CouponService} */
    const couponService = this.service('coupon');
    /** @type {CouponUserService} */
    const couponUserService = this.service('coupon_user');
    /** @type {GrouponRulesService} */
    const grouponRulesService = this.service('groupon_rules');
    /** @type {SystemService} */
    const systemService = this.service('system');

    const freight = await systemService.getFreight();
    const freightLimit = await systemService.getFreightLimit();

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    let checkedAddress = null;

    if (addressId) {
      checkedAddress = await addressService.query(addressId, userId);
    }

    if (think.isEmpty(checkedAddress)) {
      checkedAddress = await addressService.findDefault(userId);
      if (think.isEmpty(checkedAddress)) {
        checkedAddress = { id: 0 };
      }
      addressId = checkedAddress.id;
    }

    let grouponPrice = 0.;
    const grouponRules = await grouponRulesService.findById(grouponRulesId);

    if (!think.isEmpty(grouponRules)) {
      grouponPrice = grouponRules.discount;
    }

    let checkedGoodsList = null;
    if (!cartId) {
      checkedGoodsList = await cartService.queryByUidAndChecked(userId);
    } else {
      const cart = await cartService.findById(cartId, userId);
      if (think.isEmpty(cart)) {
        return this.badArgumentValue();
      }
      checkedGoodsList = [cart];
    }

    let checkedGoodsPrice = 0.;
    for (const cart of checkedGoodsList) {
      if (!think.isEmpty(grouponRules) && grouponRules.goodsId == cart.goodsId) {
        checkedGoodsPrice += (cart.price - grouponPrice) * cart.number;
      } else {
        checkedGoodsPrice += cart.price * cart.number;
      }
    }

    let tmpCouponPrice = 0.;
    let tmpCouponId = 0;
    let tmpUserCouponId = 0;
    let tmpCouponLength = 0;
    const couponUserList = await couponUserService.queryAll(userId);

    for (const couponUser of couponUserList) {
      const coupon = await couponService.checkCoupon(
        userId,
        couponUser.couponId,
        couponUser.id,
        checkedGoodsPrice,
        checkedGoodsList
      );

      if (think.isEmpty(coupon)) {
        continue;
      }

      tmpCouponLength++;

      if (tmpCouponPrice < coupon.discount) {
        tmpCouponPrice = coupon.discount;
        tmpCouponId = coupon.id;
        tmpUserCouponId = couponUser.id;
      }
    }

    let availableCouponLength = tmpCouponLength;
    let couponPrice = 0.;

    if (think.isNullOrUndefined(couponId) || -1 === couponId) {
      couponId = -1;
      userCouponId = -1;
    } else if (0 === couponId) {
      couponPrice = tmpCouponPrice;
      couponId = tmpCouponId;
      userCouponId = tmpUserCouponId;
    } else {
      const coupon = await couponService.checkCoupon(
        userId,
        couponId,
        userCouponId,
        checkedGoodsPrice,
        checkedGoodsList
      );

      if (think.isEmpty(coupon)) {
        couponPrice = tmpCouponPrice;
        couponId = tmpCouponId;
        userCouponId = tmpUserCouponId;
      } else {
        couponPrice = coupon.discount;
      }
    }

    let freightPrice = 0.;
    if (checkedGoodsPrice < freightLimit) {
      freightPrice = freight;
    }

    const integralPrice = 0.;
    const orderTotalPrice = Math.max(0., checkedGoodsPrice + freightPrice - couponPrice);
    const actualPrice = orderTotalPrice - integralPrice;

    return this.success({
      addressId,
      couponId,
      userCouponId,
      cartId,
      grouponRulesId,
      grouponPrice,
      checkedAddress,
      availableCouponLength,
      goodsTotalPrice: checkedGoodsPrice,
      freightPrice,
      couponPrice,
      orderTotalPrice,
      actualPrice,
      checkedGoodsList,
    });
  }

  /**
   * 
   * @param {number?} userId 
   */
  async index(userId) {
    /** @type {CartService} */
    const cartService = this.service('cart');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const list = await cartService.queryByUid(userId);
    const cartList = [];

    for (const cart of list) {
      const goods = await goodsService.findById(cart.goodsId);
      if (think.isEmpty(goods) || !goods.isOnSale) {
        await cartService.deleteById(cart.id);
        think.logger.debug(`系统自动删除失效购物车商品 goodsId=${cart.goodsId} productId=${cart.productId}`);
      } else {
        cartList.push(cart);
      }
    }

    let goodsCount = 0;
    let goodsAmount = 0.;
    let checkedGoodsCount = 0;
    let checkedGoodsAmount = 0.;

    for (const cart of cartList) {
      const count = cart.number;
      const amount = cart.price * cart.number;

      goodsCount += count;
      goodsAmount += amount;

      if (cart.checked) {
        checkedGoodsCount += count;
        checkedGoodsAmount += amount;
      }
    }

    return this.success({
      cartTotal: {
        goodsCount,
        checkedGoodsCount,
        goodsAmount,
        checkedGoodsAmount,
      },
      cartList,
    });
  }

  /**
   * 
   * @param {number?} userId 
   */
  async goodsCount(userId) {
    /** @type {CartService} */
    const cartService = this.service('cart');

    if (think.isNullOrUndefined(userId)) {
      return this.success(0);
    }

    let goodsCount = 0;
    const cartList = await cartService.queryByUid(userId);
    for (const cart of cartList) {
      goodsCount += cart.number;
    }

    return this.success(goodsCount);
  }
};
