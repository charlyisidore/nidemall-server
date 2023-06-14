const Base = require('./base.js');

module.exports = class GoodsService extends Base {
  static FIELDS = [
    'id',
    'name',
    'brief',
    'picUrl',
    'isHot',
    'isNew',
    'counterPrice',
    'retailPrice',
  ].join(',');

  constructor() {
    super();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<Goods[]>} 
   */
  queryByHot(page, limit) {
    return this.model('goods')
      .field(this.constructor.FIELDS)
      .where({
        isHot: true,
        isOnSale: true,
        deleted: false,
      })
      .order({ addTime: 'DESC' })
      .page(page, limit)
      .select();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<Goods[]>} 
   */
  queryByNew(page, limit) {
    return this.model('goods')
      .field(this.constructor.FIELDS)
      .where({
        isNew: true,
        isOnSale: true,
        deleted: false,
      })
      .order({ addTime: 'DESC' })
      .page(page, limit)
      .select();
  }

  /**
   * 
   * @param {number|number[]} catIdOrList 
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Goods[]}>}
   */
  queryByCategory(catIdOrList, page, limit) {
    return this.model('goods')
      .field(this.constructor.FIELDS)
      .where({
        categoryId: Array.isArray(catIdOrList) ?
          ['IN', catIdOrList] :
          catIdOrList,
        isOnSale: true,
        deleted: false,
      })
      .order({ addTime: 'DESC' })
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number?} categoryId 
   * @param {number?} brandId 
   * @param {string?} keywords 
   * @param {boolean?} isHot 
   * @param {boolean?} isNew 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Goods[]}>}
   */
  querySelectiveCategory(categoryId, brandId, keywords, isHot, isNew, page, limit, sort, order) {
    const model = this.model('goods')
      .field(this.constructor.FIELDS);

    const where = {
      isOnSale: true,
      deleted: false,
    };

    if (!think.isNullOrUndefined(categoryId)) {
      Object.assign(where, { categoryId });
    }

    if (!think.isNullOrUndefined(brandId)) {
      Object.assign(where, { brandId });
    }

    if (!think.isNullOrUndefined(isNew)) {
      Object.assign(where, { isNew });
    }

    if (!think.isNullOrUndefined(isHot)) {
      Object.assign(where, { isHot });
    }

    if (!think.isTrueEmpty(keywords)) {
      Object.assign(where, {
        _complex: {
          _logic: 'OR',
          keywords: ['LIKE', `%${keywords}%`],
          name: ['LIKE', `%${keywords}%`],
        },
      });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({
        [sort]: order,
      });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number?} id 
   * @param {string?} goodsSn 
   * @param {string?} name 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Goods[]}>}
   */
  querySelectiveGoods(id, goodsSn, name, page, limit, sort, order) {
    const model = this.model('goods');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(id)) {
      Object.assign(where, { id });
    }

    if (!think.isNullOrUndefined(goodsSn)) {
      Object.assign(where, { goodsSn });
    }

    if (!think.isTrueEmpty(name)) {
      Object.assign(where, {
        name: ['LIKE', `%${name}%`],
      });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({
        [sort]: order,
      });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Goods|Record<string, never>>} 
   */
  findById(id) {
    return this.model('goods')
      .where({
        id,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Goods|Record<string, never>>} 
   */
  findByIdVo(id) {
    return this.model('goods')
      .field(this.constructor.FIELDS)
      .where({
        id,
        isOnSale: true,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @returns {Promise<number>} The total number
   */
  queryOnSale() {
    return this.model('goods')
      .where({
        isOnSale: true,
        deleted: false,
      })
      .count();
  }

  /**
   * 
   * @param {Goods} goods 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(goods) {
    const now = new Date();
    return this.model('goods')
      .where({
        id: goods.id,
      })
      .update(Object.assign(goods, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteById(id) {
    return this.model('goods')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Goods} goods 
   * @returns {Promise<number>} The ID inserted
   */
  add(goods) {
    const now = new Date();
    return this.model('goods')
      .add(Object.assign(goods, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @returns {Promise<number>} The total number
   */
  count() {
    return this.model('goods')
      .where({
        deleted: false,
      })
      .count();
  }

  /**
   * 
   * @param {number?} brandId 
   * @param {string?} keywords 
   * @param {boolean?} isHot 
   * @param {boolean?} isNew 
   * @returns {Promise<number[]>}
   */
  async getCatIds(brandId, keywords, isHot, isNew) {
    const model = this.model('goods')
      .field('categoryId');

    const where = {
      isOnSale: true,
      deleted: false,
    };

    if (!think.isNullOrUndefined(brandId)) {
      Object.assign(where, { brandId });
    }

    if (!think.isNullOrUndefined(isNew)) {
      Object.assign(where, { isNew });
    }

    if (!think.isNullOrUndefined(isHot)) {
      Object.assign(where, { isHot });
    }

    if (!think.isTrueEmpty(keywords)) {
      Object.assign(where, {
        _complex: {
          _logic: 'OR',
          keywords: ['LIKE', `%${keywords}%`],
          name: ['LIKE', `%${keywords}%`],
        },
      });
    }

    model.where(where);

    return (await model.select())
      .map((item) => item.categoryId);
  }

  /**
   * 
   * @param {string} name 
   * @returns {Promise<boolean>}
   */
  async checkExistByName(name) {
    return 0 != (await this.model('goods')
      .where({
        name,
        isOnSale: true,
        deleted: false,
      })
      .count());
  }

  /**
   * 
   * @param {number[]} ids 
   * @returns {Promise<Goods[]>}
   */
  queryByIds(ids) {
    return this.model('goods')
      .field(this.constructor.FIELDS)
      .where({
        id: ['IN', ids],
        isOnSale: true,
        deleted: false,
      })
      .select();
  }

  getConstants() {
    return {
      RESPONSE: {
        UNSHELVE: 710,
        NO_STOCK: 711,
      },
      ADMIN_RESPONSE: {
        UPDATE_NOT_ALLOWED: 610,
        NAME_EXIST: 611,
      },
    };
  }
}
