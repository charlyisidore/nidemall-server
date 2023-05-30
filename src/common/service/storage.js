const fs = require('node:fs');
const path = require('node:path');

module.exports = class StorageService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {Storage} storageInfo 
   * @returns 
   */
  add(storageInfo) {
    const now = new Date();
    return this.model('storage')
      .add(Object.assign(storageInfo, {
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
   * @param {File} file 
   * @returns {Promise<Storage>}
   */
  async store(file) {
    const config = think.config('storage');

    const key = await this.generateKey(file.name);
    const url = await this.storeLocal(file, key);

    const storageInfo = {
      name: file.name,
      type: file.type,
      size: file.size,
      key,
      url,
    };

    storageInfo.id = await this.add(storageInfo);

    return storageInfo;
  }

  storeLocal(file, key) {
    return new Promise((resolve, reject) => {
      const config = think.config('storage');

      let rootPath = config.local.path;

      if (!path.isAbsolute(rootPath)) {
        rootPath = path.join(think.ROOT_PATH, config.local.path);
      }

      if (!think.isExist(rootPath)) {
        think.mkdir(rootPath);
      }

      fs.rename(
        file.path,
        path.join(rootPath, key),
        (err) => {
          if (err) {
            reject(err);
          }
          resolve(`${config.local.baseUrl}${key}`);
        }
      );
    });
  }

  async generateKey(filename) {
    const ext = path.extname(filename);

    let key = null;
    let storageInfo = null;

    do {
      key = `${this.getRandomString(20)}${ext}`;
      storageInfo = await this.findByKey(key);
    } while (!think.isEmpty(storageInfo));

    return key;
  }

  getRandomString(num) {
    return Array.from(
      Array(num),
      () => Math.floor(Math.random() * 36).toString(36)
    ).join('');
  }
}