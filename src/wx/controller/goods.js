const Base = require('./base.js');

module.exports = class extends Base {
  async detailAction() {
    return this.success('todo');
  }

  async categoryAction() {
    return this.success('todo');
  }

  async listAction() {
    return this.success('todo');
  }

  async relatedAction() {
    return this.success('todo');
  }

  async countAction() {
    return this.success('todo');
  }
};
