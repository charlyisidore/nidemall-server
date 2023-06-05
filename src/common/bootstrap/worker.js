// invoked in worker
think.beforeStartServer(async () => {
  /** @type {GrouponRulesService} */
  const grouponRulesService = think.service('groupon_rules');
  await grouponRulesService.expiredTaskStartup();
});
