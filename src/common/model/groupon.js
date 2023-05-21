const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      order_id: {
        type: 'int(11)',
      },
      groupon_id: {
        type: 'int(11)',
      },
      rules_id: {
        type: 'int(11)',
      },
      user_id: {
        type: 'int(11)',
      },
      share_url: {
        type: 'varchar(255)',
      },
      creator_user_id: {
        type: 'int(11)',
      },
      creator_user_time: {
        type: 'datetime',
      },
      status: {
        type: 'smallint(6)',
      },
      add_time: {
        type: 'datetime',
      },
      update_time: {
        type: 'datetime',
      },
      deleted: {
        type: 'tinyint(1)',
      },
    }
  }
};
