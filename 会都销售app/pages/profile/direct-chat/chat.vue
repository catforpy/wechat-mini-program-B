<template>
  <view class="chat-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="nav-actions">
          <text class="action-dot">···</text>
          <text class="action-dot">⋮</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 对方名片卡片 (1对1) -->
      <view v-if="chatType === 'single'" class="header-card single-card">
        <view class="card-header" @tap="showCardDetail">
          <view class="card-icon-wrapper">
            <text class="card-icon">🏢</text>
          </view>
          <view class="card-info">
            <text class="card-name">{{ targetInfo.name }}</text>
            <text class="card-detail">行业: {{ targetInfo.industry }} | 用途: {{ targetInfo.purpose }}</text>
            <text class="card-address">{{ targetInfo.address }}</text>
          </view>
          <text class="expand-icon">↓</text>
        </view>
      </view>

      <!-- 群信息卡片 (群聊) -->
      <view v-else class="header-card group-card">
        <view class="card-header" @tap="showGroupDetail">
          <view class="card-icon-wrapper">
            <text class="card-icon">👥</text>
          </view>
          <view class="card-info">
            <text class="card-name">{{ groupInfo.displayName }}</text>
            <text class="card-owner">🏢 {{ groupInfo.ownerName }}</text>
            <text class="card-members">成员: {{ groupInfo.memberCount }}人</text>
          </view>
          <text class="expand-icon">↓</text>
        </view>
      </view>

      <!-- 消息列表 -->
      <view class="message-list">
        <view
          v-for="message in messages"
          :key="message.id"
          class="message-item"
          :class="{ 'is-me': message.isMe }"
        >
          <!-- 对方消息 -->
          <view v-if="!message.isMe" class="message-row other-message">
            <view class="sender-avatar">
              <text class="avatar-emoji">{{ message.senderEmoji || '👤' }}</text>
            </view>
            <view class="message-content-wrapper">
              <text v-if="message.senderCard" class="sender-card-tag">{{ message.senderCard }}</text>
              <view class="message-bubble">
                <text class="message-text">{{ message.content }}</text>
              </view>
              <text class="message-time">{{ message.time }}</text>
            </view>
          </view>

          <!-- 我的消息 -->
          <view v-else class="message-row my-message">
            <view class="message-content-wrapper">
              <text v-if="message.myCard" class="my-card-tag">{{ message.myCard }}</text>
              <view class="message-bubble">
                <text class="message-text">{{ message.content }}</text>
              </view>
              <text class="message-time">{{ message.time }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入栏 -->
    <view class="input-bar" :style="{ bottom: inputBarBottom + 'px' }">
      <view class="identity-selector">
        <view
          class="identity-item"
          :class="{ active: currentIdentity === 'personal' }"
          @tap="selectIdentity('personal')"
        >
          <text class="identity-icon">👤</text>
        </view>
        <view
          class="identity-item"
          :class="{ active: currentIdentity === 'company' }"
          @tap="selectIdentity('company')"
        >
          <text class="identity-icon">🏢</text>
        </view>
        <view
          class="identity-item"
          :class="{ active: currentIdentity === 'individual' }"
          @tap="selectIdentity('individual')"
        >
          <text class="identity-icon">🏪</text>
        </view>
      </view>

      <view class="input-wrapper">
        <view class="action-btn">
          <text>🎤</text>
        </view>
        <view class="action-btn">
          <text>📷</text>
        </view>
        <input
          class="message-input"
          type="text"
          placeholder="请输入消息..."
          v-model="inputText"
          @confirm="sendMessage"
        />
        <view class="action-btn">
          <text>📎</text>
        </view>
        <view class="send-btn" @tap="sendMessage">
          <text class="send-text">发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)
const inputBarBottom = ref(0)

// 聊天类型：single 或 group
const chatType = ref<'single' | 'group'>('single')

// 当前选择的身份
const currentIdentity = ref<'personal' | 'company' | 'individual'>('personal')

// 输入框文本
const inputText = ref('')

// 1对1 聊天对象信息
const targetInfo = ref({
  name: '北京科技创新有限公司',
  industry: 'IT科技',
  purpose: '招聘',
  address: '北京市朝阳区建国路88号'
})

// 群聊信息
const groupInfo = ref({
  name: 'IT技术交流群',
  displayName: 'IT技术交流群(北京科技...)',
  ownerName: '北京科技创新有限公司',
  memberCount: 128
})

// 消息数据接口
interface Message {
  id: string
  isMe: boolean
  content: string
  time: string
  senderEmoji?: string
  senderCard?: string
  myCard?: string
}

// 模拟消息数据
const messages = ref<Message[]>([
  {
    id: 'msg_001',
    isMe: false,
    content: '您好，请问还在招聘前端工程师吗？',
    time: '10:25',
    senderEmoji: '🏢',
    senderCard: '企业'
  },
  {
    id: 'msg_002',
    isMe: true,
    content: '是的，我们在招聘，有兴趣可以发简历',
    time: '10:28',
    myCard: '个人'
  },
  {
    id: 'msg_003',
    isMe: true,
    content: '📎 我的个人名片.pdf',
    time: '10:30',
    myCard: '个人'
  }
])

// 选择身份
const selectIdentity = (identity: 'personal' | 'company' | 'individual') => {
  currentIdentity.value = identity
  console.log('切换身份:', identity)
}

