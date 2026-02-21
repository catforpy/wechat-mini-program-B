<template>
  <view class="customer-recruitment-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">客服咨询</text>
        <view class="search-icon" @tap="handleSearch">
          <text>🔍</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 状态切换 Tab -->
      <view class="status-tabs">
        <view
          class="tab-item"
          :class="{ active: activeStatusTab === 'all' }"
          @tap="handleStatusTabChange('all')"
        >
          <text class="tab-text">全部</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeStatusTab === 'pending' }"
          @tap="handleStatusTabChange('pending')"
        >
          <text class="tab-text">待回复</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeStatusTab === 'completed' }"
          @tap="handleStatusTabChange('completed')"
        >
          <text class="tab-text">已完成</text>
        </view>
      </view>

      <!-- 当前位置标识 -->
      <view class="current-location">
        <text class="location-text">{{ pageTitle }}</text>
      </view>

      <!-- 咨询列表 -->
      <view class="consultation-list">
        <view
          v-for="consultation in filteredConsultations"
          :key="consultation.id"
          class="consultation-card"
          @tap="handleChatClick(consultation)"
        >
          <!-- 左侧：头像/图标 -->
          <view class="avatar-wrapper">
            <image
              v-if="consultation.avatar"
              :src="consultation.avatar"
              mode="aspectFill"
              class="avatar"
            />
            <text v-else class="avatar-emoji">{{ consultation.emoji || '👤' }}</text>
          </view>

          <!-- 中间：消息内容 -->
          <view class="message-content">
            <view class="message-header">
              <text class="consultation-name">{{ consultation.name }}</text>
              <!-- 状态标签 -->
              <view v-if="consultation.status === 'pending'" class="status-badge pending">
                <text class="status-text">⏳ 待回复</text>
              </view>
              <view v-else class="status-badge completed">
                <text class="status-text">✅ 已完成</text>
              </view>
            </view>
            <text class="consultation-topic">主题: {{ consultation.topic }}</text>
            <text class="last-message">{{ consultation.lastMessage }}</text>
          </view>

          <!-- 右侧：时间 -->
          <view class="right-info">
            <text class="time">{{ consultation.time }}</text>
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

// 页面标题
const pageTitle = ref('应聘咨询')

// 当前选中的状态Tab
const activeStatusTab = ref<'all' | 'pending' | 'completed'>('all')

// 咨询数据接口
interface Consultation {
  id: string
  name: string
  avatar?: string
  emoji?: string
  topic: string
  lastMessage: string
  time: string
  status: 'pending' | 'completed'
}

// 模拟咨询数据
const consultations = ref<Consultation[]>([
  {
    id: 'cust_001',
    name: '李四',
    emoji: '👤',
    topic: '前端工程师岗位咨询',
    lastMessage: '请问前端岗位的薪资范围是多少？',
    time: '2小时前',
    status: 'pending'
  },
  {
    id: 'cust_002',
    name: '王五',
    emoji: '👤',
    topic: 'UI设计师岗位咨询',
    lastMessage: '谢谢您的解答！',
    time: '昨天',
    status: 'completed'
  },
  {
    id: 'cust_003',
    name: 'ABC科技公司',
    emoji: '🏢',
    topic: '技术合作咨询',
    lastMessage: '关于项目合作的事宜，想详细了解一下',
    time: '3小时前',
    status: 'pending'
  },
  {
    id: 'cust_004',
    name: '赵六',
    emoji: '👤',
    topic: '产品经理岗位咨询',
    lastMessage: '已收到简历，稍后联系',
    time: '周一',
    status: 'completed'
  }
])

// 根据状态Tab过滤咨询
const filteredConsultations = computed(() => {
  if (activeStatusTab.value === 'all') {
    return consultations.value
  }
  return consultations.value.filter(c => c.status === activeStatusTab.value)
})

// 状态Tab切换
const handleStatusTabChange = (tab: 'all' | 'pending' | 'completed') => {
  activeStatusTab.value = tab
}

// 点击咨询
const handleChatClick = (consultation: Consultation) => {
  console.log('点击咨询:', consultation)
  uni.navigateTo({
    url: `/pages/profile/direct-chat/chat?id=${consultation.id}&type=single`
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

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  // 根据传入的参数设置页面标题和数据
  if (options.type) {
    const typeMap: Record<string, string> = {
      'recruitment': '应聘咨询',
      'business': '业务咨询',
      'product': '产品咨询',
      'other': '其他咨询'
    }
    pageTitle.value = typeMap[options.type] || '应聘咨询'
  }
})
</script>

<style scoped lang="scss">
.customer-recruitment-page {
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

    .nav-title {
      flex: 1;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
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
  }
}

// 主内容区域
.main-content {
  height: 100vh;
}

// 状态切换Tab
.status-tabs {
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

// 咨询列表
.consultation-list {
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .consultation-card {
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
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
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

        .consultation-name {
          font-size: 32rpx;
          color: #333;
          font-weight: 600;
          margin-right: 12rpx;
        }

        .status-badge {
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
          font-size: 20rpx;
          font-weight: 600;

          &.pending {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
            .status-text {
              color: #fff;
            }
          }

          &.completed {
            background: #e8f5e9;
            .status-text {
              color: #4caf50;
            }
          }
        }
      }

      .consultation-topic {
        font-size: 24rpx;
        color: #667eea;
        margin-bottom: 4rpx;
        display: block;
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
      flex-shrink: 0;

      .time {
        font-size: 24rpx;
        color: #bbb;
      }
    }
  }
}
</style>
