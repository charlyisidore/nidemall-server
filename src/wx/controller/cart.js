const Base = require('./base.js');

module.exports = class extends Base {
  static GOODS_UNSHELVE = 710;
  static GOODS_NO_STOCK = 711;

  indexAction() {
    const userId = this.getUserId();
    return this.index(userId);
  }

  async addAction() {
    const userId = this.getUserId();

    // Cart
    const goodsId = parseInt(this.post('goodsId'));
    const productId = parseInt(this.post('productId'));
    const number = parseInt(this.post('number'));

    const cartService = this.service('cart');
    const goodsService = this.service('goods');
    const goodsProductService = this.service('goods_product');

    if (!userId) {
      return this.unlogin();
    }

    if (!goodsId || !productId || !number || number <= 0) {
      return this.badArgument();
    }

    const goods = await goodsService.findById(goodsId);

    if (think.isEmpty(goods) || !goods.isOnSale) {
      return this.fail(this.constructor.GOODS_UNSHELVE, '商品已下架')
    }

    const product = await goodsProductService.findById(productId);
    const existCart = await cartService.queryExist(goodsId, productId, userId);

    if (think.isEmpty(existCart)) {
      if (!product || number > product.number) {
        return this.fail(this.constructor.GOODS_NO_STOCK, '库存不足');
      }

      await cartService.add({
        goodsId,
        productId,
        number,
        userId,
        goodsSn: goods.goodsSn,
        goodsName: goods.name,
        picUrl: product.url ? product.url : goods.picUrl,
        price: product.price,
        specifications: product.specifications,
        checked: true,
      });
    } else {
      const num = existCart.number + number;
      if (num > product.number) {
        return this.fail(this.constructor.GOODS_NO_STOCK, '库存不足');
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

    // Cart
    const goodsId = parseInt(this.post('goodsId'));
    const productId = parseInt(this.post('productId'));
    const number = parseInt(this.post('number'));

    const cartService = this.service('cart');
    const goodsService = this.service('goods');
    const goodsProductService = this.service('goods_product');

    if (!userId) {
      return this.unlogin();
    }

    if (!productId || !number || !goodsId || number <= 0) {
      return this.badArgument();
    }

    const goods = await goodsService.findById(goodsId);

    if (!goods || !goods.isOnSale) {
      return this.fail(this.constructor.GOODS_UNSHELVE, '商品已下架');
    }

    const product = await goodsProductService.findById(productId);
    const existCart = await cartService.findById(id, userId);

    if (!existCart) {
      if (!product || number > product.number) {
        return this.fail(this.constructor.GOODS_NO_STOCK, '库存不足');
      }

      const cart = await cartService.add({
        productId,
        number,
        goodsId,
        goodsSn: goods.goodsSn,
        goodsName: goods.name,
        picUrl: product.url ? product.url : goods.picUrl,
        price: product.price,
        specifications: product.specifications,
        userId,
        checked: true,
      });

      return this.success(cart.id);
    } else {
      if (number > product.number) {
        return this.fail(this.constructor.GOODS_NO_STOCK, '库存不足');
      }

      existCart.number = number;

      if (!await cartService.updateById(existCart)) {
        return this.updatedDataFailed();
      }

      return this.success(existCart.id);
    }
  }

  async updateAction() {
    const userId = this.getUserId();

    // Cart
    const id = parseInt(this.post('id'));
    const goodsId = parseInt(this.post('goodsId'));
    const productId = parseInt(this.post('productId'));
    const number = parseInt(this.post('number'));

    const cartService = this.service('cart');
    const goodsService = this.service('goods');
    const goodsProductService = this.service('goods_product');

    if (!userId) {
      return this.unlogin();
    }

    if (!id || !productId || !number || !goodsId || number <= 0) {
      return this.badArgument();
    }

    const existCart = await cartService.findById(id, userId);

    if (!existCart) {
      return this.badArgumentValue();
    }

    if (existCart.goodsId != goodsId || existCart.productId != productId) {
      return this.badArgumentValue();
    }

    const goods = await goodsService.findById(goodsId);
    if (!goods || !goods.isOnSale) {
      return this.fail(this.constructor.GOODS_UNSHELVE, '商品已下架');
    }

    const product = await goodsProductService.findById(productId);
    if (!product || product.number < number) {
      return this.fail(this.constructor.GOODS_UNSHELVE, '库存不足');
    }

    existCart.number = number;
    if (!await cartService.updateById(existCart)) {
      return this.updatedDataFailed();
    }

    return this.success();
  }

  async checkedAction() {
    const userId = this.getUserId();

    // Cart
    let productIds = this.post('productIds');
    const checkValue = parseInt(this.post('isChecked'));

    const cartService = this.service('cart');

    if (!userId) {
      return this.unlogin();
    }

    if (!productIds || !checkValue) {
      return this.badArgument();
    }

    productIds = JSON.parse(productIds);

    await cartService.updateCheck(userId, productIds, (checkValue == 1));

    return this.index(userId);
  }

  async deleteAction() {
    const userId = this.getUserId();

    // Cart
    let productIds = this.post('productIds');

    const cartService = this.service('cart');

    if (!userId) {
      return this.unlogin();
    }

    if (!productIds) {
      return this.badArgument();
    }

    productIds = JSON.parse(productIds);

    if (productIds.length == 0) {
      return this.badArgument();
    }

    await cartService.delete(productIds, userId);

    return this.index(userId);
  }

  goodscountAction() {
    const userId = this.getUserId();
    return this.goodsCount(userId);
  }

  async checkoutAction() {
    const userId = this.getUserId();

    // Cart
    const cartId = this.post('cartId');
    let addressId = this.post('addressId');
    let couponId = this.post('couponId');
    let userCouponId = this.post('userCouponId');
    const grouponRulesId = this.post('grouponRulesId');

    const addressService = this.service('address');
    const cartService = this.service('cart');
    const systemService = this.service('system');

    const freight = await systemService.getFreight();
    const freightLimit = await systemService.getFreightLimit();

    let checkedAddress = null;

    if (addressId) {
      checkedAddress = await addressService.query(userId, addressId);
    }

    if (!checkedAddress) {
      checkedAddress = await addressService.findDefault(userId);

      if (!checkedAddress) {
        checkedAddress = { id: 0 };
      }

      addressId = checkedAddress.id;
    }

    let grouponPrice = 0.;
    const grouponRules = await grouponRulesService.findById(grouponRulesId);
    if (grouponRules) {
      grouponPrice = grouponRules.discount;
    }

    let checkedGoodsList = null;
    if (!cartId) {
      checkedGoodsList = await cartService.queryByUidAndChecked(userId);
    } else {
      const cart = await cartService.findById(cartId, userId);
      if (!cart) {
        return this.badArgumentValue();
      }
      checkedGoodsList = [cart];
    }

    let checkedGoodsPrice = 0.;
    for (const cart of checkedGoodsList) {
      if (grouponRules && grouponRules.goodsId == cart.goodsId) {
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

      if (!coupon) {
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

    if (!couponId || couponId == -1) {
      couponId = -1;
      userCouponId = -1;
    } else if (!couponId) {
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

      if (coupon) {
        couponPrice = coupon.discount;
      } else {
        couponPrice = tmpCouponPrice;
        couponId = tmpCouponId;
        userCouponId = tmpUserCouponId;
      }
    }

    let freightPrice = 0.;
    if (checkedGoodsPrice < freightLimit) {
      freightPrice = freight;
    }

    const integralPrice = 0.;
    const orderTotalPrice = checkedGoodsPrice + freightPrice - couponPrice;
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
      goodsTotalPrice,
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
    const cartService = this.service('cart');
    const goodsService = this.service('goods');

    if (!userId) {
      return this.unlogin();
    }

    const list = await cartService.queryByUid(userId);
    const cartList = [];

    for (const cart of list) {
      const goods = goodsService.findById(cart.goodsId);
      if (!goods || !goods.isOnSale) {
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
        checkedGoogsCount += count;
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
    const cartService = this.service('cart');

    if (!userId) {
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
