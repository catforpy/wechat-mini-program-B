<template>
  <view class="company-detail-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">{{ companyData.basicInfo?.companyName || '企业详情' }}</text>
      </view>
    </view>

    <scroll-view
      class="content-scroll"
      scroll-y
      :style="{ paddingTop: (statusBarHeight + 44) + 'px' }"
    >
      <!-- 共性模块：基础展示 -->
      <CompanyBasicInfo :info="companyData.basicInfo" :mediaInfo="companyData.media" />

      <!-- 共性模块：企业介绍 -->
      <CompanyIntro :intro="companyData.introduction" />

      <!-- 共性模块：宣传内容 -->
      <CompanyMedia :media="companyData.media" />

      <!-- 行业特性模块：根据行业类型动态渲染 -->
      <!-- 物流服务 -->
      <LogisticsContent
        v-if="companyData.basicInfo?.industryType === '物流服务'"
        :logisticsInfo="companyData.logisticsInfo"
      />

      <!-- 教育服务 -->
      <EducationContent
        v-if="companyData.basicInfo?.industryType === '教育服务'"
        :educationInfo="companyData.educationInfo"
      />

      <!-- 文娱类 -->
      <EntertainmentContent
        v-if="companyData.basicInfo?.industryType === '文娱类'"
        :entertainmentInfo="companyData.entertainmentInfo"
      />

      <!-- 电商平台 -->
      <ECommerceContent
        v-if="companyData.basicInfo?.industryType === '电商平台'"
        :ecommerceInfo="companyData.ecommerceInfo"
      />

      <!-- 共性模块：用户评价 -->
      <CompanyReviews :reviews="companyData.reviews" />

      <!-- 共性模块：联系方式 -->
      <CompanyContact :contact="companyData.contact" />

      <!-- 招聘信息模块（如果企业发布了招聘） -->
      <view v-if="hasRecruitment" class="recruitment-section">
        <view class="section-header">
          <text class="section-title">🎯 招聘信息</text>
          <view class="recruitment-badge-active">
            <text class="badge-text">正在招聘</text>
          </view>
        </view>

        <view class="recruitment-content">
          <view class="recruitment-info">
            <text class="info-label">招聘企业：</text>
            <text class="info-value">{{ companyData.basicInfo?.companyName }}</text>
          </view>

          <view v-if="recruitmentData.positions && recruitmentData.positions.length > 0" class="positions-list">
            <text class="positions-title">招聘岗位：</text>
            <view
              v-for="(position, index) in recruitmentData.positions"
              :key="index"
              class="position-item"
            >
              <text class="position-name">{{ position.name || '职位' }}</text>
              <text class="position-salary">{{ position.salary || '面议' }}</text>
            </view>
          </view>

          <view class="recruitment-desc">
            <text class="desc-label">职位描述：</text>
            <text class="desc-text">{{ recruitmentData.description || '我们期待优秀的你加入我们的团队！' }}</text>
          </view>

          <view class="recruitment-requirements">
            <text class="req-label">任职要求：</text>
            <text class="req-text">{{ recruitmentData.requirements || '1. 相关工作经验优先\n2. 良好的沟通能力\n3. 团队合作精神' }}</text>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view style="height: 100rpx;"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <!-- 如果企业发布了招聘，显示投递简历按钮 -->
      <button
        v-if="hasRecruitment"
        class="action-btn recruitment"
        @tap="handleDeliverResume"
      >
        📄 投递简历
      </button>
      <button class="action-btn primary" @tap="handleContact">联系商家</button>
      <button class="action-btn secondary" @tap="handleCollect">收藏</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import CompanyBasicInfo from '@/components/company/CompanyBasicInfo.vue'
import CompanyIntro from '@/components/company/CompanyIntro.vue'
import CompanyMedia from '@/components/company/CompanyMedia.vue'
import LogisticsContent from '@/components/company/LogisticsContent.vue'
import EducationContent from '@/components/company/EducationContent.vue'
import EntertainmentContent from '@/components/company/EntertainmentContent.vue'
import ECommerceContent from '@/components/company/ECommerceContent.vue'
import CompanyReviews from '@/components/company/CompanyReviews.vue'
import CompanyContact from '@/components/company/CompanyContact.vue'

// 状态栏高度
const statusBarHeight = ref(0)
const safeAreaBottom = ref(0)

// 公司数据
const companyData = ref<any>({})

// 当前企业ID
const currentCompanyId = ref('')

// 是否有招聘信息
const hasRecruitment = ref(false)

// 招聘数据
const recruitmentData = ref<any>({
  positions: [],
  description: '',
  requirements: ''
})

// onLoad 生命周期 - 页面加载时接收参数
onLoad((options: any) => {
  console.log('========================================')
  console.log('🔥 onLoad 触发')
  console.log('📋 onLoad 接收到的参数:', JSON.stringify(options))
  console.log('========================================')

  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
  safeAreaBottom.value = systemInfo.safeAreaInsets?.bottom || 0

  const companyId = options?.id
  const industry = decodeURIComponent(options?.industry || '物流服务')

  // 保存当前企业ID
  currentCompanyId.value = companyId || ''

  console.log('📋 页面参数 - id:', companyId, '(类型:', typeof companyId, ')')
  console.log('📋 页面参数 - industry:', industry)

  // 加载企业详情数据（模拟数据）
  loadCompanyData(companyId, industry)

  // 检查是否有招聘信息
  checkRecruitmentStatus(companyId)

  console.log('========================================')
  console.log('页面 onLoad 执行完成')
  console.log('========================================')
})

onMounted(() => {
  console.log('✅ onMounted 执行（仅用于补充操作）')
  // 系统信息已经在 onLoad 中获取了
})

// 加载企业详情数据
const loadCompanyData = (id: string | undefined, industry: string) => {
  console.log('=== 开始加载数据 ===')
  console.log('传入的 id:', id, '类型:', typeof id)
  console.log('传入的 industry:', industry)

  // 如果没有id，给出提示
  if (!id) {
    console.warn('警告：企业ID为空，使用默认数据（顺丰速运）')
  }

  // 首先检查是否是用户发布的企业（ID 包含 company_ 或 individual_ 或 personal_）
  if (id && (id.includes('company_') || id.includes('individual_'))) {
    console.log('检测到用户发布的企业，从本地存储加载')
    const publishedCompany = loadPublishedCompanyById(id)
    if (publishedCompany) {
      companyData.value = publishedCompany
      console.log('成功加载用户发布的企业:', publishedCompany.basicInfo?.companyName)
      console.log('=== 数据加载完成 ===')
      return
    }
  }

  // 根据企业ID返回对应的模拟数据
  let data
  if (id === '1') {
    console.log('匹配到：顺丰速运')
    data = getSFMockData()
  } else if (id === '2') {
    console.log('匹配到：京东物流')
    data = getJDFMockData()
  } else if (id === '3') {
    console.log('匹配到：中通快递')
    data = getZTOMockData()
  } else if (id === '4') {
    console.log('匹配到：学而思')
    data = getXESMockData()
  } else if (id === '5') {
    console.log('匹配到：新东方')
    data = getXDFMockData()
  } else if (id === '22') {
    console.log('匹配到：网易云音乐')
    data = getDouyinMockData() // 暂时复用抖音数据
  } else if (id === '25') {
    console.log('匹配到：淘宝')
    data = getTaobaoMockData()
  } else if (id === '26') {
    console.log('匹配到：京东')
    data = getJDShoppingMockData()
  } else if (id === '27') {
    console.log('匹配到：拼多多')
    data = getPDDMockData()
  } else if (id === '29') {
    console.log('匹配到：美团外卖')
    data = getMeituanMockData()
  } else if (id === '31') {
    console.log('匹配到：微信')
    data = getWeixinMockData()
  } else {
    console.log('未匹配到ID，使用默认数据（顺丰速运）')
    data = getSFMockData()
  }

  companyData.value = data
  console.log('最终加载的企业名称:', data.basicInfo?.companyName)
  console.log('=== 数据加载完成 ===')
}

// 从本地存储加载用户发布的企业数据
const loadPublishedCompanyById = (id: string) => {
  try {
    // 先从已发布企业中查找
    const publishedCompaniesStr = uni.getStorageSync('published_companies')
    if (publishedCompaniesStr) {
      const publishedCompanies: any[] = JSON.parse(publishedCompaniesStr)
      const company = publishedCompanies.find(c => c.id === id)
      if (company) {
        console.log('从已发布企业中找到:', company.name)
        return convertToCompanyData(company)
      }
    }

    // 如果在已发布企业中没找到，从名片中查找
    const cardsStr = uni.getStorageSync('my_cards')
    if (cardsStr) {
      const cards: any[] = JSON.parse(cardsStr)
      const card = cards.find(c => c.id === id)
      if (card) {
        console.log('从名片中找到:', card.basicInfo?.name || card.basicInfo?.companyName)
        return convertToCompanyData(card)
      }
    }

    console.log('未找到对应的企业数据')
    return null
  } catch (e) {
    console.error('加载用户发布企业数据失败:', e)
    return null
  }
}

