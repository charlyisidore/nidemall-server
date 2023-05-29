module.exports = class FootprintService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Footprint[]}>}
   */
  queryByAddTime(userId, page, limit) {
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
   * 
   * @param {number} id 
   * @param {number?} userId 
   * @returns {Promise<Footprint>}
   */
  findById(id, userId) {
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
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteById(id) {
    return this.model('footprint')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Footprint} footprint 
   * @returns {Promise<number>} The ID inserted
   */
  add(footprint) {
    const now = new Date();
    return this.model('footprint')
      .add(Object.assign(footprint, {
        addTime: now,
        updateTime: now,
      }));
  }
}