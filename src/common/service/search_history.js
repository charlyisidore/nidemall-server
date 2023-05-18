module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {object} searchHistory 
   */
  save(searchHistory) {
    const now = Date.now();
    return this.model('search_history')
      .add({
        addTime: now,
        updateTime: now,
        ...searchHistory,
      });
  }
}