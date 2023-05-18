module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   */
  queryByGid(id) {
    return this.model('goods_specification')
      .where({
        goodsId: id,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} id 
   */
  async getSpecificationVoList(id) {
    const goodsSpecificationList = await this.queryByGid(id);

    const map = {};
    const specificationVoList = [];

    for (const goodsSpecification of goodsSpecificationList) {
      const specification = goodsSpecification.specification;

      if (specification in map) {
        map[specification].valueList.push(goodsSpecification);
      } else {
        map[specification] = {
          name: specification,
          valueList: [goodsSpecification],
        };
        specificationVoList.push(map[specification]);
      }
    }

    return specificationVoList;
  }
}