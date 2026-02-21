<template>
  <view class="bill-detail-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="nav-placeholder"></view>
        <text class="nav-action" @tap="goToAllBills">全部账单</text>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 账单详情内容 -->
      <view class="detail-content">
        <!-- 核心账单卡片 -->
        <view class="bill-card">
          <!-- 支付类型模板 -->
          <template v-if="billDetail.type === 'payment'">
            <!-- 头像 -->
            <view class="shop-avatar">
              <text class="avatar-text">{{ billDetail.shopName.charAt(0) }}</text>
            </view>

            <!-- 店铺名称 -->
            <view class="shop-name">{{ billDetail.shopName }}</view>

            <!-- 金额 -->
            <view class="bill-amount">{{ billDetail.amount }}</view>

            <!-- 支付状态 -->
            <view class="payment-status">{{ billDetail.status }}</view>

            <!-- 分割线 -->
            <view class="divider-line"></view>

            <!-- 详细信息列表 -->
            <view class="info-list">
              <view class="info-item">
                <text class="info-label">支付时间</text>
                <text class="info-value">{{ billDetail.paymentTime }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">商品</text>
                <text class="info-value">{{ billDetail.product }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">商户全称</text>
                <text class="info-value">{{ billDetail.merchantName }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">收单机构</text>
                <text class="info-value">{{ billDetail.institution }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">支付方式</text>
                <text class="info-value">{{ billDetail.paymentMethod }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">交易单号</text>
                <text class="info-value transaction-no">{{ billDetail.transactionNo }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">商户单号</text>
                <text class="info-value merchant-no">{{ billDetail.merchantNo }}</text>
              </view>
            </view>
          </template>

          <!-- 提现类型模板 -->
          <template v-else-if="billDetail.type === 'withdraw'">
            <!-- 头像 -->
            <view class="shop-avatar">
              <text class="avatar-text">提</text>
            </view>

            <!-- 标题 -->
            <view class="shop-name">{{ billDetail.title }}</view>

            <!-- 金额 -->
            <view class="bill-amount">{{ billDetail.amount }}</view>

            <!-- 提现状态 -->
            <view class="payment-status">{{ billDetail.status }}</view>

            <!-- 分割线 -->
            <view class="divider-line"></view>

            <!-- 详细信息列表 -->
            <view class="info-list">
              <view class="info-item">
                <text class="info-label">提现金额</text>
                <text class="info-value">{{ billDetail.withdrawAmount }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">服务费</text>
                <text class="info-value">{{ billDetail.serviceFee }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">申请时间</text>
                <text class="info-value">{{ billDetail.applyTime }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">到账时间</text>
                <text class="info-value">{{ billDetail.arrivalTime }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">提现银行</text>
                <text class="info-value">{{ billDetail.bank }}</text>
              </view>
              <view class="info-item">
                <text class="info-label">提现单号</text>
                <text class="info-value transaction-no">{{ billDetail.withdrawNo }}</text>
              </view>
            </view>
          </template>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 账单详情数据接口 - 支付类型
interface PaymentDetail {
  type: 'payment'
  shopName: string
  amount: string
  status: string
  paymentTime: string
  product: string
  merchantName: string
  institution: string
  paymentMethod: string
  transactionNo: string
  merchantNo: string
}

// 账单详情数据接口 - 提现类型
interface WithdrawDetail {
  type: 'withdraw'
  title: string
  amount: string
  status: string
  withdrawAmount: string
  serviceFee: string
  applyTime: string
  arrivalTime: string
  bank: string
  withdrawNo: string
}

// 联合类型
type BillDetail = PaymentDetail | WithdrawDetail

// 账单详情数据
const billDetail = ref<BillDetail>({} as BillDetail)

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到全部账单
const goToAllBills = () => {
  uni.navigateTo({
    url: '/pages/profile/bill-info'
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取当前页面实例
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}

  // 优先使用 eventChannel 接收数据
  const eventChannel = currentPage.getOpenerEventChannel?.()

  if (eventChannel) {
    // 监听账单数据
    eventChannel.on('billDetailData', (data: any) => {
      console.log('通过 eventChannel 接收到的账单数据:', data)
      billDetail.value = data
    })

    // 同时也检查 URL 参数（兼容旧方式）
    if (options.data) {
      try {
        const billData = JSON.parse(decodeURIComponent(options.data as string))
        console.log('通过 URL 参数解析的账单数据:', billData)
        billDetail.value = billData
      } catch (e) {
        console.error('解析账单数据失败', e)
      }
    }
  } else {
    // 降级使用 URL 参数
    if (options.data) {
      try {
        const billData = JSON.parse(decodeURIComponent(options.data as string))
        console.log('解析后的账单数据:', billData)
        billDetail.value = billData
      } catch (e) {
        console.error('解析账单数据失败', e)
      }
    } else {
      console.log('未接收到账单数据')
    }
  }
})
</script>

<style scoped lang="scss">
.bill-detail-page {
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
    height: 88rpx;
    padding: 0 20rpx;

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

      &:active {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
      }
    }

    .nav-placeholder {
      flex: 1;
    }

    .nav-action {
      font-size: 28rpx;
      color: #fff;
      font-weight: 500;
      padding: 8rpx 16rpx;

      &:active {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8rpx;
      }
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
  padding: 20rpx 30rpx;
}

// 详情内容容器
.detail-content {
  padding: 20rpx 0;
}

// 核心账单卡片（白色无边框）
.bill-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

// 头像
.shop-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;

  .avatar-text {
    font-size: 40rpx;
    color: #fff;
    font-weight: bold;
  }
}

// 店铺名称
.shop-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 32rpx;
}

// 金额
.bill-amount {
  font-size: 56rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 32rpx;
}

// 支付状态
.payment-status {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 48rpx;
}

// 分割线
.divider-line {
  width: 100%;
  height: 1rpx;
  background: #e8e8e8;
  margin-bottom: 40rpx;
}

// 详细信息列表
.info-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.info-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 20rpx;

  .info-label {
    font-size: 26rpx;
    color: #666;
    flex-shrink: 0;
    margin-right: 40rpx;
  }

  .info-value {
    font-size: 26rpx;
    color: #333;
    flex: 1;
    text-align: right;
    word-break: break-all;

    // 交易单号和商户单号特殊样式
    &.transaction-no,
    &.merchant-no {
      color: #576b95;
      font-family: monospace;
    }
  }
}
</style>
