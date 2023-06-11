const Base = require('./base.js');

module.exports = class AdminFeedbackController extends Base {
  async listAction() {
    /** @type {number?} */
    const userId = this.get('userId');
    /** @type {string?} */
    const username = this.get('username');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {FeedbackService} */
    const feedbackService = this.service('feedback');

    const feedbackList = await feedbackService.querySelective(userId, username, page, limit, sort, order);

    return this.successList(feedbackList);
  }
};
