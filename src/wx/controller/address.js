const Base = require('./base.js');

module.exports = class extends Base {
  async listAction() {
    return this.success('todo');
  }

  async detailAction() {
    return this.success('todo');
  }

  async saveAction() {
    return this.success('todo');
  }

  async deleteAction() {
    return this.success('todo');
  }
};
