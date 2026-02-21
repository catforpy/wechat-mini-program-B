<template>
  <view class="registration-list-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">公司</view>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 列表视图：上下排列的标签 -->
    <view class="list-view" :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeTab === index }"
        @tap="handleRegistrationTypeClick(index)"
      >
        <text class="tab-text">{{ tab }}</text>
        <text v-if="activeTab === index" class="tab-arrow">→</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area" :style="{ paddingTop: (statusBarHeight + 88 + getTabsHeight()) + 'px' }">
      <!-- 企业注册内容 -->
      <view v-if="activeTab === 0" class="tab-content">
        <view class="info-state">
          <text class="info-text">点击上方"企业注册"开始注册流程</text>
        </view>
      </view>

      <!-- 个体工商户注册内容 -->
      <view v-if="activeTab === 1" class="tab-content">
        <view class="info-state">
          <text class="info-text">点击上方"个体工商户注册"开始注册流程</text>
        </view>
      </view>

      <!-- 店铺注册内容 -->
      <view v-if="activeTab === 2" class="tab-content">
        <view class="info-state">
          <text class="info-text">点击上方"店铺注册"开始注册流程</text>
        </view>
      </view>

      <!-- 电子商务注册内容 -->
      <view v-if="activeTab === 3" class="tab-content">
        <view class="info-state">
          <text class="info-text">点击上方"电子商务注册"开始注册流程</text>
        </view>
      </view>

      <!-- 境外主体注册内容 -->
      <view v-if="activeTab === 4" class="tab-content">
        <view class="info-state">
          <text class="info-text">点击上方"境外主体注册"开始注册流程</text>
        </view>
      </view>

      <!-- 已注册公司管理内容 -->
      <view v-if="activeTab === 5" class="tab-content">
        <view class="empty-state">
          <text class="empty-text">已注册公司管理</text>
          <text class="empty-hint">功能开发中，敬请期待</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 标签列表（上下排列）
const tabs = ['企业注册', '个体工商户注册', '店铺注册', '电子商务注册', '境外主体注册', '已注册公司管理']

// 当前激活的标签
const activeTab = ref(0)

// 计算标签列表高度
const getTabsHeight = () => {
  // 每个tab高度约为：padding(30rpx * 2) + 文字高度(约40rpx) + border(1rpx) ≈ 101rpx
  // 6个标签 + 边框 ≈ 606rpx
  return 606
}

// 点击注册类型
const handleRegistrationTypeClick = (index: number) => {
  const tabName = tabs[index]

  // 根据标签页确定entityType
  let entityType = 'overseas' // 默认境外主体
  if (index === 0 || index === 2 || index === 3) {
    // 企业注册、店铺注册、电子商务注册 -> 公司主体
    entityType = 'company'
  } else if (index === 1) {
    // 个体工商户注册 -> 个人主体
    entityType = 'individual'
  } else if (index === 4) {
    // 境外主体注册 -> 境外主体
    entityType = 'overseas'
  } else if (index === 5) {
    // 已注册公司管理 -> 显示空状态（暂不处理）
    activeTab.value = index
    return
  }

  console.log('=== 点击注册类型 ===')
  console.log('tabName:', tabName)
  console.log('entityType:', entityType)

  // 跳转到add-company页面
  const url = `/pages/profile/add-company?entityType=${entityType}`
  console.log('跳转URL:', url)

  uni.navigateTo({
    url: url,
    success: () => {
      console.log('跳转成功')
    },
    fail: (err) => {
      console.log('跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.registration-list-page {
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

// 列表视图：上下排列的标签
.list-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  z-index: 999;

  .tab-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    transition: background 0.2s;

    .tab-text {
      font-size: 30rpx;
      color: #333;
    }

    .tab-arrow {
      width: 0;
      height: 0;
      border-left: 10rpx solid transparent;
      border-right: 10rpx solid transparent;
      border-top: 10rpx solid #999;
      transform: rotate(-90deg);
    }

    &.active {
      background: #f5f5f5;

      .tab-text {
        color: #667eea;
        font-weight: 600;
      }

      .tab-arrow {
        border-top-color: #667eea;
      }
    }

    &:active {
      opacity: 0.7;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}

// 内容区域
.content-area {
  min-height: calc(100vh - var(--status-bar-height) - 88rpx - 505rpx);
}

.tab-content {
  padding: 60rpx 30rpx;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-text {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 500;
  }

  .empty-hint {
    font-size: 24rpx;
    color: #999;
  }
}

// 信息提示状态
.info-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 30rpx;

  .info-text {
    font-size: 28rpx;
    color: #667eea;
    text-align: center;
    line-height: 1.6;
  }
}
</style>
