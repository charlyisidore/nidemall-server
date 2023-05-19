module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'GET';
  }

  allAction() {
    this.allowMethods = 'GET';
  }

  currentAction() {
    this.allowMethods = 'GET';
  }
};
