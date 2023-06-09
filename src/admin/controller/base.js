const Base = require('../../common/controller/base.js');

module.exports = class AdminBaseController extends Base {
  getAdminId() {
    return this.ctx.state.adminId;
  }

  getAdmin() {
    return this.ctx.state.admin;
  }
};
