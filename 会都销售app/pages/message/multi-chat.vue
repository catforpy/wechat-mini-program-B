<template>
  <view class="multi-chat-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">多人聊天</view>
        <view class="nav-more" @tap="goToChatInfo">
          <text class="more-icon">⋯</text>
        </view>
      </view>
    </view>

    <!-- 聊天内容区域 -->
    <view class="chat-container">
      <chat-window
        :messages="chatMessages"
        :defaultSenderName="groupTitle"
        :avatarText="'群'"
        :showReadStatus="true"
        inputPlaceholder="'输入消息...'"
        :topOffset="'calc(' + statusBarHeight + 'px + 88rpx)'"
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

// 状态栏高度
const statusBarHeight = ref(0)

// 群聊标题
const groupTitle = ref('群聊')

// 群聊消息数据（多人聊天模式）
const chatMessages = ref([
  {
    id: 'chat_1',
    isSelf: false,
    senderName: '张三',
    content: '大家好',
    time: '09:00',
    readStatus: 'read'
  },
  {
    id: 'chat_2',
    isSelf: false,
    senderName: '李四',
    content: '在吗',
    time: '09:02',
    readStatus: 'read'
  },
  {
    id: 'chat_3',
    isSelf: true,
    content: '我在',
    time: '09:05',
    readStatus: 'read'
  },
  {
    id: 'chat_4',
    isSelf: false,
    senderName: '王五',
    content: '好的',
    time: '09:10',
    readStatus: 'read'
  }
])

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到聊天信息页面
const goToChatInfo = () => {
  uni.navigateTo({
    url: '/pages/message/chat-info'
  })
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
      console.log('[多人聊天] 选择图片:', res.tempFilePaths[0])
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

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // TODO: 获取之前选择的好友/商户，显示在群聊中
  // 目前显示假数据
  console.log('[多人聊天] 页面加载')
})
</script>

<style scoped lang="scss">
.multi-chat-page {
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

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
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
</style>
