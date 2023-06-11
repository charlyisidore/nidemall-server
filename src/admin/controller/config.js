const Base = require('./base.js');

module.exports = class AdminConfigController extends Base {
  mallAction() {
    switch (true) {
      case this.isGet:
        return this.getMall();
      case this.isPost:
        return this.postMall();
    }
  }

  expressAction() {
    switch (true) {
      case this.isGet:
        return this.getExpress();
      case this.isPost:
        return this.postExpress();
    }
  }

  orderAction() {
    switch (true) {
      case this.isGet:
        return this.getOrder();
      case this.isPost:
        return this.postOrder();
    }
  }

  wxAction() {
    switch (true) {
      case this.isGet:
        return this.getWx();
      case this.isPost:
        return this.postWx();
    }
  }

  async getMall() {
    return this.success('todo');
  }

  async postMall() {
    return this.success('todo');
  }

  async getExpress() {
    return this.success('todo');
  }

  async postExpress() {
    return this.success('todo');
  }

  async getOrder() {
    return this.success('todo');
  }

  async postOrder() {
    return this.success('todo');
  }

  async getWx() {
    return this.success('todo');
  }

  async postWx() {
    return this.success('todo');
  }
};
