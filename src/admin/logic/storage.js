const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      key: {
        string: true,
      },
      name: {
        string: true,
      },
      page: {
        int: true,
        default: 1,
      },
      limit: {
        int: true,
        default: 10,
      },
      sort: {
        string: true,
        in: ['add_time', 'id'],
        default: 'add_time',
      },
      order: {
        string: true,
        in: ['asc', 'desc'],
        default: 'desc',
      },
    };
  }

  createAction() {
    this.allowMethods = 'POST';

    this.rules = {
      file: {
        method: 'FILE',
        required: true,
      },
    };
  }

  readAction() {
    this.allowMethods = 'POST';

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
      name: {
        string: true,
        required: true,
      },
    };
  }

  deleteAction() {
    this.allowMethods = 'POST';

    this.rules = {
      key: {
        string: true,
        required: true,
      },
    };
  }
};
