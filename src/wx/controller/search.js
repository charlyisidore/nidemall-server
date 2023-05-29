const Base = require('./base.js');

module.exports = class WxSearchController extends Base {
  async indexAction() {
    return this.success('todo');
  }

  async helperAction() {
    return this.success('todo');
  }

  async clearhistoryAction() {
    return this.success('todo');
  }
};
