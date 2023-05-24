const Base = require('./base.js');

module.exports = class WxUserController extends Base {
  async indexAction() {
    const userId = this.getUserId();
    /** @type {OrderService} */
    const orderService = this.service('order');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const order = await orderService.orderInfo(userId);

    return this.success({
      order,
    });
  }
};
