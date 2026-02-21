<template>
  <view class="mini-program-card" @click="handleClick" @longpress="handleLongPress">
    <!-- 左侧：图标区域 -->
    <view class="card-left">
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
    </view>

    <!-- 右侧：信息区域 -->
    <view class="card-right">
      <!-- 程序名称 -->
      <text class="program-name">{{ program.name }}</text>

      <!-- 办理资质 -->
      <view class="program-qualification">
        <text class="qualification-label">办理资质：</text>
        <text class="qualification-text">{{ getQualificationText }}</text>
      </view>

      <!-- 价格信息 -->
      <view class="program-price-row">
        <text class="program-price">¥{{ program.price }}</text>
        <text v-if="program.douPrice" class="program-price-dou">{{ program.douPrice }}都达豆</text>
      </view>
    </view>

    <!-- 右侧：类型徽章 -->
    <view v-if="showTypeBadge" class="card-right-type">
      <view class="type-badge" :class="getTypeBadgeClass">
        <text class="type-badge-text">{{ getTypeBadgeText }}</text>
      </view>
    </view>

    <!-- 删除按钮 -->
    <view class="remove-btn" @click.stop="handleRemove">
      <text class="remove-icon">×</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface MiniProgram {
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
  program: MiniProgram
  showTypeBadge?: boolean
  currentTabType?: string
  navigateTo?: (program: MiniProgram) => void  // 新增：跳转函数
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'click': [program: MiniProgram]
  'remove': [program: MiniProgram]
}>()

const handleClick = () => {
  // 如果父组件传入了 navigateTo 函数，调用它
  if (props.navigateTo) {
    props.navigateTo(props.program)
  } else {
    // 默认行为：emit 事件，由父组件决定跳转
    emit('click', props.program)
  }
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
  const programType = props.program.type

  if (programType === 'purchase') {
    return '购买'
  } else if (programType === 'rent') {
    return '租赁'
  } else if (programType === 'cooperate') {
    return '合作'
  }
  return ''
})

// 类型徽章样式类
const getTypeBadgeClass = computed(() => {
  const programType = props.program.type
  const isPaid = props.program.isPaid || false

  if (programType === 'purchase') {
    return isPaid ? 'type-badge-purchase-paid' : 'type-badge-purchase-unpaid'
  }
  return `type-badge-${programType}`
})

// 获取办理资质文本
const getQualificationText = computed(() => {
  const programType = props.program.type

  if (programType === 'purchase') {
    return '购买'
  } else if (programType === 'rent') {
    return '租赁'
  } else if (programType === 'cooperate') {
    return '合作'
  }
  return '无'
})
</script>

<style scoped lang="scss">
.mini-program-card {
  position: relative;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 16rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  min-height: 160rpx;
  height: 160rpx;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
  }
}

// 左侧区域
.card-left {
  flex-shrink: 0;
  margin-right: 16rpx;
}

// 右侧区域
.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 128rpx;
}

// 右侧类型徽章区域
.card-right-type {
  flex-shrink: 0;
  margin-left: 12rpx;
  display: flex;
  align-items: center;
}

// 类型徽章
.type-badge {
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.3);

  .type-badge-text {
    font-size: 20rpx;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
    letter-spacing: 0.5rpx;
  }

  // 已购买：红色
  &.type-badge-purchase-paid {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);

    .type-badge-text {
      color: #fff;
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
    }
  }

  // 可购买：橙色
  &.type-badge-purchase-unpaid {
    background: linear-gradient(135deg, #ffb347 0%, #ff9500 100%);

    .type-badge-text {
      color: #fff;
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
    }
  }

  // 已租赁：绿色
  &.type-badge-rent {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

    .type-badge-text {
      color: #fff;
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
    }
  }

  // 已合作：蓝色
  &.type-badge-cooperate {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);

    .type-badge-text {
      color: #fff;
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
    }
  }
}

// 图标区域
.program-icon-wrapper {
  width: 128rpx;
  height: 128rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.15);

  .program-icon {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
  }

  .program-emoji {
    font-size: 64rpx;
  }
}

// 程序名称
.program-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 6rpx;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  line-height: 1.3;
}

// 办理资质
.program-qualification {
  display: flex;
  align-items: center;
  margin-top: 4rpx;

  .qualification-label {
    font-size: 20rpx;
    color: #999999;
    font-weight: 400;
  }

  .qualification-text {
    font-size: 20rpx;
    color: #666666;
    font-weight: 500;
  }
}

// 价格信息
.program-price-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  margin-top: auto;
}

.program-price {
  font-size: 24rpx;
  font-weight: 600;
  color: #ff5722;
  line-height: 1.2;
}

.program-price-dou {
  font-size: 20rpx;
  color: #999999;
  font-weight: 400;
  line-height: 1.2;
}

// 删除按钮
.remove-btn {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  width: 44rpx;
  height: 44rpx;
  background: #ff3b30;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(255, 59, 48, 0.25);
  z-index: 10;

  &:active {
    transform: scale(0.9);
    background: #e6322a;
  }
}

.remove-icon {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
  line-height: 1;
}
</style>
