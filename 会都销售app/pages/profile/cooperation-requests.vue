<template>
  <view class="cooperation-requests-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">合作请求</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 空状态 -->
      <view v-if="requests.length === 0" class="empty-state">
        <text class="empty-icon">🤝</text>
        <text class="empty-text">暂无合作请求</text>
        <text class="empty-hint">当其他用户向您的小程序发起合作申请时，会在这里显示</text>
      </view>

      <!-- 请求列表 -->
      <view v-else class="requests-list">
        <view
          v-for="request in requests"
          :key="request.id"
          class="request-card"
        >
          <!-- 顶部：申请人信息和状态 -->
          <view class="card-header">
            <view class="applicant-info">
              <text class="company-icon">{{ request.applicantCompany.type === 'company' ? '🏢' : '🏪' }}</text>
              <view class="company-details">
                <text class="company-name">{{ request.applicantCompany.name }}</text>
                <text class="company-meta">{{ request.applicantCompany.type === 'company' ? '企业' : '个体工商户' }}</text>
              </view>
            </view>
            <view class="status-badge" :class="request.status">
              <text class="status-text">{{ getStatusText(request.status) }}</text>
            </view>
          </view>

          <!-- 中部：合作详情 -->
          <view class="card-body">
            <view class="detail-row">
              <text class="detail-label">申请合作的小程序：</text>
              <text class="detail-value">{{ request.targetProgram.name }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">合作方式：</text>
              <text class="detail-value">{{ getCooperationModeText(request.cooperationMode) }}</text>
            </view>
            <view class="detail-row" v-if="request.expectedStartDate">
              <text class="detail-label">期望开始时间：</text>
              <text class="detail-value">{{ request.expectedStartDate }}</text>
            </view>
            <view class="purpose-section">
              <text class="purpose-label">申请目的：</text>
              <text class="purpose-text">{{ request.purpose }}</text>
            </view>
            <view class="time-section">
              <text class="time-text">申请时间：{{ formatTime(request.submitTime) }}</text>
            </view>
          </view>

          <!-- 底部：操作按钮 -->
          <view class="card-footer" v-if="request.status === 'pending_review'">
            <view class="action-buttons">
              <view class="reject-btn" @tap="handleReject(request)">
                <text class="btn-text">拒绝</text>
              </view>
              <view class="approve-btn" @tap="handleApprove(request)">
                <text class="btn-text">同意</text>
              </view>
            </view>
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

// 请求列表
interface CooperationRequest {
  id: number
  targetProgram: {
    id: string
    name: string
    icon?: string
    emoji?: string
  }
  applicantCompany: {
    id: number
    name: string
    type: string
  }
  cooperationMode: string
  purpose: string
  expectedStartDate?: string
  additionalInfo?: string
  status: 'pending_review' | 'approved' | 'rejected'
  submitTime: string
  updateTime: string
}

const requests = ref<CooperationRequest[]>([])

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending_review':
      return '待审核'
    case 'approved':
      return '已同意'
    case 'rejected':
      return '已拒绝'
    default:
      return '未知'
  }
}

// 获取合作方式文本
const getCooperationModeText = (mode: string) => {
  const modes: Record<string, string> = {
    'strategic': '战略合作',
    'technical': '技术合作',
    'operational': '运营合作',
    'resource': '资源共享'
  }
  return modes[mode] || '其他'
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 同意申请
const handleApprove = (request: CooperationRequest) => {
  uni.showModal({
    title: '确认同意',
    content: `确认同意「${request.applicantCompany.name}」的合作申请吗？`,
    confirmText: '同意',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 更新请求状态
        request.status = 'approved'
        request.updateTime = new Date().toISOString()

        // 保存到本地存储
        saveRequests()

        uni.showToast({
          title: '已同意合作申请',
          icon: 'success'
        })
      }
    }
  })
}

// 拒绝申请
const handleReject = (request: CooperationRequest) => {
  uni.showModal({
    title: '确认拒绝',
    content: `确认拒绝「${request.applicantCompany.name}」的合作申请吗？`,
    confirmText: '拒绝',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 更新请求状态
        request.status = 'rejected'
        request.updateTime = new Date().toISOString()

        // 保存到本地存储
        saveRequests()

        uni.showToast({
          title: '已拒绝合作申请',
          icon: 'success'
        })
      }
    }
  })
}

