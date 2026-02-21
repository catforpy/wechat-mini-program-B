<template>
  <view class="cooperations-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-button" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">我的合作</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 合作小程序列表 -->
      <view v-if="cooperationApps.length > 0" class="app-list">
        <view
          v-for="app in cooperationApps"
          :key="app.id"
          class="app-item"
          @tap="viewAppDetail(app)"
        >
          <view class="app-left">
            <view class="app-icon-wrapper">
              <text class="app-emoji">{{ app.emoji || '📱' }}</text>
            </view>
            <view class="app-info">
              <text class="app-name">{{ app.name }}</text>
              <text class="app-meta">{{ app.role }} · {{ app.cooperationDate }}</text>
            </view>
          </view>
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <text class="empty-icon">🤝</text>
        <text class="empty-text">还没有参与任何合作</text>
        <text class="empty-hint">添加合作资质后可以管理合作小程序</text>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-btn" @tap="addCooperationQualification">
          <text class="btn-text">添加合作资质</text>
        </view>
        <view class="action-btn primary" @tap="addCooperationApp">
          <text class="btn-text">增加合作小程序</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 合作小程序列表
const cooperationApps = ref([
  {
    id: 1,
    name: 'XX连锁餐饮点餐系统',
    emoji: '🍔',
    role: '战略合作方',
    cooperationDate: '2024-01-01'
  }
])

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 查看小程序详情
const viewAppDetail = (app: any) => {
  uni.showModal({
    title: app.name,
    content: `角色：${app.role}\n合作时间：${app.cooperationDate}\n\n功能开发中...`,
    showCancel: false
  })
}

// 添加合作资质
const addCooperationQualification = () => {
  uni.showModal({
    title: '添加合作资质',
    content: '功能开发中...',
    showCancel: false
  })
}

// 增加合作小程序
const addCooperationApp = () => {
  uni.showModal({
    title: '申请合作',
    content: '请在首页长按小程序卡片，选择"我要申请合作"',
    confirmText: '去首页',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  })
}

// 加载合作列表
const loadCooperations = () => {
  try {
    const saved = uni.getStorageSync('my_cooperations')
    if (saved) {
      cooperationApps.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('加载合作列表失败:', e)
  }
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  loadCooperations()
})
</script>

<style scoped lang="scss">
.cooperations-page {
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
  padding: 20rpx 30rpx 100rpx;
  min-height: 100vh;
}

// 应用列表
.app-list {
  .app-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    .app-left {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 20rpx;

      .app-icon-wrapper {
        width: 80rpx;
        height: 80rpx;
        border-radius: 16rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .app-emoji {
          font-size: 48rpx;
        }
      }

      .app-info {
        flex: 1;

        .app-name {
          font-size: 30rpx;
          font-weight: 600;
          color: #333;
          display: block;
          margin-bottom: 8rpx;
        }

        .app-meta {
          font-size: 24rpx;
          color: #999;
          display: block;
        }
      }
    }

    .arrow-icon {
      font-size: 32rpx;
      color: #ccc;
      font-weight: 300;
    }

    &:active {
      background: #fafafa;
    }
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 120rpx 30rpx;

  .empty-icon {
    display: block;
    font-size: 120rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    display: block;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 12rpx;
  }

  .empty-hint {
    display: block;
    font-size: 24rpx;
    color: #bbb;
  }
}

// 操作按钮
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 40rpx;

  .action-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
    padding: 24rpx;

    .btn-text {
      font-size: 28rpx;
      font-weight: 500;
    }

    &:not(.primary) {
      background: #fff;
      color: #667eea;
      border: 2rpx solid #667eea;
    }

    &.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
