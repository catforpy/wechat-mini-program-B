<template>
  <view class="my-access-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">企业浏览</text>
        <CitySelector @city-change="handleCityChange" />
      </view>
    </view>

    <!-- 主内容区域 -->
    <view class="main-content" :style="{ top: (statusBarHeight + 52) + 'px' }">
      <!-- 行业横向滑动标签 -->
      <scroll-view class="industry-tabs" scroll-x :scroll-into-view="industryScrollId" scroll-with-animation>
        <view class="tabs-container">
          <view
            v-for="(category, index) in categories"
            :key="index"
            :id="'industry-tab-' + index"
            class="industry-tab"
            :class="{ active: activeIndustryIndex === index }"
            @tap="handleIndustryClick(index)"
          >
            <text class="tab-text">{{ category }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 搜索框 -->
      <view class="search-row">
        <view class="search-box">
          <text class="search-icon">🔍</text>
          <input
            class="search-input"
            type="text"
            placeholder="搜索单位名称..."
            v-model="searchKeyword"
            @input="handleSearch"
          />
          <text v-if="searchKeyword" class="clear-icon" @tap="handleClearSearch">✕</text>
        </view>
      </view>

      <!-- 标题行 -->
      <view class="title-row">
        <text class="title-text">用途</text>
        <view class="card-type-tabs">
          <view
            class="card-type-tab"
            :class="{ active: activeCardType === 'company' }"
            @tap="handleCardTypeChange('company')"
          >
            <text class="card-type-text">单位名片</text>
          </view>
          <view
            class="card-type-tab"
            :class="{ active: activeCardType === 'personal' }"
            @tap="handleCardTypeChange('personal')"
          >
            <text class="card-type-text">个人名片</text>
          </view>
        </view>
      </view>

      <!-- 左侧：用途滑动栏 -->
      <scroll-view
        class="sidebar"
        scroll-y
      >
        <view class="purpose-list">
          <view
            v-for="(purpose, index) in purposes"
            :key="index"
            class="purpose-item"
            :class="{ active: activePurposeIndex === index }"
            @tap="handlePurposeClick(index)"
          >
            <text class="purpose-name">{{ purpose }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 右侧：所有 app 列表 -->
      <scroll-view
        class="content-area"
        scroll-y
      >
        <!-- 卡片列表 -->
        <view class="app-list">
          <view
            v-for="app in filteredApps"
            :key="app.id"
            class="app-card"
            :class="{ 'published-company': app.type === 'published', 'personal-card': activeCardType === 'personal' }"
            @tap="handleAppClick(app)"
          >
            <!-- 左侧：图标 -->
            <view class="app-icon-wrapper">
              <image
                v-if="app.icon"
                :src="app.icon"
                mode="aspectFill"
                class="app-icon"
                @error="handleImageError"
              />
              <text v-else class="app-emoji">{{ app.emoji || '📱' }}</text>
            </view>

            <!-- 右侧：信息 -->
            <view class="app-info">
              <text class="app-name">{{ app.name }}</text>
              <!-- 单位名片：显示地址 -->
              <text v-if="activeCardType === 'company' && app.type === 'published' && app.address" class="app-address">{{ app.address }}</text>
              <!-- 个人名片：显示职位 -->
              <text v-if="activeCardType === 'personal' && app.position" class="app-address">{{ app.position }}</text>
              <!-- 个人名片：显示联系方式 -->
              <text v-if="activeCardType === 'personal' && app.phone" class="app-contact">{{ app.phone }}</text>
            </view>

            <!-- 招聘标识（仅单位名片显示） -->
            <view v-if="activeCardType === 'company' && app.hasRecruitment" class="recruitment-badge">
              <text class="recruitment-text">聘</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CitySelector from '@/components/common/CitySelector.vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 当前选择的城市
const selectedCity = ref('全国')

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的名片类型
const activeCardType = ref<'company' | 'personal'>('company')

// 所有分类
const categories = ref<string[]>([
  '物流服务', '教育服务', '医疗服务', '政务民生', '金融业',
  '交通服务', '房地产服务', '生活服务', 'IT科技', '餐饮服务',
  '旅游服务', '时政信息', '文娱', '工具', '电商平台',
  '商家自营', '商业服务', '公益', '社交', '体育',
  '汽车服务', '咨询', '深度合成', '内测', '快递业与邮政',
  '教育', '出行与交通', '房地产', '餐饮', '旅游', '汽车',
  '公共服务', '本地服务', '跨境电商'
])

// 用途选项
const purposes = ref<string[]>(['招聘', '社交', '展示'])
const activePurposeIndex = ref(0)

// 当前选中的行业索引
const activeIndustryIndex = ref(0)

// 行业标签滚动位置
const industryScrollId = ref('')

// 模拟 app 数据
interface App {
  id: string
  name: string
  emoji?: string
  icon?: string
  category: string
  type?: 'system' | 'published' // 标识是否为用户发布的企业
  businessScope?: string // 经营范围
  address?: string // 地址
  phone?: string // 电话
  hasRecruitment?: boolean // 是否发布招聘
}

const allApps = ref<App[]>([
  { id: '1', name: '顺丰速运', emoji: '🚚', icon: '', category: '物流服务', type: 'system', hasRecruitment: true },
  { id: '2', name: '京东物流', emoji: '🚚', icon: '', category: '物流服务', type: 'system', hasRecruitment: true },
  { id: '3', name: '中通快递', emoji: '🚚', icon: '', category: '物流服务', type: 'system' },
  { id: '4', name: '学而思', emoji: '📚', icon: '', category: '教育服务', type: 'system', hasRecruitment: true },
  { id: '5', name: '新东方', emoji: '📚', icon: '', category: '教育服务', type: 'system', hasRecruitment: true },
  { id: '6', name: '好大夫在线', emoji: '⚕️', icon: '', category: '医疗服务', type: 'system' },
  { id: '7', name: '丁香医生', emoji: '⚕️', icon: '', category: '医疗服务', type: 'system' },
  { id: '8', name: '个人所得税', emoji: '🏛️', icon: '', category: '政务民生', type: 'system' },
  { id: '9', name: '支付宝', emoji: '💰', icon: '', category: '金融业', type: 'system' },
  { id: '10', name: '微信支付', emoji: '💰', icon: '', category: '金融业', type: 'system' },
  { id: '11', name: '滴滴出行', emoji: '🚗', icon: '', category: '交通服务', type: 'system' },
  { id: '12', name: '链家', emoji: '🏠', icon: '', category: '房地产服务', type: 'system' },
  { id: '13', name: '美团', emoji: '🍜', icon: '', category: '生活服务', type: 'system' },
  { id: '14', name: '饿了么', emoji: '🍜', icon: '', category: '生活服务', type: 'system' },
  { id: '15', name: '钉钉', emoji: '💻', icon: '', category: 'IT科技', type: 'system' },
  { id: '16', name: '企业微信', emoji: '💻', icon: '', category: 'IT科技', type: 'system' },
  { id: '17', name: '饿了么', emoji: '🍜', icon: '', category: '餐饮服务', type: 'system' },
  { id: '18', name: '美团外卖', emoji: '🍜', icon: '', category: '餐饮服务', type: 'system' },
  { id: '19', name: '携程旅行', emoji: '✈️', icon: '', category: '旅游服务', type: 'system' },
  { id: '20', name: '去哪儿', emoji: '✈️', icon: '', category: '旅游服务', type: 'system' },
  { id: '21', name: '12306', emoji: '🔔', icon: '', category: '时政信息', type: 'system' },
  { id: '22', name: '网易云音乐', emoji: '🎵', icon: '', category: '文娱', type: 'system' },
  { id: '23', name: 'QQ音乐', emoji: '🎵', icon: '', category: '文娱', type: 'system' },
  { id: '24', name: '创客贴', emoji: '🔧', icon: '', category: '工具', type: 'system' },
  { id: '25', name: '淘宝', emoji: '🛒', icon: '', category: '电商平台', type: 'system', hasRecruitment: true },
  { id: '26', name: '京东', emoji: '🛒', icon: '', category: '电商平台', type: 'system', hasRecruitment: true },
  { id: '27', name: '拼多多', emoji: '🛒', icon: '', category: '电商平台', type: 'system' },
  { id: '28', name: '京东自营', emoji: '🏪', icon: '', category: '商家自营', type: 'system' },
  { id: '29', name: '美团外卖', emoji: '💼', icon: '', category: '商业服务', type: 'system' },
  { id: '30', name: '支付宝公益', emoji: '❤', icon: '', category: '公益', type: 'system' },
  { id: '31', name: '微信', emoji: '💚', icon: '', category: '社交', type: 'system', hasRecruitment: true },
  { id: '32', name: 'QQ', emoji: '💚', icon: '', category: '社交', type: 'system' },
  { id: '33', name: '懂车帝', emoji: '🚗', icon: '', category: '汽车服务', type: 'system' },
  { id: '34', name: '知乎', emoji: '🧠', icon: '', category: '咨询', type: 'system' },
  { id: '35', name: '剪映', emoji: '✂', icon: '', category: '深度合成', type: 'system' },
  { id: '36', name: 'TestFlight', emoji: '🧪', icon: '', category: '内测', type: 'system' },
  { id: '37', name: '顺丰速运', emoji: '📮', icon: '', category: '快递业与邮政', type: 'system' },
  { id: '38', name: '新东方在线', emoji: '📚', icon: '', category: '教育', type: 'system' },
  { id: '39', name: '哈啰出行', emoji: '🚕', icon: '', category: '出行与交通', type: 'system' },
  { id: '40', name: '贝壳找房', emoji: '🏠', icon: '', category: '房地产', type: 'system' },
  { id: '41', name: '大众点评', emoji: '🍜', icon: '', category: '餐饮', type: 'system' },
  { id: '42', name: '嘀嗒出行', emoji: '🚖', icon: '', category: '汽车', type: 'system' },
  { id: '43', name: '12345', emoji: '📞', icon: '', category: '公共服务', type: 'system' },
  { id: '44', name: '考拉海购', emoji: '🛒', icon: '', category: '跨境电商', type: 'system' },
  { id: '45', name: '本地生活', emoji: '📍', icon: '', category: '本地服务', type: 'system' }
])

// 个人名片数据
const allPersonalCards = ref<any[]>([
  { id: 'personal_001', name: '张三', emoji: '👤', icon: '', category: '物流服务', phone: '138****0000', email: 'zhangsan@example.com', position: '物流经理' },
  { id: 'personal_002', name: '李四', emoji: '👤', icon: '', category: 'IT科技', phone: '139****1111', email: 'lisi@example.com', position: '软件工程师' },
  { id: 'personal_003', name: '王五', emoji: '👤', icon: '', category: 'IT科技', phone: '137****2222', email: 'wangwu@example.com', position: '产品经理' },
  { id: 'personal_004', name: '赵六', emoji: '👤', icon: '', category: '教育服务', phone: '136****3333', email: 'zhaoliu@example.com', position: '英语老师' },
  { id: 'personal_005', name: '孙七', emoji: '👤', icon: '', category: '金融业', phone: '135****4444', email: 'sunqi@example.com', position: '理财顾问' }
])

// 加载已发布的企业
const loadPublishedCompanies = () => {
  try {
    const saved = uni.getStorageSync('published_companies')
    if (saved) {
      const publishedCompanies: any[] = JSON.parse(saved)
      console.log('加载已发布企业:', publishedCompanies.length)

      // 加载招聘信息
      let recruitments: string[] = []
      try {
        const savedRecruitments = uni.getStorageSync('published_recruitments')
        if (savedRecruitments) {
          recruitments = JSON.parse(savedRecruitments)
          console.log('已发布招聘的企业数:', recruitments.length)
        }
      } catch (e) {
        console.error('加载招聘信息失败:', e)
      }

      // 将已发布的企业转换为 App 格式并添加到列表
      publishedCompanies.forEach(company => {
        // 根据 categories 数组找到匹配的分类
        const matchedCategory = company.categories && company.categories.length > 0
          ? company.categories[0] // 使用第一个分类
          : '其他服务'

        // 如果分类在现有分类列表中不存在，添加到分类列表
        if (!categories.value.includes(matchedCategory)) {
          categories.value.push(matchedCategory)
        }

        // 检查是否发布了招聘
        const hasRecruitment = recruitments.includes(company.id)

        // 添加企业到 app 列表
        const app: App = {
          id: company.id,
          name: company.name,
          emoji: company.type === 'individual' ? '🏪' : '🏢',
          icon: company.logo || '',
          category: matchedCategory,
          type: 'published',
          businessScope: company.businessScope,
          address: company.address,
          phone: company.phone,
          hasRecruitment: hasRecruitment
        }

        allApps.value.push(app)
      })

      console.log('已发布企业加载完成，总 app 数:', allApps.value.length)
    }
  } catch (e) {
    console.error('加载已发布企业失败:', e)
  }
}

// 过滤后的应用列表（根据行业、用途和名片类型）
const filteredApps = computed(() => {
  const selectedIndustry = categories.value[activeIndustryIndex.value]
  const selectedPurpose = purposes.value[activePurposeIndex.value]
  const cardType = activeCardType.value

  // 根据名片类型选择数据源
  let dataSource = cardType === 'company' ? allApps.value : allPersonalCards.value

  // 过滤选中的行业
  let apps = dataSource.filter(item => item.category === selectedIndustry)

  // 根据用途进一步筛选（只对单位名片有效）
  if (cardType === 'company' && selectedPurpose === '招聘') {
    apps = apps.filter(app => app.hasRecruitment)
  }
  // 社交和展示都显示所有（暂时不做区分）

  // 如果有搜索关键词，进行过滤
  const keyword = searchKeyword.value.toLowerCase().trim()
  if (keyword) {
    apps = apps.filter(app => {
      const nameMatch = app.name.toLowerCase().includes(keyword)
      const categoryMatch = app.category.toLowerCase().includes(keyword)
      const addressMatch = app.address?.toLowerCase().includes(keyword)
      const positionMatch = app.position?.toLowerCase().includes(keyword)
      return nameMatch || categoryMatch || addressMatch || positionMatch
    })
  }

  return apps
})

// 点击行业标签
const handleIndustryClick = (index: number) => {
  activeIndustryIndex.value = index
  industryScrollId.value = 'industry-tab-' + index
  console.log('点击行业:', categories.value[index])
}

// 点击用途选项
const handlePurposeClick = (index: number) => {
  activePurposeIndex.value = index
  console.log('点击用途:', purposes.value[index])
}

// 切换名片类型
const handleCardTypeChange = (type: 'company' | 'personal') => {
  activeCardType.value = type
  console.log('切换名片类型:', type)
}

// 点击 app
const handleAppClick = (app: App) => {
  console.log('点击 app:', app)
  // 跳转到企业详情页面
  uni.navigateTo({
    url: `/pages/company/detail?id=${app.id}&industry=${encodeURIComponent(app.category)}`
  })
}

// 图片加载失败
const handleImageError = () => {
  console.warn('[图标加载失败]')
}

// 搜索处理
const handleSearch = (e: any) => {
  searchKeyword.value = e.detail.value
}

// 清除搜索
const handleClearSearch = () => {
  searchKeyword.value = ''
}

// 城市改变
const handleCityChange = (city: string) => {
  console.log('城市改变:', city)
  selectedCity.value = city
  // 这里可以根据城市过滤 app 数据
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载已发布的企业
  loadPublishedCompanies()
})
</script>

<style scoped lang="scss">
.my-access-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
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
    height: 88rpx;
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
}

