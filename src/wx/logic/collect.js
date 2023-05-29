module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      type: {
        int: true,
        required: true,
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

  addordeleteAction() {
    this.allowMethods = 'POST';

    this.rules = {
      type: {
        int: true,
        required: true,
      },
      valueId: {
        int: true,
        required: true,
      },
    };
  }
};
