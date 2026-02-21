<template>
  <view class="my-favorites-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">名片收藏</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <view class="main-content" :style="{ top: (statusBarHeight + 52) + 'px' }">
      <!-- 标题行 -->
      <view class="title-row">
        <text class="title-text">名片类型</text>
        <view class="card-type-tabs">
          <view
            class="card-type-tab"
            :class="{ active: activeCardType === 'all' }"
            @tap="handleCardTypeChange('all')"
          >
            <text class="card-type-text">全部</text>
          </view>
          <view
            class="card-type-tab"
            :class="{ active: activeCardType === 'company' }"
            @tap="handleCardTypeChange('company')"
          >
            <text class="card-type-text">企业</text>
          </view>
          <view
            class="card-type-tab"
            :class="{ active: activeCardType === 'personal' }"
            @tap="handleCardTypeChange('personal')"
          >
            <text class="card-type-text">个人</text>
          </view>
        </view>
      </view>

      <!-- 右侧：收藏列表 -->
      <scroll-view
        class="content-area-full"
        scroll-y
      >
        <!-- 卡片列表 -->
        <view v-if="filteredFavorites.length === 0" class="empty-state">
          <text class="empty-icon">⭐</text>
          <text class="empty-text">暂无收藏的名片</text>
          <text class="empty-hint">去企业浏览页面收藏喜欢的名片吧</text>
        </view>

        <view v-else class="app-list">
          <view
            v-for="app in filteredFavorites"
            :key="app.id"
            class="app-card"
            :class="{ 'personal-card': app.type === 'personal', 'company-card': app.type === 'company', 'individual-card': app.type === 'individual' }"
            @tap="handleAppClick(app)"
          >
            <!-- 左侧：图标 -->
            <view class="app-icon-wrapper">
              <image
                v-if="app.icon"
                :src="app.icon"
                mode="aspectFill"
                class="app-icon"
              />
              <text v-else class="app-emoji">{{ app.emoji || '📱' }}</text>
            </view>

            <!-- 右侧：信息 -->
            <view class="app-info">
              <text class="app-name">{{ app.name }}</text>
              <!-- 企业/个体：显示地址和行业 -->
              <text v-if="app.type !== 'personal' && app.address" class="app-address">{{ app.address }}</text>
              <text v-if="app.type !== 'personal' && app.category" class="app-category">{{ app.category }}</text>
              <!-- 个人名片：显示职位和联系方式 -->
              <text v-if="app.type === 'personal' && app.position" class="app-address">{{ app.position }}</text>
              <text v-if="app.type === 'personal' && app.phone" class="app-contact">{{ app.phone }}</text>
            </view>

            <!-- 移除收藏按钮 -->
            <view class="remove-fav-btn" @tap.stop="handleRemoveFavorite(app)">
              <text class="remove-icon">🗑️</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 当前选中的名片类型
const activeCardType = ref<'all' | 'company' | 'personal'>('all')

// 收藏项接口
interface FavoriteItem {
  id: string
  type: 'company' | 'individual' | 'personal'
  name: string
  category?: string
  position?: string
  businessScope?: string
  phone?: string
  email?: string
  address?: string
  emoji?: string
  icon?: string
  hasRecruitment?: boolean
}

// 收藏列表（假数据）
const favorites = ref<FavoriteItem[]>([
  {
    id: 'fav_001',
    type: 'company',
    name: '北京科技创新有限公司',
    category: 'IT科技',
    businessScope: '技术开发、技术咨询、技术服务；计算机系统服务；数据处理；软件开发。',
    address: '北京市朝阳区建国路88号',
    phone: '010-12345678',
    email: 'contact@techinnov.com',
    emoji: '🏢',
    hasRecruitment: true
  },
  {
    id: 'fav_002',
    type: 'individual',
    name: '朝阳区朝阳科技工作室',
    category: 'IT科技',
    businessScope: '技术服务；技术咨询；软件开发；广告设计；图文制作。',
    address: '北京市朝阳区望京SOHO',
    phone: '010-87654321',
    email: 'wangxi@example.com',
    emoji: '🏪'
  },
  {
    id: 'fav_003',
    type: 'personal',
    name: '张三',
    position: '物流经理',
    category: '物流服务',
    phone: '138****0000',
    email: 'zhangsan@example.com',
    emoji: '👤'
  },
  {
    id: 'fav_004',
    type: 'company',
    name: '上海智汇网络科技有限公司',
    category: 'IT科技',
    address: '上海市浦东新区张江高科技园区',
    phone: '021-87654321',
    email: 'info@smartnet.com',
    emoji: '🏢',
    hasRecruitment: false
  }
])

