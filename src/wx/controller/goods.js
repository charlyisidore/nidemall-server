const Base = require('./base.js');

module.exports = class extends Base {
  async detailAction() {
    const id = this.get('id');
    const userId = this.ctx.state.userId;

    const brandService = this.service('brand');
    const collectService = this.service('collect');
    const goodsService = this.service('goods');
    const goodsAttributeService = this.service('goods_attribute');
    const goodsSpecificationService = this.service('goods_specification');
    const goodsProductService = this.service('goods_product');
    const grouponRulesService = this.service('groupon_rules');
    const issueService = this.service('issue');
    const systemService = this.service('system');

    const info = await goodsService.findById(id);

    const promises = {
      issue: issueService.querySelective('', 1, 4),
      comment: this.getComments(id),
      specificationList: goodsSpecificationService.getSpecificationVoList(id),
      productList: goodsProductService.queryByGid(id),
      attribute: goodsAttributeService.queryByGid(id),
      brand: (info.brandId == 0) ? {} : brandService.findById(info.brandId),
      groupon: grouponRulesService.queryByGoodsId(id),
      share: ('true' == systemService.isAutoCreateShareImage()),
    };

    let userHasCollect = 0;
    if (userId) {
      userHasCollect = await collectService.count(userId, 0, id);
      await footprintService.add({
        userId,
        goodsId: id,
      });
    }

    const values = await Promise.all(Object.values(promises));
    const data = Object.fromEntries(
      Object.keys(promises).map((k, i) => [k, values[i]])
    );

    return this.success({
      info,
      userHasCollect,
      ...data,
    });
  }

  async categoryAction() {
    return this.success('todo');
  }

  async listAction() {
    return this.success('todo');
  }

  async relatedAction() {
    return this.success('todo');
  }

  async countAction() {
    return this.success('todo');
  }

  /**
   * 
   * @param {number} id 
   */
  async getComments(id) {
    const commentService = this.service('comment');
    const userService = this.service('user');

    const comments = (await commentService.queryGoodsByGid(id, 0, 2))
      .map((comment) => {
        // TODO: cache users to avoid redundant queries
        const user = userService.findById(comment.userId);
        return {
          id: comment.id,
          addTime: comment.addTime,
          content: comment.content,
          adminContent: comment.adminContent,
          nickname: (user ? user.nickname : ''),
          avatar: (user ? user.avatar : ''),
          picList: comment.picUrls,
        };
      });

    return {
      count: comments.length,
      data: comments,
    }
  }
};
