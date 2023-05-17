module.exports = class extends think.Service {
  static FIELDS = [
    'id',
    'title',
    'subtitle',
    'price',
    'picUrl',
    'readCount',
  ].join(',');

  constructor() {
    super();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   */
  queryList(page, limit, sort = 'addTime', order = 'DESC') {
    return this.model('topic')
      .field(this.constructor.FIELDS)
      .where({
        deleted: false,
      })
      .order({ [sort]: order })
      .page(page, limit)
      .select();
  }
}