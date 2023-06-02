const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      notice_id: {
        type: 'int(11)',
      },
      notice_title: {
        type: 'varchar(63)',
      },
      admin_id: {
        type: 'int(11)',
      },
      read_time: {
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
    }
  }
};
