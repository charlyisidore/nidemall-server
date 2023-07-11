module.exports = class extends think.Logic {
  async __before() {
    return super.__before?.();
  }

  async __after() {
    // Convert data before validation
    Object.entries(this.rules)
      .forEach(([argName, rule]) => {
        const method = this._getCtxMethod(rule.method);
        const value = this.ctx[method](argName);

        if (think.isUndefined(value)) {
          return;
        }

        // ThinkJS converts the string '1' to true, but not the number 1
        // https://github.com/thinkjs/think-validator/blob/846bd2caec7cb06c41fd05bf5f8082e90e928eaf/src/index.js#L299
        if (rule.boolean && 1 === value) {
          this.ctx[method](argName, true);
        }
      });

    return super.__after?.();
  }

  _getCtxMethod(method) {
    // https://github.com/thinkjs/think-validator/blob/846bd2caec7cb06c41fd05bf5f8082e90e928eaf/src/index.js#L239
    const httpMethod = (think.isUndefined(method) || '' === method)
      ? this.ctx.method.toUpperCase()
      : method.toUpperCase();

    // https://github.com/thinkjs/think-validator/blob/a44f08ee7407db9a7e0c2f3c82cf602f710f36b2/src/method.js
    switch (httpMethod) {
      case 'GET':
        return 'param';
      case 'POST':
      case 'PUT':
      case 'DELETE':
      case 'PATCH':
      case 'LINK':
      case 'UNLINK':
        return 'post';
      case 'FILE':
        return 'file';
      default:
        return 'param';
    }
  }
};
