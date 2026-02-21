<template>
  <view class="group-info-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">群详情</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 群头像和名称 -->
      <view class="group-header">
        <view class="group-avatar">
          <text class="avatar-emoji">👥</text>
        </view>
        <text class="group-name">IT技术交流群</text>
        <view class="group-actions">
          <view class="action-btn" @tap="handleEditName">
            <text class="action-text">修改群名称</text>
          </view>
          <view class="action-btn" @tap="handleEditAvatar">
            <text class="action-text">修改群头像</text>
          </view>
        </view>
      </view>

      <!-- 群主信息 -->
      <view class="info-section">
        <text class="section-title">群主</text>
        <view class="owner-card" @tap="viewOwnerCard">
          <view class="owner-icon">🏢</view>
          <view class="owner-info">
            <text class="owner-name">北京科技创新有限公司</text>
            <text class="owner-detail">行业: IT科技 | 地址: 北京市朝阳区...</text>
          </view>
        </view>
      </view>

      <!-- 群公告 -->
      <view class="info-section">
        <text class="section-title">群公告</text>
        <view class="announcement-card">
          <text class="announcement-text">欢迎大家交流技术问题！请文明发言，禁止广告...</text>
          <view class="edit-btn" @tap="handleEditAnnouncement">
            <text class="edit-text">修改</text>
          </view>
        </view>
      </view>

      <!-- 群成员 -->
      <view class="info-section">
        <view class="section-header">
          <text class="section-title">群成员 (128)</text>
          <view class="invite-btn" @tap="handleInvite">
            <text class="invite-text">+邀请</text>
          </view>
        </view>
        <view class="members-grid">
          <view v-for="i in 8" :key="i" class="member-item">
            <view class="member-avatar">
              <text class="avatar-emoji">{{ i % 3 === 0 ? '🏢' : i % 2 === 0 ? '🏪' : '👤' }}</text>
            </view>
            <text class="member-name">成员{{ i }}</text>
          </view>
        </view>
        <view class="view-all-btn" @tap="viewAllMembers">
          <text class="view-all-text">查看全部成员 ></text>
        </view>
      </view>

      <!-- 我的群昵称 -->
      <view class="info-section">
        <text class="section-title">我的群昵称</text>
        <view class="nickname-card" @tap="handleEditNickname">
          <text class="nickname-text">张三 (个人名片)</text>
          <text class="edit-arrow">></text>
        </view>
      </view>

      <!-- 我的群身份 -->
      <view class="info-section">
        <text class="section-title">我的群身份</text>
        <view class="identity-list">
          <view class="identity-item" :class="{ active: myIdentity === 'personal' }" @tap="selectIdentity('personal')">
            <text class="identity-icon">👤</text>
            <text class="identity-name">张三 (个人)</text>
          </view>
          <view class="identity-item" :class="{ active: myIdentity === 'company' }" @tap="selectIdentity('company')">
            <text class="identity-icon">🏢</text>
            <text class="identity-name">北京科技 (企业) [群主]</text>
          </view>
          <view class="identity-item" :class="{ active: myIdentity === 'individual' }" @tap="selectIdentity('individual')">
            <text class="identity-icon">🏪</text>
            <text class="identity-name">朝阳工作室</text>
          </view>
        </view>
      </view>

      <!-- 设置选项 -->
      <view class="settings-section">
        <view class="setting-item">
          <text class="setting-label">消息免打扰</text>
          <switch :checked="isMuted" @change="handleMutedChange" color="#667eea" />
        </view>
        <view class="setting-item">
          <text class="setting-label">置顶聊天</text>
          <switch :checked="isPinned" @change="handlePinnedChange" color="#667eea" />
        </view>
        <view class="setting-item">
          <text class="setting-label">保存到通讯录</text>
          <switch :checked="isSaved" @change="handleSavedChange" color="#667eea" />
        </view>
      </view>

      <!-- 底部操作 -->
      <view class="bottom-actions">
        <view class="action-btn danger" @tap="handleClearHistory">
          <text class="btn-text">清空聊天记录</text>
        </view>
        <view class="action-btn danger" @tap="handleExitGroup">
          <text class="btn-text">删除并退出</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 我的群身份
const myIdentity = ref<'personal' | 'company' | 'individual'>('company')

// 设置选项
const isMuted = ref(false)
const isPinned = ref(false)
const isSaved = ref(true)

// 选择群身份
const selectIdentity = (identity: 'personal' | 'company' | 'individual') => {
  myIdentity.value = identity
  uni.showToast({
    title: '已切换群身份',
    icon: 'success'
  })
}

// 修改群名称
const handleEditName = () => {
  uni.showToast({
    title: '修改群名称功能开发中',
    icon: 'none'
  })
}

// 修改群头像
const handleEditAvatar = () => {
  uni.showToast({
    title: '修改群头像功能开发中',
    icon: 'none'
  })
}

// 查看群主名片
const viewOwnerCard = () => {
  uni.navigateTo({
    url: '/pages/company/detail'
  })
}