// 主内容区域
.main-content {
  display: flex;
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 240rpx; // 行业标签 80rpx + 搜索框 80rpx + 标题行 80rpx
  box-sizing: border-box;
}

// 行业横向滑动标签
.industry-tabs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  white-space: nowrap;
  z-index: 6;

  .tabs-container {
    display: inline-flex;
    padding: 0 10rpx;
    height: 100%;
    align-items: center;
  }

  .industry-tab {
    flex-shrink: 0;
    padding: 0 24rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin: 0 8rpx;
    border-radius: 30rpx;
    background: #f5f5f5;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);

      .tab-text {
        color: #fff;
        font-weight: 600;
      }
    }

    .tab-text {
      font-size: 26rpx;
      color: #666;
    }
  }
}

// 搜索框行
.search-row {
  position: absolute;
  top: 80rpx; // 在行业标签下方
  left: 0;
  right: 0;
  height: 80rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  z-index: 5;

  .search-box {
    flex: 1;
    height: 60rpx;
    background: #f5f5f5;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    padding: 0 20rpx;

    .search-icon {
      font-size: 28rpx;
      margin-right: 10rpx;
    }

    .search-input {
      flex: 1;
      font-size: 26rpx;
      color: #333;
      height: 100%;
      line-height: 60rpx;
    }

    .clear-icon {
      font-size: 24rpx;
      color: #999;
      padding: 8rpx;
      margin-left: 10rpx;

      &:active {
        color: #666;
      }
    }
  }
}

