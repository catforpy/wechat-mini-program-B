<template>
  <view class="selling-detail-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">销售详情</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 小程序基本信息 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-emoji">{{ sellingData.emoji }}</text>
          <view class="card-info">
            <text class="card-title">{{ sellingData.name }}</text>
            <text class="card-meta">所属公司: {{ sellingData.companyName }}</text>
            <text class="card-meta">分类: {{ sellingData.category }}</text>
          </view>
        </view>
        <view class="price-section">
          <text class="price-label">销售价格</text>
          <text class="price-value">¥{{ sellingData.price }}</text>
        </view>
      </view>

      <!-- 销售数据统计 -->
      <view class="stats-card">
        <text class="section-title">📊 销售数据</text>
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-value">{{ sellingData.totalSales }}</text>
            <text class="stat-label">累计销售(次)</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">¥{{ sellingData.totalIncome }}</text>
            <text class="stat-label">累计收入</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ sellingData.currentCustomers }}</text>
            <text class="stat-label">当前客户(家)</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ sellingData.monthlySales }}</text>
            <text class="stat-label">本月销售(次)</text>
          </view>
        </view>
      </view>

      <!-- 销售记录 -->
      <view class="records-card">
        <view class="section-header">
          <text class="section-title">📝 销售记录</text>
          <text class="view-all" @tap="viewAllRecords">查看全部 ›</text>
        </view>
        <view class="record-list">
          <view v-for="record in salesRecords" :key="record.id" class="record-item">
            <view class="record-info">
              <text class="record-company">{{ record.companyName }}</text>
              <text class="record-time">{{ record.time }}</text>
            </view>
            <text class="record-price">¥{{ record.price }}</text>
          </view>
        </view>
      </view>

      <!-- 客户列表 -->
      <view class="customers-card">
        <view class="section-header">
          <text class="section-title">👥 客户列表</text>
          <text class="view-all" @tap="viewAllCustomers">查看全部 ›</text>
        </view>
        <view class="customer-list">
          <view v-for="customer in customers" :key="customer.id" class="customer-item">
            <text class="customer-name">{{ customer.companyName }}</text>
            <text class="customer-date">{{ customer.purchaseDate }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 销售数据
const sellingData = ref({
  id: '',
  name: '',
  emoji: '',
  companyName: '',
  category: '',
  price: 0,
  totalSales: 0,
  totalIncome: 0,
  currentCustomers: 0,
  monthlySales: 0,
  monthlyIncome: 0
})

// 销售记录
const salesRecords = ref([
  { id: '1', companyName: '科技公司A', time: '2024-01-15', price: 5000 },
  { id: '2', companyName: '教育机构B', time: '2024-01-10', price: 5000 },
  { id: '3', companyName: '服务商C', time: '2024-01-05', price: 5000 }
])

// 客户列表
const customers = ref([
  { id: '1', companyName: '科技公司A', purchaseDate: '2024-01-15' },
  { id: '2', companyName: '教育机构B', purchaseDate: '2024-01-10' },
  { id: '3', companyName: '服务商C', purchaseDate: '2024-01-05' }
])

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 查看全部记录
const viewAllRecords = () => {
  uni.navigateTo({
    url: `/pages/profile/selling-record-list?id=${sellingData.value.id}`
  })
}

// 查看全部客户
const viewAllCustomers = () => {
  uni.navigateTo({
    url: `/pages/profile/selling-customer-list?id=${sellingData.value.id}`
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}
  const id = options.id

  // 根据ID获取销售数据（这里先用模拟数据）
  if (id === 'sell-001') {
    sellingData.value = {
      id: 'sell-001',
      name: '太湖直播',
      emoji: '📺',
      companyName: '太湖学院',
      category: '直播服务',
      price: 5000,
      totalSales: 12,
      totalIncome: 60000,
      currentCustomers: 12,
      monthlySales: 3,
      monthlyIncome: 15000
    }
  }
})
</script>

<style scoped lang="scss">
.selling-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1000;

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 20rpx;

    .nav-back {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
      }
    }

    .nav-title {
      flex: 1;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .nav-placeholder {
      width: 60rpx;
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
  padding: 20rpx 30rpx;
  padding-bottom: 40rpx;
}

// 卡片通用样式
.info-card,
.stats-card,
.records-card,
.customers-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

// 信息卡片
.info-card {
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .card-emoji {
      font-size: 64rpx;
      margin-right: 20rpx;
    }

    .card-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;

      .card-title {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }

      .card-meta {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .price-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .price-label {
      font-size: 28rpx;
      color: #666;
    }

    .price-value {
      font-size: 40rpx;
      color: #667eea;
      font-weight: 700;
    }
  }
}

// 统计卡片
.stats-card {
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24rpx;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 12rpx;

      .stat-value {
        font-size: 36rpx;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// 记录卡片和客户卡片
.records-card,
.customers-card {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .view-all {
      font-size: 26rpx;
      color: #667eea;
    }
  }
}

.record-list {
  .record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .record-info {
      display: flex;
      flex-direction: column;
      gap: 6rpx;

      .record-company {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }

      .record-time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .record-price {
      font-size: 32rpx;
      color: #667eea;
      font-weight: 600;
    }
  }
}

.customer-list {
  .customer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .customer-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }

    .customer-date {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>
