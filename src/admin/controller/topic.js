const Base = require('./base.js');

module.exports = class AdminTopicController extends Base {
  async listAction() {
    /** @type {string?} */
    const title = this.get('title');
    /** @type {string?} */
    const subtitle = this.get('subtitle');
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

    const topicList = await topicService.querySelective(
      title,
      subtitle,
      page,
      limit,
      sort,
      order
    );

    return this.successList(topicList);
  }

  async createAction() {
    const topic = this.post([
      'title',
      'subtitle',
      'picUrl',
      'content',
      'price',
      'readCount',
      'goods',
    ].join(','));

    /** @type {TopicService} */
    const topicService = this.service('topic');

    topic.id = await topicService.add(topic);

    return this.success(topic);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {TopicService} */
    const topicService = this.service('topic');

    const topic = await topicService.findById(id);

    const goodsList = think.isEmpty(topic.goods)
      ? []
      : await goodsService.queryByIds(topic.goods);

    return this.success({
      topic,
      goodsList,
    });
  }

  async updateAction() {
    const topic = this.post([
      'id',
      'title',
      'subtitle',
      'picUrl',
      'content',
      'price',
      'readCount',
      'goods',
    ].join(','));

    /** @type {TopicService} */
    const topicService = this.service('topic');

    if (!await topicService.updateById(topic)) {
      return this.updatedDataFailed();
    }

    return this.success(topic);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');
    /** @type {TopicService} */
    const topicService = this.service('topic');

    await topicService.deleteById(id);

    return this.success();
  }

  async ['batch-deleteAction']() {
    /** @type {number[]} */
    const ids = this.post('ids');
    /** @type {TopicService} */
    const topicService = this.service('topic');

    await topicService.deleteByIds(ids);

    return this.success();
  }
};
