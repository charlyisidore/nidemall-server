module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   */
  async queryByGid(id) {
    return (await this.model('goods_product')
      .where({
        goodsId: id,
        deleted: false,
      })
      .select())
      .map((item) => this._parse(item));
  }

  _parse(item) {
    return item ? Object.assign(item, {
      specifications: JSON.parse(item.specifications),
    }) : item;
  }
}