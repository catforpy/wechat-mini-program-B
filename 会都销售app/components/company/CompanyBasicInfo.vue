<template>
  <view class="company-basic-info">
    <!-- 顶部封面轮播图 -->
    <view class="banner-section">
      <swiper
        class="banner-swiper"
        :indicator-dots="true"
        indicator-color="rgba(255, 255, 255, 0.5)"
        indicator-active-color="#fff"
        autoplay
        circular
        :interval="3000"
        @change="handleBannerChange"
      >
        <swiper-item v-for="(img, index) in bannerImages" :key="index">
          <image :src="img.url" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>

      <!-- 图片标题指示器 - 显示当前图片的标题 -->
      <view class="banner-titles">
        <view
          class="title-item"
          v-for="(img, index) in bannerImages"
          :key="index"
          :class="{ active: currentBannerIndex === index }"
        >
          <text class="title-dot"></text>
          <text class="title-text">{{ img.title }}</text>
        </view>
      </view>
    </view>

    <!-- 基础信息卡片 - 紧贴轮播图 -->
    <view class="info-card">
      <!-- 公司Logo和名称 -->
      <view class="company-header">
        <image :src="basicInfo.logo || 'https://picsum.photos/100/100?random=999'" class="company-logo" mode="aspectFill" />
        <view class="company-info">
          <text class="company-name">{{ basicInfo.companyName || '企业名称' }}</text>
          <view class="company-tags">
            <text class="tag industry">{{ basicInfo.industryType || '行业类型' }}</text>
            <text class="tag scale">{{ basicInfo.scale || '企业规模' }}</text>
          </view>
        </view>
        <view class="favorite-btn" @tap="handleFavorite">
          <text class="favorite-icon">♥</text>
        </view>
      </view>

      <!-- 评分区域 -->
      <view class="rating-section">
        <view class="stars">
          <text v-for="n in 5" :key="n" class="star" :class="{ active: n <= Math.floor(basicInfo.rating || 0) }">★</text>
        </view>
        <text class="rating-text">{{ basicInfo.rating || 0 }}分</text>
        <text class="review-count">{{ formatNumber(basicInfo.reviewCount || 0) }}条评价</text>
        <text class="rating-link">查看评价 →</text>
      </view>

      <!-- 核心数据 - 根据行业自定义 -->
      <view class="core-data">
        <view class="data-item" v-for="(item, index) in coreData" :key="index">
          <text class="data-value">{{ item.value }}</text>
          <text class="data-label">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  info?: any
  mediaInfo?: any
}

const props = defineProps<Props>()

// 基础信息（从props获取）
const basicInfo = computed(() => props.info || {})

// 轮播图数据（从props获取，如果没有则使用默认数据）
const bannerImages = ref(props.mediaInfo?.bannerImages?.map((url: string, index: number) => ({
  url,
  title: ['', '企业展示', ''][index] || ''
})) || [
  {
    url: 'https://picsum.photos/750/400?random=1',
    title: '企业展示'
  },
  {
    url: 'https://picsum.photos/750/400?random=2',
    title: '优质服务'
  },
  {
    url: 'https://picsum.photos/750/400?random=3',
    title: '专业可靠'
  }
])

// 当前轮播图索引
const currentBannerIndex = ref(0)

// 轮播图切换事件
const handleBannerChange = (e: any) => {
  currentBannerIndex.value = e.detail.current
}

// 核心数据（根据行业不同展示不同数据）
const coreData = computed(() => {
  const industry = basicInfo.value?.industryType

  // 物流服务行业核心数据
  if (industry === '物流服务') {
    return [
      { value: formatNumber(basicInfo.value?.reviewCount || 0), label: '评价数' },
      { value: basicInfo.value?.establishedDate?.split('-')[0] || '1993', label: '成立年份' },
      { value: 'AAA', label: '信用等级' },
      { value: '全国', label: '覆盖范围' }
    ]
  }

  // 教育服务行业核心数据
  if (industry === '教育服务') {
    return [
      { value: formatNumber(basicInfo.value?.reviewCount || 0), label: '评价数' },
      { value: basicInfo.value?.establishedDate?.split('-')[0] || '1993', label: '成立年份' },
      { value: '10万+', label: '在籍学员' },
      { value: '1000+', label: '师资人数' }
    ]
  }

  // 默认数据
  return [
    { value: formatNumber(basicInfo.value?.reviewCount || 0), label: '评价数' },
    { value: basicInfo.value?.establishedDate?.split('-')[0] || '1993', label: '成立年份' },
    { value: 'AAA', label: '信用等级' },
    { value: '优秀', label: '服务评级' }
  ]
})

// 收藏
const handleFavorite = () => {
  uni.showToast({
    title: '收藏成功',
    icon: 'success'
  })
}

// 格式化数字
const formatNumber = (num: number) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}
</script>

<style scoped lang="scss">
.company-basic-info {
  margin-bottom: 20rpx;
}

// 轮播图区域
.banner-section {
  position: relative;
  width: 100%;
  height: 400rpx;

  .banner-swiper {
    width: 100%;
    height: 100%;
  }

  .banner-image {
    width: 100%;
    height: 100%;
  }

  // 标题指示器
  .banner-titles {
    position: absolute;
    bottom: 60rpx;  // 向上移动，避免被卡片遮挡
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 20rpx;
    padding: 20rpx;
    background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);

    .title-item {
      display: flex;
      align-items: center;
      gap: 12rpx;
      opacity: 0.5;
      transition: opacity 0.3s;

      &.active {
        opacity: 1;
      }

      .title-dot {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        background: #fff;
      }

      .title-text {
        font-size: 24rpx;
        color: #fff;
      }
    }
  }
}

// 基础信息卡片 - 调整负边距
.info-card {
  margin: -40rpx 20rpx 0;  // 减小负边距
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

// 公司头部
.company-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30rpx;

  .company-logo {
    width: 100rpx;
    height: 100rpx;
    border-radius: 16rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
    background: #f5f5f5;
    border: 2rpx solid #e5e5e5;
  }

  .company-info {
    flex: 1;

    .company-name {
      display: block;
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
      overflow: visible;
      white-space: normal;
      word-break: break-all;
    }

    .company-tags {
      display: flex;
      gap: 12rpx;
      flex-wrap: wrap;

      .tag {
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        font-size: 22rpx;
        white-space: nowrap;
        overflow: visible;

        &.industry {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        &.scale {
          background: #f0f0f0;
          color: #666;
        }
      }
    }
  }

  .favorite-btn {
    flex-shrink: 0;
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff5f5;
    border-radius: 50%;

    .favorite-icon {
      color: #ff5252;
      font-size: 32rpx;
    }
  }
}

// 评分区域
.rating-section {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0;
  border-bottom: 1rpx solid #f0f0f0;

  .stars {
    display: flex;
    gap: 4rpx;
    margin-right: 16rpx;

    .star {
      font-size: 28rpx;
      color: #ddd;

      &.active {
        color: #FFB800;
      }
    }
  }

  .rating-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #FFB800;
    margin-right: 16rpx;
  }

  .review-count {
    font-size: 24rpx;
    color: #999;
    margin-right: auto;
  }

  .rating-link {
    font-size: 24rpx;
    color: #667eea;
  }
}

// 核心数据 - 改为横向滚动
.core-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 30rpx;

  .data-item {
    text-align: center;
    flex: 1;

    .data-value {
      display: block;
      font-size: 36rpx;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 8rpx;
    }

    .data-label {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>
