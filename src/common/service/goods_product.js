module.exports = class GoodsProductService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   */
  findById(id) {
    return this.model('goods_product')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {number} id 
   */
  queryByGid(id) {
    return this.model('goods_product')
      .where({
        goodsId: id,
        deleted: false,
      })
      .select();
  }
}