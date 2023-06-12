module.exports = class GoodsProductService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<GoodsProduct[]>} 
   */
  queryByGid(id) {
    return this.model('goods_product')
      .where({
        goodsId: id,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<GoodsProduct|Record<string, never>>} 
   */
  findById(id) {
    return this.model('goods_product')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {GoodsProduct} goodsProduct 
   * @returns {Promise<number>} The ID inserted
   */
  add(goodsProduct) {
    const now = new Date();
    return this.model('goods_product')
      .add(Object.assign(goodsProduct, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @returns {Promise<number>} The total number
   */
  count() {
    return this.model('goods_product')
      .where({
        deleted: false,
      })
      .count();
  }

  /**
   * 
   * @param {number} goodsId 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteByGid(goodsId) {
    return this.model('goods_product')
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
   * @param {number} num 
   * @returns {Promise<number>}
   */
  async addStock(id, num) {
    const product = await this.model('goods_product')
      .field('number')
      .where({ id })
      .find();

    if (think.isEmpty(product)) {
      return 0;
    }

    const now = new Date();
    return this.model('goods_product')
      .where({ id })
      .update({
        number: product.number + num,
        updateTime: now,
      });
  }

  /**
   * 
   * @param {number} id 
   * @param {number} num 
   * @returns {Promise<number>} The number of rows affected
   */
  async reduceStock(id, num) {
    const product = await this.model('goods_product')
      .field('number')
      .where({ id })
      .find();

    if (think.isEmpty(product) || product.number < num) {
      return 0;
    }

    const now = new Date();
    return this.model('goods_product')
      .where({ id })
      .update({
        number: product.number - num,
        updateTime: now,
      });
  }

  /**
   * 
   * @param {GoodsProduct} goodsProduct 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(goodsProduct) {
    const now = new Date();
    return this.model('goods_product')
      .where({
        id: goodsProduct.id,
      })
      .update(Object.assign(goodsProduct, {
        updateTime: now,
      }));
  }
}