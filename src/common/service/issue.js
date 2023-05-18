module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string} question 
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

    if (question == '') {
      Object.assign(where, {
        question: ['LIKE', `%${question}%`],
      })
    }

    if (undefined !== sort && undefined !== order) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .select();
  }
}