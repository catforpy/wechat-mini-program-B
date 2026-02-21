<template>
  <view class="avatar-setting-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">头像设置</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 当前头像预览 -->
      <view class="avatar-preview-section">
        <text class="section-title">当前头像</text>
        <view class="avatar-container">
          <image
            v-if="currentAvatar"
            class="avatar-large"
            :src="currentAvatar"
            mode="aspectFill"
          />
          <view v-else class="avatar-large default">
            <text class="avatar-placeholder">{{ userInfo.nickname?.charAt(0) || '用' }}</text>
          </view>
        </view>
      </view>

      <!-- 头像选择方式 -->
      <view class="upload-options">
        <view class="option-btn" @tap="chooseFromAlbum">
          <text class="option-icon">🖼️</text>
          <text class="option-text">从相册选择</text>
        </view>
        <view class="option-btn" @tap="takePhoto">
          <text class="option-icon">📷</text>
          <text class="option-text">拍照</text>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="tips-section">
        <text class="tips-title">温馨提示</text>
        <text class="tips-item">• 支持jpg、png格式，大小不超过5MB</text>
        <text class="tips-item">• 建议上传清晰的正面照片</text>
        <text class="tips-item">• 上传后将自动裁剪为圆形头像</text>
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
}

const userInfo = ref<UserInfo>({})
const currentAvatar = ref('')

// 从相册选择
const chooseFromAlbum = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      updateAvatar(tempFilePath)
    },
    fail: () => {
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

// 拍照
const takePhoto = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      updateAvatar(tempFilePath)
    },
    fail: () => {
      uni.showToast({
        title: '拍照失败',
        icon: 'none'
      })
    }
  })
}

// 更新头像
const updateAvatar = (filePath: string) => {
  uni.showLoading({ title: '上传中...', mask: true })

  // TODO: 实际项目中应该上传到服务器
  // 这里先使用本地路径
  setTimeout(() => {
    currentAvatar.value = filePath
    userInfo.value.avatar = filePath

    // 保存到本地存储
    saveUserInfo()

    uni.hideLoading()
    uni.showToast({
      title: '头像更新成功',
      icon: 'success'
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1000)
}

// 保存用户信息
const saveUserInfo = () => {
  try {
    const saved = uni.getStorageSync('user_info')
    if (saved) {
      const userData = JSON.parse(saved)
      userData.avatar = currentAvatar.value
      uni.setStorageSync('user_info', JSON.stringify(userData))
    }
  } catch (e) {
    console.error('保存用户信息失败:', e)
  }
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
      currentAvatar.value = userInfo.value.avatar || ''
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
})
</script>

<style scoped lang="scss">
.avatar-setting-page {
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
  padding: 30rpx;
  padding-bottom: 40rpx;
}

// 头像预览区域
.avatar-preview-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-size: 28rpx;
    color: #666;
    display: block;
    margin-bottom: 30rpx;
  }

  .avatar-container {
    display: flex;
    justify-content: center;

    .avatar-large {
      width: 240rpx;
      height: 240rpx;
      border-radius: 50%;
      border: 8rpx solid #f0f0f0;

      &.default {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-placeholder {
          font-size: 120rpx;
          color: #fff;
          font-weight: 600;
        }
      }
    }
  }
}

// 上传选项
.upload-options {
  display: flex;
  gap: 20rpx;

  .option-btn {
    flex: 1;
    background: #fff;
    border-radius: 20rpx;
    padding: 40rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    transition: all 0.3s;

    .option-icon {
      font-size: 80rpx;
      margin-bottom: 16rpx;
    }

    .option-text {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }

    &:active {
      transform: scale(0.98);
      background: #f8f8f8;
    }
  }
}

// 提示信息
.tips-section {
  background: #fffbf0;
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
  margin-top: 30rpx;
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