// 将用户发布的企业/名片数据转换为页面所需的格式
const convertToCompanyData = (data: any) => {
  const basicInfo = data.basicInfo || {}
  const companyName = basicInfo.name || basicInfo.companyName || '未命名企业'
  const isIndividual = data.type === 'individual'

  return {
    basicInfo: {
      companyName: companyName,
      logo: basicInfo.logo || '',
      industryType: data.categories?.[0] || '其他服务',
      establishedDate: basicInfo.establishedDate || '未知',
      scale: basicInfo.scale || '规模未知',
      rating: 4.5,
      reviewCount: 0,
      // 添加更多字段
      taxNumber: basicInfo.taxNumber || '',
      address: basicInfo.address || '',
      phone: basicInfo.phone || '',
      email: basicInfo.email || '',
      businessScope: basicInfo.businessScope || ''
    },
    introduction: {
      summary: isIndividual ? '个体工商户' : `欢迎了解${companyName}`,
      culture: '以客户为中心',
      history: []
    },
    media: {
      videoUrl: '',
      videos: [],
      images: []
    },
    contact: {
      address: basicInfo.address || '暂无地址',
      phone: basicInfo.phone || '暂无电话',
      email: basicInfo.email || '暂无邮箱',
      website: '',
      wechat: '',
      hours: '周一至周日 9:00-18:00'
    },
    reviews: []
  }
}

// 顺丰速运模拟数据
const getSFMockData = () => ({
  basicInfo: {
    companyName: '顺丰速运',
    logo: 'https://picsum.photos/200/200?random=30',
    industryType: '物流服务',
    establishedDate: '1993-01-01',
    scale: '员工50万人、网点1.8万个',
    rating: 4.8,
    reviewCount: 125680
  },
  introduction: {
    summary: '顺丰速运是中国领先的快递物流综合服务商，致力于成为行业领先的综合物流服务商。',
    culture: '以客户为中心，以奋斗者为本',
    history: [
      { year: '1993', event: '顺丰在广东顺德成立' },
      { year: '2002', event: '成立航空公司' },
      { year: '2017', event: '在深圳证券交易所上市' }
    ]
  },
  media: {
    videoUrl: 'https://example.com/video.mp4',
    videos: [
      {
        title: '顺丰速运企业宣传片',
        cover: 'https://picsum.photos/280/180?random=50',
        url: 'https://example.com/video.mp4',
        duration: '3:25'
      },
      {
        title: '智能分拣中心',
        cover: 'https://picsum.photos/280/180?random=51',
        url: 'https://example.com/video2.mp4',
        duration: '2:18'
      }
    ],
    bannerImages: [
      'https://picsum.photos/750/400?random=10',
      'https://picsum.photos/750/400?random=11',
      'https://picsum.photos/750/400?random=12'
    ],
    certificates: [
      { name: '国家5A级物流企业', image: 'https://picsum.photos/220/280?random=60', date: '2020年获得' },
      { name: '高新技术企业', image: 'https://picsum.photos/220/280?random=61', date: '2018年获得' },
      { name: '中国驰名商标', image: 'https://picsum.photos/220/280?random=62', date: '2015年获得' },
      { name: 'ISO9001认证', image: 'https://picsum.photos/220/280?random=63', date: '2010年获得' }
    ],
    environments: [
      { name: '智能分拣中心', image: 'https://picsum.photos/300/300?random=70' },
      { name: '营业网点', image: 'https://picsum.photos/300/300?random=71' },
      { name: '物流车队', image: 'https://picsum.photos/300/300?random=72' },
      { name: '客服中心', image: 'https://picsum.photos/300/300?random=73' },
      { name: '仓储中心', image: 'https://picsum.photos/300/300?random=74' },
      { name: '转运中心', image: 'https://picsum.photos/300/300?random=75' }
    ]
  },
  logisticsInfo: {
    fleet: {
      totalVehicles: 20000,
      vehicleTypes: [
        { type: '9.6米厢式货车', count: 8000, image: 'https://picsum.photos/300/200?random=80' },
        { type: '冷链车', count: 3000, image: 'https://picsum.photos/300/200?random=81' },
        { type: '电动车', count: 9000, image: 'https://picsum.photos/300/200?random=82' }
      ]
    },
    serviceArea: {
      coverageCities: 334,
      distributionMap: 'https://picsum.photos/750/400?random=90',
      deliveryTime: [
        { route: '同城', time: '当日达', price: '12元起' },
        { route: '省内', time: '次日达', price: '18元起' },
        { route: '跨省', time: '48小时达', price: '23元起' }
      ]
    },
    team: {
      drivers: [
        { name: '张师傅', experience: 10, orders: 50000, rating: 4.9, photo: 'https://picsum.photos/100/100?random=100' },
        { name: '李师傅', experience: 8, orders: 42000, rating: 4.8, photo: 'https://picsum.photos/100/100?random=101' },
        { name: '王师傅', experience: 12, orders: 68000, rating: 5.0, photo: 'https://picsum.photos/100/100?random=102' }
      ]
    },
    features: [
      { title: '24小时不间断服务', desc: '全天候为您服务', icon: '🕐' },
      { title: '全程GPS定位', desc: '实时追踪货物位置', icon: '📍' },
      { title: '保价服务', desc: '货物损坏全额赔付', icon: '🛡️' },
      { title: '上门取件', desc: '1小时响应上门', icon: '🚚' }
    ],
    smartServices: {
      appUrl: 'https://www.sf-express.com',
      qrCode: 'https://picsum.photos/200/200?random=110',
      features: [
        { name: '在线下单', desc: '手机一键下单', image: 'https://picsum.photos/150/150?random=111' },
        { name: '运费查询', desc: '透明报价', image: 'https://picsum.photos/150/150?random=112' },
        { name: '实时追踪', desc: '货物位置实时掌握', image: 'https://picsum.photos/150/150?random=113' }
      ]
    },
    guarantee: {
      safetyMeasures: [
        { title: '货物保险', desc: '全程保险保障', image: 'https://picsum.photos/100/100?random=120' },
        { title: '专人押运', desc: '贵重物品专人看管', image: 'https://picsum.photos/100/100?random=121' },
        { title: '全程监控', desc: '运输过程全程录像', image: 'https://picsum.photos/100/100?random=122' }
      ]
    },
    cases: [
      { name: '华为', logo: 'https://picsum.photos/100/100?random=130', cooperation: '战略合作伙伴' },
      { name: '苹果', logo: 'https://picsum.photos/100/100?random=131', cooperation: '全球物流合作' },
      { name: '小米', logo: 'https://picsum.photos/100/100?random=132', cooperation: '物流服务商' }
    ]
  },
  reviews: [
    { user: '用户A', avatar: 'https://picsum.photos/50/50?random=140', rating: 5, content: '速度快，服务好！', time: '2025-02-18' },
    { user: '用户B', avatar: 'https://picsum.photos/50/50?random=141', rating: 4, content: '整体满意，价格有点贵', time: '2025-02-17' },
    { user: '用户C', avatar: 'https://picsum.photos/50/50?random=142', rating: 5, content: '物流准时，包装完好', time: '2025-02-16' }
  ],
  contact: {
    servicePhone: '95338',
    complaintPhone: '95338',
    address: '广东省深圳市宝安区福永街道',
    website: 'https://www.sf-express.com',
    wechatQr: 'https://picsum.photos/200/200?random=150'
  }
})

