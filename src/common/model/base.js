function renameKeys(data, rename) {
  return Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => [
        rename(key),
        value
      ])
  );
}

function toSnakeCase(data) {
  return renameKeys(data, (key) => key.replace(/([A-Z])/g, '_$1').toLowerCase());
}

function toCamelCase(data) {
  return renameKeys(data, (key) => key.replace(/_([a-z])/g, (_, s) => s.toUpperCase()));
}

module.exports = class extends think.Model {
  afterFind(data) {
    return toCamelCase(data);
  }

  afterSelect(data) {
    return data.map((item) => this.afterFind(item));
  }
};