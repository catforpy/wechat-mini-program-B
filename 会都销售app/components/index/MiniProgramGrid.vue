<template>
  <view class="mini-program-grid-container">
    <!-- 类目标题 -->
    <view v-if="title" class="category-title">{{ title }}</view>

    <!-- 小程序网格 -->
    <scroll-view
      scroll-y
      class="grid-scroll"
      :show-scrollbar="false"
      @touchstart.stop
      @touchmove.stop
      @touchend.stop
      @touchcancel.stop
    >
      <view class="mini-program-grid">
        <view
          v-for="(program, index) in programs"
          :key="index"
          class="mini-program-card"
          @click="handleCardClick(program)"
        >
          <!-- 收藏按钮 -->
          <view
            class="collect-btn"
            :class="{ collected: program.isCollected }"
            @click.stop="handleCollectClick(program)"
          >
            <text class="collect-icon">{{ program.isCollected ? '⭐' : '☆' }}</text>
          </view>

          <view class="program-icon-wrapper">
            <text class="program-emoji">{{ program.emoji || '📱' }}</text>
            <image
              v-if="program.icon"
              :src="program.icon"
              mode="aspectFill"
              class="program-icon"
              @error="handleImageError($event, program)"
            />
          </view>
          <text class="program-name">{{ program.name }}</text>
          <view class="program-price-row">
            <text class="program-price">¥{{ program.price }}</text>
            <text v-if="program.douPrice" class="program-price-dou">{{ program.douPrice }}都达豆</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="programs.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
export interface MiniProgram {
  id: string
  name: string
  desc?: string
  emoji?: string
  icon?: string
  price: string
  douPrice?: string
  isFollowed?: boolean
  isCollected?: boolean  // 新增：是否已收藏
  firstLevel?: string   // 新增：一级分类
  secondLevel?: string  // 新增：二级分类
  type?: string         // 新增：类型（purchase/rent/cooperate）
  [key: string]: any
}

interface Props {
  title?: string
  programs: MiniProgram[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'card-click': [program: MiniProgram]
  'collect-click': [program: MiniProgram]
}>()

const handleCardClick = (program: MiniProgram) => {
  emit('card-click', program)
}

const handleCollectClick = (program: MiniProgram) => {
  emit('collect-click', program)
}

const handleImageError = (e: any, program: MiniProgram) => {
  console.warn('[图标加载失败]', program.name, 'icon:', program.icon)
}
</script>

<style scoped lang="scss">
.mini-program-grid-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding: 0 30rpx;
  padding-top: 20rpx;
}

.grid-scroll {
  flex: 1;
  height: 100%;
}

.mini-program-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 30rpx;
  padding-bottom: 40rpx;

  .mini-program-card {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 24rpx 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    transition: all 0.3s;
    position: relative;

    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
    }

    // 收藏按钮
    .collect-btn {
      position: absolute;
      top: 4rpx;
      right: 4rpx;
      width: 56rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      z-index: 10;
      transition: all 0.3s;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
      border: 2rpx solid rgba(0, 0, 0, 0.1);

      .collect-icon {
        font-size: 36rpx;
        color: #ccc;
        line-height: 1;
      }

      &.collected {
        background: rgba(255, 193, 7, 0.95);

        .collect-icon {
          color: #fff;
        }
      }

      &:active {
        transform: scale(0.9);
      }
    }

    .program-icon-wrapper {
      width: 96rpx;
      height: 96rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin-bottom: 16rpx;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);

      .program-icon {
        width: 100%;
        height: 100%;
      }

      .program-emoji {
        font-size: 56rpx;
      }
    }

    .program-name {
      font-size: 26rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 8rpx;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    .program-price-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4rpx;
    }

    .program-price {
      font-size: 28rpx;
      font-weight: 600;
      color: #ff5722;
      text-align: center;
    }

    .program-price-dou {
      font-size: 22rpx;
      color: #999;
      text-align: center;
    }
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
