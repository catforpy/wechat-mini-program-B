<template>
  <view class="index-page">
    <!-- 顶部横向标签栏（关注、推荐、一级类目） -->
    <view class="top-tabs-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <scroll-view
        scroll-x
        class="top-tabs-scroll"
        show-scrollbar="false"
        :scroll-left="scrollLeft"
        @scroll="handleTopTabScroll"
      >
        <view class="top-tabs-wrapper">
          <view
            v-for="(tab, index) in topTabs"
            :key="index"
            :id="'tab-' + index"
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
        <text class="scan-icon">📷</text>
        <input class="search-input" type="text" placeholder="搜索小程序模板" />
        <text class="camera-icon">📷</text>
        <view class="search-btn">搜索</view>
      </view>
    </view>

    <!-- 快速入口 - 横向滑动的Logo卡片 -->
    <view class="quick-entry-container">
      <view class="quick-entry-scroll">
        <view
          v-for="(app, index) in currentTopTabApps"
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
      <!-- 左侧悬浮按钮（触发二级菜单） -->
      <view class="floating-trigger" @click="toggleSecondLevelMenu">
        <text class="trigger-icon">{{ showSecondLevelMenu ? '‹' : '›' }}</text>
      </view>

      <!-- 二级类目弹出面板 -->
      <view
        :class="['second-level-panel', { show: showSecondLevelMenu }]"
        @click="showSecondLevelMenu = false"
      >
        <view class="panel-content" @click.stop>
          <scroll-view scroll-y class="panel-scroll" show-scrollbar={false}>
            <view
              v-for="(category, index) in currentSecondLevelCategories"
              :key="index"
              :class="['panel-item', { active: currentSecondLevel === index }]"
              @click="handleSecondLevelChange(index)"
            >
              {{ category.name }}
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 右侧三级类目（小程序模板卡片） -->
      <view :class="['main-content', { 'shift-right': showSecondLevelMenu }]">
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { getAllMergedCategories, type FirstLevelCategory } from '@/data/categories-by-entity'

// 状态栏高度
const statusBarHeight = ref(0)

// 顶部标签栏数据
const currentTopTab = ref(1) // 默认选中"推荐"

// 滚动位置（使用scroll-left代替scroll-into-view）
const scrollLeft = ref(0)

// 标记是否正在通过代码设置滚动（避免滚动事件冲突）
const isProgrammaticScroll = ref(false)

/**
 * 计算并滚动到指定标签
 */
const scrollTabIntoView = (index: number) => {
  nextTick(() => {
    setTimeout(() => {
      const query = uni.createSelectorQuery()

      // 查询所有标签元素（用于计算累积宽度）
      const tabElements = topTabs.value.map((_, i) => `#tab-${i}`)

      // 为每个标签添加查询
      tabElements.forEach(selector => {
        query.select(selector).boundingClientRect()
      })

      // 查询容器的位置信息
      query.select('.top-tabs-scroll').boundingClientRect()

      query.exec((res) => {
        if (!res || res.length < tabElements.length + 1) {
          console.log('=== 查询失败 ===')
          return
        }

        console.log('=== 滚动到标签 ===')
        console.log('目标索引:', index, '标签名:', topTabs.value[index])

        // 计算目标标签之前所有标签的总宽度
        let accumulatedWidth = 0
        for (let i = 0; i < index; i++) {
          const rect = res[i] as any
          if (rect) {
            accumulatedWidth += rect.width
            console.log(`标签 ${i} (${topTabs.value[i]}) 宽度:`, rect.width, '累积:', accumulatedWidth)
          }
        }

        console.log('需要滚动的距离:', accumulatedWidth)
        console.log('当前 scrollLeft:', scrollLeft.value)

        // 标记为程序化滚动
        isProgrammaticScroll.value = true
        scrollLeft.value = accumulatedWidth

        console.log('设置后 scrollLeft:', scrollLeft.value)

        // 延迟重置标记，避免影响用户手动滑动
        setTimeout(() => {
          isProgrammaticScroll.value = false
        }, 500)
      })
    }, 200)
  })
}

/**
 * 处理顶部标签滚动事件
 */
const handleTopTabScroll = (e: any) => {
  const currentScrollLeft = e.detail.scrollLeft

  // 如果是程序化滚动，不处理
  if (isProgrammaticScroll.value) {
    console.log('[程序化滚动] 位置:', currentScrollLeft)
    return
  }

  // 用户手动滚动，记录但不干预
  console.log('[用户滚动] 位置:', currentScrollLeft)
}

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

  // 等待DOM更新后，初始化滚动到"推荐"标签位置
  nextTick(() => {
    setTimeout(() => {
      scrollTabIntoView(1)
    }, 300)
  })
})

