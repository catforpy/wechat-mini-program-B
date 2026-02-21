<template>
  <view class="ecommerce-content">
    <!-- 核心数据 -->
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

    <!-- 核心服务 -->
    <view class="content-section">
      <view class="section-title">
        <text class="title-text">🛍️ 核心服务</text>
        <view class="title-line"></view>
      </view>
      <view class="services-grid">
        <view class="service-item" v-for="(service, index) in services" :key="index" @tap="handleService(service)">
          <view class="service-icon">{{ service.icon }}</view>
          <text class="service-name">{{ service.name }}</text>
          <text class="service-desc">{{ service.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 商家生态 -->
    <view class="content-section" v-if="ecommerceInfo?.merchants">
      <view class="section-title">
        <text class="title-text">🏪 商家生态</text>
        <view class="title-line"></view>
      </view>
      <view class="merchant-stats">
        <view class="merchant-total">
          <text class="merchant-num">{{ formatNumber(ecommerceInfo.merchants.totalMerchants) }}</text>
          <text class="merchant-text">入驻商家</text>
        </view>
        <view class="merchant-categories">
          <view class="merchant-category-item" v-for="(cat, index) in ecommerceInfo.merchants.categories" :key="index">
            <text class="category-name">{{ cat.name }}</text>
            <text class="category-count">{{ formatNumber(cat.count) }}家</text>
          </view>
        </view>
      </view>

      <!-- 知名商家 -->
      <view class="famous-merchants" v-if="ecommerceInfo.merchants.famousMerchants">
        <text class="sub-title">知名品牌商家</text>
        <scroll-view class="merchants-scroll" scroll-x>
          <view class="merchant-card" v-for="(merchant, index) in ecommerceInfo.merchants.famousMerchants" :key="index">
            <image :src="merchant.logo" class="merchant-logo" mode="aspectFill" />
            <text class="merchant-name">{{ merchant.name }}</text>
            <text class="merchant-category">{{ merchant.category }}</text>
            <text class="merchant-sales">月销{{ formatNumber(merchant.monthlySales) }}+</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 商品类目 -->
    <view class="content-section" v-if="ecommerceInfo?.categories">
      <view class="section-title">
        <text class="title-text">📦 商品类目</text>
        <view class="title-line"></view>
      </view>
      <view class="category-list">
        <view class="category-item" v-for="(category, index) in ecommerceInfo.categories" :key="index">
          <view class="category-header">
            <text class="category-icon">{{ category.icon }}</text>
            <text class="category-name">{{ category.name }}</text>
            <text class="category-arrow">›</text>
          </view>
          <view class="category-stats">
            <text class="category-stat">商品{{ formatNumber(category.productCount) }}+</text>
            <text class="category-stat">品牌{{ formatNumber(category.brandCount) }}+</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 配送服务 -->
    <view class="content-section" v-if="ecommerceInfo?.delivery">
      <view class="section-title">
        <text class="title-text">🚚 配送服务</text>
        <view class="title-line"></view>
      </view>

      <!-- 配送时效表 -->
      <view class="delivery-table" v-if="ecommerceInfo.delivery.timeTable">
        <text class="sub-title">配送时效</text>
        <view class="table-header">
          <text class="header-cell">配送范围</text>
          <text class="header-cell">时效</text>
          <text class="header-cell">运费</text>
        </view>
        <view class="table-row" v-for="(row, index) in ecommerceInfo.delivery.timeTable" :key="index">
          <text class="row-cell">{{ row.range }}</text>
          <text class="row-cell highlight">{{ row.time }}</text>
          <text class="row-cell">{{ row.price }}</text>
        </view>
      </view>

      <!-- 配送方式 -->
      <view class="delivery-methods" v-if="ecommerceInfo.delivery.methods">
        <text class="sub-title">配送方式</text>
        <view class="method-list">
          <view class="method-item" v-for="(method, index) in ecommerceInfo.delivery.methods" :key="index">
            <view class="method-icon">{{ method.icon }}</view>
            <text class="method-name">{{ method.name }}</text>
            <text class="method-desc">{{ method.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 售后保障 -->
    <view class="content-section" v-if="ecommerceInfo?.afterSales">
      <view class="section-title">
        <text class="title-text">💝 售后保障</text>
        <view class="title-line"></view>
      </view>
      <view class="after-sales-services">
        <view class="service-item" v-for="(service, index) in ecommerceInfo.afterSales.services" :key="index">
          <view class="service-icon">{{ service.icon }}</view>
          <text class="service-title">{{ service.title }}</text>
          <text class="service-desc">{{ service.desc }}</text>
        </view>
      </view>

      <!-- 退款承诺 -->
      <view class="refund-promise" v-if="ecommerceInfo.afterSales.refundPromise">
        <view class="promise-header">
          <text class="promise-title">{{ ecommerceInfo.afterSales.refundPromise.title }}</text>
        </view>
        <view class="promise-content">
          <text class="promise-text">{{ ecommerceInfo.afterSales.refundPromise.content }}</text>
        </view>
      </view>
    </view>

    <!-- 优惠活动 -->
    <view class="content-section" v-if="ecommerceInfo?.promotions">
      <view class="section-title">
        <text class="title-text">🎉 优惠活动</text>
        <view class="title-line"></view>
      </view>
      <view class="promotions-list">
        <view class="promotion-item" v-for="(promotion, index) in ecommerceInfo.promotions" :key="index">
          <view class="promotion-badge" :class="'badge-' + promotion.type">
            {{ promotion.badge }}
          </view>
          <view class="promotion-info">
            <text class="promotion-name">{{ promotion.name }}</text>
            <text class="promotion-desc">{{ promotion.desc }}</text>
          </view>
          <text class="promotion-action">{{ promotion.action }}</text>
        </view>
      </view>
    </view>

    <!-- 会员服务 -->
    <view class="content-section" v-if="ecommerceInfo?.membership">
      <view class="section-title">
        <text class="title-text">👑 会员服务</text>
        <view class="title-line"></view>
      </view>
      <view class="membership-cards">
        <view class="membership-card" v-for="(member, index) in ecommerceInfo.membership" :key="index">
          <view class="card-header" :class="'card-' + member.level">
            <text class="card-title">{{ member.name }}</text>
            <text class="card-price">{{ member.price }}</text>
          </view>
          <view class="card-benefits">
            <view class="benefit-item" v-for="(benefit, idx) in member.benefits" :key="idx">
              <text class="benefit-icon">✓</text>
              <text class="benefit-text">{{ benefit }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  ecommerceInfo?: any
}

const props = defineProps<Props>()

// 平台核心数据
const platformStats = ref([
  { value: '10亿+', label: '年活跃用户' },
  { value: '2000万+', label: '入驻商家' },
  { value: '100亿+', label: '商品数量' },
  { value: '3000+', label: '覆盖城市' }
])

// 核心服务
const services = ref([
  { name: '在线购物', desc: '千万商品', icon: '🛒' },
  { name: '本地生活', desc: '外卖到家', icon: '🍜' },
  { name: '超市便利', desc: '即时配送', icon: '🏪' },
  { name: '生鲜果蔬', desc: '新鲜直达', icon: '🥬' },
  { name: '医药健康', desc: '24小时服务', icon: '💊' },
  { name: '全球购', desc: '正品保障', icon: '🌍' }
])

// 服务点击
const handleService = (service: any) => {
  uni.showToast({
    title: service.name,
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
.ecommerce-content {
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
    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
    border-radius: 3rpx;
  }
}

.sub-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
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
    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
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

// 核心服务
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;

  .service-item {
    text-align: center;
    padding: 30rpx 20rpx;
    background: #fff8f0;
    border-radius: 16rpx;
    border: 2rpx solid #ffe8cc;

    .service-icon {
      font-size: 48rpx;
      margin-bottom: 12rpx;
    }

    .service-name {
      display: block;
      font-size: 26rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .service-desc {
      font-size: 22rpx;
      color: #999;
    }
  }
}

// 商家生态
.merchant-stats {
  margin-bottom: 30rpx;

  .merchant-total {
    text-align: center;
    padding: 40rpx;
    background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%);
    border-radius: 20rpx;
    margin-bottom: 20rpx;

    .merchant-num {
      display: block;
      font-size: 48rpx;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12rpx;
    }

    .merchant-text {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .merchant-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .merchant-category-item {
      padding: 12rpx 24rpx;
      background: #fff8f0;
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
        color: #ff6b6b;
      }
    }
  }
}

// 知名商家
.famous-merchants {
  .merchants-scroll {
    white-space: nowrap;

    .merchant-card {
      display: inline-block;
      width: 200rpx;
      text-align: center;
      margin-right: 20rpx;
      vertical-align: top;

      &:last-child {
        margin-right: 0;
      }

      .merchant-logo {
        width: 120rpx;
        height: 120rpx;
        border-radius: 16rpx;
        margin-bottom: 16rpx;
        border: 4rpx solid #ff6b6b;
      }

      .merchant-name {
        display: block;
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .merchant-category {
        display: block;
        font-size: 22rpx;
        color: #666;
        margin-bottom: 8rpx;
      }

      .merchant-sales {
        font-size: 22rpx;
        color: #ff6b6b;
        font-weight: 600;
      }
    }
  }
}

// 商品类目
.category-list {
  .category-item {
    padding: 24rpx;
    background: #fff8f0;
    border-radius: 16rpx;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .category-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16rpx;

      .category-icon {
        font-size: 36rpx;
        margin-right: 12rpx;
      }

      .category-name {
        flex: 1;
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
      }

      .category-arrow {
        font-size: 32rpx;
        color: #999;
      }
    }

    .category-stats {
      display: flex;
      gap: 20rpx;

      .category-stat {
        font-size: 22rpx;
        color: #666;
      }
    }
  }
}

// 配送时效
.delivery-table {
  margin-bottom: 30rpx;

  .table-header {
    display: flex;
    background: #ffe8cc;
    padding: 16rpx;
    border-radius: 12rpx 12rpx 0 0;

    .header-cell {
      flex: 1;
      text-align: center;
      font-size: 24rpx;
      font-weight: 600;
      color: #333;

      &:first-child {
        flex: 1.5;
      }
    }
  }

  .table-row {
    display: flex;
    padding: 16rpx;
    background: #fff;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-radius: 0 0 12rpx 12rpx;
    }

    .row-cell {
      flex: 1;
      text-align: center;
      font-size: 24rpx;
      color: #666;

      &:first-child {
        flex: 1.5;
      }

      &.highlight {
        color: #ff6b6b;
        font-weight: 600;
      }
    }
  }
}

// 配送方式
.delivery-methods {
  .method-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .method-item {
      flex: 1;
      min-width: 200rpx;
      padding: 24rpx;
      background: #fff8f0;
      border-radius: 16rpx;
      text-align: center;

      .method-icon {
        font-size: 40rpx;
        margin-bottom: 12rpx;
      }

      .method-name {
        display: block;
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .method-desc {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

// 售后保障
.after-sales-services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;

  .service-item {
    text-align: center;
    padding: 30rpx 20rpx;
    background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%);
    border-radius: 16rpx;

    .service-icon {
      font-size: 40rpx;
      margin-bottom: 12rpx;
    }

    .service-title {
      display: block;
      font-size: 24rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .service-desc {
      font-size: 20rpx;
      color: #666;
    }
  }
}

// 退款承诺
.refund-promise {
  padding: 24rpx;
  background: #fff8f0;
  border-radius: 16rpx;
  border: 2rpx solid #ff6b6b;

  .promise-header {
    margin-bottom: 16rpx;

    .promise-title {
      font-size: 28rpx;
      font-weight: 600;
      color: #ff6b6b;
    }
  }

  .promise-content {
    .promise-text {
      font-size: 24rpx;
      color: #666;
      line-height: 1.8;
    }
  }
}

// 优惠活动
.promotions-list {
  .promotion-item {
    display: flex;
    align-items: center;
    padding: 24rpx;
    background: #fff8f0;
    border-radius: 16rpx;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .promotion-badge {
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
      font-size: 20rpx;
      font-weight: 600;
      margin-right: 20rpx;

      &.badge-hot {
        background: #ff6b6b;
        color: #fff;
      }

      &.badge-new {
        background: #4ecdc4;
        color: #fff;
      }

      &.badge-limit {
        background: #feca57;
        color: #fff;
      }
    }

    .promotion-info {
      flex: 1;

      .promotion-name {
        display: block;
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .promotion-desc {
        font-size: 22rpx;
        color: #999;
      }
    }

    .promotion-action {
      font-size: 24rpx;
      color: #ff6b6b;
      font-weight: 600;
    }
  }
}

// 会员服务
.membership-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .membership-card {
    .card-header {
      padding: 24rpx;
      border-radius: 16rpx 16rpx 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.card-gold {
        background: linear-gradient(135deg, #f7d564 0%, #e6b422 100%);
      }

      &.card-platinum {
        background: linear-gradient(135deg, #a8b8c8 0%, #7f8c8d 100%);
      }

      .card-title {
        font-size: 28rpx;
        font-weight: 600;
        color: #fff;
      }

      .card-price {
        font-size: 24rpx;
        color: #fff;
      }
    }

    .card-benefits {
      padding: 24rpx;
      background: #fafafa;
      border-radius: 0 0 16rpx 16rpx;

      .benefit-item {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .benefit-icon {
          width: 32rpx;
          height: 32rpx;
          border-radius: 50%;
          background: #4ecdc4;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20rpx;
          margin-right: 12rpx;
        }

        .benefit-text {
          font-size: 24rpx;
          color: #333;
        }
      }
    }
  }
}
</style>
