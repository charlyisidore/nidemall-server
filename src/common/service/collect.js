const Base = require('./base.js');

module.exports = class CollectService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} type 
   * @param {number} gid 
   * @returns {Promise<number>} The total number
   */
  count(userId, type, gid) {
    return this.model('collect')
      .where({
        userId,
        type,
        valueId: gid,
        deleted: false,
      })
      .count();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number?} type 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Collect[]}>}
   */
  queryByType(userId, type, page, limit, sort, order) {
    const model = this.model('collect');

    const where = {
      userId,
      deleted: false,
    };

    if (!think.isNullOrUndefined(type)) {
      Object.assign(where, { type });
    }

    model.where(where);

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({
        [sort]: order,
      });
    }

    return model
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} type 
   * @param {number} valueId 
   * @returns {Promise<Collect>}
   */
  queryByTypeAndValue(userId, type, valueId) {
    return this.model('collect')
      .where({
        userId,
        type,
        valueId,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteById(id) {
    return this.model('collect')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Collect} collect 
   * @returns {Promise<number>} The ID inserted
   */
  add(collect) {
    const now = new Date();
    return this.model('collect')
      .add(Object.assign(collect, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number?} userId 
   * @param {number?} valueId 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Collect[]}>}
   */
  querySelective(userId, valueId, page, limit, sort, order) {
    const model = this.model('collect');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, { userId });
    }

    if (!think.isNullOrUndefined(valueId)) {
      Object.assign(where, { valueId });
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
