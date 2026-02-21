<template>
  <view class="selling-detail">
    <!-- 轮播图/Banner展示区 -->
    <view v-if="data.banners && data.banners.length > 0 && data.banners[0].image" class="banner-section">
      <swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
        <swiper-item v-for="(banner, index) in data.banners" :key="index">
          <image v-if="banner.image" class="banner-image" :src="banner.image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 小程序信息区 -->
    <view class="program-info-section">
      <image v-if="data.logo" class="program-logo" :src="data.logo" mode="aspectFill"></image>
      <view v-else class="program-logo-placeholder">{{ data.emoji }}</view>
      <view class="program-info-content">
        <text class="program-name">{{ data.programName || data.name }}</text>
        <text class="program-tagline">{{ data.tagline }}</text>
        <view class="program-meta">
          <text class="meta-item">{{ data.companyName }}</text>
        </view>
      </view>
    </view>

    <!-- 视频介绍区 -->
    <view v-if="data.video" class="video-section">
      <text class="section-title">🎬 视频介绍</text>
      <view class="video-player">
        <video class="video-element" :src="data.video" controls></video>
      </view>
    </view>

    <!-- 详细介绍区（图文混排） -->
    <view class="description-section">
      <text class="section-title">📝 详细介绍</text>
      <view class="description-content">
        <text class="description-text">{{ data.description }}</text>
      </view>
      <!-- 媒体项展示 -->
      <view v-if="data.mediaItems && data.mediaItems.length > 0" class="media-grid">
        <view v-for="(item, index) in data.mediaItems" :key="index" class="media-item">
          <image v-if="item.type === 'image'" class="media-image" :src="item.url" mode="aspectFill"></image>
          <view v-else class="media-video">
            <video class="media-video-element" :src="item.url" controls></video>
          </view>
        </view>
      </view>
    </view>

    <!-- 经营数据图表区 -->
    <view v-if="data.businessStatus || (data.statsImages && data.statsImages.length > 0)" class="business-data-section">
      <text class="section-title">📊 经营数据</text>
      <text v-if="data.businessStatus" class="business-status">{{ data.businessStatus }}</text>
      <view v-if="data.statsImages && data.statsImages.length > 0" class="stats-grid">
        <image v-for="(img, index) in data.statsImages" :key="index" class="stats-image" :src="img" mode="widthFix"></image>
      </view>
    </view>

    <!-- 购买资质要求 -->
    <view v-if="data.qualifications && data.qualifications.length > 0" class="qualifications-section">
      <text class="section-title">📋 购买资质要求</text>
      <view class="qualifications-list">
        <view v-for="(qual, index) in data.qualifications" :key="index" class="qualification-item">
          <text class="qual-icon">{{ getQualificationIcon(qual.type) }}</text>
          <text class="qual-text">{{ qual.content }}</text>
        </view>
      </view>
    </view>

    <!-- 适合行业标签 -->
    <view v-if="data.industries && data.industries.length > 0" class="industries-section">
      <text class="section-title">🏷️ 适合行业</text>
      <view class="industries-tags">
        <text v-for="(industry, index) in data.industries" :key="index" class="industry-tag">{{ industry }}</text>
      </view>
    </view>

    <!-- 销售价格 -->
    <view v-if="data.price" class="price-section">
      <text class="section-title">💰 销售价格</text>
      <view class="price-display">
        <text class="price-symbol">¥</text>
        <text class="price-value">{{ data.price }}</text>
        <text class="price-unit">元</text>
      </view>
    </view>

    <!-- 核心优势 -->
    <view v-if="data.advantages && data.advantages.length > 0" class="advantages-section">
      <text class="section-title">✨ 核心优势</text>
      <view class="advantages-list">
        <view v-for="(adv, index) in data.advantages" :key="index" class="advantage-item">
          <text class="advantage-number">{{ index + 1 }}</text>
          <text class="advantage-text">{{ adv.content }}</text>
        </view>
      </view>
    </view>

    <!-- 技术支持 & 售后服务 -->
    <view class="support-section">
      <text class="section-title">🛠️ 技术支持 & 售后服务</text>
      <view v-if="data.support && data.support.length > 0" class="support-list">
        <view v-for="(item, index) in data.support" :key="index" class="support-item">
          <text class="support-icon">✓</text>
          <text class="support-text">{{ item }}</text>
        </view>
      </view>
      <text v-if="data.supportDescription" class="support-description">{{ data.supportDescription }}</text>
      <view v-if="data.servicePeriod" class="service-period">
        <text class="period-label">服务期限：</text>
        <text class="period-text">{{ data.servicePeriod }}</text>
      </view>
    </view>

    <!-- 联系按钮 -->
    <view class="contact-section">
      <view v-if="data.phone" class="contact-btn phone-btn" @tap="makeCall(data.phone)">
        <text class="btn-icon">📞</text>
        <text class="btn-text">拨打电话</text>
      </view>
      <view class="contact-btn chat-btn" @tap="startChat">
        <text class="btn-icon">💬</text>
        <text class="btn-text">发起聊天</text>
      </view>
      <view v-if="data.email" class="contact-btn email-btn" @tap="sendEmail(data.email)">
        <text class="btn-icon">📧</text>
        <text class="btn-text">发送邮件</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface SellingDetailData {
  id: string
  name: string
  emoji: string
  companyName: string
  logo?: string
  programName?: string
  tagline?: string
  video?: string
  description: string
  mediaItems?: any[]
  banners?: Array<{ image: string }>
  businessStatus?: string
  statsImages?: string[]
  qualifications?: Array<{ type: string; content: string }>
  industries?: string[]
  price: string
  advantages?: Array<{ content: string }>
  support?: string[]
  supportDescription?: string
  servicePeriod?: string
  phone?: string
  wechat?: string
  email?: string
}

