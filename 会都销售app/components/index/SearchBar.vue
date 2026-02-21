<template>
  <view class="search-container">
    <view class="search-box">
      <text class="scan-icon">📷</text>
      <input
        class="search-input"
        type="text"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
      />
      <text class="camera-icon">📷</text>
      <view class="search-btn" @tap="handleSearch">{{ searchBtnText }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  searchBtnText?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索小程序模板',
  searchBtnText: '搜索'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value)
}

const handleSearch = () => {
  emit('search', props.modelValue || '')
}
</script>

<style scoped lang="scss">
.search-container {
  background: transparent;
  padding: 20rpx 30rpx;

  .search-box {
    display: flex;
    align-items: center;
    height: 64rpx;
    background-color: #ffffff;
    border-radius: 32rpx;
    padding: 0 24rpx;
    gap: 12rpx;

    .scan-icon {
      font-size: 32rpx;
      color: #999;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .camera-icon {
      font-size: 32rpx;
      color: #999;
    }

    .search-btn {
      padding: 8rpx 20rpx;
      background: linear-gradient(135deg, #ff9500 0%, #ff6a00 100%);
      color: #ffffff;
      font-size: 26rpx;
      border-radius: 20rpx;
      font-weight: 500;

      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>
