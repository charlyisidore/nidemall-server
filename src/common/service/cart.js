module.exports = class CartService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} goodsId 
   * @param {number} productId 
   * @param {number} userId 
   * @returns {Promise<Cart|Record<string, never>>} 
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
   * @returns {Promise<number>} The ID inserted
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
   * @returns {Promise<number>} The number of rows affected
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
   * @returns {Promise<Cart[]>} 
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
   * @param {number} userId 
   * @returns {Promise<Cart[]>} 
   */
  queryByUidAndChecked(userId) {
    return this.model('cart')
      .where({
        userId,
        checked: true,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number[]} productIdList 
   * @param {number} userId 
   * @returns {Promise<number>} The number of rows affected
   */
  delete(productIdList, userId) {
    return this.model('cart')
      .where({
        userId,
        productId: ['IN', productIdList],
      })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {number} id 
   * @param {number?} userId 
   * @returns {Promise<Cart|Record<string, never>>} 
   */
  findById(id, userId) {
    return this.model('cart')
      .where({
        id,
        userId,
      })
      .find();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number[]} idsList 
   * @param {boolean} checked 
   * @returns {Promise<number>} The number of rows affected
   */
  updateCheck(userId, idsList, checked) {
    const now = new Date();
    return this.model('cart')
      .where({
        userId,
        productId: ['IN', idsList],
        deleted: false,
      })
      .update({
        checked,
        updateTime: now,
      });
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteById(id) {
    return this.model('cart')
      .where({
        id,
      })
      .update({
        deleted: true,
      });
  }
}