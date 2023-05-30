const Base = require('./base.js');

module.exports = class WxStorageController extends Base {
  async uploadAction() {
    /** @type {File} */
    const file = this.file('file');

    /** @type {StorageService} */
    const storageService = this.service('storage');

    const storageInfo = await storageService.store(file);

    return this.success(storageInfo);
  }
};
