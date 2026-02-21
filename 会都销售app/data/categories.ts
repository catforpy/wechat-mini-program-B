/**
 * 微信小程序服务类目数据
 * 整理自微信开放文档
 * 更新时间：2026-02-08
 *
 * 完整数据文档：/文档/小程序服务类目数据提取文档.md
 */

// 三级类目模板
export interface TemplateInfo {
  name: string      // 模板名称
  desc: string      // 简短描述
}

// 二级类目
export interface SecondLevelCategory {
  name: string                    // 二级类目名称
  qualification?: string          // 资质要求
  scope?: string                  // 适用范围
  templates: TemplateInfo[]      // 三级类目（小程序模板）
}

// 一级类目
export interface FirstLevelCategory {
  name: string                      // 一级类目名称
  secondLevel: SecondLevelCategory[] // 二级类目列表
}

// 完整类目数据 - 24个一级类目
export const categoryData: FirstLevelCategory[] = [
  // ==================== 1. 物流服务 ====================
  {
    name: '物流服务',
    secondLevel: [
      {
        name: '快递查询',
        qualification: '',
        scope: '提供快递、物流行业的查件业务等服务。',
        templates: [
          { name: '快递查询', desc: '物流查件' },
          { name: '物流跟踪', desc: '包裹追踪' }
        ]
      }
    ]
  },

  // ==================== 2. 教育服务 ====================
  {
    name: '教育服务',
    secondLevel: [
      {
        name: '在线教育',
        qualification: '',
        scope: '提供在线教育、网络教育或者远程教育等以互联网为载体的教育服务。',
        templates: [
          { name: '在线课程', desc: '网课平台' },
          { name: '培训教育', desc: '技能培训' }
        ]
      }
    ]
  },

  // ==================== 3. 医疗服务 ====================
  {
    name: '医疗服务',
    secondLevel: [
      {
        name: '健康咨询',
        qualification: '',
        scope: '提供健康资讯、医疗信息咨询等服务。',
        templates: [
          { name: '健康资讯', desc: '健康信息' },
          { name: '医疗咨询', desc: '在线问询' }
        ]
      }
    ]
  },

  // ==================== 4. 政务民生 ====================
  {
    name: '政务民生',
    secondLevel: [
      {
        name: '公共服务',
        qualification: '',
        scope: '提供政务办理、公共服务查询等。',
        templates: [
          { name: '政务办理', desc: '在线办事' },
          { name: '公共服务', desc: '民生服务' }
        ]
      }
    ]
  },

  // ==================== 5. 金融业 ====================
  {
    name: '金融业',
    secondLevel: [
      {
        name: '支付服务',
        qualification: '',
        scope: '提供支付、收款等相关金融服务。',
        templates: [
          { name: '支付收款', desc: '移动支付' },
          { name: '财务管理', desc: '财务工具' }
        ]
      }
    ]
  },

  // ==================== 6. 交通服务 ====================
  {
    name: '交通服务',
    secondLevel: [
      {
        name: '出行服务',
        qualification: '',
        scope: '提供出行、交通等相关服务。',
        templates: [
          { name: '出行查询', desc: '交通信息' },
          { name: '打车服务', desc: '网约出行' }
        ]
      }
    ]
  },

  // ==================== 7. 房地产服务 ====================
  {
    name: '餐饮服务',
    secondLevel: [
      {
        name: '餐厅排队',
        qualification: '',
        scope: '提供个体餐饮门店提供就餐线上取号、排号等排队服务。注：不包含线上点餐、外卖等服务。',
        templates: [
          { name: '快餐店', desc: '连锁快餐' },
          { name: '火锅店', desc: '火锅烧烤' },
          { name: '小吃快餐', desc: '地方小吃' },
          { name: '自助餐', desc: '自助用餐' }
        ]
      },
      {
        name: '外卖点餐',
        qualification: '餐饮门店主体营业执照、门店可以从事餐饮服务的证件、线下门店照片',
        scope: '餐饮场所/点餐平台/外卖平台提供的点餐、外卖服务。',
        templates: [
          { name: '生鲜配送', desc: '蔬菜水果' },
          { name: '饮品外卖', desc: '奶茶咖啡' }
        ]
      }
    ]
  },

  // ==================== 生活服务 ====================
  {
    name: '生活服务',
    secondLevel: [
      {
        name: '家政服务',
        qualification: '',
        scope: '提供家政服务，如保姆、月嫂、房屋保洁、家电维修、数码电器维修等在线预约等服务。',
        templates: [
          { name: '保洁服务', desc: '家庭保洁' },
          { name: '维修服务', desc: '家电维修' },
          { name: '保姆月嫂', desc: '母婴护理' }
        ]
      },
      {
        name: '美容美发',
        qualification: '',
        scope: '提供美甲、美容、美睫、美发、纹身等不含医疗美容服务。',
        templates: [
          { name: '美发沙龙', desc: '美发造型' },
          { name: '美容护肤', desc: '美容护理' },
          { name: '美甲美睫', desc: '美甲服务' }
        ]
      },
      {
        name: '婚庆服务',
        qualification: '',
        scope: '提供婚礼庆典策划、婚纱摄影、婚宴酒席、婚礼摄像、蜜月旅行等相关服务。',
        templates: [
          { name: '婚纱摄影', desc: '婚纱照' },
          { name: '婚庆策划', desc: '婚礼策划' }
        ]
      }
    ]
  },

  // ==================== 电商平台 ====================
  {
    name: '电商平台',
    secondLevel: [
      {
        name: '食品饮料',
        qualification: '（4选1）1.《食品经营许可证》2.《食品生产许可证》3. 仅销售预包装食品提供：《预包装食品销售备案凭证》4. 口岸商店提供：《国境口岸卫生许可证》',
        scope: '提供食品、饮料、茶叶、零食、调料等产品在线销售及配送相关服务。',
        templates: [
          { name: '零食饮料', desc: '休闲零食' },
          { name: '茶叶销售', desc: '茶叶茗茶' },
          { name: '生鲜食品', desc: '生鲜蔬果' }
        ]
      },
      {
        name: '百货商场',
        qualification: '小程序主体《营业执照》、3家专柜或品牌租户的《食品经营许可证》、3张外立面照片、3张场内实际经营照片、包含至少3种品类的发票、《承诺函》',
        scope: '有线下大型实体的百货商场、购物中心提供服饰、化妆品、食品等服务。',
        templates: [
          { name: '购物中心', desc: '综合购物' },
          { name: '品牌专柜', desc: '品牌商品' }
        ]
      },
      {
        name: '生鲜果蔬',
        qualification: '《企业营业执照》（经营范围须含"初级食用农产品"相关',
        scope: '提供初级食用农产品（如：蔬菜、水果、生鲜肉类等）在线销售及配送相关服务。',
        templates: [
          { name: '生鲜配送', desc: '蔬菜水果' },
          { name: '肉类配送', desc: '鲜肉禽蛋' }
        ]
      },
      {
        name: '酒类',
        qualification: '（3选1）1、酒：《食品生产许可证》（经营项目需包含酒类）/《食品经营许可证》（含"预包装食品销售"）2、仅销售预包装食品提供：《预包装食品销售备案凭证》3、口岸商店提供：《国境口岸卫生许可证》',
        scope: '提供酒在线销售配送或预购自提等服务。',
        templates: [
          { name: '白酒销售', desc: '白酒' },
          { name: '红酒销售', desc: '红酒' },
          { name: '啤酒销售', desc: '啤酒' }
        ]
      }
    ]
  },

  // ==================== 旅游服务 ====================
  {
    name: '旅游服务',
    secondLevel: [
      {
        name: '景区服务',
        qualification: '',
        scope: '提供景区服务中心、景点推荐、导游、景点/公园门票等服务。',
        templates: [
          { name: '景点门票', desc: '景区门票' },
          { name: '导游服务', desc: '导游讲解' }
        ]
      },
      {
        name: '旅行社',
        qualification: '《旅行社业务经营许可证》',
        scope: '旅行社提供相关服务。',
        templates: [
          { name: '国内旅游', desc: '国内游' },
          { name: '出境旅游', desc: '出境游' }
        ]
      },
      {
        name: '住宿服务',
        qualification: '（2选1）1、单家主体：《营业执照》（经营范围含住宿、旅店业、客房等与住宿相关）或《特种行业许可证》（经营范围含"旅馆业"）2、预订平台：需提供至少2家及以上与住宿服务提供方的《合作协议》及合作方的《特种行业许可证》/《营业执照》',
        scope: '提供公寓/民宿/酒店预订等服务。',
        templates: [
          { name: '酒店预订', desc: '酒店宾馆' },
          { name: '民宿预订', desc: '民宿短租' },
          { name: '公寓出租', desc: '长租公寓' }
        ]
      },
      {
        name: '签证办理',
        qualification: '',
        scope: '提供出境签证办理等服务。',
        templates: [
          { name: '签证代办', desc: '签证服务' }
        ]
      }
    ]
  },

  // ==================== 工具 ====================
  {
    name: '工具',
    secondLevel: [
      {
        name: '记账',
        qualification: '',
        scope: '提供价格记录、生活开销等模板功能的记账工具。',
        templates: [
          { name: '消费记账', desc: '日常记账' },
          { name: '专业记账', desc: '财务记录' }
        ]
      },
      {
        name: '日历',
        qualification: '',
        scope: '提供日历等服务。',
        templates: [
          { name: '万年历', desc: '日历查询' },
          { name: '节假日', desc: '节假日提醒' }
        ]
      },
      {
        name: '天气',
        qualification: '',
        scope: '提供天气查询等服务。',
        templates: [
          { name: '天气预报', desc: '天气查询' },
          { name: '空气质量', desc: '空气质量' }
        ]
      },
      {
        name: '计算器',
        qualification: '',
        scope: '提供计算工具等服务。',
        templates: [
          { name: '标准计算器', desc: '基础计算' },
          { name: '房贷计算', desc: '房贷计算' }
        ]
      },
      {
        name: '预约/报名',
        qualification: '',
        scope: '提供预约/报名功能等服务。',
        templates: [
          { name: '在线预约', desc: '服务预约' },
          { name: '活动报名', desc: '活动报名' }
        ]
      },
      {
        name: '健康管理',
        qualification: '',
        scope: '记录/测试与健康相关内容，如：身高、体重、个人身体管理记录等服务。',
        templates: [
          { name: '运动健身', desc: '健身记录' },
          { name: '体重管理', desc: '体重记录' }
        ]
      }
    ]
  },

  // ==================== IT科技 ====================
  {
    name: 'IT科技',
    secondLevel: [
      {
        name: '基础电信运营商',
        qualification: '《基础电信业务经营许可证》',
        scope: '基础电信运营商及其分/子公司提供网上营业厅、话费充值、网费缴纳、客户服务等服务。',
        templates: [
          { name: '话费充值', desc: '话费充值' },
          { name: '流量套餐', desc: '流量办理' }
        ]
      },
      {
        name: '电信业务代理商',
        qualification: '与市级及以上运营商签署的合作协议（2家及以上）等',
        scope: '提供网上营业厅流量套餐购买、话费充值、网费缴纳、宽带办理、客户服务等服务。',
        templates: [
          { name: '代理营业厅', desc: '运营商业务' }
        ]
      }
    ]
  },

  // ==================== 体育 ====================
  {
    name: '体育',
    secondLevel: [
      {
        name: '体育场馆服务',
        qualification: '',
        scope: '提供体育场馆预订等服务。',
        templates: [
          { name: '场馆预订', desc: '场地预订' },
          { name: '体育培训', desc: '运动培训' }
        ]
      },
      {
        name: '在线健身',
        qualification: '',
        scope: '提供各类型的健身运动在线学习/在线指导等服务。',
        templates: [
          { name: '健身课程', desc: '健身指导' },
          { name: '运动打卡', desc: '运动记录' }
        ]
      },
      {
        name: '体育赛事',
        qualification: '（2选1）1、赛事主办方/承办方：赛事活动审批许可或其他相关主办/承办材料证明2、赛事代理方：授权/合作协议',
        scope: '提供体育赛事（如：篮球赛、网球赛等）、电子竞技赛票务销售等服务。',
        templates: [
          { name: '赛事报名', desc: '赛事报名' },
          { name: '赛事票务', desc: '门票销售' }
        ]
      }
    ]
  },

  // ==================== 房地产服务 ====================
  {
    name: '房地产服务',
    secondLevel: [
      {
        name: '房屋中介',
        qualification: '',
        scope: '提供租房、新房、二手房等房源信息展示、咨询、预约等服务。注：暂不支持房产在线交易。',
        templates: [
          { name: '二手房', desc: '二手房交易' },
          { name: '新房', desc: '新楼盘' },
          { name: '租房', desc: '房屋租赁' }
        ]
      },
      {
        name: '物业管理',
        qualification: '',
        scope: '提供房屋物业费用缴纳，物业资讯、门禁、访客等。',
        templates: [
          { name: '物业缴费', desc: '物业费缴纳' },
          { name: '访客系统', desc: '访客管理' }
        ]
      },
      {
        name: '房屋装修',
        qualification: '',
        scope: '提供家居建材装修资讯、在线预约、人工咨询等服务。',
        templates: [
          { name: '装修设计', desc: '装修方案' },
          { name: '建材采购', desc: '建材购买' }
        ]
      }
    ]
  },

  // ==================== 资讯 ====================
  {
    name: '资讯',
    secondLevel: [
      {
        name: '信息资讯',
        qualification: '',
        scope: '提供娱乐、美妆、餐饮等单一行业资讯展示等服务。注：如提供两个及以上行业资讯相关服务，需选择【文娱-资讯广场】类目。',
        templates: [
          { name: '美食资讯', desc: '美食推荐' },
          { name: '时尚资讯', desc: '时尚前沿' }
        ]
      }
    ]
  },

  // ==================== 8. 生活服务 ====================
  {
    name: '生活服务',
    secondLevel: [
      {
        name: '家政服务',
        qualification: '',
        scope: '提供家政服务，如保姆、月嫂、房屋保洁、家电维修、数码电器维修等在线预约等服务。',
        templates: [
          { name: '保洁服务', desc: '家庭保洁' },
          { name: '维修服务', desc: '家电维修' },
          { name: '保姆月嫂', desc: '母婴护理' }
        ]
      },
      {
        name: '美容美发',
        qualification: '',
        scope: '提供美甲、美容、美睫、美发、纹身等不含医疗美容服务。',
        templates: [
          { name: '美发沙龙', desc: '美发造型' },
          { name: '美容护肤', desc: '美容护理' },
          { name: '美甲美睫', desc: '美甲服务' }
        ]
      },
      {
        name: '婚庆服务',
        qualification: '',
        scope: '提供婚礼庆典策划、婚纱摄影、婚宴酒席、婚礼摄像、蜜月旅行等相关服务。',
        templates: [
          { name: '婚纱摄影', desc: '婚纱照' },
          { name: '婚庆策划', desc: '婚礼策划' }
        ]
      },
      {
        name: '搬家服务',
        qualification: '',
        scope: '提供搬家、货运等服务。',
        templates: [
          { name: '搬家服务', desc: '搬家运输' },
          { name: '货运物流', desc: '货物配送' }
        ]
      }
    ]
  },

  // ==================== 9. IT科技 ====================
  {
    name: 'IT科技',
    secondLevel: [
      {
        name: '基础电信运营商',
        qualification: '《基础电信业务经营许可证》',
        scope: '基础电信运营商及其分/子公司提供网上营业厅、话费充值、网费缴纳、客户服务等服务。',
        templates: [
          { name: '话费充值', desc: '话费充值' },
          { name: '流量套餐', desc: '流量办理' }
        ]
      },
      {
        name: '电信业务代理商',
        qualification: '与市级及以上运营商签署的合作协议（2家及以上）等',
        scope: '提供网上营业厅流量套餐购买、话费充值、网费缴纳、宽带办理、客户服务等服务。',
        templates: [
          { name: '代理营业厅', desc: '运营商业务' }
        ]
      },
      {
        name: '音视频设备',
        qualification: '《中国国家强制性产品认证证书》',
        scope: '适用于提供音视频设备、信息技术设备、电信终端设备等线下硬件在线销售及服务。',
        templates: [
          { name: '音响设备', desc: '影音设备' },
          { name: '智能设备', desc: '智能家居' }
        ]
      }
    ]
  },

  // ==================== 10. 餐饮服务 ====================
  {
    name: '餐饮服务',
    secondLevel: [
      {
        name: '餐厅排队',
        qualification: '',
        scope: '提供个体餐饮门店提供就餐线上取号、排号等排队服务。注：不包含线上点餐、外卖等服务。',
        templates: [
          { name: '快餐店', desc: '连锁快餐' },
          { name: '火锅店', desc: '火锅烧烤' },
          { name: '小吃快餐', desc: '地方小吃' },
          { name: '自助餐', desc: '自助用餐' }
        ]
      },
      {
        name: '外卖点餐',
        qualification: '餐饮门店主体营业执照、门店可以从事餐饮服务的证件、线下门店照片',
        scope: '餐饮场所/点餐平台/外卖平台提供的点餐、外卖服务。',
        templates: [
          { name: '生鲜配送', desc: '蔬菜水果' },
          { name: '饮品外卖', desc: '奶茶咖啡' }
        ]
      }
    ]
  },

  // ==================== 11. 旅游服务 ====================
  {
    name: '旅游服务',
    secondLevel: [
      {
        name: '景区服务',
        qualification: '',
        scope: '提供景区服务中心、景点推荐、导游、景点/公园门票等服务。',
        templates: [
          { name: '景点门票', desc: '景区门票' },
          { name: '导游服务', desc: '导游讲解' }
        ]
      },
      {
        name: '旅行社',
        qualification: '《旅行社业务经营许可证》',
        scope: '旅行社提供相关服务。',
        templates: [
          { name: '国内旅游', desc: '国内游' },
          { name: '出境旅游', desc: '出境游' }
        ]
      },
      {
        name: '住宿服务',
        qualification: '（2选1）1、单家主体：《营业执照》（经营范围含住宿、旅店业、客房等与住宿相关）或《特种行业许可证》（经营范围含"旅馆业"）2、预订平台：需提供至少2家及以上与住宿服务提供方的《合作协议》及合作方的《特种行业许可证》/《营业执照》',
        scope: '提供公寓/民宿/酒店预订等服务。',
        templates: [
          { name: '酒店预订', desc: '酒店宾馆' },
          { name: '民宿预订', desc: '民宿短租' },
          { name: '公寓出租', desc: '长租公寓' }
        ]
      },
      {
        name: '签证办理',
        qualification: '',
        scope: '提供出境签证办理等服务。',
        templates: [
          { name: '签证代办', desc: '签证服务' }
        ]
      }
    ]
  },

  // ==================== 12. 时政信息 ====================
  {
    name: '时政信息',
    secondLevel: [
      {
        name: '政务资讯',
        qualification: '',
        scope: '提供政务新闻、政策解读等信息服务。',
        templates: [
          { name: '政务发布', desc: '政策信息' },
          { name: '新闻资讯', desc: '时政新闻' }
        ]
      }
    ]
  },

  // ==================== 13. 文娱 ====================
  {
    name: '文娱',
    secondLevel: [
      {
        name: '娱乐内容',
        qualification: '',
        scope: '提供娱乐、文化等内容服务。',
        templates: [
          { name: '视频娱乐', desc: '视频内容' },
          { name: '音乐音频', desc: '音频服务' }
        ]
      }
    ]
  },

  // ==================== 14. 工具 ====================
  {
    name: '工具',
    secondLevel: [
      {
        name: '记账',
        qualification: '',
        scope: '提供价格记录、生活开销等模板功能的记账工具。',
        templates: [
          { name: '消费记账', desc: '日常记账' },
          { name: '专业记账', desc: '财务记录' }
        ]
      },
      {
        name: '日历',
        qualification: '',
        scope: '提供日历等服务。',
        templates: [
          { name: '万年历', desc: '日历查询' },
          { name: '节假日', desc: '节假日提醒' }
        ]
      },
      {
        name: '天气',
        qualification: '',
        scope: '提供天气查询等服务。',
        templates: [
          { name: '天气预报', desc: '天气查询' },
          { name: '空气质量', desc: '空气质量' }
        ]
      },
      {
        name: '计算器',
        qualification: '',
        scope: '提供计算工具等服务。',
        templates: [
          { name: '标准计算器', desc: '基础计算' },
          { name: '房贷计算', desc: '房贷计算' }
        ]
      },
      {
        name: '预约/报名',
        qualification: '',
        scope: '提供预约/报名功能等服务。',
        templates: [
          { name: '在线预约', desc: '服务预约' },
          { name: '活动报名', desc: '活动报名' }
        ]
      },
      {
        name: '健康管理',
        qualification: '',
        scope: '记录/测试与健康相关内容，如：身高、体重、个人身体管理记录等服务。',
        templates: [
          { name: '运动健身', desc: '健身记录' },
          { name: '体重管理', desc: '体重记录' }
        ]
      },
      {
        name: '投票',
        qualification: '',
        scope: '提供投票等服务。',
        templates: [
          { name: '在线投票', desc: '投票评选' }
        ]
      },
      {
        name: '备忘录',
        qualification: '',
        scope: '提供待办事项记录功能服务。',
        templates: [
          { name: '备忘录', desc: '记事提醒' }
        ]
      }
    ]
  },

  // ==================== 15. 电商平台 ====================
  {
    name: '电商平台',
    secondLevel: [
      {
        name: '食品饮料',
        qualification: '（4选1）1.《食品经营许可证》2.《食品生产许可证》3. 仅销售预包装食品提供：《预包装食品销售备案凭证》4. 口岸商店提供：《国境口岸卫生许可证》',
        scope: '提供食品、饮料、茶叶、零食、调料等产品在线销售及配送相关服务。',
        templates: [
          { name: '零食饮料', desc: '休闲零食' },
          { name: '茶叶销售', desc: '茶叶茗茶' },
          { name: '生鲜食品', desc: '生鲜蔬果' }
        ]
      },
      {
        name: '百货商场',
        qualification: '小程序主体《营业执照》、3家专柜或品牌租户的《食品经营许可证》、3张外立面照片、3张场内实际经营照片、包含至少3种品类的发票、《承诺函》',
        scope: '有线下大型实体的百货商场、购物中心提供服饰、化妆品、食品等服务。',
        templates: [
          { name: '购物中心', desc: '综合购物' },
          { name: '品牌专柜', desc: '品牌商品' }
        ]
      },
      {
        name: '生鲜果蔬',
        qualification: '《企业营业执照》（经营范围须含"初级食用农产品"相关',
        scope: '提供初级食用农产品（如：蔬菜、水果、生鲜肉类等）在线销售及配送相关服务。',
        templates: [
          { name: '生鲜配送', desc: '蔬菜水果' },
          { name: '肉类配送', desc: '鲜肉禽蛋' }
        ]
      },
      {
        name: '酒类',
        qualification: '（3选1）1、酒：《食品生产许可证》（经营项目需包含酒类）/《食品经营许可证》（含"预包装食品销售"）2、仅销售预包装食品提供：《预包装食品销售备案凭证》3、口岸商店提供：《国境口岸卫生许可证》',
        scope: '提供酒在线销售配送或预购自提等服务。',
        templates: [
          { name: '白酒销售', desc: '白酒' },
          { name: '红酒销售', desc: '红酒' },
          { name: '啤酒销售', desc: '啤酒' }
        ]
      }
    ]
  },

  // ==================== 16. 商家自营 ====================
  {
    name: '商家自营',
    secondLevel: [
      {
        name: '母婴食品',
        qualification: '（4选1）1、《食品经营许可证》2、《食品生产许可证》3、仅销售预包装食品提供：《预包装食品销售备案凭证》4、口岸商店提供：《国境口岸卫生许可证》',
        scope: '提供婴幼儿奶粉、辅食等在线销售及配送。',
        templates: [
          { name: '奶粉销售', desc: '婴幼儿奶粉' },
          { name: '辅食销售', desc: '婴幼儿辅食' }
        ]
      },
      {
        name: '保健品',
        qualification: '（4选1）1、《国产保健食品批准证书》2、《进口保健食品批准证书》3、《食品经营许可证》（经营项目须包含保健食品销售）4、仅销售预包装食品提供：《预包装食品销售备案凭证》',
        scope: '提供保健食品在线销售及配送。',
        templates: [
          { name: '维康保健', desc: '营养补充' },
          { name: '中医养生', desc: '养生保健' }
        ]
      },
      {
        name: '成人用品',
        qualification: '医疗器械类：《营业执照》（含成人用品或避孕套或计生用品）；情趣用品：《营业执照》（含成人情趣用品销售）',
        scope: '提供成人用品在线销售。',
        templates: [
          { name: '成人用品', desc: '成人用品' }
        ]
      },
      {
        name: '图书报刊',
        qualification: '批发：省级《出版物经营许可证》；零售：县（区）级《出版物经营许可证》',
        scope: '提供图书、报纸、期刊等在线销售。',
        templates: [
          { name: '图书销售', desc: '图书教材' },
          { name: '报刊订阅', desc: '报纸杂志' }
        ]
      },
      {
        name: '个护家清',
        qualification: '',
        scope: '提供个人护理、家庭清洁用品等在线销售。',
        templates: [
          { name: '个护用品', desc: '个人护理' },
          { name: '家清用品', desc: '家庭清洁' }
        ]
      },
      {
        name: '美妆',
        qualification: '',
        scope: '提供化妆品、护肤品等在线销售。',
        templates: [
          { name: '护肤彩妆', desc: '护肤彩妆' },
          { name: '香水香氛', desc: '香水香氛' }
        ]
      },
      {
        name: '3C数码',
        qualification: '',
        scope: '提供3C数码产品在线销售。',
        templates: [
          { name: '手机数码', desc: '手机数码' },
          { name: '电脑办公', desc: '电脑配件' }
        ]
      },
      {
        name: '运动户外',
        qualification: '',
        scope: '提供运动、户外用品等在线销售。',
        templates: [
          { name: '运动装备', desc: '运动用品' },
          { name: '户外装备', desc: '户外用品' }
        ]
      },
      {
        name: '家居家纺',
        qualification: '',
        scope: '提供家居、家纺用品等在线销售。',
        templates: [
          { name: '家居用品', desc: '家居装饰' },
          { name: '家纺床品', desc: '床品家纺' }
        ]
      }
    ]
  },

  // ==================== 17. 商业服务 ====================
  {
    name: '商业服务',
    secondLevel: [
      {
        name: '企业服务',
        qualification: '',
        scope: '提供企业办公工具/办公管理、门店信息管理、展示等服务。',
        templates: [
          { name: '企业管理', desc: '办公管理' },
          { name: '会展服务', desc: '商业会展' }
        ]
      },
      {
        name: '广告设计',
        qualification: '',
        scope: '提供商业广告、产品设计等相关等服务。',
        templates: [
          { name: '广告推广', desc: '广告营销' },
          { name: '设计服务', desc: '创意设计' }
        ]
      }
    ]
  },

  // ==================== 18. 公益 ====================
  {
    name: '公益',
    secondLevel: [
      {
        name: '公益服务',
        qualification: '',
        scope: '提供公益、慈善等相关服务。',
        templates: [
          { name: '公益捐赠', desc: '慈善捐赠' },
          { name: '志愿服务', desc: '志愿活动' }
        ]
      }
    ]
  },

  // ==================== 19. 社交 ====================
  {
    name: '社交',
    secondLevel: [
      {
        name: '社区服务',
        qualification: '',
        scope: '提供社区交流、论坛等服务。',
        templates: [
          { name: '社区论坛', desc: '社区交流' },
          { name: '兴趣圈子', desc: '兴趣社群' }
        ]
      }
    ]
  },

  // ==================== 20. 体育 ====================
  {
    name: '体育',
    secondLevel: [
      {
        name: '体育场馆服务',
        qualification: '',
        scope: '提供体育场馆预订等服务。',
        templates: [
          { name: '场馆预订', desc: '场地预订' },
          { name: '体育培训', desc: '运动培训' }
        ]
      },
      {
        name: '在线健身',
        qualification: '',
        scope: '提供各类型的健身运动在线学习/在线指导等服务。',
        templates: [
          { name: '健身课程', desc: '健身指导' },
          { name: '运动打卡', desc: '运动记录' }
        ]
      },
      {
        name: '体育赛事',
        qualification: '（2选1）1、赛事主办方/承办方：赛事活动审批许可或其他相关主办/承办材料证明2、赛事代理方：授权/合作协议',
        scope: '提供体育赛事（如：篮球赛、网球赛等）、电子竞技赛票务销售等服务。',
        templates: [
          { name: '赛事报名', desc: '赛事报名' },
          { name: '赛事票务', desc: '门票销售' }
        ]
      }
    ]
  },

  // ==================== 21. 汽车服务 ====================
  {
    name: '汽车服务',
    secondLevel: [
      {
        name: '汽车养护',
        qualification: '',
        scope: '提供汽车维修/汽车美容/汽车养护等服务。',
        templates: [
          { name: '汽车维修', desc: '维修保养' },
          { name: '汽车美容', desc: '洗车美容' }
        ]
      },
      {
        name: '汽车销售',
        qualification: '',
        scope: '提供汽车经销商/4S店/汽车厂商提供的汽车服务等。',
        templates: [
          { name: '4S店', desc: '汽车销售' },
          { name: '二手车', desc: '二手车交易' }
        ]
      }
    ]
  },

  // ==================== 22. 资讯 ====================
  {
    name: '资讯',
    secondLevel: [
      {
        name: '信息资讯',
        qualification: '',
        scope: '提供娱乐、美妆、餐饮等单一行业资讯展示等服务。注：如提供两个及以上行业资讯相关服务，需选择【文娱-资讯广场】类目。',
        templates: [
          { name: '美食资讯', desc: '美食推荐' },
          { name: '时尚资讯', desc: '时尚前沿' }
        ]
      }
    ]
  },

  // ==================== 23. 深度合成 ====================
  {
    name: '深度合成',
    secondLevel: [
      {
        name: 'AI服务',
        qualification: '',
        scope: '提供AI相关的深度合成服务。',
        templates: [
          { name: 'AI工具', desc: '人工智能' },
          { name: 'AI创作', desc: 'AI生成' }
        ]
      }
    ]
  },

  // ==================== 24. 内测 ====================
  {
    name: '内测',
    secondLevel: [
      {
        name: '数字藏品',
        qualification: '该类目正在内测阶段',
        scope: '适用于数字藏品展示和一级赠送等服务。',
        templates: [
          { name: '数字藏品', desc: 'NFT展示' }
        ]
      }
    ]
  }
]

// 导出默认数据
export default categoryData
