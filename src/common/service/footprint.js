const Base = require('./base.js');

module.exports = class FootprintService extends Base {
  /**
   * .
   * @param {number} userId .
   * @param {number} page .
   * @param {number} limit .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Footprint[]}>}
   */
  async queryByAddTime(userId, page, limit) {
    return this.model('footprint')
      .where({
        userId,
        deleted: false,
      })
      .order({
        addTime: 'DESC',
      })
      .page(page, limit)
      .countSelect();
  }

  /**
   * .
   * @param {number} id .
   * @param {number?} userId .
   * @returns {Promise<Footprint>}
   */
  async findById(id, userId) {
    const where = { id };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, {
        userId,
        deleted: false,
      });
    }

    return this.model('footprint')
      .where(where)
      .find();
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('footprint')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * .
   * @param {Footprint} footprint .
   * @returns {Promise<number>} The ID inserted
   */
  async add(footprint) {
    const now = new Date();
    return this.model('footprint')
      .add(Object.assign(footprint, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {number?} userId .
   * @param {number?} goodsId .
   * @param {number} page .
   * @param {number} limit .
   * @param {string} sort .
   * @param {string} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Footprint[]}>}
   */
  async querySelective(userId, goodsId, page, limit, sort, order) {
    const model = this.model('footprint');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, { userId });
    }

    if (!think.isNullOrUndefined(goodsId)) {
      Object.assign(where, { goodsId });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }
};
