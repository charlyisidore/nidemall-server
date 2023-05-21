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
      user_id: {
        type: 'int(11)',
      },
      province: {
        type: 'varchar(63)',
      },
      city: {
        type: 'varchar(63)',
      },
      county: {
        type: 'varchar(63)',
      },
      address_detail: {
        type: 'varchar(127)',
      },
      area_code: {
        type: 'char(6)',
      },
      postal_code: {
        type: 'char(6)',
      },
      tel: {
        type: 'varchar(20)',
      },
      is_default: {
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
