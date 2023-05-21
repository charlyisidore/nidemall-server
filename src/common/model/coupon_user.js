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
      coupon_id: {
        type: 'int(11)',
      },
      status: {
        type: 'smallint(6)',
      },
      used_time: {
        type: 'datetime',
      },
      start_time: {
        type: 'datetime',
      },
      end_time: {
        type: 'datetime',
      },
      order_id: {
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
