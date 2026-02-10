<template>
  <view class="chat-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-info" @tap="showUserInfo">
          <text class="nav-title">{{ chatName }}</text>
          <text v-if="online" class="nav-status">在线</text>
        </view>
        <view class="nav-actions" @tap="showMoreActions">
          <text class="action-icon">⋮</text>
        </view>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="message-list" scroll-y :scroll-into-view="scrollIntoView" :scroll-with-animation="true">
      <!-- 时间分隔 -->
      <view class="time-divider">
        <text class="time-text">今天 14:20</text>
      </view>

      <!-- 系统欢迎消息 -->
      <view class="message-item system">
        <view class="message-bubble system">
          <text class="system-text">官方客服-小蜜 为您服务</text>
        </view>
      </view>

      <!-- 客服消息 -->
      <view id="msg-1" class="message-item received">
        <view class="avatar-wrapper">
          <view class="avatar default">
            <text class="avatar-text">客</text>
          </view>
        </view>
        <view class="message-content">
          <view class="message-bubble received">
            <text class="message-text">您好，我是您的专属客服，请问有什么可以帮您的吗？</text>
          </view>
          <text class="message-time">14:20</text>
        </view>
      </view>

      <!-- 用户消息 -->
      <view id="msg-2" class="message-item sent">
        <view class="message-content">
          <view class="message-bubble sent">
            <text class="message-text">我想咨询一下小程序开发进度</text>
          </view>
          <text class="message-time">14:21</text>
        </view>
      </view>

      <!-- 客服消息 -->
      <view id="msg-3" class="message-item received">
        <view class="avatar-wrapper">
          <view class="avatar default">
            <text class="avatar-text">客</text>
          </view>
        </view>
        <view class="message-content">
          <view class="message-bubble received">
            <text class="message-text">好的，我帮您查询一下</text>
          </view>
          <text class="message-time">14:22</text>
        </view>
      </view>

      <!-- 进度卡片消息 -->
      <view id="msg-4" class="message-item received">
        <view class="avatar-wrapper">
          <view class="avatar default">
            <text class="avatar-text">客</text>
          </view>
        </view>
        <view class="message-content">
          <view class="message-card progress-card">
            <view class="card-header">
              <text class="card-icon">📊</text>
              <text class="card-title">小程序开发进度</text>
            </view>
            <view class="card-body">
              <view class="progress-info">
                <text class="progress-label">小程序名称：</text>
                <text class="progress-value">张三的零售商城</text>
              </view>
              <view class="progress-bar-wrapper">
                <view class="progress-bar">
                  <view class="progress-fill" style="width: 60%"></view>
                </view>
                <text class="progress-percent">60%</text>
              </view>
              <view class="progress-info">
                <text class="progress-label">当前阶段：</text>
                <text class="progress-value">功能开发</text>
              </view>
              <view class="progress-info">
                <text class="progress-label">预计完成：</text>
                <text class="progress-value">2025-02-20</text>
              </view>
            </view>
            <view class="card-footer">
              <button class="card-btn" @tap="viewDetail">查看详情</button>
            </view>
          </view>
          <text class="message-time">14:23</text>
        </view>
      </view>

      <!-- 用户消息 -->
      <view id="msg-5" class="message-item sent">
        <view class="message-content">
          <view class="message-bubble sent">
            <text class="message-text">好的，谢谢</text>
          </view>
          <text class="message-time">14:25</text>
        </view>
      </view>

      <!-- 商品卡片消息 -->
      <view id="msg-6" class="message-item received">
        <view class="avatar-wrapper">
          <view class="avatar default">
            <text class="avatar-text">客</text>
          </view>
        </view>
        <view class="message-content">
          <view class="message-card product-card">
            <view class="product-header">
              <view class="product-icon">📦</view>
              <view class="product-info">
                <text class="product-name">零售电商模板</text>
                <text class="product-desc">完整的电商解决方案</text>
              </view>
            </view>
            <view class="product-meta">
              <text class="product-price">¥2,799.00</text>
              <text class="product-status">已售出 128 件</text>
            </view>
            <view class="product-tags">
              <text class="tag">电商</text>
              <text class="tag">零售</text>
            </view>
          </view>
          <text class="message-time">14:26</text>
        </view>
      </view>

      <!-- 订单卡片消息 -->
      <view id="msg-7" class="message-item received">
        <view class="avatar-wrapper">
          <view class="avatar default">
            <text class="avatar-text">客</text>
          </view>
        </view>
        <view class="message-content">
          <view class="message-card order-card">
            <view class="order-header">
              <text class="order-icon">📋</text>
              <text class="order-title">订单详情</text>
            </view>
            <view class="order-body">
              <view class="order-row">
                <text class="order-label">订单号：</text>
                <text class="order-value">ORDER20250209001</text>
              </view>
              <view class="order-row">
                <text class="order-label">订单金额：</text>
                <text class="order-value amount">¥2,799.00</text>
              </view>
              <view class="order-row">
                <text class="order-label">订单状态：</text>
                <view class="order-status-badge approved">审核通过</view>
              </view>
              <view class="order-row">
                <text class="order-label">创建时间：</text>
                <text class="order-value">2025-02-09 14:30</text>
              </view>
            </view>
          </view>
          <text class="message-time">14:27</text>
        </view>
      </view>
    </scroll-view>

    <!-- 快捷回复栏（客服场景） -->
    <view v-if="isCustomerService" class="quick-replies">
      <scroll-view class="reply-list" scroll-x>
        <view class="reply-item" @tap="sendQuickReply('我想咨询小程序开发')">
          <text class="reply-text">我想咨询小程序开发</text>
        </view>
        <view class="reply-item" @tap="sendQuickReply('订单进度查询')">
          <text class="reply-text">订单进度查询</text>
        </view>
        <view class="reply-item" @tap="sendQuickReply('需要技术支持')">
          <text class="reply-text">需要技术支持</text>
        </view>
        <view class="reply-item" @tap="sendQuickReply('其他问题')">
          <text class="reply-text">其他问题</text>
        </view>
      </scroll-view>
    </view>

    <!-- 底部输入栏 -->
    <view class="input-bar">
      <view class="input-tools">
        <text class="tool-icon" @tap="chooseImage">📷</text>
        <text class="tool-icon" @tap="chooseFile">📎</text>
      </view>
      <view class="input-wrapper">
        <input
          v-model="inputText"
          class="message-input"
          type="text"
          placeholder="输入消息..."
          :confirm-type="'send'"
          @confirm="sendMessage"
        />
      </view>
      <button class="send-btn" :class="{ active: inputText.trim() }" @tap="sendMessage">
        发送
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onLoad, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 聊天信息
const chatId = ref('')
const chatType = ref('')
const chatName = ref('客服')
const online = ref(true)

