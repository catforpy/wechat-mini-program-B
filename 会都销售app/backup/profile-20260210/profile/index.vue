<template>
  <view class="profile-page">
    <!-- 1. 用户信息卡片 -->
    <view class="user-card" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="user-avatar-wrapper">
        <image
          v-if="userInfo.avatar"
          class="user-avatar"
          :src="userInfo.avatar"
          mode="aspectFill"
        />
        <view v-else class="user-avatar default">
          <text class="avatar-placeholder">{{ userInfo.nickname?.charAt(0) || '用' }}</text>
        </view>
        <view class="certification-badge" :class="`status-${userInfo.certificationStatus}`">
          <text class="badge-text">{{ getCertificationText(userInfo.certificationStatus) }}</text>
        </view>
      </view>
      <view class="user-info">
        <text class="user-name">{{ userInfo.nickname || '未登录' }}</text>
        <text class="user-phone">{{ userInfo.phone || '' }}</text>
      </view>
      <view class="entity-type-wrapper" @tap="goToCompanyDetail">
        <text class="entity-type-label">主体类型：</text>
        <text class="entity-type-value">{{ getEntityTypeText(userInfo.entityType) }}</text>
        <text class="entity-type-action">></text>
      </view>

      <!-- 企业已通过的资质显示 -->
      <view v-if="userInfo.entityType === 'enterprise' && approvedQualifications.length > 0" class="qualifications-badges">
        <view
          v-for="qual in approvedQualifications"
          :key="qual.id"
          class="qualification-badge"
        >
          <text class="badge-text">{{ qual.name }}</text>
        </view>
      </view>
    </view>

    <!-- 2. 订单卡片 -->
    <view class="order-card" v-if="latestOrder">
      <view class="card-header">
        <text class="card-title">📦 我的订单</text>
        <text class="card-action" @tap="goToOrderList">查看全部 ></text>
      </view>
      <view class="order-content">
        <view class="order-template">
          <image
            v-if="latestOrder.templateIcon"
            class="template-icon"
            :src="latestOrder.templateIcon"
            mode="aspectFill"
          />
          <view v-else class="template-icon default">
            <text class="template-emoji">📦</text>
          </view>
          <view class="template-info">
            <text class="template-name">{{ latestOrder.templateName }}</text>
            <view class="category-tags">
              <text class="category-tag">{{ latestOrder.categoryName }}</text>
              <text class="category-tag">{{ latestOrder.subCategoryName }}</text>
            </view>
            <text class="order-no">订单号：{{ latestOrder.orderNo }}</text>
            <text class="order-time">{{ latestOrder.createdAt }}</text>
          </view>
        </view>
        <view class="order-divider"></view>
        <view class="order-payment">
          <view class="payment-row">
            <text class="payment-label">支付金额：</text>
            <text class="payment-amount">¥{{ (latestOrder.orderAmount / 100).toFixed(2) }}</text>
          </view>
        </view>
        <view class="order-status-wrapper">
          <view class="order-status-badge" :class="`status-${latestOrder.status}`">
            <text class="status-text">{{ getOrderStatusText(latestOrder.status) }}</text>
          </view>
          <text v-if="latestOrder.estimatedCompletionTime" class="estimated-time">
            预计完成：{{ latestOrder.estimatedCompletionTime }}
          </text>
        </view>
        <view class="order-actions">
          <button class="action-btn secondary" @tap="viewOrderDetail">查看详情</button>
          <button class="action-btn" @tap="contactService">联系客服</button>
        </view>
      </view>
    </view>

    <!-- 无订单时的占位 -->
    <view class="order-card empty" v-else>
      <view class="card-header">
        <text class="card-title">📦 我的订单</text>
        <text class="card-action" @tap="goToOrderList">查看全部 ></text>
      </view>
      <view class="empty-content">
        <text class="empty-icon">📦</text>
        <text class="empty-text">还没有订单</text>
        <text class="empty-hint">快去选购模板吧</text>
        <button class="empty-action-btn" @tap="goToIndex">去选购模板</button>
      </view>
    </view>

    <!-- 3. 小程序卡片 -->
    <view class="mini-program-card" v-if="miniPrograms.length > 0">
      <view class="card-header">
        <text class="card-title">📱 我的小程序</text>
        <text class="card-action" @tap="goToMiniProgramList">管理小程序 ></text>
      </view>
      <view class="mini-program-list">
        <view
          v-for="miniProgram in miniPrograms"
          :key="miniProgram.miniProgramId"
          class="mini-program-item"
          @tap="handleMiniProgramClick(miniProgram)"
        >
          <view class="mini-program-icon-wrapper">
            <image
              v-if="miniProgram.icon"
              class="mini-program-icon"
              :src="miniProgram.icon"
              mode="aspectFill"
            />
            <view v-else class="mini-program-icon default">
              <text class="mini-program-emoji">📱</text>
            </view>

            <!-- 状态标签 -->
            <view class="status-tags">
              <!-- 审核状态标签 -->
              <view
                v-if="miniProgram.status !== 'approved'"
                class="status-tag audit"
                :class="`status-${miniProgram.status}`"
              >
                <text class="tag-text">{{ getAuditStatusText(miniProgram.status) }}</text>
              </view>

              <!-- 开发状态标签 -->
              <view
                class="status-tag development"
                :class="`status-${miniProgram.developmentStatus}`"
              >
                <text class="tag-text">
                  {{ getDevelopmentStatusText(miniProgram.developmentStatus) }}
                  <text v-if="miniProgram.developmentProgress" class="progress-text">
                    {{ miniProgram.developmentProgress.progress }}%
                  </text>
                </text>
              </view>
            </view>
          </view>

          <view class="mini-program-info">
            <text class="mini-program-name">{{ miniProgram.name }}</text>
            <text class="mini-program-desc">{{ miniProgram.description || '暂无描述' }}</text>

            <!-- 进度信息 -->
            <view v-if="miniProgram.status === 'reviewing'" class="audit-info">
              <text class="info-text">已提交 {{ getDaysSince(miniProgram.submitTime) }} 天</text>
            </view>
            <view v-else-if="miniProgram.developmentStatus === 'developing'" class="development-info">
              <view class="progress-bar">
                <view
                  class="progress-fill"
                  :style="{ width: miniProgram.developmentProgress.progress + '%' }"
                ></view>
              </view>
              <text class="info-text">
                预计完成：{{ miniProgram.developmentProgress.estimatedCompletionTime || '计算中' }}
              </text>
            </view>
            <view v-else-if="miniProgram.developmentStatus === 'ready'" class="ready-info">
              <text class="info-text">✓ 已就绪，可正常使用</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 4. 资质管理卡片 -->
    <view class="qualification-card">
      <view class="card-header">
        <text class="card-title">📄 资质管理</text>
        <text class="card-action" @tap="goToQualification">管理资质 ></text>
      </view>
      <view class="qualification-content">
        <view class="qualification-item">
          <view class="qualification-icon">✓</view>
          <view class="qualification-info">
            <text class="qualification-title">{{ getQualificationTitle() }}</text>
            <text class="qualification-desc">{{ getQualificationDesc() }}</text>
          </view>
        </view>

        <!-- 显示已通过的资质列表 -->
        <view v-if="approvedQualifications.length > 0" class="approved-qualifications">
          <text class="approved-title">已通过的资质：</text>
          <view class="approved-list">
            <view
              v-for="qual in approvedQualifications"
              :key="qual.id"
              class="approved-item"
            >
              <text class="approved-item-text">{{ qual.name }}</text>
            </view>
          </view>
        </view>

        <view class="certification-status-wrapper">
          <view class="certification-status" :class="`status-${userInfo.certificationStatus}`">
            <text class="status-text">{{ getCertificationStatusText(userInfo.certificationStatus) }}</text>
          </view>
          <text v-if="userInfo.certificationTime" class="certification-time">
            认证时间：{{ userInfo.certificationTime }}
          </text>
        </view>
      </view>
    </view>

    <!-- 5. 功能菜单列表 -->
    <view class="menu-list">
      <view class="menu-item" @tap="goToCustomerService">
        <view class="menu-icon">📞</view>
        <view class="menu-content">
          <text class="menu-title">客服中心</text>
          <text class="menu-desc">在线客服 / 常见问题</text>
        </view>
        <text class="menu-action">></text>
      </view>

      <view class="menu-item" @tap="goToSettings">
        <view class="menu-icon">⚙️</view>
        <view class="menu-content">
          <text class="menu-title">设置</text>
          <text class="menu-desc">账号安全 / 消息通知</text>
        </view>
        <text class="menu-action">></text>
      </view>

      <view class="menu-item" @tap="goToAbout">
        <view class="menu-icon">ℹ️</view>
        <view class="menu-content">
          <text class="menu-title">关于</text>
          <text class="menu-desc">关于我们 / 用户协议</text>
        </view>
        <text class="menu-action">></text>
      </view>
    </view>

    <!-- 6. 退出登录按钮 -->
    <view class="logout-wrapper">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>

    <!-- 弹窗：小程序状态 -->
    <view
      class="modal-overlay"
      v-if="showModal"
      @tap="closeModal"
    >
      <view class="modal-content" @tap.stop>
        <!-- 审核中弹窗 -->
        <view v-if="selectedMiniProgram?.status === 'reviewing'" class="modal-body">
          <view class="modal-title">小程序审核状态</view>
          <view class="modal-divider"></view>
          <view class="status-large" :class="`status-${selectedMiniProgram.status}`">
            <text class="status-icon">⏳</text>
            <text class="status-label">审核中</text>
          </view>
          <view class="modal-info">
            <view class="info-item">
              <text class="info-label">提交时间：</text>
              <text class="info-value">{{ selectedMiniProgram.submitTime }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">已等待：</text>
              <text class="info-value">{{ getDaysSince(selectedMiniProgram.submitTime) }} 天</text>
            </view>
            <view class="info-item">
              <text class="info-label">预计完成：</text>
              <text class="info-value">{{ selectedMiniProgram.estimatedCompletionTime || '3-5个工作日' }}</text>
            </view>
          </view>
          <view class="modal-desc">
            <text class="desc-title">审核内容：</text>
            <text class="desc-text">• 小程序名称规范</text>
            <text class="desc-text">• 小程序图标</text>
            <text class="desc-text">• 小程序描述</text>
            <text class="desc-text">• 资质文件</text>
          </view>
          <view class="modal-actions">
            <button class="modal-btn secondary" @tap="closeModal">关闭</button>
            <button class="modal-btn" @tap="contactService">联系客服</button>
          </view>
        </view>

        <!-- 开发中弹窗 -->
        <view v-else-if="selectedMiniProgram?.developmentStatus === 'developing'" class="modal-body">
          <view class="modal-title">小程序开发进度</view>
          <view class="modal-divider"></view>
          <view class="status-large developing">
            <text class="status-icon">🔨</text>
            <text class="status-label">开发中 {{ selectedMiniProgram.developmentProgress?.progress || 0 }}%</text>
          </view>
          <view class="modal-info">
            <text class="modal-hint">预计完成：{{ selectedMiniProgram.developmentProgress?.estimatedCompletionTime || '计算中' }}</text>
          </view>
          <view class="phases-list">
            <view
              v-for="(phase, index) in selectedMiniProgram.developmentProgress?.phases"
              :key="index"
              class="phase-item"
              :class="`phase-${phase.status}`"
            >
              <text class="phase-icon">{{ getPhaseIcon(phase.status) }}</text>
              <text class="phase-name">{{ phase.name }}</text>
              <text class="phase-percent">{{ phase.progress }}%</text>
            </view>
          </view>
          <view class="modal-actions">
            <button class="modal-btn secondary" @tap="closeModal">关闭</button>
            <button class="modal-btn" @tap="contactService">联系开发</button>
          </view>
        </view>

        <!-- 已就绪弹窗 -->
        <view v-else-if="selectedMiniProgram?.developmentStatus === 'ready'" class="modal-body">
          <view class="modal-title">小程序已就绪</view>
          <view class="modal-divider"></view>
          <view class="ready-content">
            <view class="ready-icon">✓</view>
            <text class="ready-title">恭喜！您的小程序已经开发完成</text>
            <view class="ready-info">
              <text class="ready-time">上线时间：{{ selectedMiniProgram.updatedAt }}</text>
              <text class="ready-status">运行状态：正常</text>
            </view>
            <view class="ready-features">
              <text class="features-title">可用功能：</text>
              <text class="feature-item">✓ 商品管理</text>
              <text class="feature-item">✓ 订单管理</text>
              <text class="feature-item">✓ 支付配置</text>
              <text class="feature-item">✓ 数据统计</text>
              <text class="feature-item">✓ 小程序发布</text>
            </view>
          </view>
          <view class="modal-actions">
            <button class="modal-btn primary" @tap="enterAdmin">进入管理后台</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 弹窗控制
const showModal = ref(false)
const selectedMiniProgram = ref<any>(null)

// 企业已审核通过的资质列表
const approvedQualifications = ref([
  { id: 1, name: '电信增值业务经营许可证' },
  { id: 2, name: '网络文化经营许可证' }
])

// 用户信息（Mock数据）
const userInfo = ref({
  userId: 'user123',
  nickname: '张三',
  avatar: '',  // 可以添加头像URL
  phone: '138****8888',
  email: 'zhangsan@example.com',
  entityType: 'enterprise' as 'enterprise' | 'individual' | 'overseas',
  certificationStatus: 'certified' as 'uncertified' | 'pending' | 'certified' | 'rejected',
  certificationTime: '2025-01-15'
})

// 最新订单（Mock数据）
const latestOrder = ref({
  orderId: 'order123',
  orderNo: 'ORDER20250209001',
  templateId: 'template123',
  templateName: '零售电商模板',
  templateIcon: '/static/haidu.jpg',
  categoryName: '电商',
  subCategoryName: '零售',
  orderAmount: 279900,  // 单位：分，1799-2799元之间
  actualAmount: 279900,
  status: 'pending' as 'unpaid' | 'pending' | 'approved' | 'rejected' | 'completed',
  paymentTime: '2025-02-09 14:30',
  approvalTime: '',
  rejectReason: '',
  estimatedCompletionTime: '2025-02-12',
  createdAt: '2025-02-09 14:30',
  updatedAt: '2025-02-09 14:30',

  // 关联的小程序（如果已创建）
  miniProgram: null
})

// 小程序列表（Mock数据）
const miniPrograms = ref([
  {
    miniProgramId: 'mp123',
    name: '张三的零售商城',
    icon: '/static/haidu.jpg',
    description: '一个完整的电商小程序',

    // 审核状态
    status: 'approved' as 'initializing' | 'pending_submit' | 'reviewing' | 'approved' | 'rejected' | 'suspended',
    submitTime: '2025-01-20',
    auditTime: '2025-01-22',
    rejectReason: '',
    estimatedCompletionTime: '2025-01-22',

    // 开发状态
    developmentStatus: 'developing' as 'not_started' | 'initializing' | 'configuring' | 'developing' | 'testing' | 'deploying' | 'ready',
    developmentProgress: {
      currentPhase: 3,
      totalPhases: 5,
      progress: 60,
      estimatedCompletionTime: '2025-02-20',
      phases: [
        { phase: 1, name: '环境搭建', status: 'completed' as any, progress: 100 },
        { phase: 2, name: '基础配置', status: 'completed' as any, progress: 100 },
        { phase: 3, name: '功能开发', status: 'in_progress' as any, progress: 60 },
        { phase: 4, name: '测试验收', status: 'pending' as any, progress: 0 },
        { phase: 5, name: '部署上线', status: 'pending' as any, progress: 0 }
      ]
    },

    // 功能权限
    permissions: ['view_progress', 'edit_info'],

    createdAt: '2025-01-20',
    updatedAt: '2025-02-01'
  }
])

// 获取认证状态文本
const getCertificationText = (status: string) => {
  const statusMap: Record<string, string> = {
    uncertified: '未认证',
    pending: '审核中',
    certified: '已认证',
    rejected: '已拒绝'
  }
  return statusMap[status] || '未认证'
}

// 获取主体类型文本
const getEntityTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    enterprise: '企业',
    individual: '个人',
    overseas: '境外主体'
  }
  return typeMap[type] || '未知'
}

