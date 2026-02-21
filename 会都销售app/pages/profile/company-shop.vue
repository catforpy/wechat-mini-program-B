<template>
  <view class="company-shop-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">我的公司</view>
        <view class="nav-action" @tap="addCompany">
          <text class="add-icon">+</text>
        </view>
      </view>
    </view>

    <!-- 横向滑动标签容器 -->
    <view class="tabs-container" :style="{ top: (statusBarHeight + 88) + 'px' }">
      <scroll-view class="tabs-scroll" scroll-x :show-scrollbar="false">
        <view class="tabs-wrapper">
          <view
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            @tap="handleTabChange(tab.key)"
          >
            <text class="tab-text">{{ tab.label }}</text>
            <view v-if="activeTab === tab.key" class="tab-indicator"></view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88 + 80) + 'px' }">
      <!-- 我在销售标签内容 -->
      <view v-if="activeTab === 'my-selling'" class="tab-content">
        <!-- 我在销售 -->
        <view class="section-block">
          <view class="section-header">
            <text class="section-title">我在销售</text>
          </view>

          <!-- 筛选按钮 -->
          <view class="filter-bar">
            <scroll-view class="filter-scroll" scroll-x :show-scrollbar="false">
              <view class="filter-wrapper">
                <view
                  v-for="filter in sellingFilters"
                  :key="filter.key"
                  class="filter-item"
                  :class="{ active: activeSellingFilter === filter.key }"
                  @tap="handleSellingFilterChange(filter.key)"
                >
                  <text class="filter-text">{{ filter.label }}</text>
                </view>
              </view>
            </scroll-view>
          </view>

          <view class="selling-list">
            <view
              v-for="item in filteredSellingItems"
              :key="item.id"
              class="selling-card"
              @tap="handleSellingClick(item)"
            >
              <view class="selling-header">
                <text class="selling-emoji">{{ item.emoji }}</text>
                <view class="selling-info">
                  <text class="selling-name">{{ item.name }}</text>
                  <text class="selling-meta">所属公司: {{ item.companyName }}</text>
                  <text class="selling-meta">分类: {{ item.category }}</text>
                  <text class="selling-price">💰 销售价格: ¥{{ item.price }}</text>
                </view>
              </view>
              <view class="selling-footer">
                <text class="status-text" :class="{ selling: item.status === 'selling', offline: item.status === 'offline' }">
                  {{ item.status === 'selling' ? '销售中' : '已下架' }}
                </text>
                <view class="footer-actions">
                  <view class="edit-btn" @tap.stop="handleEditSellingIntro(item)">
                    <text class="edit-text">编辑</text>
                  </view>
                  <view class="offline-btn" @tap.stop="handleSellingOffline(item)">
                    <text class="offline-text">{{ item.status === 'selling' ? '下架' : '上架' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="add-button" @tap="addSellingItem">
            <text class="add-text">+ 上架小程序销售</text>
          </view>
        </view>
      </view>

      <!-- 我在租赁标签内容 -->
      <view v-else-if="activeTab === 'my-leasing'" class="tab-content">
        <!-- 我在租赁 -->
        <view class="section-block">
          <view class="section-header">
            <text class="section-title">我在租赁</text>
          </view>

          <!-- 筛选按钮 -->
          <view class="filter-bar">
            <scroll-view class="filter-scroll" scroll-x :show-scrollbar="false">
              <view class="filter-wrapper">
                <view
                  v-for="filter in leasingFilters"
                  :key="filter.key"
                  class="filter-item"
                  :class="{ active: activeLeasingFilter === filter.key }"
                  @tap="handleLeasingFilterChange(filter.key)"
                >
                  <text class="filter-text">{{ filter.label }}</text>
                </view>
              </view>
            </scroll-view>
          </view>

          <view class="leasing-list">
            <view
              v-for="item in filteredLeasingItems"
              :key="item.id"
              class="leasing-card"
              @tap="handleLeasingClick(item)"
            >
              <view class="leasing-header">
                <text class="leasing-emoji">{{ item.emoji }}</text>
                <view class="leasing-info">
                  <text class="leasing-name">{{ item.name }}</text>
                  <text class="leasing-meta">所属公司: {{ item.companyName }}</text>
                  <text class="leasing-meta">分类: {{ item.category }}</text>
                  <text class="leasing-price">🔄 租赁价格: ¥{{ item.price }}/月</text>
                </view>
              </view>
              <view class="leasing-footer">
                <text class="status-text" :class="{ leasing: item.status === 'leasing', offline: item.status === 'offline' }">
                  {{ item.status === 'leasing' ? '租赁中' : '已下架' }}
                </text>
                <view class="footer-actions">
                  <view class="edit-btn" @tap.stop="handleEditLeasingIntro(item)">
                    <text class="edit-text">编辑</text>
                  </view>
                  <view class="offline-btn" @tap.stop="handleLeasingOffline(item)">
                    <text class="offline-text">{{ item.status === 'leasing' ? '下架' : '上架' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="add-button" @tap="addLeasingItem">
            <text class="add-text">+ 上架小程序租赁</text>
          </view>
        </view>
      </view>

      <!-- 我在合作标签内容 -->
      <view v-else-if="activeTab === 'my-cooperation'" class="tab-content">
        <!-- 我在合作 -->
        <view class="section-block">
          <view class="section-header">
            <text class="section-title">我在合作</text>
          </view>

          <!-- 筛选按钮 -->
          <view class="filter-bar">
            <scroll-view class="filter-scroll" scroll-x :show-scrollbar="false">
              <view class="filter-wrapper">
                <view
                  v-for="filter in cooperationFilters"
                  :key="filter.key"
                  class="filter-item"
                  :class="{ active: activeCooperationFilter === filter.key }"
                  @tap="handleCooperationFilterChange(filter.key)"
                >
                  <text class="filter-text">{{ filter.label }}</text>
                </view>
              </view>
            </scroll-view>
          </view>

          <view class="cooperation-list">
            <view
              v-for="item in filteredCooperationItems"
              :key="item.id"
              class="cooperation-card"
              @tap="handleCooperationClick(item)"
            >
              <view class="cooperation-header">
                <text class="cooperation-emoji">{{ item.emoji }}</text>
                <view class="cooperation-info">
                  <text class="cooperation-name">{{ item.name }}</text>
                  <text class="cooperation-meta">所属公司: {{ item.companyName }}</text>
                  <text class="cooperation-meta">合作方式: {{ item.cooperationType }}</text>
                  <text class="cooperation-share">🤝 分成比例: {{ item.shareRatio }}%</text>
                </view>
              </view>
              <view class="cooperation-footer">
                <text class="status-text" :class="{ cooperating: item.status === 'cooperating', ended: item.status === 'ended' }">
                  {{ item.status === 'cooperating' ? '合作中' : '已结束' }}
                </text>
                <view class="footer-actions">
                  <view class="edit-btn" @tap.stop="handleEditCooperationIntro(item)">
                    <text class="edit-text">编辑</text>
                  </view>
                  <view class="offline-btn" @tap.stop="handleCooperationEnd(item)">
                    <text class="offline-text">{{ item.status === 'cooperating' ? '结束' : '重启' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="add-button" @tap="addCooperationItem">
            <text class="add-text">+ 上架小程序合作</text>
          </view>
        </view>
      </view>

      <!-- 我的公司标签内容 -->
      <view v-else class="tab-content">
        <!-- 我的公司 -->
        <view class="section-block">
          <view class="section-header">
            <text class="section-title">我的公司</text>
          </view>

          <view class="company-list">
            <view
              v-for="company in allCompanies"
              :key="company.id"
              class="company-card"
              @tap="handleCompanyClick(company)"
            >
              <view class="company-header">
                <text class="company-icon">{{ company.type === 'enterprise' ? '🏢' : company.type === 'individual' ? '🏪' : '🛒' }}</text>
                <view class="company-info">
                  <text class="company-name">{{ company.name }}</text>
                  <text class="company-meta">类型: {{ company.typeLabel }}  状态: 已认证</text>
                  <text class="company-stats">小程序数: {{ company.miniPrograms?.length || 0 }}  App数: {{ company.appCount || 0 }}</text>
                </view>
                <text class="arrow-icon">›</text>
              </view>
            </view>
          </view>

          <view class="add-button" @tap="addCompany">
            <text class="add-text">+ 添加新公司</text>
          </view>
        </view>

        <!-- 我的小程序 -->
        <view class="section-block">
          <view class="section-header">
            <text class="section-title">我的小程序</text>
          </view>

          <!-- 筛选按钮 -->
          <view class="filter-bar">
            <scroll-view class="filter-scroll" scroll-x :show-scrollbar="false">
              <view class="filter-wrapper">
                <view
                  v-for="filter in miniProgramFilters"
                  :key="filter.key"
                  class="filter-item"
                  :class="{ active: activeMiniProgramFilter === filter.key }"
                  @tap="handleMiniProgramFilterChange(filter.key)"
                >
                  <text class="filter-text">{{ filter.label }}</text>
                </view>
              </view>
            </scroll-view>
          </view>

          <view class="miniprogram-list">
            <view
              v-for="program in filteredMiniPrograms"
              :key="program.id"
              class="miniprogram-card"
              @tap="handleMiniProgramClick(program)"
            >
              <view class="program-header">
                <text class="program-emoji">{{ program.emoji }}</text>
                <view class="program-info">
                  <text class="program-name">{{ program.name }}</text>
                  <text class="program-meta">所属公司: {{ program.companyName }}</text>
                  <text class="program-meta">分类: {{ program.category }}  状态: {{ program.statusText }}</text>
                </view>
                <view class="program-status" :class="{ online: program.status === 'published', offline: program.status === 'developing' }">
                  {{ program.status === 'published' ? '运行中' : '开发中' }}
                </view>
              </view>
              <view class="data-divider"></view>
              <view class="program-data">
                <text class="data-title">📊 今日数据</text>
                <text class="data-item">• 访问量: {{ program.todayVisits }}</text>
                <text class="data-item">• 💰 收入: ¥{{ program.todayIncome }}</text>
                <text class="data-item">• 新用户: {{ program.newUsers }}</text>
                <text class="data-item">• 📦 订单: {{ program.orders }}</text>
              </view>
            </view>
          </view>

          <view class="add-button" @tap="addMiniProgram">
            <text class="add-text">+ 添加新小程序</text>
          </view>
        </view>

        <!-- 我的App -->
        <view class="section-block">
          <view class="section-header">
            <text class="section-title">我的App</text>
          </view>

          <!-- 筛选按钮 -->
          <view class="filter-bar">
            <scroll-view class="filter-scroll" scroll-x :show-scrollbar="false">
              <view class="filter-wrapper">
                <view
                  v-for="filter in appFilters"
                  :key="filter.key"
                  class="filter-item"
                  :class="{ active: activeAppFilter === filter.key }"
                  @tap="handleAppFilterChange(filter.key)"
                >
                  <text class="filter-text">{{ filter.label }}</text>
                </view>
              </view>
            </scroll-view>
          </view>

          <view class="app-list">
            <view
              v-for="app in filteredApps"
              :key="app.id"
              class="app-card"
              @tap="handleAppClick(app)"
            >
              <view class="app-header">
                <text class="app-emoji">{{ app.emoji }}</text>
                <view class="app-info">
                  <text class="app-name">{{ app.name }}</text>
                  <text class="app-meta">所属公司: {{ app.companyName }}</text>
                  <text class="app-meta">版本: {{ app.version }}  状态: {{ app.statusText }}</text>
                </view>
              </view>
              <view class="data-divider"></view>
              <view class="app-data">
                <text class="data-title">📊 跳转数据</text>
                <text class="data-item">• 今日跳转: {{ app.todayClicks }}次</text>
                <text class="data-item">• 累计跳转: {{ app.totalClicks }}次</text>
              </view>
              <view class="app-actions">
                <view class="action-btn" @tap.stop="handleAppDetail(app)">
                  <text class="action-text">详情</text>
                </view>
                <view class="action-btn" @tap.stop="handleAppStats(app)">
                  <text class="action-text">数据</text>
                </view>
                <view class="action-btn danger" @tap.stop="handleAppOffline(app)">
                  <text class="action-text">下架</text>
                </view>
              </view>
            </view>
          </view>

          <view class="add-button" @tap="addApp">
            <text class="add-text">+ 申请上架新App</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 标签页数据
interface TabItem {
  key: string
  label: string
}

const tabs = ref<TabItem[]>([
  { key: 'my-company', label: '我的公司' },
  { key: 'my-selling', label: '我在销售' },
  { key: 'my-leasing', label: '我在租赁' },
  { key: 'my-cooperation', label: '我在合作' }
])

// 当前激活的标签
const activeTab = ref('my-company')

// 标签切换
const handleTabChange = (key: string) => {
  activeTab.value = key
  console.log('切换标签:', key)
}

// ===== 公司数据 =====
interface Company {
  id: string
  name: string
  type: 'enterprise' | 'individual' | 'ecommerce'
  typeLabel: string
  miniPrograms?: any[]
  appCount?: number
}

const allCompanies = ref<Company[]>([
  {
    id: '1',
    name: '太湖学院',
    type: 'enterprise',
    typeLabel: '企业',
    miniPrograms: [
      { id: '1-1', name: '太湖直播', emoji: '📺' },
      { id: '1-2', name: '太湖教学', emoji: '🎓' },
      { id: '1-3', name: '太湖专项', emoji: '📚' }
    ],
    appCount: 2
  },
  {
    id: '2',
    name: '王记小吃店',
    type: 'individual',
    typeLabel: '个体工商户',
    miniPrograms: [
      { id: '2-1', name: '王记点餐', emoji: '🍜' },
      { id: '2-2', name: '王记外卖', emoji: '🛵' }
    ],
    appCount: 0
  },
  {
    id: '3',
    name: '优选商城',
    type: 'ecommerce',
    typeLabel: '电子商务',
    miniPrograms: [
      { id: '3-1', name: '优选购物', emoji: '🛒' },
      { id: '3-2', name: '优选团购', emoji: '🎫' },
      { id: '3-3', name: '优选社区', emoji: '🏘️' }
    ],
    appCount: 1
  }
])

// ===== 小程序数据 =====
interface MiniProgramItem {
  id: string
  name: string
  emoji: string
  companyName: string
  category: string
  status: string
  statusText: string
  todayVisits: number
  todayIncome: number
  newUsers: number
  orders: number
}

// 销售数据
interface SellingItem {
  id: string
  name: string
  emoji: string
  companyName: string
  category: string
  price: number
  status: string
  totalSales: number
  totalIncome: number
  currentCustomers: number
  monthlySales: number
  monthlyIncome: number
}

const sellingFilters = ref([
  { key: 'all', label: '全部' },
  { key: 'selling', label: '销售中' },
  { key: 'offline', label: '已下架' }
])

const activeSellingFilter = ref('all')

const allSellingItems = ref<SellingItem[]>([
  {
    id: 'sell-001',
    name: '太湖直播',
    emoji: '📺',
    companyName: '太湖学院',
    category: '直播服务',
    price: 5000,
    status: 'selling',
    totalSales: 12,
    totalIncome: 60000,
    currentCustomers: 12,
    monthlySales: 3,
    monthlyIncome: 15000
  },
  {
    id: 'sell-002',
    name: '太湖教学',
    emoji: '🎓',
    companyName: '太湖学院',
    category: '教育培训',
    price: 8000,
    status: 'selling',
    totalSales: 8,
    totalIncome: 64000,
    currentCustomers: 8,
    monthlySales: 2,
    monthlyIncome: 16000
  }
])

const filteredSellingItems = computed(() => {
  if (activeSellingFilter.value === 'all') {
    return allSellingItems.value
  }
  return allSellingItems.value.filter(item => item.status === activeSellingFilter.value)
})

// 租赁数据
interface LeasingItem {
  id: string
  name: string
  emoji: string
  companyName: string
  category: string
  price: number
  status: string
  currentTenants: number
  totalIncome: number
  monthlyIncome: number
}

const leasingFilters = ref([
  { key: 'all', label: '全部' },
  { key: 'leasing', label: '租赁中' },
  { key: 'offline', label: '已下架' }
])

const activeLeasingFilter = ref('all')

const allLeasingItems = ref<LeasingItem[]>([
  {
    id: 'lease-001',
    name: '王记点餐系统',
    emoji: '🍜',
    companyName: '王记小吃店',
    category: '点餐平台',
    price: 500,
    status: 'leasing',
    currentTenants: 5,
    totalIncome: 12500,
    monthlyIncome: 2500
  }
])

const filteredLeasingItems = computed(() => {
  if (activeLeasingFilter.value === 'all') {
    return allLeasingItems.value
  }
  return allLeasingItems.value.filter(item => item.status === activeLeasingFilter.value)
})

// 合作数据
interface CooperationItem {
  id: string
  name: string
  emoji: string
  companyName: string
  category: string
  cooperationType: string
  shareRatio: number
  status: string
  partners: number
  totalShare: number
  monthlyShare: number
}

const cooperationFilters = ref([
  { key: 'all', label: '全部' },
  { key: 'cooperating', label: '合作中' },
  { key: 'ended', label: '已结束' }
])

const activeCooperationFilter = ref('all')

const allCooperationItems = ref<CooperationItem[]>([
  {
    id: 'coop-001',
    name: '优选商城系统',
    emoji: '🛒',
    companyName: '优选商城',
    category: '电商平台',
    cooperationType: '利润分成',
    shareRatio: 30,
    status: 'cooperating',
    partners: 3,
    totalShare: 45000,
    monthlyShare: 8000
  }
])

const filteredCooperationItems = computed(() => {
  if (activeCooperationFilter.value === 'all') {
    return allCooperationItems.value
  }
  return allCooperationItems.value.filter(item => item.status === activeCooperationFilter.value)
})

const miniProgramFilters = ref([
  { key: 'all', label: '全部' },
  { key: 'published', label: '已上架' },
  { key: 'developing', label: '开发中' }
])

const activeMiniProgramFilter = ref('all')

const allMiniPrograms = ref<MiniProgramItem[]>([
  {
    id: 'mp-001',
    name: '太湖直播',
    emoji: '📺',
    companyName: '太湖学院',
    category: '直播服务',
    status: 'published',
    statusText: '已上架',
    todayVisits: 1234,
    todayIncome: 123,
    newUsers: 56,
    orders: 12
  },
  {
    id: 'mp-002',
    name: '太湖教学',
    emoji: '🎓',
    companyName: '太湖学院',
    category: '教育培训',
    status: 'developing',
    statusText: '开发中',
    todayVisits: 0,
    todayIncome: 0,
    newUsers: 0,
    orders: 0
  },
  {
    id: 'mp-003',
    name: '王记点餐',
    emoji: '🍜',
    companyName: '王记小吃店',
    category: '点餐平台',
    status: 'published',
    statusText: '已上架',
    todayVisits: 567,
    todayIncome: 89,
    newUsers: 23,
    orders: 8
  },
  {
    id: 'mp-004',
    name: '王记外卖',
    emoji: '🛵',
    companyName: '王记小吃店',
    category: '外卖配送',
    status: 'developing',
    statusText: '开发中',
    todayVisits: 0,
    todayIncome: 0,
    newUsers: 0,
    orders: 0
  },
  {
    id: 'mp-005',
    name: '优选购物',
    emoji: '🛒',
    companyName: '优选商城',
    category: '电商平台',
    status: 'published',
    statusText: '已上架',
    todayVisits: 2345,
    todayIncome: 456,
    newUsers: 89,
    orders: 34
  }
])

// 过滤后的小程序列表
const filteredMiniPrograms = computed(() => {
  if (activeMiniProgramFilter.value === 'all') {
    return allMiniPrograms.value
  }
  return allMiniPrograms.value.filter(mp => mp.status === activeMiniProgramFilter.value)
})

// ===== App数据 =====
interface AppItem {
  id: string
  name: string
  emoji: string
  companyName: string
  version: string
  status: string
  statusText: string
  todayClicks: number
  totalClicks: number
}

const appFilters = ref([
  { key: 'all', label: '全部' },
  { key: 'published', label: '已上架' },
  { key: 'reviewing', label: '审核中' }
])

const activeAppFilter = ref('all')

const allApps = ref<AppItem[]>([
  {
    id: 'app-001',
    name: '太湖课堂',
    emoji: '⭐',
    companyName: '太湖学院',
    version: 'v1.2.0',
    status: 'published',
    statusText: '已上架',
    todayClicks: 456,
    totalClicks: 12345
  },
  {
    id: 'app-002',
    name: '优选购物',
    emoji: '🛍️',
    companyName: '优选商城',
    version: 'v2.1.0',
    status: 'published',
    statusText: '已上架',
    todayClicks: 234,
    totalClicks: 8901
  },
  {
    id: 'app-003',
    name: '王记外卖',
    emoji: '🛵',
    companyName: '王记小吃店',
    version: 'v1.0.0',
    status: 'reviewing',
    statusText: '审核中',
    todayClicks: 0,
    totalClicks: 0
  }
])

// 过滤后的App列表
const filteredApps = computed(() => {
  if (activeAppFilter.value === 'all') {
    return allApps.value
  }
  return allApps.value.filter(app => app.status === activeAppFilter.value)
})

// ===== 事件处理 =====

// 公司相关
const handleCompanyClick = (company: Company) => {
  console.log('点击公司:', company)
  uni.navigateTo({
    url: `/pages/profile/company-detail?id=${company.id}`
  })
}

// 小程序相关
const handleMiniProgramFilterChange = (key: string) => {
  activeMiniProgramFilter.value = key
}

const handleMiniProgramClick = (program: MiniProgramItem) => {
  console.log('点击小程序:', program)
  uni.navigateTo({
    url: `/pages/profile/miniprogram-manage?id=${program.id}`
  })
}

const addMiniProgram = () => {
  uni.navigateTo({
    url: '/pages/profile/miniprogram-add'
  })
}

// App相关
const handleAppFilterChange = (key: string) => {
  activeAppFilter.value = key
}

const handleAppClick = (app: AppItem) => {
  console.log('点击App:', app)
}

const handleAppDetail = (app: AppItem) => {
  console.log('查看App详情:', app)
  uni.navigateTo({
    url: `/pages/profile/app-detail?id=${app.id}`
  })
}

const handleAppStats = (app: AppItem) => {
  console.log('查看App数据:', app)
  uni.navigateTo({
    url: `/pages/profile/app-stats?id=${app.id}`
  })
}

const handleAppOffline = (app: AppItem) => {
  uni.showModal({
    title: '确认下架',
    content: `确定要下架App"${app.name}"吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '下架成功',
          icon: 'success'
        })
      }
    }
  })
}

const addApp = () => {
  uni.navigateTo({
    url: '/pages/profile/app-add'
  })
}

// ===== 销售相关事件 =====
const handleSellingFilterChange = (key: string) => {
  activeSellingFilter.value = key
}

const handleSellingClick = (item: SellingItem) => {
  console.log('点击销售项目:', item)
  uni.navigateTo({
    url: `/pages/profile/selling-detail?id=${item.id}`
  })
}

const handleEditSellingIntro = (item: SellingItem) => {
  console.log('编辑销售介绍:', item)
  uni.navigateTo({
    url: `/pages/profile/selling-intro-edit?id=${item.id}`
  })
}

const handleSellingOffline = (item: SellingItem) => {
  uni.showModal({
    title: '确认下架',
    content: `确定要下架"${item.name}"的销售吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '下架成功',
          icon: 'success'
        })
      }
    }
  })
}

const addSellingItem = () => {
  uni.navigateTo({
    url: '/pages/profile/selling-add'
  })
}

// ===== 租赁相关事件 =====
const handleLeasingFilterChange = (key: string) => {
  activeLeasingFilter.value = key
}

const handleLeasingClick = (item: LeasingItem) => {
  console.log('点击租赁项目:', item)
  uni.navigateTo({
    url: `/pages/profile/leasing-detail?id=${item.id}`
  })
}

const handleEditLeasingIntro = (item: LeasingItem) => {
  console.log('编辑租赁介绍:', item)
  uni.navigateTo({
    url: `/pages/profile/leasing-intro-edit?id=${item.id}`
  })
}

const handleLeasingOffline = (item: LeasingItem) => {
  uni.showModal({
    title: '确认下架',
    content: `确定要下架"${item.name}"的租赁吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '下架成功',
          icon: 'success'
        })
      }
    }
  })
}

const addLeasingItem = () => {
  uni.navigateTo({
    url: '/pages/profile/leasing-add'
  })
}

// ===== 合作相关事件 =====
const handleCooperationFilterChange = (key: string) => {
  activeCooperationFilter.value = key
}

const handleCooperationClick = (item: CooperationItem) => {
  console.log('点击合作项目:', item)
  uni.navigateTo({
    url: `/pages/profile/cooperation-detail?id=${item.id}`
  })
}

const handleEditCooperationIntro = (item: CooperationItem) => {
  console.log('编辑合作介绍:', item)
  uni.navigateTo({
    url: `/pages/profile/cooperation-intro-edit?id=${item.id}`
  })
}

const handleCooperationEnd = (item: CooperationItem) => {
  uni.showModal({
    title: '确认结束',
    content: `确定要结束"${item.name}"的合作吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '合作已结束',
          icon: 'success'
        })
      }
    }
  })
}