// 输入内容
const inputText = ref('')

// 滚动位置
const scrollIntoView = ref('')

// 是否是客服
const isCustomerService = computed(() => {
  return chatType.value === 'customer_service'
})

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 显示用户信息
const showUserInfo = () => {
  uni.showToast({
    title: '查看用户信息',
    icon: 'none'
  })
}

// 显示更多操作
const showMoreActions = () => {
  uni.showActionSheet({
    itemList: ['查看聊天信息', '清空聊天记录', '举报'],
    success: (res) => {
      console.log('[聊天] 选择操作:', res.tapIndex)
    }
  })
}

// 发送消息
const sendMessage = () => {
  if (!inputText.value.trim()) {
    return
  }

  console.log('[聊天] 发送消息:', inputText.value)

  // TODO: 实际发送消息到服务器
  uni.showToast({
    title: '消息已发送',
    icon: 'success',
    duration: 1500
  })

  inputText.value = ''

  // 滚动到底部
  scrollToBottom()
}

// 发送快捷回复
const sendQuickReply = (text: string) => {
  inputText.value = text
  sendMessage()
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      console.log('[聊天] 选择图片:', res.tempFilePaths[0])
      uni.showToast({
        title: '图片选择成功',
        icon: 'success'
      })
      // TODO: 上传并发送图片
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

// 查看详情
const viewDetail = () => {
  uni.showToast({
    title: '查看开发进度详情',
    icon: 'none'
  })
}

// 滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    // TODO: 实现滚动到底部
  }, 100)
}