// 获取订单状态文本
const getOrderStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    unpaid: '待支付',
    pending: '待审核',
    approved: '审核通过',
    rejected: '审核拒绝',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[status] || '未知状态'
}

// 获取审核状态文本
const getAuditStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    initializing: '初始化中',
    pending_submit: '待提交',
    reviewing: '审核中',
    approved: '已通过',
    rejected: '已拒绝',
    suspended: '已暂停'
  }
  return statusMap[status] || '未知'
}

// 获取开发状态文本
const getDevelopmentStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    not_started: '未开始',
    initializing: '初始化中',
    configuring: '配置中',
    developing: '开发中',
    testing: '测试中',
    deploying: '部署中',
    ready: '已就绪'
  }
  return statusMap[status] || '未知'
}

// 获取阶段图标
const getPhaseIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    pending: '⏸',
    in_progress: '🔨',
    completed: '✓',
    failed: '❌'
  }
  return iconMap[status] || '⏸'
}

// 计算天数差
const getDaysSince = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

// 获取资质标题
const getQualificationTitle = () => {
  if (userInfo.value.entityType === 'enterprise') {
    return '企业资质'
  } else if (userInfo.value.entityType === 'individual') {
    return '个人资质'
  } else {
    return '境外资质'
  }
}

// 获取资质描述
const getQualificationDesc = () => {
  if (userInfo.value.entityType === 'enterprise') {
    return '营业执照 + 法人身份证'
  } else if (userInfo.value.entityType === 'individual') {
    return '身份证'
  } else {
    return '商业登记证 + 证件'
  }
}

