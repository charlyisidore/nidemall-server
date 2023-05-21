const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      title: {
        type: 'varchar(63)',
      },
      content: {
        type: 'varchar(511)',
      },
      admin_id: {
        type: 'int(11)',
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
