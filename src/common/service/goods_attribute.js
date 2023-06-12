module.exports = class GoodsAttributeService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} goodsId 
   * @returns {Promise<GoodsAttribute[]>} 
   */
  queryByGid(goodsId) {
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
  add(goodsAttribute) {
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
  deleteByGid(goodsId) {
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
  deleteById(id) {
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
  updateById(goodsAttribute) {
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