// 京东物流模拟数据
const getJDFMockData = () => ({
  basicInfo: {
    companyName: '京东物流',
    logo: 'https://picsum.photos/200/200?random=31',
    industryType: '物流服务',
    establishedDate: '2017-01-01',
    scale: '员工40万人、网点5000个',
    rating: 4.9,
    reviewCount: 98500
  },
  introduction: {
    summary: '京东物流是中国领先的技术驱动的供应链解决方案及物流服务商，致力于成为全球最值得信赖的供应链基础设施服务商。',
    culture: '技术驱动，供应链赋能',
    history: [
      { year: '2017', event: '京东物流独立运营' },
      { year: '2018', event: '开放物流服务' },
      { year: '2022', event: '在香港上市' }
    ]
  },
  media: {
    videoUrl: 'https://example.com/video.mp4',
    videos: [
      {
        title: '京东物流品牌宣传',
        cover: 'https://picsum.photos/280/180?random=52',
        url: 'https://example.com/video.mp4',
        duration: '3:45'
      },
      {
        title: '智能仓储中心',
        cover: 'https://picsum.photos/280/180?random=53',
        url: 'https://example.com/video2.mp4',
        duration: '2:30'
      }
    ],
    bannerImages: [
      'https://picsum.photos/750/400?random=13',
      'https://picsum.photos/750/400?random=14',
      'https://picsum.photos/750/400?random=15'
    ],
    certificates: [
      { name: '国家5A级物流企业', image: 'https://picsum.photos/220/280?random=64', date: '2021年获得' },
      { name: '智能物流示范基地', image: 'https://picsum.photos/220/280?random=65', date: '2020年获得' },
      { name: '绿色物流企业', image: 'https://picsum.photos/220/280?random=66', date: '2019年获得' }
    ],
    environments: [
      { name: '智能仓库', image: 'https://picsum.photos/300/300?random=76' },
      { name: '配送站', image: 'https://picsum.photos/300/300?random=77' },
      { name: '无人车', image: 'https://picsum.photos/300/300?random=78' },
      { name: '分拣中心', image: 'https://picsum.photos/300/300?random=79' }
    ]
  },
  logisticsInfo: {
    fleet: {
      totalVehicles: 15000,
      vehicleTypes: [
        { type: '新能源货车', count: 5000, image: 'https://picsum.photos/300/200?random=83' },
        { type: '冷链车', count: 2000, image: 'https://picsum.photos/300/200?random=84' },
        { type: '无人机', count: 8000, image: 'https://picsum.photos/300/200?random=85' }
      ]
    },
    serviceArea: {
      coverageCities: 300,
      distributionMap: 'https://picsum.photos/750/400?random=91',
      deliveryTime: [
        { route: '同城', time: '当日达', price: '10元起' },
        { route: '省内', time: '次日达', price: '15元起' },
        { route: '跨省', time: '48小时达', price: '20元起' }
      ]
    },
    team: {
      drivers: [
        { name: '赵师傅', experience: 8, orders: 35000, rating: 4.8, photo: 'https://picsum.photos/100/100?random=103', intro: '服务态度好' },
        { name: '钱师傅', experience: 6, orders: 28000, rating: 4.9, photo: 'https://picsum.photos/100/100?random=104', intro: '配送速度快' }
      ]
    },
    features: [
      { title: '211限时达', desc: '上午11点前下单当日送达', icon: '⚡' },
      { title: '冷链配送', desc: '全程温控保证新鲜', icon: '❄️' },
      { title: '上门安装', desc: '大件商品专业安装', icon: '🔧' },
      { title: '代客包装', desc: '专业包装服务', icon: '📦' }
    ],
    smartServices: {
      appUrl: 'https://www.jdl.com',
      qrCode: 'https://picsum.photos/200/200?random=111',
      features: [
        { name: '上门取件', desc: '一键预约', image: 'https://picsum.photos/150/150?random=114' },
        { name: '运费查询', desc: '价格透明', image: 'https://picsum.photos/150/150?random=115' },
        { name: '实时追踪', desc: '全程可视化', image: 'https://picsum.photos/150/150?random=116' }
      ]
    },
    guarantee: {
      safetyMeasures: [
        { title: '保价服务', desc: '损坏全额赔付', image: 'https://picsum.photos/100/100?random=123' },
        { title: '全程保险', desc: '货物安全保障', image: 'https://picsum.photos/100/100?random=124' },
        { title: '签单返还', desc: '签收回单服务', image: 'https://picsum.photos/100/100?random=125' }
      ]
    },
    cases: [
      { name: '京东商城', logo: 'https://picsum.photos/100/100?random=133', cooperation: '战略合作' },
      { name: '沃尔玛', logo: 'https://picsum.photos/100/100?random=134', cooperation: '物流合作伙伴' },
      { name: '小米', logo: 'https://picsum.photos/100/100?random=135', cooperation: '供应链合作' }
    ]
  },
  reviews: [
    { user: '用户A', avatar: 'https://picsum.photos/50/50?random=143', rating: 5, content: '速度很快，服务好', time: '2025-02-18' },
    { user: '用户B', avatar: 'https://picsum.photos/50/50?random=144', rating: 5, content: '包装仔细，没有损坏', time: '2025-02-17' }
  ],
  contact: {
    servicePhone: '950616',
    complaintPhone: '950616',
    address: '北京市亦庄经济开发区科创十一街',
    website: 'https://www.jdl.com',
    wechatQr: 'https://picsum.photos/200/200?random=151'
  }
})

// 中通快递模拟数据
const getZTOMockData = () => ({
  basicInfo: {
    companyName: '中通快递',
    logo: 'https://picsum.photos/200/200?random=32',
    industryType: '物流服务',
    establishedDate: '2002-05-08',
    scale: '员工30万人、网点3万个',
    rating: 4.6,
    reviewCount: 78600
  },
  introduction: {
    summary: '中通快递是中国知名的快递品牌，以"笔扫千军"、"通达天下"为使命，致力于成为全球一流的综合物流服务商。',
    culture: '同建共享，从容递进',
    history: [
      { year: '2002', event: '中通快递成立' },
      { year: '2016', event: '在美国纽交所上市' },
      { year: '2020', event: '日均业务量突破5000万票' }
    ]
  },
  media: {
    videoUrl: 'https://example.com/video.mp4',
    videos: [
      {
        title: '中通快递企业介绍',
        cover: 'https://picsum.photos/280/180?random=54',
        url: 'https://example.com/video.mp4',
        duration: '4:10'
      }
    ],
    bannerImages: [
      'https://picsum.photos/750/400?random=16',
      'https://picsum.photos/750/400?random=17',
      'https://picsum.photos/750/400?random=18'
    ],
    certificates: [
      { name: '国家5A级物流企业', image: 'https://picsum.photos/220/280?random=67', date: '2019年获得' },
      { name: '中国快递示范企业', image: 'https://picsum.photos/220/280?random=68', date: '2018年获得' }
    ],
    environments: [
      { name: '转运中心', image: 'https://picsum.photos/300/300?random=80' },
      { name: '服务网点', image: 'https://picsum.photos/300/300?random=81' },
      { name: '物流车队', image: 'https://picsum.photos/300/300?random=82' }
    ]
  },
  logisticsInfo: {
    fleet: {
      totalVehicles: 12000,
      vehicleTypes: [
        { type: '干线卡车', count: 6000, image: 'https://picsum.photos/300/200?random=86' },
        { type: '派送三轮车', count: 6000, image: 'https://picsum.photos/300/200?random=87' }
      ]
    },
    serviceArea: {
      coverageCities: 334,
      distributionMap: 'https://picsum.photos/750/400?random=92',
      deliveryTime: [
        { route: '江浙沪', time: '次日达', price: '8元起' },
        { route: '全国', time: '3-4天', price: '12元起' }
      ]
    },
    team: {
      drivers: [
        { name: '孙师傅', experience: 7, orders: 32000, rating: 4.7, photo: 'https://picsum.photos/100/100?random=105', intro: '经验丰富' }
      ]
    },
    features: [
      { title: '价格实惠', desc: '性价比高', icon: '💰' },
      { title: '网络覆盖广', desc: '乡镇可达', icon: '🌐' },
      { title: '上门取件', desc: '方便快捷', icon: '🚚' },
      { title: '保价服务', desc: '安全保障', icon: '🛡️' }
    ],
    smartServices: {
      appUrl: 'https://www.zto.com',
      qrCode: 'https://picsum.photos/200/200?random=112',
      features: [
        { name: '查快递', desc: '一键查询', image: 'https://picsum.photos/150/150?random=117' },
        { name: '寄快递', desc: '在线下单', image: 'https://picsum.photos/150/150?random=118' },
        { name: '网点查询', desc: '附近网点', image: 'https://picsum.photos/150/150?random=119' }
      ]
    },
    guarantee: {
      safetyMeasures: [
        { title: '货物保险', desc: '全程保障', image: 'https://picsum.photos/100/100?random=126' },
        { title: '遗失赔付', desc: '快速处理', image: 'https://picsum.photos/100/100?random=127' }
      ]
    },
    cases: [
      { name: '淘宝', logo: 'https://picsum.photos/100/100?random=136', cooperation: '战略合作伙伴' },
      { name: '拼多多', logo: 'https://picsum.photos/100/100?random=137', cooperation: '物流服务商' }
    ]
  },
  reviews: [
    { user: '用户C', avatar: 'https://picsum.photos/50/50?random=145', rating: 4, content: '价格便宜，速度还行', time: '2025-02-18' },
    { user: '用户D', avatar: 'https://picsum.photos/50/50?random=146', rating: 5, content: '网点多，寄取方便', time: '2025-02-17' }
  ],
  contact: {
    servicePhone: '95311',
    complaintPhone: '95311',
    address: '上海市青浦区华新镇',
    website: 'https://www.zto.com',
    wechatQr: 'https://picsum.photos/200/200?random=152'
  }
})

