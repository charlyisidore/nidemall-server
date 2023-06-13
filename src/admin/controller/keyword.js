const Base = require('./base.js');

module.exports = class AdminKeywordController extends Base {
  async listAction() {
    /** @type {string?} */
    const keyword = this.get('keyword');
    /** @type {string?} */
    const url = this.get('url');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {KeywordService} */
    const keywordService = this.service('keyword');

    const keywordList = await keywordService.querySelective(keyword, url, page, limit, sort, order);

    return this.successList(keywordList);
  }

  async createAction() {
    const keyword = this.post([
      'keyword',
      'url',
      'isHot',
      'isDefault',
    ].join(','));

    /** @type {KeywordService} */
    const keywordService = this.service('keyword');

    keyword.id = await keywordService.add(keyword);

    return this.success(keyword);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');
    /** @type {KeywordService} */
    const keywordService = this.service('keyword');

    const keyword = await keywordService.findById(id);

    return this.success(keyword);
  }

  async updateAction() {
    const keyword = this.post([
      'id',
      'keyword',
      'url',
      'isHot',
      'isDefault',
    ].join(','));

    /** @type {KeywordService} */
    const keywordService = this.service('keyword');

    if (!await keywordService.updateById(keyword)) {
      return this.updatedDataFailed();
    }

    return this.success(keyword);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');
    /** @type {KeywordService} */
    const keywordService = this.service('keyword');

    await keywordService.deleteById(id);

    return this.success();
  }
};
