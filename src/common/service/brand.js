module.exports = class extends think.Service {
  static FIELDS = [
    'id',
    'name',
    'desc',
    'picUrl',
    'floorPrice',
  ].join(',');

  constructor() {
    super();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   */
  query(page, limit, sort, order) {
    const model = this.model('brand')
      .field(this.constructor.FIELDS)
      .where({
        deleted: false,
      })
      .page(page, limit);

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order })
    }

    return model.countSelect();
  }

  /**
   * 
   * @param {number} id 
   */
  findById(id) {
    return this.model('brand')
      .where({ id })
      .find();
  }
}