// 学而思模拟数据
const getXESMockData = () => ({
  basicInfo: {
    companyName: '学而思',
    logo: 'https://picsum.photos/200/200?random=40',
    industryType: '教育服务',
    establishedDate: '2003-01-01',
    scale: '教师10000+人、学员100万+',
    rating: 4.9,
    reviewCount: 89650
  },
  introduction: {
    summary: '学而思是国内领先的中小学教育机构，致力于为孩子提供优质的K12教育服务。',
    culture: '激发兴趣，培养习惯，塑造品格',
    history: [
      { year: '2003', event: '学而思成立' },
      { year: '2010', event: '在全国开设分校' },
      { year: '2019', event: '成为纽交所上市公司' }
    ]
  },
  media: {
    videoUrl: 'https://example.com/video.mp4',
    videos: [
      {
        title: '学而思品牌介绍',
        cover: 'https://picsum.photos/280/180?random=200',
        url: 'https://example.com/video.mp4',
        duration: '4:12'
      },
      {
        title: '教学环境展示',
        cover: 'https://picsum.photos/280/180?random=201',
        url: 'https://example.com/video2.mp4',
        duration: '2:56'
      }
    ],
    bannerImages: [
      'https://picsum.photos/750/400?random=20',
      'https://picsum.photos/750/400?random=21',
      'https://picsum.photos/750/400?random=22'
    ],
    certificates: [
      { name: '教育培训机构许可证', image: 'https://picsum.photos/220/280?random=210', date: '2010年获得' },
      { name: '诚信办学单位', image: 'https://picsum.photos/220/280?random=211', date: '2015年获得' },
      { name: 'ISO9001认证', image: 'https://picsum.photos/220/280?random=212', date: '2018年获得' }
    ],
    environments: [
      { name: '多媒体教室', image: 'https://picsum.photos/300/300?random=220' },
      { name: '图书馆', image: 'https://picsum.photos/300/300?random=221' },
      { name: '科学实验室', image: 'https://picsum.photos/300/300?random=222' },
      { name: '活动中心', image: 'https://picsum.photos/300/300?random=223' },
      { name: '家长休息区', image: 'https://picsum.photos/300/300?random=224' },
      { name: '咨询中心', image: 'https://picsum.photos/300/300?random=225' }
    ]
  },
  educationInfo: {
    teachers: {
      totalTeachers: 10000,
      seniorTeachers: 3000,
      foreignTeachers: 500,
      famousTeachers: [
        { name: '张老师', title: '特级教师', subject: '数学', experience: 20, photo: 'https://picsum.photos/100/100?random=230', intro: '20年数学教学经验' },
        { name: '李老师', title: '高级教师', subject: '语文', experience: 15, photo: 'https://picsum.photos/100/100?random=231', intro: '省级骨干教师' },
        { name: '王老师', title: '外教', subject: '英语', experience: 10, photo: 'https://picsum.photos/100/100?random=232', intro: '来自美国的外教' }
      ]
    },
    courses: {
      categories: [
        { name: '数学', courses: [
          { name: '小学数学思维', intro: '培养数学思维', price: 2999, students: 5000, image: 'https://picsum.photos/200/200?random=240' },
          { name: '初中数学提升', intro: '快速提升成绩', price: 3999, students: 4000, image: 'https://picsum.photos/200/200?random=241' }
        ]},
        { name: '语文', courses: [
          { name: '阅读写作', intro: '提升读写能力', price: 2599, students: 3500, image: 'https://picsum.photos/200/200?random=242' }
        ]},
        { name: '英语', courses: [
          { name: '少儿英语', intro: '快乐学英语', price: 3499, students: 4500, image: 'https://picsum.photos/200/200?random=243' }
        ]}
      ],
      hotCourses: [
        { name: '小学数学思维班', intro: '培养数学思维能力', sessions: 24, price: 2999, students: 5000, rating: 4.9, image: 'https://picsum.photos/300/200?random=250' },
        { name: '新概念英语', intro: '系统学习英语', sessions: 30, price: 3999, students: 4000, rating: 4.8, image: 'https://picsum.photos/300/200?random=251' }
      ]
    },
    students: [
      { name: '小明', course: '小学数学', result: '成绩提升30分', photo: 'https://picsum.photos/100/100?random=260', achievement: '数学竞赛一等奖' },
      { name: '小红', course: '阅读写作', result: '作文满分', photo: 'https://picsum.photos/100/100?random=261', achievement: '作文比赛金奖' }
    ],
    environment: {
      campusCount: 50,
      facilities: [
        { name: '多媒体教室', desc: '现代化教学设备', images: ['https://picsum.photos/300/200?random=270'] },
        { name: '图书馆', desc: '丰富的学习资源', images: ['https://picsum.photos/300/200?random=271'] },
        { name: '科学实验室', desc: '动手实践', images: ['https://picsum.photos/300/200?random=272'] }
      ]
    },
    features: [
      { title: '小班教学', desc: '每班15-20人', icon: '👥' },
      { title: '个性化辅导', desc: '因材施教', icon: '📝' },
      { title: '家校互动', desc: '实时反馈', icon: '💬' },
      { title: '线上线下结合', desc: 'OMO教学模式', icon: '🔄' }
    ],
    enrollment: {
      target: '6-18岁中小学生',
      quota: 1000,
      classTypes: [
        { type: '一对一', students: 1, time: '灵活安排' },
        { type: '精品小班', students: 15, time: '周末/平时晚上' },
        { type: '在线课程', students: 50, time: '随时学习' }
      ]
    }
  },
  reviews: [
    { user: '家长A', avatar: 'https://picsum.photos/50/50?random=280', rating: 5, content: '老师很专业，孩子很喜欢', time: '2025-02-18' },
    { user: '家长B', avatar: 'https://picsum.photos/50/50?random=281', rating: 5, content: '成绩提升明显', time: '2025-02-17' },
    { user: '家长C', avatar: 'https://picsum.photos/50/50?random=282', rating: 4, content: '价格稍贵，但值得', time: '2025-02-16' }
  ],
  contact: {
    servicePhone: '10108888',
    address: '北京市海淀区中关村大街',
    website: 'https://www.xueersi.com',
    wechatQr: 'https://picsum.photos/200/200?random=290'
  }
})

// 新东方模拟数据
const getXDFMockData = () => ({
  basicInfo: {
    companyName: '新东方',
    logo: 'https://picsum.photos/200/200?random=41',
    industryType: '教育服务',
    establishedDate: '1993-11-16',
    scale: '教师8000+人、学员1000万+',
    rating: 4.8,
    reviewCount: 125000
  },
  introduction: {
    summary: '新东方是中国知名的综合性教育集团，致力于为中国学生提供优质的出国考试培训、基础教育、学前教育等服务。',
    culture: '追求卓越，挑战极限',
    history: [
      { year: '1993', event: '新东方成立' },
      { year: '2006', event: '在纽约证券交易所上市' },
      { year: '2020', event: '直播带货转型成功' }
    ]
  },
  media: {
    videoUrl: 'https://example.com/video.mp4',
    videos: [
      {
        title: '新东方品牌介绍',
        cover: 'https://picsum.photos/280/180?random=202',
        url: 'https://example.com/video.mp4',
        duration: '5:20'
      },
      {
        title: '俞敏洪演讲',
        cover: 'https://picsum.photos/280/180?random=203',
        url: 'https://example.com/video2.mp4',
        duration: '3:15'
      }
    ],
    bannerImages: [
      'https://picsum.photos/750/400?random=23',
      'https://picsum.photos/750/400?random=24',
      'https://picsum.photos/750/400?random=25'
    ],
    certificates: [
      { name: '教育培训机构许可证', image: 'https://picsum.photos/220/280?random=213', date: '2005年获得' },
      { name: '诚信办学单位', image: 'https://picsum.photos/220/280?random=214', date: '2010年获得' },
      { name: '中国驰名商标', image: 'https://picsum.photos/220/280?random=215', date: '2008年获得' }
    ],
    environments: [
      { name: '高端教室', image: 'https://picsum.photos/300/300?random=226' },
      { name: 'VIP学习室', image: 'https://picsum.photos/300/300?random=227' },
      { name: '多功能厅', image: 'https://picsum.photos/300/300?random=228' },
      { name: '图书阅览区', image: 'https://picsum.photos/300/300?random=229' }
    ]
  },
  educationInfo: {
    teachers: {
      totalTeachers: 8000,
      seniorTeachers: 2500,
      foreignTeachers: 800,
      famousTeachers: [
        { name: '俞敏洪', title: '创始人', subject: '英语', experience: 30, photo: 'https://picsum.photos/100/100?random=233', intro: '新东方创始人' },
        { name: '罗永浩', title: '前名师', subject: '英语', experience: 15, photo: 'https://picsum.photos/100/100?random=234', intro: '知名英语老师' }
      ]
    },
    courses: {
      categories: [
        { name: '英语', courses: [
          { name: '托福', intro: '出国考试培训', price: 5999, students: 8000, image: 'https://picsum.photos/200/200?random=244' },
          { name: '雅思', intro: '英联邦考试', price: 5599, students: 7500, image: 'https://picsum.photos/200/200?random=245' },
          { name: 'GRE', intro: '研究生入学考试', price: 4999, students: 3000, image: 'https://picsum.photos/200/200?random=246' }
        ]},
        { name: '考研', courses: [
          { name: '考研英语', intro: '考研必备', price: 3999, students: 12000, image: 'https://picsum.photos/200/200?random=247' }
        ]}
      ],
      hotCourses: [
        { name: '托福冲刺班', intro: '短期快速提分', sessions: 30, price: 5999, students: 8000, rating: 4.9, image: 'https://picsum.photos/300/200?random=252' },
        { name: '雅思基础班', intro: '零基础入门', sessions: 40, price: 5599, students: 7500, rating: 4.8, image: 'https://picsum.photos/300/200?random=253' }
      ]
    },
    students: [
      { name: '李华', course: '托福', result: '考了110分', photo: 'https://picsum.photos/100/100?random=262', achievement: '被哈佛录取' },
      { name: '王明', course: '雅思', result: '考了8分', photo: 'https://picsum.photos/100/100?random=263', achievement: '被剑桥录取' }
    ],
    environment: {
      campusCount: 80,
      facilities: [
        { name: '多媒体教室', desc: '先进设备', images: ['https://picsum.photos/300/200?random=273'] },
        { name: '语音室', desc: '专业听力训练', images: ['https://picsum.photos/300/200?random=274'] }
      ]
    },
    features: [
      { title: '名师授课', desc: '顶尖师资', icon: '👨‍🏫' },
      { title: '小班教学', desc: '每班15人', icon: '👥' },
      { title: '个性化辅导', desc: '量身定制', icon: '📋' },
      { title: '学习督导', desc: '全程跟踪', icon: '📊' }
    ],
    enrollment: {
      target: '高中生、大学生',
      quota: 2000,
      classTypes: [
        { type: 'VIP一对一', students: 1, time: '灵活安排' },
        { type: '精品小班', students: 15, time: '周末/平时晚上' },
        { type: '集训营', students: 30, time: '寒暑假' }
      ]
    }
  },
  reviews: [
    { user: '学生A', avatar: 'https://picsum.photos/50/50?random=283', rating: 5, content: '老师很棒，托福考了110', time: '2025-02-18' },
    { user: '学生B', avatar: 'https://picsum.photos/50/50?random=284', rating: 4, content: '价格贵但效果好', time: '2025-02-17' }
  ],
  contact: {
    servicePhone: '400-617-1717',
    address: '北京市海淀区海淀西大街',
    website: 'https://www.xdf.cn',
    wechatQr: 'https://picsum.photos/200/200?random=291'
  }
})

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 联系商家
const handleContact = () => {
  uni.showToast({
    title: '正在联系商家...',
    icon: 'success'
  })
}

