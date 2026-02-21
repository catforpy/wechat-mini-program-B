<template>
  <view class="profile-page">
    <!-- 用户信息区域 - 固定在顶部 -->
    <view class="user-info-section" :style="{ paddingTop: statusBarHeight + 'px' }" @tap="goToRealNameInfo">
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
        <view class="verification-badge" v-if="userInfo.isRealNameVerified">
          <text class="badge-icon">✓</text>
        </view>
      </view>
      <view class="user-details">
        <view class="nickname-row">
          <text class="nickname">{{ userInfo.nickname || '未设置昵称' }}</text>
          <view v-if="!userInfo.isRealNameVerified" class="unverified-tag">
            <text class="tag-text">未实名</text>
          </view>
          <view v-else class="verified-tag">
            <text class="tag-icon">✓</text>
            <text class="tag-text">已实名</text>
          </view>
        </view>
        <text class="phone-number">{{ userInfo.phone || '未绑定手机' }}</text>
        <text class="user-id">用户ID：{{ userInfo.userId }}</text>
      </view>
      <view class="arrow-section">
        <!-- 二维码图标 -->
        <view class="qrcode-icon" @tap.stop="goToMyQRCode">
          <text class="qrcode-text">📊</text>
        </view>
        <!-- 箭头图标 -->
        <view class="arrow-icon">
          <text class="arrow-text">›</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 导航菜单列表 -->
      <view class="menu-list">
        <!-- 我的注册 -->
        <view class="menu-item" @tap="goToRegistrations">
          <view class="menu-content">
            <text class="menu-title">个人资讯</text>
            <text class="menu-desc">{{ qualificationsCount }}个公司/个体工商户</text>
          </view>
          <text class="menu-action">›</text>
        </view>

        <!-- 精彩生活 -->
        <view class="menu-item" @tap="goToWonderfulLife">
          <view class="menu-content">
            <text class="menu-title">精彩生活</text>
            <text class="menu-desc">生活服务 / 精彩内容</text>
          </view>
          <text class="menu-action">›</text>
        </view>

        <!-- 商务前讯 -->
        <view class="menu-item" @tap="goToBusinessFrontier">
          <view class="menu-content">
            <text class="menu-title">商务前讯</text>
            <text class="menu-desc">商务资讯 / 行业动态</text>
          </view>
          <text class="menu-action">›</text>
        </view>

        <!-- 我的钱包 -->
        <view class="menu-item" @tap="goToWallet">
          <view class="menu-content">
            <text class="menu-title">我的钱包</text>
            <text class="menu-desc">🌰 {{ balance.douDou }} 都达豆</text>
          </view>
          <text class="menu-action">›</text>
        </view>

        <!-- 客服中心 -->
        <view class="menu-item" @tap="goToCustomerService">
          <view class="menu-content">
            <text class="menu-title">客服中心</text>
            <text class="menu-desc">在线客服 / 常见问题</text>
          </view>
          <text class="menu-action">›</text>
        </view>

        <!-- 设置 -->
        <view class="menu-item" @tap="goToSettings">
          <view class="menu-content">
            <text class="menu-title">设置</text>
            <text class="menu-desc">账号安全 / 消息通知</text>
          </view>
          <text class="menu-action">›</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

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

// 我的钱包余额
const balance = ref({
  douDou: 10000,  // 都达豆
  rmb: 1000       // 人民币（10000都达豆 = 1000人民币）
})

// 计数（从本地存储或其他来源获取）
const qualificationsCount = ref(0)
const cooperationAppsCount = ref(0)
const leasingAppsCount = ref(0)

// 跳转到个人资料设置页面
const goToRealNameInfo = () => {
  uni.navigateTo({
    url: '/pages/profile/profile-settings'
  })
}

// 跳转到我的二维码页面
const goToMyQRCode = () => {
  uni.navigateTo({
    url: '/pages/profile/my-qrcode'
  })
}

// 跳转到我的注册页面
const goToRegistrations = () => {
  uni.navigateTo({
    url: '/pages/profile/registrations'
  })
}

