module.exports = class BaseController extends think.Controller {
  /** Stack of transactions */
  _transactions = [];

  /**
   * Incorrect parameters
   */
  badArgument() {
    return this.fail(401, '参数不对');
  }

  /**
   * Incorrect parameter value
   */
  badArgumentValue() {
    return this.fail(402, '参数值不对');
  }

  /**
   * Please login
   */
  unlogin() {
    return this.fail(501, '请登录');
  }

  /**
   * System internal error
   */
  serious() {
    return this.fail(502, '系统内部错误');
  }

  /**
   * Business not supported
   */
  unsupport() {
    return this.fail(503, '业务不支持');
  }

  /**
   * Update data is no longer valid
   */
  updatedDateExpired() {
    return this.fail(504, '更新数据已经失效');
  }

  /**
   * Update data is no longer valid
   */
  updatedDataFailed() {
    return this.fail(505, '更新数据失败');
  }

  /**
   * No operation privileges
   */
  unauthz() {
    return this.fail(506, '无操作权限');
  }

  /**
   * Success response
   * @param {any} data `data` property
   * @param {string?} message `errmsg` property
   */
  success(data, message = '成功') {
    return think.isUndefined(data) ?
      this.json({ errno: 0, errmsg: message }) :
      super.success(data, message);
  }

  /**
   * Convert lists obtained with `Model.countSelect()` to success responses
   * @param {{ pageSize: number, currentPage: number, count: number, totalPages: number, data: any[] }|any[]} list 
   * @param {{ pageSize: number, currentPage: number, count: number, totalPages: number, data: any[] }|any[]|undefined} pagedList 
   * @returns {{ total: number, pages: number, limit: number, page: number, list: any[] }}
   */
  successList(list, pagedList) {
    const data = {};

    if (think.isNullOrUndefined(pagedList)) {
      pagedList = list;
    }

    if (Array.isArray(pagedList)) {
      Object.assign(data, {
        total: pagedList.length,
        pages: 1,
        limit: pagedList.length,
        page: 1,
      });
    } else {
      Object.assign(data, {
        total: pagedList.count,
        pages: pagedList.totalPages,
        limit: pagedList.pageSize,
        page: pagedList.totalPages > 0 ? pagedList.currentPage : 0,
      });
    }

    Object.assign(data, {
      list: Array.isArray(list) ? list : list.data,
    });

    return this.success(data);
  }

  /**
   * Create a service and listen to its `model()` method calls.
   * @param {string} name 
   * @param {string?} module 
   * @param  {...any} args 
   * @returns {think.Service}
   */
  service(name, module, ...args) {
    const service = super.service(name, module, ...args);
    service.on('model', (model) => this._onServiceModel(model));
    return service;
  }

  /**
   * Make a database transaction.
   * @param {() => any} callback 
   * @returns 
   */
  async transaction(callback) {
    try {
      await this._startTrans();
      const result = await callback();
      await this._commit();
      return result;
    } catch (e) {
      await this._rollback();
      throw e;
    } finally {
      await this._finishTrans();
    }
  }

  /**
   * Helper function to wait for all promises to finish before throwing an error.
   * @param {Promise<any>[]} promises 
   */
  async promiseAllFinished(promises) {
    return (await Promise.allSettled(promises))
      .map((result) => {
        if ('rejected' == result.status) {
          throw result.reason;
        }
        return result.value;
      });
  }

  /**
   * Triggered when a service calls its `model()` method.
   * Use a shared database connection if a transaction exists.
   * @param {think.Model} model 
   */
  _onServiceModel(model) {
    if (think.isEmpty(this._transactions)) {
      // No transaction
      return;
    }
    const last = this._transactions[this._transactions.length - 1];
    model.db(last.db());
  }

  /**
   * Start a transaction.
   */
  async _startTrans() {
    const model = this.model();
    await model.startTrans();
    this._transactions.push(model);
  }

  /**
   * Finish a transaction.
   */
  async _finishTrans() {
    this._transactions.pop();
  }

  /**
   * Called after a transaction when no error occurred.
   */
  async _commit() {
    const model = this._transactions[this._transactions.length - 1];
    await model.commit();
  }

  /**
   * Called after a transaction when an error occurred.
   */
  async _rollback() {
    const model = this._transactions[this._transactions.length - 1];
    await model.rollback();
  }
};
