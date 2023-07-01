const Base = require('./base.js');

module.exports = class LogService extends Base {
  /**
   * .
   * @param {string?} name .
   * @param {number} page .
   * @param {number} limit .
   * @param {string?} sort .
   * @param {string?} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Log[]}>}
   */
  async querySelective(name, page, limit, sort, order) {
    const model = this.model('log');
    const where = {
      deleted: false,
    };

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
   * .
   * @param {string} action .
   * @param {string} result .
   */
  async logGeneralSucceed(action, result = '', ctx) {
    const { TYPE } = this.getConstants();
    return this.logAdmin(TYPE.GENERAL, action, true, result, '', ctx);
  }

  /**
   * .
   * @param {string} action .
   * @param {string} error .
   */
  async logGeneralFail(action, error = '', ctx) {
    const { TYPE } = this.getConstants();
    return this.logAdmin(TYPE.GENERAL, action, false, error, '', ctx);
  }

  /**
   * .
   * @param {string} action .
   * @param {string} result .
   */
  async logAuthSucceed(action, result = '', ctx) {
    const { TYPE } = this.getConstants();
    return this.logAdmin(TYPE.AUTH, action, true, result, '', ctx);
  }

  /**
   * .
   * @param {string} action .
   * @param {string} error .
   */
  async logAuthFail(action, error = '', ctx) {
    const { TYPE } = this.getConstants();
    return this.logAdmin(TYPE.AUTH, action, false, error, '', ctx);
  }

  /**
   * .
   * @param {string} action .
   * @param {string} result .
   */
  async logOrderSucceed(action, result = '', ctx) {
    const { TYPE } = this.getConstants();
    return this.logAdmin(TYPE.ORDER, action, true, result, '', ctx);
  }

  /**
   * .
   * @param {string} action .
   * @param {string} error .
   */
  async logOrderFail(action, error = '', ctx) {
    const { TYPE } = this.getConstants();
    return this.logAdmin(TYPE.ORDER, action, false, error, '', ctx);
  }

  /**
   * .
   * @param {string} action .
   * @param {string} result .
   */
  async logOtherSucceed(action, result = '', ctx) {
    const { TYPE } = this.getConstants();
    return this.logAdmin(TYPE.OTHER, action, true, result, '', ctx);
  }

  /**
   * .
   * @param {string} action .
   * @param {string} error .
   */
  async logOtherFail(action, error = '', ctx) {
    const { TYPE } = this.getConstants();
    return this.logAdmin(TYPE.OTHER, action, false, error, '', ctx);
  }

  /**
   * .
   * @param {number} type .
   * @param {string} action .
   * @param {boolean} succeed .
   * @param {string} result .
   * @param {string} comment .
   * @param {any} ctx .
   * @returns {Promise<number>} The ID inserted
   */
  async logAdmin(type, action, succeed, result, comment, ctx) {
    const log = {
      type,
      action,
      succeed,
      result,
      comment,
      admin: ctx?.state?.admin?.username ?? '匿名用户',
    };

    if (!think.isNullOrUndefined(ctx)) {
      Object.assign(log, {
        ip: ctx.ip,
      });
    }

    return this.model('log').add(log);
  }

  getConstants() {
    return {
      TYPE: {
        GENERAL: 0,
        AUTH: 1,
        ORDER: 2,
        OTHER: 3,
      },
    };
  }
};
