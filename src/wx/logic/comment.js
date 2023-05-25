module.exports = class extends think.Logic {
  postAction() {
    this.allowMethods = 'POST';

    this.rules = {
      content: {
        string: true,
        required: true,
      },
      star: {
        int: true,
        required: true,
      },
      type: {
        int: true,
        required: true,
      },
      valueId: {
        int: true,
        required: true,
      },
      hasPicture: {
        boolean: true,
        default: false,
      },
      picUrls: {
        array: true,
        default: [],
        children: {
          string: true,
        },
      },
    };
  }

  countAction() {
    this.allowMethods = 'GET';

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

  listAction() {
    this.allowMethods = 'GET';

    this.rules = {
      type: {
        int: true,
        required: true,
      },
      valueId: {
        int: true,
        required: true,
      },
      showType: {
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
    };
  }
};
