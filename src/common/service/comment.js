module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @param {number} page 
   * @param {number} limit 
   * @returns 
   */
  async queryGoodsByGid(id, page, limit) {
    const result = await this.model('comment')
      .where({
        valueId: id,
        type: 0,
        deleted: false,
      })
      .order({ addTime: 'DESC' })
      .page(page, limit)
      .countSelect();

    result.data.forEach((item) => Object.assign(item, {
      picUrls: JSON.parse(item.picUrls),
    }));

    return result;
  }
}