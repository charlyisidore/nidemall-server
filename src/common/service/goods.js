module.exports = class extends think.Service {
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
   */
  queryByHot(page, limit) {
    return this.model('goods')
      .field(this.constructor.FIELDS)
      .where({
        isHot: true,
        isOnSale: true,
        deleted: false,
      })
      .order({ 'addTime': 'DESC' })
      .page(page, limit)
      .select();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   */
  queryByNew(page, limit) {
    return this.model('goods')
      .field(this.constructor.FIELDS)
      .where({
        isNew: true,
        isOnSale: true,
        deleted: false,
      })
      .order({ 'addTime': 'DESC' })
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
      .order({ 'addTime': 'DESC' })
      .page(page, limit)
      .select();
  }

  /**
   * 
   * @param {number} id 
   */
  async findById(id) {
    const item = await this.model('goods')
      .where({
        id,
        deleted: false,
      })
      .find();

    return Object.assign(item, {
      gallery: JSON.parse(item.gallery),
    });
  }
}