const addCooperationItem = () => {
  uni.navigateTo({
    url: '/pages/profile/cooperation-add'
  })
}

// 添加公司
const addCompany = () => {
  uni.navigateTo({
    url: '/pages/profile/company-registration-list'
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.company-shop-page {
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
        font-size: 40rpx;
        color: #fff;
        font-weight: bold;
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

    .nav-action {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .add-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }
}

// 横向滑动标签容器
.tabs-container {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;

  .tabs-scroll {
    width: 100%;
    white-space: nowrap;

    .tabs-wrapper {
      display: inline-flex;
      padding: 0 20rpx;
      min-width: 100%;

      .tab-item {
        position: relative;
        padding: 24rpx 30rpx;
        margin: 0 8rpx;
        flex-shrink: 0;
        transition: all 0.3s;

        &:active {
          transform: scale(0.95);
        }

        .tab-text {
          font-size: 28rpx;
          color: #666;
          font-weight: 500;
          white-space: nowrap;
        }

        .tab-indicator {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 6rpx;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3rpx;
        }

        &.active {
          .tab-text {
            color: #667eea;
            font-weight: 600;
          }
        }
      }
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
  padding-bottom: 30rpx;
}

// 标签内容区域
.tab-content {
  min-height: 100%;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

// ===== 分区样式 =====
.section-block {
  margin-bottom: 30rpx;
}

.section-header {
  padding: 30rpx 30rpx 20rpx;

  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #333;
    letter-spacing: 1rpx;
  }
}

// 筛选栏
.filter-bar {
  background: #fff;
  padding: 20rpx 0;
  margin: 0 30rpx 20rpx;
  border-radius: 12rpx;

  .filter-scroll {
    width: 100%;

    .filter-wrapper {
      display: inline-flex;
      padding: 0 20rpx;

      .filter-item {
        flex-shrink: 0;
        padding: 12rpx 28rpx;
        margin: 0 8rpx;
        border-radius: 24rpx;
        background: #f5f5f5;
        transition: all 0.3s;

        &:active {
          transform: scale(0.95);
        }

        .filter-text {
          font-size: 26rpx;
          color: #666;
          font-weight: 500;
          white-space: nowrap;
        }

        &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

          .filter-text {
            color: #fff;
            font-weight: 600;
          }
        }
      }
    }
  }
}

// 公司卡片
.company-list {
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .company-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    &:active {
      transform: scale(0.98);
    }

    .company-header {
      display: flex;
      align-items: center;

      .company-icon {
        font-size: 56rpx;
        margin-right: 20rpx;
      }

      .company-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .company-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }

        .company-meta,
        .company-stats {
          font-size: 24rpx;
          color: #999;
        }
      }

      .arrow-icon {
        font-size: 40rpx;
        color: #ccc;
        font-weight: 300;
      }
    }
  }
}

// 小程序卡片
.miniprogram-list {
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .miniprogram-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    &:active {
      transform: scale(0.98);
    }

    .program-header {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .program-emoji {
        font-size: 56rpx;
        margin-right: 20rpx;
      }

      .program-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6rpx;

        .program-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }

        .program-meta {
          font-size: 24rpx;
          color: #999;
        }
      }

      .program-status {
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        font-size: 22rpx;
        font-weight: 500;

        &.online {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }

        &.offline {
          background: rgba(153, 153, 153, 0.1);
          color: #999;
        }
      }
    }

    .data-divider {
      height: 1rpx;
      background: #f0f0f0;
      margin: 16rpx 0;
    }

    .program-data {
      display: flex;
      flex-direction: column;
      gap: 10rpx;

      .data-title {
        font-size: 26rpx;
        color: #667eea;
        font-weight: 600;
      }

      .data-item {
        font-size: 24rpx;
        color: #666;
        padding-left: 10rpx;
      }
    }
  }
}

