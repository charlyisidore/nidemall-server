const test = require('ava');
const { validateApi } = require('./helpers/openapi.js');

test('validate', async (t) => {
  await t.notThrowsAsync(validateApi);
});
