const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      keyword: {
        type: 'varchar(127)',
      },
      url: {
        type: 'varchar(255)',
      },
      is_hot: {
        type: 'tinyint(1)',
      },
      is_default: {
        type: 'tinyint(1)',
      },
      sort_order: {
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
