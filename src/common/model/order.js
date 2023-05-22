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
      order_sn: {
        type: 'varchar(63)',
      },
      order_status: {
        type: 'smallint(6)',
      },
      aftersale_status: {
        type: 'smallint(6)',
      },
      consignee: {
        type: 'varchar(63)',
      },
      mobile: {
        type: 'varchar(63)',
      },
      address: {
        type: 'varchar(127)',
      },
      message: {
        type: 'varchar(512)',
      },
      goods_price: {
        type: 'decimal(10,2)',
      },
      freight_price: {
        type: 'decimal(10,2)',
      },
      coupon_price: {
        type: 'decimal(10,2)',
      },
      integral_price: {
        type: 'decimal(10,2)',
      },
      groupon_price: {
        type: 'decimal(10,2)',
      },
      order_price: {
        type: 'decimal(10,2)',
      },
      actual_price: {
        type: 'decimal(10,2)',
      },
      pay_id: {
        type: 'varchar(63)',
      },
      pay_time: {
        type: 'datetime',
      },
      ship_sn: {
        type: 'varchar(63)',
      },
      ship_channel: {
        type: 'varchar(63)',
      },
      ship_time: {
        type: 'datetime',
      },
      refund_amount: {
        type: 'decimal(10,2)',
      },
      refund_type: {
        type: 'varchar(63)',
      },
      refund_content: {
        type: 'varchar(127)',
      },
      refund_time: {
        type: 'datetime',
      },
      confirm_time: {
        type: 'datetime',
      },
      comments: {
        type: 'smallint(6)',
      },
      end_time: {
        type: 'datetime',
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
