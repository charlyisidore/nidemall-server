const fs = require('node:fs');
const path = require('node:path');

module.exports = class LocalStorageService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string|Buffer|File} file 
   * @param {string} key 
   * @returns {Promise<string>} The file URL
   */
  store(file, key) {
    return new Promise((resolve, reject) => {
      const config = think.config('storage');
      const rootPath = this.getRootPath();
      const targetPath = path.join(rootPath, key);
      const url = `${config.local.baseUrl}${key}`;

      if (!think.isExist(rootPath)) {
        think.mkdir(rootPath);
      }

      if (think.isString(file) || file instanceof Buffer) {
        fs.writeFile(targetPath, file, (err) => {
          if (err) {
            reject(err);
          }
          resolve(url);
        });
      } else {
        fs.rename(file.path, targetPath, (err) => {
          if (err) {
            reject(err);
          }
          resolve(url);
        });
      }
    });
  }

  /**
   * 
   * @param {string} key 
   * @returns {Promise<void>}
   */
  delete(key) {
    return new Promise((resolve, reject) => {
      const rootPath = this.getRootPath();

      fs.unlink(
        path.join(rootPath, key),
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      )
    });
  }

  /**
   * 
   * @returns {string}
   */
  getRootPath() {
    const config = think.config('storage');

    let rootPath = config.local.path;
    if (!path.isAbsolute(rootPath)) {
      rootPath = path.join(think.ROOT_PATH, config.local.path);
    }
    return rootPath;
  }
}