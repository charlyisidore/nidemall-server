module.exports = class AftersaleService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} orderId 
   * @param {number} userId 
   * @returns {Promise<number>} 
   */
  deleteByOrderId(orderId, userId) {
    const now = new Date();
    return this.model('aftersale')
      .where({
        orderId,
        userId,
        deleted: false,
      })
      .update({
        updateTime: now,
        deleted: true,
      });
  }
}