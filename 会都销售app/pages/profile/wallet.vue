<template>
  <view class="wallet-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">我的钱包</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 余额显示 -->
      <view class="balance-section">
        <view class="balance-card">
          <view class="balance-item">
            <text class="balance-label">都达豆</text>
            <text class="balance-value">{{ balance.douDou }}</text>
          </view>
          <view class="balance-divider">
            <text class="divider-text">10:1</text>
          </view>
          <view class="balance-item">
            <text class="balance-label">人民币</text>
            <text class="balance-value">¥{{ balance.rmb }}</text>
          </view>
        </view>
        <view class="balance-tip">
          <text class="tip-text">💡 充值比例：1元 = 10都达豆</text>
        </view>
      </view>

      <!-- 充值金额选择 -->
      <view class="recharge-section">
        <text class="section-title">选择充值金额</text>
        <view class="amount-grid">
          <view
            v-for="(item, index) in rechargeOptions"
            :key="index"
            :class="['amount-card', { selected: selectedAmountIndex === index }]"
            @tap="selectAmount(index)"
          >
            <text class="amount-price">¥{{ item.price }}</text>
            <text class="amount-dou">{{ item.douDou }}都达豆</text>
            <view v-if="item.bonus" class="bonus-tag">
              <text class="bonus-text">送{{ item.bonus }}</text>
            </view>
          </view>
        </view>

        <!-- 自定义金额 -->
        <view class="custom-amount-section">
          <text class="custom-label">自定义金额</text>
          <view class="custom-input-wrapper">
            <text class="input-prefix">¥</text>
            <input
              v-model="customAmount"
              type="digit"
              class="custom-input"
              placeholder="输入充值金额"
              @input="onCustomAmountInput"
            />
            <text class="input-suffix">元</text>
          </view>
          <view v-if="customDouDou > 0" class="custom-result">
            <text class="result-text">到账 {{ customDouDou }} 都达豆</text>
          </view>
        </view>

        <!-- 充值说明 -->
        <view class="recharge-tips">
          <text class="tips-title">充值说明：</text>
          <text class="tips-item">• 充值即时到账，永久有效</text>
          <text class="tips-item">• 1元人民币 = 10都达豆</text>
          <text class="tips-item">• 都达豆可用于购买小程序、模板等服务</text>
          <text class="tips-item">• 如有疑问请联系客服</text>
        </view>
      </view>

      <!-- 充值按钮 -->
      <view class="recharge-btn-section">
        <view class="total-display">
          <text class="total-label">充值金额：</text>
          <text class="total-value">¥{{ finalAmount }}</text>
          <text class="total-dou">（{{ finalDouDou }}都达豆）</text>
        </view>
        <view class="recharge-btn" @tap="handleRecharge">
          <text class="btn-icon">💳</text>
          <text class="btn-text">微信支付</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 余额数据
const balance = ref({
  douDou: 10000,  // 都达豆
  rmb: 1000       // 人民币
})

// 充值选项配置
interface RechargeOption {
  price: number      // 人民币价格
  douDou: number     // 都达豆数量
  bonus?: string     // 赠送标签
}

const rechargeOptions = ref<RechargeOption[]>([
  { price: 6, douDou: 60 },
  { price: 18, douDou: 180, bonus: '+10豆' },
  { price: 68, douDou: 680, bonus: '+50豆' },
  { price: 128, douDou: 1280, bonus: '+100豆' },
  { price: 328, douDou: 3280, bonus: '+300豆' },
  { price: 648, douDou: 6480, bonus: '+800豆' }
])

// 选中的金额索引
const selectedAmountIndex = ref<number>(2) // 默认选中第3个（68元）

// 自定义金额
const customAmount = ref<string>('')

// 计算自定义金额对应的都达豆
const customDouDou = computed(() => {
  const amount = parseFloat(customAmount.value)
  if (isNaN(amount) || amount <= 0) {
    return 0
  }
  return amount * 10
})

// 计算最终充值金额
const finalAmount = computed(() => {
  if (customAmount.value && parseFloat(customAmount.value) > 0) {
    return parseFloat(customAmount.value).toFixed(2)
  }
  return rechargeOptions.value[selectedAmountIndex.value].price.toFixed(2)
})

// 计算最终到账都达豆
const finalDouDou = computed(() => {
  if (customAmount.value && parseFloat(customAmount.value) > 0) {
    return customDouDou.value
  }
  return rechargeOptions.value[selectedAmountIndex.value].douDou
})

// 选择预设金额
const selectAmount = (index: number) => {
  selectedAmountIndex.value = index
  customAmount.value = '' // 清空自定义金额
}

// 自定义金额输入
const onCustomAmountInput = () => {
  // 用户输入自定义金额时，取消预设选项的选中状态
  if (customAmount.value && parseFloat(customAmount.value) > 0) {
    selectedAmountIndex.value = -1
  }
}

// 处理充值
const handleRecharge = () => {
  const amount = parseFloat(finalAmount.value)
  if (amount <= 0) {
    uni.showToast({
      title: '请选择充值金额',
      icon: 'none'
    })
    return
  }

  // 最小充值金额限制
  if (amount < 1) {
    uni.showToast({
      title: '最低充值1元',
      icon: 'none'
    })
    return
  }

  // 确认充值
  uni.showModal({
    title: '确认充值',
    content: `充值 ¥${finalAmount.value}，到账 ${finalDouDou.value} 都达豆`,
    confirmText: '确认支付',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 发起微信支付
        requestWechatPay(amount)
      }
    }
  })
}

