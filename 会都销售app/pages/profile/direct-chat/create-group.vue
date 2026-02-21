<template>
  <view class="create-group-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">创建群聊</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 群名称输入 -->
      <view class="form-section">
        <text class="section-title">群名称</text>
        <input
          class="name-input"
          type="text"
          placeholder="请输入群名称"
          v-model="groupName"
          maxlength="50"
        />
      </view>

      <!-- 群公告输入 -->
      <view class="form-section">
        <text class="section-title">群公告（选填）</text>
        <textarea
          class="announcement-input"
          placeholder="请输入群公告"
          v-model="groupAnnouncement"
          maxlength="200"
        />
      </view>

      <!-- 选择成员 -->
      <view class="form-section">
        <text class="section-title">选择群成员</text>
        <view class="members-grid">
          <view
            v-for="contact in contacts"
            :key="contact.id"
            class="contact-item"
            :class="{ selected: selectedMembers.includes(contact.id) }"
            @tap="toggleMember(contact.id)"
          >
            <view class="contact-avatar">
              <text class="avatar-emoji">{{ contact.emoji }}</text>
            </view>
            <text class="contact-name">{{ contact.name }}</text>
            <view v-if="selectedMembers.includes(contact.id)" class="check-icon">✓</view>
          </view>
        </view>
      </view>

      <!-- 选择我的身份 -->
      <view class="form-section">
        <text class="section-title">选择我的身份</text>
        <view class="identity-list">
          <view
            v-for="card in myCards"
            :key="card.id"
            class="identity-item"
            :class="{ active: selectedCardId === card.id }"
            @tap="selectCard(card.id)"
          >
            <text class="card-icon">{{ card.icon }}</text>
            <text class="card-name">{{ card.name }}</text>
          </view>
        </view>
      </view>

      <!-- 创建按钮 -->
      <view class="create-btn" @tap="handleCreate">
        <text class="create-text">创建群聊</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 表单数据
const groupName = ref('')
const groupAnnouncement = ref('')
const selectedMembers = ref<string[]>([])
const selectedCardId = ref('card_001')

// 联系人数据
interface Contact {
  id: string
  name: string
  emoji: string
}

const contacts = ref<Contact[]>([
  { id: 'c001', name: '张三', emoji: '👤' },
  { id: 'c002', name: '李四', emoji: '👤' },
  { id: 'c003', name: '北京科技', emoji: '🏢' },
  { id: 'c004', name: '朝阳工作室', emoji: '🏪' },
  { id: 'c005', name: '王五', emoji: '👤' },
  { id: 'c006', name: '赵六', emoji: '👤' }
])

// 我的名片
interface Card {
  id: string
  name: string
  icon: string
}

const myCards = ref<Card[]>([
  { id: 'card_001', name: '张三 (个人)', icon: '👤' },
  { id: 'card_002', name: '北京科技 (企业)', icon: '🏢' },
  { id: 'card_003', name: '朝阳工作室', icon: '🏪' }
])

// 切换成员选择
const toggleMember = (id: string) => {
  const index = selectedMembers.value.indexOf(id)
  if (index > -1) {
    selectedMembers.value.splice(index, 1)
  } else {
    selectedMembers.value.push(id)
  }
}

// 选择名片
const selectCard = (id: string) => {
  selectedCardId.value = id
}

// 创建群聊
const handleCreate = () => {
  if (!groupName.value.trim()) {
    uni.showToast({
      title: '请输入群名称',
      icon: 'none'
    })
    return
  }

  if (selectedMembers.value.length === 0) {
    uni.showToast({
      title: '请选择群成员',
      icon: 'none'
    })
    return
  }

  uni.showModal({
    title: '确认创建',
    content: `确定要创建群聊「${groupName.value}」吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '群聊创建成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}

const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.create-group-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

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

.main-content {
  height: 100vh;
  padding-bottom: 40rpx;
}

.form-section {
  background: #fff;
  margin: 20rpx 30rpx;
  padding: 30rpx;
  border-radius: 16rpx;

  .section-title {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
    display: block;
    margin-bottom: 20rpx;
  }

  .name-input {
    width: 100%;
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: #333;
  }

  .announcement-input {
    width: 100%;
    min-height: 160rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    padding: 20rpx 24rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
  }

  .members-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .contact-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16rpx;
      background: #f8f9fa;
      border-radius: 12rpx;
      border: 2rpx solid transparent;
      transition: all 0.3s;

      &:active {
        transform: scale(0.95);
      }

      &.selected {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-color: #667eea;
      }

      .contact-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 8rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12rpx;

        .avatar-emoji {
          font-size: 40rpx;
        }
      }

      .contact-name {
        font-size: 22rpx;
        color: #333;
        text-align: center;
      }

      .check-icon {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 32rpx;
        height: 32rpx;
        background: #667eea;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18rpx;
        font-weight: bold;
      }
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

      &.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-color: #667eea;
      }

      .card-icon {
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

      .card-name {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

.create-btn {
  margin: 40rpx 30rpx;
  padding: 28rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 48rpx;
  text-align: center;
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }

  .create-text {
    font-size: 32rpx;
    color: #fff;
    font-weight: 600;
  }
}
</style>
