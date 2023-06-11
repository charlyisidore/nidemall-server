const Base = require('./base.js');

module.exports = class AdminRoleController extends Base {
  async listAction() {
    /** @type {string?} */
    const name = this.get('name');
    /** @type {number} */
    const page = this.get('page');
    /** @type {number} */
    const limit = this.get('limit');
    /** @type {string} */
    const sort = think.camelCase(this.get('sort'));
    /** @type {string} */
    const order = this.get('order');

    /** @type {RoleService} */
    const roleService = this.service('role');

    const roleList = await roleService.querySelective(name, page, limit, sort, order);

    return this.successList(roleList);
  }

  async optionsAction() {
    /** @type {RoleService} */
    const roleService = this.service('role');

    const roleList = (await roleService.queryAll())
      .map((role) => ({
        value: role.id,
        label: role.name,
      }));

    return this.successList(roleList);
  }

  async readAction() {
    /** @type {number} */
    const id = this.get('id');

    /** @type {RoleService} */
    const roleService = this.service('role');

    const role = await roleService.findById(id);

    return this.success(role);
  }

  async createAction() {
    const role = this.post([
      'name',
      'desc',
    ].join(','));

    /** @type {RoleService} */
    const roleService = this.service('role');

    const { ADMIN_RESPONSE } = roleService.getConstants();

    if (await roleService.checkExist(role.name)) {
      return this.fail(ADMIN_RESPONSE.NAME_EXIST, '角色已经存在');
    }

    role.id = await roleService.add(role);

    return this.success(role);
  }

  async updateAction() {
    const role = this.post([
      'id',
      'name',
      'desc',
    ].join(','));

    /** @type {RoleService} */
    const roleService = this.service('role');

    await roleService.updateById(role);

    return this.success(role);
  }

  async deleteAction() {
    /** @type {number} */
    const id = this.post('id');

    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {RoleService} */
    const roleService = this.service('role');

    const { ADMIN_RESPONSE } = roleService.getConstants();

    const adminList = await adminService.all();

    for (const admin of adminList) {
      for (const roleId of admin.roleIds) {
        if (roleId == id) {
          return this.fail(ADMIN_RESPONSE.USER_EXIST, '当前角色存在管理员，不能删除');
        }
      }
    }

    await roleService.deleteById(id);

    return this.success();
  }

  permissionsAction() {
    switch (true) {
      case this.isGet:
        return this.getPermissions();
      case this.isPost:
        return this.updatePermissions();
    }
  }

  async getPermissions() {
    const adminId = this.getAdminId();
    /** @type {number} */
    const roleId = this.get('roleId');

    /** @type {AdminService} */
    const adminService = this.service('admin');
    /** @type {PermissionService} */
    const permissionService = this.service('permission');

    /** @type {object[]} */
    const systemPermissions = this.getSystemPermissions();

    /** @type {string[]|null} */
    let assignedPermissions = null;
    if (await permissionService.checkSuperPermission(roleId)) {
      assignedPermissions = this.getSystemPermissionsString();
    } else {
      assignedPermissions = await permissionService.queryByRoleId(roleId);
    }

    const admin = await adminService.findAdminById(adminId);

    /** @type {string[]|null} */
    let curPermissions = null;
    if (!await permissionService.checkSuperPermission(admin.roleIds)) {
      curPermissions = await permissionService.queryByRoleId(admin.roleIds);
    }

    return this.success({
      systemPermissions,
      assignedPermissions,
      curPermissions,
    });
  }

  async updatePermissions() {
    /** @type {number} */
    const roleId = this.post('roleId');
    /** @type {string[]} */
    const permissions = this.post('permissions');

    /** @type {PermissionService} */
    const permissionService = this.service('permission');
    /** @type {RoleService} */
    const roleService = this.service('role');

    const { ADMIN_RESPONSE } = roleService.getConstants();

    if (think.isNullOrUndefined(roleId) || think.isNullOrUndefined(permissions)) {
      return this.badArgument();
    }

    if (await permissionService.checkSuperPermission(roleId)) {
      return this.fail(ADMIN_RESPONSE.SUPER_SUPERMISSION, '当前角色的超级权限不能变更');
    }

    await permissionService.deleteByRoleId(roleId);

    await Promise.all(
      permissions.map(async (permission) => {
        await permissionService.add({
          roleId,
          permission,
        });
      })
    );

    return this.success();
  }

  getSystemPermissions() {
    return [
      {
        id: '商场管理',
        label: '商场管理',
        api: null,
        children: [
          {
            id: '类目管理',
            label: '类目管理',
            api: null,
            children: [
              {
                id: 'admin:category:update',
                label: '编辑',
                api: 'POST /admin/category/update',
                children: [],
              },
              {
                id: 'admin:category:list',
                label: '查询',
                api: 'GET /admin/category/list',
                children: [],
              },
              {
                id: 'admin:category:read',
                label: '详情',
                api: 'GET /admin/category/read',
                children: [],
              },
              {
                id: 'admin:category:delete',
                label: '删除',
                api: 'POST /admin/category/delete',
                children: [],
              },
              {
                id: 'admin:category:create',
                label: '添加',
                api: 'POST /admin/category/create',
                children: [],
              },
            ],
          },
          {
            id: '订单管理',
            label: '订单管理',
            api: null,
            children: [
              {
                id: 'admin:order:list',
                label: '查询',
                api: 'GET /admin/order/list',
                children: [],
              },
              {
                id: 'admin:order:delete',
                label: '订单删除',
                api: 'POST /admin/order/delete',
                children: [],
              },
              {
                id: 'admin:order:reply',
                label: '订单商品回复',
                api: 'POST /admin/order/reply',
                children: [],
              },
              {
                id: 'admin:order:refund',
                label: '订单退款',
                api: 'POST /admin/order/refund',
                children: [],
              },
              {
                id: 'admin:order:ship',
                label: '订单发货',
                api: 'POST /admin/order/ship',
                children: [],
              },
              {
                id: 'admin:order:pay',
                label: '订单收款',
                api: 'POST /admin/order/pay',
                children: [],
              },
              {
                id: 'admin:order:read',
                label: '详情',
                api: 'GET /admin/order/detail',
                children: [],
              },
            ],
          },
          {
            id: '关键词',
            label: '关键词',
            api: null,
            children: [
              {
                id: 'admin:keyword:update',
                label: '编辑',
                api: 'POST /admin/keyword/update',
                children: [],
              },
              {
                id: 'admin:keyword:list',
                label: '查询',
                api: 'GET /admin/keyword/list',
                children: [],
              },
              {
                id: 'admin:keyword:read',
                label: '详情',
                api: 'GET /admin/keyword/read',
                children: [],
              },
              {
                id: 'admin:keyword:delete',
                label: '删除',
                api: 'POST /admin/keyword/delete',
                children: [],
              },
              {
                id: 'admin:keyword:create',
                label: '添加',
                api: 'POST /admin/keyword/create',
                children: [],
              },
            ],
          },
          {
            id: '通用问题',
            label: '通用问题',
            api: null,
            children: [
              {
                id: 'admin:issue:update',
                label: '编辑',
                api: 'POST /admin/issue/update',
                children: [],
              },
              {
                id: 'admin:issue:list',
                label: '查询',
                api: 'GET /admin/issue/list',
                children: [],
              },
              {
                id: 'admin:issue:delete',
                label: '删除',
                api: 'POST /admin/issue/delete',
                children: [],
              },
              {
                id: 'admin:issue:create',
                label: '添加',
                api: 'POST /admin/issue/create',
                children: [],
              },
            ],
          },
          {
            id: '品牌管理',
            label: '品牌管理',
            api: null,
            children: [
              {
                id: 'admin:brand:update',
                label: '编辑',
                api: 'POST /admin/brand/update',
                children: [],
              },
              {
                id: 'admin:brand:list',
                label: '查询',
                api: 'GET /admin/brand/list',
                children: [],
              },
              {
                id: 'admin:brand:read',
                label: '详情',
                api: 'GET /admin/brand/read',
                children: [],
              },
              {
                id: 'admin:brand:delete',
                label: '删除',
                api: 'POST /admin/brand/delete',
                children: [],
              },
              {
                id: 'admin:brand:create',
                label: '添加',
                api: 'POST /admin/brand/create',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '用户管理',
        label: '用户管理',
        api: null,
        children: [
          {
            id: '搜索历史',
            label: '搜索历史',
            api: null,
            children: [
              {
                id: 'admin:history:list',
                label: '查询',
                api: 'GET /admin/history/list',
                children: [],
              },
            ],
          },
          {
            id: '意见反馈',
            label: '意见反馈',
            api: null,
            children: [
              {
                id: 'admin:feedback:list',
                label: '查询',
                api: 'GET /admin/feedback/list',
                children: [],
              },
            ],
          },
          {
            id: '用户足迹',
            label: '用户足迹',
            api: null,
            children: [
              {
                id: 'admin:footprint:list',
                label: '查询',
                api: 'GET /admin/footprint/list',
                children: [],
              },
            ],
          },
          {
            id: '会员管理',
            label: '会员管理',
            api: null,
            children: [
              {
                id: 'admin:user:list',
                label: '查询',
                api: 'GET /admin/user/list',
                children: [],
              },
              {
                id: 'admin:user:list',
                label: '详情',
                api: 'GET /admin/user/detail',
                children: [],
              },
              {
                id: 'admin:user:list',
                label: '编辑',
                api: 'POST /admin/user/update',
                children: [],
              },
            ],
          },
          {
            id: '用户收藏',
            label: '用户收藏',
            api: null,
            children: [
              {
                id: 'admin:collect:list',
                label: '查询',
                api: 'GET /admin/collect/list',
                children: [],
              },
            ],
          },
          {
            id: '收货地址',
            label: '收货地址',
            api: null,
            children: [
              {
                id: 'admin:address:list',
                label: '查询',
                api: 'GET /admin/address/list',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '系统管理',
        label: '系统管理',
        api: null,
        children: [
          {
            id: '对象存储',
            label: '对象存储',
            api: null,
            children: [
              {
                id: 'admin:storage:update',
                label: '编辑',
                api: 'POST /admin/storage/update',
                children: [],
              },
              {
                id: 'admin:storage:list',
                label: '查询',
                api: 'GET /admin/storage/list',
                children: [],
              },
              {
                id: 'admin:storage:read',
                label: '详情',
                api: 'POST /admin/storage/read',
                children: [],
              },
              {
                id: 'admin:storage:delete',
                label: '删除',
                api: 'POST /admin/storage/delete',
                children: [],
              },
              {
                id: 'admin:storage:create',
                label: '上传',
                api: 'POST /admin/storage/create',
                children: [],
              },
            ],
          },
          {
            id: '角色管理',
            label: '角色管理',
            api: null,
            children: [
              {
                id: 'admin:role:update',
                label: '角色编辑',
                api: 'POST /admin/role/update',
                children: [],
              },
              {
                id: 'admin:role:list',
                label: '角色查询',
                api: 'GET /admin/role/list',
                children: [],
              },
              {
                id: 'admin:role:read',
                label: '角色详情',
                api: 'GET /admin/role/read',
                children: [],
              },
              {
                id: 'admin:role:delete',
                label: '角色删除',
                api: 'POST /admin/role/delete',
                children: [],
              },
              {
                id: 'admin:role:permission:get',
                label: '权限详情',
                api: 'GET /admin/role/permissions',
                children: [],
              },
              {
                id: 'admin:role:create',
                label: '角色添加',
                api: 'POST /admin/role/create',
                children: [],
              },
              {
                id: 'admin:role:permission:update',
                label: '权限变更',
                api: 'POST /admin/role/permissions',
                children: [],
              },
            ],
          },
          {
            id: '操作日志',
            label: '操作日志',
            api: null,
            children: [
              {
                id: 'admin:log:list',
                label: '查询',
                api: 'GET /admin/log/list',
                children: [],
              },
            ],
          },
          {
            id: '通知管理',
            label: '通知管理',
            api: null,
            children: [
              {
                id: 'admin:notice:list',
                label: '查询',
                api: 'GET /admin/notice/list',
                children: [],
              },
            ],
          },
          {
            id: '管理员管理',
            label: '管理员管理',
            api: null,
            children: [
              {
                id: 'admin:admin:update',
                label: '编辑',
                api: 'POST /admin/admin/update',
                children: [],
              },
              {
                id: 'admin:admin:list',
                label: '查询',
                api: 'GET /admin/admin/list',
                children: [],
              },
              {
                id: 'admin:admin:read',
                label: '详情',
                api: 'GET /admin/admin/read',
                children: [],
              },
              {
                id: 'admin:admin:delete',
                label: '删除',
                api: 'POST /admin/admin/delete',
                children: [],
              },
              {
                id: 'admin:admin:create',
                label: '添加',
                api: 'POST /admin/admin/create',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '统计管理',
        label: '统计管理',
        api: null,
        children: [
          {
            id: '用户统计',
            label: '用户统计',
            api: null,
            children: [
              {
                id: 'admin:stat:user',
                label: '查询',
                api: 'GET /admin/stat/user',
                children: [],
              },
            ],
          },
          {
            id: '订单统计',
            label: '订单统计',
            api: null,
            children: [
              {
                id: 'admin:stat:order',
                label: '查询',
                api: 'GET /admin/stat/order',
                children: [],
              },
            ],
          },
          {
            id: '商品统计',
            label: '商品统计',
            api: null,
            children: [
              {
                id: 'admin:stat:goods',
                label: '查询',
                api: 'GET /admin/stat/goods',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '推广管理',
        label: '推广管理',
        api: null,
        children: [
          {
            id: '专题管理',
            label: '专题管理',
            api: null,
            children: [
              {
                id: 'admin:topic:update',
                label: '编辑',
                api: 'POST /admin/topic/update',
                children: [],
              },
              {
                id: 'admin:topic:list',
                label: '查询',
                api: 'GET /admin/topic/list',
                children: [],
              },
              {
                id: 'admin:topic:read',
                label: '详情',
                api: 'GET /admin/topic/read',
                children: [],
              },
              {
                id: 'admin:topic:delete',
                label: '删除',
                api: 'POST /admin/topic/delete',
                children: [],
              },
              {
                id: 'admin:topic:create',
                label: '添加',
                api: 'POST /admin/topic/create',
                children: [],
              },
              {
                id: 'admin:topic:batch-delete',
                label: '批量删除',
                api: 'POST /admin/topic/batch-delete',
                children: [],
              },
            ],
          },
          {
            id: '通知管理',
            label: '通知管理',
            api: null,
            children: [
              {
                id: 'admin:notice:update',
                label: '编辑',
                api: 'POST /admin/notice/update',
                children: [],
              },
              {
                id: 'admin:notice:read',
                label: '详情',
                api: 'GET /admin/notice/read',
                children: [],
              },
              {
                id: 'admin:notice:delete',
                label: '删除',
                api: 'POST /admin/notice/delete',
                children: [],
              },
              {
                id: 'admin:notice:create',
                label: '添加',
                api: 'POST /admin/notice/create',
                children: [],
              },
              {
                id: 'admin:notice:batch-delete',
                label: '批量删除',
                api: 'POST /admin/notice/batch-delete',
                children: [],
              },
            ],
          },
          {
            id: '广告管理',
            label: '广告管理',
            api: null,
            children: [
              {
                id: 'admin:ad:update',
                label: '编辑',
                api: 'POST /admin/ad/update',
                children: [],
              },
              {
                id: 'admin:ad:list',
                label: '查询',
                api: 'GET /admin/ad/list',
                children: [],
              },
              {
                id: 'admin:ad:read',
                label: '详情',
                api: 'GET /admin/ad/read',
                children: [],
              },
              {
                id: 'admin:ad:delete',
                label: '删除',
                api: 'POST /admin/ad/delete',
                children: [],
              },
              {
                id: 'admin:ad:create',
                label: '添加',
                api: 'POST /admin/ad/create',
                children: [],
              },
            ],
          },
          {
            id: '优惠券管理',
            label: '优惠券管理',
            api: null,
            children: [
              {
                id: 'admin:coupon:update',
                label: '编辑',
                api: 'POST /admin/coupon/update',
                children: [],
              },
              {
                id: 'admin:coupon:list',
                label: '查询',
                api: 'GET /admin/coupon/list',
                children: [],
              },
              {
                id: 'admin:coupon:read',
                label: '详情',
                api: 'GET /admin/coupon/read',
                children: [],
              },
              {
                id: 'admin:coupon:delete',
                label: '删除',
                api: 'POST /admin/coupon/delete',
                children: [],
              },
              {
                id: 'admin:coupon:create',
                label: '添加',
                api: 'POST /admin/coupon/create',
                children: [],
              },
              {
                id: 'admin:coupon:listuser',
                label: '查询用户',
                api: 'GET /admin/coupon/listuser',
                children: [],
              },
            ],
          },
          {
            id: '团购管理',
            label: '团购管理',
            api: null,
            children: [
              {
                id: 'admin:groupon:update',
                label: '编辑',
                api: 'POST /admin/groupon/update',
                children: [],
              },
              {
                id: 'admin:groupon:list',
                label: '查询',
                api: 'GET /admin/groupon/list',
                children: [],
              },
              {
                id: 'admin:groupon:delete',
                label: '删除',
                api: 'POST /admin/groupon/delete',
                children: [],
              },
              {
                id: 'admin:groupon:create',
                label: '添加',
                api: 'POST /admin/groupon/create',
                children: [],
              },
              {
                id: 'admin:groupon:read',
                label: '详情',
                api: 'GET /admin/groupon/listRecord',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '其他',
        label: '其他',
        api: null,
        children: [
          {
            id: '权限测试',
            label: '权限测试',
            api: null,
            children: [
              {
                id: 'index:permission:write',
                label: '权限写',
                api: 'POST /admin/index/write',
                children: [],
              },
              {
                id: 'index:permission:read',
                label: '权限读',
                api: 'GET /admin/index/read',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '商品管理',
        label: '商品管理',
        api: null,
        children: [
          {
            id: '评论管理',
            label: '评论管理',
            api: null,
            children: [
              {
                id: 'admin:comment:list',
                label: '查询',
                api: 'GET /admin/comment/list',
                children: [],
              },
              {
                id: 'admin:comment:delete',
                label: '删除',
                api: 'POST /admin/comment/delete',
                children: [],
              },
            ],
          },
          {
            id: '商品管理',
            label: '商品管理',
            api: null,
            children: [
              {
                id: 'admin:goods:update',
                label: '编辑',
                api: 'POST /admin/goods/update',
                children: [],
              },
              {
                id: 'admin:goods:list',
                label: '查询',
                api: 'GET /admin/goods/list',
                children: [],
              },
              {
                id: 'admin:goods:delete',
                label: '删除',
                api: 'POST /admin/goods/delete',
                children: [],
              },
              {
                id: 'admin:goods:create',
                label: '上架',
                api: 'POST /admin/goods/create',
                children: [],
              },
              {
                id: 'admin:goods:read',
                label: '详情',
                api: 'GET /admin/goods/detail',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '商城管理',
        label: '商城管理',
        api: null,
        children: [
          {
            id: '售后管理',
            label: '售后管理',
            api: null,
            children: [
              {
                id: 'admin:aftersale:list',
                label: '查询',
                api: 'GET /admin/aftersale/list',
                children: [],
              },
              {
                id: 'admin:aftersale:reject',
                label: '审核拒绝',
                api: 'POST /admin/aftersale/reject',
                children: [],
              },
              {
                id: 'admin:aftersale:refund',
                label: '退款',
                api: 'POST /admin/aftersale/refund',
                children: [],
              },
              {
                id: 'admin:aftersale:recept',
                label: '审核通过',
                api: 'POST /admin/aftersale/recept',
                children: [],
              },
              {
                id: 'admin:aftersale:batch-recept',
                label: '批量通过',
                api: 'POST /admin/aftersale/batch-recept',
                children: [],
              },
              {
                id: 'admin:aftersale:batch-reject',
                label: '批量拒绝',
                api: 'POST /admin/aftersale/batch-reject',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '配置管理',
        label: '配置管理',
        api: null,
        children: [
          {
            id: '运费配置',
            label: '运费配置',
            api: null,
            children: [
              {
                id: 'admin:config:express:updateConfigs',
                label: '编辑',
                api: 'POST /admin/config/express',
                children: [],
              },
              {
                id: 'admin:config:express:list',
                label: '详情',
                api: 'GET /admin/config/express',
                children: [],
              },
            ],
          },
          {
            id: '订单配置',
            label: '订单配置',
            api: null,
            children: [
              {
                id: 'admin:config:order:list',
                label: '详情',
                api: 'GET /admin/config/order',
                children: [],
              },
              {
                id: 'admin:config:order:updateConfigs',
                label: '编辑',
                api: 'POST /admin/config/order',
                children: [],
              },
            ],
          },
          {
            id: '小程序配置',
            label: '小程序配置',
            api: null,
            children: [
              {
                id: 'admin:config:wx:updateConfigs',
                label: '编辑',
                api: 'POST /admin/config/wx',
                children: [],
              },
              {
                id: 'admin:config:wx:list',
                label: '详情',
                api: 'GET /admin/config/wx',
                children: [],
              },
            ],
          },
          {
            id: '商场配置',
            label: '商场配置',
            api: null,
            children: [
              {
                id: 'admin:config:mall:list',
                label: '详情',
                api: 'GET /admin/config/mall',
                children: [],
              },
              {
                id: 'admin:config:mall:updateConfigs',
                label: '编辑',
                api: 'POST /admin/config/mall',
                children: [],
              },
            ],
          },
        ],
      },
    ];
  }

  getSystemPermissionsString() {
    return [
      'admin:order:list',
      'admin:admin:update',
      'admin:coupon:delete',
      'admin:notice:update',
      'admin:user:list',
      'admin:notice:batch-delete',
      'admin:ad:create',
      'admin:config:wx:updateConfigs',
      'admin:order:read',
      'admin:brand:delete',
      'admin:config:wx:list',
      'admin:aftersale:batch-reject',
      'admin:keyword:update',
      'admin:comment:delete',
      'admin:comment:list',
      'admin:keyword:list',
      'admin:category:delete',
      'admin:aftersale:batch-recept',
      'admin:keyword:read',
      'admin:goods:delete',
      'admin:issue:update',
      'admin:category:update',
      'admin:config:express:updateConfigs',
      'admin:issue:delete',
      'admin:goods:create',
      'admin:ad:list',
      'admin:groupon:update',
      'admin:ad:read',
      'admin:config:order:list',
      'admin:keyword:delete',
      'admin:aftersale:refund',
      'admin:log:list',
      'admin:config:order:updateConfigs',
      'admin:topic:update',
      'admin:stat:goods',
      'admin:stat:user',
      'admin:role:update',
      'admin:config:mall:updateConfigs',
      'admin:coupon:create',
      'admin:storage:update',
      'admin:feedback:list',
      'admin:topic:read',
      'admin:admin:delete',
      'admin:goods:update',
      'admin:aftersale:list',
      'admin:role:permission:get',
      'admin:notice:delete',
      'admin:brand:update',
      'admin:category:create',
      'admin:stat:order',
      'admin:aftersale:recept',
      'admin:coupon:list',
      'admin:topic:list',
      'admin:order:refund',
      'admin:topic:delete',
      'admin:brand:list',
      'admin:coupon:update',
      'admin:topic:batch-delete',
      'admin:brand:read',
      'admin:collect:list',
      'admin:storage:list',
      'admin:coupon:listuser',
      'admin:groupon:read',
      'admin:admin:read',
      'admin:storage:read',
      'admin:order:ship',
      'admin:groupon:create',
      'admin:aftersale:reject',
      'admin:keyword:create',
      'admin:admin:list',
      'admin:history:list',
      'admin:role:delete',
      'admin:order:delete',
      'admin:storage:delete',
      'admin:order:reply',
      'admin:ad:delete',
      'admin:topic:create',
      'admin:address:list',
      'admin:category:read',
      'admin:notice:read',
      'admin:storage:create',
      'admin:brand:create',
      'admin:config:express:list',
      'admin:role:permission:update',
      'admin:groupon:list',
      'admin:admin:create',
      'index:permission:write',
      'admin:footprint:list',
      'admin:notice:create',
      'admin:notice:list',
      'admin:groupon:delete',
      'admin:order:pay',
      'index:permission:read',
      'admin:role:create',
      'admin:issue:list',
      'admin:config:mall:list',
      'admin:category:list',
      'admin:issue:create',
      'admin:coupon:read',
      'admin:goods:list',
      'admin:ad:update',
      'admin:role:list',
      'admin:role:read',
      'admin:goods:read',
    ];
  }
};
