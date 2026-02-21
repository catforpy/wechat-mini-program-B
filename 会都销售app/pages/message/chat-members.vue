<template>
  <view class="chat-members-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">{{ pageTitle }}</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-area" scroll-y>
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

      <!-- 单人聊天成员列表（单列布局） -->
      <view v-else class="members-single">
        <!-- 对方成员 -->
        <view class="member-item-single">
          <view class="member-avatar">
            <text class="avatar-text">{{ memberName.charAt(0) }}</text>
          </view>
          <text class="member-name">{{ memberName }}</text>
        </view>

        <!-- 添加成员按钮（虚线框） -->
        <view class="member-item-single add-member-btn-single" @tap="goToAddMember">
          <view class="add-avatar-dashed">
            <text class="add-icon">+</text>
          </view>
          <text class="member-name">添加</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 页面参数
const chatId = ref('')
const chatType = ref('')
const chatName = ref('')
const memberName = ref('')  // 单人聊天时的对方名称

// 页面标题
const pageTitle = ref('聊天成员')

// 是否为群聊
const isGroupChat = ref(false)

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

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到发起群聊页面
const goToAddMember = () => {
  console.log('[聊天成员] 跳转到发起群聊页面')
  uni.navigateTo({
    url: '/pages/message/create-group'
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
    console.log('[聊天成员] 页面参数:', options)

    chatId.value = options.id || ''
    chatType.value = options.type || ''
    chatName.value = options.name ? decodeURIComponent(options.name) : ''

    // 判断是群聊还是单人聊天
    if (options.type === 'group') {
      isGroupChat.value = true
      pageTitle.value = chatName.value || '群成员'
    } else {
      isGroupChat.value = false
      memberName.value = chatName.value || '好友'
      pageTitle.value = memberName.value
    }
  }
})
</script>

<style scoped lang="scss">
.chat-members-page {
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
  padding-top: calc(var(--status-bar-height) + 88rpx + 40rpx);
  padding-bottom: 40rpx;
}

// 群聊成员网格布局
.members-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40rpx 30rpx;
  padding: 0 30rpx;

  .member-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rpx;

    .member-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 12rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;

      .avatar-text {
        font-size: 40rpx;
        color: #fff;
        font-weight: 600;
      }
    }

    .member-name {
      font-size: 24rpx;
      color: #333;
      text-align: center;
      max-width: 120rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:active {
      opacity: 0.7;
    }
  }

  // 添加成员按钮（虚线框）
  .add-member-btn {
    .add-avatar-dashed {
      width: 100rpx;
      height: 100rpx;
      border-radius: 12rpx;
      border: 2rpx dashed #999;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      background: transparent;

      .add-icon {
        font-size: 60rpx;
        color: #999;
        font-weight: 300;
      }
    }

    &:active {
      opacity: 0.6;
    }
  }
}

// 单人聊天单列布局
.members-single {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  padding: 0 30rpx;
  align-items: center;

  .member-item-single {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rpx;

    .member-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 12rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;

      .avatar-text {
        font-size: 40rpx;
        color: #fff;
        font-weight: 600;
      }
    }

    .member-name {
      font-size: 28rpx;
      color: #333;
      text-align: center;
    }

    &:active {
      opacity: 0.7;
    }
  }

  // 添加成员按钮（虚线框）
  .add-member-btn-single {
    .add-avatar-dashed {
      width: 100rpx;
      height: 100rpx;
      border-radius: 12rpx;
      border: 2rpx dashed #999;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      background: transparent;

      .add-icon {
        font-size: 60rpx;
        color: #999;
        font-weight: 300;
      }
    }

    &:active {
      opacity: 0.6;
    }
  }
}
</style>
