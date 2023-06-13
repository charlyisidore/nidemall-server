module.exports = class NoticeService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string?} title 
   * @param {string?} content 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Notice[]}>}
   */
  querySelective(title, content, page, limit, sort, order) {
    const model = this.model('notice');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(title)) {
      Object.assign(where, {
        title: ['LIKE', `%${title}%`],
      })
    }

    if (!think.isTrueEmpty(content)) {
      Object.assign(where, {
        content: ['LIKE', `%${content}%`],
      })
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Notice|Record<string, never>>}
   */
  findById(id) {
    return this.model('notice')
      .where({ id })
      .find();
  }
}