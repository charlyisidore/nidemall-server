-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nidemall
-- ------------------------------------------------------
-- Server version	5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `nidemall_ad`
--

DROP TABLE IF EXISTS `nidemall_ad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_ad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL DEFAULT '' COMMENT '广告标题',
  `link` varchar(255) NOT NULL DEFAULT '' COMMENT '所广告的商品页面或者活动页面链接地址',
  `url` varchar(255) NOT NULL COMMENT '广告宣传图片',
  `position` tinyint(3) DEFAULT '1' COMMENT '广告位置：1则是首页',
  `content` varchar(255) DEFAULT '' COMMENT '活动内容',
  `startTime` datetime DEFAULT NULL COMMENT '广告开始时间',
  `endTime` datetime DEFAULT NULL COMMENT '广告结束时间',
  `enabled` tinyint(1) DEFAULT '0' COMMENT '是否启动',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `enabled` (`enabled`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='广告表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_address`
--

DROP TABLE IF EXISTS `nidemall_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL DEFAULT '' COMMENT '收货人名称',
  `userId` int(11) NOT NULL DEFAULT '0' COMMENT '用户表的用户ID',
  `province` varchar(63) NOT NULL COMMENT '行政区域表的省ID',
  `city` varchar(63) NOT NULL COMMENT '行政区域表的市ID',
  `county` varchar(63) NOT NULL COMMENT '行政区域表的区县ID',
  `addressDetail` varchar(127) NOT NULL DEFAULT '' COMMENT '详细收货地址',
  `areaCode` char(6) DEFAULT NULL COMMENT '地区编码',
  `postalCode` char(6) DEFAULT NULL COMMENT '邮政编码',
  `tel` varchar(20) NOT NULL DEFAULT '' COMMENT '手机号码',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否默认地址',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `user_id` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_admin`
--

DROP TABLE IF EXISTS `nidemall_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(63) NOT NULL DEFAULT '' COMMENT '管理员名称',
  `password` varchar(63) NOT NULL DEFAULT '' COMMENT '管理员密码',
  `lastLoginIp` varchar(63) DEFAULT '' COMMENT '最近一次登录IP地址',
  `lastLoginTime` datetime DEFAULT NULL COMMENT '最近一次登录时间',
  `avatar` varchar(255) DEFAULT '''' COMMENT '头像图片',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  `roleIds` varchar(127) DEFAULT '[]' COMMENT '角色列表',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_aftersale`
--

DROP TABLE IF EXISTS `nidemall_aftersale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_aftersale` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aftersaleSn` varchar(63) DEFAULT NULL COMMENT '售后编号',
  `orderId` int(11) NOT NULL COMMENT '订单ID',
  `userId` int(11) NOT NULL COMMENT '用户ID',
  `type` smallint(6) DEFAULT '0' COMMENT '售后类型，0是未收货退款，1是已收货（无需退货）退款，2用户退货退款',
  `reason` varchar(31) DEFAULT '' COMMENT '退款原因',
  `amount` decimal(10,2) DEFAULT '0.00' COMMENT '退款金额',
  `pictures` varchar(1023) DEFAULT '[]' COMMENT '退款凭证图片链接数组',
  `comment` varchar(511) DEFAULT '' COMMENT '退款说明',
  `status` smallint(6) DEFAULT '0' COMMENT '售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消',
  `handleTime` datetime DEFAULT NULL COMMENT '管理员操作时间',
  `addTime` datetime DEFAULT NULL COMMENT '添加时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='售后表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_brand`
--

DROP TABLE IF EXISTS `nidemall_brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '品牌商名称',
  `desc` varchar(255) NOT NULL DEFAULT '' COMMENT '品牌商简介',
  `picUrl` varchar(255) NOT NULL DEFAULT '' COMMENT '品牌商页的品牌商图片',
  `sortOrder` tinyint(3) DEFAULT '50',
  `floorPrice` decimal(10,2) DEFAULT '0.00' COMMENT '品牌商的商品低价，仅用于页面展示',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1046003 DEFAULT CHARSET=utf8mb4 COMMENT='品牌商表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_cart`
--

