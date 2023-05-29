const Base = require('./base.js');

module.exports = class WxSearchController extends Base {
  async indexAction() {
    const userId = this.getUserId();

    /** @type {KeywordService} */
    const keywordService = this.service('keyword');
    /** @type {SearchHistoryService} */
    const searchHistoryService = this.service('search_history');

    const defaultKeyword = await keywordService.queryDefault();
    const hotKeywordList = await keywordService.queryHots();

    const historyKeywordList = think.isNullOrUndefined(userId) ?
      [] :
      await searchHistoryService.queryByUid(userId);

    return this.success({
      defaultKeyword,
      hotKeywordList,
      historyKeywordList,
    });
  }

  async helperAction() {
    return this.success('todo');
  }

  async clearhistoryAction() {
    return this.success('todo');
  }
};
