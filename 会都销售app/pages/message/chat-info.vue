<template>
  <view class="chat-info-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">聊天信息</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-area" scroll-y>
      <!-- 聊天成员列表 -->
      <view class="members-section">
        <!-- 群聊成员列表（网格布局） -->
        <view v-if="isGroupChat" class="members-grid">
          <!-- 现有成员 -->
          <view
            v-for="(member, index) in members"
            :key="index"
            class="member-item"
          >
            <view class="member-avatar">
              <text class="avatar-text">{{ member.name.charAt(0) }}</text>
            </view>
            <text class="member-name">{{ member.name }}</text>
          </view>

          <!-- 添加成员按钮（虚线框） -->
          <view class="member-item add-member-btn" @tap="goToAddMember">
            <view class="add-avatar-dashed">
              <text class="add-icon">+</text>
            </view>
            <text class="member-name">添加</text>
          </view>
        </view>

        <!-- 单人聊天成员列表（网格布局，与群聊一致） -->
        <view v-else class="members-grid">
          <!-- 对方成员 -->
          <view class="member-item">
            <view class="member-avatar">
              <text class="avatar-text">{{ memberName.charAt(0) }}</text>
            </view>
            <text class="member-name">{{ memberName }}</text>
          </view>

          <!-- 添加成员按钮（虚线框） -->
          <view class="member-item add-member-btn" @tap="goToAddMember">
            <view class="add-avatar-dashed">
              <text class="add-icon">+</text>
            </view>
            <text class="member-name">添加</text>
          </view>
        </view>
      </view>

      <!-- 查找聊天记录 -->
      <view class="info-item" @tap="onSearchHistory">
        <view class="item-label">查找聊天记录</view>
        <view class="item-arrow">
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 消息免打扰 -->
      <view class="info-item" @tap="toggleMute">
        <view class="item-label">消息免打扰</view>
        <view class="item-right">
          <view class="switch-btn" :class="{ active: muteEnabled }">
            <view class="switch-track">
              <view class="switch-thumb" :class="{ active: muteEnabled }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 置顶聊天 -->
      <view class="info-item" @tap="togglePin">
        <view class="item-label">置顶聊天</view>
        <view class="item-right">
          <view class="switch-btn" :class="{ active: pinEnabled }">
            <view class="switch-track">
              <view class="switch-thumb" :class="{ active: pinEnabled }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 提醒 -->
      <view class="info-item" @tap="toggleReminder">
        <view class="item-label">提醒</view>
        <view class="item-right">
          <view class="switch-btn" :class="{ active: reminderEnabled }">
            <view class="switch-track">
              <view class="switch-thumb" :class="{ active: reminderEnabled }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 设置当前聊天背景 -->
      <view class="info-item" @tap="onSetBackground">
        <view class="item-label">设置当前聊天背景</view>
        <view class="item-right">
          <text class="value-text">默认</text>
        </view>
      </view>

      <!-- 清空聊天记录 -->
      <view class="info-item danger" @tap="onClearHistory">
        <view class="item-label">清空聊天记录</view>
        <view class="item-arrow">
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 投诉 -->
      <view class="info-item danger" @tap="onComplaint">
        <view class="item-label">投诉</view>
        <view class="item-arrow">
          <text class="arrow-icon">›</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// URL 参数
const conversationId = ref('')
const conversationType = ref('')
const conversationName = ref('')

// 状态栏高度
const statusBarHeight = ref(0)

// 是否为群聊
const isGroupChat = ref(false)

// 单人聊天时的对方名称
const memberName = ref('')

// 群聊成员列表
const members = ref([
  { name: '张三', id: '1' },
  { name: '李四', id: '2' },
  { name: '王五', id: '3' },
  { name: '赵六', id: '4' },
  { name: '孙七', id: '5' },
  { name: '周八', id: '6' },
  { name: '吴九', id: '7' },
  { name: '郑十', id: '8' },
  { name: '刘一', id: '9' },
  { name: '陈二', id: '10' },
  { name: '杨三', id: '11' },
  { name: '黄四', id: '12' },
  { name: '朱五', id: '13' },
  { name: '秦六', id: '14' },
  { name: '许七', id: '15' },
  { name: '何八', id: '16' },
  { name: '吕九', id: '17' },
  { name: '施十', id: '18' },
  { name: '张伟', id: '19' }
])

// 开关状态
const muteEnabled = ref(false)
const pinEnabled = ref(false)
const reminderEnabled = ref(false)

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 切换消息免打扰
const toggleMute = () => {
  muteEnabled.value = !muteEnabled.value
}

// 切换置顶
const togglePin = () => {
  pinEnabled.value = !pinEnabled.value
}

