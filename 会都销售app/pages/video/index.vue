<template>
  <view class="video-page">
    <view class="header">
      <text class="title">视频</text>
    </view>
    <view class="content">
      <text class="placeholder">视频内容区域</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  uni.setNavigationBarTitle({
    title: '视频'
  })
})
</script>

<style scoped lang="scss">
.video-page {
  min-height: 100vh;
  background-color: #f5f5f5;

  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40rpx;
    padding-top: calc(40rpx + var(--status-bar-height));

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #ffffff;
    }
  }

  .content {
    padding: 40rpx;

    .placeholder {
      font-size: 28rpx;
      color: #999;
      text-align: center;
      display: block;
    }
  }
}
</style>
