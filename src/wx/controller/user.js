const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const userId = this.getUserId();
    const orderService = this.service('order');

    if (!userId) {
      return this.unlogin();
    }

    const order = await orderService.orderInfo(userId);

    return this.success({
      order,
    });
  }
};
