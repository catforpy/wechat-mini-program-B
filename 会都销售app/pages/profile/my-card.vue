<template>
  <view class="my-card-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">我的名片</text>
        <view class="nav-actions">
          <view class="action-btn" @tap="handleAdd">
            <text class="action-text">+</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 卡片类型指示器 -->
    <view class="card-type-indicator">
      <view
        v-for="(typeInfo, index) in cardTypes"
        :key="index"
        class="type-indicator-item"
        :class="{ active: currentType === typeInfo.type }"
        @tap="switchToType(typeInfo.type)"
      >
        <text class="type-icon">{{ typeInfo.icon }}</text>
        <text class="type-label">{{ typeInfo.label }}</text>
        <text v-if="typeInfo.count > 0" class="type-count">({{ typeInfo.count }})</text>
      </view>
    </view>

    <!-- 同类型内的卡片导航 -->
    <view v-if="currentTypeCards.length > 1" class="same-type-navigation">
      <view class="nav-label">{{ currentTypeInfo.label }}列表：</view>
      <scroll-view class="card-list-scroll" scroll-x :scroll-into-view="`card_${currentIndex}`" scroll-with-animation>
        <view class="card-list">
          <view
            v-for="(card, index) in currentTypeCards"
            :key="card.id"
            :id="`card_${getCardIndex(card)}`"
            class="card-list-item"
            :class="{ active: currentIndex === getCardIndex(card) }"
            @tap="switchToCard(getCardIndex(card))"
          >
            <text class="card-list-name">{{ getCardShortName(card) }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 横向滑动卡片区域 -->
    <swiper
      class="card-swiper"
      :current="currentIndex"
      @change="onSwiperChange"
      :duration="300"
    >
      <swiper-item v-for="(card, index) in cards" :key="index">
        <view class="card-wrapper">
          <view class="card" :class="card.type === 'personal' ? 'personal-card' : card.type === 'individual' ? 'individual-card' : 'company-card'">
            <!-- 卡片头部 -->
            <view class="card-header">
              <text class="card-title">
                {{ card.type === 'personal' ? '👤 个人名片' : card.type === 'individual' ? '🏪 个体工商户' : `🏢 ${card.basicInfo.name}` }}
              </text>
              <!-- 头部操作按钮 -->
              <view class="card-header-actions">
                <template v-if="card.type === 'personal'">
                  <view class="share-btn" @tap="handleShare">
                    <text class="share-text">分享</text>
                  </view>
                </template>
                <template v-else>
                  <view class="publish-btn" @tap="handlePublish">
                    <text class="publish-text">发布</text>
                  </view>
                </template>
              </view>
            </view>

            <!-- 个人名片标签导航 -->
            <view v-if="card.type === 'personal'" class="tag-navigation">
              <view class="tag-menu" @tap="goToBasicInfo">
                <text class="tag-icon">📋</text>
                <text class="tag-title">基本信息</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToWorkExperience">
                <text class="tag-icon">💼</text>
                <text class="tag-title">工作经历</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToQualifications">
                <text class="tag-icon">🎓</text>
                <text class="tag-title">资格证书</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToAttachments">
                <text class="tag-icon">📎</text>
                <text class="tag-title">附件管理</text>
                <text class="tag-arrow">›</text>
              </view>
            </view>

            <!-- 企业名片标签导航 -->
            <view v-else-if="card.type === 'company'" class="tag-navigation">
              <view class="tag-menu" @tap="goToCompanyInfo">
                <text class="tag-icon">🏢</text>
                <text class="tag-title">企业信息</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToBusinessScope">
                <text class="tag-icon">📄</text>
                <text class="tag-title">经营范围</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToCompanyQualifications">
                <text class="tag-icon">🎓</text>
                <text class="tag-title">企业资质</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToStaffManagement">
                <text class="tag-icon">👥</text>
                <text class="tag-title">人员管理</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToAttachments">
                <text class="tag-icon">📎</text>
                <text class="tag-title">附件管理</text>
                <text class="tag-arrow">›</text>
              </view>
            </view>

            <!-- 个体工商户标签导航 -->
            <view v-else-if="card.type === 'individual'" class="tag-navigation">
              <view class="tag-menu" @tap="goToBusinessInfo">
                <text class="tag-icon">🏪</text>
                <text class="tag-title">经营信息</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToBusinessScope">
                <text class="tag-icon">📄</text>
                <text class="tag-title">经营范围</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToBusinessQualifications">
                <text class="tag-icon">🎓</text>
                <text class="tag-title">资质证书</text>
                <text class="tag-arrow">›</text>
              </view>
              <view class="tag-menu" @tap="goToAttachments">
                <text class="tag-icon">📎</text>
                <text class="tag-title">附件管理</text>
                <text class="tag-arrow">›</text>
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>

  <!-- 分享选择悬浮层 -->
  <view v-if="showShareModal" class="share-modal-mask" @tap="closeShareModal">
    <view class="share-modal-content" @tap.stop>
      <!-- 顶部导航栏 -->
      <view class="share-modal-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
        <view class="nav-back" @tap="closeShareModal">
          <text class="down-arrow">▼</text>
        </view>
        <text class="nav-title">选择名片</text>
        <view class="nav-multi-select" @tap="toggleMultiSelect">
          <text class="multi-select-text">{{ isMultiSelect ? '完成' : '多选' }}</text>
        </view>
      </view>

      <!-- 搜索框 -->
      <view class="share-search-row">
        <view class="share-search-box">
          <text class="search-icon">🔍</text>
          <input
            class="search-input"
            type="text"
            placeholder="搜索名片..."
            v-model="shareSearchKeyword"
            @input="handleShareSearch"
          />
          <text v-if="shareSearchKeyword" class="clear-icon" @tap="handleClearShareSearch">✕</text>
        </view>
      </view>

      <!-- 主内容区域 -->
      <scroll-view class="share-modal-scroll" scroll-y>
        <!-- 企业名片横向滑动容器 -->
        <view class="company-cards-section">
          <view class="section-title">企业名片</view>
          <scroll-view class="company-cards-scroll" scroll-x>
            <view class="company-cards-list">
              <view
                v-for="card in filteredCompanyCards"
                :key="card.id"
                class="company-card-item"
                :class="{ selected: isCompanyCardSelected(card.id) }"
                @tap="handleCompanyCardSelect(card)"
              >
                <view class="card-checkbox" v-if="isMultiSelect">
                  <text class="checkbox-icon">{{ isCompanyCardSelected(card.id) ? '✓' : '' }}</text>
                </view>
                <view class="card-icon">🏢</view>
                <text class="card-name">{{ card.basicInfo.name }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 个人名片列表 -->
        <view class="personal-cards-section">
          <view class="section-title">个人名片</view>
          <view class="personal-cards-list">
            <view
              v-for="card in filteredPersonalCards"
              :key="card.id"
              class="personal-card-item"
              :class="{ selected: isPersonalCardSelected(card.id) }"
              @tap="handlePersonalCardSelect(card)"
            >
              <view class="card-checkbox" v-if="isMultiSelect">
                <text class="checkbox-icon">{{ isPersonalCardSelected(card.id) ? '✓' : '' }}</text>
              </view>
              <view class="card-icon">👤</view>
              <view class="card-info">
                <text class="card-name">{{ card.basicInfo.name }}</text>
                <text class="card-position">{{ card.basicInfo.phone || '' }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 底部操作栏 -->
      <view v-if="isMultiSelect && selectedCards.length > 0" class="share-modal-footer">
        <text class="selected-count">已选择 {{ selectedCards.length }} 张名片</text>
        <view class="confirm-btn" @tap="handleConfirmShare">
          <text class="confirm-text">确定分享</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 当前卡片索引
const currentIndex = ref(0)

// 分享弹窗相关状态
const showShareModal = ref(false)
const isMultiSelect = ref(false)
const shareSearchKeyword = ref('')
const selectedCards = ref<string[]>([])

// 当前卡片
const currentCard = computed(() => cards.value[currentIndex.value])

// 当前卡片类型
const currentType = computed(() => {
  if (cards.value[currentIndex.value]) {
    return cards.value[currentIndex.value].type
  }
  return 'personal'
})

// 卡片类型信息接口
interface CardTypeInfo {
  type: 'personal' | 'company' | 'individual'
  label: string
  icon: string
  count: number
}

// 卡片类型列表（按类型分组，个人不显示数量）
const cardTypes = computed<CardTypeInfo[]>(() => {
  const types: CardTypeInfo[] = []

  // 统计个人名片（不显示数量）
  const personalCount = cards.value.filter(c => c.type === 'personal').length
  if (personalCount > 0) {
    types.push({
      type: 'personal',
      label: '个人',
      icon: '👤',
      count: 0 // 个人不显示数量
    })
  }

  // 统计企业名片
  const companyCount = cards.value.filter(c => c.type === 'company').length
  if (companyCount > 0) {
    types.push({
      type: 'company',
      label: '企业',
      icon: '🏢',
      count: companyCount
    })
  }

  // 统计个体工商户
  const individualCount = cards.value.filter(c => c.type === 'individual').length
  if (individualCount > 0) {
    types.push({
      type: 'individual',
      label: '个体',
      icon: '🏪',
      count: individualCount
    })
  }

  return types
})

// 当前类型信息
const currentTypeInfo = computed(() => {
  return cardTypes.value.find(t => t.type === currentType.value) || cardTypes.value[0]
})

// 当前类型的所有卡片
const currentTypeCards = computed(() => {
  return cards.value.filter(c => c.type === currentType.value)
})

// 名片卡片数据接口
interface PersonalInfo {
  name: string
  gender: string
  phone: string
  email: string
  avatar: string
  address: string
}

interface CompanyInfo {
  name: string
  taxNumber: string
  address: string
  phone: string
  email: string
  zipCode: string
  businessScope: string
  logo?: string
}

interface ResumeItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface QualificationItem {
  id: string
  name: string
  issuedDate: string
  certificateNumber?: string
  expiryDate?: string
}

interface AttachmentItem {
  id: string
  name: string
  url: string
  type: string
}

interface PersonalCard {
  id: string
  type: 'personal'
  basicInfo: PersonalInfo
  resume: ResumeItem[]
  qualifications: QualificationItem[]
  attachments: AttachmentItem[]
}

interface CompanyCard {
  id: string
  type: 'company' | 'individual'
  basicInfo: CompanyInfo
  qualifications: QualificationItem[]
  attachments: AttachmentItem[]
}

type CardData = PersonalCard | CompanyCard

// 名片卡片列表（假数据）
const cards = ref<CardData[]>([
  // 个人名片
  {
    id: 'personal_001',
    type: 'personal',
    basicInfo: {
      name: '张三',
      gender: '男',
      phone: '138****0000',
      email: 'zhangsan@example.com',
      avatar: '',
      address: '北京市朝阳区建国路88号'
    },
    resume: [
      {
        id: 'resume_001',
        company: '北京科技创新有限公司',
        position: '总经理',
        startDate: '2020-06',
        endDate: '至今',
        description: '负责公司整体运营和战略规划'
      },
      {
        id: 'resume_002',
        company: '上海互联网科技集团',
        position: '项目总监',
        startDate: '2018-03',
        endDate: '2020-05',
        description: '负责多个大型项目的开发和管理'
      },
      {
        id: 'resume_003',
        company: '深圳软件股份有限公司',
        position: '高级工程师',
        startDate: '2015-07',
        endDate: '2018-02',
        description: '负责核心产品研发'
      }
    ],
    qualifications: [
      {
        id: 'qual_001',
        name: 'PMP项目管理认证',
        issuedDate: '2021-08',
        certificateNumber: 'PMP-2021-001234'
      },
      {
        id: 'qual_002',
        name: 'CPA注册会计师',
        issuedDate: '2019-05',
        certificateNumber: 'CPA-2019-005678'
      },
      {
        id: 'qual_003',
        name: '高级信息系统项目管理师',
        issuedDate: '2017-12',
        certificateNumber: 'ITPG-2017-009999'
      }
    ],
    attachments: [
      {
        id: 'attach_001',
        name: '个人简历.pdf',
        url: '',
        type: 'resume'
      },
      {
        id: 'attach_002',
        name: '学历证书.pdf',
        url: '',
        type: 'education'
      },
      {
        id: 'attach_003',
        name: '身份证.pdf',
        url: '',
        type: 'identity'
      }
    ]
  },
  // 公司名片1
  {
    id: 'company_001',
    type: 'company',
    basicInfo: {
      name: '北京科技创新有限公司',
      taxNumber: '91110000MA001234XX',
      address: '北京市朝阳区建国路88号SOHO现代城A座18层',
      phone: '010-12345678',
      email: 'contact@techinnov.com',
      zipCode: '100025',
      businessScope: '技术开发、技术咨询、技术服务；计算机系统服务；数据处理；软件开发；产品设计；销售自行开发的产品。'
    },
    qualifications: [
      {
        id: 'qual_101',
        name: '国家高新技术企业证书',
        issuedDate: '2022-03',
        certificateNumber: 'GR202211000012'
      },
      {
        id: 'qual_102',
        name: 'ISO9001质量管理体系认证',
        issuedDate: '2021-06',
        certificateNumber: 'QMS-2021-001234'
      },
      {
        id: 'qual_103',
        name: '软件企业认定证书',
        issuedDate: '2020-09',
        certificateNumber: 'SCR-2020-005678'
      }
    ],
    attachments: [
      {
        id: 'attach_101',
        name: '营业执照.pdf',
        url: '',
        type: 'license'
      },
      {
        id: 'attach_102',
        name: '开户许可证.pdf',
        url: '',
        type: 'permit'
      }
    ]
  },
  // 公司名片2（第二家企业）
  {
    id: 'company_003',
    type: 'company',
    basicInfo: {
      name: '上海智汇网络科技有限公司',
      taxNumber: '91310000MA002567XX',
      address: '上海市浦东新区张江高科技园区科苑路88号',
      phone: '021-87654321',
      email: 'info@smartnet.com',
      zipCode: '201203',
      businessScope: '网络技术服务；电子商务；计算机软件开发；系统集成；技术咨询；技术转让。'
    },
    qualifications: [
      {
        id: 'qual_301',
        name: '信息安全等级保护三级认证',
        issuedDate: '2023-05',
        certificateNumber: 'ISVP-2023-003456'
      },
      {
        id: 'qual_302',
        name: 'CMMI5级认证',
        issuedDate: '2022-11',
        certificateNumber: 'CMMI-2022-007890'
      }
    ],
    attachments: [
      {
        id: 'attach_301',
        name: '营业执照.pdf',
        url: '',
        type: 'license'
      },
      {
        id: 'attach_302',
        name: 'ICP许可证.pdf',
        url: '',
        type: 'permit'
      },
      {
        id: 'attach_303',
        name: '增值电信业务经营许可证.pdf',
        url: '',
        type: 'license'
      }
    ]
  },
  // 公司名片2（个体工商户）
  {
    id: 'company_002',
    type: 'individual',
    basicInfo: {
      name: '朝阳区朝阳科技工作室',
      taxNumber: '92110000MA005678XX',
      address: '北京市朝阳区望京SOHO T1 B座15层',
      phone: '010-87654321',
      email: 'wangxi@example.com',
      zipCode: '100102',
      businessScope: '技术服务；技术咨询；软件开发；广告设计；图文制作。'
    },
    qualifications: [
      {
        id: 'qual_201',
        name: '个体工商户营业执照',
        issuedDate: '2023-01',
        certificateNumber: '92110000MA005678XX'
      }
    ],
    attachments: [
      {
        id: 'attach_201',
        name: '营业执照.pdf',
        url: '',
        type: 'license'
      },
      {
        id: 'attach_202',
        name: '经营者身份证.pdf',
        url: '',
        type: 'identity'
      }
    ]
  },
  // 个体工商户2
  {
    id: 'company_004',
    type: 'individual',
    basicInfo: {
      name: '海淀区创意设计中心',
      taxNumber: '92110000MA009012XX',
      address: '北京市海淀区中关村大街1号科技大厦8层',
      phone: '010-66668888',
      email: 'design@example.com',
      zipCode: '100080',
      businessScope: '平面设计；包装设计；品牌策划；企业形象设计；广告制作。'
    },
    qualifications: [
      {
        id: 'qual_401',
        name: '个体工商户营业执照',
        issuedDate: '2022-08',
        certificateNumber: '92110000MA009012XX'
      }
    ],
    attachments: [
      {
        id: 'attach_401',
        name: '营业执照.pdf',
        url: '',
        type: 'license'
      }
    ]
  }
])

// swiper切换事件
const onSwiperChange = (e: any) => {
  currentIndex.value = e.detail.current
}

// 切换到指定卡片
const switchToCard = (index: number) => {
  currentIndex.value = index
}

// 切换到指定类型
const switchToType = (type: 'personal' | 'company' | 'individual') => {
  // 找到该类型的第一个卡片
  const firstCardIndex = cards.value.findIndex(c => c.type === type)
  if (firstCardIndex !== -1) {
    currentIndex.value = firstCardIndex
  }
}

// 获取卡片在列表中的索引
const getCardIndex = (card: CardData) => {
  return cards.value.findIndex(c => c.id === card.id)
}

// 获取卡片简短名称（用于导航）
const getCardShortName = (card: CardData) => {
  if (card.type === 'personal') {
    return card.basicInfo.name || '未命名'
  } else {
    // 对于公司和个体，使用公司名称的前8个字符
    const name = card.basicInfo.name || '未命名'
    return name.length > 8 ? name.substring(0, 8) + '...' : name
  }
}

// 获取卡片标签（保留原有函数以备用）
const getCardLabel = (card: CardData) => {
  if (card.type === 'personal') {
    return '个人'
  } else if (card.type === 'company') {
    return '企业'
  } else {
    return '个体'
  }
}

// 分享弹窗相关计算属性
// 过滤后的企业名片（包括个体工商户）
const filteredCompanyCards = computed(() => {
  const companyCards = cards.value.filter(c => c.type === 'company' || c.type === 'individual')
  if (!shareSearchKeyword.value) {
    return companyCards
  }
  const keyword = shareSearchKeyword.value.toLowerCase()
  return companyCards.filter(card => {
    const name = (card as CompanyCard).basicInfo.name.toLowerCase()
    return name.includes(keyword)
  })
})

// 过滤后的个人名片
const filteredPersonalCards = computed(() => {
  const personalCards = cards.value.filter(c => c.type === 'personal')
  if (!shareSearchKeyword.value) {
    return personalCards
  }
  const keyword = shareSearchKeyword.value.toLowerCase()
  return personalCards.filter(card => {
    const name = (card as PersonalCard).basicInfo.name.toLowerCase()
    return name.includes(keyword)
  })
})

// 打开分享弹窗
const openShareModal = () => {
  showShareModal.value = true
  isMultiSelect.value = false
  selectedCards.value = []
  shareSearchKeyword.value = ''
}

// 关闭分享弹窗
const closeShareModal = () => {
  showShareModal.value = false
  isMultiSelect.value = false
  selectedCards.value = []
  shareSearchKeyword.value = ''
}

// 切换多选模式
const toggleMultiSelect = () => {
  isMultiSelect.value = !isMultiSelect.value
  if (!isMultiSelect.value) {
    selectedCards.value = []
  }
}

// 处理分享搜索
const handleShareSearch = () => {
  // 搜索逻辑在 computed 中处理
}

// 清除分享搜索
const handleClearShareSearch = () => {
  shareSearchKeyword.value = ''
}

// 判断企业名片是否被选中
const isCompanyCardSelected = (id: string) => {
  return selectedCards.value.includes(id)
}

// 判断个人名片是否被选中
const isPersonalCardSelected = (id: string) => {
  return selectedCards.value.includes(id)
}

// 处理企业名片选择
const handleCompanyCardSelect = (card: CardData) => {
  if (isMultiSelect.value) {
    // 多选模式
    const index = selectedCards.value.indexOf(card.id)
    if (index > -1) {
      selectedCards.value.splice(index, 1)
    } else {
      selectedCards.value.push(card.id)
    }
  } else {
    // 单选模式，直接分享
    closeShareModal()
    const name = (card as CompanyCard).basicInfo.name
    uni.showToast({
      title: `分享「${name}」`,
      icon: 'none'
    })
    // TODO: 跳转到聊天界面
  }
}

// 处理个人名片选择
const handlePersonalCardSelect = (card: CardData) => {
  if (isMultiSelect.value) {
    // 多选模式
    const index = selectedCards.value.indexOf(card.id)
    if (index > -1) {
      selectedCards.value.splice(index, 1)
    } else {
      selectedCards.value.push(card.id)
    }
  } else {
    // 单选模式，直接分享
    closeShareModal()
    const name = (card as PersonalCard).basicInfo.name
    uni.showToast({
      title: `分享「${name}」的名片`,
      icon: 'none'
    })
    // TODO: 跳转到聊天界面
  }
}

// 确认分享
const handleConfirmShare = () => {
  closeShareModal()
  uni.showToast({
    title: `已选择 ${selectedCards.value.length} 张名片`,
    icon: 'success'
  })
  // TODO: 跳转到聊天界面
}

// 分享按钮
const handleShare = () => {
  openShareModal()
}

// 发布按钮
const handlePublish = () => {
  // 只对企业/个体名片显示发布选项
  const currentCardData = currentCard.value
  if (!currentCardData || (currentCardData.type !== 'company' && currentCardData.type !== 'individual')) {
    return
  }

  uni.showActionSheet({
    itemList: ['🏢 发布企业', '💼 发布招聘'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 发布企业
        handlePublishCompany()
      } else if (res.tapIndex === 1) {
        // 发布招聘
        handlePublishRecruitment()
      }
    }
  })
}

// 发布企业到商家浏览
const handlePublishCompany = () => {
  const currentCardData = currentCard.value as CompanyCard

  if (!currentCardData) {
    return
  }

  uni.showModal({
    title: '确认发布',
    content: `确定要将「${currentCardData.basicInfo.name}」发布到企业浏览吗？`,
    success: (res) => {
      if (res.confirm) {
        // 获取现有的已发布企业列表
        let publishedCompanies: any[] = []
        try {
          const saved = uni.getStorageSync('published_companies')
          if (saved) {
            publishedCompanies = JSON.parse(saved)
          }
        } catch (e) {
          console.error('读取已发布企业失败:', e)
        }

        // 检查是否已经发布过
        const isAlreadyPublished = publishedCompanies.some(c => c.id === currentCardData.id)

        if (isAlreadyPublished) {
          uni.showToast({
            title: '该企业已发布',
            icon: 'none'
          })
          return
        }

        // 构建发布数据
        const publishedCompany = {
          id: currentCardData.id,
          name: currentCardData.basicInfo.name,
          type: currentCardData.type, // company 或 individual
          taxNumber: currentCardData.basicInfo.taxNumber,
          address: currentCardData.basicInfo.address,
          phone: currentCardData.basicInfo.phone,
          email: currentCardData.basicInfo.email,
          businessScope: currentCardData.basicInfo.businessScope,
          logo: currentCardData.basicInfo.logo || '',
          publishTime: new Date().toISOString(),
          // 分类信息（根据经营范围自动分类）
          categories: autoCategorizeCompany(currentCardData.basicInfo.businessScope)
        }

        // 添加到已发布列表
        publishedCompanies.push(publishedCompany)

        // 保存到本地存储
        try {
          uni.setStorageSync('published_companies', JSON.stringify(publishedCompanies))

          console.log('发布企业成功:', publishedCompany.name)

          uni.showToast({
            title: '发布成功',
            icon: 'success'
          })
        } catch (e) {
          console.error('保存发布企业失败:', e)
          uni.showToast({
            title: '发布失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 根据经营范围自动分类
const autoCategorizeCompany = (businessScope: string) => {
  const scope = businessScope.toLowerCase()
  const categories: string[] = []

  // 技术类
  if (scope.includes('技术开发') || scope.includes('软件开发') || scope.includes('技术服务') || scope.includes('网络技术')) {
    categories.push('IT科技')
  }

  // 咨询类
  if (scope.includes('咨询') || scope.includes('策划') || scope.includes('顾问')) {
    categories.push('咨询服务')
  }

  // 设计类
  if (scope.includes('设计') || scope.includes('广告') || scope.includes('品牌')) {
    categories.push('设计服务')
  }

  // 教育类
  if (scope.includes('教育') || scope.includes('培训') || scope.includes('教学')) {
    categories.push('教育服务')
  }

  // 贸易类
  if (scope.includes('贸易') || scope.includes('销售') || scope.includes('电子商务') || scope.includes('电商')) {
    categories.push('商贸服务')
  }

  // 如果没有匹配到，默认分类
  if (categories.length === 0) {
    categories.push('其他服务')
  }

  return categories
}

// 发布招聘
const handlePublishRecruitment = () => {
  const currentCardData = currentCard.value as CompanyCard

  // 获取已发布招聘的企业列表
  let recruitments: string[] = []
  try {
    const saved = uni.getStorageSync('published_recruitments')
    if (saved) {
      recruitments = JSON.parse(saved)
    }
  } catch (e) {
    console.error('读取招聘信息失败:', e)
  }

  // 检查是否已发布招聘
  const alreadyPublished = recruitments.includes(currentCardData.id)

  if (alreadyPublished) {
    // 已发布，取消发布
    recruitments = recruitments.filter(id => id !== currentCardData.id)
    uni.showToast({
      title: '已取消发布招聘',
      icon: 'success'
    })
  } else {
    // 未发布，添加到列表
    recruitments.push(currentCardData.id)
    uni.showToast({
      title: '招聘信息已发布',
      icon: 'success'
    })
  }

  // 保存到本地存储
  try {
    uni.setStorageSync('published_recruitments', JSON.stringify(recruitments))
  } catch (e) {
    console.error('保存招聘信息失败:', e)
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}

// 添加按钮
const handleAdd = () => {
  uni.showActionSheet({
    itemList: ['🏢 添加企业', '🏪 添加个体工商户'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.showToast({
          title: '添加企业功能开发中',
          icon: 'none'
        })
      } else if (res.tapIndex === 1) {
        uni.showToast({
          title: '添加个体工商户功能开发中',
          icon: 'none'
        })
      }
    }
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 个人名片导航函数
const goToBasicInfo = () => {
  uni.navigateTo({
    url: '/pages/profile/personal-basic-info'
  })
}

const goToWorkExperience = () => {
  uni.navigateTo({
    url: '/pages/profile/personal-work-experience'
  })
}

const goToQualifications = () => {
  uni.navigateTo({
    url: '/pages/profile/personal-qualifications'
  })
}

// 企业名片导航函数
const goToCompanyInfo = () => {
  uni.navigateTo({
    url: '/pages/profile/company-info'
  })
}

const goToBusinessScope = () => {
  uni.navigateTo({
    url: '/pages/profile/business-scope'
  })
}

const goToCompanyQualifications = () => {
  uni.navigateTo({
    url: '/pages/profile/company-qualifications'
  })
}

const goToStaffManagement = () => {
  uni.navigateTo({
    url: '/pages/profile/staff-management'
  })
}

// 个体工商户导航函数
const goToBusinessInfo = () => {
  uni.navigateTo({
    url: '/pages/profile/business-info'
  })
}

const goToBusinessQualifications = () => {
  uni.navigateTo({
    url: '/pages/profile/company-qualifications'
  })
}

// 附件管理导航函数（通用）
const goToAttachments = () => {
  uni.navigateTo({
    url: '/pages/profile/personal-attachments'
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.my-card-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    justify-content: space-between;
    height: 88rpx;
    padding: 0 20rpx;

    .nav-back {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
      }
    }

    .nav-title {
      flex: 1;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .nav-actions {
      display: flex;
      gap: 16rpx;

      .action-btn {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;

        .action-text {
          font-size: 32rpx;
          color: #fff;
          font-weight: 600;
        }

        &:active {
          background: rgba(255, 255, 255, 0.3);
        }
      }

      .action-text-btn {
        padding: 12rpx 24rpx;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 24rpx;

        .action-text-label {
          font-size: 28rpx;
          color: #fff;
          font-weight: 500;
        }

        &:active {
          background: rgba(255, 255, 255, 0.3);
        }

        &.primary {
          background: rgba(255, 255, 255, 0.9);

          .action-text-label {
            color: #667eea;
            font-weight: 600;
          }

          &:active {
            background: rgba(255, 255, 255, 1);
          }
        }
      }

      .action-text-btn-group {
        display: flex;
        gap: 12rpx;
      }
    }
  }
}

// 卡片指示器
.card-indicator {
  position: fixed;
  top: calc(var(--status-bar-height) + 108rpx);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 24rpx;
  padding: 20rpx;
  z-index: 999;

  .indicator-dot {
    padding: 12rpx 24rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 24rpx;
    transition: all 0.3s;

    .indicator-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }

    &.active {
      background: rgba(255, 255, 255, 0.9);

      .indicator-text {
        color: #667eea;
        font-weight: 600;
      }
    }
  }
}

// 卡片类型指示器
.card-type-indicator {
  position: fixed;
  top: calc(var(--status-bar-height) + 88rpx);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20rpx;
  padding: 16rpx 20rpx;
  z-index: 999;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  backdrop-filter: blur(10rpx);

  .type-indicator-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 20rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 24rpx;
    transition: all 0.3s;
    cursor: pointer;

    &:active {
      transform: scale(0.95);
    }

    .type-icon {
      font-size: 28rpx;
    }

    .type-label {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .type-count {
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 400;
    }

    &.active {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);

      .type-icon {
        font-size: 30rpx;
      }

      .type-label {
        color: #667eea;
        font-weight: 600;
      }

      .type-count {
        color: #667eea;
        font-weight: 600;
      }
    }
  }
}

// 同类型内的卡片导航
.same-type-navigation {
  position: fixed;
  top: calc(var(--status-bar-height) + 170rpx);
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 12rpx 20rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10rpx);
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  z-index: 998;
  gap: 12rpx;

  .nav-label {
    font-size: 24rpx;
    color: #666;
    font-weight: 500;
    white-space: nowrap;
  }

  .card-list-scroll {
    flex: 1;
    height: 60rpx;
    white-space: nowrap;

    .card-list {
      display: inline-flex;
      gap: 12rpx;
      padding-right: 20rpx;

      .card-list-item {
        display: inline-flex;
        align-items: center;
        padding: 8rpx 20rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
        transition: all 0.3s;
        cursor: pointer;

        &:active {
          transform: scale(0.95);
        }

        .card-list-name {
          font-size: 24rpx;
          color: #666;
          font-weight: 500;
          white-space: nowrap;
        }

        &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);

          .card-list-name {
            color: #fff;
            font-weight: 600;
          }
        }
      }
    }
  }
}

// 卡片指示器（保留旧样式以备用）
.card-indicator {
  position: fixed;
  top: calc(var(--status-bar-height) + 108rpx);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 24rpx;
  padding: 20rpx;
  z-index: 999;

  .indicator-dot {
    padding: 12rpx 24rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 24rpx;
    transition: all 0.3s;

    .indicator-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }

    &.active {
      background: rgba(255, 255, 255, 0.9);

      .indicator-text {
        color: #667eea;
        font-weight: 600;
      }
    }
  }
}

// swiper容器
.card-swiper {
  height: 100vh;
  width: 100%;
  padding-top: calc(var(--status-bar-height) + 250rpx); // 为导航栏、类型指示器和同类型导航留出空间
}

// 卡片包装器
.card-wrapper {
  height: 100%;
  display: flex;
  align-items: flex-start; // 改为顶部对齐
  justify-content: center;
  padding: 30rpx;
  box-sizing: border-box;
}

// 卡片通用样式
.card {
  width: 100%;
  max-height: calc(100vh - 280rpx);
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  padding: 40rpx;
  transition: all 0.3s;

  &::-webkit-scrollbar {
    display: none;
  }
}

// 个人名片 - 蓝色主题
.personal-card {
  border-left: 8rpx solid #667eea;

  .card-header {
    .card-title {
      color: #667eea;
    }
  }

  .section-title {
    color: #667eea;
  }
}

// 公司名片 - 紫色主题
.company-card {
  border-left: 8rpx solid #9c27b0;

  .card-header {
    .card-title {
      color: #9c27b0;
    }
  }

  .section-title {
    color: #9c27b0;
  }
}

// 个体工商户 - 绿色主题
.individual-card {
  border-left: 8rpx solid #4caf50;

  .card-header {
    .card-title {
      color: #4caf50;
    }
  }

  .section-title {
    color: #4caf50;
  }
}

// 卡片头部
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;

  .card-title {
    font-size: 36rpx;
    font-weight: 600;
  }

  .card-header-actions {
    display: flex;
    gap: 12rpx;

    .edit-btn {
      padding: 8rpx 20rpx;
      background: #f0f0f0;
      border-radius: 20rpx;
      transition: all 0.3s;

      .edit-text {
        font-size: 24rpx;
        color: #666;
        font-weight: 500;
      }

      &:active {
        background: #e0e0e0;
      }

      &.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

        .edit-text {
          color: #fff;
          font-weight: 600;
        }

        &:active {
          opacity: 0.8;
        }
      }
    }

    .share-btn {
      padding: 8rpx 20rpx;
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      border-radius: 20rpx;
      transition: all 0.3s;

      .share-text {
        font-size: 24rpx;
        color: #fff;
        font-weight: 500;
      }

      &:active {
        opacity: 0.8;
        transform: scale(0.95);
      }
    }

    .publish-btn {
      padding: 8rpx 20rpx;
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      border-radius: 20rpx;
      transition: all 0.3s;

      .publish-text {
        font-size: 24rpx;
        color: #fff;
        font-weight: 500;
      }

      &:active {
        opacity: 0.8;
        transform: scale(0.95);
      }
    }

    .edit-btn-group {
      display: flex;
      gap: 12rpx;
    }
  }
}

// 卡片区块
.card-section {
  margin-bottom: 32rpx;

  .section-title {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 16rpx;
  }
}

// 信息列表
.info-list {
  .info-item {
    display: flex;
    margin-bottom: 16rpx;
    font-size: 26rpx;
    align-items: center;

    .info-label {
      color: #666;
      min-width: 120rpx;
    }

    .info-value {
      flex: 1;
      color: #333;
      word-break: break-all;
    }

    .info-input {
      flex: 1;
      font-size: 26rpx;
      color: #333;
      border: 1rpx solid #e0e0e0;
      border-radius: 8rpx;
      padding: 8rpx 12rpx;
      background: #fff;
    }

    .picker-value {
      flex: 1;
      font-size: 26rpx;
      color: #333;
      border: 1rpx solid #e0e0e0;
      border-radius: 8rpx;
      padding: 8rpx 12rpx;
      background: #fff;
    }
  }
}

// 履历列表
.resume-list {
  .resume-item {
    background: #f8f9fa;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
    position: relative;

    .resume-item-content {
      cursor: pointer;

      &:active {
        opacity: 0.8;
      }
    }

    .resume-company {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .resume-position {
      display: block;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 8rpx;
    }

    .resume-time {
      display: block;
      font-size: 24rpx;
      color: #999;
    }

    // 编辑模式样式
    &.edit-mode {
      background: #fff8e1;
      border: 1rpx dashed #ffa000;
    }

    .resume-edit-wrapper {
      width: 100%;

      .resume-edit-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .resume-edit-btn,
        .resume-delete-btn {
          padding: 6rpx 12rpx;
          border-radius: 8rpx;
          font-size: 20rpx;
          cursor: pointer;

          &:active {
            opacity: 0.7;
          }
        }

        .resume-edit-btn {
          background: #e3f2fd;
        }

        .resume-delete-btn {
          background: #ffebee;
        }
      }

      .resume-edit-input {
        width: 100%;
        font-size: 26rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 8rpx;
        padding: 8rpx 12rpx;
        margin-bottom: 8rpx;
        background: #fff;

        &:last-of-type {
          margin-bottom: 8rpx;
        }
      }

      .resume-date-edit {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .resume-date-input {
          flex: 1;
          font-size: 24rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 6rpx 10rpx;
          background: #fff;
        }

        .resume-date-separator {
          color: #999;
          font-size: 24rpx;
        }
      }
    }

    .resume-add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12rpx;
      padding: 16rpx;
      text-align: center;
      margin-top: 8rpx;
      cursor: pointer;

      &:active {
        opacity: 0.8;
      }

      .resume-add-text {
        font-size: 26rpx;
        color: #fff;
        font-weight: 500;
      }
    }
  }
}

// 资质列表
.qualification-list {
  .qualification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f9fa;
    border-radius: 12rpx;
    padding: 16rpx 20rpx;
    margin-bottom: 12rpx;
    position: relative;

    .qualification-item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      cursor: pointer;

      &:active {
        opacity: 0.8;
      }
    }

    .qualification-name {
      font-size: 26rpx;
      color: #333;
    }

    .qualification-date {
      font-size: 24rpx;
      color: #999;
    }

    // 编辑模式样式
    &.edit-mode {
      background: #fff8e1;
      border: 1rpx dashed #ffa000;
      display: block;
    }

    .qualification-edit-wrapper {
      width: 100%;

      .qualification-edit-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .qualification-upload-btn,
        .qualification-delete-btn {
          padding: 6rpx 12rpx;
          border-radius: 8rpx;
          font-size: 20rpx;
          cursor: pointer;

          &:active {
            opacity: 0.7;
          }
        }

        .qualification-upload-btn {
          background: #e8f5e9;
        }

        .qualification-delete-btn {
          background: #ffebee;
        }
      }

      .qualification-edit-input {
        width: 100%;
        font-size: 26rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 8rpx;
        padding: 8rpx 12rpx;
        margin-bottom: 8rpx;
        background: #fff;
      }

      .qualification-date-input {
        width: 100%;
        font-size: 24rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 8rpx;
        padding: 6rpx 10rpx;
        background: #fff;
      }
    }

    .qualification-add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12rpx;
      padding: 16rpx;
      text-align: center;
      margin-top: 8rpx;
      cursor: pointer;

      &:active {
        opacity: 0.8;
      }

      .qualification-add-text {
        font-size: 26rpx;
        color: #fff;
        font-weight: 500;
      }
    }
  }
}

// 经营范围
.business-scope {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
}

.business-scope-input {
  width: 100%;
  min-height: 120rpx;
  font-size: 26rpx;
  color: #333;
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 16rpx;
  background: #fff;
  line-height: 1.5;
}

// 附件列表
.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .attachment-item {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 12rpx;
    padding: 12rpx 24rpx;
    font-size: 24rpx;
    position: relative;

    // 编辑模式样式
    &.edit-mode {
      background: #fff8e1;
      border: 1rpx dashed #ffa000;
      padding: 12rpx;
      display: block;
      width: 100%;
    }

    .attachment-edit-wrapper {
      width: 100%;

      .attachment-edit-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12rpx;
        margin-bottom: 8rpx;

        .attachment-upload-btn,
        .attachment-delete-btn {
          padding: 6rpx 12rpx;
          border-radius: 8rpx;
          font-size: 20rpx;
          cursor: pointer;

          &:active {
            opacity: 0.7;
          }
        }

        .attachment-upload-btn {
          background: #e8f5e9;
        }

        .attachment-delete-btn {
          background: #ffebee;
        }
      }

      .attachment-edit-input {
        width: 100%;
        font-size: 24rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 8rpx;
        padding: 6rpx 10rpx;
        background: #fff;
        color: #333;
      }
    }

    .attachment-add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12rpx;
      padding: 12rpx 24rpx;
      text-align: center;
      cursor: pointer;

      &:active {
        opacity: 0.8;
      }

      .attachment-add-text {
        font-size: 24rpx;
        color: #fff;
        font-weight: 500;
      }
    }

    .attachment-name {
      color: #fff;
    }
  }
}

