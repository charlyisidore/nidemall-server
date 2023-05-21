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
      link: {
        type: 'varchar(255)',
      },
      url: {
        type: 'varchar(255)',
      },
      position: {
        type: 'tinyint(3)',
      },
      content: {
        type: 'varchar(255)',
      },
      start_time: {
        type: 'datetime',
      },
      end_time: {
        type: 'datetime',
      },
      enabled: {
        type: 'tinyint(1)',
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
