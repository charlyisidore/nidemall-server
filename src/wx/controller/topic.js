const Base = require('./base.js');

module.exports = class extends Base {
  async listAction() {
    const page = this.getInt('page', 1);
    const limit = this.getInt('limit', 10);
    const sort = think.camelCase(this.getString('sort', 'add_time'));
    const order = this.getString('order', 'DESC');

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
    const id = this.getInt('id');

    const collectService = this.service('collect');
    const goodsService = this.service('goods');
    const topicService = this.service('topic');

    const topic = await topicService.findById(id);
    const goodsList = [];
    for (const goodsId of topic.goods) {
      const goods = await goodsService.findByIdVo(goodsId);
      if (goods) {
        goodsList.push(goods);
      }
    }

    const userHasCollect = userId ?
      await collectService.count(userId, 1, id) :
      0;

    return this.success({
      topic,
      goods: goodsList,
      userHasCollect,
    });
  }

  async relatedAction() {
    const id = this.getInt('id');
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