// 标签导航样式
.tag-navigation {
  padding: 20rpx;

  .tag-menu {
    display: flex;
    align-items: center;
    padding: 24rpx 20rpx;
    background: #f8f9fa;
    border-radius: 12rpx;
    margin-bottom: 16rpx;
    transition: all 0.3s;
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    &:active {
      background: #e9ecef;
    }

    .tag-icon {
      font-size: 40rpx;
      margin-right: 16rpx;
    }

    .tag-title {
      flex: 1;
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }

    .tag-arrow {
      font-size: 40rpx;
      color: #999;
      font-weight: 300;
    }
  }
}

// 分享弹窗样式
.share-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.share-modal-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.share-modal-nav {
  background: #fff;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .nav-back {
    width: 88rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8rpx;
    border-radius: 16rpx;
    transition: background 0.2s;

    .down-arrow {
      font-size: 28rpx;
      color: #666;
      transform: rotate(180deg);
      font-weight: 300;
    }

    &:active {
      background: #f5f5f5;
    }
  }

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 34rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 0.5rpx;
  }

  .nav-multi-select {
    width: 88rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8rpx;
    border-radius: 16rpx;
    transition: background 0.2s;

    .multi-select-text {
      font-size: 28rpx;
      color: #667eea;
      font-weight: 500;
    }

    &:active {
      background: #f5f5f5;
    }
  }
}

