const Base = require('./base.js');

module.exports = class AddressService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @returns {Promise<Address[]>} 
   */
  queryByUid(userId) {
    return this.model('address')
      .where({
        userId,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number?} id 
   * @param {number} userId 
   * @returns {Promise<Address|Record<string, never>>} 
   */
  query(id, userId) {
    const where = {
      userId,
      deleted: false,
    };

    if (!think.isNullOrUndefined(id)) {
      Object.assign(where, {
        id,
      });
    }

    return this.model('address')
      .where(where)
      .find();
  }

  /**
   * 
   * @param {Address} address 
   * @returns {Promise<number>} The ID inserted
   */
  add(address) {
    const now = new Date();
    return this.model('address')
      .add(Object.assign(address, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {Address} address 
   * @returns {Promise<number>} The number of rows affected
   */
  update(address) {
    const now = new Date();
    return this.model('address')
      .where({ id: address.id })
      .update(Object.assign(address, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  delete(id) {
    return this.model('address')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {number} userId 
   * @returns {Promise<Address|Record<string, never>>} 
   */
  findDefault(userId) {
    return this.model('address')
      .where({
        userId,
        isDefault: true,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {number} userId 
   * @returns {Promise<number>} The number of rows affected
   */
  resetDefault(userId) {
    const now = new Date();
    return this.model('address')
      .where({
        userId,
        deleted: false,
      })
      .update({
        isDefault: false,
        updateTime: now,
      });
  }

  /**
   * 
   * @param {number?} userId 
   * @param {string?} name 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Address[]}>}
   */
  querySelective(userId, name, page, limit, sort, order) {
    const model = this.model('address');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, { userId });
    }

    if (!think.isTrueEmpty(name)) {
      Object.assign(where, {
        name: ['LIKE', `%${name}%`],
      });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }
}