// 切换提醒
const toggleReminder = () => {
  reminderEnabled.value = !reminderEnabled.value
}

// 跳转到发起群聊页面
const goToAddMember = () => {
  console.log('[聊天信息] 跳转到发起群聊页面')
  uni.navigateTo({
    url: '/pages/message/create-group'
  })
}

// 查找聊天记录
const onSearchHistory = () => {
  console.log('[聊天信息] 点击查找聊天记录')
  uni.showToast({
    title: '搜索聊天记录',
    icon: 'none'
  })
}

// 设置当前聊天背景
const onSetBackground = () => {
  console.log('[聊天信息] 点击设置聊天背景')
  uni.showToast({
    title: '设置聊天背景',
    icon: 'none'
  })
  // TODO: 打开背景选择器
}

// 清空记录
const onClearHistory = () => {
  console.log('[聊天信息] 点击清空记录')
  uni.showModal({
    title: '清空聊天记录',
    content: '确定要清空所有聊天记录吗？',
    success: (res: any) => {
      if (res.confirm) {
        uni.showToast({
          title: '已清空',
          icon: 'success'
        })
      }
    }
  })
}

// 投诉
const onComplaint = () => {
  console.log('[聊天信息] 点击投诉')
  uni.showToast({
    title: '投诉功能',
    icon: 'none'
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
    console.log('[聊天信息] 页面参数:', options)

    conversationId.value = options.id || ''
    conversationType.value = options.type || ''
    conversationName.value = options.name ? decodeURIComponent(options.name) : ''

    // 判断是群聊还是单人聊天
    if (options.type === 'group') {
      isGroupChat.value = true
    } else {
      isGroupChat.value = false
      memberName.value = conversationName.value || '好友'
    }

    console.log('[聊天信息] 是否群聊:', isGroupChat.value, '成员名:', memberName.value)
  }
})
</script>

<style scoped lang="scss">
.chat-info-page {
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
}

// 内容区域
.content-area {
  flex: 1;
  padding-top: calc(var(--status-bar-height) + 88rpx + 20rpx);
  padding-bottom: 40rpx;
}

// 成员区域
.members-section {
  background: #fff;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

// 群聊成员网格布局
.members-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20rpx 20rpx;
  padding: 30rpx;
  justify-items: start;

  .member-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10rpx;

    .member-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 12rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;

      .avatar-text {
        font-size: 36rpx;
        color: #fff;
        font-weight: 600;
      }
    }

    .member-name {
      font-size: 24rpx;
      color: #333;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    &:active {
      opacity: 0.7;
    }
  }

  // 添加成员按钮（虚线框）
  .add-member-btn {
    .add-avatar-dashed {
      width: 80rpx;
      height: 80rpx;
      border-radius: 12rpx;
      border: 2rpx dashed #999;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      background: transparent;

      .add-icon {
        font-size: 48rpx;
        color: #999;
        font-weight: 300;
      }
    }

    &:active {
      opacity: 0.6;
    }
  }
}

// 信息项
.info-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:active {
    background: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }

  .item-label {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
    flex: 1;
  }

  .item-arrow {
    .arrow-icon {
      font-size: 40rpx;
      color: #999;
      font-weight: 300;
    }
  }

  .item-right {
    .switch-text,
    .value-text {
      font-size: 26rpx;
      color: #999;
    }
  }

  // 开关按钮样式（仿微信）
  .switch-btn {
    position: relative;
    width: 88rpx;
    height: 48rpx;
    background: #e5e5e5;
    border-radius: 48rpx;
    transition: all 0.3s;
    border: none;

    &.active {
      background: #07c160;
    }
  }

  .switch-track {
    position: relative;
    width: 48rpx;
    height: 48rpx;
    background: #e5e5e5;
    border-radius: 48rpx;

    &::before {
      content: '';
      position: absolute;
      top: 2rpx;
      left: 2rpx;
      right: 2rpx;
      bottom: 2rpx;
      background: #e5e5e5;
      border-radius: 50%;
      transition: all 0.3s;
    }
  }

  .switch-thumb {
    position: absolute;
    top: 2rpx;
    left: 2rpx;
    width: 44rpx;
    height: 44rpx;
    background: #fff;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

    &::after {
      content: '';
      position: absolute;
      top: 22rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 2rpx;
      height: 22rpx;
      background: #07c160;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    }

    &.active {
      left: 44rpx;
      background: #07c160;

      &::after {
        left: 4rpx;
      width: 22rpx;
        height: 22rpx;
        background: #fff;
        border-radius: 50%;
      }
    }
  }
}
</style>