// 跳转到精彩生活页面
const goToWonderfulLife = () => {
  uni.navigateTo({
    url: '/pages/profile/wonderful-life'
  })
}

// 跳转到商务前讯页面
const goToBusinessFrontier = () => {
  uni.navigateTo({
    url: '/pages/profile/business-frontier'
  })
}

// 跳转到钱包详情页
const goToWallet = () => {
  uni.navigateTo({
    url: '/pages/profile/wallet'
  })
}

// 跳转到客服中心
const goToCustomerService = () => {
  uni.switchTab({
    url: '/pages/message/index'
  })
}

// 跳转到设置页面
const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/profile/settings'
  })
}

// 加载用户信息
const loadUserInfo = () => {
  try {
    const saved = uni.getStorageSync('user_info')
    if (saved) {
      userInfo.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
}

// 加载计数数据
const loadCounts = () => {
  try {
    // 加载注册的公司数量
    const submissions = uni.getStorageSync('company_submissions') || []
    const drafts = uni.getStorageSync('company_drafts') || []
    qualificationsCount.value = submissions.length + drafts.length

    // 加载合作小程序数量
    const cooperations = uni.getStorageSync('my_cooperations')
    if (cooperations) {
      cooperationAppsCount.value = JSON.parse(cooperations).length
    }

    // 加载租赁小程序数量
    const leasings = uni.getStorageSync('my_leasings')
    if (leasings) {
      leasingAppsCount.value = JSON.parse(leasings).length
    }
  } catch (e) {
    console.error('加载计数数据失败:', e)
  }
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载用户信息
  loadUserInfo()

  // 加载计数数据
  loadCounts()
})

// 每次页面显示时重新加载用户信息（确保实名状态更新）
onShow(() => {
  loadUserInfo()
  loadCounts()
})
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 用户信息区域 - 固定在顶部
.user-info-section {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30rpx;
  display: flex;
  align-items: center;
  z-index: 999;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

  .user-avatar-container {
    position: relative;
    margin-right: 24rpx;

    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.3);

      &.default {
        background: rgba(255, 255, 255, 0.2);
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

    .verification-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 36rpx;
      height: 36rpx;
      background: #07c160;
      border-radius: 50%;
      border: 3rpx solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;

      .badge-icon {
        font-size: 20rpx;
        color: #fff;
        font-weight: bold;
      }
    }
  }

  .user-details {
    flex: 1;
    display: flex;
    flex-direction: column;

    .nickname-row {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;

      .nickname {
        font-size: 36rpx;
        font-weight: 600;
        color: #fff;
        margin-right: 16rpx;
      }

      .unverified-tag {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 20rpx;
        padding: 6rpx 16rpx;
        display: flex;
        align-items: center;

        .tag-text {
          font-size: 22rpx;
          color: #fff;
        }
      }

      .verified-tag {
        background: rgba(7, 193, 96, 0.3);
        border-radius: 20rpx;
        padding: 6rpx 12rpx;
        display: flex;
        align-items: center;

        .tag-icon {
          font-size: 20rpx;
          color: #07c160;
          margin-right: 4rpx;
        }

        .tag-text {
          font-size: 22rpx;
          color: #07c160;
        }
      }
    }

    .phone-number {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8rpx;
    }

    .user-id {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .arrow-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8rpx;

    .qrcode-icon {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8rpx;

      .qrcode-text {
        font-size: 24rpx;
      }

      &:active {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .arrow-icon {
      .arrow-text {
        font-size: 48rpx;
        color: rgba(255, 255, 255, 0.5);
        font-weight: 300;
      }
    }
  }

  &:active {
    opacity: 0.9;
  }
}

// 主内容区域 - 可滚动
.main-content {
  padding-top: 240rpx; // 为固定的用户信息卡片留出空间
  padding-bottom: 30rpx;
  min-height: 100vh;
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

    .menu-badge {
      padding: 4rpx 12rpx;
      background: #ff3b30;
      border-radius: 20rpx;
      margin-right: 12rpx;

      .badge-count {
        font-size: 20rpx;
        color: #fff;
        font-weight: 600;
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
