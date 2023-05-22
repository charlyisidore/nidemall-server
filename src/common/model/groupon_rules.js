const Base = require('./base.js');

module.exports = class extends Base {
  get schema() {
    return {
      id: {
        type: 'int(11)',
      },
      goods_id: {
        type: 'int(11)',
      },
      goods_name: {
        type: 'varchar(127)',
      },
      pic_url: {
        type: 'varchar(255)',
      },
      discount: {
        type: 'decimal(63,0)',
      },
      discount_member: {
        type: 'int(11)',
      },
      expire_time: {
        type: 'datetime',
      },
      status: {
        type: 'smallint(6)',
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
