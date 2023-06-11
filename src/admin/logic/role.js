module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
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

  optionsAction() {
    this.allowMethods = 'GET';
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

  createAction() {
    this.allowMethods = 'POST';

    this.rules = {
      name: {
        string: true,
        required: true,
      },
      desc: {
        string: true,
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

  permissionsAction() {
    this.allowMethods = 'GET,POST';

    this.rules = {
      roleId: {
        int: true,
      },
      permissions: {
        array: true,
        children: {
          string: true,
        },
      },
    };
  }
};
