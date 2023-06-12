module.exports = class GoodsAttributeService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<GoodsAttribute[]>} 
   */
  queryByGid(id) {
    return this.model('goods_attribute')
      .where({
        goodsId: id,
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