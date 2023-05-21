const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      name: {
        type: 'varchar(63)',
      },
      desc: {
        type: 'varchar(127)',
      },
      tag: {
        type: 'varchar(63)',
      },
      total: {
        type: 'int(11)',
      },
      discount: {
        type: 'decimal(10,2)',
      },
      min: {
        type: 'decimal(10,2)',
      },
      limit: {
        type: 'smallint(6)',
      },
      type: {
        type: 'smallint(6)',
      },
      status: {
        type: 'smallint(6)',
      },
      goods_type: {
        type: 'smallint(6)',
      },
      goods_value: {
        type: 'varchar(1023)',
      },
      code: {
        type: 'varchar(63)',
      },
      time_type: {
        type: 'smallint(6)',
      },
      days: {
        type: 'smallint(6)',
      },
      start_time: {
        type: 'datetime',
      },
      end_time: {
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
