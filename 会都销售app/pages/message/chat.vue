<template>
  <view class="chat-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">{{ pageTitle }}</view>
        <view class="nav-more" @tap="goToChatInfo">
          <text class="more-icon">⋯</text>
        </view>
      </view>
    </view>

    <!-- 聊天气泡页面 -->
    <view class="chat-container">
      <chat-window
        :messages="chatMessages"
        :defaultSenderName="targetName"
        :avatarText="avatarTextChar"
        :showReadStatus="true"
        inputPlaceholder="'输入消息...'"
        :topOffset="'calc(' + statusBarHeight + 'px + 88rpx + 20rpx)'"
        @sendMessage="handleSendMessage"
        @chooseImage="chooseImage"
        @chooseFile="chooseFile"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatWindow from '@/components/chat/chat-window.vue'

// URL 参数
const conversationId = ref('')
const conversationType = ref('')
const conversationName = ref('')

// 状态栏高度
const statusBarHeight = ref(0)

// 当前激活的标签
const activeTab = ref<"platform" | "service">("platform")

// 页面标题
const pageTitle = ref('平台消息')

// 对方名称
const targetName = ref('客服')

// 头像文字
const avatarTextChar = ref('客')

// 标签配置
const tabs = ref([
  { label: '平台消息', value: 'platform' },
  { label: '客服消息', value: 'service' }
])

// 平台消息数据
const platformMessages = ref({
  system: [
    {
      id: 'sys_1',
      icon: '🔔',
      title: '系统通知',
      content: '您的小程序「零售商城」已通过审核',
      time: '10:30'
    }
  ],
  approval: [
    {
      id: 'appr_1',
      icon: '✅',
      title: '资质审批通过',
      content: '恭喜！您的企业资质已审核通过',
      time: '09:15'
    }
  ],
  progress: [
    {
      id: 'prog_1',
      icon: '⚙️',
      title: '开发进度',
      content: '当前进度：功能开发中 60%',
      miniProgramName: '张三的零售商城',
      progress: 60,
      stage: '功能开发',
      estimatedDate: '2025-03-20',
      time: '14:30'
    }
  ],
  launch: [
    {
      id: 'launch_1',
      icon: '🚀',
      title: '上架通知',
      content: '您的小程序已成功上架',
      miniProgramName: '李四的餐饮小程序',
      statusText: '已上架',
      time: '昨天'
    }
  ]
})

// 聊天消息数据
const chatMessages = ref([
  {
    id: 'chat_1',
    isSelf: false,
    senderName: '专属客服',
    content: '您好，我是您的专属客服，请问有什么可以帮您的吗？',
    time: '10:25',
    readStatus: 'read'
  },
  {
    id: 'chat_2',
    isSelf: true,
    content: '我想咨询一下小程序开发',
    time: '10:26',
    readStatus: 'read'
  },
  {
    id: 'chat_3',
    isSelf: false,
    senderName: '专属客服',
    content: '好的，那我先准备资料',
    time: '10:27',
    readStatus: 'read'
  }
])

// 切换标签
const switchTab = (tab: "platform" | "service"): void => {
  activeTab.value = tab
  // 更新页面标题
  if (tab === 'platform') {
    pageTitle.value = '平台消息'
  } else {
    pageTitle.value = '专属客服'
  }
}

// 处理发送消息
const handleSendMessage = (content: string) => {
  console.log('发送消息:', content)
  const newMessage = {
    id: `chat_${Date.now()}`,
    isSelf: true,
    content: content,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    readStatus: 'unread'
  }
  chatMessages.value.push(newMessage)
  uni.showToast({
    title: '发送成功',
    icon: 'success'
  })
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res: any) => {
      console.log('[聊天] 选择图片:', res.tempFilePaths[0])
      uni.showToast({
        title: '图片选择成功',
        icon: 'success'
      })
    }
  })
}

// 选择文件
const chooseFile = () => {
  uni.showToast({
    title: '文件功能开发中',
    icon: 'none'
  })
}

