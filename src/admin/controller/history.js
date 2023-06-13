const Base = require('./base.js');

module.exports = class AdminHistoryController extends Base {
  async listAction() {
    /** @type {number?} */
    const userId = this.get('userId');
    /** @type {string?} */
    const keyword = this.get('keyword');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {SearchHistoryService} */
    const searchHistoryService = this.service('search_history');

    const historyList = await searchHistoryService.querySelective(userId, keyword, page, limit, sort, order);

    return this.successList(historyList);
  }
};
