const Base = require('./base.js');

module.exports = class AdminCategoryController extends Base {
  async listAction() {
    /** @type {CategoryService} */
    const categoryService = this.service('category');

    const categoryList = await categoryService.queryByPid(0);

    const categoryVoList = await Promise.all(
      categoryList.map(async (category) => {
        const subCategoryList = await categoryService.queryByPid(category.id);
        return {
          id: category.id,
          desc: category.desc,
          iconUrl: category.iconUrl,
          picUrl: category.picUrl,
          keywords: category.keywords,
          name: category.name,
          level: category.level,
          children: subCategoryList.map((subCategory) => ({
            id: subCategory.id,
            desc: subCategory.desc,
            iconUrl: subCategory.iconUrl,
            picUrl: subCategory.picUrl,
            keywords: subCategory.keywords,
            name: subCategory.name,
            level: subCategory.level,
            pid: subCategory.pid,
          })),
        };
      })
    );

    return this.successList(categoryVoList);
  }

  async createAction() {
    const category = this.post([
      'name',
      'keywords',
      'level',
      'pid',
      'iconUrl',
      'picUrl',
      'desc',
    ].join(','));

    /** @type {CategoryService} */
    const categoryService = this.service('category');

    const error = this.validate(category);
    if (!think.isNullOrUndefined(error)) {
      return error;
    }

    category.id = await categoryService.add(category);

    return this.success(category);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {CategoryService} */
    const categoryService = this.service('category');

    const category = await categoryService.findById(id);

    return this.success(category);
  }

  async updateAction() {
    const category = this.post([
      'id',
      'name',
      'keywords',
      'level',
      'pid',
      'iconUrl',
      'picUrl',
      'desc',
    ].join(','));

    /** @type {CategoryService} */
    const categoryService = this.service('category');

    const error = this.validate(category);
    if (!think.isNullOrUndefined(error)) {
      return error;
    }

    if (!await categoryService.updateById(category)) {
      return this.updatedDataFailed();
    }

    return this.success(category);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {CategoryService} */
    const categoryService = this.service('category');

    await categoryService.deleteById(id);

    return this.success();
  }

  async l1Action() {
    /** @type {CategoryService} */
    const categoryService = this.service('category');

    const l1CatList = (await categoryService.queryL1())
      .map((category) => ({
        value: category.id,
        label: category.name,
      }));

    return this.successList(l1CatList);
  }

  validate(category) {
    if (!['L1', 'L2'].includes(category.level)) {
      return this.badArgumentValue();
    }

    if ('L2' == category.level && think.isNullOrUndefined(category.pid)) {
      return this.badArgument();
    }

    return null;
  }
};
