module.exports = class extends think.Logic {
  async __before() {
    return super.__before?.();
  }

  async __after() {
    return super.__after?.();
  }
};
