module.exports = class GoodsSpecificationService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<GoodsSpecification[]>} 
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
   * @param {GoodsSpecification} goodsSpecification 
   * @returns {Promise<number>} The ID inserted
   */
  add(goodsSpecification) {
    const now = new Date();
    return this.model('goods_specification')
      .add(Object.assign(goodsSpecification, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<{ name: string, valueList: GoodsSpecification[] }[]>}
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

  /**
   * 
   * @param {GoodsSpecification} goodsSpecification 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(goodsSpecification) {
    const now = new Date();
    return this.model('goods_specification')
      .where({
        id: goodsSpecification.id,
      })
      .update(Object.assign(goodsSpecification, {
        updateTime: now,
      }));
  }
}