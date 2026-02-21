<template>
  <view class="cooperation-applications">
    <view class="application-list">
      <!-- 合作请求 -->
      <view class="application-item" @tap="handleCooperationClick">
        <view class="app-left">
          <view class="app-info">
            <text class="app-title">合作请求</text>
            <text class="app-desc">查看他人的合作申请</text>
          </view>
        </view>
        <view class="app-badge" v-if="cooperationRequestCount > 0">
          <text class="badge-count">{{ cooperationRequestCount }}</text>
        </view>
        <text class="arrow-icon">›</text>
      </view>

      <!-- 租赁请求 -->
      <view class="application-item" @tap="handleLeasingClick">
        <view class="app-left">
          <view class="app-info">
            <text class="app-title">租赁请求</text>
            <text class="app-desc">查看他人的租赁申请</text>
          </view>
        </view>
        <view class="app-badge" v-if="leasingRequestCount > 0">
          <text class="badge-count">{{ leasingRequestCount }}</text>
        </view>
        <text class="arrow-icon">›</text>
      </view>

      <!-- 团队审批 -->
      <view class="application-item" @tap="handleTeamClick">
        <view class="app-left">
          <view class="app-info">
            <text class="app-title">团队审批</text>
            <text class="app-desc">查看加入团队申请</text>
          </view>
        </view>
        <view class="app-badge" v-if="teamRequestCount > 0">
          <text class="badge-count">{{ teamRequestCount }}</text>
        </view>
        <text class="arrow-icon">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// Props
interface Props {
  cooperationRequestCount?: number
  leasingRequestCount?: number
  teamRequestCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  cooperationRequestCount: 0,
  leasingRequestCount: 0,
  teamRequestCount: 0
})

// Emits
const emit = defineEmits<{
  cooperationClick: []
  leasingClick: []
  teamClick: []
}>()

// 跳转到合作请求页面
const handleCooperationClick = () => {
  emit('cooperationClick')
}

// 跳转到租赁请求页面
const handleLeasingClick = () => {
  emit('leasingClick')
}

// 跳转到团队审批页面
const handleTeamClick = () => {
  emit('teamClick')
}
</script>

<style scoped lang="scss">
.cooperation-applications {
  .application-list {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
  }

  .application-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .app-left {
      flex: 1;

      .app-info {
        .app-title {
          display: block;
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 6rpx;
        }

        .app-desc {
          display: block;
          font-size: 24rpx;
          color: #999;
        }
      }
    }

    .app-badge {
      padding: 4rpx 12rpx;
      background: #ff3b30;
      border-radius: 20rpx;
      margin-right: 12rpx;

      .badge-count {
        font-size: 20rpx;
        color: #fff;
        font-weight: 600;
      }
    }

    .arrow-icon {
      font-size: 32rpx;
      color: #ccc;
      font-weight: 300;
    }

    &:active {
      background: #fafafa;
    }
  }
}
</style>
