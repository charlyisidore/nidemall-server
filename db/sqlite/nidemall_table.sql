--
-- Table structure for table `nidemall_ad`
--

DROP TABLE IF EXISTS `nidemall_ad`;
CREATE TABLE `nidemall_ad` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` varchar(63) NOT NULL DEFAULT '', -- 广告标题
  `link` varchar(255) NOT NULL DEFAULT '', -- 所广告的商品页面或者活动页面链接地址
  `url` varchar(255) NOT NULL, -- 广告宣传图片
  `position` tinyint(3) DEFAULT 1, -- 广告位置：1则是首页
  `content` varchar(255) DEFAULT '', -- 活动内容
  `start_time` datetime DEFAULT NULL, -- 广告开始时间
  `end_time` datetime DEFAULT NULL, -- 广告结束时间
  `enabled` tinyint(1) DEFAULT 0, -- 是否启动
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 广告表
CREATE INDEX `nidemall_ad_enabled` ON `nidemall_ad` (`enabled`);

--
-- Table structure for table `nidemall_address`
--

DROP TABLE IF EXISTS `nidemall_address`;
CREATE TABLE `nidemall_address` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` varchar(63) NOT NULL DEFAULT '', -- 收货人名称
  `user_id` int(11) NOT NULL DEFAULT 0, -- 用户表的用户ID
  `province` varchar(63) NOT NULL, -- 行政区域表的省ID
  `city` varchar(63) NOT NULL, -- 行政区域表的市ID
  `county` varchar(63) NOT NULL, -- 行政区域表的区县ID
  `address_detail` varchar(127) NOT NULL DEFAULT '', -- 详细收货地址
  `area_code` char(6) DEFAULT NULL, -- 地区编码
  `postal_code` char(6) DEFAULT NULL, -- 邮政编码
  `tel` varchar(20) NOT NULL DEFAULT '', -- 手机号码
  `is_default` tinyint(1) NOT NULL DEFAULT 0, -- 是否默认地址
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 收货地址表
CREATE INDEX `nidemall_address_user_id` ON `nidemall_address` (`user_id`);

--
-- Table structure for table `nidemall_admin`
--

