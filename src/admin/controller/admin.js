const Base = require('./base.js');

module.exports = class AdminAdminController extends Base {
  async listAction() {
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

    /** @type {AdminService} */
    const adminService = this.service('admin');

    const adminList = await adminService.querySelective(username, page, limit, sort, order);

    return this.successList(adminList);
  }

  async createAction() {
    const admin = this.post([
      'username',
      'password',
      'avatar',
      'roleIds',
    ].join(','));

    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {LogService} */
    const logService = this.service('log');

    const { ADMIN_RESPONSE } = adminService.getConstants();

    const adminList = await adminService.findAdminByUsername(admin.username);

    if (adminList.length > 0) {
      return this.fail(ADMIN_RESPONSE.NAME_EXIST, '管理员已经存在');
    }

    Object.assign(admin, {
      password: await adminService.hashPassword(admin.password),
    });

    admin.id = await adminService.add(admin);
    await logService.logAuthSucceed('添加管理员', admin.username, this.ctx);

    return this.success(admin);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {AdminService} */
    const adminService = this.service('admin');

    const admin = await adminService.findById(id);

    return this.success(admin);
  }

  async updateAction() {
    const admin = this.post([
      'id',
      'username',
      'avatar',
      'roleIds',
    ].join(','));

    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {LogService} */
    const logService = this.service('log');

    if (!await adminService.updateById(admin)) {
      return this.updatedDataFailed();
    }

    await logService.logAuthSucceed('编辑管理员', admin.username, this.ctx);

    return this.success(admin);
  }

  async deleteAction() {
    const adminId = this.getAdminId();
    /** @type {number} */
    const id = this.post('id');

    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {LogService} */
    const logService = this.service('log');

    const { ADMIN_RESPONSE } = adminService.getConstants();

    if (adminId == id) {
      return this.fail(ADMIN_RESPONSE.DELETE_NOT_ALLOWED, '管理员不能删除自己账号');
    }

    const admin = await adminService.findById(id);

    await adminService.deleteById(id);
    await logService.logAuthSucceed('删除管理员', admin.username, this.ctx);

    return this.success();
  }
};
