module.exports = class CartService extends think.Service {
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
   * @param {number} userId 
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
   * @returns 
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