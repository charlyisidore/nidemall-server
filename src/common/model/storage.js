const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      key: {
        type: 'varchar(63)',
      },
      name: {
        type: 'varchar(255)',
      },
      type: {
        type: 'varchar(20)',
      },
      size: {
        type: 'int(11)',
      },
      url: {
        type: 'varchar(255)',
      },
      add_time: {
        type: 'datetime',
      },
      update_time: {
        type: 'datetime',
      },
      deleted: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
    }
  }
};
