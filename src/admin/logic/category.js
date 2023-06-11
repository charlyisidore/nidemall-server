module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';
  }

  createAction() {
    this.allowMethods = 'POST';

    this.rules = {
      name: {
        string: true,
        required: true,
      },
      keywords: {
        string: true,
      },
      level: {
        string: true,
        required: true,
      },
      pid: {
        int: true,
      },
      iconUrl: {
        string: true,
      },
      picUrl: {
        string: true,
      },
      desc: {
        string: true,
      },
    };
  }

  readAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  updateAction() {
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
      name: {
        string: true,
        required: true,
      },
      keywords: {
        string: true,
      },
      level: {
        string: true,
        required: true,
      },
      pid: {
        int: true,
      },
      iconUrl: {
        string: true,
      },
      picUrl: {
        string: true,
      },
      desc: {
        string: true,
      },
    };
  }

  deleteAction() {
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  l1Action() {
    this.allowMethods = 'GET';
  }
};
