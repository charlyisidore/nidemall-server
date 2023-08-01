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
    return this.transaction(async () => {
      /** @type {object} */
      const goods = this.post('goods');
      /** @type {object[]} */
      const specifications = this.post('specifications');
      /** @type {object[]} */
      const products = this.post('products');
      /** @type {object[]} */
      const attributes = this.post('attributes');

      /** @type {CartService} */
      const cartService = this.service('cart');
      /** @type {GoodsService} */
      const goodsService = this.service('goods');
      /** @type {GoodsAttributeService} */
      const goodsAttributeService = this.service('goods_attribute');
      /** @type {GoodsProductService} */
      const goodsProductService = this.service('goods_product');
      /** @type {GoodsSpecificationService} */
      const goodsSpecificationService = this.service('goods_specification');
      /** @type {QrCodeService} */
      const qrCodeService = this.service('qr_code');

      const error = await this.validate(goods, attributes, specifications, products);
      if (!think.isNullOrUndefined(error)) {
        return error;
      }

      Object.assign(goods, {
        // 将生成的分享图片地址写入数据库
        shareUrl: await qrCodeService.createGoodsShareImage(goods.id, goods.picUrl, goods.name),
        // 商品表里面有一个字段retailPrice记录当前商品的最低价
        retailPrice: Math.min(...products.map((product) => product.price)),
      });

      if (!await goodsService.updateById(goods)) {
        throw new Error('更新数据失败');
      }

      await this.promiseAllFinished([
        ...specifications
          .map(async (specification) => {
            // 目前只支持更新规格表的图片字段
            if (think.isNullOrUndefined(specification.updateTime)) {
              Object.assign(specification, {
                specification: null,
                value: null,
              });
              await goodsSpecificationService.updateById(specification);
            }
          }),
        ...products
          .map(async (product) => {
            if (think.isNullOrUndefined(product.updateTime)) {
              await goodsProductService.updateById(product);
            }
          }),
        ...attributes
          .map(async (attribute) => {
            if (think.isEmpty(attribute.id)) {
              Object.assign(attribute, {
                goodsId: goods.id,
              });
              await goodsAttributeService.add(attribute);
            } else if (attribute.deleted) {
              await goodsAttributeService.deleteById(attribute.id);
            } else if (think.isNullOrUndefined(attribute.updateTime)) {
              await goodsAttributeService.updateById(attribute);
            }
          }),
      ]);

      await this.promiseAllFinished(
        products.map(async (product) => {
          await cartService.updateProduct(product.id, goods.goodsSn, goods.name, product.price, product.url);
        })
      );

      return this.success();
    });
  }

  async deleteAction() {
    return this.transaction(async () => {
      /** @type {number} */
      const id = this.post('id');

      /** @type {GoodsService} */
      const goodsService = this.service('goods');
      /** @type {GoodsAttributeService} */
      const goodsAttributeService = this.service('goods_attribute');
      /** @type {GoodsProductService} */
      const goodsProductService = this.service('goods_product');
      /** @type {GoodsSpecificationService} */
      const goodsSpecificationService = this.service('goods_specification');

      await this.promiseAllFinished([
        goodsService.deleteById(id),
        goodsSpecificationService.deleteByGid(id),
        goodsAttributeService.deleteByGid(id),
        goodsProductService.deleteByGid(id),
      ]);

      return this.success();
    });
  }

  async createAction() {
    return this.transaction(async () => {
      /** @type {object} */
      const goods = this.post('goods');
      /** @type {object[]} */
      const specifications = this.post('specifications');
      /** @type {object[]} */
      const products = this.post('products');
      /** @type {object[]} */
      const attributes = this.post('attributes');

      /** @type {GoodsService} */
      const goodsService = this.service('goods');
      /** @type {GoodsAttributeService} */
      const goodsAttributeService = this.service('goods_attribute');
      /** @type {GoodsProductService} */
      const goodsProductService = this.service('goods_product');
      /** @type {GoodsSpecificationService} */
      const goodsSpecificationService = this.service('goods_specification');
      /** @type {QrCodeService} */
      const qrCodeService = this.service('qr_code');

      const { ADMIN_RESPONSE } = goodsService.getConstants();

      const error = await this.validate(goods, attributes, specifications, products);
      if (!think.isNullOrUndefined(error)) {
        return error;
      }

      if (await goodsService.checkExistByName(goods.name)) {
        return this.fail(ADMIN_RESPONSE.NAME_EXIST, '商品名已经存在');
      }

      Object.assign(goods, {
        // 商品表里面有一个字段retailPrice记录当前商品的最低价
        retailPrice: Math.min(...products.map((product) => product.price)),
      });

      goods.id = await goodsService.add(goods);

      // 将生成的分享图片地址写入数据库
      const shareUrl = await qrCodeService.createGoodsShareImage(goods.id, goods.picUrl, goods.name);
      if (!think.isTrueEmpty(shareUrl)) {
        Object.assign(goods, {
          shareUrl,
        });
        if (!await goodsService.updateById(goods)) {
          throw new Error('更新数据失败');
        }
      }

      await this.promiseAllFinished([
        ...specifications
          .map(async (specification) => {
            Object.assign(specification, {
              goodsId: goods.id,
            });
            await goodsSpecificationService.add(specification);
          }),
        ...attributes
          .map(async (attribute) => {
            Object.assign(attribute, {
              goodsId: goods.id,
            });
            await goodsAttributeService.add(attribute);
          }),
        ...products
          .map(async (product) => {
            Object.assign(product, {
              goodsId: goods.id,
            });
            await goodsProductService.add(product);
          }),
      ]);

      return this.success();
    });
  }

  async detailAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {CategoryService} */
    const categoryService = this.service('category');
    /** @type {GoodsService} */
    const goodsService = this.service('goods');
    /** @type {GoodsAttributeService} */
    const goodsAttributeService = this.service('goods_attribute');
    /** @type {GoodsProductService} */
    const goodsProductService = this.service('goods_product');
    /** @type {GoodsSpecificationService} */
    const goodsSpecificationService = this.service('goods_specification');

    const goods = await goodsService.findById(id);
    const products = await goodsProductService.queryByGid(id);
    const specifications = await goodsSpecificationService.queryByGid(id);
    const attributes = await goodsAttributeService.queryByGid(id);

    const category = await categoryService.findById(goods.categoryId);
    const categoryIds = think.isEmpty(category)
      ? []
      : [category.pid, category.id];

    return this.success({
      goods,
      specifications,
      products,
      attributes,
      categoryIds,
    });
  }

  async validate(goods, attributes, specifications, products) {
    /** @type {BrandService} */
    const brandService = this.service('brand');
    /** @type {CategoryService} */
    const categoryService = this.service('category');

    if (think.isTrueEmpty(goods.name)) {
      return this.badArgument();
    }

    if (think.isTrueEmpty(goods.goodsSn)) {
      return this.badArgument();
    }

    if (!think.isEmpty(goods.brandId)) {
      if (think.isEmpty(await brandService.findById(goods.brandId))) {
        return this.badArgumentValue();
      }
    }

    if (!think.isEmpty(goods.categoryId)) {
      if (think.isEmpty(await categoryService.findById(goods.categoryId))) {
        return this.badArgumentValue();
      }
    }

    for (const attribute of attributes) {
      if (think.isTrueEmpty(attribute.attribute)) {
        return this.badArgument();
      }

      if (think.isTrueEmpty(attribute.value)) {
        return this.badArgument();
      }
    }

    for (const specification of specifications) {
      if (think.isTrueEmpty(specification.specification)) {
        return this.badArgument();
      }

      if (think.isTrueEmpty(specification.value)) {
        return this.badArgument();
      }
    }

    for (const product of products) {
      if (think.isNullOrUndefined(product.number) || product.number < 0) {
        return this.badArgument();
      }

      if (think.isNullOrUndefined(product.price)) {
        return this.badArgument();
      }

      if (think.isEmpty(product.specifications)) {
        return this.badArgument();
      }
    }

    return null;
  }
};
