const Base = require('../../common/controller/base.js');

module.exports = class WxBaseController extends Base {
  /**
   * Get the logged in user ID
   * @returns {number?} User ID
   */
  getUserId() {
    return this.ctx.state.userId;
  }
};