// 复制企业微信号
const copyWechatId = () => {
  uni.setClipboardData({
    data: 'platform_service_001',
    success: () => {
      uni.showToast({
        title: '已复制企业微信号',
        icon: 'success'
      })
    }
  })
}

// 查看进度详情
const viewProgressDetail = (msg: any) => {
  uni.showToast({
    title: '查看开发进度详情',
    icon: 'none'
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到聊天信息页面
const goToChatInfo = () => {
  const url = `/pages/message/chat-info?id=${conversationId.value}&type=${conversationType.value}&name=${encodeURIComponent(conversationName.value)}`
  uni.navigateTo({
    url: url
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage && currentPage.$page && currentPage.$page.options) {
    const options = currentPage.$page.options
    console.log('[聊天] 页面参数:', options)

    conversationId.value = options.id || ''
    conversationType.value = options.type || ''
    conversationName.value = options.name ? decodeURIComponent(options.name) : ''

    // 根据参数判断显示模式
    // 如果有 id 参数，说明是从消息列表跳转过来的，显示聊天模式
    // 如果没有 id 参数，显示平台消息模式
    if (options.id) {
      // 聊天模式
      pageTitle.value = conversationName.value || '聊天'
      targetName.value = conversationName.value || '客服'
      avatarTextChar.value = (conversationName.value || '客服').charAt(0)

      // 加载对应的聊天历史
      loadChatHistory()
    } else {
      // 平台消息模式
      activeTab.value = 'platform'
    }
  }
})

// 加载聊天历史记录
const loadChatHistory = () => {
  // 根据不同的对话ID/类型，返回不同的假数据
  if (conversationId.value === 'cs_1') {
    // 官方客服-小蜜
    chatMessages.value = [
      {
        id: 'chat_1',
        isSelf: false,
        senderName: '小蜜',
        content: '您好，我是小蜜，有什么可以帮您的吗？',
        time: '14:20',
        readStatus: 'read'
      }
    ]
  } else if (conversationId.value === 'cs_2') {
    // 售后客服-007
    chatMessages.value = [
      {
        id: 'chat_1',
        isSelf: false,
        senderName: '007',
        content: '您好，请问有什么可以帮您的吗？',
        time: '10:00',
        readStatus: 'read'
      },
      {
        id: 'chat_2',
        isSelf: true,
        content: '我想咨询小程序开发',
        time: '10:05',
        readStatus: 'read'
      }
    ]
  } else if (conversationId.value === 'friend_1') {
    // 李四（餐饮商户）
    chatMessages.value = [
      {
        id: 'chat_1',
        isSelf: false,
        senderName: '李四',
        content: '你好，这个小程序模板不错，我也想做一个',
        time: '09:45',
        readStatus: 'read'
      },
      {
        id: 'chat_2',
        isSelf: true,
        content: '好的，我们可以聊聊',
        time: '09:46',
        readStatus: 'unread'
      }
    ]
  } else if (conversationId.value === 'friend_2') {
    // 王五
    chatMessages.value = [
      {
        id: 'chat_1',
        isSelf: false,
        senderName: '王五',
        content: '最近怎么样？',
        time: '15:30',
        readStatus: 'read'
      },
      {
        id: 'chat_2',
        isSelf: true,
        content: '还不错，在忙什么',
        time: '15:32',
        readStatus: 'read'
      }
    ]
  } else {
    // 默认客服消息
    chatMessages.value = [
      {
        id: 'chat_1',
        isSelf: false,
        senderName: '专属客服',
        content: '您好，我是您的专属客服，请问有什么可以帮您的吗？',
        time: '10:25',
        readStatus: 'read'
      }
    ]
  }

  console.log('[聊天] 加载聊天历史:', conversationId.value, conversationName.value, chatMessages.value.length)
}
</script>

<style scoped lang="scss">
.chat-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
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
  }

  .nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .back-icon {
      font-size: 40rpx;
      color: #fff;
      font-weight: bold;
    }

    &:active {
      opacity: 0.7;
    }
  }

  .nav-tabs {
    flex: 1;
    display: flex;
    gap: 20rpx;
  }

  .tab-item {
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    transition: all 0.3s;

    .tab-text {
      font-size: 28rpx;
      color: #fff;
    }

    &.active {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .nav-title {
    font-size: 32rpx;
    color: #fff;
    font-weight: 600;
    flex: 1;
    text-align: center;
  }

  .nav-more {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      opacity: 0.7;
    }

    .more-icon {
      font-size: 40rpx;
      color: #fff;
      font-weight: bold;
    }
  }
}

// 聊天内容区域
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// 平台消息内容
.chat-content {
  flex: 1;
  overflow-y: auto;
  padding-top: calc(var(--status-bar-height) + 88rpx);
}

// 企业微信号展示栏
.customer-service-bar {
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #e5e5e5;

  .service-label {
    font-size: 24rpx;
    color: #667eea;
    font-weight: 600;
  }

  .wechat-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10rpx;

    .wechat-icon {
      font-size: 32rpx;
    }

    .wechat-label {
      font-size: 26rpx;
      color: #333;
    }

    .copy-hint {
      font-size: 22rpx;
      color: #999;
    }

    &:active {
      opacity: 0.7;
    }
  }
}

