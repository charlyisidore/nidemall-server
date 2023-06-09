module.exports = class LogService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string} action 
   * @param {string} result 
   */
  logGeneralSucceed(action, result = '', ctx) {
    const { TYPE } = this.getConstants();
    this.logAdmin(TYPE.GENERAL, action, true, result, '', ctx);
  }

  /**
   * 
   * @param {string} action 
   * @param {string} error 
   */
  logGeneralFail(action, error = '', ctx) {
    const { TYPE } = this.getConstants();
    this.logAdmin(TYPE.GENERAL, action, false, error, '', ctx);
  }

  /**
   * 
   * @param {string} action 
   * @param {string} result 
   */
  logAuthSucceed(action, result = '', ctx) {
    const { TYPE } = this.getConstants();
    this.logAdmin(TYPE.AUTH, action, true, result, '', ctx);
  }

  /**
   * 
   * @param {string} action 
   * @param {string} error 
   */
  logAuthFail(action, error = '', ctx) {
    const { TYPE } = this.getConstants();
    this.logAdmin(TYPE.AUTH, action, false, error, '', ctx);
  }

  /**
   * 
   * @param {string} action 
   * @param {string} result 
   */
  logOrderSucceed(action, result = '', ctx) {
    const { TYPE } = this.getConstants();
    this.logAdmin(TYPE.ORDER, action, true, result, '', ctx);
  }

  /**
   * 
   * @param {string} action 
   * @param {string} error 
   */
  logOrderFail(action, error = '', ctx) {
    const { TYPE } = this.getConstants();
    this.logAdmin(TYPE.ORDER, action, false, error, '', ctx);
  }

  /**
   * 
   * @param {string} action 
   * @param {string} result 
   */
  logOtherSucceed(action, result = '', ctx) {
    const { TYPE } = this.getConstants();
    this.logAdmin(TYPE.OTHER, action, true, result, '', ctx);
  }

  /**
   * 
   * @param {string} action 
   * @param {string} error 
   */
  logOtherFail(action, error = '', ctx) {
    const { TYPE } = this.getConstants();
    this.logAdmin(TYPE.OTHER, action, false, error, '', ctx);
  }

  logAdmin(type, action, succeed, result, comment, ctx) {
    const log = {
      type,
      action,
      succeed,
      result,
      comment,
      // TODO: find admin
      admin: '匿名用户',
    };

    if (!think.isNullOrUndefined(ctx)) {
      Object.assign(log, {
        ip: ctx.ip,
      });
    }

    return this.model('log')
      .add(log);
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
}