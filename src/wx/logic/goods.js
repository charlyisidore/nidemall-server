module.exports = class extends think.Logic {
  detailAction() {
    this.allowMethods = 'GET';
  }

  categoryAction() {
    this.allowMethods = 'GET';
  }

  listAction() {
    this.allowMethods = 'GET';
  }

  relatedAction() {
    this.allowMethods = 'GET';
  }

  countAction() {
    this.allowMethods = 'GET';
  }
};