// App卡片
.app-list {
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .app-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    &:active {
      transform: scale(0.98);
    }

    .app-header {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .app-emoji {
        font-size: 56rpx;
        margin-right: 20rpx;
      }

      .app-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6rpx;

        .app-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }

        .app-meta {
          font-size: 24rpx;
          color: #999;
        }
      }
    }

    .data-divider {
      height: 1rpx;
      background: #f0f0f0;
      margin: 16rpx 0;
    }

    .app-data {
      display: flex;
      flex-direction: column;
      gap: 10rpx;
      margin-bottom: 16rpx;

      .data-title {
        font-size: 26rpx;
        color: #667eea;
        font-weight: 600;
      }

      .data-item {
        font-size: 24rpx;
        color: #666;
        padding-left: 10rpx;
      }
    }

    .app-actions {
      display: flex;
      gap: 12rpx;

      .action-btn {
        flex: 1;
        height: 56rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8rpx;
        transition: all 0.3s;

        &:active {
          opacity: 0.8;
          transform: scale(0.95);
        }

        .action-text {
          font-size: 26rpx;
          color: #fff;
          font-weight: 500;
        }

        &.danger {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
        }
      }
    }
  }
}

// 添加按钮
.add-button {
  margin: 20rpx 30rpx;
  padding: 28rpx;
  background: #fff;
  border: 2rpx dashed #667eea;
  border-radius: 16rpx;
  text-align: center;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    background: rgba(102, 126, 234, 0.05);
  }

  .add-text {
    font-size: 28rpx;
    color: #667eea;
    font-weight: 600;
  }
}