onLoad((options: any) => {
  console.log('[聊天] 页面参数:', options)
  if (options.id) {
    chatId.value = options.id
  }
  if (options.type) {
    chatType.value = options.type
  }
  if (options.name) {
    chatName.value = decodeURIComponent(options.name)
  }
})

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 滚动到底部
  scrollToBottom()
})
</script>

<style scoped lang="scss">
.chat-page {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  padding-bottom: 0; // 移除底部padding，让flex布局自动处理
}

// 顶部导航栏
.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1000;

  .nav-content {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 20rpx;

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
    }

    .nav-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-left: 10rpx;

      .nav-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }

      .nav-status {
        font-size: 20rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .nav-actions {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .action-icon {
        font-size: 40rpx;
        color: #fff;
        font-weight: 300;
      }
    }
  }
}

// 消息列表
.message-list {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
  padding-bottom: 20rpx; // 确保最后一条消息有足够空间
}

// 时间分隔
.time-divider {
  padding: 20rpx 0;
  text-align: center;

  .time-text {
    font-size: 24rpx;
    color: #999;
    background: #e5e5e5;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
  }
}

// 消息项
.message-item {
  display: flex;
  margin-bottom: 30rpx;

  &.system {
    justify-content: center;
    margin-bottom: 20rpx;

    .message-bubble {
      &.system {
        background: rgba(0, 0, 0, 0.05);
        padding: 8rpx 20rpx;
        border-radius: 20rpx;

        .system-text {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  &.received {
    .avatar-wrapper {
      margin-right: 20rpx;
    }

    .message-content {
      .message-bubble {
        &.received {
          background: #fff;
          border: 1rpx solid #e5e5e5;

          .message-text {
            color: #333;
          }
        }
      }

      .message-time {
        text-align: left;
      }
    }
  }

  &.sent {
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;

      .message-bubble {
        &.sent {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

          .message-text {
            color: #fff;
          }
        }
      }

      .message-time {
        text-align: right;
      }
    }
  }

  .avatar-wrapper {
    flex-shrink: 0;

    .avatar {
      width: 72rpx;
      height: 72rpx;
      border-radius: 36rpx;

      &.default {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-text {
          font-size: 32rpx;
          color: #fff;
          font-weight: 600;
        }
      }
    }
  }

  .message-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 75%;

    .message-bubble {
      padding: 20rpx 24rpx;
      border-radius: 16rpx;
      margin-bottom: 8rpx;

      .message-text {
        font-size: 28rpx;
        line-height: 1.6;
        word-break: break-all;
      }
    }

    .message-card {
      background: #fff;
      border-radius: 16rpx;
      overflow: hidden;
      margin-bottom: 8rpx;
      border: 1rpx solid #e5e5e5;

      &.progress-card {
        .card-header {
          display: flex;
          align-items: center;
          padding: 20rpx;
          border-bottom: 1rpx solid #f0f0f0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

          .card-icon {
            font-size: 40rpx;
            margin-right: 12rpx;
          }

          .card-title {
            font-size: 28rpx;
            font-weight: 600;
            color: #fff;
          }
        }

        .card-body {
          padding: 20rpx;

          .progress-info {
            display: flex;
            margin-bottom: 16rpx;

            .progress-label {
              font-size: 26rpx;
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
            display: flex;
            align-items: center;
            margin-bottom: 20rpx;

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
              }
            }

            .progress-percent {
              font-size: 24rpx;
              color: #667eea;
              font-weight: 600;
            }
          }
        }

        .card-footer {
          padding: 0 20rpx 20rpx;

          .card-btn {
            width: 100%;
            height: 60rpx;
            line-height: 60rpx;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border: none;
            border-radius: 12rpx;
            font-size: 28rpx;
          }
        }
      }

      &.product-card {
        .product-header {
          display: flex;
          padding: 20rpx;

          .product-icon {
            font-size: 64rpx;
            margin-right: 20rpx;
          }

          .product-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .product-name {
              font-size: 30rpx;
              font-weight: 600;
              color: #333;
              margin-bottom: 8rpx;
            }

            .product-desc {
              font-size: 24rpx;
              color: #999;
            }
          }
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20rpx 16rpx;

          .product-price {
            font-size: 36rpx;
            font-weight: bold;
            color: #ff5722;
          }

          .product-status {
            font-size: 24rpx;
            color: #999;
          }
        }

        .product-tags {
          display: flex;
          gap: 10rpx;
          padding: 0 20rpx 20rpx;

          .tag {
            padding: 6rpx 16rpx;
            background: #f5f5f5;
            color: #667eea;
            font-size: 22rpx;
            border-radius: 8rpx;
          }
        }
      }

      &.order-card {
        .order-header {
          display: flex;
          align-items: center;
          padding: 16rpx 20rpx;
          background: #f5f5f5;
          border-bottom: 1rpx solid #f0f0f0;

          .order-icon {
            font-size: 32rpx;
            margin-right: 10rpx;
          }

          .order-title {
            font-size: 28rpx;
            font-weight: 600;
            color: #333;
          }
        }

        .order-body {
          padding: 20rpx;

          .order-row {
            display: flex;
            align-items: center;
            margin-bottom: 12rpx;

            &:last-child {
              margin-bottom: 0;
            }

            .order-label {
              font-size: 26rpx;
              color: #666;
              margin-right: 10rpx;
            }

            .order-value {
              font-size: 26rpx;
              color: #333;

              &.amount {
                font-size: 30rpx;
                font-weight: bold;
                color: #ff5722;
              }
            }

            .order-status-badge {
              padding: 6rpx 16rpx;
              border-radius: 20rpx;
              font-size: 22rpx;
              font-weight: 500;

              &.approved {
                background: #e8f5e9;
                color: #07c160;
              }
            }
          }
        }
      }
    }

    .message-time {
      font-size: 22rpx;
      color: #999;
      padding: 0 10rpx;
    }
  }
}

