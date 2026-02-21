<template>
  <view class="miniprogram-manage-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">{{ miniProgramInfo.name }}</text>
        <view class="nav-status" :class="{ active: miniProgramInfo.status === 'published' }">
          <text class="status-text">{{ miniProgramInfo.statusText }}</text>
        </view>
      </view>
    </view>

    <!-- 侧边菜单 + 主内容区域 -->
    <view class="content-container" :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 侧边菜单 -->
      <scroll-view class="side-menu" scroll-y>
        <view
          v-for="menu in menuList"
          :key="menu.key"
          class="menu-item"
          :class="{ active: activeMenu === menu.key }"
          @tap="handleMenuChange(menu.key)"
        >
          <text class="menu-icon">{{ menu.icon }}</text>
          <text class="menu-label">{{ menu.label }}</text>
          <view v-if="menu.phase === 2" class="phase-tag">阶段2</view>
          <view v-if="menu.phase === 3" class="phase-tag phase3">阶段3</view>
        </view>
      </scroll-view>

      <!-- 主内容区域 -->
      <scroll-view class="main-content" scroll-y>
        <!-- 概览页面 -->
        <view v-if="activeMenu === 'overview'" class="content-section">
          <view class="overview-header">
            <text class="mini-emoji">{{ miniProgramInfo.emoji }}</text>
            <view class="mini-info">
              <text class="mini-name">{{ miniProgramInfo.name }}</text>
              <text class="mini-meta">{{ miniProgramInfo.companyName }} · {{ miniProgramInfo.category }}</text>
            </view>
          </view>

          <!-- 今日数据卡片 -->
          <view class="data-cards">
            <view class="data-card">
              <text class="data-value">{{ todayData.visits }}</text>
              <text class="data-label">今日访问</text>
            </view>
            <view class="data-card">
              <text class="data-value">{{ todayData.users }}</text>
              <text class="data-label">今日用户</text>
            </view>
            <view class="data-card">
              <text class="data-value">{{ todayData.orders }}</text>
              <text class="data-label">今日订单</text>
            </view>
            <view class="data-card">
              <text class="data-value">¥{{ todayData.income }}</text>
              <text class="data-label">今日收入</text>
            </view>
          </view>

          <!-- 快捷操作 -->
          <view class="quick-actions">
            <text class="section-title">快捷操作</text>
            <view class="action-grid">
              <view class="action-item" @tap="handleMenuChange('homepage')">
                <text class="action-icon">🏠</text>
                <text class="action-label">首页配置</text>
              </view>
              <view class="action-item" @tap="handleMenuChange('products')">
                <text class="action-icon">📦</text>
                <text class="action-label">商品管理</text>
              </view>
              <view class="action-item" @tap="handleMenuChange('orders')">
                <text class="action-icon">📋</text>
                <text class="action-label">订单管理</text>
              </view>
              <view class="action-item" @tap="handleMenuChange('settings')">
                <text class="action-icon">⚙️</text>
                <text class="action-label">系统设置</text>
              </view>
            </view>
          </view>

          <!-- 数据趋势 -->
          <view class="trend-section">
            <text class="section-title">数据趋势（近7天）</text>
            <view class="trend-chart">
              <view v-for="(day, index) in weekData" :key="index" class="trend-bar">
                <view class="bar-wrapper">
                  <view class="bar-fill" :style="{ height: (day.value / 100) + '%' }"></view>
                </view>
                <text class="bar-label">{{ day.label }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 首页配置 -->
        <view v-else-if="activeMenu === 'homepage'" class="content-section">
          <view class="config-header">
            <text class="config-title">首页配置</text>
          </view>

          <!-- 小程序基本信息 -->
          <view class="config-card">
            <text class="card-title">📝 基本信息</text>
            <view class="form-item">
              <text class="form-label">小程序名称</text>
              <input class="form-input" v-model="homepageConfig.name" placeholder="请输入小程序名称" />
            </view>
            <view class="form-item">
              <text class="form-label">小程序Logo</text>
              <view class="upload-box" @tap="uploadLogo">
                <image v-if="homepageConfig.logo" :src="homepageConfig.logo" class="upload-img" />
                <view v-else class="upload-placeholder">
                  <text class="upload-icon">+</text>
                  <text class="upload-text">上传Logo</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 导航配置 -->
          <view class="config-card">
            <text class="card-title">🧭 导航配置</text>
            <view class="nav-items">
              <view v-for="(nav, index) in homepageConfig.navItems" :key="index" class="nav-item">
                <text class="nav-index">{{ index + 1 }}</text>
                <input class="nav-input" v-model="nav.name" placeholder="导航名称" />
                <view class="nav-delete" @tap="deleteNav(index)">×</view>
              </view>
              <view class="add-nav-btn" @tap="addNav">
                <text class="add-text">+ 添加导航</text>
              </view>
            </view>
          </view>

          <!-- 轮播图配置 -->
          <view class="config-card">
            <text class="card-title">🖼️ 轮播图/Banner</text>
            <view class="banner-list">
              <view v-for="(banner, index) in homepageConfig.banners" :key="index" class="banner-item">
                <image v-if="banner.image" :src="banner.image" class="banner-img" />
                <view v-else class="banner-placeholder" @tap="uploadBanner(index)">
                  <text class="placeholder-icon">+</text>
                  <text class="placeholder-text">上传图片</text>
                </view>
                <view class="banner-delete" @tap="deleteBanner(index)">×</view>
              </view>
              <view class="add-banner-btn" @tap="addBanner">
                <text class="add-text">+ 添加轮播图</text>
              </view>
            </view>
          </view>

          <view class="save-btn" @tap="saveHomepageConfig">
            <text class="save-text">保存配置</text>
          </view>
        </view>

        <!-- 商品/课程管理 -->
        <view v-else-if="activeMenu === 'products'" class="content-section">
          <view class="products-header">
            <text class="products-title">商品/课程管理</text>
            <view class="add-product-btn" @tap="addProduct">
              <text class="add-text">+ 添加商品</text>
            </view>
          </view>

          <!-- 筛选栏 -->
          <view class="filter-bar">
            <scroll-view class="filter-scroll" scroll-x>
              <view class="filter-wrapper">
                <view
                  v-for="filter in productFilters"
                  :key="filter.key"
                  class="filter-item"
                  :class="{ active: activeProductFilter === filter.key }"
                  @tap="activeProductFilter = filter.key"
                >
                  <text class="filter-text">{{ filter.label }}</text>
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- 商品列表 -->
          <view class="product-list">
            <view v-for="product in filteredProducts" :key="product.id" class="product-card" @tap="editProduct(product)">
              <image v-if="product.image" :src="product.image" class="product-img" />
              <view v-else class="product-img-placeholder">{{ product.name.charAt(0) }}</view>
              <view class="product-info">
                <text class="product-name">{{ product.name }}</text>
                <text class="product-meta">{{ product.category }} · 库存: {{ product.stock }}</text>
                <text class="product-price">¥{{ product.price }}</text>
              </view>
              <view class="product-status" :class="{ onsale: product.status === 'onsale', offsale: product.status === 'offsale' }">
                {{ product.status === 'onsale' ? '在售' : '下架' }}
              </view>
            </view>
          </view>
        </view>

        <!-- 系统设置 -->
        <view v-else-if="activeMenu === 'settings'" class="content-section">
          <view class="settings-header">
            <text class="settings-title">系统设置</text>
          </view>

          <view class="settings-card" @tap="navigateTo('basic')">
            <text class="settings-icon">📝</text>
            <view class="settings-info">
              <text class="settings-label">基本信息</text>
              <text class="settings-desc">小程序名称、分类、描述等</text>
            </view>
            <text class="arrow-icon">›</text>
          </view>

          <view class="settings-card" @tap="navigateTo('payment')">
            <text class="settings-icon">💳</text>
            <view class="settings-info">
              <text class="settings-label">支付配置</text>
              <text class="settings-desc">微信支付、支付宝等</text>
            </view>
            <text class="arrow-icon">›</text>
          </view>

          <view class="settings-card" @tap="navigateTo('delivery')">
            <text class="settings-icon">🚚</text>
            <view class="settings-info">
              <text class="settings-label">物流设置</text>
              <text class="settings-desc">运费模板、配送方式</text>
            </view>
            <text class="arrow-icon">›</text>
          </view>

          <view class="settings-card" @tap="navigateTo('notification')">
            <text class="settings-icon">🔔</text>
            <view class="settings-info">
              <text class="settings-label">消息通知</text>
              <text class="settings-desc">订单通知、系统消息</text>
            </view>
            <text class="arrow-icon">›</text>
          </view>
        </view>

        <!-- 第二、三阶段功能（占位） -->
        <view v-else class="content-section placeholder-section">
          <view class="placeholder-content">
            <text class="placeholder-icon">🚧</text>
            <text class="placeholder-title">{{ getCurrentMenuLabel() }}</text>
            <text class="placeholder-desc">此功能将在后续版本中推出</text>
            <view v-if="getCurrentMenuPhase() === 2" class="phase-info">
              <text class="phase-text">预计开发阶段：第二阶段（运营功能）</text>
            </view>
            <view v-if="getCurrentMenuPhase() === 3" class="phase-info">
              <text class="phase-text">预计开发阶段：第三阶段（高级功能）</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 小程序信息
const miniProgramInfo = ref({
  id: '',
  name: '',
  emoji: '',
  companyName: '',
  category: '',
  status: '',
  statusText: ''
})

// 菜单列表（带阶段标识）
const menuList = ref([
  { key: 'overview', label: '概览', icon: '📊', phase: 1 },
  { key: 'homepage', label: '首页配置', icon: '🏠', phase: 1 },
  { key: 'products', label: '商品管理', icon: '📦', phase: 1 },
  { key: 'orders', label: '订单管理', icon: '📋', phase: 2 },
  { key: 'users', label: '用户管理', icon: '👥', phase: 2 },
  { key: 'marketing', label: '营销工具', icon: '🎁', phase: 2 },
  { key: 'analytics', label: '数据分析', icon: '📈', phase: 3 },
  { key: 'settings', label: '系统设置', icon: '⚙️', phase: 1 }
])

// 当前激活的菜单
const activeMenu = ref('overview')

// 今日数据
const todayData = ref({
  visits: 0,
  users: 0,
  orders: 0,
  income: 0
})

// 周数据（用于趋势图）
const weekData = ref([
  { label: '周一', value: 45 },
  { label: '周二', value: 52 },
  { label: '周三', value: 38 },
  { label: '周四', value: 65 },
  { label: '周五', value: 78 },
  { label: '周六', value: 92 },
  { label: '周日', value: 85 }
])

// 首页配置
const homepageConfig = ref({
  name: '',
  logo: '',
  navItems: [
    { name: '首页' },
    { name: '商品' },
    { name: '购物车' },
    { name: '我的' }
  ],
  banners: [
    { image: '' },
    { image: '' }
  ]
})

// 商品数据
const productFilters = ref([
  { key: 'all', label: '全部' },
  { key: 'onsale', label: '在售' },
  { key: 'offsale', label: '下架' },
  { key: 'lowstock', label: '库存不足' }
])

const activeProductFilter = ref('all')

const products = ref([
  { id: '1', name: '直播课程入门', category: '课程', price: 199, stock: 999, status: 'onsale', image: '' },
  { id: '2', name: '高级会员年卡', category: '会员', price: 365, stock: 1000, status: 'onsale', image: '' },
  { id: '3', name: '教学视频合集', category: '视频', price: 299, stock: 500, status: 'offsale', image: '' },
  { id: '4', name: '直播器材套餐', category: '商品', price: 1299, stock: 5, status: 'onsale', image: '' }
])

const filteredProducts = computed(() => {
  if (activeProductFilter.value === 'all') return products.value
  if (activeProductFilter.value === 'lowstock') {
    return products.value.filter(p => p.stock < 10)
  }
  return products.value.filter(p => p.status === activeProductFilter.value)
})

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 切换菜单
const handleMenuChange = (key: string) => {
  activeMenu.value = key
}

// 获取当前菜单标签
const getCurrentMenuLabel = () => {
  const menu = menuList.value.find(m => m.key === activeMenu.value)
  return menu?.label || ''
}

// 获取当前菜单阶段
const getCurrentMenuPhase = () => {
  const menu = menuList.value.find(m => m.key === activeMenu.value)
  return menu?.phase || 0
}

// 首页配置相关方法
const uploadLogo = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      homepageConfig.value.logo = res.tempFilePaths[0]
    }
  })
}

