<template>
  <view class="registrations-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-button" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">我的账户</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 我的小程序区域 -->
      <view class="section-header">
        <text class="section-title">我的小程序</text>
      </view>
      <!-- 公司业务菜单区域 -->
      <view class="company-business-menu">
        <view class="menu-item" @tap="goToWallet">
          <text class="menu-icon">💎</text>
          <text class="menu-title">我的宝库</text>
        </view>

        <view class="menu-item" @tap="goToMiniPrograms">
          <text class="menu-icon">🏢</text>
          <text class="menu-title">我的公司</text>
        </view>

        <view class="menu-item" @tap="goToCooperations">
          <text class="menu-icon">🤝</text>
          <text class="menu-title">我的合作</text>
        </view>

        <view class="menu-item" @tap="goToLeasings">
          <text class="menu-icon">🔄</text>
          <text class="menu-title">我的租赁</text>
        </view>
      </view>

      <!-- 我的访问区域 -->
      <view class="backend-section">
        <view class="section-header">
          <text class="section-title">我的访问</text>
        </view>

        <!-- 后台功能菜单 - 模仿"我的小程序"的样式 -->
        <view class="backend-menu">
          <view class="menu-item">
            <text class="menu-icon">🏪</text>
            <text class="menu-title">仓库管理</text>
          </view>
          <!-- 后续可以添加更多功能 -->
        </view>
      </view>

      <!-- 我的财富流区域 -->
      <view class="wealth-section">
        <view class="section-header">
          <text class="section-title">我的财富流</text>
        </view>

        <!-- 财富流功能菜单 - 模仿"我的小程序"的样式 -->
        <view class="wealth-menu">
          <view class="menu-item">
            <text class="menu-icon">📋</text>
            <text class="menu-title">账单管理</text>
          </view>

          <view class="menu-item">
            <text class="menu-icon">💰</text>
            <text class="menu-title">钱包管理</text>
          </view>
          <!-- 后续可以添加更多功能 -->
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 卡片数据接口
interface Card {
  name: string
  icon: string
  id: string
}

// 非个人主体卡片数据（24个）
const nonPersonalCards = ref<Card[]>([
  { name: '📦 物流服务', icon: '', id: 'logistics' },
  { name: '🎓 教育服务', icon: '', id: 'education' },
  { name: '🏥 医疗服务', icon: '', id: 'medical' },
  { name: '🏛️ 政务民生', icon: '', id: 'government' },
  { name: '💰 金融业', icon: '', id: 'finance' },
  { name: '🚚 交通服务', icon: '', id: 'transport' },
  { name: '🏠 房地产服务', icon: '', id: 'realestate' },
  { name: '🛎️ 生活服务', icon: '', id: 'lifeservice' },
  { name: '💻 IT科技', icon: '', id: 'it' },
  { name: '🍜 餐饮服务', icon: '', id: 'catering' },
  { name: '✈️ 旅游服务', icon: '', id: 'tourism' },
  { name: '📰 时政信息', icon: '', id: 'politics' },
  { name: '🎭 文娱', icon: '', id: 'entertainment' },
  { name: '🔧 工具', icon: '', id: 'tools' },
  { name: '🛒 电商平台', icon: '', id: 'ecommerce' },
  { name: '🏪 商家自营', icon: '', id: 'selfoperated' },
  { name: '💼 商业服务', icon: '', id: 'business' },
  { name: '🎨 工艺', icon: '', id: 'craft' },
  { name: '👥 社交', icon: '', id: 'social' },
  { name: '⚽ 体育', icon: '', id: 'sports' },
  { name: '🚗 汽车服务', icon: '', id: 'automotive' },
  { name: '💬 咨询', icon: '', id: 'consulting' },
  { name: '🔬 深度合成', icon: '', id: 'deepsynthesis' },
  { name: '🧪 内测', icon: '', id: 'beta' }
])

