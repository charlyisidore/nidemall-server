/** @see https://mswjs.io/docs/getting-started/integrate/node */

const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

exports.server = setupServer(...handlers);