// 收藏
const handleCollect = () => {
  uni.showToast({
    title: '收藏成功',
    icon: 'success'
  })
}

// 检查企业是否发布了招聘
const checkRecruitmentStatus = (companyId: string | undefined) => {
  try {
    // 先检查是否是用户发布的企业
    const saved = uni.getStorageSync('published_recruitments')
    if (saved) {
      const recruitments: string[] = JSON.parse(saved)
      hasRecruitment.value = recruitments.includes(companyId || '')
      console.log('企业招聘状态(用户发布):', hasRecruitment.value)

      // 如果有招聘，加载招聘详情
      if (hasRecruitment.value) {
        loadRecruitmentDetail(companyId || '')
        return
      }
    }

    // 检查是否是假数据企业（这些企业默认有招聘）
    const mockCompaniesWithRecruitment = ['1', '2', '4', '5', '25', '26', '31'] // 顺丰、京东、学而思、新东方、淘宝、京东、微信
    if (companyId && mockCompaniesWithRecruitment.includes(companyId)) {
      hasRecruitment.value = true
      console.log('企业招聘状态(假数据):', hasRecruitment.value)
      loadMockRecruitmentData(companyId)
      return
    }

    hasRecruitment.value = false
  } catch (e) {
    console.error('检查招聘状态失败:', e)
    hasRecruitment.value = false
  }
}

// 加载招聘详情
const loadRecruitmentDetail = (companyId: string) => {
  try {
    const saved = uni.getStorageSync('recruitment_details')
    if (saved) {
      const details: any = JSON.parse(saved)
      const detail = details[companyId]
      if (detail) {
        recruitmentData.value = detail
        console.log('加载招聘详情:', detail)
      } else {
        // 使用默认招聘数据
        setDefaultRecruitmentData()
      }
    } else {
      setDefaultRecruitmentData()
    }
  } catch (e) {
    console.error('加载招聘详情失败:', e)
    setDefaultRecruitmentData()
  }
}

// 加载假数据企业的招聘信息
const loadMockRecruitmentData = (companyId: string) => {
  console.log('加载假数据企业招聘信息:', companyId)

  switch (companyId) {
    case '1': // 顺丰速运
      recruitmentData.value = {
        positions: [
          { name: '快递员', salary: '6K-12K' },
          { name: '物流专员', salary: '5K-10K' },
          { name: '仓储主管', salary: '8K-15K' },
          { name: '客服代表', salary: '4K-8K' }
        ],
        description: '顺丰速运是中国领先的快递物流综合服务商，我们诚邀有志之士加入，共同打造世界一流的物流服务品牌！',
        requirements: '1. 身体健康，能吃苦耐劳\n2. 具备良好的服务意识\n3. 有相关工作经验优先\n4. 持有C1驾照优先（快递员岗位）'
      }
      break

    case '2': // 京东物流
      recruitmentData.value = {
        positions: [
          { name: '配送员', salary: '7K-13K' },
          { name: '分拣员', salary: '5K-9K' },
          { name: '车队调度', salary: '9K-16K' }
        ],
        description: '京东物流以技术驱动，致力于成为全球最值得信赖的供应链解决方案合作伙伴，期待你的加入！',
        requirements: '1. 年龄18-45周岁\n2. 能适应轮班工作\n3. 良好的团队合作精神\n4. 有物流行业经验优先'
      }
      break

    case '4': // 学而思
      recruitmentData.value = {
        positions: [
          { name: '数学老师', salary: '10K-20K' },
          { name: '英语老师', salary: '10K-20K' },
          { name: '课程顾问', salary: '6K-12K' },
          { name: '学习管理师', salary: '7K-14K' }
        ],
        description: '学而思致力于为3-18岁孩子提供优质的在线教育服务，我们期待热爱教育、有责任心的你加入！',
        requirements: '1. 本科及以上学历\n2. 普通话标准，表达能力强\n3. 热爱教育事业\n4. 有教学经验优先'
      }
      break

    case '5': // 新东方
      recruitmentData.value = {
        positions: [
          { name: '雅思托福讲师', salary: '15K-30K' },
          { name: '考研英语教师', salary: '12K-25K' },
          { name: '教育咨询师', salary: '8K-16K' }
        ],
        description: '新东方是中国最大的私立教育服务机构，我们诚邀教育精英加入，一起成就未来！',
        requirements: '1. 硕士及以上学历（讲师岗位）\n2. 英语功底扎实\n3. 有相关考试成绩高分者优先\n4. 具备良好的演讲能力'
      }
      break

    case '25': // 淘宝
      recruitmentData.value = {
        positions: [
          { name: '产品经理', salary: '20K-40K' },
          { name: '运营专员', salary: '12K-25K' },
          { name: '数据分析师', salary: '15K-30K' },
          { name: 'UI设计师', salary: '15K-28K' }
        ],
        description: '淘宝是中国最大的电商平台之一，加入我们，一起塑造零售业的未来！',
        requirements: '1. 本科及以上学历，3年以上相关经验\n2. 熟悉电商行业\n3. 具备良好的数据分析能力\n4. 有大厂经验优先'
      }
      break

    case '26': // 京东
      recruitmentData.value = {
        positions: [
          { name: 'Java开发工程师', salary: '18K-35K' },
          { name: '前端工程师', salary: '16K-32K' },
          { name: '算法工程师', salary: '25K-45K' }
        ],
        description: '京东以技术为本，致力于成为国际领先的供应链技术服务企业，期待技术大牛加入！',
        requirements: '1. 本科及以上学历，计算机相关专业\n2. 扎实的编程基础\n3. 熟悉主流开发框架\n4. 良好的代码风格和文档习惯'
      }
      break

    case '31': // 微信
      recruitmentData.value = {
        positions: [
          { name: 'iOS开发工程师', salary: '25K-50K' },
          { name: 'Android开发工程师', salary: '25K-50K' },
          { name: '产品经理', salary: '30K-60K' }
        ],
        description: '微信连接一切，我们期待有梦想、有能力的你加入，一起打造更好的用户体验！',
        requirements: '1. 本科及以上学历，5年以上开发经验\n2. 精通平台开发语言\n3. 良好的产品思维\n4. 有大型项目经验'
      }
      break

    default:
      setDefaultRecruitmentData()
  }
}

// 设置默认招聘数据
const setDefaultRecruitmentData = () => {
  recruitmentData.value = {
    positions: [
      { name: '销售经理', salary: '8K-15K' },
      { name: '市场专员', salary: '5K-10K' },
      { name: '行政助理', salary: '4K-8K' }
    ],
    description: '我们期待优秀的你加入我们的团队，共同创造美好未来！',
    requirements: '1. 相关工作经验优先\n2. 良好的沟通能力\n3. 团队合作精神\n4. 积极主动的工作态度'
  }
}

// 投递简历
const handleDeliverResume = () => {
  // 获取个人名片数据
  try {
    const cardsStr = uni.getStorageSync('my_cards')
    if (!cardsStr) {
      uni.showModal({
        title: '提示',
        content: '请先完善个人名片信息',
        showCancel: false,
        success: () => {
          uni.navigateTo({
            url: '/pages/profile/my-card'
          })
        }
      })
      return
    }

    const cards: any[] = JSON.parse(cardsStr)
    const personalCard = cards.find(c => c.type === 'personal')

    if (!personalCard) {
      uni.showModal({
        title: '提示',
        content: '请先创建个人名片',
        showCancel: false,
        success: () => {
          uni.navigateTo({
            url: '/pages/profile/my-card'
          })
        }
      })
      return
    }

    // 显示简历信息确认
    const resumeInfo = personalCard.basicInfo
    const resumeList = personalCard.resume || []

    let resumeText = `姓名: ${resumeInfo.name || ''}\n`
    resumeText += `电话: ${resumeInfo.phone || ''}\n`
    resumeText += `邮箱: ${resumeInfo.email || ''}\n`

    if (resumeList.length > 0) {
      resumeText += `\n工作经历:\n`
      resumeList.forEach((item: any) => {
        resumeText += `• ${item.company} - ${item.position}\n`
      })
    }

    uni.showModal({
      title: '确认投递简历',
      content: `确认将以下简历投递给 ${companyData.value.basicInfo?.companyName}？\n\n${resumeText}`,
      confirmText: '确认投递',
      success: (res) => {
        if (res.confirm) {
          // 保存投递记录
          saveResumeDelivery(personalCard)
        }
      }
    })
  } catch (e) {
    console.error('投递简历失败:', e)
    uni.showToast({
      title: '投递失败',
      icon: 'none'
    })
  }
}

