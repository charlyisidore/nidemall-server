const Base = require('./base.js');

module.exports = class PermissionService extends Base {
  constructor() {
    super();
  }

  /**
   * 
   * @param {number[]} roleIds 
   * @returns {Promise<string[]>}
   */
  async queryByRoleIds(roleIds) {
    if (think.isEmpty(roleIds)) {
      return [];
    }
    return (await this.model('permission')
      .where({
        id: ['IN', roleIds],
        deleted: false,
      })
      .select())
      .map((permission) => permission.permission);
  }

  /**
   * 
   * @param {number|number[]|null} roleId 
   * @returns {Promise<string[]>}
   */
  async queryByRoleId(roleId) {
    const where = {
      deleted: false,
    };

    if (think.isArray(roleId)) {
      if (think.isEmpty(roleId)) {
        return [];
      }
      Object.assign(where, {
        roleId: ['IN', roleId],
      });
    } else {
      if (think.isNullOrUndefined(roleId)) {
        return [];
      }
      Object.assign(where, {
        roleId,
      });
    }

    return (await this.model('permission')
      .where(where)
      .select())
      .map((permission) => permission.permission);
  }

  /**
   * 
   * @param {number|number[]} roleId 
   * @returns {Promise<boolean>}
   */
  async checkSuperPermission(roleId) {
    const where = {
      permission: '*',
      deleted: false,
    };

    if (think.isArray(roleId)) {
      if (think.isEmpty(roleId)) {
        return false;
      }
      Object.assign(where, {
        roleId: ['IN', roleId],
      });
    } else {
      if (think.isNullOrUndefined(roleId)) {
        return false;
      }
      Object.assign(where, {
        roleId,
      });
    }

    return 0 != (await this.model('permission')
      .where(where)
      .count());
  }

  /**
   * 
   * @param {number} roleId 
   * @returns {Promise<number>} The number of rows affected
   */
  async deleteByRoleId(roleId) {
    return this.model('permission')
      .where({
        roleId,
        deleted: false,
      })
      .update({
        deleted: true,
      });
  }

  /**
   * 
   * @param {Permission} permission 
   * @returns {Promise<number>} The ID inserted
   */
  async add(permission) {
    const now = new Date();
    return this.model('permission')
      .add(Object.assign(permission, {
        addTime: now,
        updateTime: now,
      }));
  }

  /**
   * Check if given role IDs have a permission.
   * @param {number[]} roleIds 
   * @param {string} requiresPermissions 
   * @returns {Promise<boolean>}
   */
  async hasPermission(roleIds, requiresPermissions) {
    return (await this.queryByRoleIds(roleIds))
      .some((permission) => {
        const pattern = permission
          .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
          .replace('*', '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(requiresPermissions);
      });
  }

  listPermission() {
    return [
      {
        api: 'GET /admin/address/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:address:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '用户管理',
            '收货地址',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/stat/user',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:stat:user',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '统计管理',
            '用户统计',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/stat/order',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:stat:order',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '统计管理',
            '订单统计',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/stat/goods',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:stat:goods',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '统计管理',
            '商品统计',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/goods/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:goods:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商品管理',
            '商品管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/goods/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:goods:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商品管理',
            '商品管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/goods/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:goods:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商品管理',
            '商品管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/goods/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:goods:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商品管理',
            '商品管理',
          ],
          button: '上架',
        },
      },
      {
        api: 'GET /admin/goods/detail',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:goods:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商品管理',
            '商品管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'GET /admin/order/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:order:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '订单管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/order/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:order:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '订单管理',
          ],
          button: '订单删除',
        },
      },
      {
        api: 'POST /admin/order/ship',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:order:ship',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '订单管理',
          ],
          button: '订单发货',
        },
      },
      {
        api: 'POST /admin/order/pay',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:order:pay',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '订单管理',
          ],
          button: '订单收款',
        },
      },
      {
        api: 'POST /admin/order/reply',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:order:reply',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '订单管理',
          ],
          button: '订单商品回复',
        },
      },
      {
        api: 'POST /admin/order/refund',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:order:refund',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '订单管理',
          ],
          button: '订单退款',
        },
      },
      {
        api: 'GET /admin/order/detail',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:order:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '订单管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'GET /admin/history/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:history:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '用户管理',
            '搜索历史',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/ad/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:ad:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '广告管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/ad/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:ad:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '广告管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/ad/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:ad:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '广告管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/ad/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:ad:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '广告管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/ad/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:ad:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '广告管理',
          ],
          button: '添加',
        },
      },
      {
        api: 'GET /admin/comment/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:comment:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商品管理',
            '评论管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/comment/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:comment:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商品管理',
            '评论管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'GET /admin/aftersale/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:aftersale:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商城管理',
            '售后管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/aftersale/reject',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:aftersale:reject',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商城管理',
            '售后管理',
          ],
          button: '审核拒绝',
        },
      },
      {
        api: 'POST /admin/aftersale/refund',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:aftersale:refund',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商城管理',
            '售后管理',
          ],
          button: '退款',
        },
      },
      {
        api: 'POST /admin/aftersale/recept',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:aftersale:recept',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商城管理',
            '售后管理',
          ],
          button: '审核通过',
        },
      },
      {
        api: 'POST /admin/aftersale/batch-recept',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:aftersale:batch-recept',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商城管理',
            '售后管理',
          ],
          button: '批量通过',
        },
      },
      {
        api: 'POST /admin/aftersale/batch-reject',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:aftersale:batch-reject',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商城管理',
            '售后管理',
          ],
          button: '批量拒绝',
        },
      },
      {
        api: 'GET /admin/feedback/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:feedback:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '用户管理',
            '意见反馈',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/notice/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:notice:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '通知管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/notice/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:notice:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '通知管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/notice/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:notice:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '通知管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/notice/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:notice:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '通知管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/notice/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:notice:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '通知管理',
          ],
          button: '添加',
        },
      },
      {
        api: 'POST /admin/notice/batch-delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:notice:batch-delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '通知管理',
          ],
          button: '批量删除',
        },
      },
      {
        api: 'GET /admin/user/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:user:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '用户管理',
            '会员管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/user/detail',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:user:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '用户管理',
            '会员管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/user/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:user:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '用户管理',
            '会员管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'POST /admin/topic/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:topic:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '专题管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/topic/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:topic:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '专题管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/topic/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:topic:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '专题管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/topic/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:topic:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '专题管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/topic/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:topic:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '专题管理',
          ],
          button: '添加',
        },
      },
      {
        api: 'POST /admin/topic/batch-delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:topic:batch-delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '专题管理',
          ],
          button: '批量删除',
        },
      },
      {
        api: 'GET /admin/footprint/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:footprint:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '用户管理',
            '用户足迹',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/index/write',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'index:permission:write',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '其他',
            '权限测试',
          ],
          button: '权限写',
        },
      },
      {
        api: 'GET /admin/index/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'index:permission:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '其他',
            '权限测试',
          ],
          button: '权限读',
        },
      },
      {
        api: 'POST /admin/admin/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:admin:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '管理员管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/admin/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:admin:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '管理员管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/admin/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:admin:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '管理员管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/admin/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:admin:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '管理员管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/admin/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:admin:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '管理员管理',
          ],
          button: '添加',
        },
      },
      {
        api: 'POST /admin/keyword/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:keyword:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '关键词',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/keyword/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:keyword:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '关键词',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/keyword/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:keyword:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '关键词',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/keyword/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:keyword:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '关键词',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/keyword/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:keyword:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '关键词',
          ],
          button: '添加',
        },
      },
      {
        api: 'POST /admin/issue/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:issue:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '通用问题',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/issue/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:issue:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '通用问题',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/issue/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:issue:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '通用问题',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/issue/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:issue:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '通用问题',
          ],
          button: '添加',
        },
      },
      {
        api: 'POST /admin/coupon/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:coupon:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '优惠券管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/coupon/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:coupon:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '优惠券管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/coupon/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:coupon:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '优惠券管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/coupon/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:coupon:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '优惠券管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/coupon/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:coupon:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '优惠券管理',
          ],
          button: '添加',
        },
      },
      {
        api: 'GET /admin/coupon/listuser',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:coupon:listuser',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '优惠券管理',
          ],
          button: '查询用户',
        },
      },
      {
        api: 'POST /admin/storage/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:storage:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '对象存储',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/storage/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:storage:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '对象存储',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/storage/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:storage:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '对象存储',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/storage/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:storage:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '对象存储',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/storage/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:storage:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '对象存储',
          ],
          button: '上传',
        },
      },
      {
        api: 'POST /admin/brand/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:brand:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '品牌管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/brand/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:brand:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '品牌管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/brand/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:brand:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '品牌管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/brand/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:brand:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '品牌管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/brand/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:brand:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '品牌管理',
          ],
          button: '添加',
        },
      },
      {
        api: 'GET /admin/config/mall',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:config:mall:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '配置管理',
            '商场配置',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/config/mall',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:config:mall:updateConfigs',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '配置管理',
            '商场配置',
          ],
          button: '编辑',
        },
      },
      {
        api: 'POST /admin/config/express',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:config:express:updateConfigs',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '配置管理',
            '运费配置',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/config/wx',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:config:wx:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '配置管理',
            '小程序配置',
          ],
          button: '详情',
        },
      },
      {
        api: 'GET /admin/config/express',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:config:express:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '配置管理',
            '运费配置',
          ],
          button: '详情',
        },
      },
      {
        api: 'GET /admin/config/order',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:config:order:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '配置管理',
            '订单配置',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/config/order',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:config:order:updateConfigs',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '配置管理',
            '订单配置',
          ],
          button: '编辑',
        },
      },
      {
        api: 'POST /admin/config/wx',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:config:wx:updateConfigs',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '配置管理',
            '小程序配置',
          ],
          button: '编辑',
        },
      },
      {
        api: 'POST /admin/category/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:category:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '类目管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/category/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:category:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '类目管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/category/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:category:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '类目管理',
          ],
          button: '详情',
        },
      },
      {
        api: 'POST /admin/category/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:category:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '类目管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/category/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:category:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '商场管理',
            '类目管理',
          ],
          button: '添加',
        },
      },
      {
        api: 'GET /admin/log/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:log:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '操作日志',
          ],
          button: '查询',
        },
      },
      {
        api: 'GET /admin/collect/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:collect:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '用户管理',
            '用户收藏',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/role/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:role:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '角色管理',
          ],
          button: '角色编辑',
        },
      },
      {
        api: 'GET /admin/role/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:role:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '角色管理',
          ],
          button: '角色查询',
        },
      },
      {
        api: 'GET /admin/role/read',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:role:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '角色管理',
          ],
          button: '角色详情',
        },
      },
      {
        api: 'POST /admin/role/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:role:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '角色管理',
          ],
          button: '角色删除',
        },
      },
      {
        api: 'GET /admin/role/permissions',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:role:permission:get',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '角色管理',
          ],
          button: '权限详情',
        },
      },
      {
        api: 'POST /admin/role/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:role:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '角色管理',
          ],
          button: '角色添加',
        },
      },
      {
        api: 'POST /admin/role/permissions',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:role:permission:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '系统管理',
            '角色管理',
          ],
          button: '权限变更',
        },
      },
      {
        api: 'POST /admin/groupon/update',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:groupon:update',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '团购管理',
          ],
          button: '编辑',
        },
      },
      {
        api: 'GET /admin/groupon/list',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:groupon:list',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '团购管理',
          ],
          button: '查询',
        },
      },
      {
        api: 'POST /admin/groupon/delete',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:groupon:delete',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '团购管理',
          ],
          button: '删除',
        },
      },
      {
        api: 'POST /admin/groupon/create',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:groupon:create',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '团购管理',
          ],
          button: '添加',
        },
      },
      {
        api: 'GET /admin/groupon/listRecord',
        requiresPermissions: {
          logical: 'AND',
          value: [
            'admin:groupon:read',
          ],
        },
        requiresPermissionsDesc: {
          menu: [
            '推广管理',
            '团购管理',
          ],
          button: '详情',
        },
      },
    ];
  }

  listPermissionString(permissions) {
    return permissions
      .map((permission) => permission.requiresPermissions.value[0]);
  }
}
