const Base = require('./base.js');

module.exports = class WxTopicController extends Base {
  async listAction() {
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {TopicService} */
    const topicService = this.service('topic');
    const topicList = await topicService.queryList(page, limit, sort, order);

    return this.successList(topicList);
  }

  async detailAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const id = this.get('id');

    /** @type {CollectService} */
    const collectService = this.service('collect');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {TopicService} */
    const topicService = this.service('topic');

    const topic = await topicService.findById(id);

    if (think.isEmpty(topic)) {
      return this.badArgumentValue();
    }

    const goodsList = [];
    for (const goodsId of topic.goods) {
      const goods = await goodsService.findByIdVo(goodsId);

      if (!think.isEmpty(goods)) {
        goodsList.push(goods);
      }
    }

    const userHasCollect = think.isNullOrUndefined(userId) ?
      0 :
      (await collectService.count(userId, 1, id));

    return this.success({
      topic,
      goods: goodsList,
      userHasCollect,
    });
  }

  async relatedAction() {
    /** @type {number} */
    const id = this.get('id');
    /** @type {TopicService} */
    const topicService = this.service('topic');

    const topicRelatedList = await topicService.queryRelatedList(id, 0, 4);

    return this.successList(topicRelatedList);
  }
};
