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

    const historyKeywordList = think.isNullOrUndefined(userId)
      ? []
      : await searchHistoryService.queryByUid(userId);

    return this.success({
      defaultKeyword,
      hotKeywordList,
      historyKeywordList,
    });
  }

  async helperAction() {
    /** @type {string} */
    const keyword = this.get('keyword');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');

    /** @type {KeywordService} */
    const keywordService = this.service('keyword');

    const keywordList = await keywordService.queryByKeyword(keyword, page, limit);

    return this.success(keywordList.map((k) => k.keyword));
  }

  async clearhistoryAction() {
    const userId = this.getUserId();

    /** @type {SearchHistoryService} */
    const searchHistoryService = this.service('search_history');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    await searchHistoryService.deleteByUid(userId);

    return this.success();
  }
};
