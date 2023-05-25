module.exports = class SearchHistoryService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {object} searchHistory 
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
}