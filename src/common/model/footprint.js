const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      user_id: {
        type: 'int(11)',
      },
      goods_id: {
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
        dataType: 'boolean',
      },
    }
  }
};