interface Props {
  data: SellingDetailData
}

const props = defineProps<Props>()

// 获取资质图标
const getQualificationIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    license: '📄',
    icp: '🌐',
    broadcast: '📡',
    food: '🍜',
    medical: '🏥'
  }
  return iconMap[type] || '📋'
}

// 拨打电话
const makeCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone
  })
}

// 发起聊天 - 跳转到直通对话的企业对话列表
const startChat = () => {
  // 获取企业信息，用于创建或查找对话
  const companyName = props.data.companyName || ''
  const programId = props.data.id

  console.log('发起企业聊天:', { companyName, programId })

  // 跳转到企业对话列表页面
  uni.navigateTo({
    url: '/pages/profile/direct-chat/enterprise-list'
  })
}

// 发送邮件
const sendEmail = (email: string) => {
  uni.setClipboardData({
    data: email,
    success: () => {
      uni.showToast({
        title: '邮箱已复制',
        icon: 'success'
      })
    }
  })
}
</script>

<style scoped lang="scss">
.selling-detail {
  padding-bottom: 40rpx;
}

// 轮播图区
.banner-section {
  width: 100%;
  height: 400rpx;

  .banner-swiper {
    width: 100%;
    height: 100%;

    .banner-image {
      width: 100%;
      height: 100%;
    }
  }
}

// 小程序信息区
.program-info-section {
  background: #fff;
  padding: 32rpx;
  display: flex;
  gap: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .program-logo {
    width: 120rpx;
    height: 120rpx;
    border-radius: 20rpx;
    flex-shrink: 0;
  }

  .program-logo-placeholder {
    width: 120rpx;
    height: 120rpx;
    border-radius: 20rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    flex-shrink: 0;
  }

  .program-info-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .program-name {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
    }

    .program-tagline {
      font-size: 26rpx;
      color: #666;
      line-height: 1.4;
    }

    .program-meta {
      display: flex;
      gap: 16rpx;

      .meta-item {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 通用区块样式
.video-section,
.description-section,
.business-data-section,
.qualifications-section,
.industries-section,
.price-section,
.advantages-section,
.support-section {
  background: #fff;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }
}

// 视频区
.video-section {
  .video-player {
    width: 100%;
    border-radius: 16rpx;
    overflow: hidden;

    .video-element {
      width: 100%;
    }
  }
}

// 介绍区
.description-section {
  .description-content {
    .description-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.8;
    }
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12rpx;
    margin-top: 20rpx;

    .media-item {
      aspect-ratio: 1;
      border-radius: 12rpx;
      overflow: hidden;

      .media-image {
        width: 100%;
        height: 100%;
      }

      .media-video {
        width: 100%;
        height: 100%;

        .media-video-element {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

// 经营数据区
.business-data-section {
  .business-status {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    margin-bottom: 16rpx;
    display: block;
  }

  .stats-grid {
    display: flex;
    flex-direction: column;
    gap: 12rpx;

    .stats-image {
      width: 100%;
      border-radius: 12rpx;
    }
  }
}

// 资质要求区
.qualifications-section {
  .qualifications-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .qualification-item {
      display: flex;
      align-items: center;
      gap: 12rpx;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 12rpx;

      .qual-icon {
        font-size: 32rpx;
      }

      .qual-text {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

// 行业标签区
.industries-section {
  .industries-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .industry-tag {
      padding: 12rpx 24rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border-radius: 24rpx;
      font-size: 26rpx;
    }
  }
}

// 价格区
.price-section {
  .price-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    padding: 24rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16rpx;

    .price-symbol {
      font-size: 36rpx;
      color: #fff;
      font-weight: 600;
    }

    .price-value {
      font-size: 64rpx;
      color: #fff;
      font-weight: 700;
      margin: 0 8rpx;
    }

    .price-unit {
      font-size: 28rpx;
      color: #fff;
    }
  }
}

// 优势区
.advantages-section {
  .advantages-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .advantage-item {
      display: flex;
      align-items: flex-start;
      gap: 12rpx;

      .advantage-number {
        width: 40rpx;
        height: 40rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: 600;
        flex-shrink: 0;
      }

      .advantage-text {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        line-height: 1.6;
        padding-top: 6rpx;
      }
    }
  }
}

// 技术支持区
.support-section {
  .support-list {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
    margin-bottom: 16rpx;

    .support-item {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .support-icon {
        width: 36rpx;
        height: 36rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
        font-weight: 600;
      }

      .support-text {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .support-description {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    display: block;
    margin-bottom: 16rpx;
  }

  .service-period {
    padding: 16rpx;
    background: #f8f8f8;
    border-radius: 12rpx;
    display: flex;
    align-items: center;

    .period-label {
      font-size: 26rpx;
      color: #666;
      font-weight: 600;
    }

    .period-text {
      flex: 1;
      font-size: 26rpx;
      color: #333;
    }
  }
}

// 联系按钮区
.contact-section {
  background: #fff;
  padding: 32rpx;
  display: flex;
  gap: 16rpx;

  .contact-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;

    .btn-icon {
      font-size: 32rpx;
    }

    .btn-text {
      font-size: 28rpx;
      font-weight: 600;
    }

    &.phone-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    &.chat-btn {
      background: linear-gradient(135deg, #09bb07 0%, #07a606 100%);
      color: #fff;
    }

    &.email-btn {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      color: #fff;
    }

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
