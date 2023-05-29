module.exports = class OrderService extends think.Service {
  static STATUS = {
    CREATE: 101,
    PAY: 201,
    SHIP: 301,
    CONFIRM: 401,
    CANCEL: 102,
    AUTO_CANCEL: 103,
    ADMIN_CANCEL: 104,
    REFUND: 202,
    REFUND_CONFIRM: 203,
    AUTO_CONFIRM: 402,
  };

  constructor() {
    super();
  }

  /**
   * 
   * @param {Order} order 
   * @returns {Promise<number>} The ID inserted
   */
  add(order) {
    const now = new Date();
    return this.model('order')
      .add(Object.assign(order, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @param {number?} userId 
   * @returns {Promise<Order|Record<string, never>>}
   */
  findById(id, userId) {
    const where = { id };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, {
        userId,
        deleted: false,
      })
    }

    return this.model('order')
      .where(where)
      .find();
  }

  /**
   * 
   * @param {number} orderSn 
   * @param {number} userId 
   */
  countByOrderSn(orderSn, userId) {
    return this.model('order')
      .where({
        orderSn,
        userId,
        deleted: false,
      })
      .count();
  }

  /**
   * 
   * @param {number} userId 
   * @returns {string} A random orderSn
   */
  async generateOrderSn(userId) {
    const now = new Date();
    const yyyy = now.getFullYear().toString().padStart(4, '0');
    const mm = now.getMonth().toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const date = `${yyyy}${mm}${dd}`;

    let orderSn = `${date}${this.getRandomNum(6)}`;
    while (await this.countByOrderSn(orderSn, userId)) {
      orderSn = `${date}${this.getRandomNum(6)}`;
    }

    return orderSn;
  }

  /**
   * 
   * @param {number} userId 
   * @param {number[]?} orderStatus 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Order[]}>}
   */
  queryByOrderStatus(userId, orderStatus, page, limit, sort, order) {
    const model = this.model('order');
    const where = {
      userId,
      deleted: false,
    };

    if (!think.isEmpty(orderStatus)) {
      Object.assign(where, {
        orderStatus: ['IN', orderStatus],
      });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({
        [sort]: order,
      });
    } else {
      model.order({
        'addTime': 'DESC',
      });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {Order} order 
   * @returns {Promise<number>}
   */
  updateWithOptimisticLocker(order) {
    const now = new Date();
    const preUpdateTime = order.updateTime;
    return this.model('order')
      .where({
        id: order.id,
        updateTime: preUpdateTime,
      })
      .update(Object.assign(order, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {Order} order 
   * @returns {Promise<number>} The number of rows affected
   */
  updateSelective(order) {
    return this.model('order')
      .where({
        id: order.id,
      })
      .update(order);
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>}
   */
  deleteById(id) {
    return this.model('order')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {number} userId 
   * @returns {{unpaid: number, unship: number, unrecv: number, uncomment: number}}
   */
  async orderInfo(userId) {
    const orders = await this.model('order')
      .field([
        'orderStatus',
        'comments',
      ].join(','))
      .where({
        userId,
        deleted: false,
      })
      .select();

    let unpaid = 0;
    let unship = 0;
    let unrecv = 0;
    let uncomment = 0;

    for (const order of orders) {
      switch (true) {
        case this.isCreateStatus(order):
          unpaid++;
          break;
        case this.isPayStatus(order):
          unship++;
          break;
        case this.isShipStatus(order):
          unrecv++;
          break;
        case this.isConfirmStatus(order) || this.isAutoConfirmStatus(order):
          uncomment += order.comments;
          break;
      }
    }

    return {
      unpaid,
      unship,
      unrecv,
      uncomment,
    };
  }

  getRandomNum(n) {
    return Math.floor(Math.random() * (Math.pow(10, n) - 1))
      .toString()
      .padStart(n, '0');
  }

  isCreateStatus(order) {
    return this.constructor.STATUS.CREATE == order.orderStatus;
  }

  isPayStatus(order) {
    return this.constructor.STATUS.PAY == order.orderStatus;
  }

  isShipStatus(order) {
    return this.constructor.STATUS.SHIP == order.orderStatus;
  }

  isConfirmStatus(order) {
    return this.constructor.STATUS.CONFIRM == order.orderStatus;
  }

  isAutoConfirmStatus(order) {
    return this.constructor.STATUS.AUTO_CONFIRM == order.orderStatus;
  }
}