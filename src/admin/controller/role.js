const Base = require('./base.js');

module.exports = class AdminRoleController extends Base {
  async listAction() {
    /** @type {string?} */
    const name = this.get('name');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {RoleService} */
    const roleService = this.service('role');

    const roleList = await roleService.querySelective(name, page, limit, sort, order);

    return this.successList(roleList);
  }

  async optionsAction() {
    /** @type {RoleService} */
    const roleService = this.service('role');

    const roleList = (await roleService.queryAll())
      .map((role) => ({
        value: role.id,
        label: role.name,
      }));

    return this.successList(roleList);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {RoleService} */
    const roleService = this.service('role');

    const role = await roleService.findById(id);

    return this.success(role);
  }

  async createAction() {
    const role = this.post([
      'name',
      'desc',
    ].join(','));

    /** @type {RoleService} */
    const roleService = this.service('role');

    const { ADMIN_RESPONSE } = roleService.getConstants();

    if (await roleService.checkExist(role.name)) {
      return this.fail(ADMIN_RESPONSE.NAME_EXIST, '角色已经存在');
    }

    role.id = await roleService.add(role);

    return this.success(role);
  }

  async updateAction() {
    const role = this.post([
      'id',
      'name',
      'desc',
    ].join(','));

    /** @type {RoleService} */
    const roleService = this.service('role');

    await roleService.updateById(role);

    return this.success(role);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {RoleService} */
    const roleService = this.service('role');

    const { ADMIN_RESPONSE } = roleService.getConstants();

    const adminList = await adminService.all();

    for (const admin of adminList) {
      for (const roleId of admin.roleIds) {
        if (roleId == id) {
          return this.fail(ADMIN_RESPONSE.USER_EXIST, '当前角色存在管理员，不能删除');
        }
      }
    }

    await roleService.deleteById(id);

    return this.success();
  }

  async permissionsAction() {
    return this.success('todo');
  }
};
