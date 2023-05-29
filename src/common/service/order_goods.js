module.exports = class OrderGoodsService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {OrderGoods} orderGoods 
   * @returns {Promise<number>} The ID inserted
   */
  add(orderGoods) {
    const now = new Date();
    return this.model('order_goods')
      .add(Object.assign(orderGoods, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} orderId 
   * @returns {Promise<OrderGoods[]>}
   */
  queryByOid(orderId) {
    return this.model('order_goods')
      .where({
        orderId,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} orderId 
   * @returns {Promise<number>}
   */
  getComments(orderId) {
    return this.model('order_goods')
      .where({
        orderId,
        deleted: false,
      })
      .count();
  }
}