const Base = require('./base.js');

module.exports = class WxTopicController extends Base {
  async listAction() {
    const page = this.get('page');
    const limit = this.get('limit');
    const sort = think.camelCase(this.get('sort'));
    const order = this.get('order');

    const topicService = this.service('topic');
    const topicList = await topicService.queryList(page, limit, sort, order);

    return this.success({
      total: topicList.count,
      pages: topicList.totalPages,
      limit: topicList.pageSize,
      page: topicList.currentPage,
      list: topicList.data,
    });
  }

  async detailAction() {
    const userId = this.getUserId();
    const id = this.get('id');

    const collectService = this.service('collect');
    const goodsService = this.service('goods');
    const topicService = this.service('topic');

    const topic = await topicService.findById(id);

    if (think.isEmpty(topic)) {
      return this.badArgument();
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
    const id = this.get('id');
    const topicService = this.service('topic');

    const topicRelatedList = await topicService.queryRelatedList(id, 0, 4);

    return this.success({
      total: topicRelatedList.count,
      pages: topicRelatedList.totalPages,
      limit: topicRelatedList.pageSize,
      page: topicRelatedList.currentPage,
      list: topicRelatedList.data,
    });
  }
};
