<template>
  <view class="company-media">
    <view class="section-title">
      <text class="title-text">宣传展示</text>
      <view class="title-line"></view>
    </view>

    <view class="media-card">
      <!-- 荣誉资质 -->
      <view class="media-section" v-if="mediaData?.certificates?.length">
        <view class="media-header">
          <text class="media-label">🏆 荣誉资质</text>
          <text class="media-count">{{ mediaData.certificates.length }}项</text>
        </view>
        <scroll-view class="cert-scroll" scroll-x show-scrollbar>
          <view class="cert-item" v-for="(cert, index) in mediaData.certificates" :key="index" @tap="viewCert(cert)">
            <image :src="cert.image" mode="aspectFill" class="cert-image" />
            <text class="cert-name">{{ cert.name }}</text>
            <text class="cert-date">{{ cert.date }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- 宣传视频 -->
      <view class="media-section" v-if="mediaData?.videos?.length">
        <view class="media-header">
          <text class="media-label">🎬 宣传视频</text>
        </view>
        <scroll-view class="video-scroll" scroll-x show-scrollbar>
          <view class="video-item" v-for="(video, index) in mediaData.videos" :key="index" @tap="playVideo(video.url)">
            <image :src="video.cover" mode="aspectFill" class="video-cover" />
            <view class="video-play-icon">▶</view>
            <text class="video-title">{{ video.title }}</text>
            <text class="video-duration">{{ video.duration }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- 环境展示 -->
      <view class="media-section" v-if="mediaData?.environments?.length">
        <view class="media-header">
          <text class="media-label">🏢 环境展示</text>
        </view>
        <view class="env-grid">
          <view class="env-item" v-for="(env, index) in mediaData.environments" :key="index" @tap="viewImage(env.image)">
            <image :src="env.image" mode="aspectFill" class="env-image" />
            <text class="env-name">{{ env.name }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  media?: any
}

defineProps<Props>()

// 查看证书
const viewCert = (cert: any) => {
  uni.previewImage({
    urls: [cert.image]
  })
}

// 播放视频
const playVideo = (url: string) => {
  // 这里可以打开视频播放器
  uni.showToast({
    title: '播放视频',
    icon: 'success'
  })
}

// 查看图片
const viewImage = (url: string) => {
  uni.previewImage({
    urls: [url]
  })
}
</script>

<style scoped lang="scss">
.company-media {
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

.media-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .media-section {
    margin-bottom: 40rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .media-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .media-label {
        font-size: 28rpx;
        font-weight: 600;
        color: #667eea;
      }

      .media-count {
        font-size: 24rpx;
        color: #999;
        padding: 4rpx 16rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
      }
    }

    // 资质证书横向滚动
    .cert-scroll {
      white-space: nowrap;

      .cert-item {
        display: inline-block;
        width: 220rpx;
        margin-right: 20rpx;
        text-align: center;
        vertical-align: top;

        &:last-child {
          margin-right: 0;
        }

        .cert-image {
          width: 220rpx;
          height: 280rpx;
          border-radius: 12rpx;
          margin-bottom: 12rpx;
          border: 1rpx solid #e5e5e5;
        }

        .cert-name {
          display: block;
          font-size: 24rpx;
          color: #333;
          text-align: center;
          white-space: normal;
          margin-bottom: 8rpx;
          font-weight: 500;
        }

        .cert-date {
          font-size: 22rpx;
          color: #999;
        }
      }
    }

    // 视频横向滚动
    .video-scroll {
      white-space: nowrap;

      .video-item {
        display: inline-block;
        width: 280rpx;
        margin-right: 20rpx;
        position: relative;
        vertical-align: top;

        &:last-child {
          margin-right: 0;
        }

        .video-cover {
          width: 280rpx;
          height: 180rpx;
          border-radius: 12rpx;
          margin-bottom: 12rpx;
        }

        .video-play-icon {
          position: absolute;
          top: 70rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 60rpx;
          height: 60rpx;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 24rpx;
        }

        .video-title {
          display: block;
          font-size: 26rpx;
          color: #333;
          text-align: center;
          white-space: normal;
          margin-bottom: 8rpx;
          font-weight: 500;
        }

        .video-duration {
          font-size: 22rpx;
          color: #999;
        }
      }
    }

    // 环境展示网格
    .env-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16rpx;

      .env-item {
        position: relative;

        .env-image {
          width: 100%;
          height: 200rpx;
          border-radius: 12rpx;
          margin-bottom: 8rpx;
        }

        .env-name {
          display: block;
          font-size: 24rpx;
          color: #333;
          text-align: center;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
