const Base = require('./base.js');

module.exports = class AdminStatController extends Base {
  async userAction() {
    /** @type {StatService} */
    const statService = this.service('stat');

    const rows = await statService.statUser();

    return this.success({
      columns: ['day', 'users'],
      rows,
    });
  }

  async orderAction() {
    /** @type {StatService} */
    const statService = this.service('stat');

    const rows = await statService.statOrder();

    return this.success({
      columns: ['day', 'orders', 'customers', 'amount', 'pcr'],
      rows,
    });
  }

  async goodsAction() {
    /** @type {StatService} */
    const statService = this.service('stat');

    const rows = await statService.statGoods();

    return this.success({
      columns: ['day', 'orders', 'products', 'amount'],
      rows,
    });
  }
};
