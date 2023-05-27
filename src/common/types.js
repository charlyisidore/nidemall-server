/**
 * @typedef {import('./service/ad.js')} AdService
 * @typedef {import('./service/address.js')} AddressService
 * @typedef {import('./service/auth.js')} AuthService
 * @typedef {import('./service/brand.js')} BrandService
 * @typedef {import('./service/cart.js')} CartService
 * @typedef {import('./service/category.js')} CategoryService
 * @typedef {import('./service/collect.js')} CollectService
 * @typedef {import('./service/comment.js')} CommentService
 * @typedef {import('./service/coupon.js')} CouponService
 * @typedef {import('./service/coupon_user.js')} CouponUserService
 * @typedef {import('./service/express.js')} ExpressService
 * @typedef {import('./service/footprint.js')} FootprintService
 * @typedef {import('./service/goods.js')} GoodsService
 * @typedef {import('./service/goods_attribute.js')} GoodsAttributeService
 * @typedef {import('./service/goods_product.js')} GoodsProductService
 * @typedef {import('./service/goods_specification.js')} GoodsSpecificationService
 * @typedef {import('./service/groupon.js')} GrouponService
 * @typedef {import('./service/groupon_rules.js')} GrouponRulesService
 * @typedef {import('./service/issue.js')} IssueService
 * @typedef {import('./service/order.js')} OrderService
 * @typedef {import('./service/order_goods.js')} OrderGoodsService
 * @typedef {import('./service/search_history.js')} SearchHistoryService
 * @typedef {import('./service/system.js')} SystemService
 * @typedef {import('./service/topic.js')} TopicService
 * @typedef {import('./service/user.js')} UserService
 * @typedef {import('./service/weixin.js')} WeixinService
 */

/**
 * @typedef {object} Ad
 * @property {number?} id - ID
 * @property {string?} name - 广告标题
 * @property {string?} link - 所广告的商品页面或者活动页面链接地址
 * @property {string} url - 广告宣传图片
 * @property {number?} position - 广告位置：1则是首页
 * @property {string?} content - 活动内容
 * @property {Date?} startTime - 广告开始时间
 * @property {Date?} endTime - 广告结束时间
 * @property {number?} enabled - 是否启动
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Address
 * @property {number?} id - ID
 * @property {string?} name - 收货人名称
 * @property {number?} userId - 用户表的用户ID
 * @property {string} province - 行政区域表的省ID
 * @property {string} city - 行政区域表的市ID
 * @property {string} county - 行政区域表的区县ID
 * @property {string?} addressDetail - 详细收货地址
 * @property {string?} areaCode - 地区编码
 * @property {string?} postalCode - 邮政编码
 * @property {string?} tel - 手机号码
 * @property {number?} isDefault - 是否默认地址
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Admin
 * @property {number?} id - ID
 * @property {string?} username - 管理员名称
 * @property {string?} password - 管理员密码
 * @property {string?} lastLoginIp - 最近一次登录IP地址
 * @property {Date?} lastLoginTime - 最近一次登录时间
 * @property {string?} avatar - 头像图片
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 * @property {number[]?} roleIds - 角色列表
 */

