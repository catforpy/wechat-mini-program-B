<template>
  <view class="orders-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">我的订单</view>
      </view>
    </view>

    <!-- 订单筛选标签 -->
    <view class="order-tabs">
      <view
        v-for="tab in orderTabs"
        :key="tab.value"
        :class="['order-tab', { active: activeTab === tab.value }]"
        @tap="switchTab(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view v-if="filteredOrders.length === 0" class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无订单</text>
      </view>

      <view
        v-for="order in filteredOrders"
        :key="order.orderNo"
        class="order-item"
        @tap="viewOrderDetail(order)"
      >
        <!-- 订单头部 -->
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <text :class="['order-status', `status-${order.status}`]">
            {{ getOrderStatusText(order.status) }}
          </text>
        </view>

        <!-- 订单内容 -->
        <view class="order-content">
          <view class="template-icon">
            <image v-if="order.templateIcon" :src="order.templateIcon" class="icon-img" />
            <text v-else class="icon-emoji">{{ order.emoji || '📦' }}</text>
          </view>

          <view class="template-info">
            <text class="template-name">{{ order.templateName }}</text>
            <view class="template-meta">
              <text class="category-text">{{ order.categoryName }} > {{ order.subCategoryName }}</text>
              <text class="order-time">{{ formatTime(order.createTime) }}</text>
            </view>
          </view>

          <view class="order-amount">
            <text class="amount-text">¥{{ (order.orderAmount / 100).toFixed(2) }}</text>
          </view>
        </view>

        <!-- 订单底部 -->
        <view class="order-footer">
          <text class="footer-tip">{{ getOrderFooterTip(order) }}</text>
          <view class="order-actions">
            <button v-if="order.status === 'unpaid'" class="action-btn primary" @tap.stop="payOrder(order)">
              立即支付
            </button>
            <button v-if="order.status === 'unpaid'" class="action-btn" @tap.stop="cancelOrder(order)">
              取消订单
            </button>
            <button class="action-btn" @tap.stop="contactService(order)">
              联系客服
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)
const activeTab = ref('all')

// 订单筛选标签
const orderTabs = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'unpaid' },
  { label: '待审核', value: 'pending' },
  { label: '已完成', value: 'completed' }
]

// 订单列表
const orders = ref([
  {
    orderNo: 'ORDER20250209001',
    templateName: '零售电商小程序',
    templateIcon: '/static/haidu.jpg',
    emoji: '🏪',
    categoryName: '电商',
    subCategoryName: '零售',
    orderAmount: 279900, // 分
    status: 'pending',
    createTime: '2025-02-09 10:30:00',
    estimatedCompletionTime: '2025-02-12'
  },
  {
    orderNo: 'ORDER20250208001',
    templateName: '在线教育小程序',
    templateIcon: '/static/daguan.png',
    emoji: '📚',
    categoryName: '教育',
    subCategoryName: '在线培训',
    orderAmount: 279900,
    status: 'approved',
    createTime: '2025-02-08 15:20:00',
    estimatedCompletionTime: '2025-02-11'
  },
  {
    orderNo: 'ORDER20250207001',
    templateName: '餐饮外卖小程序',
    templateIcon: '',
    emoji: '🍔',
    categoryName: '餐饮',
    subCategoryName: '外卖配送',
    orderAmount: 239900,
    status: 'completed',
    createTime: '2025-02-07 09:15:00',
    estimatedCompletionTime: '2025-02-09'
  },
  {
    orderNo: 'ORDER20250206001',
    templateName: '美容美发小程序',
    templateIcon: '',
    emoji: '💇',
    categoryName: '生活服务',
    subCategoryName: '美容美发',
    orderAmount: 179900,
    status: 'completed',
    createTime: '2025-02-06 14:45:00',
    estimatedCompletionTime: '2025-02-08'
  }
])

// 根据状态筛选订单
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === activeTab.value)
})

// 切换标签
const switchTab = (tab: string) => {
  activeTab.value = tab
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

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}

