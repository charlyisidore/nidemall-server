module.exports = class extends think.Model {
  field(fields) {
    return super.field(
      fields
        .split(',')
        .map((k) => think.snakeCase(k.trim()))
        .join(',')
    );
  }

  where(where) {
    return super.where(this._toSnakeCase(where));
  }

  order(value) {
    return super.order(this._toSnakeCase(value));
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
    const dataType = this.schema?.[key]?.dataType;

    switch (dataType) {
      case 'boolean':
        return value ? 1 : 0;
      case 'json':
        return JSON.stringify(value);
    }

    return value;
  }

  _afterValue(value, key) {
    const dataType = this.schema?.[key]?.dataType;

    switch (dataType) {
      case 'boolean':
        return !!value;
      case 'json':
        return JSON.parse(value);
    }

    return value;
  }

  _toSnakeCase(data) {
    return think.isObject(data) ?
      Object.fromEntries(
        Object.entries(data)
          .map(([k, v]) => [think.snakeCase(k), v])
      ) :
      data;
  }
};