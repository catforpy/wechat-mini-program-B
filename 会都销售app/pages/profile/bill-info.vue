<template>
  <view class="bill-info-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">账目信息</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 账目列表 -->
      <view class="bill-list">
        <template v-for="bill in billList" :key="bill.id">
          <!-- 时间分隔符 -->
          <view class="time-divider">
            <text class="time-text">{{ formatTimeDisplay(bill.time) }}</text>
          </view>

          <view class="bill-card" @tap="viewBillDetail(bill)">
          <!-- 提现模板 -->
          <template v-if="bill.type === 'withdraw'">
            <!-- 标题（左对齐） -->
            <view class="bill-title">{{ bill.title }}</view>

            <!-- 来源（灰色小字，居中）-->
            <view class="bill-source">{{ bill.source }}</view>

            <!-- 金额（大字，居中）-->
            <view class="bill-amount">{{ bill.amount }}</view>

            <!-- 提现银行（左对齐标签 + 页面居中内容）-->
            <view class="bill-row">
              <text class="bill-label">提现银行：</text>
              <text class="bill-value">{{ bill.bank }}</text>
            </view>

            <!-- 提现时间（左对齐标签 + 页面居中内容）-->
            <view class="bill-row">
              <text class="bill-label">提现时间：</text>
              <text class="bill-value">{{ bill.withdrawTime }}</text>
            </view>

            <!-- 预计到账时间（左对齐标签 + 页面居中内容）-->
            <view class="bill-row">
              <text class="bill-label">预计到账时间：</text>
              <text class="bill-value">{{ bill.expectTime }}</text>
            </view>
          </template>

          <!-- 商户支付模板 -->
          <template v-else-if="bill.type === 'payment'">
            <!-- 第1行：头像 + 店铺名称 -->
            <view class="payment-header">
              <image v-if="bill.avatar" :src="bill.avatar" mode="aspectFill" class="payment-avatar" />
              <view v-else class="payment-avatar default">
                <text class="avatar-placeholder">{{ bill.shopName?.charAt(0) || '店' }}</text>
              </view>
              <text class="shop-name">{{ bill.shopName }}</text>
            </view>

            <!-- 第2行：使用支付方式 -->
            <view class="payment-method">{{ bill.paymentMethod }}</view>

            <!-- 第3行：金额 -->
            <view class="bill-amount">{{ bill.amount }}</view>

            <!-- 第4行：交易状态 -->
            <view class="payment-status">
              <text>{{ bill.status }}</text>
              <text v-if="bill.subStatus" class="sub-status">{{ bill.subStatus }}</text>
            </view>

            <!-- 第5行：查看账单详情 -->
            <view class="menu-row">
              <text class="menu-label">查看账单详情</text>
              <text class="menu-arrow">›</text>
            </view>

            <!-- 第6行：查看名片 -->
            <view class="menu-row" @tap.stop="viewCard(bill)">
              <text class="menu-label">查看名片</text>
              <text class="menu-arrow">›</text>
            </view>

            <!-- 第7行：进入小程序 -->
            <view class="menu-row" @tap.stop="openMiniProgram(bill)">
              <text class="menu-label">进入小程序</text>
              <text class="menu-arrow">›</text>
            </view>
          </template>
          </view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatTimeDisplay } from '@/utils/timeFormat'

// 状态栏高度
const statusBarHeight = ref(0)

// 账目数据接口
interface Bill {
  id: string
  type: 'withdraw' | 'payment'
  // 提现模板
  title?: string
  source?: string
  amount: string
  bank?: string
  withdrawTime?: string
  expectTime?: string
  // 商户支付模板
  avatar?: string
  shopName?: string
  paymentMethod?: string
  status?: string
  subStatus?: string
  time: string
}

