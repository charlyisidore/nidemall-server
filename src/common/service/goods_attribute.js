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
}