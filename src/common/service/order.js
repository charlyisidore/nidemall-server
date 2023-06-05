module.exports = class OrderService extends think.Service {
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
    const year = now.getFullYear().toString();
    const mm = (1 + now.getMonth()).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const date = `${year}${mm}${dd}`;

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
   * @param {number} days 
   * @returns {Promise<Order[]>}
   */
  queryUnconfirm(days) {
    const { STATUS } = this.getConstants();
    const now = new Date();
    const expired = (new Date(now)).setDate(now.getDate() - days);
    return this.model('order')
      .where({
        orderStatus: STATUS.SHIP,
        shipTime: ['<', think.datetime(expired)],
        deleted: false,
      })
      .select();
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
   * @param {number} days 
   * @returns {Promise<Order[]>}
   */
  queryComment(days) {
    const now = new Date();
    const expired = (new Date(now)).setDate(now.getDate() - days);
    return this.model('order')
      .where({
        comments: ['>', 0],
        confirmTime: ['<', think.datetime(expired)],
        deleted: false,
      })
      .select();
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

  /**
   * 
   */
  async checkOrderUnconfirm() {
    think.logger.info('系统开启定时任务检查订单是否已经超期自动确认收货');

    /** @type {SystemService} */
    const systemService = think.service('system');

    const { STATUS } = this.getConstants();

    const orderUnconfirm = await systemService.getOrderUnconfirm();

    const orderList = await this.queryUnconfirm(orderUnconfirm);
    const now = new Date();

    await Promise.all(
      orderList.map(async (order) => {
        Object.assign(order, {
          status: STATUS.AUTO_CONFIRM,
          confirmTime: now,
        });

        if (!this.updateWithOptimisticLocker(order)) {
          think.logger.info(`订单 ID=${order.id} 数据已经更新，放弃自动确认收货`);
        } else {
          think.logger.info(`订单 ID=${order.id} 已经超期自动确认收货`);
        }
      })
    );

    think.logger.info('系统结束定时任务检查订单是否已经超期自动确认收货');
  }

  /**
   * 
   */
  async checkOrderComment() {
    think.logger.info('系统开启任务检查订单是否已经超期未评价');

    /** @type {OrderGoodsService} */
    const orderGoodsService = think.service('order_goods');
    /** @type {SystemService} */
    const systemService = think.service('system');

    const orderComment = await systemService.getOrderComment();

    const orderList = await this.queryComment(orderComment);

    await Promise.all(
      orderList.map(async (order) => {
        Object.assign(order, {
          comments: 0,
        });

        await this.updateWithOptimisticLocker(order);

        const orderGoodsList = await orderGoodsService.queryByOid(order.id);

        await Promise.all(
          orderGoodsList.map(async (orderGoods) => {
            Object.assign(orderGoods, {
              comment: -1,
            });

            await orderGoodsService.updateById(orderGoods);
          })
        );
      })
    );

    think.logger.info('系统结束任务检查订单是否已经超期未评价');
  }

  getRandomNum(n) {
    return Math.floor(Math.random() * (Math.pow(10, n) - 1))
      .toString()
      .padStart(n, '0');
  }

  isCreateStatus(order) {
    const { STATUS } = this.getConstants();
    return STATUS.CREATE == order.orderStatus;
  }

  isPayStatus(order) {
    const { STATUS } = this.getConstants();
    return STATUS.PAY == order.orderStatus;
  }

  isShipStatus(order) {
    const { STATUS } = this.getConstants();
    return STATUS.SHIP == order.orderStatus;
  }

  isConfirmStatus(order) {
    const { STATUS } = this.getConstants();
    return STATUS.CONFIRM == order.orderStatus;
  }

  isAutoConfirmStatus(order) {
    const { STATUS } = this.getConstants();
    return STATUS.AUTO_CONFIRM == order.orderStatus;
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

  /**
   * 
   * @param {{ orderStatus: number }} order 
   * @returns {{ cancel: boolean?, pay: boolean?, delete: boolean?, refund: boolean?, confirm: boolean?, comment: boolean?, rebuy: boolean?, aftersale: boolean? }}
   */
  build(order) {
    const handleOption = {};

    switch (order.orderStatus) {
      case 101:
        // If the order is not cancelled and not paid for, it is payable and can be cancelled
        Object.assign(handleOption, {
          cancel: true,
          pay: true,
        });
        break;
      case 102:
      case 103:
        // If the order has been cancelled or completed, it can be deleted
        Object.assign(handleOption, {
          delete: true,
        });
        break;
      case 201:
        // If an order is paid for and not shipped, a refund will be issued
        Object.assign(handleOption, {
          refund: true,
        });
        break;
      case 202:
      case 204:
        // If the order request for refund is in progress, there is no relevant operation
        break;
      case 203:
        // If the order has been refunded, it can be deleted
        Object.assign(handleOption, {
          delete: true,
        });
        break;
      case 301:
        // If the order has been shipped and not received, then you can receive the goods operation,
        // at this time can not cancel the order
        Object.assign(handleOption, {
          confirm: true,
        });
        break;
      case 401:
      case 402:
        // If an order has been paid for and received, it can be deleted, de-commented,
        // requested after-sales and purchased again
        Object.assign(handleOption, {
          delete: true,
          comment: true,
          rebuy: true,
          aftersale: true,
        });
        break;
      default:
        throw new Error('status不支持');
    }

    return handleOption;
  }

  getConstants() {
    return {
      RESPONSE: {
        UNKNOWN: 720,
        INVALID: 721,
        CHECKOUT_FAIL: 722,
        CANCEL_FAIL: 723,
        PAY_FAIL: 724,
        INVALID_OPERATION: 725,
        COMMENTED: 726,
        COMMENT_EXPIRED: 727,
      },
      STATUS: {
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
      },
    };
  }
}