module.exports = class extends think.Service {
  constructor() {
    super();
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