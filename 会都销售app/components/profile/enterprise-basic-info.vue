<template>
  <view class="enterprise-basic-info">
    <!-- 企业名称/主体名称 -->
    <view class="form-item">
      <view class="item-label">
        <text>{{ getMainLabel }}</text>
        <text class="required">*</text>
      </view>
      <input
        class="item-input"
        :placeholder="getMainPlaceholder"
        v-model="localData.name"
        placeholder-class="input-placeholder"
      />
    </view>

    <!-- 法定代表人/经营者 -->
    <view class="form-item">
      <view class="item-label">
        <text>{{ getLegalPersonLabel }}</text>
        <text class="required">*</text>
      </view>
      <input
        class="item-input"
        :placeholder="getLegalPersonPlaceholder"
        v-model="localData.legalPerson"
        placeholder-class="input-placeholder"
      />
    </view>

    <!-- 统一社会信用代码/注册号 -->
    <view class="form-item">
      <view class="item-label">
        <text>统一社会信用代码</text>
        <text class="required">*</text>
      </view>
      <input
        class="item-input"
        placeholder="请输入统一社会信用代码"
        v-model="localData.creditCode"
        placeholder-class="input-placeholder"
      />
    </view>

    <!-- 注册地址/经营场所 -->
    <view class="form-item">
      <view class="item-label">
        <text>{{ getAddressLabel }}</text>
        <text class="required">*</text>
      </view>
      <textarea
        class="item-textarea"
        :placeholder="getAddressPlaceholder"
        v-model="localData.address"
        placeholder-class="input-placeholder"
        :maxlength="200"
      />
    </view>

    <!-- 成立日期/注册日期 -->
    <view class="form-item" v-if="entityType !== '个人'">
      <view class="item-label">
        <text>成立日期</text>
        <text class="required">*</text>
      </view>
      <picker mode="date" :value="localData.registrationDate" @change="onDateChange">
        <view class="picker-value" :class="{ 'placeholder': !localData.registrationDate }">
          {{ localData.registrationDate || '请选择成立日期' }}
        </view>
      </picker>
    </view>

    <!-- 经营范围 -->
    <view class="form-item">
      <view class="item-label">
        <text>经营范围</text>
        <text class="required">*</text>
      </view>
      <textarea
        class="item-textarea"
        placeholder="请输入经营范围"
        v-model="localData.businessScope"
        placeholder-class="input-placeholder"
        :maxlength="500"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 数据接口
export interface BasicInfo {
  name: string
  legalPerson: string
  registrationDate: string
  address: string
  businessScope: string
  creditCode: string
}

// Props
interface Props {
  entityType: '企业' | '个人' | '境外'
  entitySubType?: string
  modelValue: BasicInfo
}

const props = withDefaults(defineProps<Props>(), {
  entitySubType: ''
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: BasicInfo]
}>()

// 本地数据
const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 计算各种标签和提示文字
const getMainLabel = computed(() => {
  if (props.entityType === '个人') {
    return '个体工商户名称'
  } else if (props.entityType === '境外') {
    return '境外主体名称'
  } else {
    return '企业名称'
  }
})

const getMainPlaceholder = computed(() => {
  if (props.entityType === '个人') {
    return '请输入个体工商户名称'
  } else if (props.entityType === '境外') {
    return '请输入境外主体名称'
  } else {
    return '请输入企业名称'
  }
})

const getLegalPersonLabel = computed(() => {
  if (props.entityType === '个人') {
    return '经营者姓名'
  } else {
    return '法定代表人'
  }
})

const getLegalPersonPlaceholder = computed(() => {
  if (props.entityType === '个人') {
    return '请输入经营者姓名'
  } else {
    return '请输入法定代表人姓名'
  }
})

const getAddressLabel = computed(() => {
  if (props.entityType === '个人') {
    return '经营场所'
  } else {
    return '注册地址'
  }
})

const getAddressPlaceholder = computed(() => {
  if (props.entityType === '个人') {
    return '请输入经营场所地址'
  } else {
    return '请输入注册地址'
  }
})

// 选择日期
const onDateChange = (e: any) => {
  localData.value.registrationDate = e.detail.value
}
</script>

<style scoped lang="scss">
.enterprise-basic-info {
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

    .item-textarea {
      width: 100%;
      min-height: 160rpx;
      background: #f8f8f8;
      border-radius: 12rpx;
      padding: 20rpx 24rpx;
      font-size: 28rpx;
      color: #333;
      box-sizing: border-box;
      line-height: 1.6;
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
      box-sizing: border-box;

      &.placeholder {
        color: #999;
      }
    }

    .input-placeholder {
      color: #999;
    }
  }
}
</style>