// 保存请求列表到本地存储
const saveRequests = () => {
  uni.setStorageSync('cooperation_requests_for_my_programs', JSON.stringify(requests.value))
}

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载请求列表
  try {
    const saved = uni.getStorageSync('cooperation_requests_for_my_programs')
    if (saved) {
      requests.value = JSON.parse(saved)
    } else {
      // Mock数据用于测试
      requests.value = [
        {
          id: 1,
          targetProgram: {
            id: 'mp001',
            name: '零售电商小程序',
            emoji: '🛒'
          },
          applicantCompany: {
            id: 101,
            name: '上海XX科技有限公司',
            type: 'company'
          },
          cooperationMode: 'strategic',
          purpose: '我们公司希望在零售电商领域与贵方进行深度合作，共同开发市场。',
          expectedStartDate: '2025-03-01',
          status: 'pending_review',
          submitTime: new Date(Date.now() - 86400000).toISOString(),
          updateTime: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          targetProgram: {
            id: 'mp002',
            name: '餐饮点餐系统',
            emoji: '🍔'
          },
          applicantCompany: {
            id: 102,
            name: '浦东新区XX餐饮店',
            type: 'individual'
          },
          cooperationMode: 'operational',
          purpose: '希望获得餐饮点餐系统的运营支持，提升门店效率。',
          status: 'approved',
          submitTime: new Date(Date.now() - 172800000).toISOString(),
          updateTime: new Date(Date.now() - 86400000).toISOString()
        }
      ]
      saveRequests()
    }
  } catch (e) {
    console.error('加载合作请求失败:', e)
  }
})
</script>

<style scoped lang="scss">
.cooperation-requests-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 20rpx;

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    height: 88rpx;

    .back-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .nav-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .placeholder {
      width: 60rpx;
    }
  }
}

// 主内容区域
.main-content {
  padding: 20rpx;
  padding-bottom: 40rpx;
  min-height: calc(100vh - 200rpx);
}

// 空状态
.empty-state {
  text-align: center;
  padding: 120rpx 60rpx;

  .empty-icon {
    font-size: 120rpx;
    display: block;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #333;
    font-weight: 500;
    display: block;
    margin-bottom: 16rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #999;
    line-height: 1.6;
    display: block;
  }
}

// 请求列表
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

// 请求卡片
.request-card {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    border-bottom: 1rpx solid #f0f0f0;

    .applicant-info {
      display: flex;
      align-items: center;
      flex: 1;

      .company-icon {
        font-size: 48rpx;
        margin-right: 16rpx;
      }

      .company-details {
        display: flex;
        flex-direction: column;

        .company-name {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 6rpx;
        }

        .company-meta {
          font-size: 24rpx;
          color: #999;
        }
      }
    }

    .status-badge {
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      white-space: nowrap;

      &.pending_review {
        background: #fff3e0;
        color: #ff9800;
      }

      &.approved {
        background: #e8f5e9;
        color: #07c160;
      }

      &.rejected {
        background: #ffebee;
        color: #f44336;
      }

      .status-text {
        font-weight: 500;
      }
    }
  }

  .card-body {
    padding: 24rpx;

    .detail-row {
      display: flex;
      margin-bottom: 16rpx;

      .detail-label {
        font-size: 26rpx;
        color: #666;
        min-width: 200rpx;
      }

      .detail-value {
        font-size: 26rpx;
        color: #333;
        flex: 1;
        font-weight: 500;
      }
    }

    .purpose-section {
      margin-top: 20rpx;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 12rpx;

      .purpose-label {
        font-size: 24rpx;
        color: #666;
        display: block;
        margin-bottom: 12rpx;
      }

      .purpose-text {
        font-size: 26rpx;
        color: #333;
        line-height: 1.6;
        display: block;
      }
    }

    .time-section {
      margin-top: 16rpx;
      padding-top: 16rpx;
      border-top: 1rpx solid #f0f0f0;

      .time-text {
        font-size: 24rpx;
        color: #999;
        display: block;
      }
    }
  }

  .card-footer {
    padding: 20rpx 24rpx;
    background: #fafafa;
    border-top: 1rpx solid #f0f0f0;

    .action-buttons {
      display: flex;
      gap: 16rpx;

      .reject-btn,
      .approve-btn {
        flex: 1;
        padding: 24rpx;
        border-radius: 12rpx;
        text-align: center;
        font-size: 28rpx;
        font-weight: 500;

        .btn-text {
          color: #fff;
        }

        &:active {
          opacity: 0.8;
        }
      }

      .reject-btn {
        background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
      }

      .approve-btn {
        background: linear-gradient(135deg, #07c160 0%, #0bbd87 100%);
      }
    }
  }
}
</style>
