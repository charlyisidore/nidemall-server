const Base = require('./base.js');

module.exports = class WxCollectController extends Base {
  async listAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const type = this.get('type');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {CollectService} */
    const collectService = this.service('collect');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {TopicService} */
    const topicService = this.service('topic');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const collectList = await collectService.queryByType(
      userId,
      type,
      page,
      limit,
      sort,
      order
    );

    const collectVoList = await Promise.all(
      collectList.data.map(async (collect) => {
        const collectVo = {
          id: collect.id,
          type: collect.type,
          valueId: collect.valueId,
        };

        if (0 == type) {
          const goods = await goodsService.findById(collect.valueId);

          Object.assign(collectVo, {
            name: goods.name,
            brief: goods.brief,
            picUrl: goods.picUrl,
            retailPrice: goods.retailPrice,
          });
        } else {
          const topic = await topicService.findById(collect.valueId);

          Object.assign(collectVo, {
            name: topic.title,
            subtitle: topic.title,
            price: topic.price,
            picUrl: topic.picUrl,
          });
        }

        return collectVo;
      })
    );

    return this.successList(collectVoList, collectList);
  }

  async addordeleteAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const type = this.get('type');
    /** @type {number} */
    const valueId = this.get('valueId');

    /** @type {CollectService} */
    const collectService = this.service('collect');

    if (think.isNullOrUndefined(userId)) {
      return this.unlogin();
    }

    const collect = !think.isNullOrUndefined(type) && !think.isNullOrUndefined(valueId) ?
      await collectService.queryByTypeAndValue(userId, type, valueId) :
      {};

    if (think.isEmpty(collect)) {
      await collectService.add({
        userId,
        type,
        valueId,
      });
    } else {
      await collectService.deleteById(collect.id);
    }

    return this.success();
  }
};
