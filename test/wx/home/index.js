const test = require('ava');
const { request, deepEqualType } = require('../../helpers/app.js');

const INDEX_DATA = {
  "newGoodsList": [
    {
      "id": 1116011,
      "name": "蔓越莓曲奇 200克",
      "brief": "酥脆奶香，甜酸回味",
      "picUrl": "http://yanxuan.nosdn.127.net/767b370d07f3973500db54900bcbd2a7.png",
      "isNew": true,
      "isHot": true,
      "counterPrice": 56.00,
      "retailPrice": 36.00
    },
    {
      "id": 1127047,
      "name": "趣味粉彩系列笔记本",
      "brief": "粉彩色泽，记录生活",
      "picUrl": "http://yanxuan.nosdn.127.net/6c03ca93d8fe404faa266ea86f3f1e43.png",
      "isNew": true,
      "isHot": false,
      "counterPrice": 49.00,
      "retailPrice": 29.00
    },
    {
      "id": 1134030,
      "name": "简约知性记忆棉坐垫",
      "brief": "慢回弹海绵，时尚设计。",
      "picUrl": "http://yanxuan.nosdn.127.net/aa49dfe878becf768eddc4c1636643a6.png",
      "isNew": true,
      "isHot": false,
      "counterPrice": 66.00,
      "retailPrice": 46.00
    },
    {
      "id": 1134032,
      "name": "趣味粉彩系列记忆棉坐垫",
      "brief": "慢回弹海绵的呵护，萌趣添彩。",
      "picUrl": "http://yanxuan.nosdn.127.net/8b30eeb17c831eba08b97bdcb4c46a8e.png",
      "isNew": true,
      "isHot": false,
      "counterPrice": 69.00,
      "retailPrice": 49.00
    },
    {
      "id": 1135002,
      "name": "宫廷奢华真丝四件套",
      "brief": "100%桑蚕丝，丝滑润肤",
      "picUrl": "http://yanxuan.nosdn.127.net/45548f26cfd0c7c41e0afc3709d48286.png",
      "isNew": true,
      "isHot": false,
      "counterPrice": 2619.00,
      "retailPrice": 2599.00
    },
    {
      "id": 1135072,
      "name": "经典海魂纹水手裙（婴童）",
      "brief": "自由海军领探索未来梦",
      "picUrl": "http://yanxuan.nosdn.127.net/43e57d4208cdc78ac9c088f9b3e798f5.png",
      "isNew": true,
      "isHot": false,
      "counterPrice": 89.00,
      "retailPrice": 69.00
    }
  ],
  "couponList": [
    {
      "id": 1,
      "name": "限时满减券",
      "desc": "全场通用",
      "tag": "无限制",
      "discount": 5.00,
      "min": 99.00,
      "days": 10
    },
    {
      "id": 2,
      "name": "限时满减券",
      "desc": "全场通用",
      "tag": "无限制",
      "discount": 10.00,
      "min": 99.00,
      "days": 10
    }
  ],
  "channel": [
    {
      "id": 1005000,
      "name": "居家",
      "iconUrl": "http://yanxuan.nosdn.127.net/a45c2c262a476fea0b9fc684fed91ef5.png"
    },
    {
      "id": 1005001,
      "name": "餐厨",
      "iconUrl": "http://yanxuan.nosdn.127.net/ad8b00d084cb7d0958998edb5fee9c0a.png"
    },
    {
      "id": 1005002,
      "name": "饮食",
      "iconUrl": "http://yanxuan.nosdn.127.net/c9280327a3fd2374c000f6bf52dff6eb.png"
    },
    {
      "id": 1008000,
      "name": "配件",
      "iconUrl": "http://yanxuan.nosdn.127.net/11abb11c4cfdee59abfb6d16caca4c6a.png"
    },
    {
      "id": 1010000,
      "name": "服装",
      "iconUrl": "http://yanxuan.nosdn.127.net/28a685c96f91584e7e4876f1397767db.png"
    },
    {
      "id": 1011000,
      "name": "婴童",
      "iconUrl": "http://yanxuan.nosdn.127.net/1ba9967b8de1ac50fad21774a4494f5d.png"
    },
    {
      "id": 1012000,
      "name": "杂货",
      "iconUrl": "http://yanxuan.nosdn.127.net/c2a3d6349e72c35931fe3b5bcd0966be.png"
    },
    {
      "id": 1013001,
      "name": "洗护",
      "iconUrl": "http://yanxuan.nosdn.127.net/9fe068776b6b1fca13053d68e9c0a83f.png"
    },
    {
      "id": 1019000,
      "name": "志趣",
      "iconUrl": "http://yanxuan.nosdn.127.net/7093cfecb9dde1dd3eaf459623df4071.png"
    }
  ],
  "grouponList": [],
  "banner": [
    {
      "id": 1,
      "name": "合作 谁是你的菜",
      "link": "",
      "url": "http://yanxuan.nosdn.127.net/65091eebc48899298171c2eb6696fe27.jpg",
      "position": 1,
      "content": "合作 谁是你的菜",
      "enabled": true,
      "addTime": "2018-02-01 00:00:00",
      "updateTime": "2018-02-01 00:00:00",
      "deleted": false
    },
    {
      "id": 2,
      "name": "活动 美食节",
      "link": "",
      "url": "http://yanxuan.nosdn.127.net/bff2e49136fcef1fd829f5036e07f116.jpg",
      "position": 1,
      "content": "活动 美食节",
      "enabled": true,
      "addTime": "2018-02-01 00:00:00",
      "updateTime": "2018-02-01 00:00:00",
      "deleted": false
    },
    {
      "id": 3,
      "name": "活动 母亲节",
      "link": "",
      "url": "http://yanxuan.nosdn.127.net/8e50c65fda145e6dd1bf4fb7ee0fcecc.jpg",
      "position": 1,
      "content": "活动 母亲节5",
      "enabled": true,
      "addTime": "2018-02-01 00:00:00",
      "updateTime": "2018-02-01 00:00:00",
      "deleted": false
    }
  ],
  "brandList": [
    {
      "id": 1001000,
      "name": "MUJI制造商",
      "desc": "严选精选了MUJI制造商和生产原料，\n用几乎零利润的价格，剔除品牌溢价，\n让用户享受原品牌的品质生活。",
      "picUrl": "http://yanxuan.nosdn.127.net/1541445967645114dd75f6b0edc4762d.png",
      "floorPrice": 12.90
    },
    {
      "id": 1001002,
      "name": "内野制造商",
      "desc": "严选从世界各地挑选毛巾，最终选择了为日本内野代工的工厂，追求毛巾的柔软度与功能性。品质比肩商场几百元的毛巾。",
      "picUrl": "http://yanxuan.nosdn.127.net/8ca3ce091504f8aa1fba3fdbb7a6e351.png",
      "floorPrice": 29.00
    },
    {
      "id": 1001003,
      "name": "Adidas制造商",
      "desc": "严选找到为Adidas等品牌制造商，\n选取优质原材料，与厂方一起设计，\n为你提供好的理想的运动装备。",
      "picUrl": "http://yanxuan.nosdn.127.net/335334d0deaff6dc3376334822ab3a2f.png",
      "floorPrice": 49.00
    },
    {
      "id": 1001007,
      "name": "优衣库制造商",
      "desc": "严选找到日本知名服装UNIQLO的制造商，\n选取优质长绒棉和精梳工艺，\n与厂方一起设计，为你提供理想的棉袜。",
      "picUrl": "http://yanxuan.nosdn.127.net/0d72832e37e7e3ea391b519abbbc95a3.png",
      "floorPrice": 29.00
    }
  ],
  "hotGoodsList": [
    {
      "id": 1006013,
      "name": "双宫茧桑蚕丝被 空调被",
      "brief": "一级桑蚕丝，吸湿透气柔软",
      "picUrl": "http://yanxuan.nosdn.127.net/583812520c68ca7995b6fac4c67ae2c7.png",
      "isNew": false,
      "isHot": true,
      "counterPrice": 719.00,
      "retailPrice": 699.00
    },
    {
      "id": 1006014,
      "name": "双宫茧桑蚕丝被 子母被",
      "brief": "双层子母被，四季皆可使用",
      "picUrl": "http://yanxuan.nosdn.127.net/2b537159f0f789034bf8c4b339c43750.png",
      "isNew": false,
      "isHot": true,
      "counterPrice": 14199.00,
      "retailPrice": 1399.00
    },
    {
      "id": 1009012,
      "name": "可水洗舒柔丝羽绒枕",
      "brief": "超细纤维，蓬松轻盈回弹",
      "picUrl": "http://yanxuan.nosdn.127.net/a196b367f23ccfd8205b6da647c62b84.png",
      "isNew": false,
      "isHot": true,
      "counterPrice": 79.00,
      "retailPrice": 59.00
    },
    {
      "id": 1011004,
      "name": "色织精梳AB纱格纹空调被",
      "brief": "加大加厚，双色精彩",
      "picUrl": "http://yanxuan.nosdn.127.net/0984c9388a2c3fd2335779da904be393.png",
      "isNew": false,
      "isHot": true,
      "counterPrice": 219.00,
      "retailPrice": 199.00
    },
    {
      "id": 1019002,
      "name": "升级款护颈双人记忆枕",
      "brief": "共享亲密2人时光",
      "picUrl": "http://yanxuan.nosdn.127.net/0118039f7cda342651595d994ed09567.png",
      "isNew": false,
      "isHot": true,
      "counterPrice": 219.00,
      "retailPrice": 199.00
    },
    {
      "id": 1019006,
      "name": "植物填充护颈夜交藤枕",
      "brief": "健康保护枕",
      "picUrl": "http://yanxuan.nosdn.127.net/60c3707837c97a21715ecc3986a744ce.png",
      "isNew": false,
      "isHot": true,
      "counterPrice": 119.00,
      "retailPrice": 99.00
    }
  ],
  "topicList": [
    {
      "id": 289,
      "title": "专业运动袜也可以高性价比",
      "subtitle": "越来越多运动人士意识到，运动鞋要购置好的，鞋里的运动袜也不可忽视。专业运动袜帮助...",
      "price": 0.00,
      "readCount": "11.9k",
      "picUrl": "https://yanxuan.nosdn.127.net/14932840600970609.jpg"
    },
    {
      "id": 294,
      "title": "这只锅，可以从祖母用到孙辈",
      "subtitle": "买100年传世珐琅锅送迷你马卡龙色小锅",
      "price": 149.00,
      "readCount": "108.1k",
      "picUrl": "https://yanxuan.nosdn.127.net/14937214454750141.jpg"
    },
    {
      "id": 291,
      "title": "舒适新主张",
      "subtitle": "如何挑选适合自己的好物？",
      "price": 29.00,
      "readCount": "67.8k",
      "picUrl": "https://yanxuan.nosdn.127.net/14939496197300723.jpg"
    },
    {
      "id": 295,
      "title": "他们在严选遇见的新生活",
      "subtitle": "多款商品直减中，最高直减400元",
      "price": 35.80,
      "readCount": "36.6k",
      "picUrl": "https://yanxuan.nosdn.127.net/14938092956370380.jpg"
    }
  ],
  "floorGoodsList": [
    {
      "name": "居家",
      "goodsList": [
        {
          "id": 1006002,
          "name": "轻奢纯棉刺绣水洗四件套",
          "brief": "设计师原款，精致绣花",
          "picUrl": "http://yanxuan.nosdn.127.net/8ab2d3287af0cefa2cc539e40600621d.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 919.00,
          "retailPrice": 899.00
        },
        {
          "id": 1006007,
          "name": "秋冬保暖加厚澳洲羊毛被",
          "brief": "臻品级澳洲进口羊毛",
          "picUrl": "http://yanxuan.nosdn.127.net/66425d1ed50b3968fed27c822fdd32e0.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 479.00,
          "retailPrice": 459.00
        },
        {
          "id": 1006013,
          "name": "双宫茧桑蚕丝被 空调被",
          "brief": "一级桑蚕丝，吸湿透气柔软",
          "picUrl": "http://yanxuan.nosdn.127.net/583812520c68ca7995b6fac4c67ae2c7.png",
          "isNew": false,
          "isHot": true,
          "counterPrice": 719.00,
          "retailPrice": 699.00
        },
        {
          "id": 1006014,
          "name": "双宫茧桑蚕丝被 子母被",
          "brief": "双层子母被，四季皆可使用",
          "picUrl": "http://yanxuan.nosdn.127.net/2b537159f0f789034bf8c4b339c43750.png",
          "isNew": false,
          "isHot": true,
          "counterPrice": 14199.00,
          "retailPrice": 1399.00
        }
      ],
      "id": 1005000
    },
    {
      "name": "餐厨",
      "goodsList": [
        {
          "id": 1023003,
          "name": "100年传世珐琅锅 全家系列",
          "brief": "特质铸铁，大容量全家共享",
          "picUrl": "http://yanxuan.nosdn.127.net/c39d54c06a71b4b61b6092a0d31f2335.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 418.00,
          "retailPrice": 398.00
        },
        {
          "id": 1025005,
          "name": "100年传世珐琅锅",
          "brief": "特质铸铁，锁热节能",
          "picUrl": "http://yanxuan.nosdn.127.net/49e26f00ca4d0ce00f9960d22c936738.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 288.00,
          "retailPrice": 268.00
        },
        {
          "id": 1038004,
          "name": "100年传世珐琅锅 马卡龙系列",
          "brief": "均匀导热，释放美味",
          "picUrl": "http://yanxuan.nosdn.127.net/4d3d3eaeb872860539d7faa59f9f84e9.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 379.00,
          "retailPrice": 359.00
        },
        {
          "id": 1051000,
          "name": "Carat钻石炒锅30cm",
          "brief": "安全涂层，轻便无烟",
          "picUrl": "http://yanxuan.nosdn.127.net/e564410546a11ddceb5a82bfce8da43d.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 200.00,
          "retailPrice": 180.00
        }
      ],
      "id": 1005001
    },
    {
      "name": "饮食",
      "goodsList": [
        {
          "id": 1045000,
          "name": "绿茶蛋黄酥 200克/4枚入",
          "brief": "香甜茶食，果腹优选",
          "picUrl": "http://yanxuan.nosdn.127.net/b2adc3fd9b84a289a1be03e8ee400e61.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 48.00,
          "retailPrice": 28.00
        },
        {
          "id": 1070000,
          "name": "星云酥 180克/3颗",
          "brief": "酥饼界的小仙女",
          "picUrl": "http://yanxuan.nosdn.127.net/8392725765cdd57fdae3f173877f4bda.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 46.00,
          "retailPrice": 26.00
        },
        {
          "id": 1111007,
          "name": "妙曲奇遇记曲奇礼盒 520克",
          "brief": "六种口味，酥香脆爽",
          "picUrl": "http://yanxuan.nosdn.127.net/8d228f767b136a67aaf2cbbf6deb46fa.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 98.00,
          "retailPrice": 78.00
        },
        {
          "id": 1116011,
          "name": "蔓越莓曲奇 200克",
          "brief": "酥脆奶香，甜酸回味",
          "picUrl": "http://yanxuan.nosdn.127.net/767b370d07f3973500db54900bcbd2a7.png",
          "isNew": true,
          "isHot": true,
          "counterPrice": 56.00,
          "retailPrice": 36.00
        }
      ],
      "id": 1005002
    },
    {
      "name": "配件",
      "goodsList": [
        {
          "id": 1085019,
          "name": "20寸 纯PC“铝框”（非全铝）登机箱",
          "brief": "铝质包角，牢固抗摔",
          "picUrl": "http://yanxuan.nosdn.127.net/65c955a7a98e84d44ca30bb88a591eac.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 369.00,
          "retailPrice": 349.00
        },
        {
          "id": 1086052,
          "name": "20寸 铝镁合金登机箱",
          "brief": "时尚金属箱，奢品质感",
          "picUrl": "http://yanxuan.nosdn.127.net/93171a281c4ed272c007a050816e6f6c.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 879.00,
          "retailPrice": 859.00
        },
        {
          "id": 1113019,
          "name": "20寸 PC膜拉链登机箱",
          "brief": "热卖9万只，网易人手1只",
          "picUrl": "http://yanxuan.nosdn.127.net/ad504bb389039ff35c4cd6ae912be87e.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 228.00,
          "retailPrice": 208.00
        },
        {
          "id": 1114011,
          "name": "104升 纯PC拉链斜纹拉杆箱",
          "brief": "104升的体积，90升的价格",
          "picUrl": "http://yanxuan.nosdn.127.net/196b5ce11930b4eadaec563cb0406634.png",
          "isNew": false,
          "isHot": false,
          "counterPrice": 319.00,
          "retailPrice": 299.00
        }
      ],
      "id": 1008000
    }
  ]
};

test('success', async (t) => {
  const response = await request(t, {
    path: '/wx/home/index',
  });

  t.is(response.errno, 0);
  deepEqualType(t, response.data, INDEX_DATA);
});