// 保存简历投递记录
const saveResumeDelivery = (personalCard: any) => {
  try {
    let deliveries: any[] = []
    const saved = uni.getStorageSync('resume_deliveries')
    if (saved) {
      deliveries = JSON.parse(saved)
    }

    // 检查是否已经投递过
    const alreadyDelivered = deliveries.some(
      (d: any) => d.companyId === currentCompanyId.value && d.personId === personalCard.id
    )

    if (alreadyDelivered) {
      uni.showToast({
        title: '您已投递过该职位',
        icon: 'none'
      })
      return
    }

    // 添加投递记录
    deliveries.push({
      id: `delivery_${Date.now()}`,
      companyId: currentCompanyId.value,
      companyName: companyData.value.basicInfo?.companyName,
      personId: personalCard.id,
      personName: personalCard.basicInfo?.name,
      personPhone: personalCard.basicInfo?.phone,
      personEmail: personalCard.basicInfo?.email,
      resume: personalCard.resume || [],
      qualifications: personalCard.qualifications || [],
      attachments: personalCard.attachments || [],
      deliveryTime: new Date().toISOString(),
      status: 'pending' // pending, viewed, interviewed, hired, rejected
    })

    uni.setStorageSync('resume_deliveries', JSON.stringify(deliveries))

    uni.showToast({
      title: '简历投递成功！',
      icon: 'success',
      duration: 2000
    })
  } catch (e) {
    console.error('保存投递记录失败:', e)
    uni.showToast({
      title: '投递失败',
      icon: 'none'
    })
  }
}

// 抖音模拟数据（文娱类）
const getDouyinMockData = () => ({
  basicInfo: {
    companyName: '抖音',
    logo: 'https://picsum.photos/200/200?random=300',
    industryType: '文娱类',
    establishedDate: '2016-09-01',
    scale: '日活7亿+、创作者5000万+',
    rating: 4.9,
    reviewCount: 580000
  },
  introduction: {
    summary: '抖音是一款短视频社交软件，通过短视频记录美好生活，让世界看见你。',
    culture: '记录美好生活',
    history: [
      { year: '2016', event: '抖音上线' },
      { year: '2018', event: '日活突破1亿' },
      { year: '2020', event: '日活突破6亿' }
    ]
  },
  media: {
    bannerImages: [
      'https://picsum.photos/750/400?random=301',
      'https://picsum.photos/750/400?random=302',
      'https://picsum.photos/750/400?random=303'
    ],
    certificates: [],
    environments: []
  },
  entertainmentInfo: {
    creators: {
      totalCreators: 50000000,
      categories: [
        { name: '颜值达人', count: 10000000 },
        { name: '搞笑达人', count: 8000000 },
        { name: '知识科普', count: 5000000 },
        { name: '美食博主', count: 6000000 }
      ],
      famousCreators: [
        { name: '疯狂小杨哥', field: '搞笑', fans: 100000000, avatar: 'https://picsum.photos/120/120?random=310' },
        { name: '李佳琦', field: '美妆', fans: 80000000, avatar: 'https://picsum.photos/120/120?random=311' },
        { name: '罗永浩', field: '科技', fans: 30000000, avatar: 'https://picsum.photos/120/120?random=312' }
      ]
    },
    contentCategories: [
      { icon: '🎵', name: '音乐', dailyViews: 5000000000, contentCount: 1000000000 },
      { icon: '💃', name: '舞蹈', dailyViews: 3000000000, contentCount: 800000000 },
      { icon: '😂', name: '搞笑', dailyViews: 8000000000, contentCount: 1500000000 }
    ],
    monetization: {
      methods: [
        { icon: '💰', name: '广告分成', desc: '视频播放收益', earning: '最高百万/月' },
        { icon: '🎁', name: '直播打赏', desc: '粉丝礼物收益', earning: '无上限' },
        { icon: '🛒', name: '电商带货', desc: '商品佣金', earning: '爆款日销千万' }
      ]
    },
    business: {
      brands: [
        { name: '华为', logo: 'https://picsum.photos/100/100?random=320' },
        { name: '小米', logo: 'https://picsum.photos/100/100?random=321' },
        { name: '耐克', logo: 'https://picsum.photos/100/100?random=322' }
      ],
      adServices: [
        { name: '开屏广告', price: '500万/天' },
        { name: '信息流广告', price: 'CPM 300元' }
      ]
    },
    community: {
      guarantees: [
        { icon: '🛡️', title: '内容审核', desc: '24小时审核' },
        { icon: '🔒', title: '隐私保护', desc: '数据安全' },
        { icon: '📋', title: '社区规范', desc: '健康内容' }
      ]
    }
  },
  reviews: [
    { user: '用户A', avatar: 'https://picsum.photos/50/50?random=330', rating: 5, content: '内容很丰富', time: '2025-02-20' },
    { user: '用户B', avatar: 'https://picsum.photos/50/50?random=331', rating: 4, content: '容易上瘾', time: '2025-02-19' }
  ],
  contact: {
    servicePhone: '400-999-0000',
    address: '北京市海淀区中关村',
    website: 'https://www.douyin.com',
    wechatQr: 'https://picsum.photos/200/200?random=340'
  }
})

// 哔哩哔哩模拟数据（文娱类）
const getBilibiliMockData = () => ({
  basicInfo: {
    companyName: '哔哩哔哩',
    logo: 'https://picsum.photos/200/200?random=350',
    industryType: '文娱类',
    establishedDate: '2009-06-26',
    scale: '日活8000万+、UP主300万+',
    rating: 4.8,
    reviewCount: 420000
  },
  introduction: {
    summary: '哔哩哔哩是中国领先的年轻人文化社区和视频平台。',
    culture: '记录美好生活，见证世界变化',
    history: [
      { year: '2009', event: 'B站成立' },
      { year: '2018', event: '在美国上市' },
      { year: '2021', event: '在香港二次上市' }
    ]
  },
  media: {
    bannerImages: [
      'https://picsum.photos/750/400?random=351',
      'https://picsum.photos/750/400?random=352',
      'https://picsum.photos/750/400?random=353'
    ],
    certificates: [],
    environments: []
  },
  entertainmentInfo: {
    creators: {
      totalCreators: 3000000,
      categories: [
        { name: '动画UP主', count: 800000 },
        { name: '游戏UP主', count: 1000000 },
        { name: '知识UP主', count: 500000 },
        { name: '音乐UP主', count: 400000 }
      ],
      famousCreators: [
        { name: '老番茄', field: '游戏', fans: 18000000, avatar: 'https://picsum.photos/120/120?random=360' },
        { name: '罗翔', field: '知识', fans: 25000000, avatar: 'https://picsum.photos/120/120?random=361' }
      ]
    },
    contentCategories: [
      { icon: '🎮', name: '游戏', dailyViews: 500000000, contentCount: 200000000 },
      { icon: '🎬', name: '动画', dailyViews: 400000000, contentCount: 150000000 },
      { icon: '📚', name: '知识', dailyViews: 300000000, contentCount: 100000000 }
    ],
    monetization: {
      methods: [
        { icon: '💰', name: '创作激励', desc: '播放量收益', earning: '最高数十万/月' },
        { icon: '🎁', name: '直播打赏', desc: '舰长收益', earning: '稳定收入' }
      ]
    },
    business: {
      brands: [],
      adServices: []
    },
    community: {
      guarantees: [
        { icon: '🛡️', title: '弹幕礼仪', desc: '文明互动' },
        { icon: '🔒', title: '青少年模式', desc: '健康上网' }
      ]
    }
  },
  reviews: [
    { user: '用户A', avatar: 'https://picsum.photos/50/50?random=370', rating: 5, content: '学习好地方', time: '2025-02-20' }
  ],
  contact: {
    servicePhone: '400-999-0000',
    address: '上海市杨浦区',
    website: 'https://www.bilibili.com',
    wechatQr: 'https://picsum.photos/200/200?random=380'
  }
})

