module.exports = class FootprintService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @param {object} footprint 
   */
  add(footprint) {
    const now = new Date();
    return this.model('footprint')
      .add(Object.assign(footprint, {
        addTime: now,
        updateTime: now,
      }));
  }
}