// 获取认证状态描述
const getCertificationStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    uncertified: '请先完成实名认证',
    pending: '审核中，请耐心等待',
    certified: '认证已通过',
    rejected: '认证未通过，请重新提交'
  }
  return statusMap[status] || ''
}

// 处理小程序卡片点击
const handleMiniProgramClick = (miniProgram: any) => {
  selectedMiniProgram.value = miniProgram
  showModal.value = true
  console.log('[我的] 点击小程序:', miniProgram.name, '审核状态:', miniProgram.status, '开发状态:', miniProgram.developmentStatus)
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
  selectedMiniProgram.value = null
}

// 导航方法
const goToIndex = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

// 跳转到企业详细信息页
const goToCompanyDetail = () => {
  uni.navigateTo({
    url: '/pages/profile/company-detail'
  })
}

const goToOrderList = () => {
  uni.navigateTo({
    url: '/pages/profile/orders'
  })
}

const viewOrderDetail = () => {
  uni.showToast({
    title: '订单详情开发中',
    icon: 'none'
  })
}

const goToMiniProgramList = () => {
  uni.navigateTo({
    url: '/pages/profile/mini-programs'
  })
}

const goToQualification = () => {
  uni.navigateTo({
    url: '/pages/profile/qualifications'
  })
}

