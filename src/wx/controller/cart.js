const Base = require('./base.js');

module.exports = class extends Base {
  static GOODS_UNSHELVE = 710;
  static GOODS_NO_STOCK = 711;

  async indexAction() {
    const userId = this.ctx.state.userId;
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

  async addAction() {
    const userId = this.ctx.state.userId;
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
      if (!(await cartService.updateById(existCart))) {
        return this.updatedDataFailed();
      }
    }

    return this.success(await this.goodsCount(userId));
  }

  async fastaddAction() {
    return this.success('todo');
  }

  async updateAction() {
    return this.success('todo');
  }

  async checkedAction() {
    return this.success('todo');
  }

  async deleteAction() {
    return this.success('todo');
  }

  async goodscountAction() {
    const userId = this.ctx.state.userId;
    return this.success(await this.goodsCount(userId));
  }

  async checkoutAction() {
    return this.success('todo');
  }

  async goodsCount(userId) {
    const cartService = this.service('cart');

    if (!userId) {
      return 0;
    }

    let goodsCount = 0;
    const cartList = await cartService.queryByUid(userId);
    for (const cart of cartList) {
      goodsCount += cart.number;
    }

    return goodsCount;
  }
};
