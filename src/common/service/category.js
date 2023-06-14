const Base = require('./base.js');

module.exports = class CategoryService extends Base {
  static CHANNEL_FIELDS = [
    'id',
    'name',
    'iconUrl',
  ].join(',');

  constructor() {
    super();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<Category[]>} 
   */
  queryL1WithoutRecommend(page, limit) {
    return this.model('category')
      .where({
        level: 'L1',
        name: ['!=', '推荐'],
        deleted: false,
      })
      .page(page, limit)
      .select();
  }

  /**
   * 
   * @param {number?} page 
   * @param {number?} limit 
   * @returns {Promise<Category[]>} 
   */
  queryL1(page, limit) {
    const model = this.model('category')
      .where({
        level: 'L1',
        deleted: false,
      });
    if (undefined !== page) {
      model.page(page, limit);
    }
    return model.select();
  }

  /**
   * 
   * @param {number} pid 
   * @returns {Promise<Category[]>} 
   */
  queryByPid(pid) {
    return this.model('category')
      .where({
        pid,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number[]} ids 
   * @returns {Promise<Category[]>} 
   */
  queryL2ByIds(ids) {
    return this.model('category')
      .where({
        id: ['IN', ids],
        level: 'L2',
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<Category|Record<string, never>>} 
   */
  findById(id) {
    return this.model('category')
      .where({
        id,
        deleted: false,
      })
      .find();
  }

  /**
   * 
   * @param {Category} category 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(category) {
    const now = new Date();
    return this.model('category')
      .where({
        id: category.id,
      })
      .update(Object.assign(category, {
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteById(id) {
    return this.model('category')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Category} category 
   * @returns {Promise<number>} The ID inserted
   */
  add(category) {
    const now = new Date();
    return this.model('category')
      .add(Object.assign(category, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @returns {Promise<Category[]>} 
   */
  queryChannel() {
    return this.model('category')
      .field(this.constructor.CHANNEL_FIELDS)
      .where({
        level: 'L1',
        deleted: false,
      })
      .select();
  }
}
