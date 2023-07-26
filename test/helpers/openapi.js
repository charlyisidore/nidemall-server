const SwaggerParser = require('@apidevtools/swagger-parser');
const Ajv = require('ajv/dist/2019');

const ajv = new Ajv({
  strict: true,
});

const api = SwaggerParser.dereference('openapi/openapi.yaml');
const cache = {};

class ValidateResponseError extends Error {
  constructor(error) {
    if (Array.isArray(error)) {
      super(error.map((err) => err.message).join("\n"));
      this.errors = error;
    } else {
      super(error);
    }
  }
}

async function validateApi() {
  return SwaggerParser.validate(api);
};

async function validateResponse(request, response) {
  const key = `${request.method.toLowerCase()}:${request.path}`;
  let validate;

  if (key in cache) {
    validate = cache[key];
  } else {
    const schema = (await api)?.paths
      ?.[request.path]
      ?.[request.method.toLowerCase()]
      ?.responses?.['200']
      ?.content?.['application/json']
      ?.schema;

    if (!schema) {
      throw new ValidateResponseError(`Schema for "${key}" does not exist`);
    }

    validate = ajv.compile(schema);
    cache[key] = validate;
  }

  if (!validate(response)) {
    console.error(`Validate response error:\n${JSON.stringify(response, null, 2)}`);
    throw new ValidateResponseError(validate.errors);
  }
};

module.exports = {
  validateApi,
  validateResponse,
}