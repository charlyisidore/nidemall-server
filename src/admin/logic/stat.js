module.exports = class extends think.Logic {
  userAction() {
    this.allowMethods = 'GET';
  }

  orderAction() {
    this.allowMethods = 'GET';
  }

  goodsAction() {
    this.allowMethods = 'GET';
  }
};
