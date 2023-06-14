const Base = require('./base.js');

/**
 * Helper service for database transactions.
 */
module.exports = class DbService extends Base {
  /** Model name used for transactions */
  static MODEL_NAME = 'ad';

  /** Store models used for transactions */
  _stack = [];

  constructor() {
    super();
  }

  /**
   * Listen to `model` events emitted from services.
   * @param {object[]} services 
   */
  listen(services) {
    if (!think.isArray(services)) {
      services = [services];
    }
    services.forEach(
      (service) => service
        .on('model', (model) => this._onModel(model))
    );
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
  async promiseAll(promises) {
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
  _onModel(model) {
    if (think.isEmpty(this._stack)) {
      // No transaction
      return;
    }
    const last = this._stack[this._stack.length - 1];
    model.db(last.db());
  }

  /**
   * Start a transaction.
   */
  async _startTrans() {
    const model = this.model(this.constructor.MODEL_NAME);
    await model.startTrans();
    this._stack.push(model);
  }

  /**
   * Finish a transaction.
   */
  async _finishTrans() {
    this._stack.pop();
  }

  /**
   * Called after a transaction when no error occurred.
   */
  async _commit() {
    const model = this._stack[this._stack.length - 1];
    await model.commit();
  }

  /**
   * Called after a transaction when an error occurred.
   */
  async _rollback() {
    const model = this._stack[this._stack.length - 1];
    await model.rollback();
  }
}
