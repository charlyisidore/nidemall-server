module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
      },
    };
  }

  allAction() {
    this.allowMethods = 'GET';
  }

  currentAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
