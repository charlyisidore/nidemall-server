const Base = require('./base.js');

module.exports = class OrderGoodsService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {OrderGoods} orderGoods 
   * @returns {Promise<number>} The ID inserted
   */
  async add(orderGoods) {
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
  async queryByOid(orderId) {
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
  async findById(id) {
    return this.model('order_goods')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {OrderGoods} orderGoods 
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(orderGoods) {
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
  async getComments(orderId) {
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
  async deleteByOrderId(orderId) {
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
