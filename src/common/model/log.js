const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      admin: {
        type: 'varchar(45)',
      },
      ip: {
        type: 'varchar(45)',
      },
      type: {
        type: 'int(11)',
      },
      action: {
        type: 'varchar(45)',
      },
      status: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
      result: {
        type: 'varchar(127)',
      },
      comment: {
        type: 'varchar(255)',
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
