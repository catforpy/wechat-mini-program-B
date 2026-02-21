<template>
  <view class="leasing-detail">
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

    <!-- 可租赁面板/功能区 -->
    <view v-if="data.panels && data.panels.length > 0" class="panels-section">
      <text class="section-title">🔄 可租赁面板/功能</text>
      <view class="panels-list">
        <view v-for="(panel, index) in data.panels" :key="index" class="panel-card">
          <view class="panel-header">
            <text class="panel-name">{{ panel.name }}</text>
            <view class="panel-price">
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ panel.price }}</text>
              <text class="price-unit">/月</text>
            </view>
          </view>
          <text class="panel-description">{{ panel.description }}</text>
        </view>
      </view>
    </view>

    <!-- 租赁套餐选择 -->
    <view v-if="data.packageType" class="package-section">
      <text class="section-title">📦 租赁套餐</text>
      <view class="package-display">
        <view class="package-card">
          <text class="package-name">{{ getPackageName(data.packageType) }}</text>
          <text v-if="data.packageType === 'custom' && data.customPackage" class="package-custom">{{ data.customPackage }}</text>
        </view>
      </view>
    </view>

    <!-- 适合场景标签 -->
    <view v-if="data.scenarios && data.scenarios.length > 0" class="scenarios-section">
      <text class="section-title">🎯 适合场景</text>
      <view class="scenarios-tags">
        <text v-for="(scenario, index) in data.scenarios" :key="index" class="scenario-tag">{{ scenario }}</text>
      </view>
      <text v-if="data.customScenario" class="custom-scenario">{{ data.customScenario }}</text>
    </view>

    <!-- 租赁说明 -->
    <view class="lease-terms-section">
      <text class="section-title">📋 租赁说明</text>
      <view class="terms-grid">
        <view class="term-item">
          <text class="term-label">最低租期</text>
          <text class="term-value">{{ data.minPeriod }}</text>
        </view>
        <view class="term-item">
          <text class="term-label">付款方式</text>
          <text class="term-value">{{ data.paymentMethod }}</text>
        </view>
      </view>
      <view v-if="data.dataOwnership" class="data-ownership">
        <text class="ownership-label">数据归属：</text>
        <text class="ownership-text">{{ data.dataOwnership }}</text>
      </view>
    </view>

    <!-- 租赁优势 -->
    <view v-if="data.advantages && data.advantages.length > 0" class="advantages-section">
      <text class="section-title">✨ 租赁优势</text>
      <view class="advantages-list">
        <view v-for="(adv, index) in data.advantages" :key="index" class="advantage-item">
          <text class="advantage-number">{{ index + 1 }}</text>
          <text class="advantage-text">{{ adv.content }}</text>
        </view>
      </view>
    </view>

    <!-- 技术支持 -->
    <view class="support-section">
      <text class="section-title">🛠️ 技术支持</text>
      <view v-if="data.support && data.support.length > 0" class="support-list">
        <view v-for="(item, index) in data.support" :key="index" class="support-item">
          <text class="support-icon">✓</text>
          <text class="support-text">{{ item }}</text>
        </view>
      </view>
      <text v-if="data.supportDescription" class="support-description">{{ data.supportDescription }}</text>
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
interface LeasingPanel {
  name: string
  description: string
  price: string
}

interface LeasingDetailData {
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
  panels?: LeasingPanel[]
  packageType?: string
  customPackage?: string
  scenarios?: string[]
  customScenario?: string
  minPeriod?: string
  paymentMethod?: string
  dataOwnership?: string
  advantages?: Array<{ content: string }>
  support?: string[]
  supportDescription?: string
  phone?: string
  wechat?: string
  email?: string
}

interface Props {
  data: LeasingDetailData
}

const props = defineProps<Props>()

// 获取套餐名称
const getPackageName = (type: string) => {
  const nameMap: Record<string, string> = {
    basic: '基础版',
    standard: '标准版',
    premium: '高级版',
    custom: '自定义'
  }
  return nameMap[type] || type
}

// 拨打电话
const makeCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone
  })
}

// 发起聊天 - 跳转到直通对话的企业对话列表
const startChat = () => {
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
.leasing-detail {
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
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
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
.panels-section,
.package-section,
.scenarios-section,
.lease-terms-section,
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

// 可租赁面板区
.panels-section {
  .panels-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .panel-card {
      padding: 24rpx;
      background: linear-gradient(135deg, #fff8f0 0%, #fff 100%);
      border: 1rpx solid #ffe0b2;
      border-radius: 16rpx;

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12rpx;

        .panel-name {
          font-size: 30rpx;
          font-weight: 600;
          color: #333;
        }

        .panel-price {
          display: flex;
          align-items: baseline;
          gap: 4rpx;

          .price-symbol {
            font-size: 24rpx;
            color: #ff9800;
          }

          .price-value {
            font-size: 36rpx;
            color: #ff9800;
            font-weight: 700;
          }

          .price-unit {
            font-size: 22rpx;
            color: #ff9800;
          }
        }
      }

      .panel-description {
        font-size: 26rpx;
        color: #666;
        line-height: 1.5;
      }
    }
  }
}

// 套餐区
.package-section {
  .package-display {
    .package-card {
      padding: 32rpx;
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      border-radius: 16rpx;
      text-align: center;

      .package-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #fff;
        display: block;
        margin-bottom: 8rpx;
      }

      .package-custom {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.9);
        display: block;
      }
    }
  }
}

// 适合场景区
.scenarios-section {
  .scenarios-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .scenario-tag {
      padding: 12rpx 24rpx;
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      color: #fff;
      border-radius: 24rpx;
      font-size: 26rpx;
    }
  }

  .custom-scenario {
    display: block;
    font-size: 26rpx;
    color: #666;
    margin-top: 12rpx;
    line-height: 1.5;
  }
}

// 租赁说明区
.lease-terms-section {
  .terms-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;
    margin-bottom: 16rpx;

    .term-item {
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 12rpx;

      .term-label {
        font-size: 24rpx;
        color: #999;
        display: block;
        margin-bottom: 8rpx;
      }

      .term-value {
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
        display: block;
      }
    }
  }

  .data-ownership {
    padding: 16rpx;
    background: #fff8f0;
    border-radius: 12rpx;
    display: flex;
    align-items: flex-start;

    .ownership-label {
      font-size: 26rpx;
      color: #666;
      font-weight: 600;
      flex-shrink: 0;
    }

    .ownership-text {
      flex: 1;
      font-size: 26rpx;
      color: #333;
      line-height: 1.5;
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
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
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
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
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
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      color: #fff;
    }

    &.chat-btn {
      background: linear-gradient(135deg, #09bb07 0%, #07a606 100%);
      color: #fff;
    }

    &.email-btn {
      background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
      color: #fff;
    }

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
