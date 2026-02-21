<template>
  <view class="content-container">
    <!-- 左侧悬浮按钮（触发二级菜单） -->
    <view
      class="floating-trigger"
      :class="{ 'menu-open': isOpen }"
      @click="toggleMenu"
    >
      <text class="trigger-icon">{{ isOpen ? '‹' : '›' }}</text>
    </view>

    <!-- 二级类目弹出面板 -->
    <view
      :class="['second-level-panel', { show: isOpen }]"
      @click="handlePanelClick"
    >
      <view class="panel-content" @click.stop>
        <scroll-view
          scroll-y
          class="panel-scroll"
          :show-scrollbar="false"
          @touchstart.stop
          @touchmove.stop
          @touchend.stop
          @touchcancel.stop
        >
          <view
            v-for="(category, index) in categories"
            :key="index"
            :class="['panel-item', { active: currentIndex === index }]"
            @click="handleCategoryChange(index)"
          >
            {{ category.name }}
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 右侧主内容插槽 -->
    <view :class="['main-content', { 'shift-right': isOpen }]">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Category {
  name: string
  [key: string]: any
}

interface Props {
  categories: Category[]
  modelValue: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const isOpen = ref(false)
const currentIndex = ref(props.modelValue)

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  currentIndex.value = newVal
})

// 监听内部值变化，同步到外部
watch(currentIndex, (newVal) => {
  emit('update:modelValue', newVal)
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handlePanelClick = () => {
  isOpen.value = false
}

const handleCategoryChange = (index: number) => {
  currentIndex.value = index
  isOpen.value = false
}
</script>

<style scoped lang="scss">
.content-container {
  position: relative;
  display: flex;
  height: calc(100vh - 520rpx);
}

// 左侧悬浮触发按钮
.floating-trigger {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1rpx solid #e0e0e0;
  border-left: none;
  border-radius: 0 16rpx 16rpx 0;
  padding: 16rpx 8rpx;
  box-shadow: 2rpx 0 8rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &.menu-open {
    transform: translateY(-50%) translateX(180rpx);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);

    &.menu-open {
      transform: translateY(-50%) translateX(180rpx) scale(0.95);
    }
  }

  .trigger-icon {
    font-size: 28rpx;
    color: #666;
    font-weight: bold;
  }
}

// 二级类目弹出面板
.second-level-panel {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 180rpx;
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;

  &.show {
    opacity: 1;
    visibility: visible;
  }

  .panel-content {
    width: 180rpx;
    height: 100%;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  &.show .panel-content {
    transform: translateX(0);
  }

  .panel-scroll {
    flex: 1;
    overflow-y: auto;
  }

  .panel-item {
    padding: 32rpx 20rpx;
    font-size: 26rpx;
    color: #666;
    text-align: center;
    border-left: 4rpx solid transparent;
    transition: all 0.3s;

    &.active {
      background-color: #ffffff;
      color: #333;
      font-weight: bold;
      border-left-color: #667eea;
    }
  }
}

// 右侧主内容
.main-content {
  width: 100%;
  margin-left: 0;
  transition: margin-left 0.3s;
  background-color: #ffffff;

  &.shift-right {
    margin-left: 180rpx;
  }
}
</style>