const addNav = () => {
  homepageConfig.value.navItems.push({ name: '' })
}

const deleteNav = (index: number) => {
  homepageConfig.value.navItems.splice(index, 1)
}

const addBanner = () => {
  homepageConfig.value.banners.push({ image: '' })
}

const deleteBanner = (index: number) => {
  homepageConfig.value.banners.splice(index, 1)
}

const uploadBanner = (index: number) => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      homepageConfig.value.banners[index].image = res.tempFilePaths[0]
    }
  })
}

const saveHomepageConfig = () => {
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })
}

// 商品管理相关方法
const addProduct = () => {
  uni.navigateTo({
    url: '/pages/profile/product-edit'
  })
}

const editProduct = (product: any) => {
  uni.navigateTo({
    url: `/pages/profile/product-edit?id=${product.id}`
  })
}

// 系统设置导航
const navigateTo = (type: string) => {
  uni.showToast({
    title: '即将开放',
    icon: 'none'
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}
  const id = options.id

  // 根据ID获取小程序数据（模拟数据）
  if (id === 'mp-001') {
    miniProgramInfo.value = {
      id: 'mp-001',
      name: '太湖直播',
      emoji: '📺',
      companyName: '太湖学院',
      category: '直播服务',
      status: 'published',
      statusText: '已上架'
    }
    todayData.value = {
      visits: 1234,
      users: 56,
      orders: 12,
      income: 123
    }
    homepageConfig.value.name = '太湖直播'
  }
})
</script>