// 平台消息列表
.platform-messages {
  padding: 20rpx 30rpx;
  padding-bottom: 20rpx;
}

.message-group {
  margin-bottom: 30rpx;
}

.group-title {
  font-size: 24rpx;
  color: #999;
  font-weight: 500;
  margin-bottom: 15rpx;
  padding-left: 10rpx;
}

.message-item {
  margin-bottom: 20rpx;
}

// 系统消息样式
.system-bubble {
  background: #f0f0f0;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  gap: 12rpx;

  .system-icon {
    font-size: 40rpx;
    flex-shrink: 0;
  }

  .system-content {
    flex: 1;

    .system-title {
      font-size: 26rpx;
      color: #667eea;
      font-weight: 600;
      margin-bottom: 6rpx;
    }

    .system-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.5;
    }

    .system-time {
      font-size: 20rpx;
      color: #999;
      margin-left: auto;
    }
  }
}

// 审批结果样式
.approval {
  display: flex;
  justify-content: flex-start;
}

.approval-bubble {
  background: #fff;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  gap: 15rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  .approval-icon {
    font-size: 40rpx;
    flex-shrink: 0;
  }

  .approval-content {
    flex: 1;

    .approval-title {
      font-size: 26rpx;
      color: #333;
      font-weight: 600;
      margin-bottom: 6rpx;
    }

    .approval-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.5;
    }

    .approval-time {
      font-size: 20rpx;
      color: #999;
      margin-left: auto;
    }
  }
}

// 进度卡片样式
.progress-card {
  background: #fff;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  &:active {
    box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.15);
  }
}

.card-header {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .card-icon {
    font-size: 40rpx;
    margin-right: 12rpx;
  }
}

.card-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
}

.card-body {
  padding: 20rpx;
}

.progress-info {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;

  .progress-label {
    font-size: 24rpx;
    color: #666;
    margin-right: 10rpx;
  }

  .progress-value {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
  }
}

.progress-bar-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.progress-bar {
  flex: 1;
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-right: 16rpx;

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s;
    border-radius: 6rpx;
  }
}

.progress-percent {
  font-size: 22rpx;
  color: #667eea;
  font-weight: 600;
  min-width: 50rpx;
}

.card-footer {
  padding: 16rpx 20rpx;
  display: flex;
  justify-content: flex-end;
}

.card-time {
  font-size: 20rpx;
  color: #999;
}

// 上架卡片样式
.launch-card {
  background: #fff;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.launch-header {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.launch-body {
  flex: 1;
}

.launch-info {
  margin-bottom: 12rpx;

  .launch-label {
    font-size: 24rpx;
    color: #666;
    margin-right: 10rpx;
  }

  .launch-value {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
  }
}

.launch-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.status-icon {
  font-size: 32rpx;
}

.status-text {
  font-size: 24rpx;
  color: #07c160;
  font-weight: 500;
}

.card-time {
  font-size: 20rpx;
  color: #999;
  margin-top: auto;
}
</style>
