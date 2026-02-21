<template>
  <view class="direct-chat-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">直通对话</text>
        <view class="search-icon" @tap="handleSearch">
          <text>🔍</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 功能切换 Tab -->
      <view class="function-tabs">
        <view
          class="tab-item"
          :class="{ active: activeFunctionTab === 'all' }"
          @tap="handleFunctionTabChange('all')"
        >
          <text class="tab-text">全部</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeFunctionTab === 'recruitment' }"
          @tap="handleFunctionTabChange('recruitment')"
        >
          <text class="tab-text">招聘</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeFunctionTab === 'social' }"
          @tap="handleFunctionTabChange('social')"
        >
          <text class="tab-text">社交</text>
        </view>
      </view>

      <!-- 对话类型按钮列表 -->
      <view class="type-buttons">
        <!-- 企业对话 -->
        <view class="type-button" @tap="goToEnterpriseList">
          <view class="button-row">
            <text class="button-text">企业对话</text>
            <text class="arrow">→</text>
          </view>
          <text class="button-count">{{ enterpriseCount }}</text>
        </view>

        <!-- 个人对话 -->
        <view class="type-button" @tap="goToPersonalList">
          <view class="button-row">
            <text class="button-text">个人对话</text>
            <text class="arrow">→</text>
          </view>
          <text class="button-count">{{ personalCount }}</text>
        </view>

        <!-- 客服咨询 -->
        <view class="type-button" @tap="goToCustomerService">
          <view class="button-row">
            <text class="button-text">客服咨询</text>
            <text class="arrow">→</text>
          </view>
          <text class="button-count">{{ customerServiceCount }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 当前选中的功能Tab
const activeFunctionTab = ref<'all' | 'recruitment' | 'social'>('all')

// 各类型对话数量（模拟数据）
const enterpriseCount = ref(128)
const personalCount = ref(56)
const customerServiceCount = ref(12)

// 功能Tab切换
const handleFunctionTabChange = (tab: 'all' | 'recruitment' | 'social') => {
  activeFunctionTab.value = tab
  console.log('切换功能Tab:', tab)
  // TODO: 根据Tab筛选显示的对话数量
}

// 跳转到企业对话列表
const goToEnterpriseList = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/enterprise-list'
  })
}

// 跳转到个人对话列表
const goToPersonalList = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/personal-list'
  })
}

// 跳转到客服咨询主页
const goToCustomerService = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/customer-service-index'
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 搜索功能
const handleSearch = () => {
  uni.showToast({
    title: '搜索功能开发中',
    icon: 'none'
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.direct-chat-page {
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
    height: 88rpx;
    padding: 0 20rpx;
    position: relative;

    .nav-back {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      z-index: 1;

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
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .search-icon {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
      margin-left: auto;

      &:active {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
      }
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
}

// 功能切换Tab
.function-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 30rpx;
  gap: 20rpx;
  border-bottom: 1rpx solid #e5e5e5;

  .tab-item {
    flex: 1;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 32rpx;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
    }

    .tab-text {
      font-size: 28rpx;
      color: #666;
      font-weight: 500;
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);

      .tab-text {
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

// 对话类型按钮列表
.type-buttons {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .type-button {
    background: #fff;
    border-radius: 16rpx;
    padding: 32rpx 40rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
    }

    .button-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12rpx;

      .button-text {
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
      }

      .arrow {
        font-size: 32rpx;
        color: #999;
        font-weight: 300;
      }
    }

    .button-count {
      font-size: 28rpx;
      color: #667eea;
      font-weight: 500;
    }
  }
}
</style>
