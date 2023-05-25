module.exports = class GoodsService extends think.Service {
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

    model.where(where);

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({
        [sort]: order,
        id: 'ASC',
      });
    }

    return model
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} goodsId 
   * @param {string} goodsSn 
   * @param {string} name 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   */
  querySelectiveGoods(goodsId, goodsSn, name, page, limit, sort, order) {
    // TODO
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
}