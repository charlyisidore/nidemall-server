const Base = require('./base.js');

module.exports = class AdminDashboardController extends Base {
  async indexAction() {
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {GoodsProductService} */
    const goodsProductService = this.service('goods_product');
    /** @type {OrderService} */
    const orderService = this.service('order');
    /** @type {UserService} */
    const userService = this.service('user');

    const userTotal = await userService.count();
    const goodsTotal = await goodsService.count();
    const productTotal = await goodsProductService.count();
    const orderTotal = await orderService.count();

    return this.success({
      userTotal,
      goodsTotal,
      productTotal,
      orderTotal,
    });
  }
};
