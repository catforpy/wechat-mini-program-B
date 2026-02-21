<template>
  <view class="contact-person-info">
    <!-- 自动识别提示 -->
    <view v-if="autoName || autoPhone" class="auto-tip">
      <view class="tip-content">
        <text class="tip-icon">✓</text>
        <text class="tip-text">已自动识别当前账号的实名信息</text>
      </view>
    </view>

    <!-- 姓名 -->
    <view class="form-item">
      <view class="item-label">
        <text>姓名</text>
        <text class="required">*</text>
        <text v-if="autoName" class="auto-tag">已识别</text>
      </view>
      <input
        class="item-input"
        placeholder="请输入联系人姓名"
        v-model="localData.name"
        placeholder-class="input-placeholder"
      />
    </view>

    <!-- 手机号 -->
    <view class="form-item">
      <view class="item-label">
        <text>手机号</text>
        <text class="required">*</text>
        <text v-if="autoPhone" class="auto-tag">已识别</text>
      </view>
      <input
        class="item-input"
        type="number"
        maxlength="11"
        placeholder="请输入联系人手机号"
        v-model="localData.phone"
        placeholder-class="input-placeholder"
      />
    </view>

    <!-- 身份证号 -->
    <view class="form-item">
      <view class="item-label">
        <text>身份证号</text>
        <text class="required">*</text>
      </view>
      <input
        class="item-input"
        type="idcard"
        maxlength="18"
        placeholder="请输入联系人身份证号"
        v-model="localData.idCard"
        placeholder-class="input-placeholder"
      />
    </view>

    <!-- 提示信息 -->
    <view class="tips-section">
      <view class="tips-item">
        <text class="tips-icon">ℹ</text>
        <text class="tips-text">超级联系人为该主体的主要联系人，接收重要通知</text>
      </view>
      <view class="tips-item">
        <text class="tips-icon">ℹ</text>
        <text class="tips-text">请确保联系方式真实有效，以便我们联系您</text>
      </view>
      <view class="tips-item">
        <text class="tips-icon">ℹ</text>
        <text class="tips-text">如需变更联系人，可在提交前修改信息</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

// 数据接口
export interface ContactInfo {
  name: string
  phone: string
  idCard: string
}

// Props
interface Props {
  autoName?: string
  autoPhone?: string
  modelValue: ContactInfo
}

const props = withDefaults(defineProps<Props>(), {
  autoName: '',
  autoPhone: ''
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: ContactInfo]
}>()

// 本地数据
const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 监听自动识别的信息变化
watch(() => props.autoName, (newName) => {
  if (newName && !localData.value.name) {
    localData.value.name = newName
  }
}, { immediate: true })

watch(() => props.autoPhone, (newPhone) => {
  if (newPhone && !localData.value.phone) {
    localData.value.phone = newPhone
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.contact-person-info {
  // 自动识别提示
  .auto-tip {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 12rpx;
    padding: 20rpx 24rpx;
    margin-bottom: 30rpx;
    border-left: 4rpx solid #667eea;

    .tip-content {
      display: flex;
      align-items: center;

      .tip-icon {
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
      }

      .tip-text {
        font-size: 26rpx;
        color: #667eea;
      }
    }
  }

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

      .auto-tag {
        margin-left: 12rpx;
        padding: 4rpx 12rpx;
        background: rgba(102, 126, 234, 0.1);
        border-radius: 8rpx;
        font-size: 22rpx;
        color: #667eea;
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

    .input-placeholder {
      color: #999;
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
