module.exports = class extends think.Logic {
  mallAction() {
    this.allowMethods = 'GET,POST';
  }

  expressAction() {
    this.allowMethods = 'GET,POST';
  }

  orderAction() {
    this.allowMethods = 'GET,POST';
  }

  wxAction() {
    this.allowMethods = 'GET,POST';
  }
};