const goToCustomerService = () => {
  uni.switchTab({
    url: '/pages/message/index'
  })
}

const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/profile/settings'
  })
}

const goToAbout = () => {
  // 跳转到设置页面的关于部分
  uni.navigateTo({
    url: '/pages/profile/settings'
  })
}

const contactService = () => {
  uni.showToast({
    title: '联系客服功能开发中',
    icon: 'none'
  })
}

const enterAdmin = () => {
  uni.showToast({
    title: '管理后台开发中',
    icon: 'none'
  })
  closeModal()
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 清除登录状态
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/login/index'
          })
        }, 1500)
      }
    }
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 设置导航栏标题
  uni.setNavigationBarTitle({
    title: '我的'
  })
})
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

// 用户卡片
.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
  padding-bottom: 48rpx;
  color: #ffffff;

  .user-avatar-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 24rpx;

    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.3);

      &.default {
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-placeholder {
          font-size: 56rpx;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }

    .certification-badge {
      position: absolute;
      bottom: 0;
      right: -10rpx;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 20rpx;
      white-space: nowrap;

      &.status-uncertified {
        background: rgba(255, 149, 0, 0.9);
      }

      &.status-pending {
        background: rgba(33, 150, 243, 0.9);
      }

      &.status-certified {
        background: rgba(7, 193, 96, 0.9);
      }

      &.status-rejected {
        background: rgba(255, 59, 48, 0.9);
      }
    }
  }

  .user-info {
    margin-bottom: 24rpx;

    .user-name {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 8rpx;
    }

    .user-phone {
      display: block;
      font-size: 26rpx;
      opacity: 0.8;
    }
  }

  .entity-type-wrapper {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    opacity: 0.9;

    .entity-type-action {
      margin-left: 8rpx;
    }
  }

  .qualifications-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-top: 20rpx;

    .qualification-badge {
      padding: 8rpx 16rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20rpx;
      font-size: 22rpx;
      white-space: nowrap;

      .badge-text {
        color: #fff;
      }
    }
  }
}

