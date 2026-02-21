/**
 * 微信小程序服务类目数据（按主体类型分类）
 * 整理自微信开放文档
 * 更新时间：2026-02-08
 */

// 三级类目模板
export interface TemplateInfo {
  name: string
  desc: string
}

// 二级类目
export interface SecondLevelCategory {
  name: string
  qualification?: string
  scope?: string
  restrictions?: string
  templates: TemplateInfo[]
  supportedTypes?: EntityType[] // 支持的主体类型
}

// 一级类目
export interface FirstLevelCategory {
  name: string
  hasData?: boolean
  secondLevel: SecondLevelCategory[]
  supportedEntityTypes?: EntityType[] // 支持的主体类型
  id?: number // 唯一ID
}

// 主体类型
export enum EntityType {
  COMPANY = 'company',
  PERSONAL = 'personal',
  OVERSEAS = 'overseas'
}

// 企业类目（24个一级类目，完整版，包含所有二级类目及详细资质）
export const companyCategories: FirstLevelCategory[] = [
  {
    name: '物流服务',
    hasData: true,
    secondLevel: [
      { name: '收件/派件', qualification: '（3选1）', scope: '适用于快递行业，提供寄件、收件等服务。', templates: [{ name: '收发件管理系统', desc: '订单管理、路线规划' }] },
      { name: '查件', scope: '适用于快递、物流行业的查件等服务。', templates: [{ name: '快递查件小程序', desc: '实时查询、多平台支持' }] },
      { name: '邮政', scope: '适用于邮政部门主体，提供邮政业务相关服务。', templates: [] },
      { name: '装卸搬运', scope: '适用于物流设施内的装卸搬运业务。', templates: [] },
      { name: '仓储管理', scope: '适用于提供仓储管理、云仓、物品入库保管等。', templates: [] },
      { name: '快递柜', scope: '适用于提供收、发快递/包裹等服务的智能终端设备。', templates: [] },
      { name: '货物运输', qualification: '（4选1）', scope: '适用于货物运输、大宗物流等服务。', templates: [] }
    ]
  },
  {
    name: '教育服务',
    hasData: true,
    secondLevel: [
      { name: '学历教育（培训机构）', qualification: '同时提供：1、区、县级教育部门颁发的《民办学校办学许可证》2、《营业执照》或《事业单位法人证书》或《民办非企业单位登记证书》', scope: '适用于有线下教学场景的教育培训机构。', templates: [{ name: '职业技能培训', desc: '课程学习、考试测评' }] },
      { name: '学历教育（学校）', qualification: '（2选1）：1、公立学校：由教育行政部门出具的审批设立证明或《事业单位法人证书》2、私立学校：《民办学校办学许可证》', scope: '适用于幼儿园、小学、初高中、大学提供学历教育相关服务。', templates: [] },
      { name: '驾校培训', qualification: '《机动车驾驶员培训备案》', scope: '适用于提供驾校在线付费培训等服务。', templates: [] },
      { name: '驾校平台', qualification: '同时提供：1、两家或以上的驾校培训公司的合作协议2、驾校培训机构的《机动车驾驶员培训备案》3、《小程序开发者承诺函》', scope: '适用于为驾校主体提供入驻渠道。', templates: [] },
      { name: '教育平台', qualification: '（2选1）', scope: '适用于为学历教育、成人教育的培训机构提供入驻渠道。', templates: [] },
      { name: '无人机驾驶员培训机构', qualification: '同时提供：1、《民用无人机驾驶员训练机构合格证》2、申请主体在《民用无人驾驶航空器综合管理平台》培训机构名单查询截图', scope: '适用于提供民用无人机驾驶员培训机构在线付费培训。', templates: [] },
      { name: '无人机驾驶员培训平台', qualification: '同时提供多项资质', scope: '适用于为民用无人机驾驶员培训机构提供入驻渠道。', templates: [] },
      { name: '急救培训机构', qualification: '（3选1）', scope: '适用于急救培训机构提供开展急救知识普及和救护员培训。', templates: [] },
      { name: '校园缴费', qualification: '（2选1）', scope: '适用于提供校园生活费用缴纳。', templates: [] },
      { name: '职业技能鉴定', qualification: '人社部门的授权或相关备案文件', scope: '适用于提供职业资格鉴定、职业技能证书查询。', templates: [] },
      { name: '素质教育', scope: '适用于艺术培训、语言培训等。', templates: [] },
      { name: '婴幼儿教育', scope: '适用于0～6岁年龄阶段的婴幼儿教育。', templates: [{ name: '婴幼儿教育平台', desc: '启蒙教育、亲子互动' }] },
      { name: '教育装备', scope: '适用于教育教学活动所需的教具、学具、器材。', templates: [] },
      { name: '出国留学', scope: '适用于境外教育咨询、手续办理。', templates: [] },
      { name: '特殊人群教育', scope: '适用于特殊人群等方面相关的教育。', templates: [] },
      { name: '在线视频课程', qualification: '（5选1）', scope: '适用于教育行业提供网课、在线培训、讲座等。', templates: [{ name: '在线培训平台', desc: '直播授课、课程管理' }] }
    ]
  },
  {
    name: '医疗服务',
    hasData: true,
    secondLevel: [
      { name: '公立医疗机构', qualification: '同时提供：1、《医疗机构执业许可证》2、《事业单位法人证书》', scope: '适用于公立医疗机构提供的就医、健康咨询/问诊。', templates: [] },
      { name: '三级私立医疗机构', qualification: '《医疗机构执业许可证》', scope: '适用于三级私立医疗机构提供的就医、健康咨询/问诊。', templates: [] },
      { name: '其他私立医疗机构', qualification: '（3选1）', scope: '适用于二级及以下私立医疗机构。', templates: [] },
      { name: '就医服务', qualification: '（3选1）', scope: '适用于提供医疗报告单查询、在线挂号、在线医疗费缴纳等。', templates: [] },
      { name: '跨境医生服务（港澳）', qualification: '（2选1）', scope: '适用于在境内执业的港澳医生提供预约挂号、在线问诊相关服务。', templates: [] },
      { name: '其他医学健康服务', qualification: '（4选1）', scope: '适用于非医疗级别检测服务，如运动检测、营养检测等。', templates: [] },
      { name: '药品（非处方药）销售', qualification: '（3选1）', scope: '适用于非处方药的在线交易、展示等服务。', templates: [] },
      { name: '上门医疗', qualification: '（2选1）', scope: '适用于为多家医疗机构主体提供当地上门基础医疗护理服务的平台。', templates: [] },
      { name: '处方药服务', qualification: '（3选1）', scope: '适用于提供处方药在线预约、配送等业务。', templates: [] },
      { name: '非处方药销售平台', qualification: '同时提供：1、《互联网药品信息服务资格证》或《药品、医疗器械互联网信息服务备案凭证》2、《药品网络交易服务第三方平台备案凭证》', scope: '适用于平台型的非处方药在线交易、展示等服务。', templates: [] },
      { name: '医疗器械信息展示', qualification: '（2选1）', scope: '适用于医疗器械信息的展示等服务。', templates: [] },
      { name: '药品信息展示', qualification: '（2选1）', scope: '适用于药品信息的展示等服务。', templates: [] },
      { name: '医疗器械生产企业', qualification: '《医疗器械生产许可证》', scope: '适用于医疗器械生产业务及展示等服务。', templates: [] },
      { name: '医疗器械自营', qualification: '同时提供多项资质', scope: '适用于医疗器械的在线经营和出租、销售业务及展示等服务。', templates: [] },
      { name: '医疗器械经营销售平台', qualification: '同时提供多项资质', scope: '适用于为医疗器械销售商家提供入驻服务的平台。', templates: [] },
      { name: '互联网医院', qualification: '（2选1）', scope: '适用于互联网医院主体/医疗服务平台提供在线看诊、疾病咨询等线上医疗服务。', templates: [{ name: '互联网医院平台', desc: '在线问诊、电子处方' }] },
      { name: '血液、干细胞服务', qualification: '（3选1）', scope: '适用于采集、存储血液和干细胞存储等服务。', templates: [] },
      { name: '临床试验', qualification: '（4选1）', scope: '适用于提供临床试验信息及试验患者招募。', templates: [] }
    ]
  },
  {
    name: '政务民生',
    hasData: true,
    secondLevel: [
      { name: '交通违法', qualification: '（2选1）', scope: '适用于提供机动车违法、驾驶人违法、交通违法举报、交通违法办理、交通违法查询等。', templates: [] },
      { name: '水电', qualification: '（2选1）', scope: '适用于管理水能资源、电力资源的行政机关或经营水能、电能的企业。', templates: [] },
      { name: '城市道路', qualification: '（2选1）', scope: '适用于提供交通限行、市内路况等。', templates: [] },
      { name: '户政', qualification: '（2选1）', scope: '适用于提供身份证、户口预约、办理等。', templates: [] },
      { name: '治安', qualification: '（2选1）', scope: '适用于提供治安管理、治安举报等。', templates: [] },
      { name: '出入境', qualification: '（2选1）', scope: '适用于提供办理、预约、查询出入境业务，港澳再次签注、因私出国护照等。', templates: [] },
      { name: '边防', qualification: '（2选1）', scope: '适用于边防单位提供相关业务。', templates: [] },
      { name: '国安', qualification: '（2选1）', scope: '适用于国安单位提供相关业务。', templates: [] },
      { name: '司法', qualification: '（2选1）', scope: '适用于司法单位提供司法政务相关业务。', templates: [] },
      { name: '检察', qualification: '（2选1）', scope: '适用于检察院提供相关业务。', templates: [] },
      { name: '法院', qualification: '（2选1）', scope: '适用于法院提供相关业务。', templates: [] },
      { name: '纪检审计', qualification: '（2选1）', scope: '适用于纪检审计单位提供相关业务。', templates: [] },
      { name: '财政', qualification: '（2选1）', scope: '适用于财政单位提供相关业务。', templates: [] },
      { name: '民政', qualification: '（2选1）', scope: '适用于民政单位提供婚姻业务、社会救助、老龄服务、应急救灾等业务。', templates: [] },
      { name: '住建', qualification: '（2选1）', scope: '适用于住建单位提供住房、保障房等业务。', templates: [] },
      { name: '公积金', qualification: '（2选1）', scope: '适用于公积金中心提供查询、预约、办理公积金等相关业务。', templates: [] },
      { name: '党/团/组织', qualification: '（2选1）', scope: '适用于共产党、共青团、团工委等党团组织提供相关业务。', templates: [] },
      { name: '教育', qualification: '（2选1）', scope: '适用于教育单位提供教育政策信息、学历报名考试、分数查询等业务。', templates: [] },
      { name: '人力资源', qualification: '（2选1）', scope: '适用于提供职业资格考试（面向在职）、人事档案、就业服务、劳动保障、积分政策等相关业务。', templates: [] },
      { name: '环保', qualification: '（2选1）', scope: '适用于环保单位提供相关业务。', templates: [] },
      { name: '气象', qualification: '（2选1）', scope: '适用于气象单位提供相关业务。', templates: [] },
      { name: '市场监督管理', qualification: '（2选1）', scope: '适用于市场监督管理部门提供相关业务。', templates: [] },
      { name: '医疗', qualification: '（2选1）', scope: '适用于医疗主管部门（如卫健委）提供医疗相关业务。', templates: [] },
      { name: '文化', qualification: '（2选1）', scope: '适用于文化部、厅、局等单位提供相关业务。', templates: [] },
      { name: '博物馆', qualification: '（2选1）', scope: '适用于博物馆管理单位提供相关业务。', templates: [] },
      { name: '体育', qualification: '（2选1）', scope: '适用于体育单位提供相关业务。', templates: [] },
      { name: '水利', qualification: '（2选1）', scope: '适用于水利单位提供相关业务。', templates: [] },
      { name: '食品监督管理', qualification: '（2选1）', scope: '适用于食品生产安全监督管理单位提供相关业务。', templates: [] },
      { name: '新闻出版及广电', qualification: '（2选1）', scope: '适用于新闻出版及广电局提供相关业务。', templates: [] },
      { name: '税务', qualification: '（2选1）', scope: '适用于税务管理机关提供相关业务。', templates: [] },
      { name: '知识产权', qualification: '（2选1）', scope: '适用于知识产权管理机关提供相关业务。', templates: [] },
      { name: '公共资源交易中心', qualification: '（2选1）', scope: '适用于公共资源交易中心单位提供相关业务。', templates: [] },
      { name: '自然资源和规划', qualification: '（2选1）', scope: '适用于自然资源和规划单位提供相关业务。', templates: [] },
      { name: '信访', qualification: '（2选1）', scope: '适用于信访单位提供相关业务。', templates: [] },
      { name: '城管', qualification: '（2选1）', scope: '适用于城管单位提供相关业务。', templates: [] },
      { name: '监狱戒毒', qualification: '（2选1）', scope: '适用于监狱戒毒单位提供相关业务。', templates: [] },
      { name: '海关', qualification: '（2选1）', scope: '适用于海关单位提供相关业务。', templates: [] },
      { name: '邮政', qualification: '（2选1）', scope: '适用于邮政单位提供相关业务。', templates: [] },
      { name: '检验检疫', qualification: '（2选1）', scope: '适用于检验检疫单位提供相关业务。', templates: [] },
      { name: '交管', qualification: '（2选1）', scope: '适用于交通管理机关提供政务相关业务。', templates: [] },
      { name: '商务', qualification: '（2选1）', scope: '适用于商务管理机关提供相关业务。', templates: [] },
      { name: '航空', qualification: '（2选1）', scope: '适用于民航管理机关提供相关业务。', templates: [] },
      { name: '街道居委', qualification: '（2选1）', scope: '适用于街道居委提供相关业务。', templates: [] },
      { name: '农林畜牧海洋', qualification: '（2选1）', scope: '适用于农林畜牧海洋等管理机关提供相关业务。', templates: [] },
      { name: '社科档案', qualification: '（2选1）', scope: '适用于社科档案单位提供相关业务。', templates: [] },
      { name: '应急', qualification: '（2选1）', scope: '适用于政府应急单位、应急管理部门提供相关业务。', templates: [] },
      { name: '科学技术与地质', qualification: '（2选1）', scope: '适用于科学技术与地质单位提供相关业务。', templates: [] },
      { name: '统计', qualification: '（2选1）', scope: '适用于统计单位提供相关业务。', templates: [] },
      { name: '经济发展与改革', qualification: '（2选1）', scope: '适用于经济发展与改革单位提供相关业务。', templates: [] },
      { name: '烟草管理', qualification: '《统一社会信用代码证》（主体为烟草局机构）', scope: '适用于烟草管理单位提供行政业务。', templates: [] },
      { name: '政务服务大厅', qualification: '（2选1）', scope: '适用于政务服务大厅提供相关业务。', templates: [{ name: '政务办事平台', desc: '办事指南、在线预约' }] },
      { name: '网信', qualification: '（2选1）', scope: '适用于网信单位提供相关业务。', templates: [] },
      { name: '健康数据统计', qualification: '（2选1）', scope: '适用于如健康码/通行证等健康数据的收集、整理、上报相关服务。', templates: [] },
      { name: '金融', qualification: '（2选1）', scope: '适用于金融管理单位提供金融相关业务。', templates: [] },
      { name: '工信', qualification: '（2选1）', scope: '适用于工信单位提供相关业务。', templates: [] },
      { name: '乡村振兴', qualification: '（2选1）', scope: '适用于乡村振兴单位提供相关业务。', templates: [] },
      { name: '社保', qualification: '（3选1）', scope: '适用于社保单位（如社保局）提供社保相关业务或银行提供金融功能社保卡业务。', templates: [] },
      { name: '医保', qualification: '（2选1）', scope: '适用于医保单位（如医保局）提供医保等相关业务。', templates: [] },
      { name: '交通运输', qualification: '（2选1）', scope: '适用于交通管理部门（如交通运输局等）提供交通相关业务。', templates: [] },
      { name: '祭扫', qualification: '需同时提供多项材料', scope: '适用于政府及相关事业单位（如殡仪馆）主体提供网络祭扫等服务。', templates: [] },
      { name: '信用', qualification: '（2选1）', scope: '适用于提供社会信用中心相关业务。', templates: [] },
      { name: '体育/福利彩票', qualification: '国家/地方彩票管理中心提供：《统一社会信用代码证》（机构类型为：机关）', scope: '适用于国家/地方彩票（发行）管理中心提供体育彩票/福利彩票查询，展示、线上选号等服务。', templates: [] }
    ]
  },
  {
    name: '金融业',
    hasData: true,
    secondLevel: [
      { name: '银行', qualification: '（2选1）', scope: '适用于银行机构主体提供银行业务在线服务或交易等服务。', templates: [{ name: '银行服务小程序', desc: '账户查询、转账汇款' }] },
      { name: '信托', qualification: '（2选1）', scope: '适用于提供信托理财业务在线服务或交易等服务。', templates: [] },
      { name: '金融资产管理', qualification: '（2选1）', scope: '适用于金融资产管理公司提供资产信息展示、收购、管理和处置等服务。', templates: [] },
      { name: '公募基金', qualification: '（5选1）', scope: '适用于提供公募基金信息展示、股票、债券等金融工具的投资服务等。', templates: [] },
      { name: '私募基金', qualification: '（3选1）', scope: '仅适用于私募基金展示、介绍、咨询等服务。', templates: [] },
      { name: '证券/期货', qualification: '《经营证券期货业务许可证》（经营范围须含"证券经纪""证券承销与保荐""证券自营""商品期货经纪""金融期货经纪"之一）', scope: '适用于提供证券资讯、证券咨询、证券期货经营等的在线服务。', templates: [] },
      { name: '证券/期货投资咨询', qualification: '《经营证券期货业务许可证》', scope: '适用于提供证券、期货投资等在线咨询服务。', templates: [] },
      { name: '非金融机构自营小额贷款', qualification: '（2选1）', scope: '适用于单家小额贷款主体进行的小额贷款相关服务。', templates: [] },
      { name: '贷款信息服务', qualification: '同时提供多项材料', scope: '适用于提供多家金融机构/非金融机构自营小额贷款主体的贷款信息服务。', templates: [] },
      { name: '融资担保', qualification: '《融资担保业务经营许可证》', scope: '适用于提供融资担保相关服务。', templates: [] },
      { name: '商业保理', qualification: '（2选1）', scope: '适用于提供商业保理等相关服务。', templates: [] },
      { name: '汽车金融/融资租赁', qualification: '（2选1）', scope: '适用于提供汽车金融、融资租赁等服务。', templates: [] },
      { name: '保险', qualification: '（3选1）', scope: '适用于提供保险业务在线服务或交易等服务。', templates: [{ name: '保险服务平台', desc: '产品展示、在线投保' }] },
      { name: '第三方互联网保险', qualification: '同时提供多项材料', scope: '适用于保险机构主体/保险中介机构主体/银行机构主体/非银行金融机构主体通过第三方网络平台开展互联网保险业务展示等服务。', templates: [] },
      { name: '企业征信', qualification: '同时提供多项材料', scope: '适用于银行或征信机构提供企业征信业务服务。', templates: [] },
      { name: '个人征信', qualification: '同时提供多项材料', scope: '适用于征信机构提供个人征信业务服务。', templates: [] },
      { name: '新三板信息服务平台', qualification: '全国中小企业股份转让系统有限责任公司的书面许可', scope: '适用于提供新三板信息行情资讯等服务。', templates: [] },
      { name: '股票信息服务平台（港股/美股）', scope: '适用于提供港股、美股行情资讯、行情分析等服务。', templates: [] },
      { name: '股票信息服务平台', qualification: '同时提供多项材料', scope: '适用于提供股票行情资讯、行情分析等服务。', templates: [] },
      { name: '外币兑换', qualification: '《个人本外币兑换特许业务经营许可证》', scope: '适用于提供小额外币兑换等服务的金融机构。', templates: [] },
      { name: '实物黄金买卖', qualification: '中国人民银行备案', scope: '适用于金融机构主体接受投资者委托，将受托的投资者财产投资于实物黄金或黄金产品的金融服务。', templates: [] },
      { name: '消费金融', qualification: '同时提供多项材料', scope: '适用于提供消费金融线上服务或交易等服务。', templates: [] },
      { name: '信用卡', qualification: '（2选1）', scope: '1、适用于银行主体提供信用卡发行、还款、查询等服务；2、适用于非银行主体提供信用卡还款、查询等服务。', templates: [] },
      { name: '收单商户服务', qualification: '（4选1）', scope: '适用于提供收单相关的商户经营管理等服务。', templates: [] },
      { name: '区域性交易市场', qualification: '同时提供多项材料', scope: '适用于区域性交易市场发行股票、债券相关服务。', templates: [] },
      { name: '电子汇票', qualification: '上海票据交易所批准并接入电子商业汇票系统的证明文件', scope: '适用于银行等金融机构提供的电票、贴现等相关服务。', templates: [] }
    ]
  },
  {
    name: '交通服务',
    hasData: true,
    secondLevel: [
      { name: '网约车', qualification: '（2选1）', scope: '适用于提供快车、专车或其他网约车在线预约/支付、出行交通行程信息展示等服务。', templates: [{ name: '网约车平台', desc: '实时叫车、路线规划' }] },
      { name: '顺风车/拼车', qualification: '（3选1）', scope: '适用于顺风车（拼车）拼车信息展示、呼叫或预约用车、在线支付等服务。', templates: [] },
      { name: '出租车', qualification: '（2选1）', scope: '适用于提供巡游出租车在线预约/呼叫/支付、出行交通行程信息展示等服务。', templates: [] },
      { name: '跨境车辆查验', qualification: '（2选1）', scope: '适用于为"粤车南下"提供专项车辆检验或手续代办（如：香港车牌制作）等服务。', templates: [] },
      { name: '跨境客运', qualification: '（2选1）', scope: '适用于提供大陆-港澳跨境出行的客运服务在线呼叫/预约用车/在线支付或客运船票销售等服务。', templates: [] },
      { name: '国际客运', qualification: '（2选1）', scope: '适用于提供中国-其他国家/地区的过境客运班车或客运船票销售等服务。', templates: [] },
      { name: '航空业务', qualification: '《通用航空经营许可证》', scope: '适用于通用航空企业提供载客类（如：通用航空包机/拼机飞行）、载人类、其他类经营性飞行等服务活动。', templates: [] },
      { name: '港口', qualification: '《港口经营许可证》', scope: '适用于集装箱堆放、上下船设施服务、货品包装、加工、委托运输等服务。', templates: [] },
      { name: '充电服务', scope: '适用于提供交通工具充电等资讯、预约、付费等服务。', templates: [] },
      { name: '航空代理', qualification: '同时提供多项材料', scope: '适用于航空代理主体提供在线购买机票、退票改签、在线值机、飞行体验、飞行培训相关等服务。', templates: [] },
      { name: '航司服务', qualification: '（2选1）', scope: '适用于航司主体提供在线购买机票、退票改签、在线值机、行李追踪提取、延航证明等服务。', templates: [] },
      { name: '机场服务', qualification: '《机场使用许可证》', scope: '适用于机场主体提供特殊旅客服务、贵宾室预约等服务。', templates: [] },
      { name: '无人驾驶顺风车/拼车', qualification: '同时提供多项材料', scope: '适用于提供无人驾驶顺风车/拼车在测试道路范围内的在线预约/呼叫、出行交通行程信息展示等服务。', templates: [] },
      { name: '互联网地图服务', qualification: '《测绘资质证书》（甲级，且专业范围包含互联网地图服务）', scope: '适用于为用户提供地图搜索、地理信息标注等定位信息通知服务。', templates: [] },
      { name: '导航地图', scope: '适用于提供出行交通路面状况查询、实时播报、预测等服务。', templates: [] },
      { name: '水运', scope: '适用于提供水上运输资讯查询、人工咨询服务、在线预约、在线购票等服务。', templates: [] },
      { name: '加油站服务', scope: '适用于提供交通工具加油等资讯、预约、付费等服务。', templates: [] },
      { name: '骑车', scope: '适用于提供非机动车共享交通工具服务，比如共享单车、共享电动车等服务。', templates: [] },
      { name: '高速服务', scope: '适用于提供高速导航、高速路况、收费站、服务区等服务。', templates: [] },
      { name: '火车/高铁/动车', scope: '适用于提供火车/高铁/动车资讯、车票预订等服务。', templates: [] },
      { name: '公交/地铁', scope: '适用于提供公交/地铁公司管理、公交/地铁查询、出行线路、车站服务设施查询、交通出行卡资讯、查询等服务。', templates: [] },
      { name: '长途汽车', scope: '适用于提供长途客运车票预定、购票、退票、出行资讯或人工服务等服务。', templates: [] },
      { name: '停车服务', scope: '适用于提供缴停车费、查询车位、找车导航等综合服务。', templates: [] },
      { name: '代驾服务', scope: '适用于提供代驾服务等。', templates: [{ name: '代驾服务小程序', desc: '一键呼叫、司机信息' }] },
      { name: '租车', scope: '适用于提供机动车租赁资讯、人工咨询、在线预约、在线下单、在线付费等服务。', templates: [] }
    ]
  },
  {
    name: '房地产服务',
    hasData: true,
    secondLevel: [
      { name: '房屋中介', scope: '适用于提供租房、新房、二手房等房源信息展示、咨询、预约等服务。', templates: [{ name: '租房平台小程序', desc: '房源搜索、在线签约' }] },
      { name: '物业管理', scope: '适用于提供房屋物业费用缴纳，物业资讯、门禁、访客等。', templates: [] },
      { name: '房屋装修', scope: '适用于提供家居建材装修资讯、在线预约、人工咨询等服务。', templates: [] },
      { name: '房地产营销', qualification: '（3选1）', scope: '适用于房地产开发商提供购房意向款、优惠券、权益券等营销活动。', templates: [] }
    ]
  },
  {
    name: '生活服务',
    hasData: true,
    secondLevel: [
      { name: '丽人服务', scope: '适用于美容美体机构，提供美甲、美容、美睫、美发、纹身、祛痘、纤体瘦身、舞蹈、瑜伽等服务。', templates: [
        { name: '美甲服务', desc: '美甲预约、款式展示' },
        { name: '美容服务', desc: '美容护理、项目管理' },
        { name: '美发沙龙', desc: '发型预约、造型师展示' }
      ] },
      { name: '宠物（非医院类）', scope: '适用于提供宠物美容预约、宠物资讯等服务。', templates: [] },
      { name: '宠物医院/兽医', qualification: '《动物诊疗许可证》', scope: '适用于宠物医院提供宠物、家禽治疗预约，在线问诊等服务。', templates: [] },
      { name: '宠物医疗服务平台', qualification: '需同时提供多项材料', scope: '适用于为多家宠物医院提供入驻服务的平台。', templates: [] },
      { name: '其他宠物健康服务', qualification: '（3选1）', scope: '适用于提供动物基因检测服务。', templates: [] },
      { name: '兽药', qualification: '（2选1）', scope: '适用于提供兽药等服务。', templates: [] },
      { name: '兽药平台', qualification: '同时提供多项材料', scope: '适用于为兽药销售商家提供入驻服务的平台。', templates: [] },
      { name: '求职/招聘', qualification: '《人力资源服务许可证》', scope: '适用于提供求职/招聘、专业人力资源等服务。', templates: [] },
      { name: '求职/招聘（涉外）', qualification: '同时提供多项材料', scope: '适用于提供对外劳务合作相关求职/招聘等服务。', templates: [] },
      { name: '婚庆服务', scope: '适用于提供婚礼庆典策划、婚纱摄影、婚宴酒席、婚礼摄像、蜜月旅行等婚庆类服务。', templates: [{ name: '婚庆策划平台', desc: '案例展示、在线咨询' }] },
      { name: '休闲娱乐', scope: '适用于提供营业性歌舞、游艺、KTV、院线影城、网吧、马戏团等娱乐、休闲娱乐类服务。', templates: [] },
      { name: '电子娱乐服务', qualification: '《营业执照》（经营范围含"互联网游戏服务"或"动漫游戏开发"相关）', scope: '适用于提供电子娱乐相关服务。', templates: [] },
      { name: '开锁服务', qualification: '（2选1）', scope: '适用于经公安局备案开锁公司提供开锁、修锁、换锁等服务。', templates: [] },
      { name: '百货/超市/便利店', scope: '适用于线下实体超市、百货商店、便利店提供货品展示、线上预定线下自提等导购服务。', templates: [] },
      { name: '洗浴保健', qualification: '（同时满足多项条件）', scope: '适用于洗浴场所、按摩场所主体提供洗浴、沐足、桑拿、按摩等服务。', templates: [] },
      { name: '洗浴保健平台', qualification: '（同时满足多项条件）', scope: '适用于为洗浴场所、按摩场所主体提供入驻渠道、提供多家洗浴保健等服务。', templates: [] },
      { name: '家政服务', scope: '适用于提供家政服务，如保姆、月嫂、房屋保洁、家电维修、数码电器维修等在线预约等服务。', templates: [{ name: '家政服务预约', desc: '服务预约、阿姨资料' }] },
      { name: '营业性演出票务', qualification: '（2选1）', scope: '适用于从事经营性演出票务活动平台/企业在线提供演出、表演信息展示、票务销售等服务。', templates: [] },
      { name: '共享服务', scope: '适用于共享工具提供服务（如：充电宝、雨伞、陪护床、轮椅等）服务。', templates: [] },
      { name: '生活缴费', qualification: '（2选1）', scope: '适用于提供水费、电费、电视费、燃气（煤气）、供暖、ETC、路费（高速路）、交通卡（含公交卡、地铁卡等在线购票/充值）、煤气配送等生活费用缴纳服务。', templates: [] },
      { name: '跑腿', scope: '适用于为需求者提供委托跑腿员代为购买和送达各种物品的服务。', templates: [] },
      { name: '寄存', scope: '适用于提供物品临时寄存（如行李寄存等）服务。', templates: [] }
    ]
  },
  {
    name: 'IT科技',
    hasData: true,
    secondLevel: [
      { name: '音视频设备', qualification: '《中国国家强制性产品认证证书》', scope: '适用于提供音视频设备、信息技术设备、电信终端设备等线下硬件在线销售及服务。', templates: [] },
      { name: '基础电信运营商', qualification: '（2选1）', scope: '适用于基础电信运营商及其分/子公司提供网上营业厅、话费充值、网费缴纳、客户服务等服务。', templates: [] },
      { name: '电信业务代理商（中国联通）', qualification: '提供与中国联通签署的电信业务代理协议。', scope: '适用于中国联通业务代理商提供网上营业厅流量套餐购买、话费充值、网费缴纳、宽带办理、客户服务等服务。', templates: [] },
      { name: '电信业务代理商（中国电信）', qualification: '提供与中国电信签署的电信业务代理协议。', scope: '适用于中国电信业务代理商提供网上营业厅流量套餐购买、话费充值、网费缴纳、宽带办理、客户服务等服务。', templates: [] },
      { name: '电信业务代理商（中国移动）', qualification: '提供与中国移动签署的电信业务代理协议。', scope: '适用于中国移动业务代理商提供网上营业厅流量套餐购买、话费充值、网费缴纳、宽带办理、客户服务等服务。', templates: [] },
      { name: '电信业务代理商（中国广电）', qualification: '提供与中国广电签署的电信业务代理协议。', scope: '适用于中国广电业务代理商提供网上营业厅流量套餐购买、话费充值、网费缴纳、宽带办理、客户服务等服务。', templates: [] },
      { name: '转售移动通信（中国移动）', qualification: '（2选1）', scope: '适用于提供中国移动通信转售服务。', templates: [] },
      { name: '转售移动通信（中国联通）', qualification: '（2选1）', scope: '适用于提供中国联通通信转售服务。', templates: [] },
      { name: '转售移动通信（中国电信）', qualification: '（2选1）', scope: '适用于提供中国电信通信转售服务。', templates: [] },
      { name: '转售移动通信（中国广电）', qualification: '（2选1）', scope: '适用于提供中国广电通信转售服务。', templates: [] },
      { name: '出境流量卡/出境电话卡', qualification: '（2选1）', scope: '适用于提供出境流量卡/出境电话卡销售服务。', templates: [] },
      { name: '多方通信', qualification: '《增值电信业务经营许可证》（业务范围须含"国内多方通信服务业务"）', scope: '仅适用于为多方提供电话会议/视频会议等服务。', templates: [] }
    ]
  },
  {
    name: '餐饮服务',
    hasData: true,
    secondLevel: [
      { name: '餐饮服务场所/餐饮服务管理企业', qualification: '（3选1）', scope: '适用于提供餐饮服务场所点餐、外卖服务等服务及餐饮门店管理业务等服务。', templates: [] },
      { name: '点餐平台', qualification: '《增值电信业务经营许可证》', scope: '为餐饮门店提供入驻渠道，提供线上点餐等平台型服务。', templates: [{ name: '外卖点餐平台', desc: '在线点餐、配送管理' }] },
      { name: '外卖平台', qualification: '（2选1）', scope: '适用于为餐饮门店提供入驻渠道，提供外卖等平台型服务。', templates: [] },
      { name: '餐厅排队', scope: '适用于为餐饮门店提供就餐线上取号、排号等排队服务。', templates: [{ name: '餐厅排队系统', desc: '在线取号、进度查询' }] }
    ]
  },
  {
    name: '旅游服务',
    hasData: true,
    secondLevel: [
      { name: '景区服务', scope: '适用于提供景区服务中心、景点推荐、导游、景点/公园门票等服务。', templates: [{ name: '景区预订平台', desc: '门票预订、导游服务' }] },
      { name: '旅行社', qualification: '《旅行社业务经营许可证》', scope: '适用于旅行社提供相关服务。', templates: [] },
      { name: '旅游管理单位', qualification: '（2选1）', scope: '适用于旅游管理机关提供相关业务。', templates: [] },
      { name: '旅游退税', qualification: '与境外退税代理机构/退税公司的合作协议', scope: '适用于为国内旅客赴境外购物退税服务。', templates: [] },
      { name: 'OTA', qualification: '（2选1）', scope: '适用于为旅游服务提供者提供线上旅游平台入驻服务。', templates: [] },
      { name: '住宿服务', qualification: '（2选1）', scope: '适用于提供公寓/民宿/酒店预订等服务。', templates: [{ name: '酒店预订小程序', desc: '酒店搜索、在线预订' }] },
      { name: '签证办理', scope: '适用于提供出境签证办理等服务。', templates: [] },
      { name: '出境WiFi', scope: '适用于提供出境WIFI租赁/销售等服务。', templates: [] }
    ]
  },
  {
    name: '时政信息',
    hasData: true,
    secondLevel: [
      { name: '时政信息', qualification: '（2选1）', scope: '适用于提供时政类新闻信息的文章/图片/视频/音频报道。', templates: [] }
    ]
  },
  {
    name: '文娱',
    hasData: true,
    secondLevel: [
      { name: '网络小说', qualification: '（3选1）', scope: '适用于提供网络小说在线阅读相关服务。', templates: [] },
      { name: '出版物', qualification: '（3选1）', scope: '适用于提供出版物（不含小说、动漫、学术期刊）在线阅读相关服务。', templates: [] },
      { name: '学术期刊', qualification: '（2选1）', scope: '适用于提供学术期刊发表、投稿、阅读等服务。', templates: [] },
      { name: '其他视频', qualification: '（6选1）：\n1、《信息网络传播视听节目许可证》\n2、《广播电视节目制作经营许可证》\n3、《广播电视频道许可证》（适用于电视台）\n4、《广播电视节目播出机构许可证》（适用于电视台）\n5、《统一社会信用代码》及《情况说明函件》（适用于政府主体）\n6、《事业单位法人证书》及该主体的主管部门许可文件（适用于事业单位主体）', scope: '适用于提供视频播放、观看等服务，包括但不限于业务类型为自办节目、转播节目、节目集成运营服务。', templates: [{ name: '虚拟数字人直播', desc: 'AI虚拟主播、实时互动' }] },
      { name: '视频广场', qualification: '（二选一）', scope: '适用于提供视频播放、观看等服务。', templates: [{ name: '短视频社区', desc: '视频上传、评论互动' }] },
      { name: '电台', qualification: '（2选1）', scope: '适用于提供电台/网络电台/FM/广播收听平台/音频节目等服务。', templates: [] },
      { name: '微短剧', qualification: '（2选1）', scope: '适用于提供网络微短剧视频播放、观看等服务。', templates: [] },
      { name: '互动微短剧', qualification: '（2选1）', scope: '适用于提供网络互动微短剧视频播放、观看等服务。', templates: [] },
      { name: '音乐', qualification: '（2选1）', scope: '适用于提供音乐在线播放等服务。', templates: [] },
      { name: '有声读物', qualification: '（4选1）', scope: '适用于提供版权读物的语音播报等服务。', templates: [] },
      { name: '动漫', qualification: '《网络文化经营许可证》（经营范围须含有动漫产品）', scope: '适用于提供在线阅读动漫等服务。', templates: [] },
      { name: '宗教信息', qualification: '《互联网宗教信息服务许可证》（服务形式须含"微信小程序或应用程序或互联网小程序"等相关信息）', scope: '适用于提供宗教相关图片、文字、视频资讯展示解读等服务。', templates: [] },
      { name: '资讯广场', qualification: '《互联网新闻信息服务许可证》', scope: '适用于提供多类行业资讯信息。', templates: [] }
    ]
  },
  {
    name: '工具',
    hasData: true,
    secondLevel: [
      { name: '记账', scope: '适用于提供价格记录、生活开销等模板功能的记账工具。', templates: [{ name: '记账理财小程序', desc: '收支记录、报表分析' }] },
      { name: '投票', scope: '适用于提供投票等服务。', templates: [] },
      { name: '日历', scope: '适用于提供日历等相关服务。', templates: [{ name: '日历待办工具', desc: '日程管理、提醒通知' }] },
      { name: '天气', scope: '适用于提供天气查询等相关服务。', templates: [{ name: '天气预报', desc: '实时天气、预警提醒' }] },
      { name: '备忘录', scope: '适用于提供待办事项记录功能服务。', templates: [{ name: '备忘录', desc: '快速记录、分类管理' }] },
      { name: '办公', scope: '适用于提供办公工具等服务。', templates: [] },
      { name: '图片处理', scope: '适用于提供图片/音频/视频的本地制作、剪辑等服务。', templates: [] },
      { name: '计算器', scope: '适用于提供计算工具等服务。', templates: [] },
      { name: '报价/比价', scope: '适用于提供商品价格展示/价格对比等服务。', templates: [] },
      { name: '信息查询', scope: '适用于提供信息查询、订单功能等服务。', templates: [] },
      { name: '兑换', scope: '适用于提供步数/积分兑换商品等服务。', templates: [] },
      { name: '预约/报名', scope: '适用于提供预约/报名功能等服务。', templates: [] },
      { name: '健康管理', scope: '适用于记录/测试与健康相关内容。', templates: [] },
      { name: '开票服务/企业代票工具', qualification: '所在地税务机关电子发票第三方服务平台备案名单入选证明', scope: '适用于电子发票第三方服务平台提供代开发票服务。', templates: [] },
      { name: '云手机', qualification: '《增值电信业务经营许可证》', scope: '适用于为用户提供基于云端移动终端的远程使用、调试、托管与管理的服务。', templates: [] },
      { name: '发票查询', qualification: '《营业执照》', scope: '适用于提供发票真伪校验、发票抬头管理等服务。', templates: [] },
      { name: '视频客服', scope: '适用于提供企业售后客服一对一视频等服务。', templates: [] },
      { name: '设备管理', scope: '适用于提供智能设备连接、管理、操控服务。', templates: [] }
    ]
  },
  {
    name: '电商平台',
    hasData: true,
    secondLevel: [
      { name: '电商平台', qualification: '（二选一）', scope: '用于为企业或个人提供网上交易场所的平台，即为多个经营者提供交易的平台。', templates: [{ name: '多用户商城系统', desc: '多商户入驻、分账系统' }] },
      { name: '网上竞价平台（非文物）', qualification: '同时提供多项材料', scope: '适用于电商平台提供网上竞价拍卖（非文物）等相关服务。', templates: [] },
      { name: '网上竞价平台（文物）', qualification: '同时提供多项材料', scope: '适用于电商平台提供网上竞价拍卖（文物）等相关服务。', templates: [] }
    ]
  },
  {
    name: '商家自营',
    hasData: true,
    secondLevel: [
      { name: '食品饮料', qualification: '（4选1）', scope: '适用于提供食品、饮料、茶叶、零食、调料等产品在线销售及配送相关服务。', templates: [] },
      { name: '百货商场/购物中心', qualification: '同时提供多项材料', scope: '适用于有线下大型实体的百货商场、购物中心提供服饰、化妆品、食品等服务。', templates: [] },
      { name: '免税商店', qualification: '（2选1）', scope: '适用于免税商店提供免税商品展示、线上预定线下自提等服务。', templates: [] },
      { name: '母婴食品', qualification: '（4选1）', scope: '适用于提供母婴食品（如孕妇奶粉、婴幼儿奶粉等）在线销售及配送相关服务。', templates: [] },
      { name: '生鲜/初级食用农产品', qualification: '《企业营业执照》（经营范围须含"初级食用农产品"相关）', scope: '适用于提供生鲜产品（海鲜等）、初级食用农产品（如水果、蔬菜、家禽等）在线销售及配送相关服务。', templates: [] },
      { name: '酒类', qualification: '（3选1）', scope: '适用于提供酒在线销售及配送相关服务。', templates: [] },
      { name: '保健品', qualification: '（4选1）', scope: '适用于提供在线提供保健品销售、配送等服务。', templates: [] },
      { name: '成人用品（医疗器械类）', qualification: '《营业执照》经营范围含"成人用品或避孕套或计生用品"等相关内容', scope: '仅适用于提供限免于经营备案二类医疗器械计生用品。', templates: [] },
      { name: '成人情趣用品', qualification: '《营业执照》经营范围须含成人情趣用品销售', scope: '适用于提供成人情趣用品，如：硅胶娃娃等（不含药品、医疗器械）在线销售配送等服务。', templates: [] },
      { name: '图书报刊/音像/影视/游戏/动漫', qualification: '（2选1）', scope: '适用于提供书籍报刊音像等在线销售配送等服务。', templates: [] },
      { name: '成品油', qualification: '（2选1）', scope: '适用于提供：汽油、煤油、柴油及其他符合国家产品质量标准、具有相同用途的乙醇汽油和生物柴油等替代燃料在线销售。', templates: [] },
      { name: '纪念币', qualification: '银行机构或银行机构的授权发售文件', scope: '适用于国家纪念币（如熊猫币等）在线销售配送相关服务。', templates: [] },
      { name: 'CORS服务销售', qualification: '（2选1）', scope: '适用于提供CORS账号销售等服务。', templates: [] },
      { name: '电话卡销售（中国联通）', qualification: '同时提供多项材料', scope: '适用于提供境内中国联通电话卡销售（含套餐信息）等服务。', templates: [] },
      { name: '电话卡销售（中国电信）', qualification: '同时提供多项材料', scope: '适用于提供境内中国电信电话卡销售（含套餐信息）等服务。', templates: [] },
      { name: '电话卡销售（中国移动）', qualification: '同时提供多项材料', scope: '适用于提供境内中国移动电话卡销售（含套餐信息）等服务。', templates: [] },
      { name: '电话卡销售（中国广电）', qualification: '同时提供多项材料', scope: '适用于提供境内中国广电电话卡销售（含套餐信息）等服务。', templates: [] },
      { name: '预付卡', qualification: '一、发行方（2选1）二、预付卡代售（同时符合）', scope: '适用于服务中含有在线销售具有预充值凭证卡、会员卡预充值、储值卡购买等功能类服务。', templates: [] },
      { name: '预付卡代售', scope: '适用于服务中含有在线代销售或充值会员卡、储值卡等功能类服务。', templates: [] },
      { name: 'B2b(商品批发/门店管理)', scope: '适用于线下门店/渠道终端提供整箱/整件商品的批发订货、供应链配送、门店营销、门店管理等相关服务。', templates: [] },
      { name: '玩具', scope: '适用于提供玩具在线销售配送相关服务。', templates: [] },
      { name: '鞋靴', scope: '适用于提供鞋、靴、凉鞋、拖鞋等产品在线销售及配送相关服务。', templates: [] },
      { name: '箱包皮具', scope: '适用于提供箱包、皮具制品等产品在线销售及配送相关服务。', templates: [] },
      { name: '乐器', scope: '适用于提供乐器、钢琴，竖琴，大提琴，中提琴，小提琴，低音提琴，口琴，凤凰琴，电子琴，木琴，钢片琴，颤音琴、管乐器、弦乐器、打击乐器等产品在线销售及配送相关服务。', templates: [] },
      { name: '家用电器', scope: '适用于提供电视、冰箱、洗衣机、电饭煲、空调、电暖器具、清洁电器、其他电器等产品在线销售及配送相关服务。', templates: [] },
      { name: '工艺品', scope: '适用于提供书画、陶瓷、紫砂、乐器、雕刻、砂岩、仿砂岩、琉璃摆件、铁艺、铜艺、玻璃钢、树脂、玻璃制品、奇石、古家具、木雕、花艺、茶艺等在线销售及配送相关服务。', templates: [] },
      { name: '宠物食品/用品', scope: '适用于提供宠物食品、宠物用品、宠物玩具等产品在线销售及配送相关服务。', templates: [] },
      { name: '个护家清', scope: '适用于提供日常洗护用品等产品在线销售及配送相关服务。', templates: [] },
      { name: '时尚首饰', scope: '适用于提供其他饰品等产品在线销售及配送相关服务。', templates: [] },
      { name: '眼镜', scope: '适用于近视眼镜、远视眼镜、老花镜及散光眼镜、平光眼镜、电脑护目镜、护目镜、泳镜、夜视镜、电竞游戏护目镜、电竞护目镜、风镜、墨镜、玩具眼镜、太阳眼镜。', templates: [] },
      { name: '钟表', scope: '适用于提供钟、手表等产品在线销售及配送相关服务。', templates: [] },
      { name: '邮票', scope: '适用于邮票发售在线销售配送相关服务。', templates: [] },
      { name: '服饰内衣', scope: '适用于提供服饰、内衣等产品在线销售及配送相关服务。', templates: [] },
      { name: '海淘', scope: '适用于提供境外服饰、玩具、美妆等商品在线销售配送服务。', templates: [] },
      { name: '母婴用品', scope: '适用于提供母婴用品（不含食品）在线销售及配送相关服务。', templates: [] },
      { name: '3C数码', scope: '适用于提供MP3、U盘，智能手机，数码照相机/摄像机/扫描仪等产品在线销售及配送相关服务。', templates: [] },
      { name: '美妆', scope: '适用于提供化妆品、护肤品等产品在线销售及配送相关服务。', templates: [] },
      { name: '珠宝玉石', qualification: '《营业执照》（经营范围包含：销售珠宝玉器/金银制品或贵金属首饰、镶嵌首饰、贵金属销售等内容）', scope: '适用于提供珠宝玉石等产品在线销售及配送相关服务。', templates: [] },
      { name: '商用设备机械销售', qualification: '《营业执照》（经营范围需含"机械设备销售"等相关内容）', scope: '适用于提供农业机械、工程机械等设备预售或在线销售及配送相关服务。', templates: [] },
      { name: '商用设备机械租赁', qualification: '《营业执照》（经营范围需含"机械设备经营租赁"等相关内容）', scope: '适用于提供农业机械、工程机械等设备在线租赁服务。', templates: [] },
      { name: '运动户外', scope: '适用于提供登山用品、运动配件、露营工具、划船器、健美车、健步机、跑步机、美腰机等产品在线销售及配送相关服务。', templates: [] },
      { name: '园艺/鲜花', scope: '适用于提供园艺（如：果树园艺、蔬菜园艺和观赏园艺等）、花艺、鲜花等产品在线销售及配送相关服务。', templates: [] },
      { name: '家居家纺', scope: '适用于提供餐具厨具、收纳用品、床上用品（被套、被褥、床单、床罩等）等产品在线销售及配送相关服务。', templates: [] },
      { name: '办公/文具', scope: '适用于提供办公/文具用品（如：笔筒等配套用品、直尺、笔记本、订书机、复印机、传真机等等）等在线销售及配送相关服务。', templates: [] },
      { name: '农资', scope: '适用于提供农资（如：农业运输机械、生产及加工机械、化肥、农膜等）产品在线销售及配送相关服务。', templates: [] },
      { name: '种子', qualification: '（2选1）', scope: '适用于提供种子（如：农业种子、林业种子、园艺种子、饲草种子）产品在线销售及配送相关服务。', templates: [] },
      { name: '家装/五金/建材', scope: '适用于提供天花板、瓷砖、门、窗、锁、玻璃、灯具、地板，卫厨，壁纸等产品在线销售及配送相关服务。', templates: [] },
      { name: '机械电子产品', scope: '适用于提供机械产品/电子器件线上销售配送等服务。', templates: [] }
    ]
  },
  {
    name: '商业服务',
    hasData: true,
    secondLevel: [
      { name: '律所服务', qualification: '（2选1）', scope: '适用于律师事务所机构提供在线法律咨询、代理参加诉讼等服务。', templates: [] },
      { name: '法律服务平台', qualification: '（2选1）', scope: '适用于提供专业法律咨询、法律调解仲裁等服务。', templates: [{ name: '法律咨询平台', desc: '在线咨询、案件委托' }] },
      { name: '公证', qualification: '（2选1）', scope: '适用于提供在线办理公证申请、预约、办理进度查询等。', templates: [] },
      { name: '电子认证', qualification: '（2选1）', scope: '适用于提供电子（数字）认证等服务。', templates: [] },
      { name: '认证服务', qualification: '《认证机构批准书》', scope: '适用于管理体系认证、服务认证、产品认证、国推污染控制认证、强制性产品认证等提供认证服务的机构。', templates: [] },
      { name: '拍卖公司（非文物）', qualification: '同时提供多项材料', scope: '适用于提供非文物拍卖公司提供的相关服务。', templates: [] },
      { name: '文物拍卖公司', qualification: '同时提供多项材料', scope: '适用于提供文物拍卖企业提供的相关服务。', templates: [] },
      { name: '司法拍卖', qualification: '（2选1）', scope: '适用于为单家/多家司法机关提供司法拍卖等服务。', templates: [] },
      { name: '专利/商标代理', qualification: '(2选1）', scope: '适用于单家专利代理机构或商标代理机构提供专利、商标代理等服务。', templates: [] },
      { name: '亲子/司法鉴定', qualification: '《司法鉴定许可证》', scope: '适用于提供亲子鉴定、DNA鉴定、司法鉴定等服务。', templates: [] },
      { name: '典当', qualification: '《典当经营许可证》', scope: '适用于提供典当、抵押等服务。', templates: [] },
      { name: '会计师事务所', qualification: '《会计师事务所执业证书》', scope: '适用于提供会计师事务所为主体提供会计服务（如：审计、会计、咨询等）功能。', templates: [] },
      { name: '税务师事务所', qualification: '（2选1）', scope: '适用于提供税务师事务所为主体提供税务服务（如：税务登记、纳税和退税等）功能。', templates: [] },
      { name: '贵金属回收', qualification: '（2选1）', scope: '适用于提供贵金属（如：黄金、铂金、白银等）回收相关服务。', templates: [] },
      { name: '环保回收/废品回收', scope: '适用于环保、废品回收企业提供废旧物资、二手设备、废金属、废塑料设备等物品回收服务。', templates: [] },
      { name: '公共印章刻制', qualification: '（3选1）', scope: '适用于提供公共印章刻制等服务。', templates: [] },
      { name: '农林牧渔', qualification: '（5选1）', scope: '适用于提供农业技术类、林业技术类、畜牧类、水产养殖类、农林管理类资讯、交易等服务。', templates: [] },
      { name: '公司转让信息服务', scope: '仅适用于提供展示转让公司信息等服务。', templates: [] },
      { name: '住所托管服务', qualification: '《营业执照》（经营范围含"商务秘书"）', scope: '适用于为无需固定住所或者经营场所的商事主体提供住所托管服务。', templates: [] },
      { name: '一般财务服务', scope: '适用于为企业提供专业的财务业务解答、筹划及指导等服务。', templates: [] },
      { name: '广告/设计', scope: '适用于提供商业广告、产品设计等相关等服务。', templates: [] },
      { name: '公关/推广/市场调查', scope: '适用于提供商业性质市场调研、推广、公关等服务。', templates: [] },
      { name: '网络代理', scope: '适用于提供网络优化维护、网络代理等服务。', templates: [] },
      { name: '企业管理', scope: '适用于提供企业办公工具/办公管理、门店信息管理、展示等服务。', templates: [{ name: '企业办公管理', desc: '考勤打卡、审批流程' }] },
      { name: '会展服务', scope: '适用于提供商业会展服务，如会展中心推广/介绍等。', templates: [{ name: '会展服务小程序', desc: '展会信息、展商展示' }] },
      { name: '出国移民', qualification: '《营业执照》且经营范围包含：提供出国探亲访友等信息咨询服务', scope: '适用于提供投资移民、创业移民、买房移民、技术移民、雇主移民(出国劳务)、结婚移民和团聚移民等信息咨询、手续办理等服务。', templates: [] },
      { name: '摄影/扩印', scope: '适用于提供证件照、艺术照摄影、相片扩印等服务。', templates: [] },
      { name: '软件/建站/技术开发', scope: '适用于提供网站建设、网络基础建设、专业软件开发/售卖等服务。', templates: [] },
      { name: '质量检测', qualification: '（2选1）', scope: '适用于提供农作物质量检测、空气质量检测、环境质量检测、甲醛检测等服务。', templates: [] },
      { name: '机械维修', scope: '适用于提供大型机械产品维修服务。', templates: [] },
      { name: '工商代理注册', scope: '适用于代办工商注册等手续。', templates: [] }
    ]
  },
  {
    name: '公益',
    hasData: true,
    secondLevel: [
      { name: '募捐服务', qualification: '（2选1）', scope: '适用于慈善组织及募捐服务平台提供公开募捐等服务。', templates: [{ name: '公益募捐平台', desc: '项目展示、在线捐赠' }] },
      { name: '个人求助网络服务平台', qualification: '民政部指定个人求助网络服务平台的公告截图', scope: '适用于个人求助网络服务平台提供个人求助信息发布等服务。', templates: [] },
      { name: '慈善信息服务', qualification: '（3选1）', scope: '仅适用于提供慈善信息展示服务（不含募捐信息发布）。', templates: [] },
      { name: '网络互助', qualification: '该类目正在内测阶段，暂不支持线上申请。', scope: '适用于以互助名义向用户收取费用、招募参加者，在发生约定风险事件的情况下向参加者提供互助金的网络互助类业务。', templates: [] }
    ]
  },
  {
    name: '社交',
    hasData: true,
    secondLevel: [
      { name: '陌生人交友', qualification: '《增值电信业务经营许可证》（核准服务项目包含"互联网信息服务业务"）', scope: '适用于陌生人关系场景里提供的即时沟通、互动、交友类等服务。', templates: [] },
      { name: '熟人交友', scope: '适用于熟人关系场景里所提供的即时沟通、互动、交友类等服务。', templates: [] },
      { name: '社区/论坛', qualification: '（2选1）', scope: '适用于提供UGC内容的发布与交流，如论坛、贴吧、社群等功能性服务。', templates: [{ name: '社群管理工具', desc: '成员管理、内容发布' }] },
      { name: '直播', qualification: '（3选1）', scope: '适用于提供在线直播等服务。', templates: [] },
      { name: '笔记', qualification: '（2选1）', scope: '适用于提供用户随时随地自定义生成的内容（包括文字、图片等丰富素材）发布与分享，且他人可见/访问的服务等。', templates: [] },
      { name: '婚恋', qualification: '《增值电信业务经营许可证》（核准服务项目包含"互联网信息服务业务"）', scope: '适用于提供婚恋交友类等服务。', templates: [] },
      { name: '问答', qualification: '（2选1）', scope: '适用于提供交互式问答等服务。', templates: [] },
      { name: '直播答题', qualification: '《信息网络传播视听节目许可证》', scope: '适用于提供在线直播答题的活动等服务。', templates: [] }
    ]
  },
  {
    name: '体育',
    hasData: true,
    secondLevel: [
      { name: '体育场馆服务', scope: '适用于提供体育场馆预订等服务。', templates: [] },
      { name: '体育培训', scope: '适用于提供各种体育项目培训/学习的服务等。', templates: [{ name: '体育运动培训', desc: '课程预约、教练展示' }] },
      { name: '在线健身', scope: '适用于提供各类型的健身运动在线学习/在线指导等服务。', templates: [{ name: '在线健身指导', desc: '视频课程、训练计划' }] },
      { name: '体育赛事/电子竞技赛', qualification: '（2选1）', scope: '适用于提供体育赛事（如：篮球赛、网球赛等）、电子竞技赛票务销售等服务。', templates: [] }
    ]
  },
  {
    name: '汽车服务',
    hasData: true,
    secondLevel: [
      { name: '维修保养', scope: '适用于提供汽车维修/汽车美容/汽车养护/洗车等服务。', templates: [{ name: '汽车养护预约', desc: '服务预约、技师展示' }] },
      { name: '汽车用品', scope: '适用于提供汽车、摩托车、自行车及其他交通工具零部件、汽车内饰/外饰产品在线销售配送等服务。', templates: [] },
      { name: '汽车报价/比价', scope: '适用于提供汽车指导价格/报价等服务。', templates: [] },
      { name: '汽车经销商/4S店', scope: '适用于提供汽车经销商/4S店提供的汽车服务等。', templates: [] },
      { name: '汽车厂商', scope: '适用于提供汽车生产商提供的服务等。', templates: [] },
      { name: '机动车回收服务', qualification: '（2选1）', scope: '适用于提供机动车（汽车、电动车、摩托车）报废、回收相关服务。', templates: [] },
      { name: '汽车预售', qualification: '（3选1）', scope: '适用于提供汽车在线预付款、购买购车优惠券/代金券等服务。', templates: [] },
      { name: '二手车', qualification: '（需同时提供多项材料）', scope: '适用于提供二手汽车在线预付款、购买购车优惠券/代金券等服务。', templates: [] }
    ]
  },
  {
    name: '资讯',
    hasData: true,
    secondLevel: [
      { name: '信息资讯', scope: '适用于提供娱乐、美妆、餐饮等单一行业资讯展示等服务。', templates: [{ name: '新闻资讯平台', desc: '资讯聚合、个性化推荐' }] }
    ]
  },
  {
    name: '深度合成',
    hasData: true,
    secondLevel: [
      { name: 'AI问答', qualification: '1、使用自研技术或2、使用第三方技术（2选1）', scope: '适用于提供文本深度合成技术（如：AI问答）等相关服务。', templates: [{ name: 'AI内容生成工具', desc: '文本生成、图像处理' }] },
      { name: 'AI换脸', qualification: '1、使用自研技术或2、使用第三方技术（2选1）', scope: '适用于提供视频深度合成技术（如：AI换脸视频）等相关服务。', templates: [] },
      { name: 'AI绘画', qualification: '1、使用自研技术或2、使用第三方技术（2选1）', scope: '适用于提供图片深度合成技术（如：AI绘画）等相关服务。', templates: [] },
      { name: 'AI创作', qualification: '1、使用自研技术或2、使用第三方技术（2选1）', scope: '适用于提供文本深度合成技术（如：AI创作）等相关服务。', templates: [] }
    ]
  },
  {
    name: '内测',
    hasData: true,
    secondLevel: [
      { name: '数字藏品（展示）', qualification: '该类目正在内测阶段，暂不支持线上申请。', scope: '适用于数字藏品展示和一级赠送等服务。', templates: [{ name: '产品内测平台', desc: '版本管理、反馈收集' }] },
      { name: '特许药品销售', qualification: '该类目正在内测阶段，暂不支持线上申请。', scope: '适用于海南博鳌乐城国际医疗旅游先行区内的医疗机构主体提供特许药品在线交易、展示等服务。', templates: [] },
      { name: '特许医疗器械销售', qualification: '该类目正在内测阶段，暂不支持线上申请。', scope: '适用于海南博鳌乐城国际医疗旅游先行区内的医疗机构主体提供特许医疗器械在线交易、展示等服务。', templates: [] }
    ]
  }
]

