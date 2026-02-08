<template>
  <view class="index-page">
    <!-- 顶部横向标签栏（关注、推荐、一级类目） -->
    <view class="top-tabs-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <scroll-view scroll-x class="top-tabs-scroll" show-scrollbar="false">
        <view class="top-tabs-wrapper">
          <view
            v-for="(tab, index) in topTabs"
            :key="index"
            :class="['top-tab-item', { active: currentTopTab === index }]"
            @click="handleTopTabChange(index)"
          >
            <text class="tab-text">{{ tab }}</text>
            <view v-if="currentTopTab === index" class="tab-underline"></view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 搜索框区域 -->
    <view class="search-container">
      <view class="search-box">
        <input class="search-input" type="text" placeholder="搜索小程序模板" />
      </view>
    </view>

    <!-- 快速入口 - 4个Logo卡片 -->
    <view class="quick-entry-container">
      <view class="quick-entry-grid">
        <view
          v-for="(app, index) in quickEntryApps"
          :key="index"
          class="app-card"
          @click="handleAppClick(app)"
        >
          <view class="app-icon">
            <image v-if="app.icon && !app.emoji" :src="app.icon" mode="aspectFit" class="app-icon-image" />
            <text v-else class="app-emoji">{{ app.emoji || '📱' }}</text>
          </view>
          <text class="app-name">{{ app.name }}</text>
        </view>
      </view>
    </view>

    <!-- 一级类目横向标签 -->
    <view class="category-tabs">
      <scroll-view scroll-x class="tabs-scroll" show-scrollbar={false}>
        <view class="tabs-wrapper">
          <view
            v-for="(category, index) in currentCategories"
            :key="index"
            :class="['tab-item', { active: currentFirstLevel === index }]"
            @click="handleFirstLevelChange(index)"
          >
            {{ category.name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 二级类目+三级类目 -->
    <view class="content-container">
      <!-- 左侧二级类目 -->
      <view class="sidebar">
        <scroll-view scroll-y class="sidebar-scroll" show-scrollbar={false}>
          <view
            v-for="(category, index) in currentSecondLevelCategories"
            :key="index"
            :class="['sidebar-item', { active: currentSecondLevel === index }]"
            @click="handleSecondLevelChange(index)"
          >
            {{ category.name }}
          </view>
        </scroll-view>
      </view>

      <!-- 右侧三级类目（小程序模板卡片） -->
      <view class="main-content">
        <scroll-view scroll-y class="content-scroll" show-scrollbar={false}>
          <view class="category-title">{{ currentSecondLevelCategories[currentSecondLevel]?.name }}</view>
          <view class="template-grid">
            <view
              v-for="(template, index) in currentThirdLevelTemplates"
              :key="index"
              class="template-card"
              @click="handleTemplateClick(template)"
            >
              <view class="template-icon">
                <text class="template-emoji">📱</text>
              </view>
              <text class="template-name">{{ template.name }}</text>
              <text class="template-desc">{{ template.desc }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllMergedCategories, type FirstLevelCategory } from '@/data/categories-by-entity'

// 状态栏高度
const statusBarHeight = ref(0)

// 顶部标签栏数据
const currentTopTab = ref(1) // 默认选中"推荐"

// 所有合并的类目（包含企业、个人、境外）
const allMergedCategories = ref<FirstLevelCategory[]>([])

// 顶部标签栏
const topTabs = computed(() => {
  // 动态生成：关注、推荐、以及所有一级类目
  const firstLevelCategories = allMergedCategories.value.map(c => c.name)
  return ['关注', '推荐', ...firstLevelCategories]
})

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载所有合并的类目数据
  allMergedCategories.value = getAllMergedCategories()
  console.log('所有合并的类目数量:', allMergedCategories.value.length)
})

// 切换顶部标签
const handleTopTabChange = (index: number) => {
  currentTopTab.value = index
  console.log('切换顶部标签:', topTabs.value[index])
}

// 类型定义
interface TemplateInfo {
  name: string
  desc: string
}

interface QuickEntryApp {
  name: string
  icon: string
  path: string
  emoji?: string
}

// 当前选中索引
const currentFirstLevel = ref(0)
const currentSecondLevel = ref(0)

// 快速入口应用（4个Logo卡片）
const quickEntryApps: QuickEntryApp[] = [
  {
    name: '会都',
    icon: '/static/会都.jpg',
    path: '/pages/template/retail'
  },
  {
    name: '达管',
    icon: '/static/达管.png',
    path: '/pages/template/education'
  },
  {
    name: '都达',
    icon: '/static/都达.png',
    path: '/pages/template/food'
  },
  {
    name: '金达',
    icon: '/static/金达.jpg',
    path: '/pages/template/life'
  }
]

// 当前类目数据（使用所有合并的类目）
const currentCategories = computed(() => {
  return allMergedCategories.value
})

// 当前二级类目
const currentSecondLevelCategories = computed(() => {
  return currentCategories.value[currentFirstLevel.value]?.secondLevel || []
})

// 当前三级类目模板
const currentThirdLevelTemplates = computed(() => {
  return currentSecondLevelCategories.value[currentSecondLevel.value]?.templates || []
})

// 切换一级类目
const handleFirstLevelChange = (index: number) => {
  currentFirstLevel.value = index
  currentSecondLevel.value = 0
}

