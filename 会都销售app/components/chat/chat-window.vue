<template>
  <view class="chat-window">
    <!-- 聊天消息列表 -->
    <scroll-view class="chat-messages" scroll-y :scroll-into-view="scrollIntoView" :style="{ paddingTop: topOffset }">
      <!-- 时间戳 -->
      <view
        v-for="(msg, idx) in messages"
        :key="'time-' + msg.id"
      >
        <view
          v-if="shouldShowTimestamp(msg, idx)"
          class="timestamp-row"
        >
          <text class="timestamp-text">{{ msg.time }}</text>
        </view>

        <!-- 消息行 -->
        <view
          :key="msg.id"
          :id="'msg-' + msg.id"
          :class="['message-row', msg.isSelf ? 'self-msg' : 'other-msg']"
        >
          <!-- 对方消息（左侧） -->
          <template v-if="!msg.isSelf">
            <view class="avatar-left">
              <view class="avatar customer">
                <text class="avatar-text">{{ avatarText }}</text>
              </view>
            </view>
            <view class="msg-content-left">
              <view class="sender-name">{{ msg.senderName || defaultSenderName }}</view>
              <view class="bubble-left">
                <text class="bubble-text">{{ msg.content }}</text>
              </view>
            </view>
          </template>

          <!-- 自己的消息（右侧） -->
          <template v-else>
            <view class="msg-content-right">
              <view class="bubble-and-status-right">
                <view v-if="showReadStatus" class="read-status-left">
                  <text v-if="msg.readStatus === 'read'" class="read-text">已读</text>
                  <text v-else class="unread-text">未读</text>
                </view>
                <view class="bubble-right">
                  <text class="bubble-text">{{ msg.content }}</text>
                </view>
                <view class="avatar-right">
                  <view class="avatar self">
                    <text class="avatar-text">我</text>
                  </view>
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入栏 -->
    <view class="input-bar">
      <view class="input-tools">
        <view class="action-btn" @tap="onChooseImage">
          <text class="action-icon">🔊</text>
        </view>
        <view class="action-btn" @tap="onChooseFile">
          <text class="action-icon">⊕</text>
        </view>
        <!-- 更多菜单按钮 -->
        <view class="more-btn" @tap="onShowMoreMenu">
          <text class="more-icon">⋯</text>
        </view>
      </view>
      <input
        v-model="inputContent"
        class="message-input"
        type="text"
        :placeholder="inputPlaceholder"
        :confirm-type="'send'"
        @confirm="onSendMessage"
      />
      <button class="send-btn" :class="{ active: inputContent.trim() }" @tap="onSendMessage">
        发送
      </button>
    </view>
  </view>

  <!-- 更多菜单弹窗 -->
  <view v-if="showMoreMenu" class="more-menu-overlay" @tap="hideMoreMenu">
    <view class="more-menu" @tap.stop>
      <view class="menu-item" @tap="onAddMember">
        <text class="menu-icon">👤</text>
        <text class="menu-label">添加人员</text>
      </view>
      <view class="menu-item" @tap="onShowGroupInfo">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-label">查看群信息</text>
      </view>
      <view class="menu-item" @tap="onClearHistory">
        <text class="menu-icon">🗑️</text>
        <text class="menu-label">清空记录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

// Props
interface Props {
  messages?: any[]
  defaultSenderName?: string
  avatarText?: string
  showReadStatus?: boolean
  inputPlaceholder?: string
  topOffset?: string  // 顶部偏移量，用于避开导航栏
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  defaultSenderName: '客服',
  avatarText: '客',
  showReadStatus: true,
  inputPlaceholder: '输入消息...',
  topOffset: '0px'
})

// Emits
const emit = defineEmits<{
  sendMessage: [content: string]
  chooseImage: []
  chooseFile: []
  showMoreMenu: []
  onAddMember: []
}>()

// 状态
const inputContent = ref('')
const scrollIntoView = ref('')
const showMoreMenu = ref(false)

// 计算是否需要显示时间戳（间隔超过2分钟）
const shouldShowTimestamp = (message: any, index: number) => {
  // 第一条消息总是显示时间
  if (index === 0) return true

  // 获取上一条消息
  const prevMessage = props.messages?.[index - 1]
  if (!prevMessage) return true

  const currentMsgTime = message.time
  const prevMsgTime = prevMessage.time

  // 如果没有上一条消息的时间，显示当前时间
  if (!prevMsgTime) return true

  // 解析时间并计算差值（分钟）
  const [currHours, currMins] = currentMsgTime.split(':').map(Number)
  const currentMinutes = currHours * 60 + currMins

  const [prevHours, prevMins] = prevMsgTime.split(':').map(Number)
  const prevMinutes = prevHours * 60 + prevMins

  // 计算时间差（分钟）
  const diffMinutes = currentMinutes - prevMinutes

  // 超过2分钟才显示时间戳
  return diffMinutes > 2 || diffMinutes < 0
}

// 发送消息
const onSendMessage = () => {
  if (!inputContent.value.trim()) {
    return
  }

  // 触发发送消息事件
  emit('sendMessage', inputContent.value)

  // 清空输入框
  inputContent.value = ''

  // 滚动到底部
  nextTick(() => {
    setTimeout(() => {
      // 滚动到最后一条消息
      const lastMessage = props.messages?.[props.messages.length - 1]
      if (lastMessage) {
        scrollIntoView.value = `msg-${lastMessage.id}`
      }
    }, 100)
  })
}