/**
 * @typedef {object} Aftersale
 * @property {number?} id - ID
 * @property {string?} aftersaleSn - 售后编号
 * @property {number} orderId - 订单ID
 * @property {number} userId - 用户ID
 * @property {number?} type - 售后类型，0是未收货退款，1是已收货（无需退货）退款，2用户退货退款
 * @property {string?} reason - 退款原因
 * @property {number?} amount - 退款金额
 * @property {string[]?} pictures - 退款凭证图片链接数组
 * @property {string?} comment - 退款说明
 * @property {number?} status - 售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消
 * @property {Date?} handleTime - 管理员操作时间
 * @property {Date?} addTime - 添加时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Brand
 * @property {number?} id - ID
 * @property {string?} name - 品牌商名称
 * @property {string?} desc - 品牌商简介
 * @property {string?} picUrl - 品牌商页的品牌商图片
 * @property {number?} sortOrder
 * @property {number?} floorPrice - 品牌商的商品低价，仅用于页面展示
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Cart
 * @property {number?} id - ID
 * @property {number?} userId - 用户表的用户ID
 * @property {number?} goodsId - 商品表的商品ID
 * @property {string?} goodsSn - 商品编号
 * @property {string?} goodsName - 商品名称
 * @property {number?} productId - 商品货品表的货品ID
 * @property {number?} price - 商品货品的价格
 * @property {number?} number - 商品货品的数量
 * @property {string[]?} specifications - 商品规格值列表，采用JSON数组格式
 * @property {number?} checked - 购物车中商品是否选择状态
 * @property {string?} picUrl - 商品图片或者商品货品图片
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Category
 * @property {number?} id - ID
 * @property {string?} name - 类目名称
 * @property {string?} keywords - 类目关键字，以JSON数组格式
 * @property {string?} desc - 类目广告语介绍
 * @property {number?} pid - 父类目ID
 * @property {string?} iconUrl - 类目图标
 * @property {string?} picUrl - 类目图片
 * @property {string?} level
 * @property {number?} sortOrder - 排序
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Collect
 * @property {number?} id - ID
 * @property {number?} userId - 用户表的用户ID
 * @property {number?} valueId - 如果type=0，则是商品ID；如果type=1，则是专题ID
 * @property {number?} type - 收藏类型，如果type=0，则是商品ID；如果type=1，则是专题ID
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Comment
 * @property {number?} id - ID
 * @property {number?} valueId - 如果type=0，则是商品评论；如果是type=1，则是专题评论。
 * @property {number?} type - 评论类型，如果type=0，则是商品评论；如果是type=1，则是专题评论；
 * @property {string?} content - 评论内容
 * @property {string?} adminContent - 管理员回复内容
 * @property {number?} userId - 用户表的用户ID
 * @property {number?} hasPicture - 是否含有图片
 * @property {string[]?} picUrls - 图片地址列表，采用JSON数组格式
 * @property {number?} star - 评分， 1-5
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Coupon
 * @property {number?} id - ID
 * @property {string} name - 优惠券名称
 * @property {string?} desc - 优惠券介绍，通常是显示优惠券使用限制文字
 * @property {string?} tag - 优惠券标签，例如新人专用
 * @property {number?} total - 优惠券数量，如果是0，则是无限量
 * @property {number?} discount - 优惠金额，
 * @property {number?} min - 最少消费金额才能使用优惠券。
 * @property {number?} limit - 用户领券限制数量，如果是0，则是不限制；默认是1，限领一张.
 * @property {number?} type - 优惠券赠送类型，如果是0则通用券，用户领取；如果是1，则是注册赠券；如果是2，则是优惠券码兑换；
 * @property {number?} status - 优惠券状态，如果是0则是正常可用；如果是1则是过期; 如果是2则是下架。
 * @property {number?} goodsType - 商品限制类型，如果0则全商品，如果是1则是类目限制，如果是2则是商品限制。
 * @property {number[]?} goodsValue - 商品限制值，goodsType如果是0则空集合，如果是1则是类目集合，如果是2则是商品集合。
 * @property {string?} code - 优惠券兑换码
 * @property {number?} timeType - 有效时间限制，如果是0，则基于领取时间的有效天数days；如果是1，则startTime和endTime是优惠券有效期；
 * @property {number?} days - 基于领取时间的有效天数days。
 * @property {Date?} startTime - 使用券开始时间
 * @property {Date?} endTime - 使用券截至时间
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} CouponUser
 * @property {number?} id - ID
 * @property {number} userId - 用户ID
 * @property {number} couponId - 优惠券ID
 * @property {number?} status - 使用状态, 如果是0则未使用；如果是1则已使用；如果是2则已过期；如果是3则已经下架；
 * @property {Date?} usedTime - 使用时间
 * @property {Date?} startTime - 有效期开始时间
 * @property {Date?} endTime - 有效期截至时间
 * @property {number?} orderId - 订单ID
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Feedback
 * @property {number?} id - ID
 * @property {number?} userId - 用户表的用户ID
 * @property {string?} username - 用户名称
 * @property {string?} mobile - 手机号
 * @property {string?} feedType - 反馈类型
 * @property {string} content - 反馈内容
 * @property {number?} status - 状态
 * @property {number?} hasPicture - 是否含有图片
 * @property {string[]?} picUrls - 图片地址列表，采用JSON数组格式
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Footprint
 * @property {number?} id - ID
 * @property {number?} userId - 用户表的用户ID
 * @property {number?} goodsId - 浏览商品ID
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Goods
 * @property {number?} id - ID
 * @property {string?} goodsSn - 商品编号
 * @property {string?} name - 商品名称
 * @property {number?} categoryId - 商品所属类目ID
 * @property {number?} brandId
 * @property {string[]?} gallery - 商品宣传图片列表，采用JSON数组格式
 * @property {string?} keywords - 商品关键字，采用逗号间隔
 * @property {string?} brief - 商品简介
 * @property {number?} isOnSale - 是否上架
 * @property {number?} sortOrder
 * @property {string?} picUrl - 商品页面商品图片
 * @property {string?} shareUrl - 商品分享海报
 * @property {number?} isNew - 是否新品首发，如果设置则可以在新品首发页面展示
 * @property {number?} isHot - 是否人气推荐，如果设置则可以在人气推荐页面展示
 * @property {string?} unit - 商品单位，例如件、盒
 * @property {number?} counterPrice - 专柜价格
 * @property {number?} retailPrice - 零售价格
 * @property {string?} detail - 商品详细介绍，是富文本格式
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} GoodsAttribute
 * @property {number?} id - ID
 * @property {number?} goodsId - 商品表的商品ID
 * @property {string} attribute - 商品参数名称
 * @property {string} value - 商品参数值
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} GoodsProduct
 * @property {number?} id - ID
 * @property {number?} goodsId - 商品表的商品ID
 * @property {string[]} specifications - 商品规格值列表，采用JSON数组格式
 * @property {number?} price - 商品货品价格
 * @property {number?} number - 商品货品数量
 * @property {string?} url - 商品货品图片
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} GoodsSpecification
 * @property {number?} id - ID
 * @property {number?} goodsId - 商品表的商品ID
 * @property {string?} specification - 商品规格名称
 * @property {string?} value - 商品规格值
 * @property {string?} picUrl - 商品规格图片
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Groupon
 * @property {number?} id - ID
 * @property {number} orderId - 关联的订单ID
 * @property {number?} grouponId - 如果是开团用户，则grouponId是0；如果是参团用户，则grouponId是团购活动ID
 * @property {number} rulesId - 团购规则ID，关联nidemallGrouponRules表ID字段
 * @property {number} userId - 用户ID
 * @property {string?} shareUrl - 团购分享图片地址
 * @property {number} creatorUserId - 开团用户ID
 * @property {Date?} creatorUserTime - 开团时间
 * @property {number?} status - 团购活动状态，开团未支付则0，开团中则1，开团失败则2
 * @property {Date} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} GrouponRules
 * @property {number?} id - ID
 * @property {number} goodsId - 商品表的商品ID
 * @property {string} goodsName - 商品名称
 * @property {string?} picUrl - 商品图片或者商品货品图片
 * @property {number} discount - 优惠金额
 * @property {number} discountMember - 达到优惠条件的人数
 * @property {Date?} expireTime - 团购过期时间
 * @property {number?} status - 团购规则状态，正常上线则0，到期自动下线则1，管理手动下线则2
 * @property {Date} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Issue
 * @property {number?} id - ID
 * @property {string?} question - 问题标题
 * @property {string?} answer - 问题答案
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Keyword
 * @property {number?} id - ID
 * @property {string?} keyword - 关键字
 * @property {string?} url - 关键字的跳转链接
 * @property {number?} isHot - 是否是热门关键字
 * @property {number?} isDefault - 是否是默认关键字
 * @property {number?} sortOrder - 排序
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Log
 * @property {number?} id - ID
 * @property {string?} admin - 管理员
 * @property {string?} ip - 管理员地址
 * @property {number?} type - 操作分类
 * @property {string?} action - 操作动作
 * @property {number?} status - 操作状态
 * @property {string?} result - 操作结果，或者成功消息，或者失败消息
 * @property {string?} comment - 补充信息
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Notice
 * @property {number?} id - ID
 * @property {string?} title - 通知标题
 * @property {string?} content - 通知内容
 * @property {number?} adminId - 创建通知的管理员ID，如果是系统内置通知则是0.
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} NoticeAdmin
 * @property {number?} id - ID
 * @property {number?} noticeId - 通知ID
 * @property {string?} noticeTitle - 通知标题
 * @property {number?} adminId - 接收通知的管理员ID
 * @property {Date?} readTime - 阅读时间，如果是NULL则是未读状态
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Order
 * @property {number?} id - ID
 * @property {number} userId - 用户表的用户ID
 * @property {string} orderSn - 订单编号
 * @property {number} orderStatus - 订单状态
 * @property {number?} aftersaleStatus - 售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消
 * @property {string} consignee - 收货人名称
 * @property {string} mobile - 收货人手机号
 * @property {string} address - 收货具体地址
 * @property {string?} message - 用户订单留言
 * @property {number?} goodsPrice - 商品总费用
 * @property {number?} freightPrice - 配送费用
 * @property {number?} couponPrice - 优惠券减免
 * @property {number?} integralPrice - 用户积分减免
 * @property {number?} grouponPrice - 团购优惠价减免
 * @property {number?} orderPrice - 订单费用， = goodsPrice + freightPrice - couponPrice
 * @property {number?} actualPrice - 实付费用， = orderPrice - integralPrice
 * @property {string?} payId - 微信付款编号
 * @property {Date?} payTime - 微信付款时间
 * @property {string?} shipSn - 发货编号
 * @property {string?} shipChannel - 发货快递公司
 * @property {Date?} shipTime - 发货开始时间
 * @property {number?} refundAmount - 实际退款金额，（有可能退款金额小于实际支付金额）
 * @property {string?} refundType - 退款方式
 * @property {string?} refundContent - 退款备注
 * @property {Date?} refundTime - 退款时间
 * @property {Date?} confirmTime - 用户确认收货时间
 * @property {number?} comments - 待评价订单商品数量
 * @property {Date?} endTime - 订单关闭时间
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} OrderGoods
 * @property {number?} id - ID
 * @property {number?} orderId - 订单表的订单ID
 * @property {number?} goodsId - 商品表的商品ID
 * @property {string?} goodsName - 商品名称
 * @property {string?} goodsSn - 商品编号
 * @property {number?} productId - 商品货品表的货品ID
 * @property {number?} number - 商品货品的购买数量
 * @property {number?} price - 商品货品的售价
 * @property {string[]} specifications - 商品货品的规格列表
 * @property {string?} picUrl - 商品货品图片或者商品图片
 * @property {number?} comment - 订单商品评论，如果是-1，则超期不能评价；如果是0，则可以评价；如果其他值，则是comment表里面的评论ID。
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Permission
 * @property {number?} id - ID
 * @property {number?} roleId - 角色ID
 * @property {string?} permission - 权限
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Region
 * @property {number?} id - ID
 * @property {number?} pid - 行政区域父ID，例如区县的pid指向市，市的pid指向省，省的pid则是0
 * @property {string?} name - 行政区域名称
 * @property {number?} type - 行政区域类型，如如1则是省， 如果是2则是市，如果是3则是区县
 * @property {number?} code - 行政区域编码
 */