// 个人类目（9个一级类目）
export const personalCategories: FirstLevelCategory[] = [
  {
    name: '物流服务',
    hasData: true,
    secondLevel: [
      { name: '查件', scope: '适用于提供快递、物流行业的查件业务等服务。注：不包含寄件、收件业务。', templates: [{ name: '物流查件', desc: '查件服务' }] },
      { name: '装卸搬运', scope: '适用于物流设施内的装卸搬运业务。', templates: [] }
    ]
  },
  {
    name: '教育服务',
    hasData: true,
    secondLevel: [
      { name: '婴幼儿教育', scope: '适用于0～6岁年龄阶段的婴幼儿教育。', templates: [] },
      { name: '在线教育', scope: '适用于在线教育、网络教育或者远程教育等以互联网为载体的教育服务。', templates: [{ name: '在线课程', desc: '网课平台' }] },
      { name: '教育装备', scope: '适用于教育教学活动所需的教具、学具、器材、设施。', templates: [] },
      { name: '特殊人群教育', scope: '适用于特殊人群方面相关的教育。', templates: [] }
    ]
  },
  {
    name: '交通服务',
    hasData: true,
    secondLevel: [
      { name: '代驾服务', scope: '提供代驾服务。注：不包含提供顺风车、网约车等服务。', templates: [{ name: '代驾服务', desc: '代驾呼叫' }] }
    ]
  },
  {
    name: '生活服务',
    hasData: true,
    secondLevel: [
      { name: '丽人服务', scope: '提供美甲、美容、美睫、美发、纹身、祛痘、纤体瘦身、舞蹈、瑜伽等不含医疗美容服务。', templates: [
        { name: '美甲服务', desc: '美甲预约' },
        { name: '美容服务', desc: '美容护理' },
        { name: '美发沙龙', desc: '发型预约' }
      ] },
      { name: '婚庆服务', scope: '提供婚礼庆典策划、婚纱摄影、婚宴酒席、婚礼摄像、蜜月旅行等相关服务。注：不包含社交婚恋服务。', templates: [] },
      { name: '家政服务', scope: '适用于提供家政服务，如保姆、月嫂、房屋保洁、家电维修、数码电器维修等在线预约等服务。', templates: [] }
    ]
  },
  {
    name: '餐饮服务',
    hasData: true,
    secondLevel: [
      { name: '餐厅排队', scope: '提供个体餐饮门店提供就餐线上取号、排号等排队服务。注：不包含线上点餐、外卖等服务。', templates: [{ name: '餐厅排队', desc: '排队取号' }] }
    ]
  },
  {
    name: '旅游服务',
    hasData: true,
    secondLevel: [
      { name: '出境WiFi', scope: '提供出境WIFI租赁/销售。注：不包含境外流量、话费充值服务。', templates: [{ name: '出境WiFi', desc: 'WiFi租赁' }] }
    ]
  },
  {
    name: '工具',
    hasData: true,
    secondLevel: [
      { name: '记账', scope: '提供如：消费记录等模板功能的记账工具。注：不包含提供用户自定义生成内容记录及分享。', templates: [{ name: '记账工具', desc: '收支记录' }] },
      { name: '日历', scope: '提供日历相关服务。', templates: [{ name: '日历工具', desc: '日程管理' }] },
      { name: '天气', scope: '提供天气查询等相关服务。', templates: [{ name: '天气查询', desc: '天气预报' }] },
      { name: '办公', scope: '提供办公工具等服务。', templates: [] },
      { name: '图片处理', scope: '提供图片/音频/视频制作、剪辑。', templates: [] },
      { name: '计算器', scope: '提供计算工具等。', templates: [] },
      { name: '报价/比价', scope: '提供商品报价、价格对比服务。', templates: [] },
      { name: '信息查询', scope: '提供信息查询功能。', templates: [] },
      { name: '预约/报名', scope: '提供预约/报名功能。', templates: [] },
      { name: '健康管理', scope: '提供身高、体重等健康管理记录。', templates: [] },
      { name: '备忘录', scope: '适用于提供待办事项记录功能服务；注：不涉及用户原创内容的传播及公开访问。', templates: [{ name: '备忘录', desc: '待办事项' }] }
    ]
  },
  {
    name: '商业服务',
    hasData: true,
    secondLevel: [
      { name: '律师', scope: '适用于已通过国家司法考试并依法取得律师执业证书的执业人员接受委托或者指定，为当事人提供在线法律服务。', templates: [{ name: '律师咨询', desc: '在线咨询' }] },
      { name: '企业管理', scope: '适用于提供企业办公工具/办公管理、门店信息管理、展示等服务。', templates: [] },
      { name: '会展服务', scope: '提供商业会展服务，会展中心推广/介绍等。', templates: [] },
      { name: '公关/推广/市场调查', scope: '适用于提供商业性质市场调研、推广、公关等服务。', templates: [] },
      { name: '环保回收/废品回收', scope: '适用于环保、废品回收企业提供废旧物资、二手设备、废金属、废塑料设备等物品回收服务。', templates: [] },
      { name: '摄影/扩印', scope: '适用于提供证件照、艺术照摄影、相片扩印等服务。', templates: [] }
    ]
  },
  {
    name: '体育',
    hasData: true,
    secondLevel: [
      { name: '体育培训', scope: '提供各种体育项目培训/学习的服务。', templates: [{ name: '体育培训', desc: '课程预约' }] },
      { name: '在线健身', scope: '提供各类型的健身运动在线学习/在线指导服务。', templates: [{ name: '在线健身', desc: '视频教学' }] }
    ]
  }
]

