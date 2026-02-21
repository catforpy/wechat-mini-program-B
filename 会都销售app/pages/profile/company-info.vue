<template>
  <view class="company-info-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">企业信息</text>
        <view class="nav-save" @tap="handleSave">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="form-container">
        <!-- 企业logo -->
        <view class="form-item logo-item">
          <text class="form-label">企业Logo</text>
          <view class="logo-wrapper" @tap="handleChooseLogo">
            <image
              v-if="formData.logo"
              class="logo-image"
              :src="formData.logo"
              mode="aspectFill"
            />
            <view v-else class="logo-placeholder">
              <text class="logo-icon">🏢</text>
              <text class="logo-text">上传Logo</text>
            </view>
          </view>
        </view>

        <!-- 企业名称 -->
        <view class="form-item">
          <text class="form-label required">企业名称</text>
          <input
            class="form-input"
            v-model="formData.name"
            placeholder="请输入企业名称"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 税号 -->
        <view class="form-item">
          <text class="form-label required">税号</text>
          <input
            class="form-input"
            v-model="formData.taxNumber"
            placeholder="请输入税号"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 地址 -->
        <view class="form-item">
          <text class="form-label required">企业地址</text>
          <input
            class="form-input"
            v-model="formData.address"
            placeholder="请输入企业地址"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 联系电话 -->
        <view class="form-item">
          <text class="form-label required">联系电话</text>
          <input
            class="form-input"
            v-model="formData.phone"
            type="number"
            placeholder="请输入联系电话"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 邮箱 -->
        <view class="form-item">
          <text class="form-label">企业邮箱</text>
          <input
            class="form-input"
            v-model="formData.email"
            type="email"
            placeholder="请输入企业邮箱"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 邮编 -->
        <view class="form-item">
          <text class="form-label">邮政编码</text>
          <input
            class="form-input"
            v-model="formData.zipCode"
            type="number"
            placeholder="请输入邮政编码"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 提示信息 -->
        <view class="tips-section">
          <text class="tips-icon">ℹ️</text>
          <text class="tips-text">企业信息将用于名片展示和商务联系，请确保信息真实准确</text>
        </view>
      </view>
    </scroll-view>
  </view>

  <!-- 首次填写授权弹窗 -->
  <view v-if="showConsentModal" class="consent-modal-mask" @tap="handleDisagree">
    <view class="consent-modal-content" @tap.stop>
      <view class="consent-header">
        <text class="consent-icon">🏢</text>
        <text class="consent-title">信息收集说明</text>
      </view>

      <view class="consent-body">
        <text class="consent-text">
          为了完善您的企业名片信息，我们需要收集企业基本信息：
        </text>

        <view class="consent-list">
          <text class="consent-item">• 企业名称、税号：用于企业身份识别</text>
          <text class="consent-item">• 企业地址、联系方式：用于商务联系</text>
          <text class="consent-item">• 企业Logo：用于企业品牌展示</text>
          <text class="consent-item">• 邮箱、邮编：用于日常商务沟通</text>
        </view>

        <text class="consent-notice">
          我们承诺：您的企业信息将严格保密，仅用于名片展示和商务联系方式展示，不会泄露给第三方。
        </text>
      </view>

      <view class="consent-footer">
        <view class="consent-btn disagree-btn" @tap="handleDisagree">
          <text class="consent-btn-text">不同意</text>
        </view>
        <view class="consent-btn agree-btn" @tap="handleAgree">
          <text class="consent-btn-text">同意并继续</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 表单数据
const formData = ref({
  name: '',
  taxNumber: '',
  address: '',
  phone: '',
  email: '',
  zipCode: '',
  logo: ''
})

// 授权弹窗
const showConsentModal = ref(false)

// 检查是否首次填写
const checkFirstTime = () => {
  const hasAgreed = uni.getStorageSync('company_info_consented')
  if (!hasAgreed) {
    showConsentModal.value = true
  }
}

// 同意授权
const handleAgree = () => {
  uni.setStorageSync('company_info_consented', true)
  showConsentModal.value = false
}

