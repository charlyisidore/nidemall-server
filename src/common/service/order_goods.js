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
   * @param {number} id 
   * @returns {Promise<OrderGoods>}
   */
  findById(id) {
    return this.model('order_goods')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {OrderGoods} orderGoods 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(orderGoods) {
    const now = new Date();
    return this.model('order_goods')
      .where({
        id: order.id,
      })
      .update(Object.assign(orderGoods, {
        updateTime: now,
      }));
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

  /**
   * 
   * @param {number} orderId 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteByOrderId(orderId) {
    return this.model('order_goods')
      .where({
        orderId,
        deleted: false,
      })
      .update({
        deleted: true,
      });
  }
}