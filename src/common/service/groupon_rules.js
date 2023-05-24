module.exports = class extends think.Service {
  static RULE_STATUS = {
    ON: 0,
    DOWN_EXPIRE: 1,
    DOWN_ADMIN: 2,
  };

  static STATUS = {
    NONE: 0,
    ON: 1,
    SUCCEED: 2,
    FAIL: 3,
  };

  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   */
  findById(id) {
    return this.model('groupon_rules')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {number} goodsId 
   */
  queryByGoodsId(goodsId) {
    return this.model('groupon_rules')
      .where({
        goodsId,
        status: this.constructor.RULE_STATUS.ON,
        deleted: false,
      })
      .select();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   */
  queryList(page, limit, sort = 'addTime', order = 'DESC') {
    return this.model('groupon_rules')
      .where({
        status: this.constructor.RULE_STATUS.ON,
        deleted: false,
      })
      .order({ [sort]: order })
      .page(page, limit)
      .select();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   */
  async wxQueryList(page, limit, sort, order) {
    const goodsService = think.service('goods');

    const grouponRulesList = await this.queryList(page, limit, sort, order);
    const grouponList = [];

    for (const rule of grouponRulesList) {
      const goods = await goodsService.findById(rule.goodsId);

      if (think.isEmpty(goods)) {
        continue;
      }

      grouponList.push({
        id: goods.id,
        name: goods.name,
        brief: goods.brief,
        picUrl: goods.picUrl,
        counterPrice: goods.counterPrice,
        retailPrice: goods.retailPrice,
        grouponPrice: (goods.retailPrice - rule.discount),
        grouponDiscount: rule.discount,
        grouponMember: rule.discountMember,
        expireTime: rule.expireTime,
      });
    }

    return grouponList;
  }
}