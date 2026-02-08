<template>
  <view class="purchase-page">
    <!-- 头部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title">购买模板</text>
    </view>

    <!-- 模板信息 -->
    <view class="template-info">
      <view class="info-title">模板信息</view>
      <view class="info-item">
        <text class="label">模板名称：</text>
        <text class="value">{{ templateName }}</text>
      </view>
      <view class="info-item">
        <text class="label">类目：</text>
        <text class="value">{{ categoryName }}</text>
      </view>
      <view class="info-item">
        <text class="label">价格：</text>
        <text class="value price">¥{{ price }}</text>
      </view>
    </view>

    <!-- 购买按钮 -->
    <view class="action-area">
      <button class="buy-btn" @click="handlePurchase">立即购买</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const templateName = ref('')
const categoryName = ref('小程序模板')
const price = ref(2980)

onLoad((options: any) => {
  if (options?.templateName) {
    templateName.value = decodeURIComponent(options.templateName)
  }

  // 根据模板名称生成价格
  const hash = templateName.value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  price.value = (hash % 50) * 100 + 2800
})

const goBack = () => {
  uni.navigateBack()
}

const handlePurchase = () => {
  uni.showModal({
    title: '购买确认',
    content: `确认购买 ${templateName.value} 模板？\n价格：¥${price.value}`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '购买成功',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.purchase-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  position: relative;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: 30rpx;
  padding: 10rpx;
}

.back-icon {
  font-size: 40rpx;
  color: #ffffff;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}

.template-info {
  margin: 30rpx;
  padding: 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
}

.info-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.label {
  width: 150rpx;
  font-size: 28rpx;
  color: #666;
}

.value {
  flex: 1;
  font-size: 28rpx;
  color: #333;

  &.price {
    font-size: 36rpx;
    font-weight: bold;
    color: #ff4444;
  }
}

.action-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.buy-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  border-radius: 44rpx;
}
</style>
