module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   */
  queryIndex() {
    return this.model('ad')
      .where({
        position: 1,
        enabled: true,
        deleted: false,
      })
      .select();
  }
}