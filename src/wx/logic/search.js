module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'GET';
  }

  helperAction() {
    this.allowMethods = 'GET';
  }

  clearhistoryAction() {
    this.allowMethods = 'POST';
  }
};
