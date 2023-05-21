const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      aftersale_sn: {
        type: 'varchar(63)',
      },
      order_id: {
        type: 'int(11)',
      },
      user_id: {
        type: 'int(11)',
      },
      type: {
        type: 'smallint(6)',
      },
      reason: {
        type: 'varchar(31)',
      },
      amount: {
        type: 'decimal(10,2)',
      },
      pictures: {
        type: 'varchar(1023)',
      },
      comment: {
        type: 'varchar(511)',
      },
      status: {
        type: 'smallint(6)',
      },
      handle_time: {
        type: 'datetime',
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