<style scoped lang="scss">
.miniprogram-manage-page {
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
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
    }

    .nav-status {
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      background: rgba(255, 255, 255, 0.2);

      &.active {
        background: rgba(76, 175, 80, 0.3);
      }

      .status-text {
        font-size: 22rpx;
        color: #fff;
      }
    }
  }
}

// 主内容容器
.content-container {
  display: flex;
  height: 100vh;
}

// 侧边菜单
.side-menu {
  width: 180rpx;
  background: #fff;
  border-right: 1rpx solid #e5e5e5;

  .menu-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24rpx 12rpx;
    border-bottom: 1rpx solid #f5f5f5;

      &:active {
        background: #f8f8f8;
      }

      &.active {
        background: rgba(102, 126, 234, 0.1);

        .menu-label {
          color: #667eea;
          font-weight: 600;
        }
      }

      .menu-icon {
        font-size: 40rpx;
        margin-bottom: 8rpx;
      }

      .menu-label {
        font-size: 22rpx;
        color: #666;
        text-align: center;
      }

      .phase-tag {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        padding: 2rpx 8rpx;
        background: #ff9800;
        border-radius: 8rpx;
        font-size: 16rpx;
        color: #fff;

        &.phase3 {
          background: #4caf50;
        }
      }
  }
}

