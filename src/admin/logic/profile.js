module.exports = class extends think.Logic {
  passwordAction() {
    this.allowMethods = 'POST';
  }

  nnoticeAction() {
    this.allowMethods = 'GET';
  }

  lsnoticeAction() {
    this.allowMethods = 'GET';
  }

  catnoticeAction() {
    this.allowMethods = 'POST';
  }

  bcatnoticeAction() {
    this.allowMethods = 'POST';
  }

  rmnoticeAction() {
    this.allowMethods = 'POST';
  }

  brmnoticeAction() {
    this.allowMethods = 'POST';
  }
};