// 请求微信支付
const requestWechatPay = (amount: number) => {
  uni.showLoading({
    title: '正在发起支付...',
    mask: true
  })

  // TODO: 调用后端API获取支付参数
  // 这里是模拟支付流程
  setTimeout(() => {
    uni.hideLoading()

    // 实际项目中应该这样调用：
    // 1. 调用后端API生成订单
    // 2. 后端返回微信支付参数
    // 3. 调用 uni.requestPayment 发起支付

    // 模拟支付参数
    const payParams = {
      // 这些参数应该从后端获取
      timeStamp: String(Math.floor(Date.now() / 1000)),
      nonceStr: Math.random().toString(36).substring(2),
      package: 'prepay_id=wx123456789',
      signType: 'MD5',
      paySign: 'mock_sign'
    }

    // 发起微信支付
    uni.requestPayment({
      provider: 'wxpay',
      ...payParams,
      success: () => {
        // 支付成功
        onPaymentSuccess(amount)
      },
      fail: (error: any) => {
        console.error('支付失败:', error)
        if (error.errMsg.includes('cancel')) {
          uni.showToast({
            title: '已取消支付',
            icon: 'none'
          })
        } else {
          // 模拟环境直接支付成功
          onPaymentSuccess(amount)
        }
      }
    })
  }, 1000)
}

// 支付成功处理
const onPaymentSuccess = (amount: number) => {
  // 更新余额
  balance.value.rmb += amount
  balance.value.douDou += amount * 10

  uni.showModal({
    title: '充值成功',
    content: `已充值 ¥${amount.toFixed(2)}，到账 ${amount * 10} 都达豆`,
    showCancel: false,
    success: () => {
      // 重置选择
      selectedAmountIndex.value = 2
      customAmount.value = ''
    }
  })
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

  // TODO: 从后端加载用户余额
  // loadUserBalance()
})
</script>

<style scoped lang="scss">
.wallet-page {
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

// 余额区域
.balance-section {
  margin-bottom: 30rpx;

  .balance-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);

    .balance-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .balance-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 8rpx;
      }

      .balance-value {
        font-size: 48rpx;
        font-weight: 700;
        color: #fff;
      }
    }

    .balance-divider {
      width: 2rpx;
      height: 60rpx;
      background: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;

      .divider-text {
        writing-mode: vertical-rl;
        font-size: 20rpx;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .balance-tip {
    margin-top: 16rpx;
    text-align: center;

    .tip-text {
      font-size: 24rpx;
      color: #999;
    }
  }
}

// 充值区域
.recharge-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }

  // 充值金额网格
  .amount-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;
    margin-bottom: 30rpx;

    .amount-card {
      position: relative;
      background: #f8f8f8;
      border: 2rpx solid transparent;
      border-radius: 16rpx;
      padding: 24rpx 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s;

      .amount-price {
        font-size: 36rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 8rpx;
      }

      .amount-dou {
        font-size: 24rpx;
        color: #666;
      }

      .bonus-tag {
        position: absolute;
        top: -10rpx;
        right: -10rpx;
        background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
        border-radius: 20rpx;
        padding: 4rpx 12rpx;

        .bonus-text {
          font-size: 20rpx;
          color: #fff;
          font-weight: 500;
        }
      }

      &.selected {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-color: #667eea;

        .amount-price {
          color: #667eea;
        }
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  // 自定义金额
  .custom-amount-section {
    border-top: 1rpx solid #f0f0f0;
    padding-top: 24rpx;

    .custom-label {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 16rpx;
      display: block;
    }

    .custom-input-wrapper {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 12rpx;
      padding: 20rpx 24rpx;
      margin-bottom: 12rpx;

      .input-prefix {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-right: 8rpx;
      }

      .custom-input {
        flex: 1;
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
      }

      .input-suffix {
        font-size: 28rpx;
        color: #999;
        margin-left: 8rpx;
      }
    }

    .custom-result {
      text-align: center;

      .result-text {
        font-size: 26rpx;
        color: #667eea;
        font-weight: 500;
      }
    }
  }

  // 充值说明
  .recharge-tips {
    margin-top: 30rpx;
    padding: 20rpx;
    background: #fffbf0;
    border-radius: 12rpx;
    border-left: 4rpx solid #ffc107;

    .tips-title {
      font-size: 26rpx;
      font-weight: 600;
      color: #ff9800;
      margin-bottom: 12rpx;
      display: block;
    }

    .tips-item {
      font-size: 24rpx;
      color: #666;
      line-height: 1.8;
      display: block;
    }
  }
}

// 充值按钮区域
.recharge-btn-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .total-display {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24rpx;
    flex-wrap: wrap;

    .total-label {
      font-size: 28rpx;
      color: #666;
      margin-right: 8rpx;
    }

    .total-value {
      font-size: 40rpx;
      font-weight: 700;
      color: #ff5722;
      margin-right: 8rpx;
    }

    .total-dou {
      font-size: 24rpx;
      color: #999;
    }
  }

  .recharge-btn {
    background: linear-gradient(135deg, #07c160 0%, #0bbd87 100%);
    border-radius: 50rpx;
    padding: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.3);
    transition: all 0.3s;

    .btn-icon {
      font-size: 40rpx;
      margin-right: 12rpx;
    }

    .btn-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
    }

    &:active {
      transform: scale(0.98);
      box-shadow: 0 4rpx 16rpx rgba(7, 193, 96, 0.3);
    }
  }
}
</style>
