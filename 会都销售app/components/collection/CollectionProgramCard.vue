<template>
  <view class="program-card" @click="handleClick" @longpress="handleLongPress">
    <!-- 类型标识徽章 -->
    <view v-if="showTypeBadge" class="type-badge" :class="getTypeBadgeClass">
      <text class="type-badge-text">{{ getTypeBadgeText }}</text>
    </view>
    <view class="program-icon-wrapper">
      <text class="program-emoji">{{ program.emoji || '📱' }}</text>
      <image
        v-if="program.icon"
        :src="program.icon"
        mode="aspectFill"
        class="program-icon"
        @error="handleImageError"
      />
    </view>
    <text class="program-name">{{ program.name }}</text>
    <view class="program-price-row">
      <text class="program-price">¥{{ program.price }}</text>
      <text v-if="program.douPrice" class="program-price-dou">{{ program.douPrice }}都达豆</text>
    </view>
    <!-- 取消收藏按钮 -->
    <view class="remove-btn" @click.stop="handleRemove">
      <text class="remove-icon">×</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface CollectionProgram {
  id: string
  name: string
  emoji?: string
  icon?: string
  price: string
  douPrice?: string
  firstLevel: string
  secondLevel: string
  type: string
  collectedAt: string
  isPaid?: boolean // 是否已付款（仅对购买类型有效）
}

interface Props {
  program: CollectionProgram
  showTypeBadge?: boolean
  currentTabType?: string // 当前标签页类型：collection/purchase/rent/cooperate
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'click': [program: CollectionProgram]
  'remove': [program: CollectionProgram]
}>()

const handleClick = () => {
  emit('click', props.program)
}

const handleLongPress = () => {
  uni.showActionSheet({
    itemList: ['取消收藏'],
    success: (res) => {
      if (res.tapIndex === 0) {
        emit('remove', props.program)
      }
    }
  })
}

const handleRemove = () => {
  uni.showModal({
    title: '确认取消收藏',
    content: `确定要取消收藏"${props.program.name}"吗？`,
    success: (res) => {
      if (res.confirm) {
        emit('remove', props.program)
      }
    }
  })
}

const handleImageError = () => {
  console.warn('[图标加载失败]', props.program.name, 'icon:', props.program.icon)
}

// 类型徽章文本
const getTypeBadgeText = computed(() => {
  const currentTab = props.currentTabType || 'collection'
  const programType = props.program.type
  const isPaid = props.program.isPaid || false

  // 根据当前标签页和小程序类型决定徽章文本
  if (currentTab === 'collection') {
    // 宝库标签页
    if (programType === 'purchase') {
      // 购买类型：根据是否已付款显示"已购买"或"可购买"
      return isPaid ? '已购买' : '可购买'
    } else if (programType === 'rent') {
      return '已租赁'
    } else if (programType === 'cooperate') {
      return '已合作'
    }
  } else if (currentTab === 'purchase') {
    // 购买标签页：根据是否已付款显示"已购买"或"可购买"
    return isPaid ? '已购买' : '可购买'
  } else if (currentTab === 'rent') {
    // 租赁标签页：显示"已租赁"
    return '已租赁'
  } else if (currentTab === 'cooperate') {
    // 合作标签页：显示"已合作"
    return '已合作'
  }

  return ''
})

// 类型徽章样式类
const getTypeBadgeClass = computed(() => {
  const programType = props.program.type
  const isPaid = props.program.isPaid || false

  // 购买类型：根据是否已付款显示不同颜色
  if (programType === 'purchase') {
    if (isPaid) {
      return 'type-badge-purchase-paid' // 已购买：红色
    } else {
      return 'type-badge-purchase-unpaid' // 可购买：橙色
    }
  }

  // 其他类型保持原样
  return `type-badge-${programType}`
})
</script>

<style scoped lang="scss">
.program-card {
  position: relative;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 12rpx 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  min-height: 200rpx;
  height: 200rpx;

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  }

  .program-icon-wrapper {
    width: 72rpx;
    height: 72rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin-bottom: 8rpx;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
    flex-shrink: 0;

    .program-icon {
      width: 100%;
      height: 100%;
    }

    .program-emoji {
      font-size: 44rpx;
    }
  }

  .program-name {
    font-size: 22rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 6rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    line-height: 1.2;
    max-height: 27rpx;
  }

  .program-price-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rpx;
    margin-top: auto;
  }

  .program-price {
    font-size: 22rpx;
    font-weight: 600;
    color: #ff5722;
    text-align: center;
  }

  .program-price-dou {
    font-size: 18rpx;
    color: #999;
    text-align: center;
  }

  .remove-btn {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    width: 44rpx;
    height: 44rpx;
    background: #ff3b30;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 8rpx rgba(255, 59, 48, 0.3);
    z-index: 10;

    .remove-icon {
      font-size: 32rpx;
      color: #fff;
      font-weight: bold;
      line-height: 1;
    }

    &:active {
      transform: scale(0.9);
    }
  }

  // 类型徽章
  .type-badge {
    position: absolute;
    top: 4rpx;
    left: 4rpx;
    padding: 2rpx 8rpx;
    border-radius: 8rpx;
    z-index: 5;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.15);

    .type-badge-text {
      font-size: 16rpx;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
    }

    // 已购买：红色
    &.type-badge-purchase-paid {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);

      .type-badge-text {
        color: #fff;
      }
    }

    // 可购买：温暖橙色
    &.type-badge-purchase-unpaid {
      background: linear-gradient(135deg, #ffb347 0%, #ff9500 100%);

      .type-badge-text {
        color: #fff;
      }
    }

    &.type-badge-rent {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

      .type-badge-text {
        color: #fff;
      }
    }

    &.type-badge-cooperate {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);

      .type-badge-text {
        color: #fff;
      }
    }
  }
}
</style>
