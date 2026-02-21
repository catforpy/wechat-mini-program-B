<template>
  <view class="registration-cards">
    <view class="cards-grid">
      <view
        v-for="(card, index) in cards"
        :key="index"
        class="card-item"
        @tap="handleCardClick(card, '注册')"
      >
        <text class="card-icon">{{ getCardIcon(card) }}</text>
        <text class="card-name">{{ getCardName(card) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">

// 卡片数据接口
export interface Card {
  name: string
  icon: string
  id: string
}

// Props
interface Props {
  cards?: Card[]
}

const props = withDefaults(defineProps<Props>(), {
  cards: () => []
})

// Emits
const emit = defineEmits<{
  cardClick: [card: Card, section: string]
}>()

// 点击注册卡片
const handleCardClick = (card: Card, section: string) => {
  console.log('=== registration-cards 组件触发 ===')
  console.log('card:', card)
  console.log('section:', section)
  emit('cardClick', card, section)
  console.log('事件已发送')
}

// 从卡片名称中提取 emoji 图标
const getCardIcon = (card: Card) => {
  // 如果有单独的 icon 字段，优先使用
  if (card.icon) {
    return card.icon
  }
  // 否则从 name 中提取 emoji（查找第一个 emoji 字符）
  const emojiMatch = card.name.match(/[\u{1F600}-\u{1F64F}]|[\u{2702}-\u{27B0}]|[\u{1F300}-\u{1F5FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{1F1E0}-\u{1F1FF}]/u)
  if (emojiMatch && emojiMatch.index === 0) {
    return card.name.charAt(0)
  }
  // 默认图标
  return '📄'
}

// 从卡片名称中提取文字部分（去除 emoji）
const getCardName = (card: Card) => {
  // 尝试提取 emoji 后的文字
  const parts = card.name.split(' ')
  if (parts.length > 1) {
    return parts.slice(1).join(' ')
  }
  // 如果没有空格，返回完整 name
  return card.name
}
</script>

<style scoped lang="scss">
.registration-cards {
  background: #fff;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 30rpx 20rpx;

    .card-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20rpx 10rpx;
      border-radius: 12rpx;

      .card-icon {
        font-size: 56rpx;
        margin-bottom: 12rpx;
      }

      .card-name {
        font-size: 22rpx;
        color: #333;
        text-align: center;
        line-height: 1.4;
      }

      &:active {
        background: #f5f5f5;
      }
    }
  }
}
</style>
