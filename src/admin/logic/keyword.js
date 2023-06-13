module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      keyword: {
        string: true,
      },
      url: {
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
      keyword: {
        string: true,
        required: true,
      },
      url: {
        string: true,
      },
      isHot: {
        boolean: true,
      },
      isDefault: {
        boolean: true,
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
      keyword: {
        string: true,
        required: true,
      },
      url: {
        string: true,
      },
      isHot: {
        boolean: true,
      },
      isDefault: {
        boolean: true,
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
};
