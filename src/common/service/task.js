module.exports = class TaskService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {() => any} callback 
   * @param {Date|string|number} dueTime 
   * @returns {number}
   */
  addTask(callback, dueTime) {
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
    return (delay > MAX_TIMEOUT) ?
      setTimeout(() => this.addTask(callback, dueTime), MAX_TIMEOUT) :
      setTimeout(callback, Math.max(0, delay));
  }

  /**
   * 
   * @param {number} task 
   */
  removeTask(task) {
    clearTimeout(task);
  }
}