module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';
  }

  catAndBrandAction() {
    this.allowMethods = 'GET';
  }

  updateAction() {
    this.allowMethods = 'POST';
  }

  deleteAction() {
    this.allowMethods = 'POST';
  }

  createAction() {
    this.allowMethods = 'POST';
  }

  detailAction() {
    this.allowMethods = 'GET';
  }
};
