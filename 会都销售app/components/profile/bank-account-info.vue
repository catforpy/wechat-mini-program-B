<template>
  <view class="bank-account-info">
    <!-- 个人主体时可以选择使用法人账户 -->
    <view class="form-item" v-if="entityType === '个人'">
      <view class="item-label">账户类型</view>
      <view class="account-type-selector">
        <view
          class="type-option"
          :class="{ active: !localData.isLegalPersonAccount }"
          @tap="selectAccountType(false)"
        >
          <text class="type-text">对公账户</text>
          <view v-if="!localData.isLegalPersonAccount" class="type-check">✓</view>
        </view>
        <view
          class="type-option"
          :class="{ active: localData.isLegalPersonAccount }"
          @tap="selectAccountType(true)"
        >
          <text class="type-text">法人个人账户</text>
          <view v-if="localData.isLegalPersonAccount" class="type-check">✓</view>
        </view>
      </view>
    </view>

    <!-- 开户名称/账户名称 -->
    <view class="form-item">
      <view class="item-label">
        <text>{{ getAccountNameLabel }}</text>
        <text class="required">*</text>
      </view>
      <input
        class="item-input"
        :placeholder="getAccountNamePlaceholder"
        v-model="localData.accountName"
        placeholder-class="input-placeholder"
      />
    </view>

    <!-- 银行账号 -->
    <view class="form-item">
      <view class="item-label">
        <text>{{ getAccountNumberLabel }}</text>
        <text class="required">*</text>
      </view>
      <input
        class="item-input"
        type="number"
        :placeholder="getAccountNumberPlaceholder"
        v-model="localData.accountNumber"
        placeholder-class="input-placeholder"
      />
    </view>

    <!-- 开户银行 -->
    <view class="form-item">
      <view class="item-label">
        <text>开户银行</text>
        <text class="required">*</text>
      </view>
      <picker mode="selector" :range="banks" @change="onBankChange">
        <view class="picker-value" :class="{ 'placeholder': !localData.bankName }">
          {{ localData.bankName || '请选择开户银行' }}
          <text class="picker-arrow" v-if="!localData.bankName">›</text>
        </view>
      </picker>
    </view>

    <!-- 开户支行/网点 -->
    <view class="form-item">
      <view class="item-label">
        <text>{{ getBranchLabel }}</text>
        <text class="required">*</text>
      </view>
      <input
        class="item-input"
        :placeholder="getBranchPlaceholder"
        v-model="localData.bankBranch"
        placeholder-class="input-placeholder"
      />
    </view>

    <!-- 提示信息 -->
    <view class="tips-section">
      <view class="tips-item">
        <text class="tips-icon">ℹ</text>
        <text class="tips-text">对公账户信息为选填项，但开通小程序时必须完善</text>
      </view>
      <view class="tips-item" v-if="entityType === '个人'">
        <text class="tips-icon">ℹ</text>
        <text class="tips-text">个体工商户可选择对公账户或法人个人账户</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 数据接口
export interface BankInfo {
  accountName: string
  accountNumber: string
  bankName: string
  bankBranch: string
  isLegalPersonAccount: boolean // 个人主体时可以选择法人账户
}

// Props
interface Props {
  entityType: '企业' | '个人' | '境外'
  modelValue: BankInfo
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: BankInfo]
}>()

// 本地数据
const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 银行列表
const banks = [
  '中国工商银行',
  '中国农业银行',
  '中国银行',
  '中国建设银行',
  '交通银行',
  '中国邮政储蓄银行',
  '招商银行',
  '浦发银行',
  '中信银行',
  '中国光大银行',
  '华夏银行',
  '中国民生银行',
  '平安银行',
  '兴业银行',
  '广发银行',
  '其他银行'
]

// 选择账户类型（个人主体时）
const selectAccountType = (isLegalPersonAccount: boolean) => {
  localData.value = {
    ...localData.value,
    isLegalPersonAccount
  }

  // 切换时清空账户信息
  localData.value.accountName = ''
  localData.value.accountNumber = ''
}

// 选择银行
const onBankChange = (e: any) => {
  localData.value.bankName = banks[e.detail.value]
}

// 计算各种标签和提示文字
const getAccountNameLabel = computed(() => {
  if (props.entityType === '个人' && localData.value.isLegalPersonAccount) {
    return '账户名称'
  } else {
    return '开户名称'
  }
})

const getAccountNamePlaceholder = computed(() => {
  if (props.entityType === '个人' && localData.value.isLegalPersonAccount) {
    return '请输入账户名称（法人姓名）'
  } else {
    return '请输入开户名称（企业全称）'
  }
})

const getAccountNumberLabel = computed(() => {
  if (props.entityType === '个人' && localData.value.isLegalPersonAccount) {
    return '银行账号'
  } else {
    return '银行账号'
  }
})

const getAccountNumberPlaceholder = computed(() => {
  return '请输入银行账号'
})

const getBranchLabel = computed(() => {
  if (props.entityType === '个人' && localData.value.isLegalPersonAccount) {
    return '开户网点'
  } else {
    return '开户支行'
  }
})

const getBranchPlaceholder = computed(() => {
  if (props.entityType === '个人' && localData.value.isLegalPersonAccount) {
    return '请输入开户网点名称'
  } else {
    return '请输入开户支行名称'
  }
})
</script>

<style scoped lang="scss">
.bank-account-info {
  .form-item {
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .item-label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 16rpx;
      display: flex;
      align-items: center;

      .required {
        color: #ff3b30;
        margin-left: 4rpx;
      }
    }

    .item-input {
      width: 100%;
      height: 80rpx;
      background: #f8f8f8;
      border-radius: 12rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
      box-sizing: border-box;
    }

    .picker-value {
      width: 100%;
      height: 80rpx;
      background: #f8f8f8;
      border-radius: 12rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;

      &.placeholder {
        color: #999;
      }

      .picker-arrow {
        font-size: 32rpx;
        font-weight: 300;
      }
    }

    .input-placeholder {
      color: #999;
    }

    // 账户类型选择器
    .account-type-selector {
      display: flex;
      gap: 20rpx;

      .type-option {
        flex: 1;
        height: 80rpx;
        background: #f8f8f8;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border: 2rpx solid transparent;
        transition: all 0.3s;

        .type-text {
          font-size: 26rpx;
          color: #666;
        }

        .type-check {
          position: absolute;
          top: -10rpx;
          right: -10rpx;
          width: 32rpx;
          height: 32rpx;
          background: #667eea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20rpx;
          color: #fff;
        }

        &.active {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);

          .type-text {
            color: #667eea;
            font-weight: 600;
          }
        }

        &:active {
          opacity: 0.7;
        }
      }
    }
  }

  // 提示信息
  .tips-section {
    margin-top: 30rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .tips-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .tips-icon {
        width: 32rpx;
        height: 32rpx;
        background: #667eea;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
        color: #fff;
        margin-right: 12rpx;
        flex-shrink: 0;
      }

      .tips-text {
        flex: 1;
        font-size: 24rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}
</style>