// 境外类目（15个一级类目，简化版）
export const overseasCategories: FirstLevelCategory[] = [
  {
    name: '快递业与邮政',
    hasData: true,
    secondLevel: [
      { name: '快递', restrictions: '不得涉及空中交通管制公司、邮政公司', scope: '适用于快递服务。', templates: [{ name: '国际物流', desc: '跨境运输' }] },
      { name: '物流', restrictions: '不得涉及空中交通管制公司、邮政公司', scope: '适用于物流服务。', templates: [] },
      { name: '装卸搬运', scope: '适用于物流设施内的装卸搬运业务。', templates: [] },
      { name: '寄件/收件', scope: '适用于提供快递寄件/收件服务。', templates: [] }
    ]
  },
  {
    name: '教育',
    hasData: true,
    secondLevel: [
      { name: '婴幼儿教育', restrictions: '不得涉及义务教育机构、学科教育', scope: '适用于0～6岁年龄阶段的婴幼儿教育。', templates: [] },
      { name: '在线教育', scope: '适用于在线教育、网络教育或者远程教育。', templates: [] },
      { name: '教育装备', scope: '适用于教育教学活动所需的教具、学具、器材。', templates: [] },
      { name: '特殊人群教育', scope: '适用于特殊人群方面相关的教育。', templates: [] },
      { name: '大学', scope: '适用于大学提供相关服务。', templates: [] },
      { name: '在线缴费平台', scope: '适用于提供校园生活费用缴纳。', templates: [] }
    ]
  },
  {
    name: '出行与交通',
    hasData: true,
    secondLevel: [
      { name: '代驾', scope: '提供代驾服务。', templates: [] },
      { name: '共享单车', restrictions: '仅限新加坡、日本', scope: '适用于共享单车服务。', templates: [] },
      { name: '跨境车辆查验', scope: '适用于跨境车辆查验服务。', templates: [] },
      { name: '跨境客运', scope: '适用于跨境客运服务。', templates: [] },
      { name: '出租车', scope: '适用于出租车服务。', templates: [] },
      { name: '航司服务/机场服务', scope: '适用于航司服务/机场服务。', templates: [] },
      { name: '其他航空服务', scope: '适用于其他航空服务。', templates: [] }
    ]
  },
  {
    name: '房地产',
    hasData: true,
    secondLevel: [
      { name: '房地产', scope: '适用于房地产中介服务。', templates: [] }
    ]
  },
  {
    name: '生活服务',
    hasData: true,
    secondLevel: [
      { name: '摄影/扩印', scope: '适用于提供证件照、艺术照摄影、相片扩印。', templates: [] },
      { name: '婚庆服务', scope: '提供婚礼庆典策划、婚纱摄影等。', templates: [] },
      { name: '家政', scope: '适用于提供家政服务。', templates: [] },
      { name: '票务', scope: '适用于票务服务。', templates: [] },
      { name: '生活缴费', scope: '适用于提供生活缴费服务。', templates: [] },
      { name: '外送', scope: '适用于提供外送服务。', templates: [] }
    ]
  },
  {
    name: '餐饮',
    hasData: true,
    secondLevel: [
      { name: '餐厅排队', scope: '适用于个体餐饮门店提供就餐线上取号、排号等排队服务。', templates: [] },
      { name: '外卖点餐', scope: '适用于外卖点餐服务。', templates: [] }
    ]
  },
  {
    name: '旅游',
    hasData: true,
    secondLevel: [
      { name: '出境WiFi', scope: '提供出境WIFI租赁/销售。', templates: [] },
      { name: '旅游攻略', scope: '提供旅游攻略。', templates: [] },
      { name: '酒店服务', scope: '适用于酒店、民宿、客栈等住宿服务。', templates: [] },
      { name: '博物馆', scope: '提供博物馆服务。', templates: [] },
      { name: '签证', scope: '提供签证服务。', templates: [] },
      { name: '旅行社', scope: '提供旅游服务。', templates: [] },
      { name: '旅游局', scope: '提供旅游局服务。', templates: [] },
      { name: '旅游退税（内测）', scope: '适用于旅游退税。', templates: [] },
      { name: '演出票务（内测）', scope: '适用于演出票务。', templates: [] }
    ]
  },
  {
    name: '工具',
    hasData: true,
    secondLevel: [
      { name: '记账', scope: '提供记账工具。', templates: [] },
      { name: '日历', scope: '提供日历服务。', templates: [] },
      { name: '天气', scope: '提供天气查询。', templates: [] },
      { name: '办公', scope: '提供办公工具。', templates: [] },
      { name: '字典', scope: '提供字典服务。', templates: [] },
      { name: '图片', scope: '提供图片处理。', templates: [] },
      { name: '计算类', scope: '提供计算工具。', templates: [] },
      { name: '报价/比价', scope: '提供商品报价、价格对比。', templates: [] },
      { name: '信息查询', scope: '提供信息查询。', templates: [] },
      { name: '效率', scope: '提供效率工具。', templates: [] },
      { name: '预约/报名', scope: '提供预约/报名功能。', templates: [] },
      { name: '健康管理', scope: '提供健康管理记录。', templates: [] },
      { name: '企业管理', scope: '提供企业管理工具。', templates: [] },
      { name: '充电宝', scope: '提供充电宝服务。', templates: [] }
    ]
  },
  {
    name: '商业服务',
    hasData: true,
    secondLevel: [
      { name: '广告/设计', scope: '提供广告/设计服务。', templates: [] },
      { name: '公关/推广', restrictions: '不得涉及社会调查', scope: '提供商业性质市场调研、推广、公关。', templates: [] },
      { name: '会展服务', scope: '提供商业会展服务。', templates: [] },
      { name: '一般财务服务', scope: '提供财务服务。', templates: [] },
      { name: '税费代缴', restrictions: '仅限澳大利亚、新西兰', scope: '提供税费代缴服务。', templates: [] },
      { name: '公证（非中国大陆地区）', scope: '提供公证服务。', templates: [] },
      { name: '公证（中国大陆地区）', scope: '提供公证服务。', templates: [] }
    ]
  },
  {
    name: '体育',
    hasData: true,
    secondLevel: [
      { name: '体育培训', scope: '提供各种体育项目培训。', templates: [] },
      { name: '在线健身', scope: '提供健身运动在线学习。', templates: [] }
    ]
  },
  {
    name: '汽车',
    hasData: true,
    secondLevel: [
      { name: '养车/修车', scope: '适用于汽车维修保养。', templates: [] },
      { name: '汽车报价/比价', scope: '适用于汽车报价/比价服务。', templates: [] },
      { name: '车展服务', scope: '提供车展服务。', templates: [] },
      { name: '汽车经销商/4S店', scope: '适用于汽车经销商、4S店。', templates: [] },
      { name: '汽车厂商', scope: '适用于汽车厂商。', templates: [] }
    ]
  },
  {
    name: 'IT科技',
    hasData: true,
    secondLevel: [
      { name: '基础电信运营商', scope: '适用于基础电信运营商。', templates: [] }
    ]
  },
  {
    name: '公共服务',
    hasData: true,
    secondLevel: [
      { name: '医务卫生', scope: '提供医疗服务。', templates: [] },
      { name: '治安/出入境', scope: '提供治安/出入境服务。', templates: [] },
      { name: '商务', scope: '提供商务服务。', templates: [] }
    ]
  },
  {
    name: '本地服务',
    hasData: true,
    secondLevel: [
      { name: '服装/鞋/箱包', scope: '适用于服装/鞋/箱包销售。', templates: [] },
      { name: '玩具', scope: '适用于玩具销售。', templates: [] },
      { name: '家电/数码/手机', scope: '适用于家电/数码/手机销售。', templates: [] },
      { name: '美妆/洗护', scope: '适用于美妆/洗护销售。', templates: [] },
      { name: '珠宝/饰品/眼镜/钟表', scope: '适用于珠宝/饰品/眼镜/钟表销售。', templates: [] },
      { name: '运动/户外/乐器', scope: '适用于运动/户外/乐器销售。', templates: [] },
      { name: '鲜花/园艺/工艺品', scope: '适用于鲜花/园艺/工艺品销售。', templates: [] },
      { name: '家居/家饰/家纺', scope: '适用于家居/家饰/家纺销售。', templates: [] },
      { name: '机械/电子器件', scope: '适用于机械/电子器件销售。', templates: [] },
      { name: '办公/文具', scope: '适用于办公/文具销售。', templates: [] },
      { name: '酒', scope: '适用于酒类销售。', templates: [] },
      { name: '食品', scope: '适用于食品销售。', templates: [] },
      { name: '百货/超市/便利店', scope: '适用于百货/超市/便利店。', templates: [] },
      { name: '免税商店', scope: '适用于免税商店。', templates: [] },
      { name: '电商平台', scope: '适用于电商平台。', templates: [] },
      { name: '奶粉', scope: '适用于奶粉销售。', templates: [] },
      { name: '保健品', scope: '适用于保健品销售。', templates: [] },
      { name: '药品', scope: '适用于药品销售。', templates: [] },
      { name: '宠物食品/用品', scope: '适用于宠物食品/用品销售。', templates: [] },
      { name: '就医服务', scope: '提供就医服务。', templates: [] },
      { name: '医疗资讯（内测）', scope: '提供医疗资讯。', templates: [] },
      { name: '证券（内测）', scope: '提供证券服务。', templates: [] },
      { name: '银行', scope: '提供银行服务。', templates: [] }
    ]
  },
  {
    name: '跨境电商',
    hasData: true,
    secondLevel: [
      { name: '电商平台', scope: '适用于跨境电商平台。', templates: [] },
      { name: '服装/鞋/箱包', scope: '适用于服装/鞋/箱包跨境销售。', templates: [] },
      { name: '玩具', scope: '适用于玩具跨境销售。', templates: [] },
      { name: '家电/数码/手机', scope: '适用于家电/数码/手机跨境销售。', templates: [] },
      { name: '美妆/洗护', scope: '适用于美妆/洗护跨境销售。', templates: [] },
      { name: '珠宝/饰品/眼镜/钟表', scope: '适用于珠宝/饰品/眼镜/钟表跨境销售。', templates: [] },
      { name: '运动/户外/乐器', scope: '适用于运动/户外/乐器跨境销售。', templates: [] },
      { name: '鲜花/园艺/工艺品', scope: '适用于鲜花/园艺/工艺品跨境销售。', templates: [] },
      { name: '家居/家饰/家纺', scope: '适用于家居/家饰/家纺跨境销售。', templates: [] },
      { name: '机械/电子器件', scope: '适用于机械/电子器件跨境销售。', templates: [] },
      { name: '办公/文具', scope: '适用于办公/文具跨境销售。', templates: [] },
      { name: '宠物食品/用品', scope: '适用于宠物食品/用品跨境销售。', templates: [] },
      { name: '母婴', scope: '适用于母婴用品跨境销售。', templates: [] },
      { name: '奶粉', scope: '适用于奶粉跨境销售。', templates: [] },
      { name: '保健品', scope: '适用于保健品跨境销售。', templates: [] },
      { name: '食品', scope: '适用于食品跨境销售。', templates: [] },
      { name: '酒', scope: '适用于酒类跨境销售。', templates: [] },
      { name: '成人用品', scope: '适用于成人用品跨境销售。', templates: [] }
    ]
  }
]

