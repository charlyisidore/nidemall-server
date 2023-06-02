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
      keywords: {
        type: 'varchar(1023)',
      },
      desc: {
        type: 'varchar(255)',
      },
      pid: {
        type: 'int(11)',
      },
      icon_url: {
        type: 'varchar(255)',
      },
      pic_url: {
        type: 'varchar(255)',
      },
      level: {
        type: 'varchar(255)',
      },
      sort_order: {
        type: 'tinyint(3)',
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
