const Base = require('./base.js');

module.exports = class AdminGoodsController extends Base {
  async listAction() {
    /** @type {number?} */
    const goodsId = this.get('goodsId');
    /** @type {string?} */
    const goodsSn = this.get('goodsSn');
    /** @type {string?} */
    const name = this.get('name');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {GoodsService} */
    const goodsService = this.service('goods');

    const goodsList = await goodsService.querySelectiveGoods(goodsId, goodsSn, name, page, limit, sort, order);

    return this.successList(goodsList);
  }

  async catAndBrandAction() {
    /** @type {BrandService} */
    const brandService = this.service('brand');
    /** @type {CategoryService} */
    const categoryService = this.service('category');

    const l1CatList = await categoryService.queryL1();

    const categoryList = await Promise.all(
      l1CatList.map(async (l1) => {
        const l2CatList = await categoryService.queryByPid(l1.id);
        return {
          value: l1.id,
          label: l1.name,
          children: l2CatList.map((l2) => ({
            value: l2.id,
            label: l2.name,
          })),
        };
      })
    );

    const brandList = (await brandService.all())
      .map((brand) => ({
        value: brand.id,
        label: brand.name,
      }));

    return this.success({
      categoryList,
      brandList,
    });
  }

  async updateAction() {
    return this.success('todo');
  }

  async deleteAction() {
    return this.success('todo');
  }

  async createAction() {
    return this.success('todo');
  }

  async detailAction() {
    return this.success('todo');
  }
};
