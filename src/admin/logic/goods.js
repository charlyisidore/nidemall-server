const Base = require('./base.js');

module.exports = class extends Base {
  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      goodsId: {
        int: true,
      },
      goodsSn: {
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

  catAndBrandAction() {
    this.allowMethods = 'GET';
  }

  updateAction() {
    this.allowMethods = 'POST';

    this.rules = {
      goods: {
        object: true,
        required: true,
      },
      specifications: {
        array: true,
        required: true,
        children: {
          object: true,
        },
      },
      products: {
        array: true,
        required: true,
        children: {
          object: true,
        },
      },
      attributes: {
        array: true,
        required: true,
        children: {
          object: true,
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

  createAction() {
    this.allowMethods = 'POST';

    this.rules = {
      goods: {
        object: true,
        required: true,
      },
      specifications: {
        array: true,
        required: true,
        children: {
          object: true,
        },
      },
      products: {
        array: true,
        required: true,
        children: {
          object: true,
        },
      },
      attributes: {
        array: true,
        required: true,
        children: {
          object: true,
        },
      },
    };
  }

  detailAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }
};
