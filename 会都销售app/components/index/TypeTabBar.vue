<template>
  <view class="type-tab-bar">
    <scroll-view
      scroll-x
      class="type-tab-scroll"
      :show-scrollbar="false"
      :scroll-with-animation="true"
      :enhanced="true"
    >
      <view class="type-tab-wrapper">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['type-tab-item', { active: currentIndex === index }]"
          @click="handleTabChange(index)"
        >
          <text class="tab-text">{{ tab.label }}</text>
          <view v-if="currentIndex === index" class="tab-indicator"></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface TypeTab {
  label: string
  value: string
}

interface Props {
  tabs: TypeTab[]
  modelValue: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [tab: TypeTab, index: number]
}>()

const currentIndex = ref(props.modelValue)

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  currentIndex.value = newVal
})

// 切换标签
const handleTabChange = (index: number) => {
  currentIndex.value = index
  emit('update:modelValue', index)
  emit('change', props.tabs[index], index)
}
</script>

<style scoped lang="scss">
.type-tab-bar {
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 20rpx 0;

  .type-tab-scroll {
    width: 100%;
    white-space: nowrap;
  }

  .type-tab-wrapper {
    display: inline-flex;
    padding: 0 30rpx;
    gap: 40rpx;
  }

  .type-tab-item {
    position: relative;
    flex-shrink: 0;
    padding: 16rpx 0;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s;

    .tab-text {
      font-size: 30rpx;
      color: #666;
      white-space: nowrap;
      transition: all 0.3s;
    }

    &.active {
      .tab-text {
        color: #ff6a00;
        font-weight: bold;
        font-size: 32rpx;
      }
    }

    .tab-indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 6rpx;
      background: linear-gradient(90deg, #ff9500 0%, #ff6a00 100%);
      border-radius: 3rpx;
      animation: indicatorSlide 0.3s ease-out;
    }
  }
}

@keyframes indicatorSlide {
  from {
    opacity: 0;
    transform: translateX(-50%) scaleX(0);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scaleX(1);
  }
}
</style>
