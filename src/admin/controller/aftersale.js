const Base = require('./base.js');

module.exports = class AdminAftersaleController extends Base {
  async listAction() {
    /** @type {number?} */
    const orderId = this.get('orderId');
    /** @type {string?} */
    const aftersaleSn = this.get('aftersaleSn');
    /** @type {number?} */
    const status = this.get('status');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');

    const aftersaleList = await aftersaleService.querySelective(orderId, aftersaleSn, status, page, limit, sort, order);

    return this.successList(aftersaleList);
  }

  async receptAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');
    /** @type {OrderService} */
    const orderService = this.service('order');

    const { ADMIN_RESPONSE, STATUS } = aftersaleService.getConstants();

    const aftersale = await aftersaleService.findById(id);

    if (think.isEmpty(aftersale)) {
      return this.fail(ADMIN_RESPONSE.NOT_ALLOWED, '售后不存在');
    }

    if (STATUS.REQUEST != aftersale.status) {
      return this.fail(ADMIN_RESPONSE.NOT_ALLOWED, '售后不能进行审核通过操作');
    }

    const now = new Date();

    Object.assign(aftersale, {
      status: STATUS.RECEPT,
      handleTime: now,
    });

    await aftersaleService.updateById(aftersale);

    await orderService.updateAftersaleStatus(aftersale.orderId, STATUS.RECEPT);

    return this.success();
  }

  async ['batch-receptAction']() {
    /** @type {number} */
    const ids = this.post('ids');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');

    const { STATUS } = aftersaleService.getConstants();

    const now = new Date();

    await Promise.all(
      ids.map(async (id) => {
        const aftersale = await aftersaleService.findById(id);

        if (think.isEmpty(aftersale)) {
          return;
        }

        if (STATUS.REQUEST != aftersale.status) {
          return;
        }

        Object.assign(aftersale, {
          status: STATUS.RECEPT,
          handleTime: now,
        });

        await aftersaleService.updateById(aftersale);

        await orderService.updateAftersaleStatus(aftersale.orderId, STATUS.RECEPT);
      })
    );

    return this.success();
  }

  async rejectAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');
    /** @type {OrderService} */
    const orderService = this.service('order');

    const { ADMIN_RESPONSE, STATUS } = aftersaleService.getConstants();

    const aftersale = await aftersaleService.findById(id);

    if (think.isEmpty(aftersale)) {
      return this.badArgumentValue();
    }

    if (STATUS.REQUEST != aftersale.status) {
      return this.fail(ADMIN_RESPONSE.NOT_ALLOWED, '售后不能进行审核拒绝操作');
    }

    const now = new Date();

    Object.assign(aftersale, {
      status: STATUS.REJECT,
      handleTime: now,
    });

    await aftersaleService.updateById(aftersale);

    await orderService.updateAftersaleStatus(aftersale.orderId, STATUS.REJECT);

    return this.success();
  }

  async ['batch-rejectAction']() {
    /** @type {number} */
    const ids = this.post('ids');

    /** @type {AftersaleService} */
    const aftersaleService = this.service('aftersale');

    const { STATUS } = aftersaleService.getConstants();

    const now = new Date();

    await Promise.all(
      ids.map(async (id) => {
        const aftersale = await aftersaleService.findById(id);

        if (think.isEmpty(aftersale)) {
          return;
        }

        if (STATUS.REQUEST != aftersale.status) {
          return;
        }

        Object.assign(aftersale, {
          status: STATUS.REJECT,
          handleTime: now,
        });

        await aftersaleService.updateById(aftersale);

        await orderService.updateAftersaleStatus(aftersale.orderId, STATUS.REJECT);
      })
    );

    return this.success();
  }

  async refundAction() {
    return this.success('todo');
  }
};
