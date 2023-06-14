const Base = require('./base.js');

module.exports = class IssueService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteById(id) {
    return this.model('issue')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Issue} issue 
   * @returns {Promise<number>} The ID inserted
   */
  add(issue) {
    const now = new Date();
    return this.model('issue')
      .add(Object.assign(issue, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {string?} question 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Issue[]}>}
   */
  querySelective(question, page, limit, sort, order) {
    const model = this.model('issue');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(question)) {
      Object.assign(where, {
        question: ['LIKE', `%${question}%`],
      });
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
   * @param {Issue} issue 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(issue) {
    const now = new Date();
    return this.model('issue')
      .where({
        id: issue.id,
      })
      .update(Object.assign(issue, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Issue|Record<string, never>>}
   */
  findById(id) {
    return this.model('issue')
      .where({ id })
      .find();
  }
}
