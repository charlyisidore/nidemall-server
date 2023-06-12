module.exports = class GrouponService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @returns {Promise<Groupon[]>}
   */
  queryMyGroupon(userId) {
    const { STATUS } = this.getConstants();
    return this.model('groupon')
      .where({
        userId,
        creatorUserId: userId,
        grouponId: 0,
        status: ['!=', STATUS.NONE],
        deleted: false,
      })
      .order({
        addTime: 'DESC',
      })
      .select();
  }

  /**
   * 
   * @param {number} userId 
   * @returns {Promise<Groupon[]>}
   */
  queryMyJoinGroupon(userId) {
    const { STATUS } = this.getConstants();
    return this.model('groupon')
      .where({
        userId,
        grouponId: ['!=', 0],
        status: ['!=', STATUS.NONE],
        deleted: false,
      })
      .order({
        addTime: 'DESC',
      })
      .select();
  }

  /**
   * 
   * @param {number} orderId 
   * @returns {Promise<Order|Record<string, never>>}
   */
  queryByOrderId(orderId) {
    return this.model('groupon')
      .where({
        orderId,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Groupon[]>}
   */
  queryJoinRecord(id) {
    const { STATUS } = this.getConstants();
    return this.model('groupon')
      .where({
        grouponId: id,
        status: ['!=', STATUS.NONE],
        deleted: false,
      })
      .order({
        addTime: 'DESC',
      })
      .select();
  }

  /**
   * 
   * @param {number} id 
   * @param {number?} userId 
   * @returns {Promise<Groupon|Record<string, never>>}
   */
  queryById(id, userId) {
    const where = {
      id,
      deleted: false,
    };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, {
        userId,
      });
    }

    return this.model('groupon')
      .where(where)
      .find();
  }

  /**
   * 
   * @param {number} grouponId 
   * @returns {Promise<number>} The total number
   */
  countGroupon(grouponId) {
    const { STATUS } = this.getConstants();
    return this.model('groupon')
      .where({
        grouponId,
        status: ['!=', STATUS.NONE],
        deleted: false,
      })
      .count();
  }

  /**
   * 
   * @param {number} grouponId 
   * @param {number} userId 
   * @returns {Promise<boolean>}
   */
  async hasJoin(grouponId, userId) {
    const { STATUS } = this.getConstants();
    return 0 != await this.model('groupon')
      .where({
        grouponId,
        userId,
        status: ['!=', STATUS.NONE],
        deleted: false,
      })
      .count();
  }

  /**
   * 
   * @param {Groupon} groupon 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(groupon) {
    const now = new Date();
    return this.model('groupon')
      .where({
        id: groupon.id,
      })
      .update(Object.assign(groupon, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {Groupon} groupon 
   * @returns {Promise<number>} The ID inserted
   */
  createGroupon(groupon) {
    const now = new Date();
    return this.model('groupon')
      .add(Object.assign(groupon, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number?} rulesId 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Groupon[]}>}
   */
  querySelective(rulesId, page, limit, sort, order) {
    const { STATUS } = this.getConstants();

    const model = this.model('groupon');
    const where = {
      deleted: false,
      status: ['!=', STATUS.NONE],
      grouponId: 0,
    };

    if (!think.isNullOrUndefined(rulesId)) {
      Object.assign(where, { rulesId });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} grouponRulesId 
   * @returns {Promise<Groupon[]>}
   */
  queryByRulesId(grouponRulesId) {
    return this.model('groupon')
      .where({
        rulesId: grouponRulesId,
        deleted: false,
      })
      .select();
  }

  getConstants() {
    return {
      RESPONSE: {
        EXPIRED: 730,
        OFFLINE: 731,
        FULL: 732,
        JOIN: 733,
      },
      STATUS: {
        NONE: 0,
        ON: 1,
        SUCCEED: 2,
        FAIL: 3,
      },
    };
  }
}