.share-search-row {
  padding: 24rpx 30rpx 16rpx;
  background: #fff;

  .share-search-box {
    display: flex;
    align-items: center;
    background: #f7f8fa;
    border-radius: 24rpx;
    padding: 20rpx 28rpx;
    border: 2rpx solid transparent;
    transition: all 0.2s;

    &:focus-within {
      background: #fff;
      border-color: #667eea;
    }

    .search-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
      opacity: 0.5;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #1a1a1a;
      height: 40rpx;
      line-height: 40rpx;
    }

    .clear-icon {
      font-size: 28rpx;
      color: #999;
      padding: 8rpx;
      margin-left: 8rpx;
      opacity: 0.6;
      transition: opacity 0.2s;

      &:active {
        opacity: 1;
      }
    }
  }
}

.share-modal-scroll {
  flex: 1;
  padding: 24rpx 30rpx;
  overflow-y: auto;
}

.company-cards-section {
  margin-bottom: 40rpx;

  .section-title {
    font-size: 28rpx;
    color: #999;
    font-weight: 500;
    margin-bottom: 20rpx;
    padding-left: 4rpx;
  }

  .company-cards-scroll {
    white-space: nowrap;

    .company-cards-list {
      display: inline-flex;
      gap: 20rpx;
      padding-right: 10rpx;

      .company-card-item {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 180rpx;
        height: 180rpx;
        padding: 24rpx 16rpx;
        background: #f7f8fa;
        border-radius: 20rpx;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2rpx solid transparent;

        &:active {
          transform: scale(0.95);
        }

        &.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.35);
          transform: translateY(-4rpx);

          .card-icon, .card-name {
            color: #fff;
          }
        }

        .card-checkbox {
          position: absolute;
          top: 12rpx;
          right: 12rpx;
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

          .checkbox-icon {
            font-size: 22rpx;
            color: #667eea;
            font-weight: 700;
          }
        }

        .card-icon {
          font-size: 64rpx;
          margin-bottom: 16rpx;
          transition: transform 0.25s;
        }

        .card-name {
          font-size: 24rpx;
          color: #333;
          text-align: center;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          line-height: 1.4;
        }
      }
    }
  }
}

