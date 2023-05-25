module.exports = class GrouponService extends think.Service {
  static STATUS = {
    NONE: 0,
    ON: 1,
    SUCCEED: 2,
    FAIL: 3,
  };

  constructor() {
    super();
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
    return this.model('groupon')
      .where({
        grouponId: id,
        status: ['!=', this.constructor.STATUS.NONE],
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
    return this.model('groupon')
      .where({
        grouponId,
        status: ['!=', this.constructor.STATUS.NONE],
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
    return 0 != await this.model('groupon')
      .where({
        grouponId,
        userId,
        status: ['!=', this.constructor.STATUS.NONE],
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
}