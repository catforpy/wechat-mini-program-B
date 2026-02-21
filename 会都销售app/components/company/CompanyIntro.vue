<template>
  <view class="company-intro">
    <view class="section-title">
      <text class="title-text">企业介绍</text>
      <view class="title-line"></view>
    </view>

    <view class="intro-card">
      <!-- 企业简介 -->
      <view class="intro-item">
        <view class="intro-header">
          <text class="intro-label">📢 企业简介</text>
        </view>
        <text class="intro-text">{{ introData?.summary }}</text>
      </view>

      <!-- 企业文化 -->
      <view class="intro-item" v-if="introData?.culture">
        <view class="intro-header">
          <text class="intro-label">💡 企业文化</text>
        </view>
        <text class="intro-text">{{ introData.culture }}</text>
      </view>

      <!-- 发展历程 - 时间轴形式 -->
      <view class="history-section" v-if="introData?.history?.length">
        <view class="intro-header">
          <text class="intro-label">🎯 发展历程</text>
        </view>
        <view class="timeline">
          <view class="timeline-item" v-for="(item, index) in introData.history" :key="index">
            <view class="timeline-dot"></view>
            <view class="timeline-content">
              <text class="timeline-year">{{ item.year }}</text>
              <text class="timeline-event">{{ item.event }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  intro?: any
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.company-intro {
  margin-bottom: 20rpx;
}

.section-title {
  padding: 30rpx 20rpx 20rpx;

  .title-text {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }

  .title-line {
    width: 60rpx;
    height: 6rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3rpx;
    margin-top: 16rpx;
  }
}

.intro-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .intro-item {
    margin-bottom: 40rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .intro-header {
      margin-bottom: 20rpx;

      .intro-label {
        font-size: 28rpx;
        font-weight: 600;
        color: #667eea;
      }
    }

    .intro-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.8;
      text-align: justify;
    }
  }

  .history-section {
    .timeline {
      position: relative;
      padding-left: 50rpx;

      &::before {
        content: '';
        position: absolute;
        left: 15rpx;
        top: 10rpx;
        bottom: 10rpx;
        width: 3rpx;
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      }

      .timeline-item {
        position: relative;
        margin-bottom: 40rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .timeline-dot {
          position: absolute;
          left: -39rpx;
          top: 6rpx;
          width: 20rpx;
          height: 20rpx;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 4rpx solid #fff;
          box-shadow: 0 0 0 3rpx #667eea;
        }

        .timeline-content {
          .timeline-year {
            display: inline-block;
            padding: 4rpx 16rpx;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            font-size: 24rpx;
            font-weight: 600;
            border-radius: 20rpx;
            margin-bottom: 12rpx;
          }

          .timeline-event {
            display: block;
            font-size: 28rpx;
            color: #333;
            line-height: 1.6;
          }
        }
      }
    }
  }
}
</style>
