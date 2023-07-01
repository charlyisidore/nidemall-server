module.exports = class extends think.Logic {
  /**
   * Check permissions.
   */
  async __before() {
    /** @type {PermissionService} */
    const permissionService = this.service('permission');

    const api = `${this.ctx.method} ${this.ctx.path}`;
    const permission = permissionService.listPermission()
      .find((p) => p.api == api);

    if (!think.isNullOrUndefined(permission)) {
      const adminId = this.getAdminId();

      if (think.isNullOrUndefined(adminId)) {
        return this.unlogin();
      }

      /** @type {AdminService} */
      const adminService = this.service('admin');

      const admin = await adminService.findAdminById(adminId);
      if (think.isEmpty(admin)) {
        return this.unlogin();
      }

      const requiresPermissions = permission.requiresPermissions.value[0];
      if (!await permissionService.hasPermission(admin.roleIds, requiresPermissions)) {
        return this.unauthz();
      }
    }
  }

  /**
   * Check authentication.
   */
  async __after() {
    if (this.requiresAuthentication) {
      const adminId = this.getAdminId();

      if (think.isNullOrUndefined(adminId)) {
        return this.unlogin();
      }

      /** @type {AdminService} */
      const adminService = this.service('admin');

      const admin = await adminService.findAdminById(adminId);
      if (think.isEmpty(admin)) {
        return this.unlogin();
      }
    }
    return super.__after();
  }

  /**
   * .
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
