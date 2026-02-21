<template>
  <view class="settings-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">设置</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area">
      <!-- 账号安全 -->
      <view class="setting-section">
        <view class="section-title">账号安全</view>

        <view class="setting-list">
          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/account-security')">
            <view class="setting-item-left">
              <text class="setting-icon">🔐</text>
              <text class="setting-label">账号与安全</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-desc">管理密码、绑定手机</text>
              <text class="setting-arrow">›</text>
            </view>
          </view>

          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/realname-auth')">
            <view class="setting-item-left">
              <text class="setting-icon">✅</text>
              <text class="setting-label">实名认证</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-status verified">已认证</text>
              <text class="setting-arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 消息通知 -->
      <view class="setting-section">
        <view class="section-title">消息通知</view>

        <view class="setting-list">
          <view class="setting-item">
            <view class="setting-item-left">
              <text class="setting-icon">🔔</text>
              <text class="setting-label">订单消息</text>
            </view>
            <view class="setting-item-right">
              <switch
                :checked="settings.orderNotification"
                color="#667eea"
                @change="toggleSetting('orderNotification', $event)"
              />
            </view>
          </view>

          <view class="setting-item">
            <view class="setting-item-left">
              <text class="setting-icon">💬</text>
              <text class="setting-label">系统通知</text>
            </view>
            <view class="setting-item-right">
              <switch
                :checked="settings.systemNotification"
                color="#667eea"
                @change="toggleSetting('systemNotification', $event)"
              />
            </view>
          </view>

          <view class="setting-item">
            <view class="setting-item-left">
              <text class="setting-icon">📢</text>
              <text class="setting-label">活动通知</text>
            </view>
            <view class="setting-item-right">
              <switch
                :checked="settings.activityNotification"
                color="#667eea"
                @change="toggleSetting('activityNotification', $event)"
              />
            </view>
          </view>

          <view class="setting-item">
            <view class="setting-item-left">
              <text class="setting-icon">📱</text>
              <text class="setting-label">推送通知</text>
            </view>
            <view class="setting-item-right">
              <switch
                :checked="settings.pushNotification"
                color="#667eea"
                @change="toggleSetting('pushNotification', $event)"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 通用设置 -->
      <view class="setting-section">
        <view class="section-title">通用设置</view>

        <view class="setting-list">
          <view class="setting-item" @tap="clearCache">
            <view class="setting-item-left">
              <text class="setting-icon">🗑️</text>
              <text class="setting-label">清除缓存</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-desc">{{ cacheSize }}</text>
              <text class="setting-arrow">›</text>
            </view>
          </view>

          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/language')">
            <view class="setting-item-left">
              <text class="setting-icon">🌐</text>
              <text class="setting-label">语言</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-desc">简体中文</text>
              <text class="setting-arrow">›</text>
            </view>
          </view>

          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/font-size')">
            <view class="setting-item-left">
              <text class="setting-icon">🔤</text>
              <text class="setting-label">字体大小</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-desc">标准</text>
              <text class="setting-arrow">›</text>
            </view>
          </view>

          <view class="setting-item" @tap="checkUpdate">
            <view class="setting-item-left">
              <text class="setting-icon">🔄</text>
              <text class="setting-label">检查更新</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-desc">当前版本 1.0.0</text>
              <text class="setting-arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 关于 -->
      <view class="setting-section">
        <view class="section-title">关于</view>

        <view class="setting-list">
          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/about')">
            <view class="setting-item-left">
              <text class="setting-icon">ℹ️</text>
              <text class="setting-label">关于我们</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-arrow">›</text>
            </view>
          </view>

          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/user-agreement')">
            <view class="setting-item-left">
              <text class="setting-icon">📄</text>
              <text class="setting-label">用户协议</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-arrow">›</text>
            </view>
          </view>

          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/privacy-policy')">
            <view class="setting-item-left">
              <text class="setting-icon">🔒</text>
              <text class="setting-label">隐私政策</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-arrow">›</text>
            </view>
          </view>

          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/service-agreement')">
            <view class="setting-item-left">
              <text class="setting-icon">📋</text>
              <text class="setting-label">服务协议</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 其他信息 -->
      <view class="setting-section">
        <view class="setting-list">
          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/feedback')">
            <view class="setting-item-left">
              <text class="setting-icon">💭</text>
              <text class="setting-label">意见反馈</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-arrow">›</text>
            </view>
          </view>

          <view class="setting-item" @tap="navigateTo('/pages/profile/settings/contact')">
            <view class="setting-item-left">
              <text class="setting-icon">📞</text>
              <text class="setting-label">联系我们</text>
            </view>
            <view class="setting-item-right">
              <text class="setting-arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <view class="logout-section">
        <button class="logout-btn" @tap="showLogoutConfirm">退出登录</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 设置项状态
const settings = ref({
  orderNotification: true,
  systemNotification: true,
  activityNotification: false,
  pushNotification: true
})

// 缓存大小
const cacheSize = ref('23.5 MB')

// 切换开关
const toggleSetting = (key: string, e: any) => {
  settings.value[key] = e.detail.value
  uni.showToast({
    title: e.detail.value ? '已开启' : '已关闭',
    icon: 'success',
    duration: 1500
  })
  // TODO: 保存设置到服务器
}

// 清除缓存
const clearCache = () => {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({
          title: '清除中...'
        })

        setTimeout(() => {
          cacheSize.value = '0 MB'
          uni.hideLoading()
          uni.showToast({
            title: '清除成功',
            icon: 'success'
          })
          // TODO: 实际清除缓存逻辑
        }, 1500)
      }
    }
  })
}

// 检查更新
const checkUpdate = () => {
  uni.showLoading({
    title: '检查中...'
  })

  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '已是最新版本',
      icon: 'success'
    })
  }, 1500)
}

// 退出登录确认
const showLogoutConfirm = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 清除登录状态，跳转到登录页
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}

// 页面跳转
const navigateTo = (url: string) => {
  uni.showToast({
    title: '页面开发中',
    icon: 'none'
  })
  // TODO: 实际跳转逻辑
  // uni.navigateTo({ url })
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
.settings-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
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
  }

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
  }

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
    margin-right: 60rpx;
  }
}

// 内容区域
.content-area {
  padding: calc(var(--status-bar-height) + 88rpx + 30rpx) 30rpx 30rpx;
}

// 设置区块
.setting-section {
  margin-bottom: 30rpx;

  .section-title {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;
    padding-left: 10rpx;
  }
}

// 设置列表
.setting-list {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .setting-item-left {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .setting-icon {
      font-size: 40rpx;
    }

    .setting-label {
      font-size: 30rpx;
      color: #333;
    }
  }

  .setting-item-right {
    display: flex;
    align-items: center;
    gap: 10rpx;

    .setting-desc {
      font-size: 26rpx;
      color: #999;
    }

    .setting-status {
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-size: 24rpx;

      &.verified {
        background: #e8f5e9;
        color: #07c160;
      }

      &.unverified {
        background: #fff3e0;
        color: #ff9800;
      }
    }

    .setting-arrow {
      font-size: 40rpx;
      color: #ccc;
      font-weight: 300;
    }
  }
}

// 退出登录区域
.logout-section {
  margin-top: 50rpx;

  .logout-btn {
    width: 100%;
    height: 90rpx;
    background: #fff;
    border-radius: 20rpx;
    font-size: 32rpx;
    color: #f44336;
    border: none;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

    &::after {
      border: none;
    }
  }
}
</style>