// 通用卡片样式
.order-card,
.mini-program-card,
.qualification-card {
  background: #ffffff;
  margin: 24rpx;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  &.empty {
    .empty-content {
      text-align: center;
      padding: 60rpx 0;

      .empty-icon {
        display: block;
        font-size: 96rpx;
        margin-bottom: 16rpx;
      }

      .empty-text {
        display: block;
        font-size: 28rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      .empty-hint {
        display: block;
        font-size: 24rpx;
        color: #ccc;
        margin-bottom: 32rpx;
      }

      .empty-action-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff;
        border: none;
        border-radius: 48rpx;
        padding: 20rpx 48rpx;
        font-size: 28rpx;
      }
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  .card-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .card-action {
    font-size: 24rpx;
    color: #667eea;
  }
}

// 订单内容
.order-content {
  .order-template {
    display: flex;
    margin-bottom: 24rpx;

    .template-icon {
      width: 96rpx;
      height: 96rpx;
      border-radius: 16rpx;
      margin-right: 24rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      &.default {
        .template-emoji {
          font-size: 56rpx;
        }
      }
    }

    .template-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .template-name {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
      }

      .category-tags {
        display: flex;
        gap: 10rpx;
        margin-bottom: 8rpx;

        .category-tag {
          font-size: 22rpx;
          color: #667eea;
          background: #e8eaf6;
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
        }
      }

      .order-no {
        font-size: 24rpx;
        color: #999;
      }

      .order-time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .order-divider {
    height: 1rpx;
    background: #f0f0f0;
    margin: 16rpx 0;
  }

  .order-payment {
    margin-bottom: 16rpx;

    .payment-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .payment-label {
        font-size: 26rpx;
        color: #666;
      }

      .payment-amount {
        font-size: 32rpx;
        font-weight: bold;
        color: #ff9500;
      }
    }
  }

  .order-status-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .order-status-badge {
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
      font-size: 24rpx;

      &.status-unpaid {
        background: #fff3e0;
        color: #ff9500;
      }

      &.status-pending {
        background: #e3f2fd;
        color: #2196f3;
      }

      &.status-approved {
        background: #f3e5f5;
        color: #9c27b0;
      }

      &.status-completed {
        background: #e8f5e9;
        color: #07c160;
      }

      &.status-rejected {
        background: #ffebee;
        color: #ff3b30;
      }
    }

    .estimated-time {
      font-size: 22rpx;
      color: #999;
    }
  }

  .order-actions {
    display: flex;
    gap: 16rpx;

    .action-btn {
      flex: 1;
      height: 64rpx;
      line-height: 64rpx;
      border-radius: 12rpx;
      font-size: 26rpx;
      text-align: center;
      border: none;

      &.secondary {
        background: #f5f5f5;
        color: #666;
      }

      &:not(.secondary) {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff;
      }
    }
  }
}

// 小程序列表
.mini-program-list {
  .mini-program-item {
    display: flex;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .mini-program-icon-wrapper {
      position: relative;
      margin-right: 24rpx;

      .mini-program-icon {
        width: 96rpx;
        height: 96rpx;
        border-radius: 16rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        &.default {
          .mini-program-emoji {
            font-size: 56rpx;
          }
        }
      }

      .status-tags {
        position: absolute;
        top: -8rpx;
        right: -8rpx;
        display: flex;
        flex-direction: column;
        gap: 4rpx;

        .status-tag {
          padding: 4rpx 8rpx;
          border-radius: 12rpx;
          font-size: 18rpx;
          white-space: nowrap;
          line-height: 1.4;

          .progress-text {
            font-size: 16rpx;
            opacity: 0.8;
          }

          &.audit {
            background: rgba(33, 150, 243, 0.9);
            color: #ffffff;

            &.status-reviewing {
              background: rgba(33, 150, 243, 0.9);
            }

            &.status-approved {
              background: rgba(7, 193, 96, 0.9);
            }

            &.status-rejected {
              background: rgba(255, 59, 48, 0.9);
            }
          }

          &.development {
            background: rgba(255, 149, 0, 0.9);
            color: #ffffff;

            &.status-not_started {
              background: rgba(153, 153, 153, 0.9);
            }

            &.status-developing {
              background: rgba(255, 149, 0, 0.9);
            }

            &.status-ready {
              background: rgba(7, 193, 96, 0.9);
            }
          }
        }
      }
    }

    .mini-program-info {
      flex: 1;

      .mini-program-name {
        display: block;
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
      }

      .mini-program-desc {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 16rpx;
      }

      .audit-info,
      .development-info,
      .ready-info {
        margin-top: 16rpx;

        .info-text {
          font-size: 24rpx;
          color: #666;
        }
      }

      .development-info {
        .progress-bar {
          width: 100%;
          height: 8rpx;
          background: #f0f0f0;
          border-radius: 4rpx;
          overflow: hidden;
          margin-bottom: 8rpx;

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff9500 0%, #ff6a00 100%);
            transition: width 0.3s;
          }
        }
      }

      .ready-info {
        .info-text {
          color: #07c160;
          font-weight: 500;
        }
      }
    }
  }
}

