<template>
  <view class="leasing-detail-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">租赁详情</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 小程序基本信息 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-emoji">{{ leasingData.emoji }}</text>
          <view class="card-info">
            <text class="card-title">{{ leasingData.name }}</text>
            <text class="card-meta">所属公司: {{ leasingData.companyName }}</text>
            <text class="card-meta">分类: {{ leasingData.category }}</text>
          </view>
        </view>
        <view class="price-section">
          <text class="price-label">租赁价格</text>
          <text class="price-value">¥{{ leasingData.price }}/月</text>
        </view>
      </view>

      <!-- 租赁数据统计 -->
      <view class="stats-card">
        <text class="section-title">📊 租赁数据</text>
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-value">{{ leasingData.currentTenants }}</text>
            <text class="stat-label">当前租户(家)</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">¥{{ leasingData.totalIncome }}</text>
            <text class="stat-label">累计收入</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">¥{{ leasingData.monthlyIncome }}</text>
            <text class="stat-label">本月收入</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ leasingData.totalTenants }}</text>
            <text class="stat-label">累计租户(家)</text>
          </view>
        </view>
      </view>

      <!-- 租赁记录 -->
      <view class="records-card">
        <view class="section-header">
          <text class="section-title">📝 租赁记录</text>
          <text class="view-all" @tap="viewAllRecords">查看全部 ›</text>
        </view>
        <view class="record-list">
          <view v-for="record in leaseRecords" :key="record.id" class="record-item">
            <view class="record-info">
              <text class="record-company">{{ record.companyName }}</text>
              <text class="record-time">{{ record.startDate }} - {{ record.endDate }}</text>
            </view>
            <text class="record-price">¥{{ record.totalPrice }}</text>
          </view>
        </view>
      </view>

      <!-- 租户列表 -->
      <view class="tenants-card">
        <view class="section-header">
          <text class="section-title">👥 租户列表</text>
          <text class="view-all" @tap="viewAllTenants">查看全部 ›</text>
        </view>
        <view class="tenant-list">
          <view v-for="tenant in tenants" :key="tenant.id" class="tenant-item">
            <view class="tenant-info">
              <text class="tenant-name">{{ tenant.companyName }}</text>
              <text class="tenant-date">租赁期: {{ tenant.leasePeriod }}</text>
            </view>
            <text class="tenant-status" :class="{ active: tenant.status === 'active', expired: tenant.status === 'expired' }">
              {{ tenant.status === 'active' ? '租赁中' : '已到期' }}
            </text>
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

// 租赁数据
const leasingData = ref({
  id: '',
  name: '',
  emoji: '',
  companyName: '',
  category: '',
  price: 0,
  currentTenants: 0,
  totalIncome: 0,
  monthlyIncome: 0,
  totalTenants: 0
})

// 租赁记录
const leaseRecords = ref([
  { id: '1', companyName: '餐饮连锁A', startDate: '2024-01-01', endDate: '2024-06-30', totalPrice: 3000 },
  { id: '2', companyName: '零售店B', startDate: '2024-01-15', endDate: '2024-04-15', totalPrice: 1500 },
  { id: '3', companyName: '服务商C', startDate: '2023-12-01', endDate: '2024-03-01', totalPrice: 1500 }
])

// 租户列表
const tenants = ref([
  { id: '1', companyName: '餐饮连锁A', leasePeriod: '2024-01 ~ 2024-06', status: 'active' },
  { id: '2', companyName: '零售店B', leasePeriod: '2024-01 ~ 2024-04', status: 'active' },
  { id: '3', companyName: '服务商C', leasePeriod: '2023-12 ~ 2024-03', status: 'active' }
])

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 查看全部记录
const viewAllRecords = () => {
  uni.navigateTo({
    url: `/pages/profile/leasing-record-list?id=${leasingData.value.id}`
  })
}

// 查看全部租户
const viewAllTenants = () => {
  uni.navigateTo({
    url: `/pages/profile/leasing-tenant-list?id=${leasingData.value.id}`
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

  // 根据ID获取租赁数据（这里先用模拟数据）
  if (id === 'lease-001') {
    leasingData.value = {
      id: 'lease-001',
      name: '王记点餐系统',
      emoji: '🍜',
      companyName: '王记小吃店',
      category: '点餐平台',
      price: 500,
      currentTenants: 5,
      totalIncome: 12500,
      monthlyIncome: 2500,
      totalTenants: 8
    }
  }
})
</script>

<style scoped lang="scss">
.leasing-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
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
.tenants-card {
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
      color: #ff9800;
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
      background: rgba(255, 152, 0, 0.05);
      border-radius: 12rpx;

      .stat-value {
        font-size: 36rpx;
        font-weight: 700;
        color: #ff9800;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// 记录卡片和租户卡片
.records-card,
.tenants-card {
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
      color: #ff9800;
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
      color: #ff9800;
      font-weight: 600;
    }
  }
}

.tenant-list {
  .tenant-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .tenant-info {
      display: flex;
      flex-direction: column;
      gap: 6rpx;

      .tenant-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }

      .tenant-date {
        font-size: 24rpx;
        color: #999;
      }
    }

    .tenant-status {
      font-size: 24rpx;
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-weight: 500;

      &.active {
        background: rgba(255, 152, 0, 0.1);
        color: #ff9800;
      }

      &.expired {
        background: rgba(153, 153, 153, 0.1);
        color: #999;
      }
    }
  }
}
</style>
