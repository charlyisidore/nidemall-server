module.exports = class PermissionService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number|number[]|null} roleId 
   * @returns {Promise<string[]>}
   */
  async queryByRoleId(roleId) {
    const where = {
      deleted: false,
    };

    if (think.isArray(roleId)) {
      if (think.isEmpty(roleId)) {
        return [];
      }
      Object.assign(where, {
        roleId: ['IN', roleId],
      });
    } else {
      if (think.isNullOrUndefined(roleId)) {
        return [];
      }
      Object.assign(where, {
        roleId,
      });
    }

    return (await this.model('permission')
      .where(where)
      .select())
      .map((permission) => permission.permission);
  }

  /**
   * 
   * @param {number|number[]} roleId 
   * @returns {Promise<boolean>}
   */
  async checkSuperPermission(roleId) {
    const where = {
      permission: '*',
      deleted: false,
    };

    if (think.isArray(roleId)) {
      if (think.isEmpty(roleId)) {
        return false;
      }
      Object.assign(where, {
        roleId: ['IN', roleId],
      });
    } else {
      if (think.isNullOrUndefined(roleId)) {
        return false;
      }
      Object.assign(where, {
        roleId,
      });
    }

    return 0 != (await this.model('permission')
      .where(where)
      .count());
  }

  /**
   * 
   * @param {number} roleId 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteByRoleId(roleId) {
    return this.model('permission')
      .where({
        roleId,
        deleted: false,
      })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Permission} permission 
   * @returns {Promise<number>} The ID inserted
   */
  add(permission) {
    const now = new Date();
    return this.model('permission')
      .add(Object.assign(permission, {
        addTime: now,
        updateTime: now,
      }));
  }
}