// 标题行
.title-row {
  position: absolute;
  top: 160rpx; // 行业标签 80rpx + 搜索框 80rpx
  left: 0;
  right: 0;
  height: 80rpx;
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;

  .title-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-child {
      width: 180rpx;
      border-right: 1rpx solid #e5e5e5;
    }
  }

  // 名片类型切换标签
  .card-type-tabs {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 20rpx;

    .card-type-tab {
      flex: 1;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 8rpx;
      border-radius: 8rpx;
      background: #f5f5f5;
      transition: all 0.3s;

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

        .card-type-text {
          color: #fff;
          font-weight: 600;
        }
      }

      .card-type-text {
        font-size: 26rpx;
        color: #666;
      }
    }
  }
}

// 左侧用途滑动栏
.sidebar {
  width: 180rpx;
  height: 100%;
  background: #fff;
  border-right: 1rpx solid #e5e5e5;

  .purpose-list {
    padding: 20rpx 0;

    .purpose-item {
      padding: 30rpx 16rpx;
      border-bottom: 1rpx solid #f0f0f0;
      transition: all 0.2s;

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-left: 4rpx solid #667eea;

        .purpose-name {
          color: #fff;
          font-weight: 600;
        }
      }

      .purpose-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        line-height: 1.3;
        text-align: center;
      }
    }
  }
}

