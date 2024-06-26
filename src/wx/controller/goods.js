const Base = require('./base.js');

module.exports = class WxGoodsController extends Base {
  async detailAction() {
    const userId = this.getUserId();
    /** @type {number} */
    const id = this.get('id');

    /** @type {BrandService} */
    const brandService = this.service('brand');
    /** @type {CollectService} */
    const collectService = this.service('collect');
    /** @type {FootprintService} */
    const footprintService = this.service('footprint');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {GoodsAttributeService} */
    const goodsAttributeService = this.service('goods_attribute');
    /** @type {GoodsSpecificationService} */
    const goodsSpecificationService = this.service('goods_specification');
    /** @type {GoodsProductService} */
    const goodsProductService = this.service('goods_product');
    /** @type {GrouponRulesService} */
    const grouponRulesService = this.service('groupon_rules');
    /** @type {IssueService} */
    const issueService = this.service('issue');
    /** @type {SystemService} */
    const systemService = this.service('system');

    const info = await goodsService.findById(id);

    if (think.isEmpty(info)) {
      return this.badArgumentValue();
    }

    let userHasCollect = 0;
    if (!think.isNullOrUndefined(userId)) {
      userHasCollect = await collectService.count(userId, 0, id);
      await footprintService.add({
        userId,
        goodsId: id,
      });
    }

    const promises = {
      issue: issueService.querySelective('', 1, 4),
      comment: this.getComments(id),
      specificationList: goodsSpecificationService.getSpecificationVoList(id),
      productList: goodsProductService.queryByGid(id),
      attribute: goodsAttributeService.queryByGid(id),
      brand: think.isEmpty(info.brandId) ? {} : brandService.findById(info.brandId),
      groupon: grouponRulesService.queryByGoodsId(id),
      share: systemService.isAutoCreateShareImage(),
    };

    const values = await Promise.all(Object.values(promises));
    const data = Object.fromEntries(
      Object.keys(promises).map((k, i) => [k, values[i]])
    );

    return this.success({
      specificationList: data.specificationList,
      groupon: data.groupon,
      issue: data.issue.data,
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
    /** @type {number} */
    const id = this.get('id');
    /** @type {CategoryService} */
    const categoryService = this.service('category');

    let current = await categoryService.findById(id);
    let parent = null;
    let children = null;

    if (think.isEmpty(current)) {
      return this.badArgumentValue();
    }

    if (0 == current.pid) {
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
    const userId = this.getUserId();
    /** @type {number?} */
    const categoryId = this.get('categoryId');
    /** @type {number?} */
    const brandId = this.get('brandId');
    /** @type {string?} */
    const keyword = this.get('keyword');
    /** @type {boolean?} */
    const isNew = this.get('isNew');
    /** @type {boolean?} */
    const isHot = this.get('isHot');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {CategoryService} */
    const categoryService = this.service('category');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {SearchHistoryService} */
    const searchHistoryService = this.service('search_history');

    if (!think.isNullOrUndefined(userId) && !think.isTrueEmpty(keyword)) {
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

    const categoryList = think.isEmpty(goodsCatIds)
      ? []
      : (await categoryService.queryL2ByIds(goodsCatIds));

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
    /** @type {number} */
    const id = this.get('id');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');

    const goods = await goodsService.findById(id);
    if (think.isEmpty(goods)) {
      return this.badArgumentValue();
    }

    const goodsList = await goodsService.queryByCategory(goods.categoryId, 0, 6);

    return this.successList(goodsList);
  }

  async countAction() {
    /** @type {GoodsService} */
    const goodsService = this.service('goods');

    return this.success(await goodsService.queryOnSale());
  }

  /**
   * .
   * @param {number} id .
   */
  async getComments(id) {
    /** @type {CommentService} */
    const commentService = this.service('comment');
    /** @type {UserService} */
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
            nickname: think.isEmpty(user) ? '' : user.nickname,
            avatar: think.isEmpty(user) ? '' : user.avatar,
            picList: comment.picUrls,
          };
        })
    );

    return {
      data: commentList,
      count: comments.count,
    };
  }
};
