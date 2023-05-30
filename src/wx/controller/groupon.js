const Base = require('./base.js');

module.exports = class WxGrouponController extends Base {
  async listAction() {
    const userId = this.getUserId();
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

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const grouponRuleVoList = await grouponRulesService.wxQueryList(page, limit, sort, order);

    return this.successList(grouponRuleVoList);
  }

  async detailAction() {
    return this.success('todo');
  }

  async joinAction() {
    return this.success('todo');
  }

  async myAction() {
    return this.success('todo');
  }
};
