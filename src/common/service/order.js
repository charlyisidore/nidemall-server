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
   * @param {number} userId 
   */
  async orderInfo(userId) {
    const orders = await this.model('order')
      .field('orderStatus,comments')
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