// 资质内容
.qualification-content {
  .qualification-item {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .qualification-icon {
      width: 48rpx;
      height: 48rpx;
      border-radius: 24rpx;
      background: #e8f5e9;
      color: #07c160;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .qualification-info {
      flex: 1;

      .qualification-title {
        display: block;
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 4rpx;
      }

      .qualification-desc {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .approved-qualifications {
    background: #f5f5f5;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;

    .approved-title {
      display: block;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 12rpx;
    }

    .approved-list {
      display: flex;
      flex-direction: column;
      gap: 10rpx;

      .approved-item {
        background: #fff;
        padding: 12rpx 16rpx;
        border-radius: 8rpx;

        .approved-item-text {
          font-size: 24rpx;
          color: #07c160;
        }
      }
    }
  }

  .certification-status-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .certification-status {
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
      font-size: 24rpx;

      &.status-uncertified {
        background: #fff3e0;
        color: #ff9500;
      }

      &.status-pending {
        background: #e3f2fd;
        color: #2196f3;
      }

      &.status-certified {
        background: #e8f5e9;
        color: #07c160;
      }

      &.status-rejected {
        background: #ffebee;
        color: #ff3b30;
      }
    }

    .certification-time {
      font-size: 22rpx;
      color: #999;
    }
  }
}

// 菜单列表
.menu-list {
  background: #ffffff;
  margin: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      font-size: 40rpx;
      margin-right: 24rpx;
    }

    .menu-content {
      flex: 1;

      .menu-title {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 4rpx;
      }

      .menu-desc {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
    }

    .menu-action {
      font-size: 28rpx;
      color: #ccc;
    }
  }
}

// 退出登录
.logout-wrapper {
  padding: 24rpx;

  .logout-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #ffffff;
    color: #ff3b30;
    border: none;
    border-radius: 16rpx;
    font-size: 28rpx;
    text-align: center;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  }
}

