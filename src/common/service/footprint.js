module.exports = class extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {object} footprint 
   */
  add(footprint) {
    const now = Date.now();
    return this.model('footprint')
      .add({
        addTime: now,
        updateTime: now,
        ...footprint,
      });
  }
}