const Base = require('./base.js');

module.exports = class SearchHistoryService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {SearchHistory} searchHistory 
   * @returns {Promise<number>} The ID inserted
   */
  async save(searchHistory) {
    const now = new Date();
    return this.model('search_history')
      .add(Object.assign(searchHistory, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} userId 
   * @returns {Promise<SearchHistory[]>}
   */
  async queryByUid(userId) {
    return this.model('search_history')
      .field('keyword')
      .where({
        userId,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} userId 
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteByUid(userId) {
    return this.model('search_history')
      .where({
        userId,
      })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {number?} userId 
   * @param {string?} keyword 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: SearchHistory[]}>}
   */
  async querySelective(userId, keyword, page, limit, sort, order) {
    const model = this.model('search_history');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(userId)) {
      Object.assign(where, { userId });
    }

    if (!think.isTrueEmpty(keyword)) {
      Object.assign(where, {
        keyword: ['LIKE', `%${keyword}%`],
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
