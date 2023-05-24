module.exports = class extends think.Logic {
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
        default: 'add_time',
      },
      order: {
        string: true,
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