// 淘宝模拟数据（电商平台）
const getTaobaoMockData = () => ({
  basicInfo: {
    companyName: '淘宝',
    logo: 'https://picsum.photos/200/200?random=400',
    industryType: '电商平台',
    establishedDate: '2003-05-10',
    scale: '年活10亿+、商家2000万+',
    rating: 4.7,
    reviewCount: 980000
  },
  introduction: {
    summary: '淘宝是中国领先的综合性电商平台，为消费者提供丰富多样的商品选择。',
    culture: '让天下没有难做的生意',
    history: [
      { year: '2003', event: '淘宝网成立' },
      { year: '2008', event: '淘宝商城（天猫）成立' },
      { year: '2014', event: '在美国上市' }
    ]
  },
  media: {
    bannerImages: [
      'https://picsum.photos/750/400?random=401',
      'https://picsum.photos/750/400?random=402',
      'https://picsum.photos/750/400?random=403'
    ],
    certificates: [],
    environments: []
  },
  ecommerceInfo: {
    merchants: {
      totalMerchants: 20000000,
      categories: [
        { name: '服饰鞋包', count: 5000000 },
        { name: '美妆个护', count: 3000000 },
        { name: '家居数码', count: 4000000 }
      ],
      famousMerchants: [
        { name: '小米官方旗舰店', category: '数码', logo: 'https://picsum.photos/120/120?random=410', monthlySales: 500000 },
        { name: '华为官方旗舰店', category: '数码', logo: 'https://picsum.photos/120/120?random=411', monthlySales: 600000 }
      ]
    },
    categories: [
      { icon: '👗', name: '服饰鞋包', productCount: 500000000, brandCount: 100000 },
      { icon: '💄', name: '美妆个护', productCount: 200000000, brandCount: 50000 },
      { icon: '📱', name: '手机数码', productCount: 100000000, brandCount: 10000 }
    ],
    delivery: {
      timeTable: [
        { range: '全国包邮', time: '3-5天', price: '包邮' },
        { range: '江浙沪', time: '次日达', price: '6元起' },
        { range: '偏远地区', time: '7-15天', price: '15元起' }
      ],
      methods: [
        { icon: '📦', name: '普通快递', desc: '性价比之选' },
        { icon: '⚡', name: '极速达', desc: '当日送达' },
        { icon: '🚚', name: '自提', desc: '就近取货' }
      ]
    },
    afterSales: {
      services: [
        { icon: '7️⃣', title: '七天退换', desc: '无理由退货' },
        { icon: '⚡', title: '极速退款', desc: '秒级到账' },
        { icon: '✅', title: '正品保障', desc: '假一赔十' }
      ],
      refundPromise: {
        title: '退款承诺',
        content: '支持7天无理由退货，正品保障，假一赔十，让您购物无忧！'
      }
    },
    promotions: [
      { badge: '限时', type: 'hot', name: '双11狂欢', desc: '全场5折起', action: '立即抢购' },
      { badge: '新人', type: 'new', name: '新人礼包', desc: '领取100元券', action: '立即领取' },
      { badge: '满减', type: 'limit', name: '满300减30', desc: '上不封顶', action: '立即使用' }
    ],
    membership: [
      {
        level: 'gold',
        name: '88VIP',
        price: '88元/年',
        benefits: ['全年95折', '免费包邮', '优酷会员', '饿了么会员']
      },
      {
        level: 'platinum',
        name: '淘宝VIP',
        price: '免费',
        benefits: ['积分兑换', '专属客服']
      }
    ]
  },
  reviews: [
    { user: '用户A', avatar: 'https://picsum.photos/50/50?random=420', rating: 5, content: '东西很全', time: '2025-02-20' },
    { user: '用户B', avatar: 'https://picsum.photos/50/50?random=421', rating: 4, content: '价格实惠', time: '2025-02-19' }
  ],
  contact: {
    servicePhone: '9510211',
    address: '浙江省杭州市余杭区',
    website: 'https://www.taobao.com',
    wechatQr: 'https://picsum.photos/200/200?random=430'
  }
})

// 美团模拟数据（电商平台）
const getMeituanMockData = () => ({
  basicInfo: {
    companyName: '美团',
    logo: 'https://picsum.photos/200/200?random=440',
    industryType: '电商平台',
    establishedDate: '2010-03-04',
    scale: '年活6亿+、商家800万+',
    rating: 4.6,
    reviewCount: 760000
  },
  introduction: {
    summary: '美团是中国领先的本地生活服务平台，帮大家吃得更好，生活更好。',
    culture: '帮大家吃得更好，生活更好',
    history: [
      { year: '2010', event: '美团成立' },
      { year: '2018', event: '在香港上市' },
      { year: '2020', event: '年活用户破5亿' }
    ]
  },
  media: {
    bannerImages: [
      'https://picsum.photos/750/400?random=441',
      'https://picsum.photos/750/400?random=442',
      'https://picsum.photos/750/400?random=443'
    ],
    certificates: [],
    environments: []
  },
  ecommerceInfo: {
    merchants: {
      totalMerchants: 8000000,
      categories: [
        { name: '餐饮美食', count: 4000000 },
        { name: '酒店旅游', count: 1000000 },
        { name: '生鲜果蔬', count: 1500000 }
      ],
      famousMerchants: [
        { name: '肯德基', category: '餐饮', logo: 'https://picsum.photos/120/120?random=450', monthlySales: 1000000 },
        { name: '如家酒店', category: '酒店', logo: 'https://picsum.photos/120/120?random=451', monthlySales: 500000 }
      ]
    },
    categories: [
      { icon: '🍜', name: '外卖', productCount: 50000000, brandCount: 4000000 },
      { icon: '🏨', name: '酒店', productCount: 1000000, brandCount: 500000 },
      { icon: '🎬', name: '电影', productCount: 500000, brandCount: 10000 }
    ],
    delivery: {
      timeTable: [
        { range: '同城配送', time: '30分钟', price: '5元起' },
        { range: '跨城配送', time: '次日达', price: '10元起' }
      ],
      methods: [
        { icon: '🚴', name: '美团专送', desc: '准时必达' },
        { icon: '🏪', name: '到店自取', desc: '省配送费' }
      ]
    },
    afterSales: {
      services: [
        { icon: '⏰', title: '超时赔付', desc: '迟到必赔' },
        { icon: '🔄', title: '退款秒到账', desc: '极速退款' },
        { icon: '✅', title: '食品安全', desc: '品质保障' }
      ],
      refundPromise: {
        title: '服务承诺',
        content: '超时赔付、退款秒到账、食品安全保障，让您消费无忧！'
      }
    },
    promotions: [
      { badge: '红包', type: 'hot', name: '外卖红包', desc: '每日领红包', action: '立即领取' },
      { badge: '特价', type: 'new', name: '限时秒杀', desc: '低至1折', action: '马上抢' }
    ],
    membership: [
      {
        level: 'gold',
        name: '美团会员',
        price: '15元/月',
        benefits: ['外卖红包', '折扣券', '免配送费']
      }
    ]
  },
  reviews: [
    { user: '用户A', avatar: 'https://picsum.photos/50/50?random=460', rating: 5, content: '外卖很快', time: '2025-02-20' },
    { user: '用户B', avatar: 'https://picsum.photos/50/50?random=461', rating: 4, content: '很方便', time: '2025-02-19' }
  ],
  contact: {
    servicePhone: '10109777',
    address: '北京市朝阳区望京',
    website: 'https://www.meituan.com',
    wechatQr: 'https://picsum.photos/200/200?random=470'
  }
})

// 微信模拟数据（社交类 - 复用文娱类组件）
const getWeixinMockData = () => ({
  basicInfo: {
    companyName: '微信',
    logo: 'https://picsum.photos/200/200?random=500',
    industryType: '文娱类',
    establishedDate: '2011-01-21',
    scale: '月活13亿+、公众号2000万+',
    rating: 4.9,
    reviewCount: 890000
  },
  introduction: {
    summary: '微信是一款跨平台的通讯工具，支持发送语音、视频、图片和文字。',
    culture: '微信，是一个生活方式',
    history: [
      { year: '2011', event: '微信发布' },
      { year: '2012', event: '微信公众平台上线' },
      { year: '2014', event: '微信支付上线' }
    ]
  },
  media: {
    bannerImages: [
      'https://picsum.photos/750/400?random=501',
      'https://picsum.photos/750/400?random=502',
      'https://picsum.photos/750/400?random=503'
    ],
    certificates: [],
    environments: []
  },
  entertainmentInfo: {
    creators: {
      totalCreators: 20000000,
      categories: [
        { name: '自媒体', count: 10000000 },
        { name: '企业号', count: 5000000 },
        { name: '政府号', count: 3000000 }
      ],
      famousCreators: []
    },
    contentCategories: [
      { icon: '📰', name: '公众号文章', dailyViews: 10000000000, contentCount: 5000000000 }
    ],
    monetization: {
      methods: [
        { icon: '💰', name: '流量主', desc: '广告收益', earning: '分润模式' },
        { icon: '🎁', name: '赞赏', desc: '文章赞赏', earning: '用户打赏' }
      ]
    },
    business: {
      brands: [],
      adServices: []
    },
    community: {
      guarantees: [
        { icon: '🛡️', title: '内容审核', desc: '严格审核' },
        { icon: '🔒', title: '隐私保护', desc: '端到端加密' }
      ]
    }
  },
  reviews: [
    { user: '用户A', avatar: 'https://picsum.photos/50/50?random=510', rating: 5, content: '离不开的app', time: '2025-02-20' }
  ],
  contact: {
    servicePhone: '95017',
    address: '广东省深圳市南山区',
    website: 'https://weixin.qq.com',
    wechatQr: 'https://picsum.photos/200/200?random=520'
  }
})

