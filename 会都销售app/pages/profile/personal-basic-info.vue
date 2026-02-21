<template>
  <view class="basic-info-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">基本信息</text>
        <view class="nav-save" @tap="handleSave">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="form-container">
        <!-- 头像 -->
        <view class="form-item avatar-item">
          <text class="form-label">头像</text>
          <view class="avatar-wrapper" @tap="handleChooseAvatar">
            <image
              v-if="formData.avatar"
              class="avatar-image"
              :src="formData.avatar"
              mode="aspectFill"
            />
            <view v-else class="avatar-placeholder">
              <text class="avatar-icon">📷</text>
              <text class="avatar-text">上传头像</text>
            </view>
          </view>
        </view>

        <!-- 姓名 -->
        <view class="form-item">
          <text class="form-label required">姓名</text>
          <input
            class="form-input"
            v-model="formData.name"
            placeholder="请输入姓名"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 性别 -->
        <view class="form-item">
          <text class="form-label required">性别</text>
          <picker
            mode="selector"
            :range="genderOptions"
            :value="genderIndex"
            @change="handleGenderChange"
          >
            <view class="picker-value">
              {{ formData.gender || '请选择性别' }}
            </view>
          </picker>
        </view>

        <!-- 手机号 -->
        <view class="form-item">
          <text class="form-label required">手机号</text>
          <input
            class="form-input"
            v-model="formData.phone"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 邮箱 -->
        <view class="form-item">
          <text class="form-label">邮箱</text>
          <input
            class="form-input"
            v-model="formData.email"
            type="email"
            placeholder="请输入邮箱"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 地址 -->
        <view class="form-item">
          <text class="form-label">地址</text>
          <input
            class="form-input"
            v-model="formData.address"
            placeholder="请输入地址"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 提示信息 -->
        <view class="tips-section">
          <text class="tips-icon">ℹ️</text>
          <text class="tips-text">您的个人信息将严格保密，仅用于名片展示和联系</text>
        </view>
      </view>
    </scroll-view>
  </view>

  <!-- 首次填写授权弹窗 -->
  <view v-if="showConsentModal" class="consent-modal-mask" @tap="handleDisagree">
    <view class="consent-modal-content" @tap.stop>
      <view class="consent-header">
        <text class="consent-icon">📋</text>
        <text class="consent-title">信息收集说明</text>
      </view>

      <view class="consent-body">
        <text class="consent-text">
          为了完善您的个人名片信息，我们需要收集您以下基本信息：
        </text>

        <view class="consent-list">
          <text class="consent-item">• 姓名、性别：用于个人身份展示</text>
          <text class="consent-item">• 手机号、邮箱：用于他人联系您</text>
          <text class="consent-item">• 地址：用于展示您的所在地</text>
          <text class="consent-item">• 头像：用于个人形象展示</text>
        </view>

        <text class="consent-notice">
          我们承诺：您的个人信息将严格保密，仅用于名片展示和联系方式展示，不会泄露给第三方。
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

// 性别选项
const genderOptions = ['男', '女']
const genderIndex = ref(0)

// 表单数据
const formData = ref({
  name: '',
  gender: '',
  phone: '',
  email: '',
  avatar: '',
  address: ''
})

// 授权弹窗
const showConsentModal = ref(false)

// 检查是否首次填写
const checkFirstTime = () => {
  const hasAgreed = uni.getStorageSync('basic_info_consented')
  if (!hasAgreed) {
    showConsentModal.value = true
  }
}

// 同意授权
const handleAgree = () => {
  uni.setStorageSync('basic_info_consented', true)
  showConsentModal.value = false
}

// 不同意授权
const handleDisagree = () => {
  showConsentModal.value = false
  uni.navigateBack()
}

// 性别选择
const handleGenderChange = (e: any) => {
  genderIndex.value = e.detail.value
  formData.value.gender = genderOptions[e.detail.value]
}

// 选择头像
const handleChooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.avatar = res.tempFilePaths[0]
    }
  })
}

// 保存
const handleSave = () => {
  // 验证必填项
  if (!formData.value.name) {
    uni.showToast({
      title: '请输入姓名',
      icon: 'none'
    })
    return
  }

  if (!formData.value.gender) {
    uni.showToast({
      title: '请选择性别',
      icon: 'none'
    })
    return
  }

  if (!formData.value.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
    return
  }

  // 验证手机号格式
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(formData.value.phone)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    })
    return
  }

  // TODO: 保存到本地存储或服务器
  uni.setStorageSync('personal_basic_info', JSON.stringify(formData.value))

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
  const savedData = uni.getStorageSync('personal_basic_info')
  if (savedData) {
    try {
      formData.value = JSON.parse(savedData)
      // 设置性别索引
      if (formData.value.gender) {
        genderIndex.value = genderOptions.indexOf(formData.value.gender)
      }
    } catch (e) {
      console.error('读取基本信息失败:', e)
    }
  }

  // 检查是否首次填写
  checkFirstTime()
})
</script>

<style scoped lang="scss">
.basic-info-page {
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
    min-width: 140rpx;

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

  .picker-value {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
}

// 头像项
.avatar-item {
  flex-direction: column;
  align-items: flex-start;

  .avatar-wrapper {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 20rpx;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-image {
      width: 100%;
      height: 100%;
    }

    .avatar-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .avatar-icon {
        font-size: 48rpx;
        margin-bottom: 8rpx;
      }

      .avatar-text {
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
