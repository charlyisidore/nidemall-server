const Base = require('./base.js');

module.exports = class AdminNoticeController extends Base {
  async listAction() {
    /** @type {string?} */
    const title = this.get('title');
    /** @type {string?} */
    const content = this.get('content');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {NoticeService} */
    const noticeService = this.service('notice');

    const noticeList = await noticeService.querySelective(title, content, page, limit, sort, order);

    return this.successList(noticeList);
  }

  async createAction() {
    return this.success('todo');
  }

  async readAction() {
    return this.success('todo');
  }

  async updateAction() {
    return this.success('todo');
  }

  async deleteAction() {
    return this.success('todo');
  }

  async ['batch-deleteAction']() {
    return this.success('todo');
  }
};
