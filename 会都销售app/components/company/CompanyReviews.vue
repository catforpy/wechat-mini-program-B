<template>
  <view class="company-reviews">
    <view class="section-title">
      <text class="title-text">💬 用户评价</text>
      <view class="title-line"></view>
    </view>

    <view class="reviews-card">
      <view class="review-item" v-for="(review, index) in reviewsData" :key="index">
        <view class="review-header">
          <image :src="review.avatar" mode="aspectFill" class="review-avatar" />
          <view class="review-user">
            <text class="review-name">{{ review.user }}</text>
            <view class="review-stars">
              <text v-for="n in 5" :key="n" class="star" :class="{ active: n <= review.rating }">★</text>
            </view>
          </view>
          <text class="review-time">{{ review.time }}</text>
        </view>
        <text class="review-content">{{ review.content }}</text>
      </view>

      <view class="view-more" @tap="handleViewMore">
        <text>查看更多评价</text>
        <text class="arrow">→</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  reviews?: any[]
}

defineProps<Props>()

const handleViewMore = () => {
  uni.showToast({
    title: '加载更多评价...',
    icon: 'success'
  })
}
</script>

<style scoped lang="scss">
.company-reviews {
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

.reviews-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .review-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .review-header {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .review-avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }

      .review-user {
        flex: 1;

        .review-name {
          display: block;
          font-size: 26rpx;
          color: #333;
          margin-bottom: 8rpx;
        }

        .review-stars {
          display: flex;
          gap: 4rpx;

          .star {
            font-size: 20rpx;
            color: #ddd;

            &.active {
              color: #FFB800;
            }
          }
        }
      }

      .review-time {
        font-size: 22rpx;
        color: #999;
      }
    }

    .review-content {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
    }
  }

  .view-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx;
    color: #667eea;
    font-size: 26rpx;

    .arrow {
      margin-left: 8rpx;
    }
  }
}
</style>