// 个人主体卡片数据（10个）
const personalCards = ref<Card[]>([
  { name: '📮 快递业与邮政', icon: '', id: 'express' },
  { name: '🎓 教育服务', icon: '', id: 'education' },
  { name: '🚚 交通服务', icon: '', id: 'transport' },
  { name: '🛎️ 生活服务', icon: '', id: 'lifeservice' },
  { name: '🍜 餐饮服务', icon: '', id: 'catering' },
  { name: '✈️ 旅游服务', icon: '', id: 'tourism' },
  { name: '🔧 工具', icon: '', id: 'tools' },
  { name: '💼 商业服务', icon: '', id: 'business' },
  { name: '⚽ 体育', icon: '', id: 'sports' },
  { name: '🎭 文娱', icon: '', id: 'entertainment' }
])

// 境外主体卡片数据（15个）
const overseasCards = ref<Card[]>([
  { name: '📮 快递业与邮政', icon: '', id: 'express' },
  { name: '🎓 教育服务', icon: '', id: 'education' },
  { name: '🚗 出行与交通', icon: '', id: 'transport' },
  { name: '🏠 房地产', icon: '', id: 'realestate' },
  { name: '🛎️ 生活服务', icon: '', id: 'lifeservice' },
  { name: '🍜 餐饮', icon: '', id: 'catering' },
  { name: '✈️ 旅游', icon: '', id: 'tourism' },
  { name: '🔧 工具', icon: '', id: 'tools' },
  { name: '💼 商业服务', icon: '', id: 'business' },
  { name: '⚽ 体育', icon: '', id: 'sports' },
  { name: '🚗 汽车', icon: '', id: 'automotive' },
  { name: '💻 IT科技', icon: '', id: 'it' },
  { name: '🏛️ 公共服务', icon: '', id: 'public' },
  { name: '📍 本地服务', icon: '', id: 'local' },
  { name: '🌐 跨境电商', icon: '', id: 'crossborder' }
])

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到公司/店铺页面
const goToMiniPrograms = () => {
  uni.navigateTo({
    url: '/pages/profile/company-shop'
  })
}

// 跳转到我的合作页面
const goToCooperations = () => {
  uni.navigateTo({
    url: '/pages/profile/cooperations'
  })
}

// 跳转到我的租赁页面
const goToLeasings = () => {
  uni.navigateTo({
    url: '/pages/profile/leasings'
  })
}

// 跳转到我的收藏页面
const goToWallet = () => {
  uni.navigateTo({
    url: '/pages/profile/my-collection'
  })
}

// 显示注册限制说明弹窗
const showLimitTip = () => {
  uni.showModal({
    title: '注册说明',
    content: '• 使用企业资料注册的小程序上限：50个\n• 使用个体工商户资料注册的小程序上限：5个',
    showCancel: false,
    confirmText: '我知道了'
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.registrations-page {
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
    padding: 0 30rpx;

    .back-button {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .nav-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .nav-placeholder {
      width: 60rpx;
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
}

// 区域标题
.section-header {
  padding: 10rpx 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }
}

// 公司业务菜单
.company-business-menu {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30rpx 20rpx;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
    }

    .menu-icon {
      font-size: 56rpx;
      margin-bottom: 12rpx;
    }

    .menu-title {
      font-size: 24rpx;
      color: #333;
      font-weight: 500;
    }
  }
}

// 后台/财富流区域
.backend-section,
.wealth-section {
  .section-header {
    padding: 10rpx 30rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .backend-menu,
  .wealth-menu {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    padding: 20rpx;
    background: #fff;
    margin: 20rpx 30rpx;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30rpx 20rpx;
      transition: all 0.3s;

      &:active {
        transform: scale(0.95);
      }

      .menu-icon {
        font-size: 56rpx;
        margin-bottom: 12rpx;
      }

      .menu-title {
        font-size: 24rpx;
        color: #333;
        font-weight: 500;
      }
    }
  }
}
</style>