DROP TABLE IF EXISTS `nidemall_admin`;
CREATE TABLE `nidemall_admin` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `username` varchar(63) NOT NULL DEFAULT '', -- 管理员名称
  `password` varchar(63) NOT NULL DEFAULT '', -- 管理员密码
  `last_login_ip` varchar(63) DEFAULT '', -- 最近一次登录IP地址
  `last_login_time` datetime DEFAULT NULL, -- 最近一次登录时间
  `avatar` varchar(255) DEFAULT '''', -- 头像图片
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0, -- 逻辑删除
  `role_ids` varchar(127) DEFAULT '[]' -- 角色列表
); -- 管理员表

--
-- Table structure for table `nidemall_aftersale`
--

DROP TABLE IF EXISTS `nidemall_aftersale`;
CREATE TABLE `nidemall_aftersale` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `aftersale_sn` varchar(63) DEFAULT NULL, -- 售后编号
  `order_id` int(11) NOT NULL, -- 订单ID
  `user_id` int(11) NOT NULL, -- 用户ID
  `type` smallint(6) DEFAULT 0, -- 售后类型，0是未收货退款，1是已收货（无需退货）退款，2用户退货退款
  `reason` varchar(31) DEFAULT '', -- 退款原因
  `amount` decimal(10,2) DEFAULT '0.00', -- 退款金额
  `pictures` varchar(1023) DEFAULT '[]', -- 退款凭证图片链接数组
  `comment` varchar(511) DEFAULT '', -- 退款说明
  `status` smallint(6) DEFAULT 0, -- 售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消
  `handle_time` datetime DEFAULT NULL, -- 管理员操作时间
  `add_time` datetime DEFAULT NULL, -- 添加时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 售后表

--
-- Table structure for table `nidemall_brand`
--

DROP TABLE IF EXISTS `nidemall_brand`;
CREATE TABLE `nidemall_brand` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '', -- 品牌商名称
  `desc` varchar(255) NOT NULL DEFAULT '', -- 品牌商简介
  `pic_url` varchar(255) NOT NULL DEFAULT '', -- 品牌商页的品牌商图片
  `sort_order` tinyint(3) DEFAULT 50,
  `floor_price` decimal(10,2) DEFAULT '0.00', -- 品牌商的商品低价，仅用于页面展示
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 品牌商表

--
-- Table structure for table `nidemall_cart`
--

DROP TABLE IF EXISTS `nidemall_cart`;
CREATE TABLE `nidemall_cart` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `user_id` int(11) DEFAULT NULL, -- 用户表的用户ID
  `goods_id` int(11) DEFAULT NULL, -- 商品表的商品ID
  `goods_sn` varchar(63) DEFAULT NULL, -- 商品编号
  `goods_name` varchar(127) DEFAULT NULL, -- 商品名称
  `product_id` int(11) DEFAULT NULL, -- 商品货品表的货品ID
  `price` decimal(10,2) DEFAULT '0.00', -- 商品货品的价格
  `number` smallint(5) DEFAULT 0, -- 商品货品的数量
  `specifications` varchar(1023) DEFAULT NULL, -- 商品规格值列表，采用JSON数组格式
  `checked` tinyint(1) DEFAULT 1, -- 购物车中商品是否选择状态
  `pic_url` varchar(255) DEFAULT NULL, -- 商品图片或者商品货品图片
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 购物车商品表

--
-- Table structure for table `nidemall_category`
--

DROP TABLE IF EXISTS `nidemall_category`;
CREATE TABLE `nidemall_category` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` varchar(63) NOT NULL DEFAULT '', -- 类目名称
  `keywords` varchar(1023) NOT NULL DEFAULT '', -- 类目关键字，以JSON数组格式
  `desc` varchar(255) DEFAULT '', -- 类目广告语介绍
  `pid` int(11) NOT NULL DEFAULT 0, -- 父类目ID
  `icon_url` varchar(255) DEFAULT '', -- 类目图标
  `pic_url` varchar(255) DEFAULT '', -- 类目图片
  `level` varchar(255) DEFAULT 'L1',
  `sort_order` tinyint(3) DEFAULT 50, -- 排序
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 类目表
CREATE INDEX `nidemall_category_parent_id` ON `nidemall_category` (`pid`);

--
-- Table structure for table `nidemall_collect`
--

DROP TABLE IF EXISTS `nidemall_collect`;
CREATE TABLE `nidemall_collect` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 0, -- 用户表的用户ID
  `value_id` int(11) NOT NULL DEFAULT 0, -- 如果type=0，则是商品ID；如果type=1，则是专题ID
  `type` tinyint(3) NOT NULL DEFAULT 0, -- 收藏类型，如果type=0，则是商品ID；如果type=1，则是专题ID
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 收藏表
CREATE INDEX `nidemall_collect_user_id` ON `nidemall_collect` (`user_id`);
CREATE INDEX `nidemall_collect_goods_id` ON `nidemall_collect` (`value_id`);

--
-- Table structure for table `nidemall_comment`
--

DROP TABLE IF EXISTS `nidemall_comment`;
CREATE TABLE `nidemall_comment` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `value_id` int(11) NOT NULL DEFAULT 0, -- 如果type=0，则是商品评论；如果是type=1，则是专题评论。
  `type` tinyint(3) NOT NULL DEFAULT 0, -- 评论类型，如果type=0，则是商品评论；如果是type=1，则是专题评论；
  `content` varchar(1023) DEFAULT '', -- 评论内容
  `admin_content` varchar(511) DEFAULT '', -- 管理员回复内容
  `user_id` int(11) NOT NULL DEFAULT 0, -- 用户表的用户ID
  `has_picture` tinyint(1) DEFAULT 0, -- 是否含有图片
  `pic_urls` varchar(1023) DEFAULT NULL, -- 图片地址列表，采用JSON数组格式
  `star` smallint(6) DEFAULT 1, -- 评分， 1-5
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 评论表
CREATE INDEX `nidemall_comment_id_value` ON `nidemall_comment` (`value_id`);

--
-- Table structure for table `nidemall_coupon`
--

DROP TABLE IF EXISTS `nidemall_coupon`;
CREATE TABLE `nidemall_coupon` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` varchar(63) NOT NULL, -- 优惠券名称
  `desc` varchar(127) DEFAULT '', -- 优惠券介绍，通常是显示优惠券使用限制文字
  `tag` varchar(63) DEFAULT '', -- 优惠券标签，例如新人专用
  `total` int(11) NOT NULL DEFAULT 0, -- 优惠券数量，如果是0，则是无限量
  `discount` decimal(10,2) DEFAULT '0.00', -- 优惠金额，
  `min` decimal(10,2) DEFAULT '0.00', -- 最少消费金额才能使用优惠券。
  `limit` smallint(6) DEFAULT 1, -- 用户领券限制数量，如果是0，则是不限制；默认是1，限领一张.
  `type` smallint(6) DEFAULT 0, -- 优惠券赠送类型，如果是0则通用券，用户领取；如果是1，则是注册赠券；如果是2，则是优惠券码兑换；
  `status` smallint(6) DEFAULT 0, -- 优惠券状态，如果是0则是正常可用；如果是1则是过期; 如果是2则是下架。
  `goods_type` smallint(6) DEFAULT 0, -- 商品限制类型，如果0则全商品，如果是1则是类目限制，如果是2则是商品限制。
  `goods_value` varchar(1023) DEFAULT '[]', -- 商品限制值，goods_type如果是0则空集合，如果是1则是类目集合，如果是2则是商品集合。
  `code` varchar(63) DEFAULT NULL, -- 优惠券兑换码
  `time_type` smallint(6) DEFAULT 0, -- 有效时间限制，如果是0，则基于领取时间的有效天数days；如果是1，则start_time和end_time是优惠券有效期；
  `days` smallint(6) DEFAULT 0, -- 基于领取时间的有效天数days。
  `start_time` datetime DEFAULT NULL, -- 使用券开始时间
  `end_time` datetime DEFAULT NULL, -- 使用券截至时间
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 优惠券信息及规则表
CREATE INDEX `nidemall_coupon_code` ON `nidemall_coupon` (`code`);

--
-- Table structure for table `nidemall_coupon_user`
--

DROP TABLE IF EXISTS `nidemall_coupon_user`;
CREATE TABLE `nidemall_coupon_user` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `user_id` int(11) NOT NULL, -- 用户ID
  `coupon_id` int(11) NOT NULL, -- 优惠券ID
  `status` smallint(6) DEFAULT 0, -- 使用状态, 如果是0则未使用；如果是1则已使用；如果是2则已过期；如果是3则已经下架；
  `used_time` datetime DEFAULT NULL, -- 使用时间
  `start_time` datetime DEFAULT NULL, -- 有效期开始时间
  `end_time` datetime DEFAULT NULL, -- 有效期截至时间
  `order_id` int(11) DEFAULT NULL, -- 订单ID
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 优惠券用户使用表

--
-- Table structure for table `nidemall_feedback`
--

DROP TABLE IF EXISTS `nidemall_feedback`;
CREATE TABLE `nidemall_feedback` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 0, -- 用户表的用户ID
  `username` varchar(63) NOT NULL DEFAULT '', -- 用户名称
  `mobile` varchar(20) NOT NULL DEFAULT '', -- 手机号
  `feed_type` varchar(63) NOT NULL DEFAULT '', -- 反馈类型
  `content` varchar(1023) NOT NULL, -- 反馈内容
  `status` int(3) NOT NULL DEFAULT 0, -- 状态
  `has_picture` tinyint(1) DEFAULT 0, -- 是否含有图片
  `pic_urls` varchar(1023) DEFAULT NULL, -- 图片地址列表，采用JSON数组格式
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 意见反馈表
CREATE INDEX `nidemall_feedback_id_value` ON `nidemall_feedback` (`status`);

--
-- Table structure for table `nidemall_footprint`
--

DROP TABLE IF EXISTS `nidemall_footprint`;
CREATE TABLE `nidemall_footprint` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 0, -- 用户表的用户ID
  `goods_id` int(11) NOT NULL DEFAULT 0, -- 浏览商品ID
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 用户浏览足迹表

--
-- Table structure for table `nidemall_goods`
--

DROP TABLE IF EXISTS `nidemall_goods`;
CREATE TABLE `nidemall_goods` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `goods_sn` varchar(63) NOT NULL DEFAULT '', -- 商品编号
  `name` varchar(127) NOT NULL DEFAULT '', -- 商品名称
  `category_id` int(11) DEFAULT 0, -- 商品所属类目ID
  `brand_id` int(11) DEFAULT 0,
  `gallery` varchar(1023) DEFAULT NULL, -- 商品宣传图片列表，采用JSON数组格式
  `keywords` varchar(255) DEFAULT '', -- 商品关键字，采用逗号间隔
  `brief` varchar(255) DEFAULT '', -- 商品简介
  `is_on_sale` tinyint(1) DEFAULT 1, -- 是否上架
  `sort_order` smallint(4) DEFAULT 100,
  `pic_url` varchar(255) DEFAULT NULL, -- 商品页面商品图片
  `share_url` varchar(255) DEFAULT NULL, -- 商品分享海报
  `is_new` tinyint(1) DEFAULT 0, -- 是否新品首发，如果设置则可以在新品首发页面展示
  `is_hot` tinyint(1) DEFAULT 0, -- 是否人气推荐，如果设置则可以在人气推荐页面展示
  `unit` varchar(31) DEFAULT '’件‘', -- 商品单位，例如件、盒
  `counter_price` decimal(10,2) DEFAULT '0.00', -- 专柜价格
  `retail_price` decimal(10,2) DEFAULT '100000.00', -- 零售价格
  `detail` text, -- 商品详细介绍，是富文本格式
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 商品基本信息表
CREATE INDEX `nidemall_goods_goods_sn` ON `nidemall_goods` (`goods_sn`);
CREATE INDEX `nidemall_goods_cat_id` ON `nidemall_goods` (`category_id`);
CREATE INDEX `nidemall_goods_brand_id` ON `nidemall_goods` (`brand_id`);
CREATE INDEX `nidemall_goods_sort_order` ON `nidemall_goods` (`sort_order`);

--
-- Table structure for table `nidemall_goods_attribute`
--

DROP TABLE IF EXISTS `nidemall_goods_attribute`;
CREATE TABLE `nidemall_goods_attribute` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `goods_id` int(11) NOT NULL DEFAULT 0, -- 商品表的商品ID
  `attribute` varchar(255) NOT NULL, -- 商品参数名称
  `value` varchar(255) NOT NULL, -- 商品参数值
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 商品参数表
CREATE INDEX `nidemall_goods_attribute_goods_id` ON `nidemall_goods_attribute` (`goods_id`);

--
-- Table structure for table `nidemall_goods_product`
--

DROP TABLE IF EXISTS `nidemall_goods_product`;
CREATE TABLE `nidemall_goods_product` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `goods_id` int(11) NOT NULL DEFAULT 0, -- 商品表的商品ID
  `specifications` varchar(1023) NOT NULL, -- 商品规格值列表，采用JSON数组格式
  `price` decimal(10,2) NOT NULL DEFAULT '0.00', -- 商品货品价格
  `number` int(11) NOT NULL DEFAULT 0, -- 商品货品数量
  `url` varchar(125) DEFAULT NULL, -- 商品货品图片
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 商品货品表
CREATE INDEX `nidemall_goods_product_goods_id` ON `nidemall_goods_product` (`goods_id`);

--
-- Table structure for table `nidemall_goods_specification`
--

DROP TABLE IF EXISTS `nidemall_goods_specification`;
CREATE TABLE `nidemall_goods_specification` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `goods_id` int(11) NOT NULL DEFAULT 0, -- 商品表的商品ID
  `specification` varchar(255) NOT NULL DEFAULT '', -- 商品规格名称
  `value` varchar(255) NOT NULL DEFAULT '', -- 商品规格值
  `pic_url` varchar(255) NOT NULL DEFAULT '', -- 商品规格图片
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 商品规格表
CREATE INDEX `nidemall_goods_specification_goods_id` ON `nidemall_goods_specification` (`goods_id`);

--
-- Table structure for table `nidemall_groupon`
--

DROP TABLE IF EXISTS `nidemall_groupon`;
CREATE TABLE `nidemall_groupon` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `order_id` int(11) NOT NULL, -- 关联的订单ID
  `groupon_id` int(11) DEFAULT 0, -- 如果是开团用户，则groupon_id是0；如果是参团用户，则groupon_id是团购活动ID
  `rules_id` int(11) NOT NULL, -- 团购规则ID，关联nidemall_groupon_rules表ID字段
  `user_id` int(11) NOT NULL, -- 用户ID
  `share_url` varchar(255) DEFAULT NULL, -- 团购分享图片地址
  `creator_user_id` int(11) NOT NULL, -- 开团用户ID
  `creator_user_time` datetime DEFAULT NULL, -- 开团时间
  `status` smallint(6) DEFAULT 0, -- 团购活动状态，开团未支付则0，开团中则1，开团失败则2
  `add_time` datetime NOT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 团购活动表

--
-- Table structure for table `nidemall_groupon_rules`
--

DROP TABLE IF EXISTS `nidemall_groupon_rules`;
CREATE TABLE `nidemall_groupon_rules` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `goods_id` int(11) NOT NULL, -- 商品表的商品ID
  `goods_name` varchar(127) NOT NULL, -- 商品名称
  `pic_url` varchar(255) DEFAULT NULL, -- 商品图片或者商品货品图片
  `discount` decimal(63,0) NOT NULL, -- 优惠金额
  `discount_member` int(11) NOT NULL, -- 达到优惠条件的人数
  `expire_time` datetime DEFAULT NULL, -- 团购过期时间
  `status` smallint(6) DEFAULT 0, -- 团购规则状态，正常上线则0，到期自动下线则1，管理手动下线则2
  `add_time` datetime NOT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 团购规则表
CREATE INDEX `nidemall_groupon_rules_goods_id` ON `nidemall_groupon_rules` (`goods_id`);

--
-- Table structure for table `nidemall_issue`
--

DROP TABLE IF EXISTS `nidemall_issue`;
CREATE TABLE `nidemall_issue` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `question` varchar(255) DEFAULT NULL, -- 问题标题
  `answer` varchar(255) DEFAULT NULL, -- 问题答案
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 常见问题表

--
-- Table structure for table `nidemall_keyword`
--

DROP TABLE IF EXISTS `nidemall_keyword`;
CREATE TABLE `nidemall_keyword` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `keyword` varchar(127) NOT NULL DEFAULT '', -- 关键字
  `url` varchar(255) NOT NULL DEFAULT '', -- 关键字的跳转链接
  `is_hot` tinyint(1) NOT NULL DEFAULT 0, -- 是否是热门关键字
  `is_default` tinyint(1) NOT NULL DEFAULT 0, -- 是否是默认关键字
  `sort_order` int(11) NOT NULL DEFAULT 100, -- 排序
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 关键字表

--
-- Table structure for table `nidemall_log`
--

DROP TABLE IF EXISTS `nidemall_log`;
CREATE TABLE `nidemall_log` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `admin` varchar(45) DEFAULT NULL, -- 管理员
  `ip` varchar(45) DEFAULT NULL, -- 管理员地址
  `type` int(11) DEFAULT NULL, -- 操作分类
  `action` varchar(45) DEFAULT NULL, -- 操作动作
  `status` tinyint(1) DEFAULT NULL, -- 操作状态
  `result` varchar(127) DEFAULT NULL, -- 操作结果，或者成功消息，或者失败消息
  `comment` varchar(255) DEFAULT NULL, -- 补充信息
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 操作日志表

--
-- Table structure for table `nidemall_notice`
--

DROP TABLE IF EXISTS `nidemall_notice`;
CREATE TABLE `nidemall_notice` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `title` varchar(63) DEFAULT NULL, -- 通知标题
  `content` varchar(511) DEFAULT NULL, -- 通知内容
  `admin_id` int(11) DEFAULT 0, -- 创建通知的管理员ID，如果是系统内置通知则是0.
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 通知表

--
-- Table structure for table `nidemall_notice_admin`
--

DROP TABLE IF EXISTS `nidemall_notice_admin`;
CREATE TABLE `nidemall_notice_admin` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `notice_id` int(11) DEFAULT NULL, -- 通知ID
  `notice_title` varchar(63) DEFAULT NULL, -- 通知标题
  `admin_id` int(11) DEFAULT NULL, -- 接收通知的管理员ID
  `read_time` datetime DEFAULT NULL, -- 阅读时间，如果是NULL则是未读状态
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 通知管理员表

--
-- Table structure for table `nidemall_order`
--

DROP TABLE IF EXISTS `nidemall_order`;
CREATE TABLE `nidemall_order` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `user_id` int(11) NOT NULL, -- 用户表的用户ID
  `order_sn` varchar(63) NOT NULL, -- 订单编号
  `order_status` smallint(6) NOT NULL, -- 订单状态
  `aftersale_status` smallint(6) DEFAULT 0, -- 售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消
  `consignee` varchar(63) NOT NULL, -- 收货人名称
  `mobile` varchar(63) NOT NULL, -- 收货人手机号
  `address` varchar(127) NOT NULL, -- 收货具体地址
  `message` varchar(512) NOT NULL DEFAULT '', -- 用户订单留言
  `goods_price` decimal(10,2) NOT NULL, -- 商品总费用
  `freight_price` decimal(10,2) NOT NULL, -- 配送费用
  `coupon_price` decimal(10,2) NOT NULL, -- 优惠券减免
  `integral_price` decimal(10,2) NOT NULL, -- 用户积分减免
  `groupon_price` decimal(10,2) NOT NULL, -- 团购优惠价减免
  `order_price` decimal(10,2) NOT NULL, -- 订单费用， = goods_price + freight_price - coupon_price
  `actual_price` decimal(10,2) NOT NULL, -- 实付费用， = order_price - integral_price
  `pay_id` varchar(63) DEFAULT NULL, -- 微信付款编号
  `pay_time` datetime DEFAULT NULL, -- 微信付款时间
  `ship_sn` varchar(63) DEFAULT NULL, -- 发货编号
  `ship_channel` varchar(63) DEFAULT NULL, -- 发货快递公司
  `ship_time` datetime DEFAULT NULL, -- 发货开始时间
  `refund_amount` decimal(10,2) DEFAULT NULL, -- 实际退款金额，（有可能退款金额小于实际支付金额）
  `refund_type` varchar(63) DEFAULT NULL, -- 退款方式
  `refund_content` varchar(127) DEFAULT NULL, -- 退款备注
  `refund_time` datetime DEFAULT NULL, -- 退款时间
  `confirm_time` datetime DEFAULT NULL, -- 用户确认收货时间
  `comments` smallint(6) DEFAULT 0, -- 待评价订单商品数量
  `end_time` datetime DEFAULT NULL, -- 订单关闭时间
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 订单表

--
-- Table structure for table `nidemall_order_goods`
--

DROP TABLE IF EXISTS `nidemall_order_goods`;
CREATE TABLE `nidemall_order_goods` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `order_id` int(11) NOT NULL DEFAULT 0, -- 订单表的订单ID
  `goods_id` int(11) NOT NULL DEFAULT 0, -- 商品表的商品ID
  `goods_name` varchar(127) NOT NULL DEFAULT '', -- 商品名称
  `goods_sn` varchar(63) NOT NULL DEFAULT '', -- 商品编号
  `product_id` int(11) NOT NULL DEFAULT 0, -- 商品货品表的货品ID
  `number` smallint(5) NOT NULL DEFAULT 0, -- 商品货品的购买数量
  `price` decimal(10,2) NOT NULL DEFAULT '0.00', -- 商品货品的售价
  `specifications` varchar(1023) NOT NULL, -- 商品货品的规格列表
  `pic_url` varchar(255) NOT NULL DEFAULT '', -- 商品货品图片或者商品图片
  `comment` int(11) DEFAULT 0, -- 订单商品评论，如果是-1，则超期不能评价；如果是0，则可以评价；如果其他值，则是comment表里面的评论ID。
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 订单商品表
CREATE INDEX `nidemall_order_goods_order_id` ON `nidemall_order_goods` (`order_id`);
CREATE INDEX `nidemall_order_goods_goods_id` ON `nidemall_order_goods` (`goods_id`);

--
-- Table structure for table `nidemall_permission`
--

DROP TABLE IF EXISTS `nidemall_permission`;
CREATE TABLE `nidemall_permission` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `role_id` int(11) DEFAULT NULL, -- 角色ID
  `permission` varchar(63) DEFAULT NULL, -- 权限
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 权限表

--
-- Table structure for table `nidemall_region`
--

DROP TABLE IF EXISTS `nidemall_region`;
CREATE TABLE `nidemall_region` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `pid` int(11) NOT NULL DEFAULT 0, -- 行政区域父ID，例如区县的pid指向市，市的pid指向省，省的pid则是0
  `name` varchar(120) NOT NULL DEFAULT '', -- 行政区域名称
  `type` tinyint(3) NOT NULL DEFAULT 0, -- 行政区域类型，如如1则是省， 如果是2则是市，如果是3则是区县
  `code` int(11) NOT NULL DEFAULT 0 -- 行政区域编码
); -- 行政区域表
CREATE INDEX `nidemall_region_parent_id` ON `nidemall_region` (`pid`);
CREATE INDEX `nidemall_region_region_type` ON `nidemall_region` (`type`);
CREATE INDEX `nidemall_region_agency_id` ON `nidemall_region` (`code`);

--
-- Table structure for table `nidemall_role`
--

DROP TABLE IF EXISTS `nidemall_role`;
CREATE TABLE `nidemall_role` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` varchar(63) NOT NULL, -- 角色名称
  `desc` varchar(1023) DEFAULT NULL, -- 角色描述
  `enabled` tinyint(1) DEFAULT 1, -- 是否启用
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 角色表
CREATE UNIQUE INDEX `nidemall_role_name` ON `nidemall_role` (`name`);

--
-- Table structure for table `nidemall_search_history`
--

DROP TABLE IF EXISTS `nidemall_search_history`;
CREATE TABLE `nidemall_search_history` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `user_id` int(11) NOT NULL, -- 用户表的用户ID
  `keyword` varchar(63) NOT NULL, -- 搜索关键字
  `from` varchar(63) NOT NULL DEFAULT '', -- 搜索来源，如pc、wx、app
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 搜索历史表

--
-- Table structure for table `nidemall_storage`
--

DROP TABLE IF EXISTS `nidemall_storage`;
CREATE TABLE `nidemall_storage` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `key` varchar(63) NOT NULL, -- 文件的唯一索引
  `name` varchar(255) NOT NULL, -- 文件名
  `type` varchar(20) NOT NULL, -- 文件类型
  `size` int(11) NOT NULL, -- 文件大小
  `url` varchar(255) DEFAULT NULL, -- 文件访问链接
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 文件存储表
CREATE INDEX `nidemall_storage_key` ON `nidemall_storage` (`key`);

--
-- Table structure for table `nidemall_system`
--

DROP TABLE IF EXISTS `nidemall_system`;
CREATE TABLE `nidemall_system` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `key_name` varchar(255) NOT NULL, -- 系统配置名
  `key_value` varchar(255) NOT NULL, -- 系统配置值
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 系统配置表

--
-- Table structure for table `nidemall_topic`
--

DROP TABLE IF EXISTS `nidemall_topic`;
CREATE TABLE `nidemall_topic` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '''', -- 专题标题
  `subtitle` varchar(255) DEFAULT '''', -- 专题子标题
  `content` text, -- 专题内容，富文本格式
  `price` decimal(10,2) DEFAULT '0.00', -- 专题相关商品最低价
  `read_count` varchar(255) DEFAULT '1k', -- 专题阅读量
  `pic_url` varchar(255) DEFAULT '', -- 专题图片
  `sort_order` int(11) DEFAULT 100, -- 排序
  `goods` varchar(1023) DEFAULT '', -- 专题相关商品，采用JSON数组格式
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 专题表
CREATE INDEX `nidemall_topic_topic_id` ON `nidemall_topic` (`id`);

--
-- Table structure for table `nidemall_user`
--

DROP TABLE IF EXISTS `nidemall_user`;
CREATE TABLE `nidemall_user` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `username` varchar(63) NOT NULL, -- 用户名称
  `password` varchar(63) NOT NULL DEFAULT '', -- 用户密码
  `gender` tinyint(3) NOT NULL DEFAULT 0, -- 性别：0 未知， 1男， 1 女
  `birthday` date DEFAULT NULL, -- 生日
  `last_login_time` datetime DEFAULT NULL, -- 最近一次登录时间
  `last_login_ip` varchar(63) NOT NULL DEFAULT '', -- 最近一次登录IP地址
  `user_level` tinyint(3) DEFAULT 0, -- 0 普通用户，1 VIP用户，2 高级VIP用户
  `nickname` varchar(63) NOT NULL DEFAULT '', -- 用户昵称或网络名称
  `mobile` varchar(20) NOT NULL DEFAULT '', -- 用户手机号码
  `avatar` varchar(255) NOT NULL DEFAULT '', -- 用户头像图片
  `weixin_openid` varchar(63) NOT NULL DEFAULT '', -- 微信登录openid
  `session_key` varchar(100) NOT NULL DEFAULT '', -- 微信登录会话KEY
  `status` tinyint(3) NOT NULL DEFAULT 0, -- 0 可用, 1 禁用, 2 注销
  `add_time` datetime DEFAULT NULL, -- 创建时间
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `deleted` tinyint(1) DEFAULT 0 -- 逻辑删除
); -- 用户表
CREATE UNIQUE INDEX `nidemall_user_user_name` ON `nidemall_user` (`username`);