// 根据主体类型获取类目数据
export function getCategoriesByEntityType(entityType: EntityType): FirstLevelCategory[] {
  switch (entityType) {
    case EntityType.COMPANY:
      return companyCategories
    case EntityType.PERSONAL:
      return personalCategories
    case EntityType.OVERSEAS:
      return overseasCategories
    default:
      return []
  }
}

/**
 * 获取所有主体类型合并后的类目（包含企业、个人、境外）
 * 返回格式：一级类目名称 -> 支持该类目的主体类型列表
 */
export function getAllMergedCategories(): FirstLevelCategory[] {
  // 使用 Map 来合并所有类目，记录每个类目被哪些主体类型支持
  const categoryMap = new Map<string, {
    name: string
    supportedTypes: EntityType[]
    secondLevel: SecondLevelCategory[]
  }>()

  // 处理企业类目
  companyCategories.forEach((firstLevel: FirstLevelCategory) => {
    const existing = categoryMap.get(firstLevel.name)
    if (existing) {
      if (!existing.supportedTypes.includes(EntityType.COMPANY)) {
        existing.supportedTypes.push(EntityType.COMPANY)
      }
      // 合并二级类目（去重）
      existing.secondLevel = mergeSecondLevelCategories(existing.secondLevel, firstLevel.secondLevel, EntityType.COMPANY)
    } else {
      categoryMap.set(firstLevel.name, {
        name: firstLevel.name,
        supportedTypes: [EntityType.COMPANY],
        secondLevel: JSON.parse(JSON.stringify(firstLevel.secondLevel)) // 深拷贝
      })
    }
  })

  // 处理个人类目
  personalCategories.forEach((firstLevel: FirstLevelCategory) => {
    const existing = categoryMap.get(firstLevel.name)
    if (existing) {
      if (!existing.supportedTypes.includes(EntityType.PERSONAL)) {
        existing.supportedTypes.push(EntityType.PERSONAL)
      }
      existing.secondLevel = mergeSecondLevelCategories(existing.secondLevel, firstLevel.secondLevel, EntityType.PERSONAL)
    } else {
      categoryMap.set(firstLevel.name, {
        name: firstLevel.name,
        supportedTypes: [EntityType.PERSONAL],
        secondLevel: JSON.parse(JSON.stringify(firstLevel.secondLevel))
      })
    }
  })

  // 处理境外类目
  overseasCategories.forEach((firstLevel: FirstLevelCategory) => {
    const existing = categoryMap.get(firstLevel.name)
    if (existing) {
      if (!existing.supportedTypes.includes(EntityType.OVERSEAS)) {
        existing.supportedTypes.push(EntityType.OVERSEAS)
      }
      existing.secondLevel = mergeSecondLevelCategories(existing.secondLevel, firstLevel.secondLevel, EntityType.OVERSEAS)
    } else {
      categoryMap.set(firstLevel.name, {
        name: firstLevel.name,
        supportedTypes: [EntityType.OVERSEAS],
        secondLevel: JSON.parse(JSON.stringify(firstLevel.secondLevel))
      })
    }
  })

  // 转换为数组并添加标识支持的主体类型
  return Array.from(categoryMap.values()).map((item, index) => ({
    name: item.name,
    hasData: true,
    // 在每个二级类目中添加 supportedTypes 字段，标识哪些主体类型支持该类目
    secondLevel: item.secondLevel.map((sl: any) => ({
      ...sl,
      supportedTypes: sl.supportedTypes || [] // 有些二级类目可能有特定的主体类型限制
    })),
    // 在一级类目上添加支持的主体类型列表（用于UI显示）
    supportedEntityTypes: item.supportedTypes,
    // 添加唯一ID
    id: index
  }))
}

/**
 * 合并二级类目，并为每个类目标注支持的主体类型
 */
function mergeSecondLevelCategories(
  existing: SecondLevelCategory[],
  newItems: SecondLevelCategory[],
  entityType: EntityType
): SecondLevelCategory[] {
  const result = [...existing]

  newItems.forEach((newItem) => {
    const existingIndex = result.findIndex(item => item.name === newItem.name)
    if (existingIndex >= 0) {
      // 已存在，添加主体类型标识
      if (!result[existingIndex].supportedTypes) {
        result[existingIndex].supportedTypes = []
      }
      if (!result[existingIndex].supportedTypes.includes(entityType)) {
        result[existingIndex].supportedTypes.push(entityType)
      }
    } else {
      // 不存在，添加新类目
      result.push({
        ...newItem,
        supportedTypes: [entityType]
      })
    }
  })

  return result
}

export default {
  companyCategories,
  personalCategories,
  overseasCategories
}
