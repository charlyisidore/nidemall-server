module.exports = class SearchHistoryService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {SearchHistory} searchHistory 
   * @returns {Promise<number>} The ID inserted
   */
  save(searchHistory) {
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
  queryByUid(userId) {
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
  deleteByUid(userId) {
    return this.model('search_history')
      .where({
        userId,
      })
      .update({
        deleted: true,
      });
  }
}