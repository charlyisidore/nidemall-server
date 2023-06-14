const Base = require('./base.js');

module.exports = class NotifyService extends Base {
  constructor() {
    super();

    this.smsSender = null;
  }

  /**
   * 
   * @returns {boolean}
   */
  isSmsEnable() {
    return false;
  }

  /**
   * 
   * @param {string} phoneNumber 
   * @param {string} message 
   */
  notifySms(phoneNumber, message) {
    console.log(`notifySms(${JSON.stringify({ phoneNumber, message })})`);
  }

  /**
   * 
   * @param {string} phoneNumber 
   * @param {string} notifyType 
   * @param {string[]} params 
   */
  notifySmsTemplate(phoneNumber, notifyType, params) {
    console.log(`notifySmsTemplate(${JSON.stringify({ phoneNumber, notifyType, params })})`);
  }

  getConstants() {
    return {
      TYPE: {
        PAY_SUCCEED: 'paySucceed',
        SHIP: 'ship',
        REFUND: 'refund',
        CAPTCHA: 'captcha',
      },
    };
  }
}
