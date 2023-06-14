const path = require('node:path');

module.exports = class StorageService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string} key 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteByKey(key) {
    return this.model('storage')
      .where({ key })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Storage} storage 
   * @returns 
   */
  add(storage) {
    const now = new Date();
    return this.model('storage')
      .add(Object.assign(storage, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {string} key 
   * @returns {Promise<Storage|Record<string, never>}
   */
  findByKey(key) {
    return this.model('storage')
      .where({
        key,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {Storage} storage 
   * @returns {Promise<number>} The number of rows affected
   */
  update(storage) {
    const now = new Date();
    return this.model('storage')
      .where({
        id: storage.id,
      })
      .update(Object.assign(storage, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Storage|Record<string, never>>}
   */
  findById(id) {
    return this.model('storage')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {string?} key 
   * @param {string?} name 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Storage[]}>}
   */
  querySelective(key, name, page, limit, sort, order) {
    const model = this.model('storage');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(key)) {
      Object.assign(where, { key });
    }

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
   * 
   * @param {File} file 
   * @returns {Promise<Storage>}
   */
  async store(file) {
    /** @type {LocalStorageService} */
    const localStorageService = think.service('local_storage');

    const key = await this.generateKey(file.name);
    const url = await localStorageService.store(file, key);

    const storage = {
      name: file.name,
      type: file.type,
      size: file.size,
      key,
      url,
    };

    storage.id = await this.add(storage);

    return storage;
  }

  /**
   * 
   * @param {string} key 
   */
  delete(key) {
    /** @type {LocalStorageService} */
    const localStorageService = think.service('local_storage');

    return localStorageService.delete(key);
  }

  async generateKey(filename) {
    const ext = path.extname(filename);

    let key = null;
    let storage = null;

    do {
      key = `${this.getRandomString(20)}${ext}`;
      storage = await this.findByKey(key);
    } while (!think.isEmpty(storage));

    return key;
  }

  getRandomString(num) {
    return Array.from(
      Array(num),
      () => Math.floor(Math.random() * 36).toString(36)
    ).join('');
  }
}