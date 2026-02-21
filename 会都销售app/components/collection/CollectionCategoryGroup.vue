<template>
  <view class="category-group">
    <!-- 分类路径 -->
    <view class="category-path">
      <text class="path-text">{{ firstLevel }} > {{ secondLevel }}</text>
    </view>

    <!-- 小程序网格 -->
    <view class="program-grid">
      <MiniProgramCard
        v-for="program in programs"
        :key="program.id"
        :program="program"
        :show-type-badge="true"
        :current-tab-type="currentTabType"
        @click="handleProgramClick"
        @remove="handleProgramRemove"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import MiniProgramCard, { type MiniProgram } from './MiniProgramCard.vue'

interface Props {
  firstLevel: string
  secondLevel: string
  programs: MiniProgram[]
  currentTabType?: string
}

defineProps<Props>()

const emit = defineEmits<{
  'program-click': [program: MiniProgram]
  'program-remove': [program: MiniProgram]
}>()

const handleProgramClick = (program: MiniProgram) => {
  emit('program-click', program)
}

const handleProgramRemove = (program: MiniProgram) => {
  emit('program-remove', program)
}
</script>

<style scoped lang="scss">
.category-group {
  margin-bottom: 40rpx;
}

.category-path {
  padding: 0 30rpx;
  margin-bottom: 20rpx;

  .path-text {
    font-size: 28rpx;
    color: #666;
    font-weight: 500;
  }
}

.program-grid {
  padding: 10rpx 16rpx;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12rpx;
}

.program-grid .mini-program-card {
  width: calc(100% - 12rpx);
  flex: 0 0 auto;
}
</style>
