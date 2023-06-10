const Base = require('./base.js');

module.exports = class AdminUserController extends Base {
  async listAction() {
    /** @type {string?} */
    const username = this.get('username');
    /** @type {string?} */
    const mobile = this.get('mobile');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {UserService} */
    const userService = this.service('user');

    const userList = await userService.querySelective(username, mobile, page, limit, sort, order);

    return this.successList(userList);
  }

  async detailAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {UserService} */
    const userService = this.service('user');

    const user = await userService.findById(id);

    return this.success(user);
  }

  async updateAction() {
    const user = this.post([
      'id',
      'nickname',
      'mobile',
      'gender',
      'userLevel',
      'status',
    ].join(','));

    /** @type {UserService} */
    const userService = this.service('user');

    return this.success(await userService.updateById(user));
  }
};