// 切换二级类目
const handleSecondLevelChange = (index: number) => {
  currentSecondLevel.value = index
}

// 点击快速入口应用
const handleAppClick = (app: QuickEntryApp) => {
  uni.showToast({
    title: `打开${app.name}`,
    icon: 'none'
  })
  // TODO: 跳转到对应应用
}

// 点击模板
const handleTemplateClick = (template: TemplateInfo) => {
  console.log('点击模板:', template)

  // 获取当前二级类目信息（包含资质要求）
  const currentSecondLevelCategory = currentSecondLevelCategories.value[currentSecondLevel.value]
  const currentFirstLevelCategory = currentCategories.value[currentFirstLevel.value]

  // 构建类目信息
  const categoryInfo = {
    firstLevel: currentFirstLevelCategory?.name || '',
    secondLevel: currentSecondLevelCategory?.name || '',
    qualification: currentSecondLevelCategory?.qualification || '',
    scope: currentSecondLevelCategory?.scope || ''
  }

  console.log('类目信息:', categoryInfo)

  // 传递模板基本信息和类目信息到详情页
  uni.navigateTo({
    url: `/pages/template/detail/index?name=${encodeURIComponent(template.name)}&desc=${encodeURIComponent(template.desc)}&category=模板&userRole=merchant&firstLevel=${encodeURIComponent(categoryInfo.firstLevel)}&secondLevel=${encodeURIComponent(categoryInfo.secondLevel)}&qualification=${encodeURIComponent(categoryInfo.qualification)}&scope=${encodeURIComponent(categoryInfo.scope)}`
  })
}
</script>

<style scoped lang="scss">
.index-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  background-image: url('/static/背景图001.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-bottom: 120rpx;
}

// 搜索框区域（透明背景）
.search-container {
  margin-top: 100rpx; // 为顶部标签栏留出空间
  background: transparent;
  padding: 20rpx 30rpx;

  .search-box {
    display: flex;
    align-items: center;
    height: 64rpx;
    background-color: #f5f5f5;
    border-radius: 32rpx;
    padding: 0 24rpx;

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }
  }
}

// 快速入口 - 4个Logo卡片
.quick-entry-container {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .quick-entry-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .app-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx 10rpx;
      border-radius: 16rpx;
      background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
      transition: all 0.3s;

      &:active {
        transform: scale(0.95);
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
      }

      .app-icon {
        width: 96rpx;
        height: 96rpx;
        margin-bottom: 12rpx;
        border-radius: 20rpx;
        overflow: hidden;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        .app-icon-image {
          width: 100%;
          height: 100%;
        }

        .app-emoji {
          font-size: 56rpx;
        }
      }

      .app-name {
        font-size: 24rpx;
        font-weight: 500;
        color: #333;
        text-align: center;
      }
    }
  }
}

// 顶部横向标签栏（淘宝风格，透明背景）
.top-tabs-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: transparent;

  .top-tabs-scroll {
    width: 100%;
    white-space: nowrap;
  }

  .top-tabs-wrapper {
    display: inline-flex;
    padding: 0 30rpx;
  }

  .top-tab-item {
    position: relative;
    flex-shrink: 0;
    padding: 24rpx 32rpx;
    display: inline-flex;
    flex-direction: column;
    align-items: center;

    .tab-text {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.6);
      white-space: nowrap;
    }

    &.active .tab-text {
      color: #ffffff;
      font-weight: bold;
    }

    .tab-underline {
      position: absolute;
      bottom: 8rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 6rpx;
      background-color: #ffffff;
      border-radius: 3rpx;
    }
  }
}

// 一级类目横向标签
.category-tabs {
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;

  .tabs-scroll {
    white-space: nowrap;
  }

  .tabs-wrapper {
    display: inline-flex;
    padding: 0 20rpx;
  }

  .tab-item {
    flex-shrink: 0;
    padding: 24rpx 32rpx;
    font-size: 28rpx;
    color: #666;
    position: relative;

    &.active {
      color: #333;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #667eea;
        border-radius: 2rpx;
      }
    }
  }
}

// 主内容区域
.content-container {
  display: flex;
  height: calc(100vh - 520rpx);
}

// 左侧二级类目
.sidebar {
  width: 180rpx;
  background-color: #f8f8f8;

  .sidebar-scroll {
    height: 100%;
  }

  .sidebar-item {
    padding: 32rpx 20rpx;
    font-size: 26rpx;
    color: #666;
    text-align: center;
    border-left: 4rpx solid transparent;
    transition: all 0.3s;

    &.active {
      background-color: #ffffff;
      color: #333;
      font-weight: bold;
      border-left-color: #667eea;
    }
  }
}

// 右侧主内容
.main-content {
  flex: 1;
  background-color: #ffffff;

  .content-scroll {
    height: 100%;
    padding: 30rpx;
  }

  .category-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;

    .template-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30rpx 20rpx;
      border-radius: 16rpx;
      background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
      transition: all 0.3s;

      &:active {
        transform: scale(0.95);
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
      }

      .template-icon {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 16rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
        overflow: hidden;

        .template-emoji {
          font-size: 48rpx;
        }
      }

      .template-name {
        font-size: 26rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
        text-align: center;
      }

      .template-desc {
        font-size: 22rpx;
        color: #999;
        text-align: center;
      }
    }
  }
}
</style>
