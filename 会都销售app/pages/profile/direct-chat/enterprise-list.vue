<template>
  <view class="enterprise-list-page">
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
      <!-- 功能切换 Tab -->
      <view class="function-tabs">
        <view
          class="tab-item"
          :class="{ active: activeFunctionTab === 'all' }"
          @tap="handleFunctionTabChange('all')"
        >
          <text class="tab-text">全部</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeFunctionTab === 'recruitment' }"
          @tap="handleFunctionTabChange('recruitment')"
        >
          <text class="tab-text">招聘</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeFunctionTab === 'business' }"
          @tap="handleFunctionTabChange('business')"
        >
          <text class="tab-text">商务</text>
        </view>
      </view>

      <!-- 当前位置标识 -->
      <view class="current-location">
        <text class="location-text">企业对话</text>
      </view>

      <!-- 会话列表 -->
      <view class="conversation-list">
        <view
          v-for="conversation in filteredConversations"
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
            <text v-else class="avatar-emoji">{{ conversation.emoji || '🏢' }}</text>
          </view>

          <!-- 中间：消息内容 -->
          <view class="message-content">
            <view class="message-header">
              <text class="conversation-name">{{ conversation.name }}</text>
              <!-- 标识标签 -->
              <view class="tags-row">
                <text v-if="conversation.isRecruitment" class="tag recruitment">聘</text>
                <text v-if="conversation.isGroup" class="tag group">群</text>
              </view>
            </view>
            <text class="last-message">{{ conversation.lastMessage }}</text>
          </view>

          <!-- 右侧：时间和未读 -->
          <view class="right-info">
            <text class="time">{{ conversation.time }}</text>
            <view v-if="conversation.unreadCount > 0" class="unread-badge">
              <text class="unread-count">{{ conversation.unreadCount }}</text>
            </view>
            <text v-if="conversation.isGroup" class="member-count">{{ conversation.memberCount }}人</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 当前选中的功能Tab
const activeFunctionTab = ref<'all' | 'recruitment' | 'business'>('all')

// 会话数据接口
interface Conversation {
  id: string
  name: string
  avatar?: string
  emoji?: string
  lastMessage: string
  time: string
  unreadCount: number
  isRecruitment?: boolean
  isGroup?: boolean
  memberCount?: number
  category: 'all' | 'recruitment' | 'business'
}

// 模拟会话数据
const conversations = ref<Conversation[]>([
  {
    id: 'ent_001',
    name: '北京科技创新有限公司',
    emoji: '🏢',
    lastMessage: '张经理: 好的，明天见',
    time: '10:30',
    unreadCount: 2,
    isRecruitment: true,
    isGroup: false,
    category: 'recruitment'
  },
  {
    id: 'ent_002',
    name: '上海智汇网络科技有限公司',
    emoji: '🏢',
    lastMessage: '王总: 今天的会议资料发给您了',
    time: '09:15',
    unreadCount: 0,
    isRecruitment: false,
    isGroup: false,
    category: 'business'
  },
  {
    id: 'group_001',
    name: 'IT行业交流群',
    emoji: '👥',
    lastMessage: '李工: 这个问题我也遇到过',
    time: '昨天',
    unreadCount: 15,
    isRecruitment: false,
    isGroup: true,
    memberCount: 128,
    category: 'business'
  },
  {
    id: 'ent_003',
    name: '朝阳科技工作室',
    emoji: '🏪',
    lastMessage: '您好，请问合作事宜怎么安排？',
    time: '周一',
    unreadCount: 0,
    isRecruitment: true,
    isGroup: false,
    category: 'recruitment'
  },
  {
    id: 'group_002',
    name: '电商平台合作群',
    emoji: '👥',
    lastMessage: '陈总: 项目进度怎么样了？',
    time: '周日',
    unreadCount: 5,
    isRecruitment: false,
    isGroup: true,
    memberCount: 56,
    category: 'business'
  }
])

// 根据功能Tab过滤会话
const filteredConversations = computed(() => {
  if (activeFunctionTab.value === 'all') {
    return conversations.value
  }
  return conversations.value.filter(c => c.category === activeFunctionTab.value)
})

// 功能Tab切换
const handleFunctionTabChange = (tab: 'all' | 'recruitment' | 'business') => {
  activeFunctionTab.value = tab
}

// 点击会话
const handleChatClick = (conversation: Conversation) => {
  console.log('点击会话:', conversation)
  uni.navigateTo({
    url: `/pages/profile/direct-chat/chat?id=${conversation.id}&type=${conversation.isGroup ? 'group' : 'single'}`
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
  uni.showActionSheet({
    itemList: ['发起单聊', '创建群聊'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.showToast({
          title: '选择联系人功能开发中',
          icon: 'none'
        })
      } else if (res.tapIndex === 1) {
        uni.navigateTo({
          url: '/pages/profile/direct-chat/create-group'
        })
      }
    }
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.enterprise-list-page {
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
  gap: 20rpx;
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

    &:active {
      transform: scale(0.95);
    }

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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

      .message-header {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;

        .conversation-name {
          font-size: 32rpx;
          color: #333;
          font-weight: 600;
          margin-right: 12rpx;
        }

        .tags-row {
          display: flex;
          gap: 8rpx;

          .tag {
            padding: 4rpx 12rpx;
            border-radius: 8rpx;
            font-size: 20rpx;
            font-weight: 600;

            &.recruitment {
              background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
              color: #fff;
            }

            &.group {
              background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
              color: #fff;
            }
          }
        }
      }

      .last-message {
        font-size: 26rpx;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

      .member-count {
        font-size: 22rpx;
        color: #9c27b0;
        background: #f3e5f5;
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
      }
    }
  }
}
</style>
