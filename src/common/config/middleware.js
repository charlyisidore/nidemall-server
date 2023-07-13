const path = require('node:path');
const isDev = ('development' === think.env);

module.exports = [
  // https://github.com/thinkjs/think-meta
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev,
    },
  },
  // https://github.com/thinkjs/think-resource
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/,
    },
  },
  // https://github.com/thinkjs/think-trace
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev,
      error: () => isDev,
    },
  },
  // https://github.com/thinkjs/think-payload
  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '20mb',
      extendTypes: {
        xml: ['application/xml'],
      },
    },
  },
  // https://github.com/thinkjs/think-router
  {
    handle: 'router',
    options: {},
  },
  // src/common/middleware/auth.js
  {
    handle: 'auth',
    options: {},
  },
  // src/common/middleware/admin.js
  {
    handle: 'admin',
    options: {},
  },
  // https://github.com/thinkjs/think-logic
  'logic',
  // https://github.com/thinkjs/think-controller
  'controller',
];
