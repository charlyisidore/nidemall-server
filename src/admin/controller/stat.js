const Base = require('./base.js');

module.exports = class AdminStatController extends Base {
  async userAction() {
    return this.success('todo');
  }

  async orderAction() {
    return this.success('todo');
  }

  async goodsAction() {
    return this.success('todo');
  }
};