// 主内容区域
.main-content {
  flex: 1;
  padding: 20rpx;
}

.content-section {
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
}

// 概览页面
.overview-header {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;

  .mini-emoji {
    font-size: 64rpx;
    margin-right: 20rpx;
  }

  .mini-info {
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .mini-name {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .mini-meta {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.data-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 20rpx;

  .data-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .data-value {
      font-size: 40rpx;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 8rpx;
    }

    .data-label {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.quick-actions {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;

  .action-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx;
      border-radius: 12rpx;
      background: rgba(102, 126, 234, 0.05);

      &:active {
        transform: scale(0.95);
      }

      .action-icon {
        font-size: 48rpx;
        margin-bottom: 12rpx;
      }

      .action-label {
        font-size: 22rpx;
        color: #666;
        text-align: center;
      }
    }
  }
}

.trend-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;

  .trend-chart {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 200rpx;
    margin-top: 20rpx;

    .trend-bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .bar-wrapper {
        width: 40rpx;
        height: 150rpx;
        background: #f5f5f5;
        border-radius: 8rpx;
        overflow: hidden;
        margin-bottom: 12rpx;

        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 8rpx;
          transition: height 0.3s;
        }
      }

      .bar-label {
        font-size: 20rpx;
        color: #999;
      }
    }
  }
}

// 配置页面通用样式
.config-header,
.products-header,
.settings-header {
  margin-bottom: 20rpx;

  .config-title,
  .products-title,
  .settings-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.config-card,
.settings-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;

  .card-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 20rpx;

  .form-label {
    font-size: 26rpx;
    color: #666;
  }

  .form-input {
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 12rpx;
    font-size: 28rpx;
  }
}

