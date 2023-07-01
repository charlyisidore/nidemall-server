const Base = require('./base.js');

module.exports = class TaskService extends Base {
  _tasks = {};

  /**
   * .
   * @param {() => any} callback .
   * @param {Date|string|number} dueTime .
   * @param {string?} key .
   * @returns {number}
   */
  addTask(callback, dueTime, key) {
    const MAX_TIMEOUT = 2147483647;
    let time = dueTime;

    if (think.isString(time)) {
      time = new Date(time);
    }

    if (think.isDate(time)) {
      time = time.getTime();
    }

    const now = new Date();
    const delay = time - now.getTime();

    // https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value
    const id = (delay > MAX_TIMEOUT)
      ? setTimeout(() => this.addTask(callback, dueTime), MAX_TIMEOUT)
      : setTimeout(callback, Math.max(0, delay));

    if (!think.isNullOrUndefined(key)) {
      this._tasks[key] = id;
    }
    return id;
  }

  /**
   * .
   * @param {number|string} idOrKey .
   */
  removeTask(idOrKey) {
    let id = idOrKey;
    if (think.isString(idOrKey)) {
      if (!(idOrKey in this._tasks)) {
        return;
      }
      id = this._tasks[idOrKey];
      delete this._tasks[idOrKey];
    }
    return clearTimeout(id);
  }
};