// 获取订单底部提示
const getOrderFooterTip = (order: any) => {
  if (order.status === 'unpaid') {
    return '请在30分钟内完成支付'
  } else if (order.status === 'pending') {
    return '预计1-3个工作日完成审核'
  } else if (order.status === 'approved') {
    return `预计完成时间：${order.estimatedCompletionTime}`
  } else if (order.status === 'completed') {
    return '小程序已生成，请前往管理后台'
  } else if (order.status === 'rejected') {
    return '审核未通过，请查看原因并重新提交'
  }
  return ''
}

// 查看订单详情
const viewOrderDetail = (order: any) => {
  uni.showToast({
    title: '查看订单详情',
    icon: 'none'
  })
  // TODO: 跳转到订单详情页
  // uni.navigateTo({
  //   url: `/pages/profile/order-detail?orderNo=${order.orderNo}`
  // })
}

// 支付订单
const payOrder = (order: any) => {
  uni.showToast({
    title: '调起支付',
    icon: 'none'
  })
  // TODO: 调用支付接口
}

// 取消订单
const cancelOrder = (order: any) => {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消该订单吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用取消订单接口
        uni.showToast({
          title: '订单已取消',
          icon: 'success'
        })
      }
    }
  })
}

// 联系客服
const contactService = (order: any) => {
  uni.switchTab({
    url: '/pages/message/index'
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.orders-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
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
    height: 88rpx;
    padding: 0 20rpx;
    position: relative;
  }

  .nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .back-icon {
      font-size: 40rpx;
      color: #fff;
      font-weight: bold;
    }
  }

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
    margin-right: 60rpx;
  }
}

// 订单筛选标签
.order-tabs {
  position: fixed;
  top: calc(var(--status-bar-height) + 88rpx);
  left: 0;
  right: 0;
  display: flex;
  background: #fff;
  padding: 20rpx 30rpx;
  gap: 20rpx;
  z-index: 999;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .order-tab {
    padding: 12rpx 32rpx;
    background: #f5f5f5;
    border-radius: 40rpx;
    font-size: 28rpx;
    color: #666;
    white-space: nowrap;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-weight: 500;
    }
  }
}

// 订单列表
.order-list {
  padding: 220rpx 30rpx 30rpx;
}

.order-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

// 订单头部
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .order-no {
    font-size: 26rpx;
    color: #999;
  }

  .order-status {
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    font-weight: 500;

    &.status-unpaid {
      background: #fff3e0;
      color: #ff9800;
    }

    &.status-pending {
      background: #e3f2fd;
      color: #2196f3;
    }

    &.status-approved {
      background: #f3e5f5;
      color: #9c27b0;
    }

    &.status-rejected {
      background: #ffebee;
      color: #f44336;
    }

    &.status-completed {
      background: #e8f5e9;
      color: #07c160;
    }
  }
}

// 订单内容
.order-content {
  display: flex;
  align-items: center;
  padding: 20rpx 0;

  .template-icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 16rpx;
    overflow: hidden;
    flex-shrink: 0;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-img {
      width: 100%;
      height: 100%;
    }

    .icon-emoji {
      font-size: 60rpx;
    }
  }

  .template-info {
    flex: 1;
    padding: 0 20rpx;

    .template-name {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
    }

    .template-meta {
      display: flex;
      flex-direction: column;
      gap: 8rpx;

      .category-text {
        font-size: 24rpx;
        color: #666;
        background: #f5f5f5;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
        align-self: flex-start;
      }

      .order-time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .order-amount {
    .amount-text {
      font-size: 36rpx;
      font-weight: bold;
      color: #ff5722;
    }
  }
}

// 订单底部
.order-footer {
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;

  .footer-tip {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 20rpx;
  }

  .order-actions {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;

    .action-btn {
      padding: 16rpx 32rpx;
      border-radius: 40rpx;
      font-size: 28rpx;
      background: #fff;
      border: 1rpx solid #ddd;
      color: #666;

      &.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: transparent;
        color: #fff;
      }
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
