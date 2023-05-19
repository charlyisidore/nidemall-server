function renameKeys(data, rename) {
  return Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => [
        rename(key),
        value
      ])
  );
}

module.exports = class extends think.Model {
  afterFind(data) {
    return renameKeys(data, think.camelCase);
  }

  afterSelect(data) {
    return data.map((item) => this.afterFind(item));
  }
};