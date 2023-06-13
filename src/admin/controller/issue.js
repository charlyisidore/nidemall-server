const Base = require('./base.js');

module.exports = class AdminIssueController extends Base {
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

    const issueList = await issueService.querySelective(question, page, limit, sort, order);

    return this.successList(issueList);
  }

  async createAction() {
    const issue = this.post([
      'question',
      'answer',
    ].join(','));

    /** @type {IssueService} */
    const issueService = this.service('issue');

    issue.id = await issueService.add(issue);

    return this.success(issue);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');
    /** @type {IssueService} */
    const issueService = this.service('issue');

    const issue = await issueService.findById(id);

    return this.success(issue);
  }

  async updateAction() {
    const issue = this.post([
      'id',
      'question',
      'answer',
    ].join(','));

    /** @type {IssueService} */
    const issueService = this.service('issue');

    if (!await issueService.updateById(issue)) {
      return this.updatedDataFailed();
    }

    return this.success(issue);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');
    /** @type {IssueService} */
    const issueService = this.service('issue');

    await issueService.deleteById(id);

    return this.success();
  }
};
