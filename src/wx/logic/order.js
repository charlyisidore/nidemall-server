module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';
  }

  detailAction() {
    this.allowMethods = 'GET';
  }

  submitAction() {
    this.allowMethods = 'POST';
  }

  cancelAction() {
    this.allowMethods = 'POST';
  }

  prepayAction() {
    this.allowMethods = 'POST';
  }

  refundAction() {
    this.allowMethods = 'POST';
  }

  confirmAction() {
    this.allowMethods = 'POST';
  }

  deleteAction() {
    this.allowMethods = 'POST';
  }

  goodsAction() {
    this.allowMethods = 'GET';
  }

  commentAction() {
    this.allowMethods = 'POST';
  }
};
