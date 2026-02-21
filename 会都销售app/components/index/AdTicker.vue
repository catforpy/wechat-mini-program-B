<template>
  <view class="ad-ticker">
    <view class="ticker-content">
      <view class="ticker-scroll">
        <text class="ticker-text">{{ currentText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  ads: string[]
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  interval: 3000
})

const currentIndex = ref(0)
let timer: number | null = null

const currentText = computed(() => props.ads[currentIndex.value])

const startRotation = () => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.ads.length
  }, props.interval) as unknown as number
}

const stopRotation = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startRotation()
})

onUnmounted(() => {
  stopRotation()
})
</script>

<style scoped lang="scss">
.ad-ticker {
  background-color: #fff9e6;
  border-bottom: 1rpx solid #ffe58f;
  height: 64rpx;
  overflow: hidden;
  position: relative;

  .ticker-content {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
  }

  .ticker-scroll {
    width: 100%;
    overflow: hidden;
  }

  .ticker-text {
    font-size: 26rpx;
    color: #ff6a00;
    white-space: nowrap;
    display: inline-block;
    animation: tickerScroll 15s linear infinite;

    &::after {
      content: '     •     ';
      margin: 0 30rpx;
    }
  }

  @keyframes tickerScroll {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
}
</style>
