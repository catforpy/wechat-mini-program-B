<template>
  <view class="funds-flow-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">资金流水</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 资金流水列表 -->
      <view class="flow-list">
        <view
          v-for="flow in flowList"
          :key="flow.id"
          class="flow-card"
          @tap="viewFlowDetail(flow)"
        >
          <!-- 流水类型 + 金额（同一行） -->
          <view class="flow-header">
            <text class="flow-type">{{ flow.type }}</text>
            <view class="flow-amount" :class="{ income: flow.isIncome, expense: !flow.isIncome }">
              <text class="amount-symbol">{{ flow.isIncome ? '+' : '-' }}</text>
              <text class="amount-value">{{ flow.amount }}</text>
            </view>
          </view>

          <!-- 流水详情 -->
          <view class="flow-details">
            <view class="detail-item">
              <text class="detail-label">交易时间</text>
              <text class="detail-value">{{ flow.transactionTime }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">交易状态</text>
              <text class="detail-value status" :class="flow.status">{{ flow.statusText }}</text>
            </view>
            <view class="detail-item" v-if="flow.remark">
              <text class="detail-label">备注</text>
              <text class="detail-value remark">{{ flow.remark }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="flow-actions">
            <view class="action-btn primary" @tap.stop="viewReceipt(flow)">
              <text class="btn-text">查看凭证</text>
            </view>
            <view class="action-btn" @tap.stop="downloadRecord(flow)">
              <text class="btn-text">下载记录</text>
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
.funds-flow-page {
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
}
</style>