// ===== 销售卡片 =====
.selling-list {
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .selling-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    &:active {
      transform: scale(0.98);
    }

    .selling-header {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .selling-emoji {
        font-size: 56rpx;
        margin-right: 20rpx;
      }

      .selling-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .selling-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }

        .selling-meta {
          font-size: 24rpx;
          color: #999;
        }

        .selling-price {
          font-size: 28rpx;
          color: #667eea;
          font-weight: 600;
        }
      }
    }

    .selling-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16rpx;
      border-top: 1rpx solid #f0f0f0;

      .status-text {
        font-size: 24rpx;
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        font-weight: 500;

        &.selling {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        &.offline {
          background: rgba(153, 153, 153, 0.1);
          color: #999;
        }
      }

      .footer-actions {
        display: flex;
        gap: 12rpx;

        .edit-btn {
          padding: 10rpx 24rpx;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8rpx;

          &:active {
            opacity: 0.8;
          }

          .edit-text {
            font-size: 26rpx;
            color: #fff;
            font-weight: 500;
          }
        }

        .offline-btn {
          padding: 10rpx 24rpx;
          background: #f5f5f5;
          border-radius: 8rpx;

          &:active {
            background: #e8e8e8;
          }

          .offline-text {
            font-size: 26rpx;
            color: #666;
            font-weight: 500;
          }
        }
      }
    }
  }
}