DROP TABLE IF EXISTS `nidemall_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL COMMENT '用户表的用户ID',
  `goodsId` int(11) DEFAULT NULL COMMENT '商品表的商品ID',
  `goodsSn` varchar(63) DEFAULT NULL COMMENT '商品编号',
  `goodsName` varchar(127) DEFAULT NULL COMMENT '商品名称',
  `productId` int(11) DEFAULT NULL COMMENT '商品货品表的货品ID',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '商品货品的价格',
  `number` smallint(5) DEFAULT '0' COMMENT '商品货品的数量',
  `specifications` varchar(1023) DEFAULT NULL COMMENT '商品规格值列表，采用JSON数组格式',
  `checked` tinyint(1) DEFAULT '1' COMMENT '购物车中商品是否选择状态',
  `picUrl` varchar(255) DEFAULT NULL COMMENT '商品图片或者商品货品图片',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='购物车商品表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_category`
--

DROP TABLE IF EXISTS `nidemall_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL DEFAULT '' COMMENT '类目名称',
  `keywords` varchar(1023) NOT NULL DEFAULT '' COMMENT '类目关键字，以JSON数组格式',
  `desc` varchar(255) DEFAULT '' COMMENT '类目广告语介绍',
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '父类目ID',
  `iconUrl` varchar(255) DEFAULT '' COMMENT '类目图标',
  `picUrl` varchar(255) DEFAULT '' COMMENT '类目图片',
  `level` varchar(255) DEFAULT 'L1',
  `sortOrder` tinyint(3) DEFAULT '50' COMMENT '排序',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1036007 DEFAULT CHARSET=utf8mb4 COMMENT='类目表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_collect`
--