// 发送消息
const sendMessage = () => {
  if (!inputText.value.trim()) return

  const newMessage: Message = {
    id: 'msg_' + Date.now(),
    isMe: true,
    content: inputText.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    myCard: currentIdentity.value === 'personal' ? '个人' : currentIdentity.value === 'company' ? '企业' : '个体'
  }

  messages.value.push(newMessage)
  inputText.value = ''

  // 滚动到底部
  setTimeout(() => {
    uni.pageScrollTo({
      scrollTop: 999999,
      duration: 300
    })
  }, 100)
}

// 显示卡片详情
const showCardDetail = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/chat-info-single'
  })
}

// 显示群详情
const showGroupDetail = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/group-info'
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
  inputBarBottom.value = systemInfo.safeAreaInsets?.bottom || 0

  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  // 获取聊天类型和ID
  if (options.type) {
    chatType.value = options.type
  }
  if (options.id) {
    console.log('聊天ID:', options.id)
    // TODO: 根据 ID 加载聊天数据
  }

  // 模拟群聊数据
  if (chatType.value === 'group') {
    messages.value = [
      {
        id: 'msg_001',
        isMe: false,
        content: '大家好，我是新来的',
        time: '10:25',
        senderEmoji: '👤',
        senderCard: '张三[个人]'
      },
      {
        id: 'msg_002',
        isMe: false,
        content: '欢迎欢迎！',
        time: '10:26',
        senderEmoji: '🏢',
        senderCard: '李四[北京科技]'
      },
      {
        id: 'msg_003',
        isMe: false,
        content: '请问Vue3的Composition API怎么使用？',
        time: '10:28',
        senderEmoji: '🏪',
        senderCard: '王五[朝阳工作室]'
      },
      {
        id: 'msg_004',
        isMe: true,
        content: '我来解答一下...',
        time: '10:30',
        myCard: '个人'
      }
    ]
  }
})
</script>

<style scoped lang="scss">
.chat-page {
  min-height: 100vh;
  background-color: #f5f5f5;
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

    .nav-actions {
      display: flex;
      gap: 20rpx;

      .action-dot {
        font-size: 32rpx;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

// 主内容区域
.main-content {
  flex: 1;
  padding-bottom: 120rpx;
}

// 头部卡片
.header-card {
  margin: 20rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .card-header {
    display: flex;
    align-items: center;

    .card-icon-wrapper {
      width: 80rpx;
      height: 80rpx;
      border-radius: 12rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;

      .card-icon {
        font-size: 40rpx;
      }
    }

    .card-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6rpx;

      .card-name {
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
      }

      .card-detail, .card-owner, .card-members, .card-address {
        font-size: 24rpx;
        color: #999;
      }
    }

    .expand-icon {
      font-size: 24rpx;
      color: #999;
      margin-left: 12rpx;
    }
  }
}

// 群卡片特殊样式
.group-card .card-icon-wrapper {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
}

// 消息列表
.message-list {
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;

  .message-item {
    .message-row {
      display: flex;
      align-items: flex-start;
      gap: 16rpx;

      &.other-message {
        flex-direction: row;

        .sender-avatar {
          width: 64rpx;
          height: 64rpx;
          border-radius: 8rpx;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          .avatar-emoji {
            font-size: 32rpx;
          }
        }

        .message-content-wrapper {
          max-width: 500rpx;

          .sender-card-tag {
            font-size: 20rpx;
            color: #667eea;
            margin-bottom: 4rpx;
            display: block;
          }

          .message-bubble {
            background: #fff;
            border-radius: 12rpx;
            padding: 20rpx;
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

            .message-text {
              font-size: 28rpx;
              color: #333;
              line-height: 1.5;
            }
          }

          .message-time {
            font-size: 20rpx;
            color: #bbb;
            margin-top: 8rpx;
            display: block;
          }
        }
      }

      &.my-message {
        flex-direction: row-reverse;

        .message-content-wrapper {
          max-width: 500rpx;
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          .my-card-tag {
            font-size: 20rpx;
            color: #9c27b0;
            margin-bottom: 4rpx;
          }

          .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12rpx;
            padding: 20rpx;
            box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);

            .message-text {
              font-size: 28rpx;
              color: #fff;
              line-height: 1.5;
            }
          }

          .message-time {
            font-size: 20rpx;
            color: #bbb;
            margin-top: 8rpx;
          }
        }
      }
    }
  }
}

// 底部输入栏
.input-bar {
  position: fixed;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1rpx solid #e5e5e5;
  padding: 16rpx 20rpx;
  z-index: 999;

  .identity-selector {
    display: flex;
    gap: 16rpx;
    margin-bottom: 16rpx;

    .identity-item {
      width: 56rpx;
      height: 56rpx;
      border-radius: 8rpx;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;

      &:active {
        transform: scale(0.9);
      }

      .identity-icon {
        font-size: 28rpx;
      }

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
      }
    }
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .action-btn {
      width: 56rpx;
      height: 56rpx;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;

      &:active {
        background: #e0e0e0;
      }
    }

    .message-input {
      flex: 1;
      height: 72rpx;
      background: #f5f5f5;
      border-radius: 36rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
    }

    .send-btn {
      padding: 16rpx 32rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 36rpx;
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);

      &:active {
        opacity: 0.8;
      }

      .send-text {
        font-size: 28rpx;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}
</style>
