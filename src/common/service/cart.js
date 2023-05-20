module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} goodsId 
   * @param {number} productId 
   * @param {number} userId 
   */
  queryExist(goodsId, productId, userId) {
    return this.model('cart')
      .where({
        goodsId,
        productId,
        userId,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {object} cart 
   */
  add(cart) {
    const now = new Date();
    return this.model('cart')
      .add(Object.assign(cart, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {object} cart 
   */
  updateById(cart) {
    const now = new Date();
    return this.model('cart')
      .where({ id: cart.id })
      .update(Object.assign(cart, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} userId 
   */
  queryByUid(userId) {
    return this.model('cart')
      .where({
        userId,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} id 
   */
  deleteById(id) {
    return this.model('cart')
      .where({
        id,
      })
      .delete();
  }
}