// 右侧内容区域
.content-area {
  flex: 1;
  height: 100%;
  background: #f5f5f5;
  padding: 0 20rpx;
  box-sizing: border-box;
}

// app 卡片列表
.app-list {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.app-card {
  background: #fff;
  border-radius: 12rpx; // 减小圆角
  padding: 12rpx 16rpx; // 减小 padding
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  height: 96rpx; // 从 100rpx 改为 96rpx
  position: relative;
  overflow: hidden; // 防止内容溢出

  // 已发布企业的特殊样式
  &.published-company {
    background: linear-gradient(135deg, #fff8e1 0%, #fff3e0 100%);
    border: 2rpx solid #ff9800;
    box-shadow: 0 2rpx 12rpx rgba(255, 152, 0, 0.15);

    .app-name {
      color: #e65100;
      font-weight: 600;
    }

    .app-icon-wrapper {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      box-shadow: 0 2rpx 8rpx rgba(255, 152, 0, 0.3);
    }
  }

  // 个人名片的特殊样式
  &.personal-card {
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    border: 2rpx solid #9c27b0;
    box-shadow: 0 2rpx 12rpx rgba(156, 39, 176, 0.15);

    .app-name {
      color: #6a1b9a;
      font-weight: 600;
    }

    .app-icon-wrapper {
      background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
      box-shadow: 0 2rpx 8rpx rgba(156, 39, 176, 0.3);
    }
  }

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
  }
}

.app-icon-wrapper {
  width: 68rpx; // 从 80rpx 改为 68rpx
  height: 68rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
  margin-right: 12rpx; // 从 16rpx 改为 12rpx
}

.app-icon {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.app-emoji {
  font-size: 36rpx; // 从 40rpx 改为 36rpx
}

.app-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden; // 防止溢出
}

.app-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%; // 限制最大宽度
}

.app-address {
  font-size: 20rpx;
  color: #999;
  margin-top: 2rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.app-contact {
  font-size: 20rpx;
  color: #666;
  margin-top: 2rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

// 招聘标识
.recruitment-badge {
  position: absolute;
  top: 6rpx;
  right: 6rpx;
  background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
  border-radius: 8rpx;
  padding: 4rpx 10rpx;
  box-shadow: 0 2rpx 6rpx rgba(255, 82, 82, 0.3);
  z-index: 1;

  .recruitment-text {
    font-size: 18rpx;
    color: #fff;
    font-weight: 600;
    line-height: 1;
  }
}
</style>