.upload-box {
  width: 160rpx;
  height: 160rpx;
  border: 2rpx dashed #e5e5e5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .upload-img {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;

    .upload-icon {
      font-size: 48rpx;
      color: #ccc;
    }

    .upload-text {
      font-size: 22rpx;
      color: #999;
    }
  }
}

// 导航配置
.nav-items {
  .nav-item {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 16rpx;

    .nav-index {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #667eea;
      color: #fff;
      border-radius: 50%;
      font-size: 22rpx;
    }

    .nav-input {
      flex: 1;
      padding: 16rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 8rpx;
      font-size: 26rpx;
    }

    .nav-delete {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ff6b6b;
      color: #fff;
      border-radius: 50%;
      font-size: 32rpx;
    }
  }

  .add-nav-btn {
    padding: 20rpx;
    border: 2rpx dashed #667eea;
    border-radius: 12rpx;
    text-align: center;

    .add-text {
      font-size: 26rpx;
      color: #667eea;
    }
  }
}

// 轮播图配置
.banner-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;

  .banner-item {
    position: relative;
    width: 100%;
    padding-bottom: 60%;
    border-radius: 12rpx;
    overflow: hidden;

    .banner-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .banner-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8rpx;

      .placeholder-icon {
        font-size: 48rpx;
        color: #ccc;
      }

      .placeholder-text {
        font-size: 22rpx;
        color: #999;
      }
    }

    .banner-delete {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      border-radius: 50%;
      font-size: 28rpx;
    }
  }

  .add-banner-btn {
    padding-bottom: 60%;
    border: 2rpx dashed #667eea;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .add-text {
      font-size: 26rpx;
      color: #667eea;
    }
  }
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12rpx;
  padding: 28rpx;
  text-align: center;
  margin-top: 20rpx;

  .save-text {
    font-size: 28rpx;
    color: #fff;
    font-weight: 600;
  }
}

// 商品管理
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .add-product-btn {
    padding: 12rpx 24rpx;
    background: #667eea;
    border-radius: 8rpx;

    .add-text {
      font-size: 24rpx;
      color: #fff;
    }
  }
}

.filter-bar {
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
  margin-bottom: 20rpx;

  .filter-scroll {
    width: 100%;

    .filter-wrapper {
      display: inline-flex;
      gap: 12rpx;

      .filter-item {
        flex-shrink: 0;
        padding: 10rpx 24rpx;
        border-radius: 24rpx;
        background: #f5f5f5;

        &.active {
          background: #667eea;

          .filter-text {
            color: #fff;
          }
        }

        .filter-text {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}

.product-list {
  .product-card {
    background: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
    display: flex;
    align-items: center;

    .product-img {
      width: 100rpx;
      height: 100rpx;
      border-radius: 8rpx;
      margin-right: 16rpx;
    }

    .product-img-placeholder {
      width: 100rpx;
      height: 100rpx;
      border-radius: 8rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-size: 36rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16rpx;
    }

    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6rpx;

      .product-name {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
      }

      .product-meta {
        font-size: 22rpx;
        color: #999;
      }

      .product-price {
        font-size: 28rpx;
        color: #667eea;
        font-weight: 600;
      }
    }

    .product-status {
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;

      &.onsale {
        background: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }

      &.offsale {
        background: rgba(153, 153, 153, 0.1);
        color: #999;
      }
    }
  }
}

// 系统设置
.settings-card {
  display: flex;
  align-items: center;
  padding: 24rpx;

  .settings-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
  }

  .settings-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6rpx;

    .settings-label {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
    }

    .settings-desc {
      font-size: 22rpx;
      color: #999;
    }
  }

  .arrow-icon {
    font-size: 40rpx;
    color: #ccc;
  }
}

// 占位页面
.placeholder-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;

  .placeholder-content {
    text-align: center;

    .placeholder-icon {
      font-size: 120rpx;
      display: block;
      margin-bottom: 20rpx;
    }

    .placeholder-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 12rpx;
    }

    .placeholder-desc {
      font-size: 26rpx;
      color: #999;
      display: block;
      margin-bottom: 20rpx;
    }

    .phase-info {
      background: #fff3cd;
      border: 1rpx solid #ffc107;
      border-radius: 8rpx;
      padding: 16rpx 24rpx;
      display: inline-block;

      .phase-text {
        font-size: 24rpx;
        color: #856404;
      }
    }
  }
}
</style>
