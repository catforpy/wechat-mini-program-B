<template>
  <view class="bill-management-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">账单管理</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 账单列表 -->
      <view class="menu-list">
        <view class="menu-item" @tap="goToBillInfo">
          <view class="menu-content">
            <text class="menu-title">账目信息</text>
            <text class="menu-desc">查看账目明细</text>
          </view>
          <text class="menu-action">›</text>
        </view>

        <view class="menu-item" @tap="goToFundsFlow">
          <view class="menu-content">
            <text class="menu-title">资金流水</text>
            <text class="menu-desc">查看资金记录</text>
          </view>
          <text class="menu-action">›</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到账目信息
const goToBillInfo = () => {
  uni.navigateTo({
    url: '/pages/profile/bill-info'
  })
}

// 跳转到资金流水
const goToFundsFlow = () => {
  uni.navigateTo({
    url: '/pages/profile/funds-flow'
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.bill-management-page {
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

    .nav-placeholder {
      width: 60rpx;
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
}

// 菜单列表
.menu-list {
  background: #fff;
  margin: 0 30rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .menu-item {
    display: flex;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid #f0f0f0;
    position: relative;

    &:last-child {
      border-bottom: none;
    }

    .menu-content {
      flex: 1;

      .menu-title {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 4rpx;
        font-weight: 500;
      }

      .menu-desc {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
    }

    .menu-action {
      font-size: 28rpx;
      color: #ccc;
      font-weight: 300;
    }

    &:active {
      background: #fafafa;
    }
  }
}
</style>
