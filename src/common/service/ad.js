module.exports = class AdService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @returns {Promise<Ad[]>} 
   */
  queryIndex() {
    return this.model('ad')
      .where({
        position: 1,
        enabled: true,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {string?} name 
   * @param {string?} content 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Ad[]}>}
   */
  querySelective(name, content, page, limit, sort, order) {
    const model = this.model('ad');
    const where = {
      deleted: false,
    };

    if (!think.isTrueEmpty(name)) {
      Object.assign(where, {
        name: ['LIKE', `%${name}%`],
      });
    }

    if (!think.isTrueEmpty(content)) {
      Object.assign(where, {
        content: ['LIKE', `%${content}%`],
      });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {Ad} ad 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(ad) {
    const now = new Date();
    return this.model('ad')
      .where({
        id: ad.id,
      })
      .update(Object.assign(ad, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteById(id) {
    return this.model('ad')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Ad} ad 
   * @returns {Promise<number>} The ID inserted
   */
  add(ad) {
    const now = new Date();
    return this.model('ad')
      .add(Object.assign(ad, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Ad|Record<string, never>>}
   */
  findById(id) {
    return this.model('ad')
      .where({ id })
      .find();
  }
}