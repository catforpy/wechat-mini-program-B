<template>
  <view class="entertainment-content">
    <!-- 核心数据展示 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">📊 平台数据</text>
        <view class="title-line"></view>
      </view>
      <view class="platform-stats">
        <view class="stat-item" v-for="(stat, index) in platformStats" :key="index">
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>
    </view>

    <!-- 核心功能 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">✨ 核心功能</text>
        <view class="title-line"></view>
      </view>
      <view class="features-grid">
        <view class="feature-item" v-for="(feature, index) in features" :key="index" @tap="handleFeature(feature)">
          <view class="feature-icon">{{ feature.icon }}</view>
          <text class="feature-name">{{ feature.name }}</text>
          <text class="feature-desc">{{ feature.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 内容创作者生态 -->
    <view class="content-section" v-if="entertainmentInfo?.creators">
      <view class="section-title">
        <text class="title-text">🎬 创作者生态</text>
        <view class="title-line"></view>
      </view>
      <view class="creator-stats">
        <view class="creator-total">
          <text class="creator-num">{{ formatNumber(entertainmentInfo.creators.totalCreators) }}</text>
          <text class="creator-text">认证创作者</text>
        </view>
        <view class="creator-categories">
          <view class="category-item" v-for="(cat, index) in entertainmentInfo.creators.categories" :key="index">
            <text class="category-name">{{ cat.name }}</text>
            <text class="category-count">{{ formatNumber(cat.count) }}人</text>
          </view>
        </view>
      </view>

      <!-- 知名创作者 -->
      <view class="famous-creators" v-if="entertainmentInfo.creators.famousCreators">
        <view class="creator-scroll">
          <view class="creator-card" v-for="(creator, index) in entertainmentInfo.creators.famousCreators" :key="index">
            <image :src="creator.avatar" class="creator-avatar" mode="aspectFill" />
            <text class="creator-name">{{ creator.name }}</text>
            <text class="creator-field">{{ creator.field }}</text>
            <text class="creator-fans">{{ formatNumber(creator.fans) }}粉丝</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 内容分类 -->
    <view class="content-section" v-if="entertainmentInfo?.contentCategories">
      <view class="section-title">
        <text class="title-text">📱 内容分类</text>
        <view class="title-line"></view>
      </view>
      <view class="content-categories">
        <view class="category-card" v-for="(category, index) in entertainmentInfo.contentCategories" :key="index">
          <view class="category-header">
            <text class="category-icon">{{ category.icon }}</text>
            <text class="category-title">{{ category.name }}</text>
          </view>
          <view class="category-stats">
            <text class="stat">日均播放 {{ formatNumber(category.dailyViews) }}</text>
            <text class="stat">内容数 {{ formatNumber(category.contentCount) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 变现方式 -->
    <view class="content-section" v-if="entertainmentInfo?.monetization">
      <view class="section-title">
        <text class="title-text">💰 变现方式</text>
        <view class="title-line"></view>
      </view>
      <view class="monetization-list">
        <view class="monetization-item" v-for="(item, index) in entertainmentInfo.monetization.methods" :key="index">
          <view class="monetization-icon">{{ item.icon }}</view>
          <view class="monetization-info">
            <text class="monetization-name">{{ item.name }}</text>
            <text class="monetization-desc">{{ item.desc }}</text>
          </view>
          <text class="monetization-earn">{{ item.earning }}</text>
        </view>
      </view>
    </view>

    <!-- 商业合作 -->
    <view class="content-section" v-if="entertainmentInfo?.business">
      <view class="section-title">
        <text class="title-text">🤝 商业合作</text>
        <view class="title-line"></view>
      </view>
      <view class="business-section">
        <!-- 合作品牌 -->
        <view class="cooperation-brands" v-if="entertainmentInfo.business.brands">
          <text class="sub-title">合作品牌</text>
          <scroll-view class="brands-scroll" scroll-x>
            <view class="brand-item" v-for="(brand, index) in entertainmentInfo.business.brands" :key="index">
              <image :src="brand.logo" class="brand-logo" mode="aspectFit" />
              <text class="brand-name">{{ brand.name }}</text>
            </view>
          </scroll-view>
        </view>

        <!-- 广告服务 -->
        <view class="ad-services" v-if="entertainmentInfo.business.adServices">
          <text class="sub-title">广告服务</text>
          <view class="ad-list">
            <view class="ad-item" v-for="(ad, index) in entertainmentInfo.business.adServices" :key="index">
              <text class="ad-name">{{ ad.name }}</text>
              <text class="ad-price">{{ ad.price }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 社区保障 -->
    <view class="content-section" v-if="entertainmentInfo?.community">
      <view class="section-title">
        <text class="title-text">🛡️ 社区保障</text>
        <view class="title-line"></view>
      </view>
      <view class="community-guarantees">
        <view class="guarantee-item" v-for="(guarantee, index) in entertainment.community.guarantees" :key="index">
          <view class="guarantee-icon">{{ guarantee.icon }}</view>
          <text class="guarantee-title">{{ guarantee.title }}</text>
          <text class="guarantee-desc">{{ guarantee.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  entertainmentInfo?: any
}

const props = defineProps<Props>()

// 平台核心数据
const platformStats = ref([
  { value: '7亿+', label: '月活用户' },
  { value: '5000万+', label: '认证创作者' },
  { value: '100亿+', label: '日均播放量' },
  { value: '200+', label: '覆盖国家' }
])

// 核心功能
const features = ref([
  { name: '短视频', desc: '15秒-5分钟', icon: '🎬' },
  { name: '直播', desc: '实时互动', icon: '📡' },
  { name: '社交', desc: '关注点赞', icon: '💬' },
  { name: '电商', desc: '直播带货', icon: '🛒' },
  { name: '本地生活', desc: '探店打卡', icon: '📍' },
  { name: '小游戏', desc: '休闲娱乐', icon: '🎮' }
])

// 功能点击
const handleFeature = (feature: any) => {
  uni.showToast({
    title: feature.name,
    icon: 'success'
  })
}

// 格式化数字
const formatNumber = (num: number) => {
  if (!num) return '0'
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}
</script>

<style scoped lang="scss">
.entertainment-content {
  margin-bottom: 20rpx;
}

.content-section {
  margin: 0 20rpx 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  margin-bottom: 30rpx;

  .title-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }

  .title-line {
    width: 60rpx;
    height: 6rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3rpx;
  }
}

// 平台数据
.platform-stats {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;

  .stat-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16rpx;

    .stat-value {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
      margin-bottom: 8rpx;
    }

    .stat-label {
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

// 核心功能
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;

  .feature-item {
    text-align: center;
    padding: 30rpx 20rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
      background: #e9ecef;
    }

    .feature-icon {
      font-size: 48rpx;
      margin-bottom: 12rpx;
    }

    .feature-name {
      display: block;
      font-size: 26rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .feature-desc {
      font-size: 22rpx;
      color: #999;
    }
  }
}

// 创作者生态
.creator-stats {
  margin-bottom: 30rpx;

  .creator-total {
    text-align: center;
    padding: 40rpx;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 20rpx;
    margin-bottom: 20rpx;

    .creator-num {
      display: block;
      font-size: 48rpx;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12rpx;
    }

    .creator-text {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .creator-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .category-item {
      padding: 12rpx 24rpx;
      background: #f8f9fa;
      border-radius: 30rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .category-name {
        font-size: 24rpx;
        color: #333;
        margin-bottom: 4rpx;
      }

      .category-count {
        font-size: 20rpx;
        color: #999;
      }
    }
  }
}

// 知名创作者
.famous-creators {
  .creator-scroll {
    white-space: nowrap;

    .creator-card {
      display: inline-block;
      width: 200rpx;
      text-align: center;
      margin-right: 20rpx;
      vertical-align: top;

      &:last-child {
        margin-right: 0;
      }

      .creator-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        margin-bottom: 16rpx;
        border: 4rpx solid #f093fb;
      }

      .creator-name {
        display: block;
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .creator-field {
        display: block;
        font-size: 22rpx;
        color: #666;
        margin-bottom: 8rpx;
      }

      .creator-fans {
        font-size: 22rpx;
        color: #f5576c;
      }
    }
  }
}

// 内容分类
.content-categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;

  .category-card {
    padding: 24rpx;
    background: #f8f9fa;
    border-radius: 16rpx;

    .category-header {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .category-icon {
        font-size: 36rpx;
        margin-right: 12rpx;
      }

      .category-title {
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
      }
    }

    .category-stats {
      display: flex;
      flex-direction: column;
      gap: 8rpx;

      .stat {
        font-size: 22rpx;
        color: #666;
      }
    }
  }
}

// 变现方式
.monetization-list {
  .monetization-item {
    display: flex;
    align-items: center;
    padding: 24rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .monetization-icon {
      font-size: 48rpx;
      margin-right: 20rpx;
    }

    .monetization-info {
      flex: 1;

      .monetization-name {
        display: block;
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .monetization-desc {
        font-size: 22rpx;
        color: #999;
      }
    }

    .monetization-earn {
      font-size: 24rpx;
      color: #f5576c;
      font-weight: 600;
    }
  }
}

// 商业合作
.business-section {
  .cooperation-brands {
    margin-bottom: 30rpx;

    .sub-title {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 20rpx;
    }

    .brands-scroll {
      white-space: nowrap;

      .brand-item {
        display: inline-block;
        width: 160rpx;
        text-align: center;
        margin-right: 20rpx;
        vertical-align: top;

        &:last-child {
          margin-right: 0;
        }

        .brand-logo {
          width: 100rpx;
          height: 100rpx;
          border-radius: 16rpx;
          margin-bottom: 12rpx;
          border: 2rpx solid #e5e5e5;
        }

        .brand-name {
          display: block;
          font-size: 22rpx;
          color: #333;
        }
      }
    }
  }

  .ad-services {
    .sub-title {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 20rpx;
    }

    .ad-list {
      .ad-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background: #f8f9fa;
        border-radius: 12rpx;
        margin-bottom: 12rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .ad-name {
          font-size: 26rpx;
          color: #333;
        }

        .ad-price {
          font-size: 24rpx;
          color: #f5576c;
          font-weight: 600;
        }
      }
    }
  }
}

// 社区保障
.community-guarantees {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;

  .guarantee-item {
    text-align: center;
    padding: 30rpx 20rpx;
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    border-radius: 16rpx;

    .guarantee-icon {
      font-size: 40rpx;
      margin-bottom: 12rpx;
    }

    .guarantee-title {
      display: block;
      font-size: 24rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .guarantee-desc {
      font-size: 20rpx;
      color: #666;
    }
  }
}
</style>
