<template>
  <view class="my-access-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">我的访问</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <view class="main-content" :style="{ paddingTop: (statusBarHeight + 52) + 'px' }">
      <!-- 左侧：分类滑动栏 -->
      <scroll-view class="sidebar" scroll-y>
        <view class="category-list">
          <view
            v-for="(category, index) in categories"
            :key="index"
            class="category-item"
            :class="{ active: selectedCategoryIndex === index }"
            @tap="selectCategory(index)"
          >
            <text class="category-name">{{ category }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 右侧：app 列表 -->
      <scroll-view class="content-area" scroll-y>
        <!-- 当前分类标题 -->
        <view class="current-category">
          <text class="category-title">{{ currentCategory }}</text>
        </view>

        <!-- app 卡片列表 -->
        <view class="app-list">
          <view
            v-for="app in currentApps"
            :key="app.id"
            class="app-card"
            @tap="handleAppClick(app)"
          >
            <!-- 左侧：图标 -->
            <view class="app-icon-wrapper">
              <image
                v-if="app.icon"
                :src="app.icon"
                mode="aspectFill"
                class="app-icon"
                @error="handleImageError"
              />
              <text v-else class="app-emoji">{{ app.emoji || '📱' }}</text>
            </view>

            <!-- 右侧：信息 -->
            <view class="app-info">
              <text class="app-name">{{ app.name }}</text>
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

// 所有分类
const categories = ref<string[]>([
  '物流服务', '教育服务', '医疗服务', '政务民生', '金融业',
  '交通服务', '房地产服务', '生活服务', 'IT科技', '餐饮服务',
  '旅游服务', '时政信息', '文娱', '工具', '电商平台',
  '商家自营', '商业服务', '公益', '社交', '体育',
  '汽车服务', '咨询', '深度合成', '内测', '快递业与邮政',
  '教育', '出行与交通', '房地产', '餐饮', '旅游', '汽车',
  '公共服务', '本地服务', '跨境电商'
])

// 选中的分类索引
const selectedCategoryIndex = ref(0)

// 模拟 app 数据（来自首页快速入口）
interface App {
  id: string
  name: string
  emoji?: string
  icon?: string
  category: string
}

const allApps = ref<App[]>([
  { id: '1', name: '顺丰速运', emoji: '🚚', icon: '', category: '物流服务' },
  { id: '2', name: '学而思', emoji: '📚', icon: '', category: '教育服务' },
  { id: '3', name: '好大夫在线', emoji: '⚕️', icon: '', category: '医疗服务' },
  { id: '4', name: '个人所得税', emoji: '🏛️', icon: '', category: '政务民生' },
  { id: '5', name: '支付宝', emoji: '💰', icon: '', category: '金融业' },
  { id: '6', name: '滴滴出行', emoji: '🚗', icon: '', category: '交通服务' },
  { id: '7', name: '链家', emoji: '🏠', icon: '', category: '房地产服务' },
  { id: '8', name: '美团', emoji: '🍜', icon: '', category: '生活服务' },
  { id: '9', name: '钉钉', emoji: '💻', icon: '', category: 'IT科技' },
  { id: '10', name: '饿了么', emoji: '🍜', icon: '', category: '餐饮服务' },
  { id: '11', name: '携程旅行', emoji: '✈️', icon: '', category: '旅游服务' },
  { id: '12', name: '12306', emoji: '🔔', icon: '', category: '时政信息' },
  { id: '13', name: '网易云音乐', emoji: '🎵', icon: '', category: '文娱' },
  { id: '14', name: '创客贴', emoji: '🔧', icon: '', category: '工具' },
  { id: '15', name: '淘宝', emoji: '🛒', icon: '', category: '电商平台' },
  { id: '16', name: '京东自营', emoji: '🏪', icon: '', category: '商家自营' },
  { id: '17', name: '美团外卖', emoji: '💼', icon: '', category: '商业服务' },
  { id: '18', name: '支付宝公益', emoji: '❤', icon: '', category: '公益' },
  { id: '19', name: '微信', emoji: '💚', icon: '', category: '社交' },
  { id: '20', name: '懂车帝', emoji: '🚗', icon: '', category: '汽车服务' },
  { id: '21', name: '知乎', emoji: '🧠', icon: '', category: '咨询' },
  { id: '22', name: '剪映', emoji: '✂', icon: '', category: '深度合成' },
  { id: '23', name: 'TestFlight', emoji: '🧪', icon: '', category: '内测' },
  { id: '24', name: '顺丰速运', emoji: '📮', icon: '', category: '快递业与邮政' },
  { id: '25', name: '新东方在线', emoji: '📚', icon: '', category: '教育' },
  { id: '26', name: '哈啰出行', emoji: '🚕', icon: '', category: '出行与交通' },
  { id: '27', name: '贝壳找房', emoji: '🏠', icon: '', category: '房地产' },
  { id: '28', name: '大众点评', emoji: '🍜', icon: '', category: '餐饮' },
  { id: '29', name: '去哪儿旅行', emoji: '✈️', icon: '', category: '旅游' },
  { id: '30', name: '嘀嗒出行', emoji: '🚖', icon: '', category: '汽车' },
  { id: '31', name: '12345', emoji: '📞', icon: '', category: '公共服务' },
  { id: '32', name: '考拉海购', emoji: '🛒', icon: '', category: '跨境电商' },
  { id: '33', name: '本地生活', emoji: '📍', icon: '', category: '本地服务' }
])

// 当前选中的分类
const currentCategory = computed(() => {
  return categories.value[selectedCategoryIndex.value] || '全部'
})

// 当前分类下的 app
const currentApps = computed(() => {
  const category = currentCategory.value
  if (category === '全部') {
    return allApps.value
  }
  return allApps.value.filter(app => app.category === category)
})

// 选择分类
const selectCategory = (index: number) => {
  selectedCategoryIndex.value = index
  console.log('选择分类:', categories.value[index])
}

// 点击 app
const handleAppClick = (app: App) => {
  console.log('点击 app:', app)
  // 这里可以跳转到 app 详情或者打开某个页面
  uni.showToast({
    title: `打开${app.name}`,
    icon: 'success'
  })
}

// 图片加载失败
const handleImageError = (e: any) => {
  console.warn('[图标加载失败]', e)
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.my-access-page {
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
    height: 88rpx;
    padding: 0 20rpx;
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
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
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

// 主内容区域
.main-content {
  display: flex;
  flex: 1;
  height: calc(100vh - var(--status-bar-height) - 88rpx);
}

// 左侧分类滑动栏
.sidebar {
  width: 200rpx;
  background: #fff;
  border-right: 1rpx solid #e5e5e5;

  .category-list {
    padding: 20rpx 0;

    .category-item {
      padding: 24rpx 20rpx;
      border-bottom: 1rpx solid #f0f0f0;
      transition: all 0.2s;

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-left: 4rpx solid #667eea;

        .category-name {
          color: #667eea;
          font-weight: 600;
        }
      }

      .category-name {
        font-size: 26rpx;
        color: #333;
        font-weight: 500;
        line-height: 1.3;
      }
    }
  }
}

// 右侧内容区域
.content-area {
  flex: 1;
  background: #f5f5f5;
  padding-left: 20rpx;
}

// 当前分类标题
.current-category {
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;

  .category-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #667eea;
  }
}

// app 卡片列表 - 一行一个
.app-list {
  padding: 10rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.app-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  height: 120rpx;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
  }
}

.app-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
  margin-right: 16rpx;
}

.app-icon {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.app-emoji {
  font-size: 40rpx;
}

.app-info {
  flex: 1;
  min-width: 0;
}

.app-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