// 修改群公告
const handleEditAnnouncement = () => {
  uni.showToast({
    title: '修改群公告功能开发中',
    icon: 'none'
  })
}

// 邀请成员
const handleInvite = () => {
  uni.showToast({
    title: '邀请成员功能开发中',
    icon: 'none'
  })
}

// 查看全部成员
const viewAllMembers = () => {
  uni.navigateTo({
    url: '/pages/profile/direct-chat/group-members'
  })
}

// 修改群昵称
const handleEditNickname = () => {
  uni.showToast({
    title: '修改群昵称功能开发中',
    icon: 'none'
  })
}

// 消息免打扰
const handleMutedChange = (e: any) => {
  isMuted.value = e.detail.value
}

// 置顶聊天
const handlePinnedChange = (e: any) => {
  isPinned.value = e.detail.value
}

// 保存到通讯录
const handleSavedChange = (e: any) => {
  isSaved.value = e.detail.value
}

// 清空聊天记录
const handleClearHistory = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空聊天记录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '聊天记录已清空',
          icon: 'success'
        })
      }
    }
  })
}

// 退出群聊
const handleExitGroup = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要删除并退出群聊吗？',
    confirmColor: '#ff5252',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    }
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.group-info-page {
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

    .nav-placeholder {
      width: 60rpx;
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
  padding-bottom: 40rpx;
}

// 群头部
.group-header {
  background: #fff;
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1rpx solid #e5e5e5;

  .group-avatar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
    background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24rpx;

    .avatar-emoji {
      font-size: 80rpx;
    }
  }

  .group-name {
    font-size: 36rpx;
    color: #333;
    font-weight: 600;
    margin-bottom: 24rpx;
  }

  .group-actions {
    display: flex;
    gap: 20rpx;

    .action-btn {
      padding: 16rpx 32rpx;
      background: #f5f5f5;
      border-radius: 24rpx;
      transition: all 0.3s;

      &:active {
        background: #e0e0e0;
      }

      .action-text {
        font-size: 26rpx;
        color: #666;
      }
    }
  }
}

// 信息区块
.info-section {
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  border-bottom: 1rpx solid #e5e5e5;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .invite-btn {
      padding: 12rpx 24rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20rpx;

      .invite-text {
        font-size: 24rpx;
        color: #fff;
        font-weight: 600;
      }
    }
  }

  .section-title {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
    display: block;
    margin-bottom: 24rpx;
  }

  .owner-card {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background: #f8f9fa;
    border-radius: 12rpx;

    .owner-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 8rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      margin-right: 20rpx;
    }

    .owner-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;

      .owner-name {
        font-size: 30rpx;
        color: #333;
        font-weight: 600;
      }

      .owner-detail {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .announcement-card {
    position: relative;
    padding: 24rpx;
    background: #f8f9fa;
    border-radius: 12rpx;

    .announcement-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }

    .edit-btn {
      position: absolute;
      top: 24rpx;
      right: 24rpx;

      .edit-text {
        font-size: 24rpx;
        color: #667eea;
      }
    }
  }

  .members-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .member-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .member-avatar {
        width: 96rpx;
        height: 96rpx;
        border-radius: 12rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12rpx;

        .avatar-emoji {
          font-size: 48rpx;
        }
      }

      .member-name {
        font-size: 22rpx;
        color: #666;
        text-align: center;
      }
    }
  }

  .view-all-btn {
    margin-top: 24rpx;
    text-align: center;

    .view-all-text {
      font-size: 26rpx;
      color: #667eea;
    }
  }

  .nickname-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    background: #f8f9fa;
    border-radius: 12rpx;

    .nickname-text {
      font-size: 28rpx;
      color: #333;
    }

    .edit-arrow {
      font-size: 28rpx;
      color: #999;
    }
  }

  .identity-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .identity-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: #f8f9fa;
      border-radius: 12rpx;
      border: 2rpx solid transparent;
      transition: all 0.3s;

      &:active {
        transform: scale(0.98);
      }

      .identity-icon {
        width: 64rpx;
        height: 64rpx;
        border-radius: 8rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        margin-right: 20rpx;
      }

      .identity-name {
        font-size: 28rpx;
        color: #333;
      }

      &.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-color: #667eea;

        .identity-name {
          color: #667eea;
          font-weight: 600;
        }
      }
    }
  }
}

// 设置区域
.settings-section {
  background: #fff;
  margin-top: 20rpx;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #e5e5e5;

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .setting-label {
      font-size: 30rpx;
      color: #333;
    }
  }
}

// 底部操作
.bottom-actions {
  margin-top: 40rpx;
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .action-btn {
    padding: 28rpx;
    border-radius: 12rpx;
    text-align: center;
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
    }

    .btn-text {
      font-size: 30rpx;
      font-weight: 600;
    }

    &.danger {
      background: #ffebee;

      .btn-text {
        color: #ff5252;
      }
    }
  }
}
</style>
