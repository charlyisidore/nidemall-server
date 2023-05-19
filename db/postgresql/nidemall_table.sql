--
-- Table structure for table `nidemall_ad`
--

DROP TABLE IF EXISTS "nidemall_ad";
CREATE TABLE "nidemall_ad" (
  "id" SERIAL,
  "name" varchar(63) NOT NULL DEFAULT '', -- 广告标题
  "link" varchar(255) NOT NULL DEFAULT '', -- 所广告的商品页面或者活动页面链接地址
  "url" varchar(255) NOT NULL, -- 广告宣传图片
  "position" smallint DEFAULT '1', -- 广告位置：1则是首页
  "content" varchar(255) DEFAULT '', -- 活动内容
  "startTime" timestamp DEFAULT NULL, -- 广告开始时间
  "endTime" timestamp DEFAULT NULL, -- 广告结束时间
  "enabled" smallint DEFAULT '0', -- 是否启动
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 广告表
CREATE INDEX "nidemall_ad_enabled" ON "nidemall_ad" ("enabled");

--
-- Table structure for table `nidemall_address`
--

DROP TABLE IF EXISTS "nidemall_address";
CREATE TABLE "nidemall_address" (
  "id" SERIAL,
  "name" varchar(63) NOT NULL DEFAULT '', -- 收货人名称
  "userId" int NOT NULL DEFAULT '0', -- 用户表的用户ID
  "province" varchar(63) NOT NULL, -- 行政区域表的省ID
  "city" varchar(63) NOT NULL, -- 行政区域表的市ID
  "county" varchar(63) NOT NULL, -- 行政区域表的区县ID
  "addressDetail" varchar(127) NOT NULL DEFAULT '', -- 详细收货地址
  "areaCode" char(6) DEFAULT NULL, -- 地区编码
  "postalCode" char(6) DEFAULT NULL, -- 邮政编码
  "tel" varchar(20) NOT NULL DEFAULT '', -- 手机号码
  "isDefault" smallint NOT NULL DEFAULT '0', -- 是否默认地址
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 收货地址表
CREATE INDEX "nidemall_address_user_id" ON "nidemall_address" ("userId");

--
-- Table structure for table `nidemall_admin`
--

DROP TABLE IF EXISTS "nidemall_admin";
CREATE TABLE "nidemall_admin" (
  "id" SERIAL,
  "username" varchar(63) NOT NULL DEFAULT '', -- 管理员名称
  "password" varchar(63) NOT NULL DEFAULT '', -- 管理员密码
  "lastLoginIp" varchar(63) DEFAULT '', -- 最近一次登录IP地址
  "lastLoginTime" timestamp DEFAULT NULL, -- 最近一次登录时间
  "avatar" varchar(255) DEFAULT '''', -- 头像图片
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  "roleIds" varchar(127) DEFAULT '[]', -- 角色列表
  PRIMARY KEY (id)
); -- 管理员表

--
-- Table structure for table `nidemall_aftersale`
--

DROP TABLE IF EXISTS "nidemall_aftersale";
CREATE TABLE "nidemall_aftersale" (
  "id" SERIAL,
  "aftersaleSn" varchar(63) DEFAULT NULL, -- 售后编号
  "orderId" int NOT NULL, -- 订单ID
  "userId" int NOT NULL, -- 用户ID
  "type" smallint DEFAULT '0', -- 售后类型，0是未收货退款，1是已收货（无需退货）退款，2用户退货退款
  "reason" varchar(31) DEFAULT '', -- 退款原因
  "amount" decimal(10,2) DEFAULT '0.00', -- 退款金额
  "pictures" varchar(1023) DEFAULT '[]', -- 退款凭证图片链接数组
  "comment" varchar(511) DEFAULT '', -- 退款说明
  "status" smallint DEFAULT '0', -- 售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消
  "handleTime" timestamp DEFAULT NULL, -- 管理员操作时间
  "addTime" timestamp DEFAULT NULL, -- 添加时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 售后表

--
-- Table structure for table `nidemall_brand`
--

DROP TABLE IF EXISTS "nidemall_brand";
CREATE TABLE "nidemall_brand" (
  "id" SERIAL,
  "name" varchar(255) NOT NULL DEFAULT '', -- 品牌商名称
  "desc" varchar(255) NOT NULL DEFAULT '', -- 品牌商简介
  "picUrl" varchar(255) NOT NULL DEFAULT '', -- 品牌商页的品牌商图片
  "sortOrder" smallint DEFAULT '50',
  "floorPrice" decimal(10,2) DEFAULT '0.00', -- 品牌商的商品低价，仅用于页面展示
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 品牌商表

--
-- Table structure for table `nidemall_cart`
--

DROP TABLE IF EXISTS "nidemall_cart";
CREATE TABLE "nidemall_cart" (
  "id" SERIAL,
  "userId" int DEFAULT NULL, -- 用户表的用户ID
  "goodsId" int DEFAULT NULL, -- 商品表的商品ID
  "goodsSn" varchar(63) DEFAULT NULL, -- 商品编号
  "goodsName" varchar(127) DEFAULT NULL, -- 商品名称
  "productId" int DEFAULT NULL, -- 商品货品表的货品ID
  "price" decimal(10,2) DEFAULT '0.00', -- 商品货品的价格
  "number" smallint DEFAULT '0', -- 商品货品的数量
  "specifications" varchar(1023) DEFAULT NULL, -- 商品规格值列表，采用JSON数组格式
  "checked" smallint DEFAULT '1', -- 购物车中商品是否选择状态
  "picUrl" varchar(255) DEFAULT NULL, -- 商品图片或者商品货品图片
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 购物车商品表

--
-- Table structure for table `nidemall_category`
--

DROP TABLE IF EXISTS "nidemall_category";
CREATE TABLE "nidemall_category" (
  "id" SERIAL,
  "name" varchar(63) NOT NULL DEFAULT '', -- 类目名称
  "keywords" varchar(1023) NOT NULL DEFAULT '', -- 类目关键字，以JSON数组格式
  "desc" varchar(255) DEFAULT '', -- 类目广告语介绍
  "pid" int NOT NULL DEFAULT '0', -- 父类目ID
  "iconUrl" varchar(255) DEFAULT '', -- 类目图标
  "picUrl" varchar(255) DEFAULT '', -- 类目图片
  "level" varchar(255) DEFAULT 'L1',
  "sortOrder" smallint DEFAULT '50', -- 排序
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 类目表
CREATE INDEX "nidemall_category_parent_id" ON "nidemall_category" ("pid");

--
-- Table structure for table `nidemall_collect`
--

DROP TABLE IF EXISTS "nidemall_collect";
CREATE TABLE "nidemall_collect" (
  "id" SERIAL,
  "userId" int NOT NULL DEFAULT '0', -- 用户表的用户ID
  "valueId" int NOT NULL DEFAULT '0', -- 如果type=0，则是商品ID；如果type=1，则是专题ID
  "type" smallint NOT NULL DEFAULT '0', -- 收藏类型，如果type=0，则是商品ID；如果type=1，则是专题ID
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 收藏表
CREATE INDEX "nidemall_collect_user_id" ON "nidemall_collect" ("userId");
CREATE INDEX "nidemall_collect_goods_id" ON "nidemall_collect" ("valueId");

--
-- Table structure for table `nidemall_comment`
--

DROP TABLE IF EXISTS "nidemall_comment";
CREATE TABLE "nidemall_comment" (
  "id" SERIAL,
  "valueId" int NOT NULL DEFAULT '0', -- 如果type=0，则是商品评论；如果是type=1，则是专题评论。
  "type" smallint NOT NULL DEFAULT '0', -- 评论类型，如果type=0，则是商品评论；如果是type=1，则是专题评论；
  "content" varchar(1023) DEFAULT '', -- 评论内容
  "adminContent" varchar(511) DEFAULT '', -- 管理员回复内容
  "userId" int NOT NULL DEFAULT '0', -- 用户表的用户ID
  "hasPicture" smallint DEFAULT '0', -- 是否含有图片
  "picUrls" varchar(1023) DEFAULT NULL, -- 图片地址列表，采用JSON数组格式
  "star" smallint DEFAULT '1', -- 评分， 1-5
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 评论表
CREATE INDEX "nidemall_comment_id_value" ON "nidemall_comment" ("valueId");

--
-- Table structure for table `nidemall_coupon`
--

DROP TABLE IF EXISTS "nidemall_coupon";
CREATE TABLE "nidemall_coupon" (
  "id" SERIAL,
  "name" varchar(63) NOT NULL, -- 优惠券名称
  "desc" varchar(127) DEFAULT '', -- 优惠券介绍，通常是显示优惠券使用限制文字
  "tag" varchar(63) DEFAULT '', -- 优惠券标签，例如新人专用
  "total" int NOT NULL DEFAULT '0', -- 优惠券数量，如果是0，则是无限量
  "discount" decimal(10,2) DEFAULT '0.00', -- 优惠金额，
  "min" decimal(10,2) DEFAULT '0.00', -- 最少消费金额才能使用优惠券。
  "limit" smallint DEFAULT '1', -- 用户领券限制数量，如果是0，则是不限制；默认是1，限领一张.
  "type" smallint DEFAULT '0', -- 优惠券赠送类型，如果是0则通用券，用户领取；如果是1，则是注册赠券；如果是2，则是优惠券码兑换；
  "status" smallint DEFAULT '0', -- 优惠券状态，如果是0则是正常可用；如果是1则是过期; 如果是2则是下架。
  "goodsType" smallint DEFAULT '0', -- 商品限制类型，如果0则全商品，如果是1则是类目限制，如果是2则是商品限制。
  "goodsValue" varchar(1023) DEFAULT '[]', -- 商品限制值，goodsType如果是0则空集合，如果是1则是类目集合，如果是2则是商品集合。
  "code" varchar(63) DEFAULT NULL, -- 优惠券兑换码
  "timeType" smallint DEFAULT '0', -- 有效时间限制，如果是0，则基于领取时间的有效天数days；如果是1，则startTime和endTime是优惠券有效期；
  "days" smallint DEFAULT '0', -- 基于领取时间的有效天数days。
  "startTime" timestamp DEFAULT NULL, -- 使用券开始时间
  "endTime" timestamp DEFAULT NULL, -- 使用券截至时间
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 优惠券信息及规则表
CREATE INDEX "nidemall_coupon_code" ON "nidemall_coupon" ("code");

--
-- Table structure for table `nidemall_coupon_user`
--

DROP TABLE IF EXISTS "nidemall_coupon_user";
CREATE TABLE "nidemall_coupon_user" (
  "id" SERIAL,
  "userId" int NOT NULL, -- 用户ID
  "couponId" int NOT NULL, -- 优惠券ID
  "status" smallint DEFAULT '0', -- 使用状态, 如果是0则未使用；如果是1则已使用；如果是2则已过期；如果是3则已经下架；
  "usedTime" timestamp DEFAULT NULL, -- 使用时间
  "startTime" timestamp DEFAULT NULL, -- 有效期开始时间
  "endTime" timestamp DEFAULT NULL, -- 有效期截至时间
  "orderId" int DEFAULT NULL, -- 订单ID
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 优惠券用户使用表

--
-- Table structure for table `nidemall_feedback`
--

DROP TABLE IF EXISTS "nidemall_feedback";
CREATE TABLE "nidemall_feedback" (
  "id" SERIAL,
  "userId" int NOT NULL DEFAULT '0', -- 用户表的用户ID
  "username" varchar(63) NOT NULL DEFAULT '', -- 用户名称
  "mobile" varchar(20) NOT NULL DEFAULT '', -- 手机号
  "feedType" varchar(63) NOT NULL DEFAULT '', -- 反馈类型
  "content" varchar(1023) NOT NULL, -- 反馈内容
  "status" int NOT NULL DEFAULT '0', -- 状态
  "hasPicture" smallint DEFAULT '0', -- 是否含有图片
  "picUrls" varchar(1023) DEFAULT NULL, -- 图片地址列表，采用JSON数组格式
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 意见反馈表
CREATE INDEX "nidemall_feedback_id_value" ON "nidemall_feedback" ("status");

--
-- Table structure for table `nidemall_footprint`
--

DROP TABLE IF EXISTS "nidemall_footprint";
CREATE TABLE "nidemall_footprint" (
  "id" SERIAL,
  "userId" int NOT NULL DEFAULT '0', -- 用户表的用户ID
  "goodsId" int NOT NULL DEFAULT '0', -- 浏览商品ID
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 用户浏览足迹表

--
-- Table structure for table `nidemall_goods`
--

DROP TABLE IF EXISTS "nidemall_goods";
CREATE TABLE "nidemall_goods" (
  "id" SERIAL,
  "goodsSn" varchar(63) NOT NULL DEFAULT '', -- 商品编号
  "name" varchar(127) NOT NULL DEFAULT '', -- 商品名称
  "categoryId" int DEFAULT '0', -- 商品所属类目ID
  "brandId" int DEFAULT '0',
  "gallery" varchar(1023) DEFAULT NULL, -- 商品宣传图片列表，采用JSON数组格式
  "keywords" varchar(255) DEFAULT '', -- 商品关键字，采用逗号间隔
  "brief" varchar(255) DEFAULT '', -- 商品简介
  "isOnSale" smallint DEFAULT '1', -- 是否上架
  "sortOrder" smallint DEFAULT '100',
  "picUrl" varchar(255) DEFAULT NULL, -- 商品页面商品图片
  "shareUrl" varchar(255) DEFAULT NULL, -- 商品分享海报
  "isNew" smallint DEFAULT '0', -- 是否新品首发，如果设置则可以在新品首发页面展示
  "isHot" smallint DEFAULT '0', -- 是否人气推荐，如果设置则可以在人气推荐页面展示
  "unit" varchar(31) DEFAULT '’件‘', -- 商品单位，例如件、盒
  "counterPrice" decimal(10,2) DEFAULT '0.00', -- 专柜价格
  "retailPrice" decimal(10,2) DEFAULT '100000.00', -- 零售价格
  "detail" text, -- 商品详细介绍，是富文本格式
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 商品基本信息表
CREATE INDEX "nidemall_goods_goods_sn" ON "nidemall_goods" ("goodsSn");
CREATE INDEX "nidemall_goods_cat_id" ON "nidemall_goods" ("categoryId");
CREATE INDEX "nidemall_goods_brand_id" ON "nidemall_goods" ("brandId");
CREATE INDEX "nidemall_goods_sort_order" ON "nidemall_goods" ("sortOrder");

--
-- Table structure for table `nidemall_goods_attribute`
--

DROP TABLE IF EXISTS "nidemall_goods_attribute";
CREATE TABLE "nidemall_goods_attribute" (
  "id" SERIAL,
  "goodsId" int NOT NULL DEFAULT '0', -- 商品表的商品ID
  "attribute" varchar(255) NOT NULL, -- 商品参数名称
  "value" varchar(255) NOT NULL, -- 商品参数值
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 商品参数表
CREATE INDEX "nidemall_goods_attribute_goods_id" ON "nidemall_goods_attribute" ("goodsId");

--
-- Table structure for table `nidemall_goods_product`
--

DROP TABLE IF EXISTS "nidemall_goods_product";
CREATE TABLE "nidemall_goods_product" (
  "id" SERIAL,
  "goodsId" int NOT NULL DEFAULT '0', -- 商品表的商品ID
  "specifications" varchar(1023) NOT NULL, -- 商品规格值列表，采用JSON数组格式
  "price" decimal(10,2) NOT NULL DEFAULT '0.00', -- 商品货品价格
  "number" int NOT NULL DEFAULT '0', -- 商品货品数量
  "url" varchar(125) DEFAULT NULL, -- 商品货品图片
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 商品货品表
CREATE INDEX "nidemall_goods_product_goods_id" ON "nidemall_goods_product" ("goodsId");

--
-- Table structure for table `nidemall_goods_specification`
--

DROP TABLE IF EXISTS "nidemall_goods_specification";
CREATE TABLE "nidemall_goods_specification" (
  "id" SERIAL,
  "goodsId" int NOT NULL DEFAULT '0', -- 商品表的商品ID
  "specification" varchar(255) NOT NULL DEFAULT '', -- 商品规格名称
  "value" varchar(255) NOT NULL DEFAULT '', -- 商品规格值
  "picUrl" varchar(255) NOT NULL DEFAULT '', -- 商品规格图片
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 商品规格表
CREATE INDEX "nidemall_goods_specification_goods_id" ON "nidemall_goods_specification" ("goodsId");

--
-- Table structure for table `nidemall_groupon`
--

DROP TABLE IF EXISTS "nidemall_groupon";
CREATE TABLE "nidemall_groupon" (
  "id" SERIAL,
  "orderId" int NOT NULL, -- 关联的订单ID
  "grouponId" int DEFAULT '0', -- 如果是开团用户，则grouponId是0；如果是参团用户，则grouponId是团购活动ID
  "rulesId" int NOT NULL, -- 团购规则ID，关联nidemall_groupon_rules表ID字段
  "userId" int NOT NULL, -- 用户ID
  "shareUrl" varchar(255) DEFAULT NULL, -- 团购分享图片地址
  "creatorUserId" int NOT NULL, -- 开团用户ID
  "creatorUserTime" timestamp DEFAULT NULL, -- 开团时间
  "status" smallint DEFAULT '0', -- 团购活动状态，开团未支付则0，开团中则1，开团失败则2
  "addTime" timestamp NOT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 团购活动表

--
-- Table structure for table `nidemall_groupon_rules`
--

DROP TABLE IF EXISTS "nidemall_groupon_rules";
CREATE TABLE "nidemall_groupon_rules" (
  "id" SERIAL,
  "goodsId" int NOT NULL, -- 商品表的商品ID
  "goodsName" varchar(127) NOT NULL, -- 商品名称
  "picUrl" varchar(255) DEFAULT NULL, -- 商品图片或者商品货品图片
  "discount" decimal(63,0) NOT NULL, -- 优惠金额
  "discountMember" int NOT NULL, -- 达到优惠条件的人数
  "expireTime" timestamp DEFAULT NULL, -- 团购过期时间
  "status" smallint DEFAULT '0', -- 团购规则状态，正常上线则0，到期自动下线则1，管理手动下线则2
  "addTime" timestamp NOT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 团购规则表
CREATE INDEX "nidemall_groupon_rules_goods_id" ON "nidemall_groupon_rules" ("goodsId");

--
-- Table structure for table `nidemall_issue`
--

DROP TABLE IF EXISTS "nidemall_issue";
CREATE TABLE "nidemall_issue" (
  "id" SERIAL,
  "question" varchar(255) DEFAULT NULL, -- 问题标题
  "answer" varchar(255) DEFAULT NULL, -- 问题答案
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 常见问题表

--
-- Table structure for table `nidemall_keyword`
--

DROP TABLE IF EXISTS "nidemall_keyword";
CREATE TABLE "nidemall_keyword" (
  "id" SERIAL,
  "keyword" varchar(127) NOT NULL DEFAULT '', -- 关键字
  "url" varchar(255) NOT NULL DEFAULT '', -- 关键字的跳转链接
  "isHot" smallint NOT NULL DEFAULT '0', -- 是否是热门关键字
  "isDefault" smallint NOT NULL DEFAULT '0', -- 是否是默认关键字
  "sortOrder" int NOT NULL DEFAULT '100', -- 排序
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 关键字表

--
-- Table structure for table `nidemall_log`
--

DROP TABLE IF EXISTS "nidemall_log";
CREATE TABLE "nidemall_log" (
  "id" SERIAL,
  "admin" varchar(45) DEFAULT NULL, -- 管理员
  "ip" varchar(45) DEFAULT NULL, -- 管理员地址
  "type" int DEFAULT NULL, -- 操作分类
  "action" varchar(45) DEFAULT NULL, -- 操作动作
  "status" smallint DEFAULT NULL, -- 操作状态
  "result" varchar(127) DEFAULT NULL, -- 操作结果，或者成功消息，或者失败消息
  "comment" varchar(255) DEFAULT NULL, -- 补充信息
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 操作日志表

--
-- Table structure for table `nidemall_notice`
--

DROP TABLE IF EXISTS "nidemall_notice";
CREATE TABLE "nidemall_notice" (
  "id" SERIAL,
  "title" varchar(63) DEFAULT NULL, -- 通知标题
  "content" varchar(511) DEFAULT NULL, -- 通知内容
  "adminId" int DEFAULT '0', -- 创建通知的管理员ID，如果是系统内置通知则是0.
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 通知表

--
-- Table structure for table `nidemall_notice_admin`
--

DROP TABLE IF EXISTS "nidemall_notice_admin";
CREATE TABLE "nidemall_notice_admin" (
  "id" SERIAL,
  "noticeId" int DEFAULT NULL, -- 通知ID
  "noticeTitle" varchar(63) DEFAULT NULL, -- 通知标题
  "adminId" int DEFAULT NULL, -- 接收通知的管理员ID
  "readTime" timestamp DEFAULT NULL, -- 阅读时间，如果是NULL则是未读状态
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 通知管理员表

--
-- Table structure for table `nidemall_order`
--

DROP TABLE IF EXISTS "nidemall_order";
CREATE TABLE "nidemall_order" (
  "id" SERIAL,
  "userId" int NOT NULL, -- 用户表的用户ID
  "orderSn" varchar(63) NOT NULL, -- 订单编号
  "orderStatus" smallint NOT NULL, -- 订单状态
  "aftersaleStatus" smallint DEFAULT '0', -- 售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消
  "consignee" varchar(63) NOT NULL, -- 收货人名称
  "mobile" varchar(63) NOT NULL, -- 收货人手机号
  "address" varchar(127) NOT NULL, -- 收货具体地址
  "message" varchar(512) NOT NULL DEFAULT '', -- 用户订单留言
  "goodsPrice" decimal(10,2) NOT NULL, -- 商品总费用
  "freightPrice" decimal(10,2) NOT NULL, -- 配送费用
  "couponPrice" decimal(10,2) NOT NULL, -- 优惠券减免
  "integralPrice" decimal(10,2) NOT NULL, -- 用户积分减免
  "grouponPrice" decimal(10,2) NOT NULL, -- 团购优惠价减免
  "orderPrice" decimal(10,2) NOT NULL, -- 订单费用， = goodsPrice + freightPrice - couponPrice
  "actualPrice" decimal(10,2) NOT NULL, -- 实付费用， = orderPrice - integralPrice
  "payId" varchar(63) DEFAULT NULL, -- 微信付款编号
  "payTime" timestamp DEFAULT NULL, -- 微信付款时间
  "shipSn" varchar(63) DEFAULT NULL, -- 发货编号
  "shipChannel" varchar(63) DEFAULT NULL, -- 发货快递公司
  "shipTime" timestamp DEFAULT NULL, -- 发货开始时间
  "refundAmount" decimal(10,2) DEFAULT NULL, -- 实际退款金额，（有可能退款金额小于实际支付金额）
  "refundType" varchar(63) DEFAULT NULL, -- 退款方式
  "refundContent" varchar(127) DEFAULT NULL, -- 退款备注
  "refundTime" timestamp DEFAULT NULL, -- 退款时间
  "confirmTime" timestamp DEFAULT NULL, -- 用户确认收货时间
  "comments" smallint DEFAULT '0', -- 待评价订单商品数量
  "endTime" timestamp DEFAULT NULL, -- 订单关闭时间
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 订单表

--
-- Table structure for table `nidemall_order_goods`
--

DROP TABLE IF EXISTS "nidemall_order_goods";
CREATE TABLE "nidemall_order_goods" (
  "id" SERIAL,
  "orderId" int NOT NULL DEFAULT '0', -- 订单表的订单ID
  "goodsId" int NOT NULL DEFAULT '0', -- 商品表的商品ID
  "goodsName" varchar(127) NOT NULL DEFAULT '', -- 商品名称
  "goodsSn" varchar(63) NOT NULL DEFAULT '', -- 商品编号
  "productId" int NOT NULL DEFAULT '0', -- 商品货品表的货品ID
  "number" smallint NOT NULL DEFAULT '0', -- 商品货品的购买数量
  "price" decimal(10,2) NOT NULL DEFAULT '0.00', -- 商品货品的售价
  "specifications" varchar(1023) NOT NULL, -- 商品货品的规格列表
  "picUrl" varchar(255) NOT NULL DEFAULT '', -- 商品货品图片或者商品图片
  "comment" int DEFAULT '0', -- 订单商品评论，如果是-1，则超期不能评价；如果是0，则可以评价；如果其他值，则是comment表里面的评论ID。
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 订单商品表
CREATE INDEX "nidemall_order_goods_order_id" ON "nidemall_order_goods" ("orderId");
CREATE INDEX "nidemall_order_goods_goods_id" ON "nidemall_order_goods" ("goodsId");

--
-- Table structure for table `nidemall_permission`
--

DROP TABLE IF EXISTS "nidemall_permission";
CREATE TABLE "nidemall_permission" (
  "id" SERIAL,
  "roleId" int DEFAULT NULL, -- 角色ID
  "permission" varchar(63) DEFAULT NULL, -- 权限
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 权限表

--
-- Table structure for table `nidemall_region`
--

DROP TABLE IF EXISTS "nidemall_region";
CREATE TABLE "nidemall_region" (
  "id" SERIAL,
  "pid" int NOT NULL DEFAULT '0', -- 行政区域父ID，例如区县的pid指向市，市的pid指向省，省的pid则是0
  "name" varchar(120) NOT NULL DEFAULT '', -- 行政区域名称
  "type" smallint NOT NULL DEFAULT '0', -- 行政区域类型，如如1则是省， 如果是2则是市，如果是3则是区县
  "code" int NOT NULL DEFAULT '0', -- 行政区域编码
  PRIMARY KEY (id)
); -- 行政区域表
CREATE INDEX "nidemall_region_parent_id" ON "nidemall_region" ("pid");
CREATE INDEX "nidemall_region_region_type" ON "nidemall_region" ("type");
CREATE INDEX "nidemall_region_agency_id" ON "nidemall_region" ("code");

--
-- Table structure for table `nidemall_role`
--

DROP TABLE IF EXISTS "nidemall_role";
CREATE TABLE "nidemall_role" (
  "id" SERIAL,
  "name" varchar(63) NOT NULL, -- 角色名称
  "desc" varchar(1023) DEFAULT NULL, -- 角色描述
  "enabled" smallint DEFAULT '1', -- 是否启用
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 角色表
CREATE UNIQUE INDEX "nidemall_role_name" ON "nidemall_role" ("name");

--
-- Table structure for table `nidemall_search_history`
--

DROP TABLE IF EXISTS "nidemall_search_history";
CREATE TABLE "nidemall_search_history" (
  "id" SERIAL,
  "userId" int NOT NULL, -- 用户表的用户ID
  "keyword" varchar(63) NOT NULL, -- 搜索关键字
  "from" varchar(63) NOT NULL DEFAULT '', -- 搜索来源，如pc、wx、app
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 搜索历史表

--
-- Table structure for table `nidemall_storage`
--

DROP TABLE IF EXISTS "nidemall_storage";
CREATE TABLE "nidemall_storage" (
  "id" SERIAL,
  "key" varchar(63) NOT NULL, -- 文件的唯一索引
  "name" varchar(255) NOT NULL, -- 文件名
  "type" varchar(20) NOT NULL, -- 文件类型
  "size" int NOT NULL, -- 文件大小
  "url" varchar(255) DEFAULT NULL, -- 文件访问链接
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 文件存储表
CREATE INDEX "nidemall_storage_key" ON "nidemall_storage" ("key");

--
-- Table structure for table `nidemall_system`
--

DROP TABLE IF EXISTS "nidemall_system";
CREATE TABLE "nidemall_system" (
  "id" SERIAL,
  "keyName" varchar(255) NOT NULL, -- 系统配置名
  "keyValue" varchar(255) NOT NULL, -- 系统配置值
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 系统配置表

--
-- Table structure for table `nidemall_topic`
--

DROP TABLE IF EXISTS "nidemall_topic";
CREATE TABLE "nidemall_topic" (
  "id" SERIAL,
  "title" varchar(255) NOT NULL DEFAULT '''', -- 专题标题
  "subtitle" varchar(255) DEFAULT '''', -- 专题子标题
  "content" text, -- 专题内容，富文本格式
  "price" decimal(10,2) DEFAULT '0.00', -- 专题相关商品最低价
  "readCount" varchar(255) DEFAULT '1k', -- 专题阅读量
  "picUrl" varchar(255) DEFAULT '', -- 专题图片
  "sortOrder" int DEFAULT '100', -- 排序
  "goods" varchar(1023) DEFAULT '', -- 专题相关商品，采用JSON数组格式
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 专题表
CREATE INDEX "nidemall_topic_topic_id" ON "nidemall_topic" ("id");

--
-- Table structure for table `nidemall_user`
--

DROP TABLE IF EXISTS "nidemall_user";
CREATE TABLE "nidemall_user" (
  "id" SERIAL,
  "username" varchar(63) NOT NULL, -- 用户名称
  "password" varchar(63) NOT NULL DEFAULT '', -- 用户密码
  "gender" smallint NOT NULL DEFAULT '0', -- 性别：0 未知， 1男， 1 女
  "birthday" date DEFAULT NULL, -- 生日
  "lastLoginTime" timestamp DEFAULT NULL, -- 最近一次登录时间
  "lastLoginIp" varchar(63) NOT NULL DEFAULT '', -- 最近一次登录IP地址
  "userLevel" smallint DEFAULT '0', -- 0 普通用户，1 VIP用户，2 高级VIP用户
  "nickname" varchar(63) NOT NULL DEFAULT '', -- 用户昵称或网络名称
  "mobile" varchar(20) NOT NULL DEFAULT '', -- 用户手机号码
  "avatar" varchar(255) NOT NULL DEFAULT '', -- 用户头像图片
  "weixinOpenid" varchar(63) NOT NULL DEFAULT '', -- 微信登录openid
  "sessionKey" varchar(100) NOT NULL DEFAULT '', -- 微信登录会话KEY
  "status" smallint NOT NULL DEFAULT '0', -- 0 可用, 1 禁用, 2 注销
  "addTime" timestamp DEFAULT NULL, -- 创建时间
  "updateTime" timestamp DEFAULT NULL, -- 更新时间
  "deleted" smallint DEFAULT '0', -- 逻辑删除
  PRIMARY KEY (id)
); -- 用户表
CREATE UNIQUE INDEX "nidemall_user_user_name" ON "nidemall_user" ("username");