// 弹窗样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 40rpx;
}

.modal-content {
  width: 100%;
  max-width: 600rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;

  .modal-body {
    padding: 40rpx;

    .modal-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      text-align: center;
      margin-bottom: 24rpx;
    }

    .modal-divider {
      height: 1rpx;
      background: #f0f0f0;
      margin: 24rpx 0;
    }

    .status-large {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40rpx 0;

      .status-icon {
        font-size: 96rpx;
        margin-bottom: 16rpx;
      }

      .status-label {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;

        &.developing {
          color: #ff9500;
        }
      }
    }

    .modal-info {
      margin: 32rpx 0;

      .info-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16rpx;

        .info-label {
          font-size: 26rpx;
          color: #666;
        }

        .info-value {
          font-size: 26rpx;
          color: #333;
          font-weight: 500;
        }
      }

      .modal-hint {
        display: block;
        text-align: center;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 16rpx;
      }
    }

    .modal-desc {
      background: #f5f5f5;
      border-radius: 12rpx;
      padding: 24rpx;
      margin: 24rpx 0;

      .desc-title {
        display: block;
        font-size: 26rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 16rpx;
      }

      .desc-text {
        display: block;
        font-size: 24rpx;
        color: #666;
        line-height: 1.6;
        margin-bottom: 8rpx;
      }
    }

    .phases-list {
      margin: 24rpx 0;

      .phase-item {
        display: flex;
        align-items: center;
        padding: 16rpx 0;

        .phase-icon {
          font-size: 32rpx;
          margin-right: 16rpx;
        }

        .phase-name {
          flex: 1;
          font-size: 26rpx;
          color: #333;
        }

        .phase-percent {
          font-size: 24rpx;
          color: #666;
        }

        &.phase-completed {
          .phase-name {
            color: #07c160;
          }
        }

        &.phase-in_progress {
          .phase-name {
            color: #ff9500;
            font-weight: 500;
          }
        }
      }
    }

    .ready-content {
      text-align: center;
      padding: 20rpx 0;

      .ready-icon {
        font-size: 96rpx;
        color: #07c160;
        margin-bottom: 24rpx;
      }

      .ready-title {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 32rpx;
      }

      .ready-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8rpx;
        margin-bottom: 32rpx;

        .ready-time,
        .ready-status {
          font-size: 24rpx;
          color: #666;
        }
      }

      .ready-features {
        background: #f5f5f5;
        border-radius: 12rpx;
        padding: 24rpx;
        text-align: left;

        .features-title {
          display: block;
          font-size: 26rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 16rpx;
        }

        .feature-item {
          display: block;
          font-size: 24rpx;
          color: #666;
          line-height: 1.8;
        }
      }
    }

    .modal-actions {
      display: flex;
      gap: 16rpx;
      margin-top: 32rpx;

      .modal-btn {
        flex: 1;
        height: 72rpx;
        line-height: 72rpx;
        border-radius: 12rpx;
        font-size: 28rpx;
        text-align: center;
        border: none;

        &.secondary {
          background: #f5f5f5;
          color: #666;
        }

        &:not(.secondary):not(.primary) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
        }

        &.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