// 选择图片
const onChooseImage = () => {
  emit('chooseImage')
}

// 选择文件
const onChooseFile = () => {
  emit('chooseFile')
}

// 显示更多菜单
const onShowMoreMenu = () => {
  showMoreMenu.value = true
}

// 隐藏更多菜单
const hideMoreMenu = () => {
  showMoreMenu.value = false
}

// 添加人员
const onAddMember = () => {
  console.log('[聊天] 点击添加人员')
  showMoreMenu.value = false
  emit('showAddMember')
  uni.showToast({
    title: '请前往好友列表添加',
    icon: 'none'
  })
}

// 查看群信息
const onShowGroupInfo = () => {
  console.log('[聊天] 点击查看群信息')
  showMoreMenu.value = false
  uni.showToast({
    title: '群成员信息',
    icon: 'none'
  })
}

// 清空记录
const onClearHistory = () => {
  console.log('[聊天] 点击清空记录')
  showMoreMenu.value = false
  uni.showToast({
    title: '清空成功',
    icon: 'success'
  })
}
</script>

<style scoped lang="scss">
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

// 聊天消息列表
.chat-messages {
  flex: 1;
  padding: 20rpx 24rpx;
  padding-top: 20rpx;
  overflow-y: auto;
  padding-bottom: 120rpx;
  background: #f5f5f5;
}

// 时间戳样式
.timestamp-row {
  display: flex;
  justify-content: center;
  padding: 16rpx 0;
}

.timestamp-text {
  font-size: 24rpx;
  color: #999;
  background: rgba(0, 0, 0, 0.05);
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

// 消息行样式
.message-row {
  display: flex;
  margin-bottom: 30rpx;
  align-items: flex-start;

  &.other-msg {
    justify-content: flex-start;
  }

  &.self-msg {
    justify-content: flex-end;
  }
}

// 左侧头像（对方）
.avatar-left {
  margin-right: 16rpx;
  flex-shrink: 0;
}

// 右侧头像（自己）
.avatar-right {
  margin-left: 16rpx;
  flex-shrink: 0;
}

// 左侧消息内容
.msg-content-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 500rpx;
}

// 右侧消息内容
.msg-content-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
}

// 昵称样式
.sender-name {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

// 泡泡和状态容器（右侧）
.bubble-and-status-right {
  display: flex;
  align-items: flex-end;
  gap: 12rpx;
}

// 已读/未读状态（左侧）
.read-status-left {
  display: flex;
  align-items: center;
  margin-right: 12rpx;

  .read-text {
    font-size: 22rpx;
    color: #999;
  }

  .unread-text {
    font-size: 22rpx;
    color: #fa5151;
  }
}

// 左侧气泡（白色）
.bubble-left {
  background: #fff;
  padding: 20rpx 24rpx;
  border-radius: 8rpx;
  position: relative;
  max-width: 100%;

  &::before {
    content: '';
    position: absolute;
    left: -12rpx;
    top: 24rpx;
    width: 0;
    height: 0;
    border-top: 12rpx solid transparent;
    border-bottom: 12rpx solid transparent;
    border-right: 12rpx solid #fff;
  }
}

.bubble-text {
  font-size: 30rpx;
  color: #333;
  line-height: 1.6;
  word-wrap: break-word;
}

// 右侧气泡（绿色）
.bubble-right {
  background: #95ec69;
  padding: 20rpx 24rpx;
  border-radius: 8rpx;
  position: relative;
  max-width: 100%;

  &::after {
    content: '';
    position: absolute;
    right: -12rpx;
    top: 24rpx;
    width: 0;
    height: 0;
    border-top: 12rpx solid transparent;
    border-bottom: 12rpx solid transparent;
    border-left: 12rpx solid #95ec69;
  }
}

// 头像样式
.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.customer {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    .avatar-text {
      font-size: 24rpx;
      color: #fff;
      font-weight: 500;
    }
  }

  &.self {
    background: #ffc773;

    .avatar-text {
      font-size: 24rpx;
      color: #fff;
      font-weight: 500;
    }
  }
}

// 底部输入栏
.input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f7f7f7;
  border-top: 1rpx solid #e5e5e5;
  padding: 16rpx 20rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 16rpx;
  z-index: 100;
}

.input-tools {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .action-icon {
    font-size: 44rpx;
  }

  &:active {
    opacity: 0.6;
  }
}

.message-input {
  flex: 1;
  height: 72rpx;
  background: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  color: #333;
}

.send-btn {
  width: 120rpx;
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  background: #f7f7f7;
  color: #999;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
  padding: 0;
  margin: 0;

  &.active {
    background: #07c160;
    color: #fff;
    border-color: #07c160;
  }

  &:disabled {
    opacity: 0.5;
  }

  &:active {
    opacity: 0.8;
  }
}

// 更多菜单按钮
.more-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;

  &:active {
    opacity: 0.7;
  }

  .more-icon {
    font-size: 40rpx;
    color: #fff;
    font-weight: bold;
  }
}

// 更多菜单弹窗
.more-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  padding: 20rpx;
}

.more-menu {
  position: absolute;
  top: 100rpx;
  right: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  min-width: 280rpx;
  overflow: hidden;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 24rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: #f5f5f5;

      .menu-label {
        color: #fff;
      }
    }

    .menu-icon {
      font-size: 36rpx;
      margin-right: 16rpx;
    }

    .menu-label {
      font-size: 28rpx;
      color: #333;
    flex: 1;
    }
  }
}
</style>
