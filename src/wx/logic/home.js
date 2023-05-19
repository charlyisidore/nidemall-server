module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'GET';
  }

  aboutAction() {
    this.allowMethods = 'GET';
  }
};
