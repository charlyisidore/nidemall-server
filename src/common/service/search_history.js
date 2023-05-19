module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {object} searchHistory 
   */
  save(searchHistory) {
    const now = new Date();
    return this.model('search_history')
      .add({
        addTime: now,
        updateTime: now,
        ...searchHistory,
      });
  }
}