// 切换顶部标签
const handleTopTabChange = (index: number) => {
  currentTopTab.value = index
  scrollTabIntoView(index) // 滚动到选中的标签
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

// 二级菜单面板显示状态
const showSecondLevelMenu = ref(false)

// 切换二级菜单显示/隐藏
const toggleSecondLevelMenu = () => {
  showSecondLevelMenu.value = !showSecondLevelMenu.value
}

// 定义不同标签的应用数据
const tabAppsData: Record<string, QuickEntryApp[]> = {
  '关注': [
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
    },
    {
      name: '教育通',
      icon: '',
      path: '/pages/template/education',
      emoji: '📚'
    },
    {
      name: '医疗帮',
      icon: '',
      path: '/pages/template/medical',
      emoji: '🏥'
    },
    {
      name: '政务通',
      icon: '',
      path: '/pages/template/government',
      emoji: '🏛️'
    },
    {
      name: '物流宝',
      icon: '',
      path: '/pages/template/logistics',
      emoji: '📦'
    }
  ],
  '推荐': [
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
    },
    {
      name: '零售易',
      icon: '',
      path: '/pages/template/retail',
      emoji: '🛒'
    },
    {
      name: '餐饮通',
      icon: '',
      path: '/pages/template/food',
      emoji: '🍽️'
    },
    {
      name: '生活圈',
      icon: '',
      path: '/pages/template/life',
      emoji: '🌟'
    },
    {
      name: '优教',
      icon: '',
      path: '/pages/template/education',
      emoji: '🎓'
    }
  ]
}

// 当前顶部标签对应的应用列表
const currentTopTabApps = computed(() => {
  const currentTabName = topTabs.value[currentTopTab.value]
  // 如果是关注或推荐，返回对应的应用列表
  if (currentTabName === '关注' || currentTabName === '推荐') {
    return tabAppsData[currentTabName] || []
  }
  // 其他类目暂时返回推荐的应用列表（后续可以根据类目配置不同的应用）
  return tabAppsData['推荐'] || []
})

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
  showSecondLevelMenu.value = false // 选择后关闭面板
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
  padding-bottom: 120rpx;
}

// 搜索框区域（透明背景）
.search-container {
  margin-top: 170rpx; // 为顶部标签栏留出足够空间 (140 + 50 - 20)
  background: transparent;
  padding: 20rpx 30rpx;

  .search-box {
    display: flex;
    align-items: center;
    height: 64rpx;
    background-color: #ffffff;
    border-radius: 32rpx;
    padding: 0 24rpx;
    gap: 12rpx;

    .scan-icon {
      font-size: 32rpx;
      color: #999;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .camera-icon {
      font-size: 32rpx;
      color: #999;
    }

    .search-btn {
      padding: 8rpx 20rpx;
      background: linear-gradient(135deg, #ff9500 0%, #ff6a00 100%);
      color: #ffffff;
      font-size: 26rpx;
      border-radius: 20rpx;
      font-weight: 500;
    }
  }
}

// 快速入口 - 横向滑动的Logo卡片
.quick-entry-container {
  background-color: #ffffff;
  padding: 30rpx 0;
  margin-bottom: 20rpx;

  .quick-entry-scroll {
    display: flex;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 30rpx;
    gap: 20rpx;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }

    .app-card {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx;
      min-width: 160rpx;
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

// 顶部横向标签栏（淘宝风格，浅橙色渐变背景）
.top-tabs-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(90deg, #ff9500 0%, #ff6a00 100%);

  .top-tabs-scroll {
    width: 100%;
    white-space: nowrap;
  }

  .top-tabs-wrapper {
    display: inline-flex;
    padding: 10rpx 30rpx;
    gap: 10rpx;
  }

  .top-tab-item {
    position: relative;
    flex-shrink: 0;
    padding: 16rpx 28rpx;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8rpx;
    transition: all 0.3s;
    margin-bottom: 0; // 确保贴底

    .tab-text {
      font-size: 32rpx;
      color: rgba(255, 255, 255, 0.8);
      white-space: nowrap;
    }

    &.active {
      background-color: #ffffff;
      border-radius: 8rpx;
      box-shadow: 0 2rpx 8rpx rgba(255, 106, 0, 0.15);

      .tab-text {
        color: #ff6a00;
        font-weight: bold;
      }
    }

    .tab-underline {
      display: none; // 改用白色背景，不需要下划线了
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
  position: relative;
  display: flex;
  height: calc(100vh - 520rpx);
}

// 左侧悬浮触发按钮（相对于content-container定位）
.floating-trigger {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1rpx solid #e0e0e0;
  border-left: none;
  border-radius: 0 16rpx 16rpx 0;
  padding: 16rpx 8rpx;
  box-shadow: 2rpx 0 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  .trigger-icon {
    font-size: 28rpx;
    color: #666;
    font-weight: bold;
  }
}

// 二级类目弹出面板（相对于content-container定位）
.second-level-panel {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 180rpx;
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;

  &.show {
    opacity: 1;
    visibility: visible;
  }

  .panel-content {
    width: 180rpx;
    height: 100%;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  &.show .panel-content {
    transform: translateX(0);
  }

  .panel-scroll {
    flex: 1;
    overflow-y: auto;
  }

  .panel-item {
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

// 右侧主内容（带动画的margin-left）
.main-content {
  width: 100%;
  margin-left: 0;
  transition: margin-left 0.3s;
  background-color: #ffffff;

  &.shift-right {
    margin-left: 180rpx;
  }

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
