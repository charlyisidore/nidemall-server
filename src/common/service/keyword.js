module.exports = class KeywordService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @returns {Promise<Keyword>}
   */
  queryDefault() {
    return this.model('keyword')
      .where({
        isDefault: true,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @returns {Promise<Keyword[]>}
   */
  queryHots() {
    return this.model('keyword')
      .where({
        isHot: true,
        deleted: false,
      })
      .select();
  }
}