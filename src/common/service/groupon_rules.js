module.exports = class GrouponRulesService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<GrouponRules|Record<string, never>>} 
   */
  findById(id) {
    return this.model('groupon_rules')
      .where({ id })
      .find();
  }

  /**
   * 
   * @param {number} goodsId 
   * @returns {Promise<GrouponRules[]>} 
   */
  queryByGoodsId(goodsId) {
    const { RULE_STATUS } = this.getConstants();
    return this.model('groupon_rules')
      .where({
        goodsId,
        status: RULE_STATUS.ON,
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
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: GrouponRules[]}>}
   */
  queryList(page, limit, sort = 'addTime', order = 'DESC') {
    const { RULE_STATUS } = this.getConstants();
    return this.model('groupon_rules')
      .where({
        status: RULE_STATUS.ON,
        deleted: false,
      })
      .order({
        [sort]: order,
      })
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: object[]}>}
   */
  async wxQueryList(page, limit, sort, order) {
    /** @type {GoodsService} */
    const goodsService = think.service('goods');

    const grouponRulesList = await this.queryList(page, limit, sort, order);

    const grouponRulesVoList = (await Promise.all(
      grouponRulesList.data.map(async (rule) => {
        const goods = await goodsService.findById(rule.goodsId);

        if (think.isEmpty(goods)) {
          return null;
        }

        return {
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
        };
      })
    ))
      .filter((grouponRules) => !think.isEmpty(grouponRules));

    return {
      count: grouponRulesList.count,
      currentPage: grouponRulesList.currentPage,
      pageSize: grouponRulesList.pageSize,
      totalPages: grouponRulesList.totalPages,
      data: grouponRulesVoList,
    };
  }

  getConstants() {
    return {
      RULE_STATUS: {
        ON: 0,
        DOWN_EXPIRE: 1,
        DOWN_ADMIN: 2,
      },
    };
  }
}