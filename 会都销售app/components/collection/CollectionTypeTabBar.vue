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

watch(() => props.modelValue, (newVal) => {
  currentIndex.value = newVal
})

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
  padding: 12rpx 0;

  .type-tab-scroll {
    width: 100%;
    white-space: nowrap;
  }

  .type-tab-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 0 20rpx;
    width: 100%;
  }

  .type-tab-item {
    position: relative;
    padding: 12rpx 0;
    display: flex;
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
        color: #667eea;
        font-weight: bold;
        font-size: 32rpx;
      }
    }

    .tab-indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 48rpx;
      height: 6rpx;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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
