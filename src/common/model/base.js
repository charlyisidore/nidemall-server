module.exports = class extends think.Model {
  field(fields) {
    return super.field(
      fields
        .split(',')
        .map((k) => think.snakeCase(k.trim()))
        .join(',')
    );
  }

  where(data) {
    return super.where(this._toSnakeCase(data));
  }

  order(data) {
    return super.order(this._toSnakeCase(data));
  }

  beforeAdd(data) {
    return this._before(data);
  }

  afterAdd(data) {
    return this._after(data);
  }

  afterDelete(data) {
    return this._after(data);
  }

  beforeUpdate(data) {
    return this._before(data);
  }

  afterUpdate(data) {
    return this._after(data);
  }

  afterFind(data) {
    return this._after(data);
  }

  afterSelect(data) {
    return data.map((item) => this._after(item));
  }

  _toSnakeCase(data) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([k, v]) => [think.snakeCase(k), v])
    );
  }

  _before(data) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([k, v]) => [
          think.snakeCase(k),
          this._beforeValue(v, k)
        ])
    );
  }

  _after(data) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([k, v]) => [
          think.camelCase(k),
          this._afterValue(v, k)
        ])
        .filter(([k, v]) => null !== v)
    );
  }

  _beforeValue(value, key) {
    const type = this.schema?.[key]?.type;

    // boolean
    if ('tinyint(1)' === type) {
      return value ? 1 : 0;
    }

    return value;
  }

  _afterValue(value, key) {
    const type = this.schema?.[key]?.type;

    // boolean
    if ('tinyint(1)' === type) {
      return !!value;
    }

    return value;
  }
};