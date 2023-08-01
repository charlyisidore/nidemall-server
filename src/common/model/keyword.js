const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      keyword: {
        type: 'varchar(127)',
        default: '',
      },
      url: {
        type: 'varchar(255)',
        default: '',
      },
      is_hot: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
      is_default: {
        type: 'tinyint(1)',
        dataType: 'boolean',
      },
      sort_order: {
        type: 'int(11)',
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
