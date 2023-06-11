module.exports = class AftersaleService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number} userId 
   * @param {number?} status 
   * @param {number} page 
   * @param {number} limit 
   * @param {string?} sort 
   * @param {string?} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Aftersale[]}>}
   */
  queryList(userId, status, page, limit, sort, order) {
    const model = this.model('aftersale');

    const where = {
      userId,
      deleted: false,
    };

    if (!think.isNullOrUndefined(status)) {
      Object.assign(where, { status });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({
        [sort]: order,
      });
    } else {
      model.order({
        addTime: 'DESC',
      });
    }

    return model
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {number?} orderId 
   * @param {string?} aftersaleSn 
   * @param {number?} status 
   * @param {number} page 
   * @param {number} limit 
   * @param {string} sort 
   * @param {string} order 
   * @returns {Promise<{pageSize: number, currentPage: number, count: number, totalPages: number, data: Aftersale[]}>}
   */
  querySelective(orderId, aftersaleSn, status, page, limit, sort, order) {
    const model = this.model('aftersale');
    const where = {
      deleted: false,
    };

    if (!think.isNullOrUndefined(orderId)) {
      Object.assign(where, {
        orderId,
      });
    }

    if (!think.isNullOrUndefined(aftersaleSn)) {
      Object.assign(where, {
        aftersaleSn,
      });
    }

    if (!think.isNullOrUndefined(status)) {
      Object.assign(where, {
        status,
      });
    }

    if (!think.isNullOrUndefined(sort) && !think.isNullOrUndefined(order)) {
      model.order({ [sort]: order });
    }

    return model
      .where(where)
      .page(page, limit)
      .countSelect();
  }

  /**
   * 
   * @param {string} aftersaleSn 
   * @param {number} userId 
   * @returns {Promise<number>}
   */
  countByAftersaleSn(aftersaleSn, userId) {
    return this.model('aftersale')
      .where({
        aftersaleSn,
        userId,
        deleted: false,
      })
      .count();
  }

  /**
   * 
   * @param {number} userId 
   * @returns {Promise<string>} A random aftersaleSn
   */
  async generateAftersaleSn(userId) {
    const now = new Date();
    const year = now.getFullYear().toString();
    const mm = (1 + now.getMonth()).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const date = `${year}${mm}${dd}`;

    let aftersaleSn = `${date}${this.getRandomNum(6)}`;
    while (await this.countByAftersaleSn(aftersaleSn, userId)) {
      aftersaleSn = `${date}${this.getRandomNum(6)}`;
    }

    return aftersaleSn;
  }

  /**
   * 
   * @param {Aftersale} aftersale 
   * @returns {Promise<number>} The ID inserted
   */
  add(aftersale) {
    const now = new Date();
    return this.model('aftersale')
      .add(Object.assign(aftersale, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * 
   * @param {number} orderId 
   * @param {number} userId 
   * @returns {Promise<number>} The number of rows affected
   */
  deleteByOrderId(orderId, userId) {
    const now = new Date();
    return this.model('aftersale')
      .where({
        orderId,
        userId,
        deleted: false,
      })
      .update({
        updateTime: now,
        deleted: true,
      });
  }

  /**
   * 
   * @param {number} orderId 
   * @param {number} userId 
   * @returns {Promise<Aftersale|Record<string, never>>}
   */
  findByOrderId(orderId, userId) {
    return this.model('aftersale')
      .where({
        orderId,
        userId,
        deleted: false,
      })
      .find();
  }

  getRandomNum(n) {
    return Math.floor(Math.random() * (Math.pow(10, n) - 1))
      .toString()
      .padStart(n, '0');
  }

  getConstants() {
    return {
      RESPONSE: {
        UNALLOWED: 750,
        INVALID_AMOUNT: 751,
        INVALID_STATUS: 752,
      },
      STATUS: {
        INIT: 0,
        REQUEST: 1,
        RECEPT: 2,
        REFUND: 3,
        REJECT: 4,
        CANCEL: 5,
      },
      TYPE_GOODS: {
        MISS: 0,
        NEEDLESS: 1,
        REQUIRED: 2,
      },
    };
  }
}