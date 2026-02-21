<template>
  <view class="phone-setting-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">手机号设置</text>
        <view class="save-btn" @tap="savePhone">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 当前手机号 -->
      <view v-if="currentPhone" class="current-phone-section">
        <text class="section-title">当前手机号</text>
        <view class="phone-display">
          <text class="phone-text">{{ maskPhoneNumber(currentPhone) }}</text>
        </view>
      </view>

      <!-- 输入新手机号 -->
      <view class="input-section">
        <text class="section-title">{{ currentPhone ? '更换手机号' : '绑定手机号' }}</text>

        <view class="input-group">
          <view class="input-wrapper">
            <text class="input-prefix">+86</text>
            <input
              v-model="phoneNumber"
              class="phone-input"
              type="number"
              placeholder="请输入手机号"
              :maxlength="11"
              @input="onPhoneInput"
            />
            <view v-if="phoneNumber" class="clear-btn" @tap="clearPhone">
              <text class="clear-icon">×</text>
            </view>
          </view>
        </view>

        <!-- 验证码 -->
        <view class="input-group">
          <view class="input-wrapper">
            <input
              v-model="verifyCode"
              class="code-input"
              type="number"
              placeholder="请输入验证码"
              :maxlength="6"
            />
            <view
              :class="['send-code-btn', { disabled: countdown > 0 || !canSendCode }]"
              @tap="sendVerifyCode"
            >
              <text class="code-text">{{ countdown > 0 ? `${countdown}s` : '发送验证码' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="tips-section">
        <text class="tips-title">温馨提示</text>
        <text class="tips-item">• 手机号用于账号安全验证和找回密码</text>
        <text class="tips-item">• 验证码5分钟内有效</text>
        <text class="tips-item">• 为了您的账号安全，请勿泄露验证码</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 手机号相关
const currentPhone = ref('')
const phoneNumber = ref('')
const verifyCode = ref('')
const countdown = ref(0)
const canSendCode = ref(false)

// 手机号输入
const onPhoneInput = () => {
  // 手机号输入验证
  canSendCode.value = /^1[3-9]\d{9}$/.test(phoneNumber.value)
}

// 清空手机号
const clearPhone = () => {
  phoneNumber.value = ''
  canSendCode.value = false
}

// 发送验证码
const sendVerifyCode = () => {
  if (!canSendCode.value) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }

  if (countdown.value > 0) {
    return
  }

  // TODO: 调用发送验证码接口
  uni.showLoading({ title: '发送中...', mask: true })

  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    })

    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }, 1000)
}

// 手机号脱敏
const maskPhoneNumber = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 保存手机号
const savePhone = () => {
  if (!phoneNumber.value) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }

  if (!verifyCode.value) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    })
    return
  }

  // TODO: 验证验证码
  uni.showLoading({ title: '保存中...', mask: true })

  setTimeout(() => {
    // 保存到本地存储
    try {
      const saved = uni.getStorageSync('user_info')
      if (saved) {
        const userData = JSON.parse(saved)
        userData.phone = phoneNumber.value
        uni.setStorageSync('user_info', JSON.stringify(userData))
      }

      uni.hideLoading()
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })

      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } catch (e) {
      console.error('保存手机号失败:', e)
      uni.hideLoading()
      uni.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  }, 1000)
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
      const userData = JSON.parse(saved)
      currentPhone.value = userData.phone || ''
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
})
</script>

<style scoped lang="scss">
.phone-setting-page {
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

    .save-btn {
      padding: 12rpx 24rpx;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50rpx;

      .save-text {
        font-size: 28rpx;
        color: #fff;
        font-weight: 500;
      }

      &:active {
        background: rgba(255, 255, 255, 0.4);
      }
    }
  }
}

// 主内容区域
.main-content {
  padding: 30rpx;
  padding-bottom: 40rpx;
}

// 当前手机号
.current-phone-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-size: 28rpx;
    color: #666;
    display: block;
    margin-bottom: 20rpx;
  }

  .phone-display {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 12rpx;
    padding: 24rpx;
    text-align: center;

    .phone-text {
      font-size: 36rpx;
      font-weight: 600;
      color: #667eea;
    }
  }
}

// 输入区域
.input-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-size: 28rpx;
    color: #666;
    display: block;
    margin-bottom: 24rpx;
  }

  .input-group {
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 12rpx;
      padding: 24rpx;

      .input-prefix {
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
        margin-right: 16rpx;
        padding-right: 16rpx;
        border-right: 2rpx solid #e0e0e0;
      }

      .phone-input,
      .code-input {
        flex: 1;
        font-size: 30rpx;
        color: #333;
        height: 48rpx;
        line-height: 48rpx;
      }

      .clear-btn {
        width: 40rpx;
        height: 40rpx;
        background: #c0c0c0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 16rpx;

        .clear-icon {
          font-size: 36rpx;
          color: #fff;
          line-height: 1;
        }

        &:active {
          background: #a0a0a0;
        }
      }

      .send-code-btn {
        padding: 12rpx 24rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50rpx;
        margin-left: 16rpx;

        .code-text {
          font-size: 24rpx;
          color: #fff;
          font-weight: 500;
        }

        &:active {
          opacity: 0.8;
        }

        &.disabled {
          background: #e0e0e0;
          opacity: 1;

          .code-text {
            color: #999;
          }
        }
      }
    }
  }
}

// 提示信息
.tips-section {
  background: #fffbf0;
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
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
