module.exports = class GrouponService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} orderId 
   * @returns {Promise<Order|Record<string, never>>}
   */
  queryByOrderId(orderId) {
    return this.model('groupon')
      .where({
        orderId,
        deleted: false,
      })
      .find();
  }
}