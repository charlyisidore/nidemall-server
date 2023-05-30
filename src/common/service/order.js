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
   * @param {string} orderSn 
   * @param {number} userId 
   * @returns {Promise<number>}
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
   * @returns {Promise<string>} A random orderSn
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

  /**
   * 
   * @param {number} id 
   * @param {number} aftersaleStatus 
   * @returns {Promise<number>} The number of rows affected
   */
  updateAftersaleStatus(id, aftersaleStatus) {
    const now = new Date();
    return this.model('order')
      .where({ id })
      .update({
        aftersaleStatus,
        updateTime: now,
      });
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

  /**
   * 
   * @param {number} showType 
   * @returns {number[]?}
   */
  orderStatus(showType) {
    switch (showType) {
      case 0:
        // Full order
        return null;
      case 1:
        // Orders to be paid
        return [101];
      case 2:
        // Orders to be shipped
        return [201];
      case 3:
        // Orders to be received
        return [301];
      case 4:
        // Orders to be evaluated
        return [401];
      default:
        return null;
    }
  }

  /**
   * 
   * @param {{ orderStatus: number }} order 
   * @returns {string}
   */
  orderStatusText(order) {
    switch (order.orderStatus) {
      case 101:
        // Not paid
        return '未付款';
      case 102:
        // Canceled
        return '已取消';
      case 103:
        // Canceled (system)
        return '已取消(系统)';
      case 201:
        // Paid
        return '已付款';
      case 202:
        // Order cancelled, refund in progress
        return '订单取消，退款中';
      case 203:
        // Refunded
        return '已退款';
      case 204:
        // Timed out group buy
        return '已超时团购';
      case 301:
        // Shipped
        return '已发货';
      case 401:
        // Received
        return '已收货';
      case 402:
        // Received (system)
        return '已收货(系统)';
      default:
        throw new Error('orderStatus不支持');
    }
  }
}