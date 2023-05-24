module.exports = class extends think.Logic {
  listAction() {
    this.allowMethods = 'GET';
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

  saveAction() {
    this.allowMethods = 'POST';

    this.rules = {
      id: {
        int: true,
      },
      name: {
        string: true,
        required: true,
      },
      tel: {
        string: true,
        mobile: 'zh-CN',
        required: true,
      },
      province: {
        string: true,
        required: true,
      },
      city: {
        string: true,
        required: true,
      },
      county: {
        string: true,
        required: true,
      },
      areaCode: {
        string: true,
        required: true,
      },
      addressDetail: {
        string: true,
        required: true,
      },
      isDefault: {
        boolean: true,
        required: true,
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
