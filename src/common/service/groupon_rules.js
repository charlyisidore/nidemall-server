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
   * @param {number} status 
   * @returns {Promise<GrouponRules[]>}
   */
  queryByStatus(status) {
    return this.model('groupon_rules')
      .where({
        status,
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
   * @param {number?} goodsId 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: GrouponRules[]}>}
   */
  querySelective(goodsId, page, limit, sort, order) {
    const model = this.model('groupon_rules');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(goodsId)) {
      Object.assign(where, { goodsId });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number} id 
   * @returns {Promise<number>} The number of rows affected
   */
  delete(id) {
    return this.model('groupon_rules')
      .where({ id })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {GrouponRules} grouponRules 
   * @returns {Promise<number>} The number of rows affected
   */
  updateById(grouponRules) {
    const now = new Date();
    return this.model('groupon_rules')
      .where({
        id: grouponRules.id,
      })
      .update(Object.assign(grouponRules, {
        updateTime: now,
      }));
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

  /**
   * Schedule deletions at startup.
   */
  async expiredTaskStartup() {
    /** @type {TaskService} */
    const taskService = think.service('task');

    const { RULE_STATUS } = this.getConstants();

    const grouponRulesList = await this.queryByStatus(RULE_STATUS.ON);

    await Promise.all(
      grouponRulesList.map(async (grouponRules) => {
        taskService.addTask(
          () => this.expiredTask(grouponRules.id),
          grouponRules.expireTime
        );
      })
    );
  }

  /**
   * Delete an expired groupon rules.
   * @param {number} grouponRulesId 
   */
  async expiredTask(grouponRulesId) {
    think.logger.info(`系统开始处理延时任务---团购规则过期---${grouponRulesId}`);

    /** @type {GrouponService} */
    const grouponService = think.service('groupon');
    /** @type {OrderService} */
    const orderService = think.service('order');

    const GROUPON = grouponService.getConstants();
    const GROUPON_RULES = this.getConstants();
    const ORDER = orderService.getConstants();

    const grouponRules = await this.findById(grouponRulesId);

    if (think.isEmpty(grouponRules)) {
      return;
    }

    if (GROUPON_RULES.RULE_STATUS.ON != grouponRules.status) {
      return;
    }

    Object.assign(grouponRules, {
      status: GROUPON_RULES.RULE_STATUS.DOWN_EXPIRE,
    });
    await this.updateById(grouponRules);

    const grouponList = await grouponService.queryByRulesId(grouponRulesId);

    await Promise.all(
      grouponList.map(async (groupon) => {
        const order = await orderService.findById(groupon.orderId);
        if (GROUPON.STATUS.NONE == groupon.status) {
          Object.assign(groupon, {
            status: GROUPON.STATUS.FAIL,
          });
          await grouponService.updateById(groupon);
        } else if (GROUPON.STATUS.ON == groupon.status) {
          Object.assign(groupon, {
            status: GROUPON.STATUS.FAIL,
          });
          await grouponService.updateById(groupon);

          if (orderService.isPayStatus(order)) {
            Object.assign(order, {
              status: ORDER.STATUS.REFUND,
            });
            await orderService.updateWithOptimisticLocker(order);
          }
        }
      })
    );

    think.logger.info(`系统结束处理延时任务---团购规则过期---${grouponRulesId}`);
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