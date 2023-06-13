const Base = require('./base.js');

module.exports = class AdminGrouponController extends Base {
  async listRecordAction() {
    /** @type {number?} */
    const grouponRuleId = this.get('grouponRuleId');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {GrouponService} */
    const grouponService = this.service('groupon');
    /** @type {GrouponRulesService} */
    const grouponRulesService = this.service('groupon_rules');

    const grouponList = await grouponService.querySelective(grouponRuleId, page, limit, sort, order);

    const groupons = (await Promise.all(
      grouponList.data.map(async (groupon) => {
        try {
          const subGroupons = await grouponService.queryJoinRecord(groupon.id);
          const rules = await grouponRulesService.findById(groupon.rulesId);
          const goods = await goodsService.findById(rules.goodsId);
          return {
            groupon,
            subGroupons,
            rules,
            goods,
          };
        } catch (e) {
          console.error(e);
          think.logger.error(e.toString());
          return null;
        }
      })
    ))
      .filter((groupon) => !think.isNullOrUndefined(groupon));

    return this.successList(groupons, grouponList);
  }

  async listAction() {
    /** @type {number?} */
    const goodsId = this.get('goodsId');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {GrouponRulesService} */
    const grouponRulesService = this.service('groupon_rules');

    const rulesList = await grouponRulesService.querySelective(goodsId, page, limit, sort, order);

    return this.successList(rulesList);
  }

  async updateAction() {
    const grouponRules = this.post([
      'id',
      'goodsId',
      'discount',
      'discountMember',
      'expireTime',
    ].join(','));

    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {GrouponService} */
    const grouponService = this.service('groupon');
    /** @type {GrouponRulesService} */
    const grouponRulesService = this.service('groupon_rules');

    const { ADMIN_RESPONSE } = grouponService.getConstants();
    const { RULE_STATUS } = grouponRulesService.getConstants();

    const rules = await grouponRulesService.findById(grouponRules.id);

    if (think.isEmpty(rules)) {
      return this.badArgumentValue();
    }

    if (RULE_STATUS.ON != rules.status) {
      return this.fail(ADMIN_RESPONSE.GOODS_OFFLINE, '团购已经下线');
    }

    const goods = await goodsService.findById(grouponRules.goodsId);

    if (think.isEmpty(goods)) {
      return this.badArgumentValue();
    }

    Object.assign(grouponRules, {
      goodsName: goods.name,
      picUrl: goods.picUrl,
    });

    if (!await grouponRulesService.updateById(grouponRules)) {
      return this.updatedDataFailed();
    }

    return this.success();
  }

  async createAction() {
    return this.success('todo');
  }

  async deleteAction() {
    return this.success('todo');
  }
};