const Base = require('./base.js');

module.exports = class WxBrandController extends Base {
  async listAction() {
    const page = this.get('page');
    const limit = this.get('limit');
    const sort = think.camelCase(this.get('sort'));
    const order = this.get('order');

    /** @type {BrandService} */
    const brandService = this.service('brand');
    const brandList = await brandService.query(page, limit, sort, order);

    return this.success({
      total: brandList.count,
      pages: brandList.totalPages,
      limit: brandList.pageSize,
      page: brandList.currentPage,
      list: brandList.data,
    });
  }

  async detailAction() {
    const id = this.get('id');
    /** @type {BrandService} */
    const brandService = this.service('brand');

    const entity = await brandService.findById(id);
    if (think.isEmpty(entity)) {
      return this.badArgumentValue();
    }

    return this.success(entity);
  }
};
