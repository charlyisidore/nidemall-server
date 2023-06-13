module.exports = class StatService extends think.Service {
  constructor() {
    super();
  }

  /**
   * 
   * @returns {Promise<{day: string, users: number}[]>}
   */
  statUser() {
    /*
      select
      substr(add_time,1,10) as day,
      count(distinct id) as users
      from litemall_user
      group by substr(add_time,1,10)
    */
    return this.model('user')
      .field([
        'substr(add_time, 1, 10) AS day',
        'COUNT(DISTINCT id) AS users',
      ].join(','))
      .group('substr(add_time, 1, 10)')
      .select();
  }

  /**
   * 
   * @returns {Promise<{day: string, orders: number, customers: number, amount: number, pcr: number}[]>}
   */
  statOrder() {
    /*
      select
      substr(add_time,1,10) as day,
      count(id) as orders,
      count(distinct user_id) as customers,
      sum(actual_price) as amount,
      round(sum(actual_price)/count(distinct user_id),2) as pcr
      from litemall_order
      where order_status in(401,402)
      group by substr(add_time,1,10)
    */
    return this.model('order')
      .field([
        'substr(add_time, 1, 10) AS day',
        'COUNT(id) AS orders',
        'COUNT(DISTINCT user_id) AS customers',
        'SUM(actual_price) AS amount',
        'ROUND(SUM(actual_price) / COUNT(DISTINCT user_id), 2) AS pcr',
      ].join(','))
      .where({
        orderStatus: ['IN', [401, 402]],
      })
      .group('substr(add_time, 1, 10)')
      .select();
  }

  /**
   * 
   * @returns {Promise<{day: string, orders: number, products: number, amount: number}[]>}
   */
  statGoods() {
    /*
      select
      substr(add_time,1, 10) as day,
      count(distinct order_id) as orders,
      sum(number) as products,
      sum(number*price) as amount
      from litemall_order_goods
      group by substr(add_time,1, 10)
    */
    return this.model('order_goods')
      .field([
        'substr(add_time, 1, 10) AS day',
        'COUNT(DISTINCT order_id) AS orders',
        'SUM(number) AS products',
        'SUM(number * price) AS amount',
      ].join(','))
      .group('substr(add_time, 1, 10)')
      .select();
  }
}