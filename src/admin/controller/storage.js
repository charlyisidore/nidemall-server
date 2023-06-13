const Base = require('./base.js');

module.exports = class AdminStorageController extends Base {
  async listAction() {
    /** @type {string?} */
    const key = this.get('key');
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

    /** @type {StorageService} */
    const storageService = this.service('storage');

    const storageList = await storageService.querySelective(key, name, page, limit, sort, order);

    return this.successList(storageList);
  }

  async createAction() {
    return this.success('todo');
  }

  async readAction() {
    return this.success('todo');
  }

  async updateAction() {
    return this.success('todo');
  }

  async deleteAction() {
    return this.success('todo');
  }
};