// ===== 租赁卡片 =====
.leasing-list {
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .leasing-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    &:active {
      transform: scale(0.98);
    }

    .leasing-header {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .leasing-emoji {
        font-size: 56rpx;
        margin-right: 20rpx;
      }

      .leasing-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .leasing-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }

        .leasing-meta {
          font-size: 24rpx;
          color: #999;
        }

        .leasing-price {
          font-size: 28rpx;
          color: #ff9800;
          font-weight: 600;
        }
      }
    }

    .leasing-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16rpx;
      border-top: 1rpx solid #f0f0f0;

      .status-text {
        font-size: 24rpx;
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        font-weight: 500;

        &.leasing {
          background: rgba(255, 152, 0, 0.1);
          color: #ff9800;
        }

        &.offline {
          background: rgba(153, 153, 153, 0.1);
          color: #999;
        }
      }

      .footer-actions {
        display: flex;
        gap: 12rpx;

        .edit-btn {
          padding: 10rpx 24rpx;
          background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
          border-radius: 8rpx;

          &:active {
            opacity: 0.8;
          }

          .edit-text {
            font-size: 26rpx;
            color: #fff;
            font-weight: 500;
          }
        }

        .offline-btn {
          padding: 10rpx 24rpx;
          background: #f5f5f5;
          border-radius: 8rpx;

          &:active {
            background: #e8e8e8;
          }

          .offline-text {
            font-size: 26rpx;
            color: #666;
            font-weight: 500;
          }
        }
      }
    }
  }
}

