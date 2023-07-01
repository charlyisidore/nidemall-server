const Base = require('./base.js');

module.exports = class GoodsSpecificationService extends Base {
  /**
   * .
   * @param {number} goodsId .
   * @returns {Promise<GoodsSpecification[]>} .
   */
  async queryByGid(goodsId) {
    return this.model('goods_specification')
      .where({
        goodsId,
        deleted: false,
      })
      .select();
  }

  /**
   * .
   * @param {number} goodsId .
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteByGid(goodsId) {
    return this.model('goods_specification')
      .where({
        goodsId,
      })
      .update({
        deleted: true,
      });
  }

  /**
   * .
   * @param {GoodsSpecification} goodsSpecification .
   * @returns {Promise<number>} The ID inserted
   */
  async add(goodsSpecification) {
    const now = new Date();
    return this.model('goods_specification')
      .add(Object.assign(goodsSpecification, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * .
   * @param {number} id .
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
   * .
   * @param {GoodsSpecification} goodsSpecification .
   * @returns {Promise<number>} The number of rows affected
   */
  async updateById(goodsSpecification) {
    const now = new Date();
    return this.model('goods_specification')
      .where({
        id: goodsSpecification.id,
      })
      .update(Object.assign(goodsSpecification, {
        updateTime: now,
      }));
  }
};