/**
 * @typedef {object} Role
 * @property {number?} id - ID
 * @property {string} name - 角色名称
 * @property {string?} desc - 角色描述
 * @property {number?} enabled - 是否启用
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} SearchHistory
 * @property {number?} id - ID
 * @property {number} userId - 用户表的用户ID
 * @property {string} keyword - 搜索关键字
 * @property {string?} from - 搜索来源，如pc、wx、app
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Storage
 * @property {number?} id - ID
 * @property {string} key - 文件的唯一索引
 * @property {string} name - 文件名
 * @property {string} type - 文件类型
 * @property {number} size - 文件大小
 * @property {string?} url - 文件访问链接
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} System
 * @property {number?} id - ID
 * @property {string} keyName - 系统配置名
 * @property {string} keyValue - 系统配置值
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} Topic
 * @property {number?} id - ID
 * @property {string?} title - 专题标题
 * @property {string?} subtitle - 专题子标题
 * @property {string} content - 专题内容，富文本格式
 * @property {number?} price - 专题相关商品最低价
 * @property {string?} readCount - 专题阅读量
 * @property {string?} picUrl - 专题图片
 * @property {number?} sortOrder - 排序
 * @property {number[]?} goods - 专题相关商品，采用JSON数组格式
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */

/**
 * @typedef {object} User
 * @property {number?} id - ID
 * @property {string} username - 用户名称
 * @property {string?} password - 用户密码
 * @property {number?} gender - 性别：0 未知， 1男， 1 女
 * @property {Date?} birthday - 生日
 * @property {Date?} lastLoginTime - 最近一次登录时间
 * @property {string?} lastLoginIp - 最近一次登录IP地址
 * @property {number?} userLevel - 0 普通用户，1 VIP用户，2 高级VIP用户
 * @property {string?} nickname - 用户昵称或网络名称
 * @property {string?} mobile - 用户手机号码
 * @property {string?} avatar - 用户头像图片
 * @property {string?} weixinOpenid - 微信登录openid
 * @property {string?} sessionKey - 微信登录会话KEY
 * @property {number?} status - 0 可用, 1 禁用, 2 注销
 * @property {Date?} addTime - 创建时间
 * @property {Date?} updateTime - 更新时间
 * @property {number?} deleted - 逻辑删除
 */
