module.exports = class extends think.Logic {
  postAction() {
    this.allowMethods = 'POST';
  }

  countAction() {
    this.allowMethods = 'GET';
  }

  listAction() {
    this.allowMethods = 'GET';
  }
};
