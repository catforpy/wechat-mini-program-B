<template>
  <view class="company-contact">
    <view class="section-title">
      <text class="title-text">📞 联系方式</text>
      <view class="title-line"></view>
    </view>

    <view class="contact-card">
      <view class="contact-item" v-if="contactData?.servicePhone">
        <text class="contact-label">客服电话</text>
        <view class="contact-value-row">
          <text class="contact-value">{{ contactData.servicePhone }}</text>
          <button class="call-btn" @tap="handleCall(contactData.servicePhone)">拨打</button>
        </view>
      </view>

      <view class="contact-item" v-if="contactData?.complaintPhone">
        <text class="contact-label">投诉电话</text>
        <view class="contact-value-row">
          <text class="contact-value">{{ contactData.complaintPhone }}</text>
          <button class="call-btn" @tap="handleCall(contactData.complaintPhone)">拨打</button>
        </view>
      </view>

      <view class="contact-item" v-if="contactData?.address">
        <text class="contact-label">企业地址</text>
        <text class="contact-value">{{ contactData.address }}</text>
      </view>

      <view class="contact-item" v-if="contactData?.website">
        <text class="contact-label">官方网站</text>
        <text class="contact-value link">{{ contactData.website }}</text>
      </view>

      <view class="wechat-section" v-if="contactData?.wechatQr">
        <text class="contact-label">关注公众号</text>
        <image :src="contactData.wechatQr" mode="aspectFit" class="wechat-qr" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  contact?: any
}

defineProps<Props>()

const handleCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone
  })
}
</script>

<style scoped lang="scss">
.company-contact {
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

.contact-card {
  margin: 0 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .contact-item {
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .contact-label {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-bottom: 12rpx;
    }

    .contact-value {
      font-size: 28rpx;
      color: #333;

      &.link {
        color: #667eea;
        text-decoration: underline;
      }
    }

    .contact-value-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .contact-value {
        font-size: 28rpx;
        color: #667eea;
        font-weight: 600;
      }

      .call-btn {
        padding: 8rpx 24rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        font-size: 24rpx;
        border-radius: 20rpx;
        border: none;
      }
    }
  }

  .wechat-section {
    text-align: center;

    .wechat-qr {
      width: 300rpx;
      height: 300rpx;
      margin-top: 20rpx;
    }
  }
}
</style>
