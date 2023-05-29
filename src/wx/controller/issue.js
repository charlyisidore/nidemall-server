const Base = require('./base.js');

module.exports = class WxIssueController extends Base {
  async listAction() {
    /** @type {string?} */
    const question = this.get('question');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {IssueService} */
    const issueService = this.service('issue');
    const issueList = await issueService.querySelective(
      question,
      page,
      limit,
      sort,
      order
    );

    return this.successList(issueList);
  }
};
