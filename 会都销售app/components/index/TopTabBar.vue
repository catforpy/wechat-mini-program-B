<template>
  <view class="top-tabs-container" :style="{ paddingTop: statusBarHeight + 'px' }">
    <scroll-view
      scroll-x
      class="top-tabs-scroll"
      show-scrollbar="false"
      :scroll-left="scrollLeft"
      :scroll-with-animation="true"
      :enhanced="true"
      :bounces="false"
      @scroll="handleScroll"
      @touchstart.stop="handleTouchStart"
      @touchend.stop="handleTouchEnd"
    >
      <view class="top-tabs-wrapper">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          :id="'tab-' + index"
          :class="['top-tab-item', { active: currentIndex === index }]"
          @click="handleTabChange(index)"
        >
          <text class="tab-text">{{ tab }}</text>
          <view v-if="currentIndex === index" class="tab-underline"></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  tabs: string[]
  modelValue: number
  statusBarHeight: number
  minTabIndex?: number // 最小可选标签索引（用于限制滚动边界）
}

const props = withDefaults(defineProps<Props>(), {
  minTabIndex: 1
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const currentIndex = ref(props.modelValue)
const scrollLeft = ref(0)
const minScrollLeft = ref(0)

// 滚动相关状态
const isProgrammaticScroll = ref(false)
const isUserTouching = ref(false)
const isBoundaryLocked = ref(false)

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  currentIndex.value = newVal
})

// 监听内部值变化，同步到外部
watch(currentIndex, (newVal) => {
  emit('update:modelValue', newVal)
})

/**
 * 滚动到指定标签
 */
const scrollTabIntoView = (index: number) => {
  nextTick(() => {
    setTimeout(() => {
      const query = uni.createSelectorQuery()
      const tabElements = props.tabs.map((_, i) => `#tab-${i}`)

      tabElements.forEach(selector => {
        query.select(selector).boundingClientRect()
      })

      query.select('.top-tabs-scroll').boundingClientRect()

      query.exec((res) => {
        if (!res || res.length < tabElements.length + 1) {
          return
        }

        const systemInfo = uni.getSystemInfoSync()
        const screenWidth = systemInfo.screenWidth || 375
        const rpxToPx = screenWidth / 750

        let accumulatedWidth = 0
        const gapWidthRpx = 10
        const gapWidthPx = gapWidthRpx * rpxToPx

        for (let i = 0; i < index; i++) {
          const rect = res[i] as any
          if (rect) {
            accumulatedWidth += rect.width
            if (i < index - 1) {
              accumulatedWidth += gapWidthPx
            }
          }
        }

        const targetScrollLeft = Math.round(accumulatedWidth)

        if (index === props.minTabIndex) {
          minScrollLeft.value = targetScrollLeft
        }

        isProgrammaticScroll.value = true
        scrollLeft.value = targetScrollLeft

        setTimeout(() => {
          isProgrammaticScroll.value = false
        }, 500)
      })
    }, 200)
  })
}

/**
 * 切换标签
 */
const handleTabChange = (index: number) => {
  currentIndex.value = index
  scrollTabIntoView(index)
}

/**
 * 处理滚动事件
 */
const handleScroll = (e: any) => {
  const currentScrollLeft = e.detail.scrollLeft

  if (isProgrammaticScroll.value) {
    return
  }

  if (isBoundaryLocked.value) {
    scrollLeft.value = minScrollLeft.value
    return
  }

  if (currentScrollLeft < minScrollLeft.value && !isUserTouching.value) {
    isBoundaryLocked.value = true
    isProgrammaticScroll.value = true
    scrollLeft.value = minScrollLeft.value

    setTimeout(() => {
      isProgrammaticScroll.value = false
    }, 100)

    setTimeout(() => {
      isBoundaryLocked.value = false
    }, 500)

    return
  }
}

/**
 * 触摸开始
 */
const handleTouchStart = () => {
  isUserTouching.value = true
  isBoundaryLocked.value = false
}

/**
 * 触摸结束
 */
const handleTouchEnd = () => {
  isUserTouching.value = false

  setTimeout(() => {
    if (scrollLeft.value < minScrollLeft.value) {
      isBoundaryLocked.value = true
      isProgrammaticScroll.value = true
      scrollLeft.value = minScrollLeft.value

      let correctionCount = 0
      const maxCorrections = 10

      const correctScroll = () => {
        if (scrollLeft.value < minScrollLeft.value && correctionCount < maxCorrections) {
          scrollLeft.value = minScrollLeft.value
          correctionCount++
          setTimeout(correctScroll, 50)
        } else {
          isBoundaryLocked.value = false
          isProgrammaticScroll.value = false
        }
      }

      setTimeout(correctScroll, 100)
    }
  }, 100)
}

// 暴露方法给父组件
defineExpose({
  scrollTabIntoView
})
</script>

<style scoped lang="scss">
.top-tabs-container {
  background: linear-gradient(90deg, #ff9500 0%, #ff6a00 100%);

  .top-tabs-scroll {
    width: 100%;
    white-space: nowrap;
  }

  .top-tabs-wrapper {
    display: inline-flex;
    padding: 10rpx 30rpx;
    gap: 10rpx;
  }

  .top-tab-item {
    position: relative;
    flex-shrink: 0;
    padding: 16rpx 28rpx;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8rpx;
    transition: all 0.3s;

    .tab-text {
      font-size: 32rpx;
      color: rgba(255, 255, 255, 0.8);
      white-space: nowrap;
    }

    &.active {
      background-color: #ffffff;
      border-radius: 8rpx;
      box-shadow: 0 2rpx 8rpx rgba(255, 106, 0, 0.15);

      .tab-text {
        color: #ff6a00;
        font-weight: bold;
      }
    }

    .tab-underline {
      display: none;
    }
  }
}
</style>
