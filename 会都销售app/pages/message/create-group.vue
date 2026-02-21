<template>
  <view class="create-group-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">发起群聊</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area">
      <!-- 搜索框 -->
      <view class="search-bar">
        <input
          v-model="searchKeyword"
          class="search-input"
          type="text"
          placeholder="搜索"
          @input="onSearchInput"
        />
      </view>

      <!-- 创建新群聊标题 -->
      <view class="create-group-title">
        <text class="create-text">创建新群聊</text>
      </view>

      <!-- 好友分组 -->
      <view class="contact-section">
        <view class="section-header" @tap="toggleSection('friends')">
          <text class="section-title">好友</text>
          <text class="expand-icon">{{ expandedSections.friends ? '▼' : '▶' }}</text>
        </view>
        <view v-if="expandedSections.friends" class="contact-list">
          <view
            v-for="(friend, index) in filteredFriends"
            :key="index"
            class="contact-item"
            @tap="selectContact(friend)"
          >
            <view class="contact-avatar">
              <text class="avatar-text">{{ friend.name.charAt(0) }}</text>
            </view>
            <text class="contact-name">{{ friend.name }}</text>
            <view class="checkbox-wrapper">
              <view class="checkbox" :class="{ checked: friend.selected }">
                <view v-if="friend.selected" class="checkbox-checked">✓</view>
              </view>
            </view>
          </view>
          <view v-if="filteredFriends.length === 0" class="empty-hint">
            <text class="empty-text">暂无好友</text>
          </view>
        </view>
      </view>

      <!-- 商户分组 -->
      <view class="contact-section">
        <view class="section-header" @tap="toggleSection('merchants')">
          <text class="section-title">商户</text>
          <text class="expand-icon">{{ expandedSections.merchants ? '▼' : '▶' }}</text>
        </view>
        <view v-if="expandedSections.merchants" class="contact-list">
          <view
            v-for="(merchant, index) in filteredMerchants"
            :key="index"
            class="contact-item"
            @tap="selectContact(merchant)"
          >
            <view class="contact-avatar">
              <text class="avatar-text">{{ merchant.name.charAt(0) }}</text>
            </view>
            <text class="contact-name">{{ merchant.name }}</text>
            <view class="checkbox-wrapper">
              <view class="checkbox" :class="{ checked: merchant.selected }">
                <view v-if="merchant.selected" class="checkbox-checked">✓</view>
              </view>
            </view>
          </view>
          <view v-if="filteredMerchants.length === 0" class="empty-hint">
            <text class="empty-text">暂无商户</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航栏（确定按钮） -->
    <view class="bottom-nav">
      <view class="bottom-nav-content">
        <view class="selected-count">
          <text class="count-text">已选择 {{ selectedCount }} 人</text>
        </view>
        <view class="confirm-btn" @tap="createGroupChat">
          <text class="confirm-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 搜索关键词
const searchKeyword = ref('')

// 展开的分组
const expandedSections = ref({
  friends: true,
  merchants: true
})

// 好友列表
const friends = ref([
  { name: '张三', id: 'friend_1', selected: false },
  { name: '李四', id: 'friend_2', selected: false },
  { name: '王五', id: 'friend_3', selected: false },
  { name: '赵六', id: 'friend_4', selected: false },
  { name: '孙七', id: 'friend_5', selected: false },
  { name: '周八', id: 'friend_6', selected: false },
  { name: '吴九', id: 'friend_7', selected: false },
  { name: '郑十', id: 'friend_8', selected: false },
  { name: '刘一', id: 'friend_9', selected: false },
  { name: '陈二', id: 'friend_10', selected: false },
  { name: '杨三', id: 'friend_11', selected: false },
  { name: '黄四', id: 'friend_12', selected: false },
  { name: '赵五', id: 'friend_13', selected: false },
  { name: '周六', id: 'friend_14', selected: false },
  { name: '吴七', id: 'friend_15', selected: false },
  { name: '郑八', id: 'friend_16', selected: false },
  { name: '王九', id: 'friend_17', selected: false },
  { name: '冯十', id: 'friend_18', selected: false },
  { name: '陈一', id: 'friend_19', selected: false },
  { name: '楚二', id: 'friend_20', selected: false }
])

// 商户列表
const merchants = ref([
  { name: '零售商城', id: 'merchant_1', selected: false },
  { name: '餐饮小程序', id: 'merchant_2', selected: false },
  { name: '美妆店', id: 'merchant_3', selected: false },
  { name: '服装店', id: 'merchant_4', selected: false }
])

