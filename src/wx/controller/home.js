const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const userId = this.ctx.state.userId;

    const systemService = this.service('system');
    const newLimit = parseInt(await systemService.getNewLimit());
    const hotLimit = parseInt(await systemService.getHotLimit());
    const brandLimit = parseInt(await systemService.getBrandLimit());
    const topicLimit = parseInt(await systemService.getTopicLimit());

    const adService = this.service('ad');
    const categoryService = this.service('category');
    const couponService = this.service('coupon');
    const goodsService = this.service('goods');
    const brandService = this.service('brand');
    const topicService = this.service('topic');
    const grouponService = this.service('groupon_rules');

    const data = {
      newGoodsList: goodsService.queryByNew(0, newLimit),
      couponList: (userId ?
        couponService.queryAvailableList(userId, 0, 3) :
        couponService.queryList(0, 3)),
      channel: categoryService.queryChannel(),
      grouponList: grouponService.queryRulesList(0, 5),
      banner: adService.queryIndex(),
      brandList: brandService.query(0, brandLimit),
      hotGoodsList: goodsService.queryByHot(0, hotLimit),
      topicList: topicService.queryList(0, topicLimit),
      floorGoodsList: this.getCategoryList(),
    };

    const values = await Promise.all(Object.values(data));

    return this.success(
      Object.fromEntries(
        Object.keys(data).map((k, i) => [k, values[i]])
      )
    );
  }

  async aboutAction() {
    const systemService = this.service('system');

    return this.success({
      qq: await systemService.getMallQq(),
      address: await systemService.getMallAddress(),
      phone: await systemService.getMallPhone(),
      latitude: await systemService.getMallLatitude(),
      name: await systemService.getMallName(),
      longitude: await systemService.getMallLongitude(),
    });
  }

  /**
   * 
   */
  async getCategoryList() {
    const categoryService = this.service('category');
    const goodsService = this.service('goods');
    const systemService = this.service('system');

    const catlogListLimit = parseInt(await systemService.getCatlogListLimit());
    const catlogMoreLimit = parseInt(await systemService.getCatlogMoreLimit());

    const categoryList = [];
    const catL1List = await categoryService.queryL1WithoutRecommend(0, catlogListLimit);

    for (const catL1 of catL1List) {
      const catL2List = await categoryService.queryByPid(catL1.id);
      const l2List = [];

      for (const catL2 of catL2List) {
        l2List.push(catL2.id);
      }

      let categoryGoods;

      if (l2List.length == 0) {
        categoryGoods = [];
      } else {
        categoryGoods = await goodsService.queryByCategory(l2List, 0, catlogMoreLimit).data;
      }

      categoryList.push({
        id: catL1.id,
        name: catL1.name,
        goodsList: categoryGoods,
      });
    }

    return categoryList;
  }
};
