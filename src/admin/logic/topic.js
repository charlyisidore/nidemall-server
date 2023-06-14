module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      title: {
        string: true,
      },
      subtitle: {
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
      title: {
        string: true,
        required: true,
      },
      subtitle: {
        string: true,
        required: true,
      },
      picUrl: {
        string: true,
      },
      content: {
        string: true,
        required: true,
      },
      price: {
        float: true,
        required: true,
      },
      readCount: {
        string: true,
      },
      goods: {
        array: true,
        children: {
          int: true,
        },
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
      title: {
        string: true,
        required: true,
      },
      subtitle: {
        string: true,
        required: true,
      },
      picUrl: {
        string: true,
      },
      content: {
        string: true,
        required: true,
      },
      price: {
        float: true,
        required: true,
      },
      readCount: {
        string: true,
      },
      goods: {
        array: true,
        children: {
          int: true,
        },
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

  ['batch-deleteAction']() {
    this.allowMethods = 'POST';

    this.rules = {
      ids: {
        array: true,
        required: true,
        children: {
          int: true,
        },
      },
    };
  }
};