DROP TABLE IF EXISTS `nidemall_collect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_collect` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL DEFAULT '0' COMMENT '用户表的用户ID',
  `valueId` int(11) NOT NULL DEFAULT '0' COMMENT '如果type=0，则是商品ID；如果type=1，则是专题ID',
  `type` tinyint(3) NOT NULL DEFAULT '0' COMMENT '收藏类型，如果type=0，则是商品ID；如果type=1，则是专题ID',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `user_id` (`userId`),
  KEY `goods_id` (`valueId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_comment`
--

DROP TABLE IF EXISTS `nidemall_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `valueId` int(11) NOT NULL DEFAULT '0' COMMENT '如果type=0，则是商品评论；如果是type=1，则是专题评论。',
  `type` tinyint(3) NOT NULL DEFAULT '0' COMMENT '评论类型，如果type=0，则是商品评论；如果是type=1，则是专题评论；',
  `content` varchar(1023) DEFAULT '' COMMENT '评论内容',
  `adminContent` varchar(511) DEFAULT '' COMMENT '管理员回复内容',
  `userId` int(11) NOT NULL DEFAULT '0' COMMENT '用户表的用户ID',
  `hasPicture` tinyint(1) DEFAULT '0' COMMENT '是否含有图片',
  `picUrls` varchar(1023) DEFAULT NULL COMMENT '图片地址列表，采用JSON数组格式',
  `star` smallint(6) DEFAULT '1' COMMENT '评分， 1-5',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `id_value` (`valueId`)
) ENGINE=InnoDB AUTO_INCREMENT=1012 DEFAULT CHARSET=utf8mb4 COMMENT='评论表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_coupon`
--

DROP TABLE IF EXISTS `nidemall_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_coupon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL COMMENT '优惠券名称',
  `desc` varchar(127) DEFAULT '' COMMENT '优惠券介绍，通常是显示优惠券使用限制文字',
  `tag` varchar(63) DEFAULT '' COMMENT '优惠券标签，例如新人专用',
  `total` int(11) NOT NULL DEFAULT '0' COMMENT '优惠券数量，如果是0，则是无限量',
  `discount` decimal(10,2) DEFAULT '0.00' COMMENT '优惠金额，',
  `min` decimal(10,2) DEFAULT '0.00' COMMENT '最少消费金额才能使用优惠券。',
  `limit` smallint(6) DEFAULT '1' COMMENT '用户领券限制数量，如果是0，则是不限制；默认是1，限领一张.',
  `type` smallint(6) DEFAULT '0' COMMENT '优惠券赠送类型，如果是0则通用券，用户领取；如果是1，则是注册赠券；如果是2，则是优惠券码兑换；',
  `status` smallint(6) DEFAULT '0' COMMENT '优惠券状态，如果是0则是正常可用；如果是1则是过期; 如果是2则是下架。',
  `goodsType` smallint(6) DEFAULT '0' COMMENT '商品限制类型，如果0则全商品，如果是1则是类目限制，如果是2则是商品限制。',
  `goodsValue` varchar(1023) DEFAULT '[]' COMMENT '商品限制值，goodsType如果是0则空集合，如果是1则是类目集合，如果是2则是商品集合。',
  `code` varchar(63) DEFAULT NULL COMMENT '优惠券兑换码',
  `timeType` smallint(6) DEFAULT '0' COMMENT '有效时间限制，如果是0，则基于领取时间的有效天数days；如果是1，则startTime和endTime是优惠券有效期；',
  `days` smallint(6) DEFAULT '0' COMMENT '基于领取时间的有效天数days。',
  `startTime` datetime DEFAULT NULL COMMENT '使用券开始时间',
  `endTime` datetime DEFAULT NULL COMMENT '使用券截至时间',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='优惠券信息及规则表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_coupon_user`
--

DROP TABLE IF EXISTS `nidemall_coupon_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_coupon_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL COMMENT '用户ID',
  `couponId` int(11) NOT NULL COMMENT '优惠券ID',
  `status` smallint(6) DEFAULT '0' COMMENT '使用状态, 如果是0则未使用；如果是1则已使用；如果是2则已过期；如果是3则已经下架；',
  `usedTime` datetime DEFAULT NULL COMMENT '使用时间',
  `startTime` datetime DEFAULT NULL COMMENT '有效期开始时间',
  `endTime` datetime DEFAULT NULL COMMENT '有效期截至时间',
  `orderId` int(11) DEFAULT NULL COMMENT '订单ID',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='优惠券用户使用表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_feedback`
--

DROP TABLE IF EXISTS `nidemall_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL DEFAULT '0' COMMENT '用户表的用户ID',
  `username` varchar(63) NOT NULL DEFAULT '' COMMENT '用户名称',
  `mobile` varchar(20) NOT NULL DEFAULT '' COMMENT '手机号',
  `feedType` varchar(63) NOT NULL DEFAULT '' COMMENT '反馈类型',
  `content` varchar(1023) NOT NULL COMMENT '反馈内容',
  `status` int(3) NOT NULL DEFAULT '0' COMMENT '状态',
  `hasPicture` tinyint(1) DEFAULT '0' COMMENT '是否含有图片',
  `picUrls` varchar(1023) DEFAULT NULL COMMENT '图片地址列表，采用JSON数组格式',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `id_value` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='意见反馈表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_footprint`
--

DROP TABLE IF EXISTS `nidemall_footprint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_footprint` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL DEFAULT '0' COMMENT '用户表的用户ID',
  `goodsId` int(11) NOT NULL DEFAULT '0' COMMENT '浏览商品ID',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户浏览足迹表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_goods`
--

DROP TABLE IF EXISTS `nidemall_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goodsSn` varchar(63) NOT NULL DEFAULT '' COMMENT '商品编号',
  `name` varchar(127) NOT NULL DEFAULT '' COMMENT '商品名称',
  `categoryId` int(11) DEFAULT '0' COMMENT '商品所属类目ID',
  `brandId` int(11) DEFAULT '0',
  `gallery` varchar(1023) DEFAULT NULL COMMENT '商品宣传图片列表，采用JSON数组格式',
  `keywords` varchar(255) DEFAULT '' COMMENT '商品关键字，采用逗号间隔',
  `brief` varchar(255) DEFAULT '' COMMENT '商品简介',
  `isOnSale` tinyint(1) DEFAULT '1' COMMENT '是否上架',
  `sortOrder` smallint(4) DEFAULT '100',
  `picUrl` varchar(255) DEFAULT NULL COMMENT '商品页面商品图片',
  `shareUrl` varchar(255) DEFAULT NULL COMMENT '商品分享海报',
  `isNew` tinyint(1) DEFAULT '0' COMMENT '是否新品首发，如果设置则可以在新品首发页面展示',
  `isHot` tinyint(1) DEFAULT '0' COMMENT '是否人气推荐，如果设置则可以在人气推荐页面展示',
  `unit` varchar(31) DEFAULT '’件‘' COMMENT '商品单位，例如件、盒',
  `counterPrice` decimal(10,2) DEFAULT '0.00' COMMENT '专柜价格',
  `retailPrice` decimal(10,2) DEFAULT '100000.00' COMMENT '零售价格',
  `detail` text COMMENT '商品详细介绍，是富文本格式',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `goods_sn` (`goodsSn`),
  KEY `cat_id` (`categoryId`),
  KEY `brand_id` (`brandId`),
  KEY `sort_order` (`sortOrder`)
) ENGINE=InnoDB AUTO_INCREMENT=1181004 DEFAULT CHARSET=utf8mb4 COMMENT='商品基本信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_goods_attribute`
--

DROP TABLE IF EXISTS `nidemall_goods_attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_goods_attribute` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goodsId` int(11) NOT NULL DEFAULT '0' COMMENT '商品表的商品ID',
  `attribute` varchar(255) NOT NULL COMMENT '商品参数名称',
  `value` varchar(255) NOT NULL COMMENT '商品参数值',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `goods_id` (`goodsId`)
) ENGINE=InnoDB AUTO_INCREMENT=877 DEFAULT CHARSET=utf8mb4 COMMENT='商品参数表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_goods_product`
--

DROP TABLE IF EXISTS `nidemall_goods_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_goods_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goodsId` int(11) NOT NULL DEFAULT '0' COMMENT '商品表的商品ID',
  `specifications` varchar(1023) NOT NULL COMMENT '商品规格值列表，采用JSON数组格式',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品货品价格',
  `number` int(11) NOT NULL DEFAULT '0' COMMENT '商品货品数量',
  `url` varchar(125) DEFAULT NULL COMMENT '商品货品图片',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `goods_id` (`goodsId`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb4 COMMENT='商品货品表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_goods_specification`
--

DROP TABLE IF EXISTS `nidemall_goods_specification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_goods_specification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goodsId` int(11) NOT NULL DEFAULT '0' COMMENT '商品表的商品ID',
  `specification` varchar(255) NOT NULL DEFAULT '' COMMENT '商品规格名称',
  `value` varchar(255) NOT NULL DEFAULT '' COMMENT '商品规格值',
  `picUrl` varchar(255) NOT NULL DEFAULT '' COMMENT '商品规格图片',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `goods_id` (`goodsId`)
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=utf8mb4 COMMENT='商品规格表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_groupon`
--

DROP TABLE IF EXISTS `nidemall_groupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_groupon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL COMMENT '关联的订单ID',
  `grouponId` int(11) DEFAULT '0' COMMENT '如果是开团用户，则grouponId是0；如果是参团用户，则grouponId是团购活动ID',
  `rulesId` int(11) NOT NULL COMMENT '团购规则ID，关联nidemall_groupon_rules表ID字段',
  `userId` int(11) NOT NULL COMMENT '用户ID',
  `shareUrl` varchar(255) DEFAULT NULL COMMENT '团购分享图片地址',
  `creatorUserId` int(11) NOT NULL COMMENT '开团用户ID',
  `creatorUserTime` datetime DEFAULT NULL COMMENT '开团时间',
  `status` smallint(6) DEFAULT '0' COMMENT '团购活动状态，开团未支付则0，开团中则1，开团失败则2',
  `addTime` datetime NOT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='团购活动表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_groupon_rules`
--

DROP TABLE IF EXISTS `nidemall_groupon_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_groupon_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goodsId` int(11) NOT NULL COMMENT '商品表的商品ID',
  `goodsName` varchar(127) NOT NULL COMMENT '商品名称',
  `picUrl` varchar(255) DEFAULT NULL COMMENT '商品图片或者商品货品图片',
  `discount` decimal(63,0) NOT NULL COMMENT '优惠金额',
  `discountMember` int(11) NOT NULL COMMENT '达到优惠条件的人数',
  `expireTime` datetime DEFAULT NULL COMMENT '团购过期时间',
  `status` smallint(6) DEFAULT '0' COMMENT '团购规则状态，正常上线则0，到期自动下线则1，管理手动下线则2',
  `addTime` datetime NOT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `goods_id` (`goodsId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='团购规则表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_issue`
--

DROP TABLE IF EXISTS `nidemall_issue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_issue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) DEFAULT NULL COMMENT '问题标题',
  `answer` varchar(255) DEFAULT NULL COMMENT '问题答案',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='常见问题表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_keyword`
--

DROP TABLE IF EXISTS `nidemall_keyword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_keyword` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(127) NOT NULL DEFAULT '' COMMENT '关键字',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '关键字的跳转链接',
  `isHot` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是热门关键字',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是默认关键字',
  `sortOrder` int(11) NOT NULL DEFAULT '100' COMMENT '排序',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='关键字表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_log`
--

DROP TABLE IF EXISTS `nidemall_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '管理员',
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '管理员地址',
  `type` int(11) DEFAULT NULL COMMENT '操作分类',
  `action` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作动作',
  `status` tinyint(1) DEFAULT NULL COMMENT '操作状态',
  `result` varchar(127) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作结果，或者成功消息，或者失败消息',
  `comment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '补充信息',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_notice`
--

DROP TABLE IF EXISTS `nidemall_notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(63) DEFAULT NULL COMMENT '通知标题',
  `content` varchar(511) DEFAULT NULL COMMENT '通知内容',
  `adminId` int(11) DEFAULT '0' COMMENT '创建通知的管理员ID，如果是系统内置通知则是0.',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='通知表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_notice_admin`
--

DROP TABLE IF EXISTS `nidemall_notice_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_notice_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `noticeId` int(11) DEFAULT NULL COMMENT '通知ID',
  `noticeTitle` varchar(63) DEFAULT NULL COMMENT '通知标题',
  `adminId` int(11) DEFAULT NULL COMMENT '接收通知的管理员ID',
  `readTime` datetime DEFAULT NULL COMMENT '阅读时间，如果是NULL则是未读状态',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='通知管理员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_order`
--

DROP TABLE IF EXISTS `nidemall_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL COMMENT '用户表的用户ID',
  `orderSn` varchar(63) NOT NULL COMMENT '订单编号',
  `orderStatus` smallint(6) NOT NULL COMMENT '订单状态',
  `aftersaleStatus` smallint(6) DEFAULT '0' COMMENT '售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消',
  `consignee` varchar(63) NOT NULL COMMENT '收货人名称',
  `mobile` varchar(63) NOT NULL COMMENT '收货人手机号',
  `address` varchar(127) NOT NULL COMMENT '收货具体地址',
  `message` varchar(512) NOT NULL DEFAULT '' COMMENT '用户订单留言',
  `goodsPrice` decimal(10,2) NOT NULL COMMENT '商品总费用',
  `freightPrice` decimal(10,2) NOT NULL COMMENT '配送费用',
  `couponPrice` decimal(10,2) NOT NULL COMMENT '优惠券减免',
  `integralPrice` decimal(10,2) NOT NULL COMMENT '用户积分减免',
  `grouponPrice` decimal(10,2) NOT NULL COMMENT '团购优惠价减免',
  `orderPrice` decimal(10,2) NOT NULL COMMENT '订单费用， = goodsPrice + freightPrice - couponPrice',
  `actualPrice` decimal(10,2) NOT NULL COMMENT '实付费用， = orderPrice - integralPrice',
  `payId` varchar(63) DEFAULT NULL COMMENT '微信付款编号',
  `payTime` datetime DEFAULT NULL COMMENT '微信付款时间',
  `shipSn` varchar(63) DEFAULT NULL COMMENT '发货编号',
  `shipChannel` varchar(63) DEFAULT NULL COMMENT '发货快递公司',
  `shipTime` datetime DEFAULT NULL COMMENT '发货开始时间',
  `refundAmount` decimal(10,2) DEFAULT NULL COMMENT '实际退款金额，（有可能退款金额小于实际支付金额）',
  `refundType` varchar(63) DEFAULT NULL COMMENT '退款方式',
  `refundContent` varchar(127) DEFAULT NULL COMMENT '退款备注',
  `refundTime` datetime DEFAULT NULL COMMENT '退款时间',
  `confirmTime` datetime DEFAULT NULL COMMENT '用户确认收货时间',
  `comments` smallint(6) DEFAULT '0' COMMENT '待评价订单商品数量',
  `endTime` datetime DEFAULT NULL COMMENT '订单关闭时间',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_order_goods`
--

DROP TABLE IF EXISTS `nidemall_order_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_order_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL DEFAULT '0' COMMENT '订单表的订单ID',
  `goodsId` int(11) NOT NULL DEFAULT '0' COMMENT '商品表的商品ID',
  `goodsName` varchar(127) NOT NULL DEFAULT '' COMMENT '商品名称',
  `goodsSn` varchar(63) NOT NULL DEFAULT '' COMMENT '商品编号',
  `productId` int(11) NOT NULL DEFAULT '0' COMMENT '商品货品表的货品ID',
  `number` smallint(5) NOT NULL DEFAULT '0' COMMENT '商品货品的购买数量',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品货品的售价',
  `specifications` varchar(1023) NOT NULL COMMENT '商品货品的规格列表',
  `picUrl` varchar(255) NOT NULL DEFAULT '' COMMENT '商品货品图片或者商品图片',
  `comment` int(11) DEFAULT '0' COMMENT '订单商品评论，如果是-1，则超期不能评价；如果是0，则可以评价；如果其他值，则是comment表里面的评论ID。',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `order_id` (`orderId`),
  KEY `goods_id` (`goodsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_permission`
--

DROP TABLE IF EXISTS `nidemall_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) DEFAULT NULL COMMENT '角色ID',
  `permission` varchar(63) DEFAULT NULL COMMENT '权限',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COMMENT='权限表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_region`
--

DROP TABLE IF EXISTS `nidemall_region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_region` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '行政区域父ID，例如区县的pid指向市，市的pid指向省，省的pid则是0',
  `name` varchar(120) NOT NULL DEFAULT '' COMMENT '行政区域名称',
  `type` tinyint(3) NOT NULL DEFAULT '0' COMMENT '行政区域类型，如如1则是省， 如果是2则是市，如果是3则是区县',
  `code` int(11) NOT NULL DEFAULT '0' COMMENT '行政区域编码',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`pid`),
  KEY `region_type` (`type`),
  KEY `agency_id` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3232 DEFAULT CHARSET=utf8mb4 COMMENT='行政区域表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_role`
--

DROP TABLE IF EXISTS `nidemall_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL COMMENT '角色名称',
  `desc` varchar(1023) DEFAULT NULL COMMENT '角色描述',
  `enabled` tinyint(1) DEFAULT '1' COMMENT '是否启用',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_search_history`
--

DROP TABLE IF EXISTS `nidemall_search_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_search_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL COMMENT '用户表的用户ID',
  `keyword` varchar(63) NOT NULL COMMENT '搜索关键字',
  `from` varchar(63) NOT NULL DEFAULT '' COMMENT '搜索来源，如pc、wx、app',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='搜索历史表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_storage`
--

DROP TABLE IF EXISTS `nidemall_storage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_storage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(63) NOT NULL COMMENT '文件的唯一索引',
  `name` varchar(255) NOT NULL COMMENT '文件名',
  `type` varchar(20) NOT NULL COMMENT '文件类型',
  `size` int(11) NOT NULL COMMENT '文件大小',
  `url` varchar(255) DEFAULT NULL COMMENT '文件访问链接',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件存储表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_system`
--

DROP TABLE IF EXISTS `nidemall_system`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_system` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyName` varchar(255) NOT NULL COMMENT '系统配置名',
  `keyValue` varchar(255) NOT NULL COMMENT '系统配置值',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_topic`
--

DROP TABLE IF EXISTS `nidemall_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '''' COMMENT '专题标题',
  `subtitle` varchar(255) DEFAULT '''' COMMENT '专题子标题',
  `content` text COMMENT '专题内容，富文本格式',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '专题相关商品最低价',
  `readCount` varchar(255) DEFAULT '1k' COMMENT '专题阅读量',
  `picUrl` varchar(255) DEFAULT '' COMMENT '专题图片',
  `sortOrder` int(11) DEFAULT '100' COMMENT '排序',
  `goods` varchar(1023) DEFAULT '' COMMENT '专题相关商品，采用JSON数组格式',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `topic_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=319 DEFAULT CHARSET=utf8mb4 COMMENT='专题表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nidemall_user`
--

DROP TABLE IF EXISTS `nidemall_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nidemall_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(63) NOT NULL COMMENT '用户名称',
  `password` varchar(63) NOT NULL DEFAULT '' COMMENT '用户密码',
  `gender` tinyint(3) NOT NULL DEFAULT '0' COMMENT '性别：0 未知， 1男， 1 女',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `lastLoginTime` datetime DEFAULT NULL COMMENT '最近一次登录时间',
  `lastLoginIp` varchar(63) NOT NULL DEFAULT '' COMMENT '最近一次登录IP地址',
  `userLevel` tinyint(3) DEFAULT '0' COMMENT '0 普通用户，1 VIP用户，2 高级VIP用户',
  `nickname` varchar(63) NOT NULL DEFAULT '' COMMENT '用户昵称或网络名称',
  `mobile` varchar(20) NOT NULL DEFAULT '' COMMENT '用户手机号码',
  `avatar` varchar(255) NOT NULL DEFAULT '' COMMENT '用户头像图片',
  `weixinOpenid` varchar(63) NOT NULL DEFAULT '' COMMENT '微信登录openid',
  `sessionKey` varchar(100) NOT NULL DEFAULT '' COMMENT '微信登录会话KEY',
  `status` tinyint(3) NOT NULL DEFAULT '0' COMMENT '0 可用, 1 禁用, 2 注销',
  `addTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-16 23:12:57