// 模拟账目数据 - 两个模板
const billList = ref<Bill[]>([
  // 提现模板
  {
    id: '1',
    type: 'withdraw',
    title: '零钱提现',
    source: '零钱提现',
    amount: '500.00',
    bank: '招商银行（尾号8086）',
    withdrawTime: '2026-02-13 19:42:10',
    expectTime: '2026-02-13 20:42:10',
    time: '2026-02-13 19:42:10'
  },
  // 商户支付模板
  {
    id: '2',
    type: 'payment',
    shopName: '唐极课得旗舰店',
    paymentMethod: '微信支付',
    amount: '128.00',
    status: '交易成功',
    subStatus: '对方已收款',
    time: '2026-02-14 15:30:00'
  }
])

// 查看账目详情
const viewBillDetail = (bill: Bill) => {
  // 构建详情页数据结构
  let detailData: any = {
    type: bill.type
  }

  if (bill.type === 'payment') {
    // 支付类型数据
    detailData = {
      type: 'payment',
      shopName: bill.shopName,
      amount: bill.amount,
      status: bill.status,
      paymentTime: bill.time,
      product: bill.shopName,
      merchantName: `${bill.shopName}（全称）`,
      institution: '福建国通支付驿网络科技有限公司',
      paymentMethod: bill.paymentMethod,
      transactionNo: `20260214${Date.now()}`,
      merchantNo: `20260207CC${Date.now()}`
    }
  } else if (bill.type === 'withdraw') {
    // 提现类型数据
    detailData = {
      type: 'withdraw',
      title: bill.title,
      amount: bill.amount,
      status: '提现成功',
      withdrawAmount: bill.amount,
      serviceFee: '0.00',
      applyTime: bill.withdrawTime,
      arrivalTime: bill.expectTime,
      bank: bill.bank,
      withdrawNo: `4200000${Date.now()}`
    }
  }

  // 使用 eventChannel 传递数据
  uni.navigateTo({
    url: '/pages/profile/bill-detail',
    success: (res) => {
      // 通过 eventChannel 传递数据
      res.eventChannel.emit('billDetailData', detailData)
    }
  })
}

// 查看名片
const viewCard = (bill: Bill) => {
  uni.showToast({
    title: '查看名片',
    icon: 'none'
  })
}

// 进入小程序
const openMiniProgram = (bill: Bill) => {
  uni.showToast({
    title: '进入小程序',
    icon: 'none'
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
.bill-info-page {
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
}

// 账目列表
.bill-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

// 账目卡片
.bill-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.12);
  }
}

// 标题（左对齐）
.bill-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  text-align: left;
}

// 来源（灰色小字，居中）
.bill-source {
  font-size: 26rpx;
  color: #666;
  text-align: center;
}

// 金额（大字，居中）
.bill-amount {
  font-size: 56rpx;
  font-weight: bold;
  color: #ff4d4f;
  text-align: center;
}

// 交易状态
.payment-status {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16rpx;

  .sub-status {
    font-size: 24rpx;
    color: #999;
  }
}

// 头像 + 店铺名称
.payment-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.payment-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-placeholder {
  font-size: 40rpx;
  color: #fff;
  font-weight: 600;
}

.shop-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
}

// 使用支付方式
.payment-method {
  font-size: 26rpx;
  color: #666;
  text-align: center;
  margin-bottom: 16rpx;
}

// 菜单行（左对齐标签 + 右对齐箭头）
.menu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.menu-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 32rpx;
  color: #ccc;
  font-weight: 300;
}

// 行布局（左侧标签左对齐，右侧内容页面居中）
.bill-row {
  position: relative;
  padding-left: 0;
  display: flex;
  align-items: center;
}

// 标签（左对齐）
.bill-label {
  font-size: 26rpx;
  color: #666;
  flex-shrink: 0;
  position: absolute;
  left: 0;
}

// 内容（页面居中）
.bill-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  width: 100%;
  text-align: center;
}

// 时间分隔符
.time-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 0;
}

.time-text {
  font-size: 24rpx;
  color: #999;
  background: #e8e8e8;
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
}
</style>
