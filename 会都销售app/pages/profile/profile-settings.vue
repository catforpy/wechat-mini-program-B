<template>
  <view class="profile-settings-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">个人资料</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 头像设置 -->
      <view class="setting-item" @tap="goToAvatarSetting">
        <text class="item-label">头像</text>
        <view class="item-value">
          <image
            v-if="userInfo.avatar"
            class="avatar-preview"
            :src="userInfo.avatar"
            mode="aspectFill"
          />
          <view v-else class="avatar-preview default">
            <text class="avatar-placeholder">{{ userInfo.nickname?.charAt(0) || '用' }}</text>
          </view>
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 昵称设置 -->
      <view class="setting-item" @tap="goToNicknameSetting">
        <text class="item-label">昵称</text>
        <view class="item-value">
          <text class="value-text">{{ userInfo.nickname || '未设置' }}</text>
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 手机号设置 -->
      <view class="setting-item" @tap="goToPhoneSetting">
        <text class="item-label">手机号</text>
        <view class="item-value">
          <text class="value-text">{{ userInfo.phone || '未绑定' }}</text>
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 实名信息 -->
      <view class="setting-item" @tap="goToRealNameInfo">
        <text class="item-label">实名信息</text>
        <view class="item-value">
          <view v-if="userInfo.isRealNameVerified" class="verified-badge">
            <text class="badge-icon">✓</text>
            <text class="badge-text">已认证</text>
          </view>
          <view v-else class="unverified-badge">
            <text class="badge-text">未认证</text>
          </view>
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 用户ID -->
      <view class="setting-item disabled">
        <text class="item-label">用户ID</text>
        <view class="item-value">
          <text class="value-text">{{ userInfo.userId }}</text>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="tips-section">
        <text class="tips-title">温馨提示</text>
        <text class="tips-item">• 完成实名认证后可使用更多功能</text>
        <text class="tips-item">• 实名认证后将成为名下公司的超级管理员</text>
        <text class="tips-item">• 手机号用于账号安全和找回密码</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

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

// 跳转到头像设置
const goToAvatarSetting = () => {
  uni.navigateTo({
    url: '/pages/profile/avatar-setting'
  })
}

// 跳转到昵称设置
const goToNicknameSetting = () => {
  uni.navigateTo({
    url: '/pages/profile/nickname-setting'
  })
}

// 跳转到手机号设置
const goToPhoneSetting = () => {
  uni.navigateTo({
    url: '/pages/profile/phone-setting'
  })
}

// 跳转到实名信息
const goToRealNameInfo = () => {
  uni.navigateTo({
    url: '/pages/profile/real-name-info'
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载用户信息
  try {
    const saved = uni.getStorageSync('user_info')
    if (saved) {
      userInfo.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
})
</script>

<style scoped lang="scss">
.profile-settings-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 20rpx;

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    height: 88rpx;

    .back-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .nav-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .placeholder {
      width: 60rpx;
    }
  }
}

// 主内容区域
.main-content {
  padding: 20rpx 0;
  padding-bottom: 40rpx;
}

// 设置项
.setting-item {
  background: #fff;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rpx;

  &.disabled {
    opacity: 0.6;
  }

  &:not(.disabled):active {
    background: #f8f8f8;
  }

  .item-label {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
    min-width: 150rpx;
  }

  .item-value {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;

    .avatar-preview {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;

      &.default {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-placeholder {
          font-size: 48rpx;
          color: #fff;
          font-weight: 600;
        }
      }
    }

    .value-text {
      font-size: 28rpx;
      color: #666;
      margin-right: 10rpx;
      max-width: 400rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .verified-badge {
      display: flex;
      align-items: center;
      background: #e8f5e9;
      border-radius: 20rpx;
      padding: 6rpx 16rpx;
      margin-right: 20rpx;

      .badge-icon {
        font-size: 20rpx;
        color: #07c160;
        margin-right: 4rpx;
      }

      .badge-text {
        font-size: 24rpx;
        color: #07c160;
        font-weight: 500;
      }
    }

    .unverified-badge {
      background: #fff3e0;
      border-radius: 20rpx;
      padding: 6rpx 16rpx;
      margin-right: 20rpx;

      .badge-text {
        font-size: 24rpx;
        color: #ff9800;
        font-weight: 500;
      }
    }

    .arrow-icon {
      font-size: 48rpx;
      color: #c0c0c0;
      font-weight: 300;
    }
  }
}

// 提示信息
.tips-section {
  background: #fffbf0;
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
  margin: 30rpx 30rpx 0;
  border-left: 4rpx solid #ffc107;

  .tips-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #ff9800;
    margin-bottom: 16rpx;
    display: block;
  }

  .tips-item {
    font-size: 24rpx;
    color: #666;
    line-height: 1.8;
    display: block;
  }
}
</style>
