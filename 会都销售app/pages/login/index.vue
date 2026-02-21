<template>
  <view class="login-page">
    <!-- GIF背景 - 覆盖整个页面 -->
    <image
      src="/static/background.gif"
      mode="aspectFill"
      class="gif-background"
    />

    <!-- 渐变遮罩 - 覆盖整个页面 -->
    <view class="gradient-overlay"></view>

    <!-- 状态栏占位 -->
    <view class="status-bar"></view>

    <!-- 中间区域 - 显示Logo和标题 -->
    <view class="center-area">
      <!-- Logo和标题 -->
      <image
        src="/static/logo.jpg"
        mode="aspectFit"
        class="logo"
      />
      <text class="title">唐极课得</text>
    </view>

    <!-- 底部登录卡片 -->
    <view class="bottom-card">
      <!-- 登录/注册切换 -->
      <view class="merchant-tabs">
        <view
          :class="['merchant-tab', { active: merchantTab === 'login' }]"
          @click="merchantTab = 'login'"
        >
          登录
        </view>
        <view
          :class="['merchant-tab', { active: merchantTab === 'register' }]"
          @click="merchantTab = 'register'"
        >
          注册新账号
        </view>
      </view>

      <!-- 商户登录表单 -->
      <view v-if="merchantTab === 'login'" class="merchant-form">
        <view class="form-item">
          <text class="label">手机号</text>
          <input
            v-model="merchantLoginForm.phone"
            class="input"
            type="number"
            placeholder="请输入手机号"
            maxlength="11"
            @input="validateMerchantLoginForm"
          />
        </view>

        <!-- 验证码登录 -->
        <view class="form-item">
          <text class="label">验证码</text>
          <view class="sms-input">
            <input
              v-model="merchantLoginForm.smsCode"
              class="input sms-code-input"
              type="number"
              placeholder="请输入验证码"
              maxlength="6"
              @input="validateMerchantLoginForm"
            />
            <button
              class="sms-btn"
              :disabled="merchantLoginForm.countdown > 0 || !merchantLoginForm.phone"
              @click="handleSendSms('login')"
            >
              {{ merchantLoginForm.countdown > 0 ? `${merchantLoginForm.countdown}s` : '获取验证码' }}
            </button>
          </view>
        </view>

        <button
          class="login-btn"
          :disabled="!merchantLoginForm.isValid || merchantLoginForm.loading"
          @click="handleMerchantLogin"
        >
          {{ merchantLoginForm.loading ? '登录中...' : '登录' }}
        </button>
      </view>

      <!-- 商户注册表单 -->
      <view v-if="merchantTab === 'register'" class="merchant-form">
        <view class="form-item">
          <text class="label">手机号</text>
          <input
            v-model="merchantRegisterForm.phone"
            class="input"
            type="number"
            placeholder="请输入手机号"
            maxlength="11"
            @input="validateMerchantRegisterForm"
          />
        </view>

        <view class="form-item">
          <text class="label">验证码</text>
          <view class="sms-input">
            <input
              v-model="merchantRegisterForm.smsCode"
              class="input sms-code-input"
              type="number"
              placeholder="请输入验证码"
              maxlength="6"
              @input="validateMerchantRegisterForm"
            />
            <button
              class="sms-btn"
              :disabled="merchantRegisterForm.countdown > 0 || !merchantRegisterForm.phone"
              @click="handleSendSms('register')"
            >
              {{ merchantRegisterForm.countdown > 0 ? `${merchantRegisterForm.countdown}s` : '获取验证码' }}
            </button>
          </view>
        </view>

        <view class="form-item">
          <text class="label">密码</text>
          <input
            v-model="merchantRegisterForm.password"
            class="input"
            type="password"
            placeholder="请设置密码（6-20位）"
            @input="validateMerchantRegisterForm"
          />
        </view>

        <view class="form-item">
          <text class="label">确认密码</text>
          <input
            v-model="merchantRegisterForm.confirmPassword"
            class="input"
            type="password"
            placeholder="请再次输入密码"
            @input="validateMerchantRegisterForm"
          />
        </view>

        <view class="form-tips">
          <text class="tips-text">• 密码长度6-20位</text>
          <text class="tips-text">• 注册成功后自动登录</text>
        </view>

        <button
          class="login-btn"
          :disabled="!merchantRegisterForm.isValid || merchantRegisterForm.loading"
          @click="handleMerchantRegister"
        >
          {{ merchantRegisterForm.loading ? '注册中...' : '注册' }}
        </button>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 登录/注册切换
