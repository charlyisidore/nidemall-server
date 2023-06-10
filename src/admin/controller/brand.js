const Base = require('./base.js');

module.exports = class AdminAdController extends Base {
  async listAction() {
    /** @type {number?} */
    const id = this.get('id');
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

    /** @type {BrandService} */
    const brandService = this.service('brand');

    const brandList = await brandService.querySelective(id, name, page, limit, sort, order);

    return this.successList(brandList);
  }

  async createAction() {
    const brand = this.post([
      'name',
      'desc',
      'picUrl',
      'floorPrice',
    ].join(','));

    /** @type {BrandService} */
    const brandService = this.service('brand');

    brand.id = await brandService.add(brand);

    return this.success(brand);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {BrandService} */
    const brandService = this.service('brand');

    const brand = await brandService.findById(id);

    return this.success(brand);
  }

  async updateAction() {
    const brand = this.post([
      'id',
      'name',
      'desc',
      'picUrl',
      'floorPrice',
    ].join(','));

    /** @type {BrandService} */
    const brandService = this.service('brand');

    if (!await brandService.updateById(brand)) {
      return this.updatedDataFailed();
    }

    return this.success(brand);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {BrandService} */
    const brandService = this.service('brand');

    await brandService.deleteById(id);

    return this.success();
  }
};
