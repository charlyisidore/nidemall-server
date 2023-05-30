const Base = require('./base.js');

module.exports = class WxHomeController extends Base {
  async indexAction() {
    const userId = this.getUserId();

    /** @type {AdService} */
    const adService = this.service('ad');
    /** @type {CategoryService} */
    const categoryService = this.service('category');
    /** @type {CouponService} */
    const couponService = this.service('coupon');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {BrandService} */
    const brandService = this.service('brand');
    /** @type {TopicService} */
    const topicService = this.service('topic');
    /** @type {GrouponRulesService} */
    const grouponRulesService = this.service('groupon_rules');
    /** @type {SystemService} */
    const systemService = this.service('system');

    const newLimit = parseInt(await systemService.getNewLimit());
    const hotLimit = parseInt(await systemService.getHotLimit());
    const brandLimit = parseInt(await systemService.getBrandLimit());
    const topicLimit = parseInt(await systemService.getTopicLimit());

    const promises = {
      newGoodsList: goodsService.queryByNew(0, newLimit),
      couponList: (think.isNullOrUndefined(userId) ?
        couponService.queryList(0, 3) :
        couponService.queryAvailableList(userId, 0, 3)),
      channel: categoryService.queryChannel(),
      grouponList: grouponRulesService.wxQueryList(0, 5),
      banner: adService.queryIndex(),
      brandList: brandService.query(0, brandLimit),
      hotGoodsList: goodsService.queryByHot(0, hotLimit),
      topicList: topicService.queryList(0, topicLimit),
      floorGoodsList: this.getCategoryList(),
    };

    const values = await Promise.all(Object.values(promises));
    const data = Object.fromEntries(
      Object.keys(promises).map((k, i) => [k, values[i]])
    );

    return this.success({
      newGoodsList: data.newGoodsList,
      couponList: data.couponList.data,
      channel: data.channel,
      grouponList: data.grouponList.data,
      banner: data.banner,
      brandList: data.brandList.data,
      hotGoodsList: data.hotGoodsList,
      topicList: data.topicList.data,
      floorGoodsList: data.floorGoodsList,
    });
  }

  async aboutAction() {
    /** @type {SystemService} */
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
    /** @type {CategoryService} */
    const categoryService = this.service('category');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {SystemService} */
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

      const categoryGoods = think.isEmpty(l2List) ?
        [] :
        (await goodsService.queryByCategory(l2List, 0, catlogMoreLimit)).data;

      categoryList.push({
        id: catL1.id,
        name: catL1.name,
        goodsList: categoryGoods,
      });
    }

    return categoryList;
  }
};