// 根据类型过滤收藏列表
const filteredFavorites = computed(() => {
  if (activeCardType.value === 'all') {
    return favorites.value
  }
  if (activeCardType.value === 'company') {
    return favorites.value.filter(item => item.type === 'company' || item.type === 'individual')
  }
  return favorites.value.filter(item => item.type === 'personal')
})

// 切换名片类型
const handleCardTypeChange = (type: 'all' | 'company' | 'personal') => {
  activeCardType.value = type
}

// 点击卡片
const handleAppClick = (app: FavoriteItem) => {
  uni.showToast({
    title: `查看${app.name}`,
    icon: 'none'
  })
  // TODO: 跳转到对应的详情页面
}

// 移除收藏
const handleRemoveFavorite = (app: FavoriteItem) => {
  uni.showModal({
    title: '确认取消收藏',
    content: `确定要取消收藏「${app.name}」吗？`,
    success: (res) => {
      if (res.confirm) {
        const index = favorites.value.findIndex(f => f.id === app.id)
        if (index !== -1) {
          favorites.value.splice(index, 1)
          // 保存到本地存储
          try {
            uni.setStorageSync('my_favorites', JSON.stringify(favorites.value))
          } catch (e) {
            console.error('保存收藏列表失败:', e)
          }
          uni.showToast({
            title: '已取消收藏',
            icon: 'success'
          })
        }
      }
    }
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 从本地存储加载收藏列表
  try {
    const saved = uni.getStorageSync('my_favorites')
    if (saved) {
      favorites.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('读取收藏列表失败:', e)
  }
})
</script>

<style scoped lang="scss">
.my-favorites-page {
  min-height: 100vh;
  background: #f5f5f5;
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
    padding: 0 30rpx;

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
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

// 标题行
.title-row {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;

  .title-text {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
    margin-right: 30rpx;
  }

  .card-type-tabs {
    flex: 1;
    display: flex;
    gap: 12rpx;

    .card-type-tab {
      flex: 1;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8rpx;
      background: #f5f5f5;
      transition: all 0.3s;

      .card-type-text {
        font-size: 26rpx;
        color: #666;
        font-weight: 500;
      }

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);

        .card-type-text {
          color: #fff;
          font-weight: 600;
        }
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

// 内容区域（全宽）
.content-area-full {
  flex: 1;
  padding: 20rpx;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 60rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 40rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 32rpx;
    color: #999;
    margin-bottom: 16rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #bbb;
    text-align: center;
  }
}

// 卡片列表
.app-list {
  .app-card {
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
    }

    // 左侧图标
    .app-icon-wrapper {
      width: 96rpx;
      height: 96rpx;
      margin-right: 24rpx;
      border-radius: 12rpx;
      overflow: hidden;
      flex-shrink: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      .app-icon {
        width: 100%;
        height: 100%;
      }

      .app-emoji {
        font-size: 48rpx;
      }
    }

    // 右侧信息
    .app-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      padding-right: 20rpx;

      .app-name {
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
      }

      .app-address {
        font-size: 24rpx;
        color: #666;
      }

      .app-category {
        font-size: 24rpx;
        color: #999;
      }

      .app-contact {
        font-size: 24rpx;
        color: #667eea;
      }
    }

    // 移除按钮
    .remove-fav-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #ffebee;
      flex-shrink: 0;

      .remove-icon {
        font-size: 32rpx;
      }

      &:active {
        background: #ffcdd2;
      }
    }

    // 企业卡片样式
    &.company-card .app-icon-wrapper {
      background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
      box-shadow: 0 2rpx 8rpx rgba(156, 39, 176, 0.3);
    }

    // 个体工商户卡片样式
    &.individual-card .app-icon-wrapper {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.3);
    }

    // 个人卡片样式
    &.personal-card {
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      border: 2rpx solid #9c27b0;
      box-shadow: 0 2rpx 12rpx rgba(156, 39, 176, 0.15);

      .app-icon-wrapper {
        background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
        box-shadow: 0 2rpx 8rpx rgba(156, 39, 176, 0.3);
      }

      .app-name {
        color: #6a1b9a;
        font-weight: 600;
      }
    }
  }
}
</style>
