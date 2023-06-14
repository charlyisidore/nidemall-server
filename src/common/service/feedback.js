const Base = require('./base.js');

module.exports = class FeedbackService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {Feedback} feedback 
   * @returns {Promise<number>} The ID inserted
   */
  async add(feedback) {
    const now = new Date();
    return this.model('feedback')
      .add(Object.assign(feedback, {
        addtime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number?} userId 
   * @param {string?} username 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Feedback[]}>}
   */
  async querySelective(userId, username, page, limit, sort, order) {
    const model = this.model('feedback');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, { userId });
    }

    if (!think.isTrueEmpty(username)) {
      Object.assign(where, {
        username: ['LIKE', `%${username}%`],
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
