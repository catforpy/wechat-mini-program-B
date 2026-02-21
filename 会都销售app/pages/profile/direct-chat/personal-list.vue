<template>
  <view class="personal-list-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="search-icon" @tap="handleSearch">
          <text>🔍</text>
        </view>
        <view class="new-chat-btn" @tap="handleNewChat">
          <text>+ 新建</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 功能切换 Tab（个人对话只有全部） -->
      <view class="function-tabs">
        <view class="tab-item active">
          <text class="tab-text">全部</text>
        </view>
      </view>

      <!-- 当前位置标识 -->
      <view class="current-location">
        <text class="location-text">个人对话</text>
      </view>

      <!-- 会话列表 -->
      <view class="conversation-list">
        <view
          v-for="conversation in conversations"
          :key="conversation.id"
          class="conversation-card"
          @tap="handleChatClick(conversation)"
        >
          <!-- 左侧：头像/图标 -->
          <view class="avatar-wrapper">
            <image
              v-if="conversation.avatar"
              :src="conversation.avatar"
              mode="aspectFill"
              class="avatar"
            />
            <text v-else class="avatar-emoji">{{ conversation.emoji || '👤' }}</text>
          </view>

          <!-- 中间：消息内容 -->
          <view class="message-content">
            <text class="conversation-name">{{ conversation.name }}</text>
            <text class="last-message">{{ conversation.lastMessage }}</text>
          </view>

          <!-- 右侧：时间和未读 -->
          <view class="right-info">
            <text class="time">{{ conversation.time }}</text>
            <view v-if="conversation.unreadCount > 0" class="unread-badge">
              <text class="unread-count">{{ conversation.unreadCount }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 会话数据接口
interface Conversation {
  id: string
  name: string
  avatar?: string
  emoji?: string
  lastMessage: string
  time: string
  unreadCount: number
}

// 模拟会话数据
const conversations = ref<Conversation[]>([
  {
    id: 'per_001',
    name: '李四',
    emoji: '👤',
    lastMessage: '周末有空一起吃饭吗？',
    time: '2小时前',
    unreadCount: 1
  },
  {
    id: 'per_002',
    name: '王五',
    emoji: '👤',
    lastMessage: '最近怎么样？',
    time: '昨天',
    unreadCount: 0
  },
  {
    id: 'per_003',
    name: '赵六',
    emoji: '👤',
    lastMessage: '好久不见啊！',
    time: '周一',
    unreadCount: 0
  },
  {
    id: 'per_004',
    name: '孙七',
    emoji: '👤',
    lastMessage: '好的，到时候联系',
    time: '上周',
    unreadCount: 0
  },
  {
    id: 'per_005',
    name: '周八',
    emoji: '👤',
    lastMessage: '[图片]',
    time: '上周',
    unreadCount: 3
  }
])

// 点击会话
const handleChatClick = (conversation: Conversation) => {
  console.log('点击会话:', conversation)
  uni.navigateTo({
    url: `/pages/profile/direct-chat/chat?id=${conversation.id}&type=single`
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 搜索功能
const handleSearch = () => {
  uni.showToast({
    title: '搜索功能开发中',
    icon: 'none'
  })
}

// 新建对话
const handleNewChat = () => {
  uni.showToast({
    title: '选择联系人功能开发中',
    icon: 'none'
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.personal-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
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

    .search-icon {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;

      &:active {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
      }
    }

    .new-chat-btn {
      padding: 12rpx 24rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 24rpx;
      font-size: 26rpx;
      color: #fff;
      font-weight: 500;

      &:active {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
}

// 功能切换Tab
.function-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #e5e5e5;

  .tab-item {
    flex: 1;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 32rpx;
    transition: all 0.3s;

    .tab-text {
      font-size: 28rpx;
      color: #666;
      font-weight: 500;
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);

      .tab-text {
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

// 当前位置标识
.current-location {
  background: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #e5e5e5;

  .location-text {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
  }
}

// 会话列表
.conversation-list {
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .conversation-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
    }

    .avatar-wrapper {
      width: 96rpx;
      height: 96rpx;
      border-radius: 12rpx;
      overflow: hidden;
      flex-shrink: 0;
      background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;

      .avatar {
        width: 100%;
        height: 100%;
      }

      .avatar-emoji {
        font-size: 48rpx;
      }
    }

    .message-content {
      flex: 1;
      min-width: 0;

      .conversation-name {
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
        display: block;
        margin-bottom: 8rpx;
      }

      .last-message {
        font-size: 26rpx;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    }

    .right-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8rpx;
      flex-shrink: 0;

      .time {
        font-size: 24rpx;
        color: #bbb;
      }

      .unread-badge {
        min-width: 36rpx;
        height: 36rpx;
        padding: 0 8rpx;
        background: #ff5252;
        border-radius: 18rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .unread-count {
          font-size: 20rpx;
          color: #fff;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
