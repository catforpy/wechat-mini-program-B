<template>
  <view class="nickname-setting-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">昵称设置</text>
        <view class="save-btn" @tap="saveNickname">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 输入区域 -->
      <view class="input-section">
        <view class="input-wrapper">
          <input
            v-model="nickname"
            class="nickname-input"
            type="text"
            placeholder="请输入昵称"
            :maxlength="20"
            @input="onInputChange"
          />
          <view v-if="nickname" class="clear-btn" @tap="clearInput">
            <text class="clear-icon">×</text>
          </view>
        </view>
        <view class="char-count">
          <text :class="{ 'limit-exceeded': nickname.length >= 20 }">{{ nickname.length }}/20</text>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="tips-section">
        <text class="tips-title">温馨提示</text>
        <text class="tips-item">• 昵称长度为1-20个字符</text>
        <text class="tips-item">• 昵称将作为您在平台上的显示名称</text>
        <text class="tips-item">• 请勿使用特殊符号或敏感词汇</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 昵称
const nickname = ref('')

// 输入变化
const onInputChange = () => {
  // 可以在这里添加输入验证逻辑
}

// 清空输入
const clearInput = () => {
  nickname.value = ''
}

// 保存昵称
const saveNickname = () => {
  const trimmed = nickname.value.trim()

  if (!trimmed) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none'
    })
    return
  }

  if (trimmed.length < 1) {
    uni.showToast({
      title: '昵称长度至少1个字符',
      icon: 'none'
    })
    return
  }

  if (trimmed.length > 20) {
    uni.showToast({
      title: '昵称长度不能超过20个字符',
      icon: 'none'
    })
    return
  }

  uni.showLoading({ title: '保存中...', mask: true })

  // 保存到本地存储
  try {
    const saved = uni.getStorageSync('user_info')
    if (saved) {
      const userData = JSON.parse(saved)
      userData.nickname = trimmed
      uni.setStorageSync('user_info', JSON.stringify(userData))
    } else {
      uni.setStorageSync('user_info', JSON.stringify({
        userId: '10001',
        nickname: trimmed,
        isRealNameVerified: false
      }))
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
    console.error('保存昵称失败:', e)
    uni.hideLoading()
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
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
      const userData = JSON.parse(saved)
      nickname.value = userData.nickname || ''
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
})
</script>

<style scoped lang="scss">
.nickname-setting-page {
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

// 输入区域
.input-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .input-wrapper {
    display: flex;
    align-items: center;
    background: #f8f8f8;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;

    .nickname-input {
      flex: 1;
      font-size: 32rpx;
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

      .clear-icon {
        font-size: 36rpx;
        color: #fff;
        line-height: 1;
      }

      &:active {
        background: #a0a0a0;
      }
    }
  }

  .char-count {
    text-align: right;

    text {
      font-size: 24rpx;
      color: #999;
    }

    .limit-exceeded {
      color: #ff5722;
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
