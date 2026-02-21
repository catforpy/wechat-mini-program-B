<template>
  <view class="cooperation-detail">
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
      <text class="section-title">📝 小程序介绍</text>
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

    <!-- 合作方式选择 -->
    <view v-if="data.cooperationType" class="cooperation-type-section">
      <text class="section-title">🤝 合作方式</text>
      <view class="cooperation-type-card">
        <text class="type-icon">{{ getCooperationIcon(data.cooperationType) }}</text>
        <text class="type-name">{{ getCooperationName(data.cooperationType) }}</text>
      </view>
    </view>

    <!-- 合作内容说明 -->
    <view v-if="data.cooperationContent && data.cooperationContent.length > 0" class="cooperation-content-section">
      <text class="section-title">📋 合作内容</text>
      <view class="content-list">
        <view v-for="(content, index) in data.cooperationContent" :key="index" class="content-item">
          <text class="content-number">{{ index + 1 }}</text>
          <text class="content-text">{{ content.text }}</text>
        </view>
      </view>
    </view>

    <!-- 适合合作伙伴标签 -->
    <view v-if="data.targetPartners && data.targetPartners.length > 0" class="partners-section">
      <text class="section-title">🏢 适合合作伙伴</text>
      <view class="partners-tags">
        <text v-for="(partner, index) in data.targetPartners" :key="index" class="partner-tag">{{ partner }}</text>
      </view>
      <text v-if="data.customPartner" class="custom-partner">{{ data.customPartner }}</text>
    </view>

    <!-- 分成比例设置 -->
    <view v-if="data.shareRatio" class="share-ratio-section">
      <text class="section-title">💰 分成比例</text>
      <view class="ratio-display">
        <text class="ratio-value">{{ data.shareRatio }}</text>
        <text class="ratio-unit">%</text>
      </view>
    </view>

    <!-- 结算说明 -->
    <view class="settlement-section">
      <text class="section-title">💳 结算说明</text>
      <view v-if="data.settlementType" class="settlement-type">
        <text class="settlement-label">结算方式：</text>
        <text class="settlement-value">{{ getSettlementName(data.settlementType) }}</text>
      </view>
      <text v-if="data.settlementDescription" class="settlement-description">{{ data.settlementDescription }}</text>
    </view>

    <!-- 合作优势 -->
    <view v-if="data.advantages && data.advantages.length > 0" class="advantages-section">
      <text class="section-title">✨ 合作优势</text>
      <view class="advantages-list">
        <view v-for="(adv, index) in data.advantages" :key="index" class="advantage-item">
          <text class="advantage-number">{{ index + 1 }}</text>
          <text class="advantage-text">{{ adv.content }}</text>
        </view>
      </view>
    </view>

    <!-- 合作要求 -->
    <view v-if="data.requirements && data.requirements.length > 0" class="requirements-section">
      <text class="section-title">📝 合作要求</text>
      <view class="requirements-list">
        <view v-for="(req, index) in data.requirements" :key="index" class="requirement-item">
          <text class="requirement-number">{{ index + 1 }}</text>
          <text class="requirement-text">{{ req.content }}</text>
        </view>
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
interface CooperationContent {
  text: string
}

interface CooperationDetailData {
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
  cooperationType?: string
  cooperationContent?: CooperationContent[]
  targetPartners?: string[]
  customPartner?: string
  shareRatio?: string
  settlementType?: string
  settlementDescription?: string
  advantages?: Array<{ content: string }>
  requirements?: Array<{ content: string }>
  phone?: string
  wechat?: string
  email?: string
}

interface Props {
  data: CooperationDetailData
}

const props = defineProps<Props>()

// 获取合作方式图标
const getCooperationIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    profit: '💰',
    promotion: '📢',
    operation: '⚙️',
    development: '👨‍💻',
    content: '📝'
  }
  return iconMap[type] || '🤝'
}

// 获取合作方式名称
const getCooperationName = (type: string) => {
  const nameMap: Record<string, string> = {
    profit: '利润分成',
    promotion: '推广合作',
    operation: '运营合作',
    development: '开发合作',
    content: '内容合作'
  }
  return nameMap[type] || type
}

// 获取结算方式名称
const getSettlementName = (type: string) => {
  const nameMap: Record<string, string> = {
    monthly: '按月结算',
    quarterly: '按季结算',
    yearly: '按年结算',
    realtime: '实时结算'
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
.cooperation-detail {
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
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
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
.cooperation-type-section,
.cooperation-content-section,
.partners-section,
.share-ratio-section,
.settlement-section,
.advantages-section,
.requirements-section {
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

// 合作方式区
.cooperation-type-section {
  .cooperation-type-card {
    padding: 40rpx;
    background: linear-gradient(135deg, #e8f5e9 0%, #fff 100%);
    border: 1rpx solid #a5d6a7;
    border-radius: 16rpx;
    text-align: center;

    .type-icon {
      font-size: 64rpx;
      display: block;
      margin-bottom: 16rpx;
    }

    .type-name {
      font-size: 36rpx;
      font-weight: 600;
      color: #4caf50;
      display: block;
    }
  }
}

// 合作内容区
.cooperation-content-section {
  .content-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .content-item {
      display: flex;
      align-items: flex-start;
      gap: 12rpx;

      .content-number {
        width: 40rpx;
        height: 40rpx;
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: 600;
        flex-shrink: 0;
      }

      .content-text {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        line-height: 1.6;
        padding-top: 6rpx;
      }
    }
  }
}

// 合作伙伴区
.partners-section {
  .partners-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .partner-tag {
      padding: 12rpx 24rpx;
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      color: #fff;
      border-radius: 24rpx;
      font-size: 26rpx;
    }
  }

  .custom-partner {
    display: block;
    font-size: 26rpx;
    color: #666;
    margin-top: 12rpx;
    line-height: 1.5;
  }
}

// 分成比例区
.share-ratio-section {
  .ratio-display {
    padding: 40rpx;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    border-radius: 16rpx;
    text-align: center;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 8rpx;

    .ratio-value {
      font-size: 80rpx;
      color: #fff;
      font-weight: 700;
    }

    .ratio-unit {
      font-size: 40rpx;
      color: #fff;
    }
  }
}

// 结算说明区
.settlement-section {
  .settlement-type {
    padding: 20rpx;
    background: #f8f8f8;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    .settlement-label {
      font-size: 26rpx;
      color: #666;
      font-weight: 600;
    }

    .settlement-value {
      flex: 1;
      font-size: 28rpx;
      color: #4caf50;
      font-weight: 600;
    }
  }

  .settlement-description {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    display: block;
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
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
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

// 要求区
.requirements-section {
  .requirements-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .requirement-item {
      display: flex;
      align-items: flex-start;
      gap: 12rpx;

      .requirement-number {
        width: 40rpx;
        height: 40rpx;
        background: #999;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: 600;
        flex-shrink: 0;
      }

      .requirement-text {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        line-height: 1.6;
        padding-top: 6rpx;
      }
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
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
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
