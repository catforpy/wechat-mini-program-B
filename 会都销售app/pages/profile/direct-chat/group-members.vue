<template>
  <view class="group-members-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">群成员</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <view class="members-list">
        <view
          v-for="member in members"
          :key="member.id"
          class="member-card"
          @tap="handleMemberClick(member)"
        >
          <view class="member-avatar">
            <text class="avatar-emoji">{{ member.emoji }}</text>
          </view>
          <view class="member-info">
            <text class="member-name">{{ member.name }}</text>
            <text class="member-card-info">{{ member.cardInfo }}</text>
          </view>
          <text v-if="member.isOwner" class="owner-badge">群主</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 成员数据
interface Member {
  id: string
  name: string
  emoji: string
  cardInfo: string
  isOwner?: boolean
}

const members = ref<Member[]>([
  { id: 'm001', name: '张三', emoji: '👤', cardInfo: '个人名片', isOwner: false },
  { id: 'm002', name: '李四', emoji: '🏢', cardInfo: '北京科技创新有限公司', isOwner: true },
  { id: 'm003', name: '王五', emoji: '🏪', cardInfo: '朝阳科技工作室', isOwner: false },
  { id: 'm004', name: '赵六', emoji: '👤', cardInfo: '个人名片', isOwner: false }
])

const handleMemberClick = (member: Member) => {
  console.log('点击成员:', member)
}

const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.group-members-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1000;

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 20rpx;

    .nav-back {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .nav-title {
      flex: 1;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .nav-placeholder {
      width: 60rpx;
    }
  }
}

.main-content {
  height: 100vh;
}

.members-list {
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .member-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    &:active {
      transform: scale(0.98);
    }

    .member-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 12rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;

      .avatar-emoji {
        font-size: 40rpx;
      }
    }

    .member-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;

      .member-name {
        font-size: 30rpx;
        color: #333;
        font-weight: 600;
      }

      .member-card-info {
        font-size: 24rpx;
        color: #999;
      }
    }

    .owner-badge {
      padding: 8rpx 20rpx;
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      border-radius: 20rpx;
      font-size: 22rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>
