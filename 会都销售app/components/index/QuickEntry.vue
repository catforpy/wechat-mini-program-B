<template>
  <view class="quick-entry-container">
    <view class="quick-entry-header">
      <text class="section-title">快速入口</text>
      <view
        v-if="apps.length > 8"
        class="more-btn"
        @tap="toggleExpand"
      >
        <text class="more-text">{{ isExpanded ? '收起' : '更多' }}</text>
        <text class="more-icon">{{ isExpanded ? '↑' : '›' }}</text>
      </view>
    </view>

    <!-- 单行横向滚动模式 -->
    <view
      v-if="!isExpanded"
      class="quick-entry-scroll"
      @touchstart.stop
      @touchmove.stop
      @touchend.stop
      @touchcancel.stop
    >
      <view
        v-for="(app, index) in apps"
        :key="index"
        class="app-card"
        @click="handleAppClick(app)"
      >
        <view class="app-icon">
          <image v-if="app.icon && !app.emoji" :src="app.icon" mode="aspectFit" class="app-icon-image" />
          <text v-else class="app-emoji">{{ app.emoji || '📱' }}</text>
        </view>
        <text class="app-name">{{ app.name }}</text>
      </view>
    </view>

    <!-- 多行网格/列表模式 -->
    <scroll-view
      v-else
      class="quick-entry-expanded"
      scroll-y
      @touchstart.stop
      @touchmove.stop
      @touchend.stop
      @touchcancel.stop
    >
      <view class="app-grid-expanded">
        <view
          v-for="(app, index) in apps"
          :key="index"
          class="app-card-expanded"
          @click="handleAppClick(app)"
        >
          <view class="app-icon">
            <image v-if="app.icon && !app.emoji" :src="app.icon" mode="aspectFit" class="app-icon-image" />
            <text v-else class="app-emoji">{{ app.emoji || '📱' }}</text>
          </view>
          <text class="app-name">{{ app.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface QuickEntryApp {
  name: string
  icon?: string
  emoji?: string
  path?: string
}

interface Props {
  apps: QuickEntryApp[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'app-click': [app: QuickEntryApp]
}>()

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleAppClick = (app: QuickEntryApp) => {
  emit('app-click', app)
}
</script>

<style scoped lang="scss">
.quick-entry-container {
  background-color: #ffffff;
  padding: 30rpx 0;
  margin-bottom: 0;

  .quick-entry-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .more-btn {
      display: flex;
      align-items: center;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border: 1rpx solid #667eea;

      .more-text {
        font-size: 26rpx;
        color: #667eea;
        margin-right: 6rpx;
      }

      .more-icon {
        font-size: 28rpx;
        color: #667eea;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }

  .quick-entry-scroll {
    display: flex;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 30rpx;
    gap: 20rpx;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }

    .app-card {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx;
      min-width: 160rpx;
      border-radius: 16rpx;
      background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
      transition: all 0.3s;

      &:active {
        transform: scale(0.95);
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
      }

      .app-icon {
        width: 96rpx;
        height: 96rpx;
        margin-bottom: 12rpx;
        border-radius: 20rpx;
        overflow: hidden;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        .app-icon-image {
          width: 100%;
          height: 100%;
        }

        .app-emoji {
          font-size: 56rpx;
        }
      }

      .app-name {
        font-size: 24rpx;
        font-weight: 500;
        color: #333;
        text-align: center;
      }
    }
  }

  .quick-entry-expanded {
    max-height: 800rpx;
    padding: 0 30rpx;

    .app-grid-expanded {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20rpx;
      padding-bottom: 20rpx;

      .app-card-expanded {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20rpx 12rpx;
        border-radius: 16rpx;
        background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
        transition: all 0.3s;

        &:active {
          transform: scale(0.95);
          box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
        }

        .app-icon {
          width: 96rpx;
          height: 96rpx;
          margin-bottom: 12rpx;
          border-radius: 20rpx;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;

          .app-icon-image {
            width: 100%;
            height: 100%;
          }

          .app-emoji {
            font-size: 56rpx;
          }
        }

        .app-name {
          font-size: 22rpx;
          font-weight: 500;
          color: #333;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
      }
    }
  }
}
</style>
