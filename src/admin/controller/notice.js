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
    const adminId = this.getAdminId();
    const notice = this.post([
      'title',
      'content',
    ].join(','));

    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {NoticeService} */
    const noticeService = this.service('notice');
    /** @type {NoticeAdminService} */
    const noticeAdminService = this.service('notice_admin');

    Object.assign(notice, {
      adminId,
    });

    notice.id = await noticeService.add(notice);

    const adminList = await adminService.all();

    const noticeAdmin = {
      noticeId: notice.id,
      noticeTitle: notice.title,
    };

    await Promise.all(
      adminList.map(async (admin) => {
        Object.assign(noticeAdmin, {
          adminId: admin.id,
        });
        await noticeAdminService.add(noticeAdmin);
      })
    );

    return this.success(notice);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {NoticeService} */
    const noticeService = this.service('notice');
    /** @type {NoticeAdminService} */
    const noticeAdminService = this.service('notice_admin');

    const notice = await noticeService.findById(id);
    const noticeAdminList = await noticeAdminService.queryByNoticeId(id);

    return this.success({
      notice,
      noticeAdminList,
    });
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