// 过滤后的好友列表
const filteredFriends = computed(() => {
  if (!searchKeyword.value) return friends.value
  return friends.value.filter(friend =>
    friend.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 过滤后的商户列表
const filteredMerchants = computed(() => {
  if (!searchKeyword.value) return merchants.value
  return merchants.value.filter(merchant =>
    merchant.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 计算已选择数量
const selectedCount = computed(() => {
  const friendCount = friends.value.filter(f => f.selected).length
  const merchantCount = merchants.value.filter(m => m.selected).length
  return friendCount + merchantCount
})

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 搜索输入
const onSearchInput = (e: any) => {
  console.log('[发起群聊] 搜索:', e.detail.value)
}

// 切换分组展开/收起
const toggleSection = (section: 'friends' | 'merchants') => {
  expandedSections.value[section] = !expandedSections.value[section]
}

// 选择联系人
const selectContact = (contact: any) => {
  console.log('[发起群聊] 选择联系人:', contact)
  contact.selected = !contact.selected
}

// 创建新群聊
const createGroupChat = () => {
  console.log('[发起群聊] 创建群聊，已选择:', friends.value.filter(f => f.selected), merchants.value.filter(m => m.selected))

  const selectedFriends = friends.value.filter(f => f.selected)
  const selectedMerchants = merchants.value.filter(m => m.selected)

  if (selectedFriends.length === 0 && selectedMerchants.length === 0) {
    uni.showToast({
      title: '请至少选择一个成员',
      icon: 'none'
    })
    return
  }

  // TODO: 获取之前的单人聊天对象，一起创建群聊
  // 目前先创建示例，显示已选择的成员
  const selectedCount = selectedFriends.length + selectedMerchants.length
  uni.showToast({
    title: `已创建${selectedCount}人群聊`,
    icon: 'success'
  })

  // 跳转到聊天页面（群聊模式）
  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/message/multi-chat'
    })
  }, 500)
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.create-group-page {
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
  padding-bottom: 140rpx; // 为底部导航栏留出空间
}

// 搜索框
.search-bar {
  margin: 0 30rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .search-input {
    width: 100%;
    font-size: 30rpx;
    color: #333;
  }
}

// 创建新群聊标题
.create-group-title {
  padding: 30rpx;

  .create-text {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
    display: block;
  }
}

// 联系人分组
.contact-section {
  background: #fff;
  margin: 0 30rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #e5e5e5;

    &:active {
      background: #f5f5f5;
    }

    .section-title {
      font-size: 32rpx;
      color: #333;
      font-weight: 600;
    }

    .expand-icon {
      font-size: 24rpx;
      color: #999;
    }
  }

  // 分组标题
    &-friends {
      // 好友分组名称
    }
}

  // 联系人列表
  .contact-list {
    padding: 0 30rpx;

    .contact-item {
      display: flex;
      align-items: center;
      padding: 24rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      position: relative;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background: #f5f5f5;
      }

      .contact-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 12rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24rpx;

        .avatar-text {
          font-size: 32rpx;
          color: #fff;
          font-weight: 600;
        }
      }

      .contact-name {
        flex: 1;
        font-size: 30rpx;
        color: #333;
      }

      .checkbox-wrapper {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
      }

      .checkbox {
        width: 40rpx;
        height: 40rpx;
        border: 2rpx solid #c0c0c0;
        border-radius: 4rpx;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        .checkbox-checked {
          width: 100%;
          height: 100%;
          background: #07c160;
          border-radius: 2rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 24rpx;
          font-weight: bold;
        }
      }
    }
  }

  .empty-hint {
    padding: 60rpx 30rpx;
    text-align: center;

    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

// 底部导航栏（简约白色风格）
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1rpx solid #e5e5e5;
  padding: 16rpx 30rpx;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
  z-index: 999;

  .bottom-nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;

    .selected-count {
      flex: 1;

      .count-text {
        font-size: 28rpx;
        color: #666;
      }
    }

    .confirm-btn {
      width: 120rpx;
      height: 60rpx;
      background: #07c160;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &:active {
        opacity: 0.8;
      }

      .confirm-text {
        font-size: 28rpx;
        color: #fff;
        font-weight: 500;
      }
    }
  }
}
</style>
