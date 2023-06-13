module.exports = class extends think.Model {
  field(field) {
    if (think.isString(field)) {
      field = field.split(',');
    }
    return super.field(
      field
        .map((k) => this._beforeField(k.trim()))
        .join(',')
    );
  }

  where(where) {
    return super.where(this._beforeClause(where));
  }

  order(value) {
    return super.order(this._beforeClause(value));
  }

  add(data, options) {
    return super.add(this._before(data), options);
  }

  update(data, options) {
    return super.update(this._before(data), options);
  }

  afterDelete(data) {
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
          this._beforeValue(v, think.snakeCase(k))
        ])
        .filter(([k, v]) => !think.isUndefined(v))
    );
  }

  _after(data) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([k, v]) => [
          think.camelCase(k),
          this._afterValue(v, k)
        ])
        .filter(([k, v]) => !think.isNullOrUndefined(v))
    );
  }

  _beforeValue(value, key) {
    const dataType = this.schema?.[key]?.dataType;

    switch (dataType) {
      case 'boolean':
        return value ? 1 : 0;
      case 'datetime':
        return think.datetime(value);
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

  _beforeField(field) {
    const m = field.match(/^([\w_][\w_\.]*) AS ([\w_]+)$/i);
    if (!think.isEmpty(m)) {
      return `${this._beforeFieldName(m[1])} AS ${m[2]}`;
    }
    if (/^[\w_][\w_\.]*$/.test(field)) {
      return this._beforeFieldName(field);
    }
    return field;
  }

  _beforeFieldName(field) {
    return field
      .split('.')
      .map((k, i, a) => (i + 1 === a.length) ? think.snakeCase(k) : k)
      .join('.');
  }

  _beforeClause(data) {
    return think.isObject(data) ?
      Object.fromEntries(
        Object.entries(data)
          .map(([k, v]) => [
            think.snakeCase(k),
            think.isUndefined(v) ? null : v
          ])
      ) :
      data;
  }
};