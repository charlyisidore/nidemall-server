module.exports = class extends think.Logic {
  clistAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  listAction() {
    this.allowMethods = 'GET';
  }
};
