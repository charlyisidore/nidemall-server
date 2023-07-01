const Base = require('./base.js');

module.exports = class RoleService extends Base {
  /**
   * .
   * @param {number[]} roleIds .
   * @returns {Promise<string[]>}
   */
  async queryByIds(roleIds) {
    if (0 == roleIds.length) {
      return [];
    }

    return (await this.model('role')
      .where({
        id: ['IN', roleIds],
        enabled: true,
        deleted: false,
      })
      .select())
      .map((role) => role.name);
  }

  /**
   * .
   * @param {string?} name .
   * @param {number} page .
   * @param {number} limit .
   * @param {string} sort .
   * @param {string} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Role[]}>}
   */
  async querySelective(name, page, limit, sort, order) {
    const model = this.model('role');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(name)) {
      Object.assign(where, {
        name: ['LIKE', `%${name}%`],
      });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<Role|Record<string, never>>}
   */
  async findById(id) {
    return this.model('role')
      .where({ id })
      .find();
  }

  /**
   * .
   * @param {Role} role .
   * @returns {Promise<number>} The ID inserted
   */
  async add(role) {
    const now = new Date();
    return this.model('role')
      .add(Object.assign(role, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('role')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * .
   * @param {Role} role .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(role) {
    const now = new Date();
    return this.model('role')
      .where({
        id: role.id,
      })
      .update(Object.assign(role, {
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {string} name .
   * @returns {Promise<boolean>}
   */
  async checkExist(name) {
    return 0 != (await this.model('role')
      .where({
        name,
        deleted: false,
      })
      .count());
  }

  /**
   * .
   * @returns {Promise<Role[]>}
   */
  async queryAll() {
    return this.model('role')
      .where({
        deleted: false,
      })
      .select();
  }

  getConstants() {
    return {
      ADMIN_RESPONSE: {
        NAME_EXIST: 640,
        SUPER_SUPERMISSION: 641,
        USER_EXIST: 642,
      },
    };
  }
};
