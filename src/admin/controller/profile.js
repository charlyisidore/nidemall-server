const Base = require('./base.js');

module.exports = class AdminProfileController extends Base {
  async passwordAction() {
    return this.success('todo');
  }

  async nnoticeAction() {
    const adminId = this.getAdminId();
    /** @type {NoticeAdminService} */
    const noticeAdminService = this.service('notice_admin');

    const count = await noticeAdminService.countUnread(adminId);

    return this.success(count);
  }

  async lsnoticeAction() {
    const adminId = this.getAdminId();
    /** @type {string?} */
    const title = this.post('title');
    /** @type {string?} */
    const type = this.post('type');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {NoticeAdminService} */
    const noticeAdminService = this.service('notice_admin');

    const noticeList = await noticeAdminService.querySelective(
      title,
      type,
      adminId,
      page,
      limit,
      sort,
      order
    );

    return this.successList(noticeList);
  }

  async catnoticeAction() {
    return this.success('todo');
  }

  async bcatnoticeAction() {
    return this.success('todo');
  }

  async rmnoticeAction() {
    return this.success('todo');
  }

  async brmnoticeAction() {
    return this.success('todo');
  }
};
