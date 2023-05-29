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

  /**
   * 
   * @param {string} keyword 
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<Keyword[]>}
   */
  queryByKeyword(keyword, page, limit) {
    return this.model('keyword')
      .field('keyword')
      .distinct('keyword')
      .where({
        keyword: ['LIKE', `%${keyword}%`],
        deleted: false,
      })
      .page(page, limit)
      .select();
  }
}