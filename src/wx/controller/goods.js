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
      share: systemService.isAutoCreateShareImage(),
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
      specificationList: data.specificationList,
      groupon: data.groupon,
      issue: data.issue,
      userHasCollect,
      shareImage: info.shareUrl,
      comment: data.comment,
      share: ('true' == data.share),
      attribute: data.attribute,
      brand: data.brand,
      productList: data.productList,
      info,
    });
  }

  async categoryAction() {
    const id = this.get('id');
    const categoryService = this.service('category');

    let current = await categoryService.findById(id);
    let parent = null;
    let children = null;

    if (current.pid == 0) {
      parent = current;
      children = await categoryService.queryByPid(current.id);
      current = (children.length > 0) ? children[0] : current;
    } else {
      parent = await categoryService.findById(current.pid);
      children = await categoryService.queryByPid(current.pid);
    }

    return this.success({
      currentCategory: current,
      brotherCategory: children,
      parentCategory: parent,
    });
  }

  async listAction() {
    const categoryId = this.get('categoryId');
    const brandId = this.get('brandId');
    const keyword = this.get('keyword');
    const isNew = this.get('isNew');
    const isHot = this.get('isHot');
    const page = this.get('page') || 1;
    const limit = this.get('limit') || 10;
    const sort = think.camelCase(this.get('sort') || 'add_time');
    const order = this.get('order') || 'DESC';
    const userId = this.ctx.state.userId;

    const categoryService = this.service('category');
    const goodsService = this.service('goods');
    const searchHistoryService = this.service('search_history');

    if (userId && keyword != '') {
      await searchHistoryService.save({
        keyword,
        userId,
        from: 'wx',
      });
    }

    const goodsList = await goodsService.querySelectiveCategory(
      categoryId,
      brandId,
      keyword,
      isHot,
      isNew,
      page,
      limit,
      sort,
      order
    );

    const goodsCatIds = await goodsService.getCatIds(brandId, keyword, isHot, isNew);

    const categoryList = (goodsCatIds.length > 0) ?
      (await categoryService.queryL2ByIds(goodsCatIds)) :
      [];

    return this.success({
      total: goodsList.count,
      pages: goodsList.totalPages,
      limit: goodsList.pageSize,
      page: goodsList.currentPage,
      list: goodsList.data,
      filterCategoryList: categoryList,
    });
  }

  async relatedAction() {
    const id = this.get('id');
    const goodsService = this.service('goods');

    const goods = await goodsService.findById(id);
    if (!goods) {
      return this.badArgumentValue();
    }

    const goodsList = await goodsService.queryByCategory(goods.categoryId, 0, 6);

    return this.success({
      total: goodsList.count,
      pages: goodsList.totalPages,
      limit: goodsList.pageSize,
      page: goodsList.currentPage,
      list: goodsList.data,
    });
  }

  async countAction() {
    const goodsService = this.service('goods');

    return this.success(await goodsService.queryOnSale());
  }

  /**
   * 
   * @param {number} id 
   */
  async getComments(id) {
    const commentService = this.service('comment');
    const userService = this.service('user');

    const comments = await commentService.queryGoodsByGid(id, 0, 2);

    const commentList = await Promise.all(
      comments.data
        .map(async (comment) => {
          const user = await userService.findById(comment.userId);
          return {
            id: comment.id,
            addTime: comment.addTime,
            content: comment.content,
            adminContent: comment.adminContent,
            nickname: (user ? user.nickname : ''),
            avatar: (user ? user.avatar : ''),
            picList: comment.picUrls,
          };
        })
    );

    return {
      data: commentList,
      count: comments.count,
    }
  }
};
