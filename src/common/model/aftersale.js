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
        default: '',
      },
      amount: {
        type: 'decimal(10,2)',
      },
      pictures: {
        type: 'varchar(1023)',
        dataType: 'json',
        default: '[]',
      },
      comment: {
        type: 'varchar(511)',
        default: '',
      },
      status: {
        type: 'smallint(6)',
      },
      handle_time: {
        type: 'datetime',
        dataType: 'datetime',
      },
      add_time: {
        type: 'datetime',
        dataType: 'datetime',
      },
      update_time: {
        type: 'datetime',
        dataType: 'datetime',
      },
      deleted: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
    };
  }
};
