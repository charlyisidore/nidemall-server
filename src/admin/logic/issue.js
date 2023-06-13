module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';
  }

  createAction() {
    this.allowMethods = 'POST';
  }

  readAction() {
    this.allowMethods = 'GET';
  }

  updateAction() {
    this.allowMethods = 'POST';
  }

  deleteAction() {
    this.allowMethods = 'POST';
  }
};
