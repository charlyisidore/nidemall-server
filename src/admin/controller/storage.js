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
    /** @type {File} */
    const file = this.file('file');

    /** @type {StorageService} */
    const storageService = this.service('storage');

    const storage = await storageService.store(file);

    return this.success(storage);
  }

  async readAction() {
    /** @type {number} */
    const id = this.post('id');
    /** @type {StorageService} */
    const storageService = this.service('storage');

    const storage = await storageService.findById(id);

    if (think.isEmpty(storage)) {
      return this.badArgumentValue();
    }

    return this.success(storage);
  }

  async updateAction() {
    const storage = this.post([
      'id',
      'name',
    ].join(','));

    /** @type {StorageService} */
    const storageService = this.service('storage');

    if (!await storageService.update(storage)) {
      return this.updatedDataFailed();
    }

    return this.success(storage);
  }

  async deleteAction() {
    /** @type {string} */
    const key = this.post('key');
    /** @type {StorageService} */
    const storageService = this.service('storage');

    await storageService.deleteByKey(key);
    await storageService.delete(key);

    return this.success();
  }
};