const merchantTab = ref<'login' | 'register'>('login')

// 商户登录表单
const merchantLoginForm = ref({
  phone: '',
  smsCode: '',
  loading: false,
  countdown: 0,
  isValid: false
})

// 商户注册表单
const merchantRegisterForm = ref({
  phone: '',
  smsCode: '',
  password: '',
  confirmPassword: '',
  loading: false,
  countdown: 0,
  isValid: false
})

// 倒计时定时器
let countdownTimer: number | null = null

// 验证商户登录表单
const validateMerchantLoginForm = () => {
  const { phone, smsCode } = merchantLoginForm.value
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone)
  merchantLoginForm.value.isValid = isPhoneValid && smsCode.length === 6
}

// 验证商户注册表单
const validateMerchantRegisterForm = () => {
  const { phone, smsCode, password, confirmPassword } = merchantRegisterForm.value
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone)
  const isSmsCodeValid = smsCode.length === 6
  const isPasswordValid = password.length >= 6 && password.length <= 20
  const isConfirmValid = password === confirmPassword

  merchantRegisterForm.value.isValid =
    isPhoneValid && isSmsCodeValid && isPasswordValid && isConfirmValid
}

// 发送验证码
const handleSendSms = async (type: 'login' | 'register') => {
  const phone = type === 'login'
    ? merchantLoginForm.value.phone
    : merchantRegisterForm.value.phone

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '请输入正确的手机号'
    })
    return
  }

  try {
    // TODO: 调用发送验证码 API
    // 暂时使用 Mock
    console.log('发送验证码:', { type, phone })

    // 模拟发送成功
    uni.showToast({
      title: '提示',
      icon: 'success',
      content: '验证码已发送'
    })

    // 开始倒计时
    const formRef = type === 'login' ? merchantLoginForm : merchantRegisterForm
    formRef.value.countdown = 60

    countdownTimer = setInterval(() => {
      formRef.value.countdown--
      if (formRef.value.countdown <= 0) {
        clearInterval(countdownTimer!)
        countdownTimer = null
      }
    }, 1000)
  } catch (error) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '验证码发送失败，请稍后重试'
    })
  }
}

// 商户登录
const handleMerchantLogin = async () => {
  const { phone, smsCode } = merchantLoginForm.value

  // 验证输入
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone)
  if (!isPhoneValid) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '请输入正确的手机号'
    })
    return
  }

  if (smsCode.length !== 6) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '请输入验证码'
    })
    return
  }

  try {
    merchantLoginForm.value.loading = true

    // TODO: 调用商户登录 API
    // 暂时使用 Mock - 默认所有输入都正确
    console.log('商户登录:', { phone, smsCode })

    // 模拟登录成功
    const mockToken = `mock_token_merchant_${Date.now()}`
    const mockUserInfo = {
      id: 1,
      name: '测试商户',
      phone: phone,
      role: 'merchant',
      avatar: ''
    }

    // 保存到本地存储
    uni.setStorageSync('token', mockToken)
    uni.setStorageSync('userInfo', mockUserInfo)

    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500
    })

    // 跳转到首页
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '登录失败，请检查手机号和验证码'
    })
  } finally {
    merchantLoginForm.value.loading = false
  }
}

// 商户注册
const handleMerchantRegister = async () => {
  if (!merchantRegisterForm.value.isValid) return

  const { phone, smsCode, password } = merchantRegisterForm.value

  try {
    merchantRegisterForm.value.loading = true

    // TODO: 调用商户注册 API
    // 暂时使用 Mock - 默认所有输入都正确
    console.log('商户注册:', { phone, smsCode, password })

    // 模拟注册成功
    const mockToken = `mock_token_merchant_${Date.now()}`
    const mockUserInfo = {
      id: 2,
      name: '新商户',
      phone: phone,
      role: 'merchant',
      avatar: ''
    }

    // 保存到本地存储
    uni.setStorageSync('token', mockToken)
    uni.setStorageSync('userInfo', mockUserInfo)

    uni.showToast({
      title: '注册成功',
      icon: 'success',
      duration: 1500
    })

    // 跳转到首页
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '注册失败，请稍后重试'
    })
  } finally {
    merchantRegisterForm.value.loading = false
  }
}

