<template>
  <view class="message-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-title">消息</text>
        <view class="nav-actions">
          <text class="action-icon" @tap="showAddMenu">+</text>
        </view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input class="search-input" type="text" placeholder="搜索联系人、群组、消息" />
      </view>
    </view>

    <!-- Tab分类 -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-item', { active: activeTab === tab.value }]"
        @tap="switchTab(tab.value)"
      >
        <text class="tab-text">{{ tab.label }}</text>
        <text v-if="tab.unread > 0" class="tab-badge">{{ tab.unread }}</text>
      </view>
    </view>

    <!-- 会话列表 -->
    <scroll-view class="conversation-list" scroll-y>
      <!-- 系统通知（置顶） -->
      <view v-if="activeTab === 'all'" class="section-header">
        <text class="section-title">系统通知</text>
      </view>

      <view v-if="activeTab === 'all'">
        <view
          v-for="item in systemNotices"
          :key="item.id"
          class="conversation-item pinned"
          @tap="openConversation(item)"
        >
          <view class="avatar-wrapper">
            <view class="avatar system">
              <text class="avatar-icon">{{ item.icon }}</text>
            </view>
          </view>
          <view class="conversation-content">
            <view class="conversation-header">
              <text class="conversation-title">{{ item.title }}</text>
              <text class="conversation-time">{{ item.time }}</text>
            </view>
            <view class="conversation-preview">
              <text class="preview-text">{{ item.lastMessage }}</text>
              <view v-if="item.unread > 0" class="unread-badge">{{ item.unread }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 客服会话 -->
      <view v-if="activeTab === 'all' || activeTab === 'service'" class="section-header">
        <text class="section-title">{{ activeTab === 'service' ? '客服列表' : '客服会话' }}</text>
      </view>

      <view v-if="activeTab === 'all' || activeTab === 'service'">
        <view
          v-for="item in serviceConversations"
          :key="item.id"
          class="conversation-item"
          @tap="openConversation(item)"
        >
          <view class="avatar-wrapper">
            <image v-if="item.avatar" :src="item.avatar" class="avatar" mode="aspectFill" />
            <view v-else class="avatar default">
              <text class="avatar-text">{{ item.name?.charAt(0) || '客' }}</text>
            </view>
            <view v-if="item.online" class="online-dot"></view>
          </view>
          <view class="conversation-content">
            <view class="conversation-header">
              <text class="conversation-title">{{ item.name }}</text>
              <text class="conversation-time">{{ item.time }}</text>
            </view>
            <view class="conversation-preview">
              <view class="preview-wrapper">
                <text v-if="item.messageType === 'card'" class="message-type-icon">📦</text>
                <text class="preview-text">{{ item.lastMessage }}</text>
              </view>
              <view v-if="item.unread > 0" class="unread-badge">{{ item.unread }}</view>
            </view>
            <view v-if="item.cardPreview" class="card-preview">
              <view class="card-preview-icon">📦</view>
              <text class="card-preview-text">{{ item.cardPreview }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 第三方对接 -->
      <view v-if="activeTab === 'all'" class="section-header">
        <text class="section-title">第三方对接</text>
      </view>

      <view v-if="activeTab === 'all'">
        <view
          v-for="item in thirdPartyConversations"
          :key="item.id"
          class="conversation-item"
          @tap="openConversation(item)"
        >
          <view class="avatar-wrapper">
            <image v-if="item.avatar" :src="item.avatar" class="avatar" mode="aspectFill" />
            <view v-else class="avatar third-party">
              <text class="avatar-icon">🏢</text>
            </view>
          </view>
          <view class="conversation-content">
            <view class="conversation-header">
              <text class="conversation-title">{{ item.name }}</text>
              <text class="conversation-time">{{ item.time }}</text>
            </view>
            <view class="conversation-preview">
              <text v-if="item.messageType === 'progress'" class="message-type-icon">📊</text>
              <text class="preview-text">{{ item.lastMessage }}</text>
              <view v-if="item.unread > 0" class="unread-badge">{{ item.unread }}</view>
            </view>
            <view v-if="item.progressPreview" class="progress-preview">
              <view class="progress-bar">
                <view class="progress-fill" :style="{ width: item.progressPreview.progress + '%' }"></view>
              </view>
              <text class="progress-text">{{ item.progressPreview.progress }}% {{ item.progressPreview.phase }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 好友/商户 -->
      <view v-if="activeTab === 'all' || activeTab === 'friend'" class="section-header">
        <text class="section-title">{{ activeTab === 'friend' ? '好友列表' : '好友 & 商户' }}</text>
      </view>

      <view v-if="activeTab === 'all' || activeTab === 'friend'">
        <view
          v-for="item in friendConversations"
          :key="item.id"
          class="conversation-item"
          @tap="openConversation(item)"
        >
          <view class="avatar-wrapper">
            <image v-if="item.avatar" :src="item.avatar" class="avatar" mode="aspectFill" />
            <view v-else class="avatar default">
              <text class="avatar-text">{{ item.name?.charAt(0) || '友' }}</text>
            </view>
            <view v-if="item.online" class="online-dot"></view>
          </view>
          <view class="conversation-content">
            <view class="conversation-header">
              <text class="conversation-title">{{ item.name }}</text>
              <text class="tag" v-if="item.type === 'merchant'">商户</text>
              <text class="conversation-time">{{ item.time }}</text>
            </view>
            <view class="conversation-preview">
              <text class="preview-text">{{ item.lastMessage }}</text>
              <view v-if="item.unread > 0" class="unread-badge">{{ item.unread }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 团队群组 -->
      <view v-if="activeTab === 'all' || activeTab === 'team'" class="section-header">
        <text class="section-title">{{ activeTab === 'team' ? '团队群组' : '团队群组' }}</text>
      </view>

      <view v-if="activeTab === 'all' || activeTab === 'team'">
        <view
          v-for="item in teamConversations"
          :key="item.id"
          class="conversation-item"
          @tap="openConversation(item)"
        >
          <view class="avatar-wrapper">
            <view class="avatar group">
              <text class="avatar-icon">👥</text>
            </view>
          </view>
          <view class="conversation-content">
            <view class="conversation-header">
              <text class="conversation-title">{{ item.name }}</text>
              <text class="member-count">({{ item.memberCount }})</text>
              <text class="conversation-time">{{ item.time }}</text>
            </view>
            <view class="conversation-preview">
              <text class="sender-name" v-if="item.lastSender">{{ item.lastSender }}:</text>
              <text class="preview-text">{{ item.lastMessage }}</text>
              <view v-if="item.unread > 0" class="unread-badge">{{ item.unread }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="isCurrentTabEmpty" class="empty-state">
        <text class="empty-icon">💬</text>
        <text class="empty-text">暂无消息</text>
      </view>
    </scroll-view>

    <!-- 添加菜单弹窗 -->
    <view v-if="showAddModal" class="modal-overlay" @tap="hideAddMenu">
      <view class="add-menu" @tap.stop>
        <view class="menu-item" @tap="addFriend">
          <text class="menu-icon">👤</text>
          <text class="menu-label">添加好友</text>
        </view>
        <view class="menu-item" @tap="createGroup">
          <text class="menu-icon">👥</text>
          <text class="menu-label">创建群组</text>
        </view>
        <view class="menu-item" @tap="contactService">
          <text class="menu-icon">📞</text>
          <text class="menu-label">联系客服</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 当前激活的Tab
const activeTab = ref('all')

// Tab配置
const tabs = ref([
  { label: '全部', value: 'all', unread: 5 },
  { label: '客服', value: 'service', unread: 2 },
  { label: '好友', value: 'friend', unread: 1 },
  { label: '团队', value: 'team', unread: 2 }
])

// 添加菜单显示状态
const showAddModal = ref(false)

// 系统通知
const systemNotices = ref([
  {
    id: 'sys_1',
    type: 'system',
    icon: '🔔',
    title: '平台消息',
    lastMessage: '您的小程序「张三的零售商城」已通过审核',
    time: '14:30',
    unread: 2
  },
  {
    id: 'sys_2',
    type: 'order',
    icon: '📦',
    title: '订单状态更新',
    lastMessage: '您的订单 ORDER20250209001 审核已通过',
    time: '12:15',
    unread: 1
  },
  {
    id: 'sys_3',
    type: 'notice',
    icon: '📢',
    title: '系统通知',
    lastMessage: '您的账户安全设置已更新',
    time: '昨天',
    unread: 0
  }
])

// 客服会话
const serviceConversations = ref([
  {
    id: 'cs_1',
    type: 'customer_service',
    name: '官方客服-小蜜',
    avatar: '',
    online: true,
    lastMessage: '您好，有什么可以帮您的吗？',
    time: '14:20',
    unread: 2,
    messageType: 'text',
    cardPreview: null
  },
  {
    id: 'cs_2',
    type: 'customer_service',
    name: '售后客服-007',
    avatar: '',
    online: true,
    lastMessage: '[商品卡片] 零售电商模板',
    time: '昨天',
    unread: 0,
    messageType: 'card',
    cardPreview: '零售电商模板 - ¥2799.00'
  }
])

// 第三方对接
const thirdPartyConversations = ref([
  {
    id: 'tp_1',
    type: 'third_party',
    name: '开发服务商-XX科技',
    avatar: '',
    lastMessage: '您的小程序正在开发中，当前进度60%',
    time: '10:30',
    unread: 0,
    messageType: 'progress',
    progressPreview: {
      progress: 60,
      phase: '功能开发'
    }
  }
])

// 好友/商户
const friendConversations = ref([
  {
    id: 'friend_1',
    type: 'merchant',
    name: '李四（餐饮商户）',
    avatar: '',
    online: false,
    lastMessage: '这个小程序模板不错，我也想做一个',
    time: '09:45',
    unread: 1
  },
  {
    id: 'friend_2',
    type: 'friend',
    name: '王五',
    avatar: '',
    online: true,
    lastMessage: '好的，到时候联系',
    time: '昨天',
    unread: 0
  }
])

// 团队群组
const teamConversations = ref([
  {
    id: 'team_1',
    type: 'team',
    name: '运营团队群',
    memberCount: 5,
    lastSender: '李四',
    lastMessage: '@所有人 今天下午3点开会',
    time: '08:30',
    unread: 2
  },
  {
    id: 'team_2',
    type: 'team',
    name: '技术开发组',
    memberCount: 3,
    lastSender: '张三',
    lastMessage: '接口文档已经更新了',
    time: '昨天',
    unread: 0
  }
])

// 判断当前Tab是否为空
const isCurrentTabEmpty = computed(() => {
  switch (activeTab.value) {
    case 'all':
      return false
    case 'service':
      return serviceConversations.value.length === 0
    case 'friend':
      return friendConversations.value.length === 0
    case 'team':
      return teamConversations.value.length === 0
    default:
      return true
  }
})

// 切换Tab
const switchTab = (tab: string) => {
  activeTab.value = tab
}

// 打开会话
const openConversation = (item: any) => {
  console.log('[消息] 打开会话:', item)

  // 判断是否为系统通知类型（system/order/notice）
  const isSystemNotice = item.type === 'system' || item.type === 'order' || item.type === 'notice'

  if (isSystemNotice) {
    // 系统通知：打开平台消息页面，显示平台消息标签
    const url = `/pages/message/platform-messages`
    console.log('[消息] 跳转到平台消息页面:', url)
    uni.navigateTo({
      url: url,
      success: () => {
        console.log('[消息] 跳转成功')
      },
      fail: (err: any) => {
        console.error('[消息] 跳转失败:', err)
      }
    })
  } else {
    // 客服/好友/群组：打开聊天页面，传入会话信息
    const url = `/pages/message/platform-messages?id=${item.id}&type=${item.type}&name=${encodeURIComponent(item.name || item.title)}`
    console.log('[消息] 跳转到聊天页面:', url)
    uni.navigateTo({
      url: url,
      success: () => {
        console.log('[消息] 跳转成功')
      },
      fail: (err: any) => {
        console.error('[消息] 跳转失败:', err)
      }
    })
  }
}

// 显示添加菜单
const showAddMenu = () => {
  showAddModal.value = true
}

// 隐藏添加菜单
const hideAddMenu = () => {
  showAddModal.value = false
}

// 添加好友
const addFriend = () => {
  hideAddMenu()
  uni.showToast({
    title: '添加好友功能开发中',
    icon: 'none'
  })
}

// 创建群组
const createGroup = () => {
  hideAddMenu()
  uni.showToast({
    title: '创建群组功能开发中',
    icon: 'none'
  })
}

// 联系客服
const contactService = () => {
  hideAddMenu()
  uni.navigateTo({
    url: '/pages/message/chat?id=cs_1&type=customer_service&name=官方客服-小蜜'
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.message-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 0; // 移除，使用calc确保不被遮挡
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
    padding: 0 30rpx;

    .nav-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .nav-actions {
      .action-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }
    }
  }
}

// 搜索框
.search-bar {
  position: fixed;
  top: calc(var(--status-bar-height) + 88rpx);
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  z-index: 999;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .search-input-wrapper {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 40rpx;
    padding: 16rpx 30rpx;

    .search-icon {
      font-size: 32rpx;
      margin-right: 16rpx;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }
  }
}

// Tab栏
.tab-bar {
  position: fixed;
  top: calc(var(--status-bar-height) + 88rpx + 100rpx);
  left: 0;
  right: 0;
  display: flex;
  background: #fff;
  padding: 20rpx 30rpx;
  z-index: 998;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 10rpx 0;

    .tab-text {
      font-size: 28rpx;
      color: #666;
      transition: all 0.3s;
    }

    .tab-badge {
      position: absolute;
      top: 5rpx;
      right: 20rpx;
      min-width: 32rpx;
      height: 32rpx;
      line-height: 32rpx;
      text-align: center;
      background: #ff4444;
      color: #fff;
      border-radius: 16rpx;
      font-size: 20rpx;
      padding: 0 8rpx;
    }

    &.active {
      .tab-text {
        color: #667eea;
        font-weight: 600;
      }
    }
  }
}

// 会话列表
.conversation-list {
  padding-top: calc(var(--status-bar-height) + 88rpx + 100rpx + 80rpx);
  padding-bottom: 140rpx;
}

// 分组标题
.section-header {
  padding: 30rpx 30rpx 15rpx;

  .section-title {
    font-size: 24rpx;
    color: #999;
    font-weight: 500;
  }
}

// 会话项
.conversation-item {
  display: flex;
  padding: 24rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;

  &.pinned {
    background: #fafafa;
  }

  &:active {
    background: #f5f5f5;
  }

  .avatar-wrapper {
    position: relative;
    margin-right: 24rpx;

    .avatar {
      width: 96rpx;
      height: 96rpx;
      border-radius: 48rpx;
      overflow: hidden;

      &.default {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-text {
          font-size: 40rpx;
          color: #fff;
          font-weight: 600;
        }
      }

      &.system {
        background: #ff9500;
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-icon {
          font-size: 48rpx;
        }
      }

      &.third-party {
        background: #4cd964;
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-icon {
          font-size: 48rpx;
        }
      }

      &.group {
        background: #5ac8fa;
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-icon {
          font-size: 48rpx;
        }
      }
    }

    .online-dot {
      position: absolute;
      bottom: 6rpx;
      right: 6rpx;
      width: 20rpx;
      height: 20rpx;
      background: #07c160;
      border-radius: 10rpx;
      border: 4rpx solid #fff;
    }
  }

  .conversation-content {
    flex: 1;
    overflow: hidden;

    .conversation-header {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;

      .conversation-title {
        flex: 1;
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .tag {
        padding: 4rpx 12rpx;
        background: #e8eaf6;
        color: #667eea;
        font-size: 20rpx;
        border-radius: 8rpx;
        margin-left: 10rpx;
      }

      .member-count {
        font-size: 24rpx;
        color: #999;
        margin-left: 10rpx;
      }

      .conversation-time {
        font-size: 24rpx;
        color: #999;
        margin-left: auto;
      }
    }

    .conversation-preview {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .preview-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
      }

      .message-type-icon {
        font-size: 28rpx;
        margin-right: 8rpx;
        flex-shrink: 0;
      }

      .preview-text {
        flex: 1;
        font-size: 26rpx;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sender-name {
        font-size: 26rpx;
        color: #667eea;
        margin-right: 8rpx;
        flex-shrink: 0;
      }

      .unread-badge {
        min-width: 36rpx;
        height: 36rpx;
        line-height: 36rpx;
        text-align: center;
        background: #ff4444;
        color: #fff;
        border-radius: 18rpx;
        font-size: 20rpx;
        padding: 0 10rpx;
        margin-left: 16rpx;
        flex-shrink: 0;
      }
    }

    .card-preview {
      display: flex;
      align-items: center;
      margin-top: 12rpx;
      padding: 12rpx 16rpx;
      background: #f5f5f5;
      border-radius: 12rpx;

      .card-preview-icon {
        font-size: 32rpx;
        margin-right: 12rpx;
      }

      .card-preview-text {
        flex: 1;
        font-size: 24rpx;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .progress-preview {
      margin-top: 12rpx;

      .progress-bar {
        width: 100%;
        height: 8rpx;
        background: #f0f0f0;
        border-radius: 4rpx;
        overflow: hidden;
        margin-bottom: 8rpx;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s;
        }
      }

      .progress-text {
        font-size: 22rpx;
        color: #666;
      }
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

// 添加菜单弹窗
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
}

.add-menu {
  width: 100%;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 40rpx 30rpx;
  padding-bottom: 80rpx;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      font-size: 48rpx;
      margin-right: 30rpx;
    }

    .menu-label {
      font-size: 32rpx;
      color: #333;
    }
  }
}
</style>