// 不同意授权
const handleDisagree = () => {
  showConsentModal.value = false
  uni.navigateBack()
}

// 选择Logo
const handleChooseLogo = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.logo = res.tempFilePaths[0]
    }
  })
}

// 保存
const handleSave = () => {
  // 验证必填项
  if (!formData.value.name) {
    uni.showToast({
      title: '请输入企业名称',
      icon: 'none'
    })
    return
  }

  if (!formData.value.taxNumber) {
    uni.showToast({
      title: '请输入税号',
      icon: 'none'
    })
    return
  }

  if (!formData.value.address) {
    uni.showToast({
      title: '请输入企业地址',
      icon: 'none'
    })
    return
  }

  if (!formData.value.phone) {
    uni.showToast({
      title: '请输入联系电话',
      icon: 'none'
    })
    return
  }

  // TODO: 保存到本地存储或服务器
  uni.setStorageSync('company_basic_info', JSON.stringify(formData.value))

  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })

  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载已保存的数据
  const savedData = uni.getStorageSync('company_basic_info')
  if (savedData) {
    try {
      formData.value = JSON.parse(savedData)
    } catch (e) {
      console.error('读取企业信息失败:', e)
    }
  }

  // 检查是否首次填写
  checkFirstTime()
})
</script>

<style scoped lang="scss">
.company-info-page {
  min-height: 100vh;
  background: #f5f5f5;
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

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
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

    .nav-save {
      padding: 12rpx 24rpx;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 24rpx;

      .save-text {
        font-size: 28rpx;
        color: #667eea;
        font-weight: 600;
      }

      &:active {
        background: rgba(255, 255, 255, 1);
      }
    }
  }
}

// 主内容区域
.content-scroll {
  height: 100vh;
  padding-top: calc(var(--status-bar-height) + 88rpx);
}

.form-container {
  padding: 30rpx;
}

// 表单项
.form-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;

  .form-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    min-width: 160rpx;

    &.required::after {
      content: '*';
      color: #ff4d4f;
      margin-left: 4rpx;
    }
  }

  .form-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
}

// Logo项
.logo-item {
  flex-direction: column;
  align-items: flex-start;

  .logo-wrapper {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    overflow: hidden;
    margin-top: 20rpx;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo-image {
      width: 100%;
      height: 100%;
    }

    .logo-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .logo-icon {
        font-size: 48rpx;
        margin-bottom: 8rpx;
      }

      .logo-text {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 提示信息
.tips-section {
  display: flex;
  align-items: flex-start;
  padding: 24rpx;
  background: #fffbe6;
  border-radius: 12rpx;
  margin-top: 20rpx;

  .tips-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
  }

  .tips-text {
    flex: 1;
    font-size: 24rpx;
    color: #faad14;
    line-height: 1.6;
  }
}

// 授权弹窗
.consent-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.consent-modal-content {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  animation: scaleIn 0.3s;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.consent-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32rpx;

  .consent-icon {
    font-size: 80rpx;
    margin-bottom: 16rpx;
  }

  .consent-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.consent-body {
  margin-bottom: 40rpx;

  .consent-text {
    display: block;
    font-size: 28rpx;
    color: #666;
    line-height: 1.8;
    margin-bottom: 24rpx;
  }

  .consent-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-bottom: 24rpx;

    .consent-item {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
      padding-left: 8rpx;
    }
  }

  .consent-notice {
    display: block;
    font-size: 24rpx;
    color: #999;
    line-height: 1.6;
    padding: 20rpx;
    background: #f7f8fa;
    border-radius: 12rpx;
  }
}

.consent-footer {
  display: flex;
  gap: 20rpx;

  .consent-btn {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 48rpx;
    font-size: 28rpx;
    font-weight: 500;
    transition: all 0.3s;

    &:active {
      transform: scale(0.96);
    }

    .consent-btn-text {
      font-size: 28rpx;
      font-weight: 600;
    }
  }

  .disagree-btn {
    background: #f5f5f5;

    .consent-btn-text {
      color: #666;
    }
  }

  .agree-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    .consent-btn-text {
      color: #fff;
    }
  }
}
</style>
