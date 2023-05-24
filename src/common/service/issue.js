module.exports = class IssueService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string?} question 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   */
  querySelective(question, page, limit, sort, order) {
    const model = this.model('issue');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(question)) {
      Object.assign(where, {
        question: ['LIKE', `%${question}%`],
      })
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .select();
  }
}