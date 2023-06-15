module.exports = class extends think.Logic {
  async __after() {
    if (!think.isEmpty(this.requiresPermissions)) {
      const adminId = this.getAdminId();

      if (think.isNullOrUndefined(adminId)) {
        return this.unlogin();
      }

      /** @type {AdminService} */
      const adminService = this.service('admin');

      const admin = await adminService.findById(adminId);
      if (think.isEmpty(admin)) {
        return this.unlogin();
      }

      /** @type {PermissionService} */
      const permissionService = this.service('permission');

      if (!await permissionService.hasPermission(admin.roleIds, this.requiresPermissions)) {
        return this.unauthz();
      }
    }

    return await super.__after();
  }

  /**
   * 
   * @returns {number|null}
   */
  getAdminId() {
    return this.ctx.state.adminId;
  }

  /**
   * Please login
   */
  unlogin() {
    return this.fail(501, '请登录');
  }

  /**
   * No operation privileges
   */
  unauthz() {
    return this.fail(506, '无操作权限');
  }
};