// 页面加载时隐藏 tabBar
onMounted(() => {
  console.log('[登录页] ========== 检查屏幕方向 ==========')

  const systemInfo = uni.getSystemInfoSync()
  const windowWidth = systemInfo.windowWidth || 0
  const windowHeight = systemInfo.windowHeight || 0

  const isLandscape = windowWidth > windowHeight
  console.log('[登录页] 窗口尺寸 - 宽:', windowWidth, '高:', windowHeight)
  console.log('[登录页] 当前是否横屏:', isLandscape ? '❌ 是横屏' : '✓ 是竖屏')

  if (isLandscape) {
    console.log('[登录页] ⚠️⚠️⚠️ 警告:登录页面是横屏!')
  }

  uni.hideTabBar({
    animation: false
  })
})

// 页面卸载时清除定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped lang="scss">
// 状态栏占位
.status-bar {
  height: var(--status-bar-height);
  width: 100%;
  position: relative;
  z-index: 20;
  background: transparent;
}

// 底部安全区域
.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  width: 100%;
  background-color: transparent;
}

// 动画关键帧
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: transparent;
  overflow: hidden;

  // GIF背景 - 覆盖整个页面
  .gif-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 1;
  }

  // 渐变遮罩 - 让GIF背景不要太抢眼
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.05) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.15) 100%
    );
  }
}

// 中间区域 - 显示Logo和标题
.center-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;

  .logo {
    position: relative;
    z-index: 10;
    width: 200rpx;
    height: 200rpx;
    border-radius: 40rpx;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 12rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
    margin-bottom: 40rpx;
    animation: float 3s ease-in-out infinite;
  }

  .title {
    position: relative;
    z-index: 10;
    font-size: 52rpx;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.4);
    animation: fadeInUp 1s ease-out;
  }
}

// 底部卡片 - 沉底的登录表单
.bottom-card {
  position: relative;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  border-radius: 40rpx 40rpx 0 0;
  padding: 60rpx;
  padding-bottom: 0;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.15);
  animation: slideUp 0.6s ease-out;
}

// 登录/注册切换标签
.merchant-tabs {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 32rpx;
  padding: 8rpx;
  margin-bottom: 60rpx;

  .merchant-tab {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #666;
    border-radius: 24rpx;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      font-weight: bold;
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
    }
  }
}

// 表单项
.form-item {
  margin-bottom: 40rpx;

  .label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 500;
  }

  .input {
    width: 100%;
    height: 88rpx;
    padding: 0 24rpx;
    background-color: #f5f5f5;
    border: 1rpx solid #e0e0e0;
    border-radius: 24rpx;
    font-size: 28rpx;
    color: #333;

    &:focus {
      border-color: #667eea;
      background-color: #ffffff;
    }
  }
}

// 验证码输入
.sms-input {
  display: flex;
  align-items: center;
  gap: 24rpx;

  .sms-code-input {
    flex: 1;
  }

  .sms-btn {
    flex-shrink: 0;
    width: 200rpx;
    height: 88rpx;
    font-size: 24rpx;
    color: #667eea;
    background-color: #ffffff;
    border: 1rpx solid #667eea;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

    &:disabled {
      opacity: 0.5;
    }
  }
}

// 提示信息
.form-tips {
  margin-bottom: 40rpx;

  .tips-text {
    display: block;
    font-size: 24rpx;
    color: #999;
    line-height: 1.8;
  }
}

// 登录按钮
.login-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 24rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 16rpx rgba(102, 126, 234, 0.4);
  font-weight: bold;

  &:disabled {
    opacity: 0.5;
  }

  &:not(:disabled):active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}
</style>
