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
}