const Base = require('../../common/controller/base.js');

module.exports = class AdminBaseController extends Base {
  getAdmin() {
    return this.ctx.state.admin;
  }
};
