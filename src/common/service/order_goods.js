module.exports = class OrderGoodsService extends think.Service {
  constructor() {
    super();
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
}