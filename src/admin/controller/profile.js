const Base = require('./base.js');

module.exports = class AdminProfileController extends Base {
  async passwordAction() {
    const adminId = this.getAdminId();
    /** @type {string} */
    const oldPassword = this.post('oldPassword');
    /** @type {string} */
    const newPassword = this.post('newPassword');

    /** @type {AdminService} */
    const adminService = this.service('admin');

    const { ADMIN_RESPONSE } = adminService.getConstants();

    const admin = await adminService.findAdminById(adminId);

    if (think.isEmpty(admin)) {
      return this.unauthz();
    }

    if (!await adminService.comparePassword(oldPassword, admin.password)) {
      return this.fail(ADMIN_RESPONSE.INVALID_ACCOUNT, '账号密码不对');
    }

    Object.assign(admin, {
      password: await adminService.hashPassword(password),
    });

    await adminService.updateById(admin);

    return this.success();
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
    const title = this.get('title');
    /** @type {string?} */
    const type = this.get('type');
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
    const adminId = this.getAdminId();
    /** @type {number} */
    const noticeId = this.get('noticeId');

    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {NoticeService} */
    const noticeService = this.service('notice');
    /** @type {NoticeAdminService} */
    const noticeAdminService = this.service('notice_admin');

    const noticeAdmin = await noticeAdminService.find(noticeId, adminId);

    if (think.isEmpty(noticeAdmin)) {
      return this.badArgumentValue();
    }

    Object.assign(noticeAdmin, {
      readTime: now,
    });

    await noticeAdminService.update(noticeAdmin);

    const notice = await noticeService.findById(noticeId);

    const data = {
      title: notice.title,
      content: notice.content,
      time: notice.updateTime,
    };

    if (notice.adminId) {
      const admin = await adminService.findById(notice.adminId);
      Object.assign(data, {
        admin: admin.username,
        avatar: admin.avatar,
      });
    } else {
      Object.assign(data, {
        admin: '系统',
      });
    }

    return this.success(data);
  }

  async bcatnoticeAction() {
    const adminId = this.getAdminId();
    /** @type {number[]} */
    const ids = this.get('ids');

    /** @type {NoticeAdminService} */
    const noticeAdminService = this.service('notice_admin');

    await noticeAdminService.markReadByIds(ids, adminId);

    return this.success();
  }

  async rmnoticeAction() {
    const adminId = this.getAdminId();
    /** @type {number} */
    const id = this.get('id');

    /** @type {NoticeAdminService} */
    const noticeAdminService = this.service('notice_admin');

    await noticeAdminService.deleteById(id, adminId);

    return this.success();
  }

  async brmnoticeAction() {
    const adminId = this.getAdminId();
    /** @type {number[]} */
    const ids = this.get('ids');

    /** @type {NoticeAdminService} */
    const noticeAdminService = this.service('notice_admin');

    await noticeAdminService.deleteByIds(ids, adminId);

    return this.success();
  }
};