// 快捷回复栏
.quick-replies {
  background: #fff;
  border-top: 1rpx solid #e5e5e5;
  padding: 16rpx 20rpx;
  flex-shrink: 0; // 防止被压缩

  .reply-list {
    display: flex;
    white-space: nowrap;

    .reply-item {
      display: inline-block;
      padding: 12rpx 24rpx;
      background: #f5f5f5;
      border-radius: 40rpx;
      margin-right: 16rpx;

      .reply-text {
        font-size: 26rpx;
        color: #666;
      }

      &:active {
        background: #e8eaf6;
      }
    }
  }
}

// 底部输入栏
.input-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: #fff;
  border-top: 1rpx solid #e5e5e5;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  flex-shrink: 0; // 防止被压缩

  .input-tools {
    display: flex;
    gap: 16rpx;
    margin-right: 16rpx;

    .tool-icon {
      font-size: 44rpx;
    }
  }

  .input-wrapper {
    flex: 1;

    .message-input {
      background: #f5f5f5;
      border-radius: 40rpx;
      padding: 16rpx 24rpx;
      font-size: 28rpx;
      color: #333;
    }
  }

  .send-btn {
    margin-left: 16rpx;
    width: 120rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    background: #e5e5e5;
    color: #999;
    border: none;
    border-radius: 40rpx;
    font-size: 28rpx;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    &::after {
      border: none;
    }
  }
}
</style>
