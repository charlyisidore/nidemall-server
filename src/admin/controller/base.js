const Base = require('../../common/controller/base.js');

module.exports = class AdminBaseController extends Base {
  /**
   * 
   * @returns {number|null}
   */
  getAdminId() {
    return this.ctx.state.adminId;
  }

  getAdmin() {
    return this.ctx.state.admin;
  }
};
