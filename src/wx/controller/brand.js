const Base = require('./base.js');

module.exports = class extends Base {
  async listAction() {
    const page = parseInt(this.get('page') || '1');
    const limit = parseInt(this.get('limit') || '10');
    const sort = think.camelCase(this.get('sort') || 'add_time');
    const order = this.get('order') || 'DESC';

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
    const brandService = this.service('brand');

    const entity = await brandService.findById(id);
    if (!entity) {
      return this.badArgumentValue();
    }

    return this.success(entity);
  }
};
