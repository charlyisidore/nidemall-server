const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const id = this.get('id');
    const categoryService = this.service('category');

    const l1CatList = await categoryService.queryL1();

    let currentCategory = null;
    if (null != id) {
      currentCategory = await categoryService.findById(id);
    } else {
      if (l1CatList.length > 0) {
        currentCategory = l1CatList[0];
      }
    }

    let currentSubCategory = null;
    if (null != currentCategory) {
      currentSubCategory = await categoryService.queryByPid(currentCategory.id);
    }

    return this.success({
      categoryList: l1CatList,
      currentCategory,
      currentSubCategory,
    });
  }

  async allAction() {
    const categoryService = this.service('category');

    const l1CatList = await categoryService.queryL1();

    const allList = {};
    for (const category of l1CatList) {
      allList[category.id] = await categoryService.queryByPid(category.id);
    }

    const currentCategory = l1CatList[0];

    let currentSubCategory = null;
    if (null !== currentCategory) {
      currentSubCategory = await categoryService.queryByPid(currentCategory.id);
    }

    return this.success({
      categoryList: l1CatList,
      allList,
      currentCategory,
      currentSubCategory,
    });
  }

  async currentAction() {
    const id = this.get('id');
    const categoryService = this.service('category');

    const currentCategory = await categoryService.findById(id);
    if (null === currentCategory) {
      return this.badArgumentValue();
    }

    const currentSubCategory = await categoryService.queryByPid(currentCategory.id);

    return this.success({
      currentCategory,
      currentSubCategory,
    });
  }
};