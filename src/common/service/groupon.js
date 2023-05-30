module.exports = class GrouponService extends think.Service {
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

  getConstants() {
    return {
      GROUPON: {
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