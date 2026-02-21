<template>
  <view class="cooperation-detail-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">合作详情</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 小程序基本信息 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-emoji">{{ cooperationData.emoji }}</text>
          <view class="card-info">
            <text class="card-title">{{ cooperationData.name }}</text>
            <text class="card-meta">所属公司: {{ cooperationData.companyName }}</text>
            <text class="card-meta">合作方式: {{ cooperationData.cooperationType }}</text>
          </view>
        </view>
        <view class="share-section">
          <text class="share-label">分成比例</text>
          <text class="share-value">{{ cooperationData.shareRatio }}%</text>
        </view>
      </view>

      <!-- 合作数据统计 -->
      <view class="stats-card">
        <text class="section-title">📊 合作数据</text>
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-value">{{ cooperationData.partners }}</text>
            <text class="stat-label">合作伙伴(家)</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">¥{{ cooperationData.totalShare }}</text>
            <text class="stat-label">累计分成</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">¥{{ cooperationData.monthlyShare }}</text>
            <text class="stat-label">本月分成</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ cooperationData.totalProjects }}</text>
            <text class="stat-label">合作项目(个)</text>
          </view>
        </view>
      </view>

      <!-- 合作记录 -->
      <view class="records-card">
        <view class="section-header">
          <text class="section-title">📝 合作记录</text>
          <text class="view-all" @tap="viewAllRecords">查看全部 ›</text>
        </view>
        <view class="record-list">
          <view v-for="record in cooperationRecords" :key="record.id" class="record-item">
            <view class="record-info">
              <text class="record-company">{{ record.companyName }}</text>
              <text class="record-time">{{ record.time }}</text>
            </view>
            <text class="record-income">¥{{ record.income }}</text>
          </view>
        </view>
      </view>

      <!-- 伙伴列表 -->
      <view class="partners-card">
        <view class="section-header">
          <text class="section-title">🤝 伙伴列表</text>
          <text class="view-all" @tap="viewAllPartners">查看全部 ›</text>
        </view>
        <view class="partner-list">
          <view v-for="partner in partners" :key="partner.id" class="partner-item">
            <view class="partner-info">
              <text class="partner-name">{{ partner.companyName }}</text>
              <text class="partner-date">合作时间: {{ partner.cooperationDate }}</text>
            </view>
            <text class="partner-status" :class="{ active: partner.status === 'active', ended: partner.status === 'ended' }">
              {{ partner.status === 'active' ? '合作中' : '已结束' }}
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

// 合作数据
const cooperationData = ref({
  id: '',
  name: '',
  emoji: '',
  companyName: '',
  cooperationType: '',
  shareRatio: 0,
  partners: 0,
  totalShare: 0,
  monthlyShare: 0,
  totalProjects: 0
})

// 合作记录
const cooperationRecords = ref([
  { id: '1', companyName: '渠道商A', time: '2024-01-15', income: 3000 },
  { id: '2', companyName: '服务商B', time: '2024-01-10', income: 2500 },
  { id: '3', companyName: '平台C', time: '2024-01-05', income: 2500 }
])

// 伙伴列表
const partners = ref([
  { id: '1', companyName: '渠道商A', cooperationDate: '2023-06', status: 'active' },
  { id: '2', companyName: '服务商B', cooperationDate: '2023-08', status: 'active' },
  { id: '3', companyName: '平台C', cooperationDate: '2023-10', status: 'active' }
])

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 查看全部记录
const viewAllRecords = () => {
  uni.navigateTo({
    url: `/pages/profile/cooperation-record-list?id=${cooperationData.value.id}`
  })
}

// 查看全部伙伴
const viewAllPartners = () => {
  uni.navigateTo({
    url: `/pages/profile/cooperation-partner-list?id=${cooperationData.value.id}`
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

  // 根据ID获取合作数据（这里先用模拟数据）
  if (id === 'coop-001') {
    cooperationData.value = {
      id: 'coop-001',
      name: '优选商城系统',
      emoji: '🛒',
      companyName: '优选商城',
      cooperationType: '利润分成',
      shareRatio: 30,
      partners: 3,
      totalShare: 45000,
      monthlyShare: 8000,
      totalProjects: 5
    }
  }
})
</script>

<style scoped lang="scss">
.cooperation-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
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
.partners-card {
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

  .share-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .share-label {
      font-size: 28rpx;
      color: #666;
    }

    .share-value {
      font-size: 40rpx;
      color: #4caf50;
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
      background: rgba(76, 175, 80, 0.05);
      border-radius: 12rpx;

      .stat-value {
        font-size: 36rpx;
        font-weight: 700;
        color: #4caf50;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// 记录卡片和伙伴卡片
.records-card,
.partners-card {
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
      color: #4caf50;
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

    .record-income {
      font-size: 32rpx;
      color: #4caf50;
      font-weight: 600;
    }
  }
}

.partner-list {
  .partner-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .partner-info {
      display: flex;
      flex-direction: column;
      gap: 6rpx;

      .partner-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }

      .partner-date {
        font-size: 24rpx;
        color: #999;
      }
    }

    .partner-status {
      font-size: 24rpx;
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-weight: 500;

      &.active {
        background: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }

      &.ended {
        background: rgba(153, 153, 153, 0.1);
        color: #999;
      }
    }
  }
}
</style>