// 京东电商模拟数据
const getJDShoppingMockData = () => ({
  basicInfo: {
    companyName: '京东',
    logo: 'https://picsum.photos/200/200?random=600',
    industryType: '电商平台',
    establishedDate: '1998-06-18',
    scale: '年活6亿+、商家1000万+',
    rating: 4.8,
    reviewCount: 890000
  },
  introduction: {
    summary: '京东是中国领先的技术驱动型电商和零售基础设施服务商。',
    culture: '技术为本，致力于更高效和可持续的世界',
    history: [
      { year: '1998', event: '刘强东在中关村创业' },
      { year: '2004', event: '转型电商' },
      { year: '2014', event: '在美国纳斯达克上市' }
    ]
  },
  media: {
    bannerImages: [
      'https://picsum.photos/750/400?random=601',
      'https://picsum.photos/750/400?random=602',
      'https://picsum.photos/750/400?random=603'
    ],
    certificates: [],
    environments: []
  },
  ecommerceInfo: {
    merchants: {
      totalMerchants: 10000000,
      categories: [
        { name: '京东自营', count: 50000 },
        { name: '第三方商家', count: 9500000 }
      ],
      famousMerchants: [
        { name: '京东自营iPhone店', category: '数码', logo: 'https://picsum.photos/120/120?random=610', monthlySales: 1000000 },
        { name: '京东家电', category: '家电', logo: 'https://picsum.photos/120/120?random=611', monthlySales: 800000 }
      ]
    },
    categories: [
      { icon: '📱', name: '数码电器', productCount: 200000000, brandCount: 50000 },
      { icon: '👗', name: '服饰内衣', productCount: 300000000, brandCount: 100000 },
      { icon: '💄', name: '美妆护肤', productCount: 150000000, brandCount: 30000 }
    ],
    delivery: {
      timeTable: [
        { range: '211限时达', time: '当日达', price: '包邮' },
        { range: '次日达', time: '次日达', price: '包邮' },
        { range: '京准达', time: '2小时预约', price: '9元起' }
      ],
      methods: [
        { icon: '⚡', name: '211限时达', desc: '极速配送' },
        { icon: '📦', name: '京尊达', desc: '高端专人配送' },
        { icon: '🚚', name: '自提', desc: '就近自提' }
      ]
    },
    afterSales: {
      services: [
        { icon: '7️⃣', title: '7天无理由', desc: '放心购物' },
        { icon: '⚡', title: '闪电退款', desc: '最快秒退' },
        { icon: '✅', title: '正品行货', desc: '100%正品' },
        { icon: '🛡️', title: '价格保护', desc: '多退少补' }
      ],
      refundPromise: {
        title: '服务承诺',
        content: '211限时达、7天无理由退货、正品保障、价格保护，让您购物无忧！'
      }
    },
    promotions: [
      { badge: '限时', type: 'hot', name: '618狂欢', desc: '全场5折起', action: '立即抢购' },
      { badge: '神券', type: 'new', name: 'PLUS专享', desc: '每月领券', action: '立即领取' },
      { badge: '秒杀', type: 'limit', name: '整点秒杀', desc: '1折起', action: '马上抢' }
    ],
    membership: [
      {
        level: 'gold',
        name: '京东PLUS',
        price: '149元/年',
        benefits: ['无限免邮', '返京豆', '爱奇艺会员', '专属客服']
      }
    ]
  },
  reviews: [
    { user: '用户A', avatar: 'https://picsum.photos/50/50?random=620', rating: 5, content: '物流超快', time: '2025-02-20' },
    { user: '用户B', avatar: 'https://picsum.photos/50/50?random=621', rating: 4, content: '正品保障', time: '2025-02-19' }
  ],
  contact: {
    servicePhone: '950618',
    address: '北京市亦庄经济开发区科创十一街',
    website: 'https://www.jd.com',
    wechatQr: 'https://picsum.photos/200/200?random=630'
  }
})

// 拼多多模拟数据
const getPDDMockData = () => ({
  basicInfo: {
    companyName: '拼多多',
    logo: 'https://picsum.photos/200/200?random=700',
    industryType: '电商平台',
    establishedDate: '2015-09-01',
    scale: '年活9亿+、商家1200万+',
    rating: 4.5,
    reviewCount: 750000
  },
  introduction: {
    summary: '拼多多是国内主流的移动购物应用，通过社交分享模式和低价策略迅速崛起。',
    culture: '本分、用户导向',
    history: [
      { year: '2015', event: '拼多多成立' },
      { year: '2018', event: '在美国上市' },
      { year: '2020', event: '年活用户突破7亿' }
    ]
  },
  media: {
    bannerImages: [
      'https://picsum.photos/750/400?random=701',
      'https://picsum.photos/750/400?random=702',
      'https://picsum.photos/750/400?random=703'
    ],
    certificates: [],
    environments: []
  },
  ecommerceInfo: {
    merchants: {
      totalMerchants: 12000000,
      categories: [
        { name: '农产品', count: 5000000 },
        { name: '日用百货', count: 4000000 },
        { name: '服饰鞋包', count: 3000000 }
      ],
      famousMerchants: [
        { name: '农产品旗舰店', category: '生鲜', logo: 'https://picsum.photos/120/120?random=710', monthlySales: 800000 },
        { name: '品牌工厂店', category: '百货', logo: 'https://picsum.photos/120/120?random=711', monthlySales: 600000 }
      ]
    },
    categories: [
      { icon: '🥬', name: '农产品', productCount: 1000000000, brandCount: 1000000 },
      { icon: '👗', name: '服饰鞋包', productCount: 500000000, brandCount: 500000 },
      { icon: '🏠', name: '日用百货', productCount: 800000000, brandCount: 800000 }
    ],
    delivery: {
      timeTable: [
        { range: '全国包邮', time: '3-5天', price: '9.9元包邮' },
        { range: '偏远地区', time: '7-10天', price: '15元起' }
      ],
      methods: [
        { icon: '📦', name: '普通快递', desc: '性价比之选' },
        { icon: '🚚', name: '自提', desc: '免运费' }
      ]
    },
    afterSales: {
      services: [
        { icon: '🛡️', title: '假一赔十', desc: '正品保障' },
        { icon: '⚡', title: '极速退款', desc: '24小时内' },
        { icon: '🎁', title: '百亿补贴', desc: '官方补贴' }
      ],
      refundPromise: {
        title: '服务承诺',
        content: '百亿补贴、假一赔十、极速退款，让您买得放心！'
      }
    },
    promotions: [
      { badge: '补贴', type: 'hot', name: '百亿补贴', desc: '全网最低', action: '立即抢' },
      { badge: '砍价', type: 'new', name: '砍价免费拿', desc: '邀请好友', action: '立即参与' },
      { badge: '秒杀', type: 'limit', name: '限时秒杀', desc: '9.9元', action: '马上抢' }
    ],
    membership: []
  },
  reviews: [
    { user: '用户A', avatar: 'https://picsum.photos/50/50?random=720', rating: 5, content: '价格便宜', time: '2025-02-20' },
    { user: '用户B', avatar: 'https://picsum.photos/50/50?random=721', rating: 4, content: '百亿补贴真香', time: '2025-02-19' }
  ],
  contact: {
    servicePhone: '400-606-5838',
    address: '上海市长宁区娄山关路',
    website: 'https://www.pinduoduo.com',
    wechatQr: 'https://picsum.photos/200/200?random=730'
  }
})
</script>

<style scoped lang="scss">
.company-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1000;

  .nav-content {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 20rpx;
  }

  .nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .back-icon {
      font-size: 40rpx;
      color: #fff;
      font-weight: bold;
    }
  }

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
  }
}

// 内容滚动区域
.content-scroll {
  height: 100vh;
  box-sizing: border-box;
}

// 底部操作栏
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-top: 1rpx solid #e5e5e5;

  .action-btn {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: 600;
    border: none;

    &.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    &.secondary {
      background: #f5f5f5;
      color: #667eea;
      border: 2rpx solid #667eea;
    }

    &.recruitment {
      background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
      color: #fff;
      flex: 1.5; // 投递简历按钮稍宽一些
    }
  }
}

// 招聘信息模块
.recruitment-section {
  margin: 30rpx 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  border: 2rpx solid #ff5252;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;

    .section-title {
      font-size: 36rpx;
      font-weight: 700;
      color: #333;
    }

    .recruitment-badge-active {
      background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
      padding: 8rpx 20rpx;
      border-radius: 20rpx;

      .badge-text {
        font-size: 24rpx;
        color: #fff;
        font-weight: 600;
      }
    }
  }

  .recruitment-content {
    .recruitment-info {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      .info-label {
        font-size: 28rpx;
        color: #666;
        margin-right: 10rpx;
      }

      .info-value {
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
      }
    }

    .positions-list {
      margin-top: 20rpx;

      .positions-title {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 15rpx;
        display: block;
      }

      .position-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background: #f8f8f8;
        border-radius: 12rpx;
        margin-bottom: 15rpx;

        .position-name {
          font-size: 28rpx;
          color: #333;
          font-weight: 600;
        }

        .position-salary {
          font-size: 28rpx;
          color: #ff5252;
          font-weight: 700;
        }
      }
    }

    .recruitment-desc {
      margin-top: 20rpx;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 12rpx;

      .desc-label {
        font-size: 28rpx;
        color: #666;
        display: block;
        margin-bottom: 10rpx;
      }

      .desc-text {
        font-size: 26rpx;
        color: #333;
        line-height: 1.8;
      }
    }

    .recruitment-requirements {
      margin-top: 20rpx;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 12rpx;

      .req-label {
        font-size: 28rpx;
        color: #666;
        display: block;
        margin-bottom: 10rpx;
      }

      .req-text {
        font-size: 26rpx;
        color: #333;
        line-height: 1.8;
        white-space: pre-line;
      }
    }
  }
}
</style>
