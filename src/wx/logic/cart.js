module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'GET';
  }

  addAction() {
    this.allowMethods = 'POST';
  }

  fastaddAction() {
    this.allowMethods = 'POST';
  }

  updateAction() {
    this.allowMethods = 'POST';
  }

  checkedAction() {
    this.allowMethods = 'POST';
  }

  deleteAction() {
    this.allowMethods = 'POST';
  }

  goodscountAction() {
    this.allowMethods = 'GET';
  }

  checkoutAction() {
    this.allowMethods = 'GET';
  }
};
