const Base = require('./base.js');

module.exports = class CartService extends Base {
  /**
   * .
   * @param {number} goodsId .
   * @param {number} productId .
   * @param {number} userId .
   * @returns {Promise<Cart|Record<string, never>>} .
   */
  async queryExist(goodsId, productId, userId) {
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
   * .
   * @param {Cart} cart .
   * @returns {Promise<number>} The ID inserted
   */
  async add(cart) {
    const now = new Date();
    return this.model('cart')
      .add(Object.assign(cart, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {Cart} cart .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(cart) {
    const now = new Date();
    return this.model('cart')
      .where({ id: cart.id })
      .update(Object.assign(cart, {
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {number} userId .
   * @returns {Promise<Cart[]>} .
   */
  async queryByUid(userId) {
    return this.model('cart')
      .where({
        userId,
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {number} userId .
   * @returns {Promise<Cart[]>} .
   */
  async queryByUidAndChecked(userId) {
    return this.model('cart')
      .where({
        userId,
        checked: true,
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {number[]} productIdList .
   * @param {number} userId .
   * @returns {Promise<number>} The number of rows affected
   */
  async delete(productIdList, userId) {
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
   * .
   * @param {number} id .
   * @param {number?} userId .
   * @returns {Promise<Cart|Record<string, never>>} .
   */
  async findById(id, userId) {
    const where = { id };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, {
        userId,
      });
    }

    return this.model('cart')
      .where(where)
      .find();
  }

  /**
   * .
   * @param {number} userId .
   * @param {number[]} idsList .
   * @param {boolean} checked .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateCheck(userId, idsList, checked) {
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
   * .
   * @param {number} userId .
   * @returns {Promise<number>} The number of rows affected
   */
  async clearGoods(userId) {
    return this.model('cart')
      .where({
        userId,
        checked: true,
      })
      .update({
        deleted: true,
      });
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('cart')
      .where({
        id,
      })
      .update({
        deleted: true,
      });
  }

  /**
   * .
   * @param {number} productId .
   * @param {string} goodsSn .
   * @param {string} goodsName .
   * @param {number} price .
   * @param {string} picUrl .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateProduct(productId, goodsSn, goodsName, price, picUrl) {
    return this.model('cart')
      .where({
        productId,
      })
      .update({
        price,
        picUrl,
        goodsSn,
        goodsName,
      });
  }
};