// ===== 合作卡片 =====
.cooperation-list {
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .cooperation-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    &:active {
      transform: scale(0.98);
    }

    .cooperation-header {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .cooperation-emoji {
        font-size: 56rpx;
        margin-right: 20rpx;
      }

      .cooperation-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .cooperation-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }

        .cooperation-meta {
          font-size: 24rpx;
          color: #999;
        }

        .cooperation-share {
          font-size: 28rpx;
          color: #4caf50;
          font-weight: 600;
        }
      }
    }

    .cooperation-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16rpx;
      border-top: 1rpx solid #f0f0f0;

      .status-text {
        font-size: 24rpx;
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        font-weight: 500;

        &.cooperating {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }

        &.ended {
          background: rgba(153, 153, 153, 0.1);
          color: #999;
        }
      }

      .footer-actions {
        display: flex;
        gap: 12rpx;

        .edit-btn {
          padding: 10rpx 24rpx;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          border-radius: 8rpx;

          &:active {
            opacity: 0.8;
          }

          .edit-text {
            font-size: 26rpx;
            color: #fff;
            font-weight: 500;
          }
        }

        .offline-btn {
          padding: 10rpx 24rpx;
          background: #f5f5f5;
          border-radius: 8rpx;

          &:active {
            background: #e8e8e8;
          }

          .offline-text {
            font-size: 26rpx;
            color: #666;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
