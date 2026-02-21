<template>
  <view class="customer-service-index-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="search-icon" @tap="handleSearch">
          <text>🔍</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 状态切换 Tab -->
      <view class="status-tabs">
        <view
          class="tab-item"
          :class="{ active: activeStatusTab === 'all' }"
          @tap="handleStatusTabChange('all')"
        >
          <text class="tab-text">全部</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeStatusTab === 'pending' }"
          @tap="handleStatusTabChange('pending')"
        >
          <text class="tab-text">待回复</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeStatusTab === 'completed' }"
          @tap="handleStatusTabChange('completed')"
        >
          <text class="tab-text">已完成</text>
        </view>
      </view>

      <!-- 咨询类型按钮列表 -->
      <view class="type-buttons">
        <!-- 应聘咨询 -->
        <view class="type-button" @tap="goToRecruitmentList">
          <view class="button-row">
            <text class="button-text">应聘咨询</text>
            <text class="arrow">→</text>
          </view>
          <text class="button-count">{{ recruitmentCount }}</text>
        </view>

        <!-- 业务咨询 -->
        <view class="type-button" @tap="goToBusinessList">
          <view class="button-row">
            <text class="button-text">业务咨询</text>
            <text class="arrow">→</text>
          </view>
          <text class="button-count">{{ businessCount }}</text>
        </view>

        <!-- 产品咨询 -->
        <view class="type-button" @tap="goToProductList">
          <view class="button-row">
            <text class="button-text">产品咨询</text>
            <text class="arrow">→</text>
          </view>
          <text class="button-count">{{ productCount }}</text>
        </view>

        <!-- 其他咨询 -->
        <view class="type-button" @tap="goToOtherList">
          <view class="button-row">
            <text class="button-text">其他咨询</text>
            <text class="arrow">→</text>
          </view>
          <text class="button-count">{{ otherCount }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 当前选中的状态Tab
const activeStatusTab = ref<'all' | 'pending' | 'completed'>('all')

// 各类型咨询数量（模拟数据）
const recruitmentCount = ref(8)
const businessCount = ref(3)
const productCount = ref(1)
const otherCount = ref(0)

// 状态Tab切换
const handleStatusTabChange = (tab: 'all' | 'pending' | 'completed') => {
  activeStatusTab.value = tab
  console.log('切换状态Tab:', tab)
  // TODO: 根据Tab筛选显示的咨询数量
}

// 跳转到应聘咨询列表
const goToRecruitmentList = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/customer-recruitment'
  })
}

// 跳转到业务咨询列表
const goToBusinessList = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/customer-business'
  })
}

// 跳转到产品咨询列表
const goToProductList = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/customer-product'
  })
}

// 跳转到其他咨询列表
const goToOtherList = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/customer-other'
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
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.customer-service-index-page {
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

    .search-icon {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;

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

// 状态切换Tab
.status-tabs {
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

// 咨询类型按钮列表
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
