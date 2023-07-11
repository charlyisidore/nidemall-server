const Base = require('./base.js');

module.exports = class extends Base {
  detailAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  categoryAction() {
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

    this.rules = {
      categoryId: {
        int: true,
      },
      brandId: {
        int: true,
      },
      keyword: {
        string: true,
      },
      isNew: {
        boolean: true,
      },
      isHot: {
        boolean: true,
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
        in: ['add_time', 'retail_price', 'name'],
        default: 'add_time',
      },
      order: {
        string: true,
        in: ['asc', 'desc'],
        default: 'desc',
      },
    };
  }

  relatedAction() {
    this.allowMethods = 'GET';

    this.rules = {
      id: {
        int: true,
        required: true,
      },
    };
  }

  countAction() {
    this.allowMethods = 'GET';
  }
};
