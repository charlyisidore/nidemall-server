module.exports = class AftersaleService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number?} status 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Aftersale[]}>}
   */
  queryList(userId, status, page, limit, sort, order) {
    const model = this.model('aftersale');

    const where = {
      userId,
      deleted: false,
    };

    if (!think.isNullOrUndefined(status)) {
      Object.assign(where, { status });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({
        [sort]: order,
      });
    } else {
      model.order({
        addTime: 'DESC',
      });
    }

    return model
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} orderId 
   * @param {number} userId 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteByOrderId(orderId, userId) {
    const now = new Date();
    return this.model('aftersale')
      .where({
        orderId,
        userId,
        deleted: false,
      })
      .update({
        updateTime: now,
        deleted: true,
      });
  }

  /**
   * 
   * @param {number} orderId 
   * @param {number} userId 
   * @returns {Promise<Aftersale|Record<string, never>>}
   */
  findByOrderId(orderId, userId) {
    return this.model('aftersale')
      .where({
        orderId,
        userId,
        deleted: false,
      })
      .find();
  }
}