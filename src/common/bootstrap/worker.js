// invoked in worker
think.beforeStartServer(async () => {
  /** @type {GrouponRulesService} */
  const grouponRulesService = think.service('groupon_rules');
  await grouponRulesService.expiredTaskStartup();
});

if (think.config('mocks')) {
  think.beforeStartServer(() => {
    const { server } = require('../../common/mocks/server.js');
    server.listen();
  });
}
