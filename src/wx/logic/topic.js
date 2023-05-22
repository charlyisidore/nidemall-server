module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';
  }

  detailAction() {
    this.allowMethods = 'GET';
  }

  relatedAction() {
    this.allowMethods = 'GET';
  }
};
