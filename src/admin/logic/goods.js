module.exports = class extends think.Logic {
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
        children: {
          goodsSn: {
            string: true,
            required: true,
          },
          name: {
            string: true,
            required: true,
          },
          counterPrice: {
            float: true,
          },
          isNew: {
            boolean: true,
          },
          isHot: {
            boolean: true,
          },
          isOnSale: {
            boolean: true,
          },
          picUrl: {
            string: true,
          },
          gallery: {
            array: true,
            children: {
              string: true,
            },
          },
          unit: {
            string: true,
          },
          keywords: {
            string: true,
          },
          categoryId: {
            int: true,
          },
          brandId: {
            int: true,
          },
          brief: {
            string: true,
          },
          detail: {
            string: true,
          },
        },
      },
      specifications: {
        array: true,
        required: true,
        children: {
          object: true,
          children: {
            specification: {
              string: true,
              required: true,
            },
            value: {
              string: true,
              required: true,
            },
            picUrl: {
              string: true,
            },
          },
        },
      },
      products: {
        array: true,
        required: true,
        children: {
          object: true,
          children: {
            specifications: {
              array: true,
              children: {
                string: true,
              },
            },
            price: {
              float: true,
            },
            number: {
              int: true,
            },
            url: {
              string: true,
            },
          },
        },
      },
      attributes: {
        array: true,
        required: true,
        children: {
          object: true,
          children: {
            attribute: {
              string: true,
              required: true,
            },
            value: {
              string: true,
              required: true,
            },
          },
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
