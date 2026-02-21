<template>
  <view class="qrcode-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-button" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">我的二维码</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="user-avatar-container">
          <image
            v-if="userInfo.avatar"
            class="user-avatar"
            :src="userInfo.avatar"
            mode="aspectFill"
          />
          <view v-else class="user-avatar default">
            <text class="avatar-placeholder">{{ userInfo.nickname?.charAt(0) || '用' }}</text>
          </view>
        </view>
        <text class="user-nickname">{{ userInfo.nickname || '未设置昵称' }}</text>
        <text class="user-id">用户ID：{{ userInfo.userId }}</text>
      </view>

      <!-- 二维码区域 -->
      <view class="qrcode-container">
        <view class="qrcode-box">
          <!-- 使用二维码生成组件 -->
          <qrcode-generator
            :content="qrcodeContent"
            :size="200"
            canvas-id="my-qrcode"
          />
        </view>
        <text class="qrcode-tip">扫码添加我</text>
      </view>

      <!-- 底部说明 -->
      <view class="footer-section">
        <text class="footer-text">我的二维码</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import QrcodeGenerator from '@/components/qrcode-generator/qrcode-generator.vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 二维码内容
const qrcodeContent = computed(() => {
  // 生成二维码内容（可以包含用户信息、后端参数等）
  return `HDUDU://user/${userInfo.value.userId}?name=${encodeURIComponent(userInfo.value.nickname || '')}`
})

// 用户信息
interface UserInfo {
  avatar?: string
  nickname?: string
  phone?: string
  userId: string
  isRealNameVerified: boolean
  realName?: string
  idCard?: string
}

const userInfo = ref<UserInfo>({
  userId: '10001',
  isRealNameVerified: false
})

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 加载用户信息
const loadUserInfo = () => {
  try {
    const saved = uni.getStorageSync('user_info')
    if (saved) {
      const parsed = JSON.parse(saved)
      userInfo.value = { ...userInfo.value, ...parsed }
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载用户信息
  loadUserInfo()
})
</script>

<style scoped lang="scss">
.qrcode-page {
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
  padding: 30rpx;
  min-height: 100vh;
}

// 用户信息卡片
.user-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .user-avatar-container {
    margin-bottom: 20rpx;

    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid rgba(102, 126, 234, 0.2);

      &.default {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-placeholder {
          font-size: 56rpx;
          color: #fff;
          font-weight: 600;
        }
      }
    }
  }

  .user-nickname {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 8rpx;
  }

  .user-id {
    font-size: 24rpx;
    color: #999;
  }
}

// 二维码容器
.qrcode-container {
  background: #fff;
  border-radius: 16rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .qrcode-box {
    width: 500rpx;
    height: 500rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30rpx;

    .qrcode-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .qrcode-canvas {
        width: 500rpx;
        height: 500rpx;
      }
    }
  }

  .qrcode-tip {
    font-size: 28rpx;
    color: #667eea;
    font-weight: 500;
  }
}

// 底部说明
.footer-section {
  margin-top: 60rpx;
  text-align: center;

  .footer-text {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