.personal-cards-section {
  .section-title {
    font-size: 28rpx;
    color: #999;
    font-weight: 500;
    margin-bottom: 20rpx;
    padding-left: 4rpx;
  }

  .personal-cards-list {
    .personal-card-item {
      position: relative;
      display: flex;
      align-items: center;
      padding: 24rpx 28rpx;
      background: #f7f8fa;
      border-radius: 20rpx;
      margin-bottom: 16rpx;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2rpx solid transparent;

      &:last-child {
        margin-bottom: 0;
      }

      &:active {
        transform: scale(0.98);
      }

      &.selected {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: transparent;
        box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.3);

        .card-icon, .card-name, .card-position {
          color: #fff;
        }
      }

      .card-checkbox {
        position: absolute;
        top: 50%;
        left: 24rpx;
        transform: translateY(-50%);
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

        .checkbox-icon {
          font-size: 22rpx;
          color: #667eea;
          font-weight: 700;
        }
      }

      .card-icon {
        font-size: 52rpx;
        margin-right: 20rpx;
        margin-left: 8rpx;
      }

      .card-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6rpx;

        .card-name {
          font-size: 30rpx;
          color: #1a1a1a;
          font-weight: 600;
        }

        .card-position {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.share-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.04);

  .selected-count {
    font-size: 28rpx;
    color: #666;
    font-weight: 500;
  }

  .confirm-btn {
    padding: 18rpx 48rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 48rpx;
    box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);
    transition: all 0.25s;

    &:active {
      transform: scale(0.96);
      box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.35);
    }

    .confirm-text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 600;
      letter-spacing: 0.5rpx;
    }
  }
}
</style>
