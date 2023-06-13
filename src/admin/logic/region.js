module.exports = class extends think.Logic {
  clistAction() {
    this.allowMethods = 'GET';
  }

  listAction() {
    this.allowMethods = 'GET';
  }
};
