const Base = require('./base.js');

module.exports = class NotifyService extends Base {
  constructor() {
    super();

    this.mailSender = null;
    this.smsSender = null;
  }

  /**
   * 
   * @returns {boolean}
   */
  isMailEnable() {
    return !think.isNullOrUndefined(this.mailSender);
  }

  /**
   * 
   * @returns {boolean}
   */
  isSmsEnable() {
    return !think.isNullOrUndefined(this.smsSender);
  }

  /**
   * 
   * @param {string} phoneNumber 
   * @param {string} message 
   */
  async notifySms(phoneNumber, message) {
    // TODO
    console.log(`notifySms(${JSON.stringify({ phoneNumber, message })})`);
    think.logger.info(`notifySms(${JSON.stringify({ phoneNumber, message })})`);
  }

  /**
   * 
   * @param {string} phoneNumber 
   * @param {string} notifyType 
   * @param {string[]} params 
   */
  async notifySmsTemplate(phoneNumber, notifyType, params) {
    // TODO
    console.log(`notifySmsTemplate(${JSON.stringify({ phoneNumber, notifyType, params })})`);
    think.logger.info(`notifySmsTemplate(${JSON.stringify({ phoneNumber, notifyType, params })})`);
  }

  /**
   * 
   * @param {string} phoneNumber 
   * @param {string} notifyType 
   * @param {string[]} params 
   */
  async notifySmsTemplateSync(phoneNumber, notifyType, params) {
    // TODO
    console.log(`notifySmsTemplateSync(${JSON.stringify({ phoneNumber, notifyType, params })})`);
    think.logger.info(`notifySmsTemplateSync(${JSON.stringify({ phoneNumber, notifyType, params })})`);
  }

  /**
   * 
   * @param {string} subject 
   * @param {string} content 
   */
  async notifyMail(subject, content) {
    // TODO
    console.log(`notifyMail(${JSON.stringify({ subject, content })})`);
    think.logger.info(`notifyMail(${JSON.stringify({ subject, content })})`);
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
