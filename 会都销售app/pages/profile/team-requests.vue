<template>
  <view class="team-requests-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">团队审批</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 待审批申请 -->
      <view v-if="pendingApplications.length > 0" class="requests-section">
        <text class="section-title">待审批申请 ({{ pendingApplications.length }})</text>

        <view
          v-for="(app, index) in pendingApplications"
          :key="app.id"
          class="request-card"
        >
          <view class="card-header">
            <view class="applicant-info">
              <text class="applicant-name">{{ maskName(app.applicantName) }}</text>
              <text class="apply-time">{{ formatTime(app.applyTime) }}</text>
            </view>
            <view class="role-badge" :class="`role-${app.role}`">
              <text class="role-text">{{ getRoleText(app.role) }}</text>
            </view>
          </view>

          <view class="card-body">
            <view class="info-row">
              <text class="info-label">申请公司：</text>
              <text class="info-value">{{ app.companyName }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">身份证号：</text>
              <text class="info-value">{{ maskIdCard(app.idCard) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">联系电话：</text>
              <text class="info-value">{{ maskPhone(app.phone) }}</text>
            </view>
            <view v-if="app.reason" class="info-row">
              <text class="info-label">申请理由：</text>
              <text class="info-value">{{ app.reason }}</text>
            </view>
          </view>

          <view class="card-actions">
            <view class="reject-btn" @tap="handleApplication(app, 'reject')">
              <text class="btn-text">拒绝</text>
            </view>
            <view class="approve-btn" @tap="handleApplication(app, 'approve')">
              <text class="btn-text">同意</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无待审批申请</text>
        <text class="empty-hint">当有人申请加入您的公司时，申请会显示在这里</text>
      </view>

      <!-- 已处理的申请（可展开查看） -->
      <view v-if="processedApplications.length > 0" class="history-section">
        <view class="history-header" @tap="toggleHistory">
          <text class="history-title">已处理申请 ({{ processedApplications.length }})</text>
          <text class="expand-icon">{{ showHistory ? '▼' : '▶' }}</text>
        </view>

        <view v-if="showHistory" class="history-list">
          <view
            v-for="app in processedApplications"
            :key="app.id"
            class="history-item"
          >
            <view class="history-left">
              <text class="history-name">{{ maskName(app.applicantName) }}</text>
              <text class="history-meta">{{ getRoleText(app.role) }} · {{ formatTime(app.applyTime) }}</text>
            </view>
            <view class="history-status" :class="`status-${app.status}`">
              <text class="status-text">{{ app.status === 'approved' ? '已同意' : '已拒绝' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="tips-section">
        <text class="tips-title">📋 审批说明</text>
        <text class="tips-item">• 为保护隐私，申请人的敏感信息已做脱敏处理</text>
        <text class="tips-item">• 同意后，申请人将成为公司的管理成员或联系人员</text>
        <text class="tips-item">• 管理成员可以管理公司的日常业务</text>
        <text class="tips-item">• 联系人员作为公司的联系方式，可以接收业务咨询</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 显示历史记录
const showHistory = ref(false)

// 待审批申请列表
const pendingApplications = ref<any[]>([])

// 已处理申请列表
const processedApplications = ref<any[]>([])

// 切换历史记录显示
const toggleHistory = () => {
  showHistory.value = !showHistory.value
}

// 姓名脱敏
const maskName = (name: string) => {
  if (!name) return '-'
  if (name.length <= 1) return name
  if (name.length === 2) return name.charAt(0) + '*'
  return name.charAt(0) + '*' + name.charAt(name.length - 1)
}

// 身份证号脱敏
const maskIdCard = (idCard: string) => {
  if (!idCard) return '-'
  if (idCard.length < 8) return idCard
  return idCard.substring(0, 4) + '********' + idCard.substring(idCard.length - 4)
}

// 手机号脱敏
const maskPhone = (phone: string) => {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}

// 获取角色文本
const getRoleText = (role: string) => {
  switch (role) {
    case 'manager':
      return '管理成员'
    case 'contact':
      return '联系人员'
    default:
      return '未知角色'
  }
}

// 处理申请
const handleApplication = (application: any, action: 'approve' | 'reject') => {
  const actionText = action === 'approve' ? '同意' : '拒绝'

  uni.showModal({
    title: `确认${actionText}`,
    content: `确认${actionText}「${maskName(application.applicantName)}」加入「${application.companyName}」的申请吗？`,
    confirmText: '确认',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 从待审批列表中移除
        const index = pendingApplications.value.findIndex(a => a.id === application.id)
        if (index > -1) {
          const app = pendingApplications.value.splice(index, 1)[0]

          // 添加到已处理列表
          processedApplications.value.unshift({
            ...app,
            status: action
          })

          // 保存到本地存储
          saveApplications()

          uni.showToast({
            title: `${actionText}成功`,
            icon: 'success'
          })
        }
      }
    }
  })
}

// 保存申请数据
const saveApplications = () => {
  try {
    // 保存待审批申请
    uni.setStorageSync('team_pending_applications', JSON.stringify(pendingApplications.value))

    // 保存已处理申请
    uni.setStorageSync('team_processed_applications', JSON.stringify(processedApplications.value))
  } catch (e) {
    console.error('保存申请数据失败:', e)
  }
}

// 加载申请数据
const loadApplications = () => {
  try {
    // 加载待审批申请
    const pending = uni.getStorageSync('team_pending_applications')
    if (pending) {
      pendingApplications.value = JSON.parse(pending)
    } else {
      // Mock数据
      pendingApplications.value = [
        {
          id: 1,
          companyName: '上海XX科技有限公司',
          applicantName: '李四',
          role: 'manager',
          idCard: '310101199001011234',
          phone: '13800138000',
          reason: '负责公司的日常运营管理',
          applyTime: new Date().toISOString()
        },
        {
          id: 2,
          companyName: '上海XX科技有限公司',
          applicantName: '王五',
          role: 'contact',
          idCard: '310101198501011234',
          phone: '13900139000',
          reason: '作为业务联系人',
          applyTime: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    }

    // 加载已处理申请
    const processed = uni.getStorageSync('team_processed_applications')
    if (processed) {
      processedApplications.value = JSON.parse(processed)
    }
  } catch (e) {
    console.error('加载申请数据失败:', e)
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载申请数据
  loadApplications()
})
</script>

<style scoped lang="scss">
.team-requests-page {
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
}

// 待审批申请区域
.requests-section {
  margin-bottom: 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
}

// 申请卡片
.request-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .applicant-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .applicant-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .apply-time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .role-badge {
      padding: 8rpx 16rpx;
      border-radius: 20rpx;

      &.role-manager {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border: 2rpx solid #667eea;
      }

      &.role-contact {
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%);
        border: 2rpx solid #4caf50;
      }

      .role-text {
        font-size: 24rpx;
        font-weight: 500;
        color: #667eea;
      }

      .role-contact .role-text {
        color: #4caf50;
      }
    }
  }

  .card-body {
    margin-bottom: 24rpx;

    .info-row {
      display: flex;
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        font-size: 26rpx;
        color: #666;
        min-width: 160rpx;
      }

      .info-value {
        flex: 1;
        font-size: 26rpx;
        color: #333;
        line-height: 1.5;
      }
    }
  }

  .card-actions {
    display: flex;
    gap: 16rpx;

    .reject-btn,
    .approve-btn {
      flex: 1;
      padding: 20rpx;
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

// 空状态
.empty-state {
  background: #fff;
  border-radius: 20rpx;
  padding: 80rpx 30rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .empty-icon {
    font-size: 100rpx;
    display: block;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin-bottom: 12rpx;
  }

  .empty-hint {
    font-size: 24rpx;
    color: #ccc;
    display: block;
  }
}

// 历史记录区域
.history-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .history-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }

    .expand-icon {
      font-size: 24rpx;
      color: #999;
    }

    &:active {
      opacity: 0.8;
    }
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .history-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 12rpx;

      .history-left {
        flex: 1;
        display: flex;
        flex-direction: column;

        .history-name {
          font-size: 26rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 6rpx;
        }

        .history-meta {
          font-size: 22rpx;
          color: #999;
        }
      }

      .history-status {
        padding: 6rpx 12rpx;
        border-radius: 8rpx;

        &.status-approved {
          background: #e8f5e9;
        }

        &.status-rejected {
          background: #ffebee;
        }

        .status-text {
          font-size: 22rpx;
          font-weight: 500;
        }

        .status-approved .status-text {
          color: #07c160;
        }

        .status-rejected .status-text {
          color: #ff3b30;
        }
      }
    }
  }
}

// 提示信息
.tips-section {
  background: #fffbf0;
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
  border-left: 4rpx solid #ffc107;

  .tips-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #ff9800;
    margin-bottom: 16rpx;
    display: block;
  }

  .tips-item {
    font-size: 24rpx;
    color: #666;
    line-height: 1.8;
    display: block;
  }
}
</style>
