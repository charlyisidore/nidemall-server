const Base = require('./base.js');

module.exports = class WxCollectController extends Base {
  async listAction() {
    return this.success('todo');
  }

  async addordeleteAction() {
    return this.success('todo');
  }
};
