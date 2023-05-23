const Base = require('./base.js');

module.exports = class extends Base {
  async listAction() {
    const page = this.getInt('page', 1);
    const limit = this.getInt('limit', 10);
    const sort = think.camelCase(this.getString('sort', 'add_time'));
    const order = this.getString('order', 'DESC');

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
    const id = this.getInt('id');
    const brandService = this.service('brand');

    const entity = await brandService.findById(id);
    if (!entity) {
      return this.badArgumentValue();
    }

    return this.success(entity);
  }
};
