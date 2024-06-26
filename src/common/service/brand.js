const Base = require('./base.js');

module.exports = class BrandService extends Base {
  static FIELDS = [
    'id',
    'name',
    'desc',
    'picUrl',
    'floorPrice',
  ].join(',');

  /**
   * .
   * @param {number} page .
   * @param {number} limit .
   * @param {string?} sort .
   * @param {string?} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Brand[]}>}
   */
  async query(page, limit, sort, order) {
    const model = this.model('brand')
      .field(this.constructor.FIELDS)
      .where({
        deleted: false,
      })
      .page(page, limit);

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model.countSelect();
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<Brand|Record<string, never>>} .
   */
  async findById(id) {
    return this.model('brand')
      .where({ id })
      .find();
  }

  /**
   * .
   * @param {number?} id .
   * @param {string?} name .
   * @param {number} page .
   * @param {number} limit .
   * @param {string} sort .
   * @param {string} order .
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Brand[]}>}
   */
  async querySelective(id, name, page, limit, sort, order) {
    const model = this.model('brand');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(id)) {
      Object.assign(where, { id });
    }

    if (!think.isTrueEmpty(name)) {
      Object.assign(where, {
        name: ['LIKE', `%${name}%`],
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
   * .
   * @param {Brand} brand .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(brand) {
    const now = new Date();
    return this.model('brand')
      .where({
        id: brand.id,
      })
      .update(Object.assign(brand, {
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {number} id .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteById(id) {
    return this.model('brand')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * .
   * @param {Brand} brand .
   * @returns {Promise<number>} The ID inserted
   */
  async add(brand) {
    const now = new Date();
    return this.model('brand')
      .add(Object.assign(brand, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @returns {Promise<Brand[]>}
   */
  async all() {
    return this.model('brand')
      .where({
        deleted: false,
      })
      .select();
  }
};
