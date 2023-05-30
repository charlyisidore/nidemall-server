const test = require('ava');
const path = require('node:path');
require(path.join(process.cwd(), 'production.js'));

test('first test', (t) => {
  t.pass();
})
