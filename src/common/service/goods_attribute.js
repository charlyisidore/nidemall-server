const Base = require('./base.js');

module.exports = class GoodsAttributeService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} goodsId 
   * @returns {Promise<GoodsAttribute[]>} 
   */
  async queryByGid(goodsId) {
    return this.model('goods_attribute')
      .where({
        goodsId,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {GoodsAttribute} goodsAttribute 
   * @returns {Promise<number>} The ID inserted
   */
  async add(goodsAttribute) {
    const now = new Date();
    return this.model('goods_attribute')
      .add(Object.assign(goodsAttribute, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} goodsId 
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteByGid(goodsId) {
    return this.model('goods_attribute')
      .where({
        goodsId,
      })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('goods_attribute')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {GoodsAttribute} goodsAttribute 
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(goodsAttribute) {
    const now = new Date();
    return this.model('goods_attribute')
      .where({
        id: goodsAttribute.id,
      })
      .update(Object.assign(goodsAttribute, {
        updateTime: now,
      }));
  }
}
