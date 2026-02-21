<template>
  <view class="index-page">
    <!-- 顶部区域容器 -->
    <view class="top-area">
      <!-- 顶部横向标签栏 -->
      <TopTabBar
        v-model="currentTopTab"
        :tabs="topTabs"
        :status-bar-height="statusBarHeight"
        :min-tab-index="1"
      />

      <!-- 搜索框 -->
      <SearchBar v-model="searchText" @search="handleSearch" />

      <!-- 快速入口 -->
      <QuickEntry :apps="currentTopTabApps" @app-click="handleAppClick" />

      <!-- 广告字幕轮播 -->
      <AdTicker :ads="adsData" />

      <!-- 小程序浏览入口 -->
      <MiniProgramBrowse @browse="handleBrowseMiniPrograms" />
    </view>

    <!-- 页面整体内容容器 -->
    <view class="page-wrapper" :class="{ 'quick-entry-expanded-mode': isQuickEntryExpanded }">
      <!-- 二级类目 + 类型标签 + 三级网格 -->
      <SecondLevelMenu
        v-model="currentSecondLevel"
        :categories="currentSecondLevelCategories"
      >
        <!-- 类型标签栏（可购买/可租赁/可合作） -->
        <TypeTabBar
          v-model="currentTypeTab"
          :tabs="typeTabs"
          @change="handleTypeTabChange"
        />

        <!-- 小程序网格 -->
        <MiniProgramGrid
          :title="currentSecondLevelCategories[currentSecondLevel]?.name"
          :programs="filteredMiniPrograms"
          @card-click="handleTemplateCardClick"
          @collect-click="handleCollectClick"
        />
      </SecondLevelMenu>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllMergedCategories, type FirstLevelCategory } from '@/data/categories-by-entity'

// 导入组件
import TopTabBar from '@/components/index/TopTabBar.vue'
import SearchBar from '@/components/index/SearchBar.vue'
import QuickEntry from '@/components/index/QuickEntry.vue'
import AdTicker from '@/components/index/AdTicker.vue'
import MiniProgramBrowse from '@/components/index/MiniProgramBrowse.vue'
import SecondLevelMenu from '@/components/index/SecondLevelMenu.vue'
import TypeTabBar from '@/components/index/TypeTabBar.vue'
import MiniProgramGrid, { type MiniProgram } from '@/components/index/MiniProgramGrid.vue'
import type { QuickEntryApp } from '@/components/index/QuickEntry.vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 顶部标签栏
const currentTopTab = ref(1) // 默认选中"推荐"

// 二级类目索引
const currentSecondLevel = ref(0)

// 搜索框
const searchText = ref('')

// 快速入口展开状态
const isQuickEntryExpanded = ref(false)

// 广告字幕数据
const adsData = ref([
  '🎉 新用户注册即送100都达豆！',
  '📢 企业认证可免费领取10个小程序模板！',
  '🔥 限时优惠：餐饮类小程序8折优惠中！',
  '🌟 推荐好友获得额外奖励！',
  '💡 实名认证即可解锁全部功能！'
])

// 类型标签（新增）
const currentTypeTab = ref(0)
const typeTabs = ref([
  { label: '购买', value: 'purchase' },
  { label: '租赁', value: 'rent' },
  { label: '合作', value: 'cooperate' }
])

// 类目数据
const allMergedCategories = ref<FirstLevelCategory[]>([])

// 顶部标签栏
const topTabs = computed(() => {
  const firstLevelCategories = allMergedCategories.value.map(c => c.name)
  return ['关注', '推荐', ...firstLevelCategories]
})

// 快速入口应用数据
const tabAppsData: Record<string, QuickEntryApp[]> = {
  '关注': [
    { name: '会都', icon: '/static/logo.jpg', path: '/pages/template/retail' },
    { name: '达管', icon: '/static/daguan.png', path: '/pages/template/education' },
    { name: '都达', icon: '/static/douda.png', path: '/pages/template/food' },
    { name: '金达', icon: '/static/jinda.jpg', path: '/pages/template/life' },
    { name: '教育通', emoji: '📚', path: '/pages/template/education' },
    { name: '医疗帮', emoji: '🏥', path: '/pages/template/medical' },
    { name: '政务通', emoji: '🏛️', path: '/pages/template/government' },
    { name: '物流宝', emoji: '📦', path: '/pages/template/logistics' }
  ],
  '推荐': [
    { name: '会都', icon: '/static/logo.jpg', path: '/pages/template/retail' },
    { name: '达管', icon: '/static/daguan.png', path: '/pages/template/education' },
    { name: '都达', icon: '/static/douda.png', path: '/pages/template/food' },
    { name: '金达', icon: '/static/jinda.jpg', path: '/pages/template/life' },
    { name: '零售易', emoji: '🛒', path: '/pages/template/retail' },
    { name: '餐饮通', emoji: '🍽️', path: '/pages/template/food' },
    { name: '生活圈', emoji: '🌟', path: '/pages/template/life' },
    { name: '优教', emoji: '🎓', path: '/pages/template/education' },
    { name: '医疗通', emoji: '🏥', path: '/pages/template/medical' },
    { name: '政务宝', emoji: '🏛️', path: '/pages/template/government' },
    { name: '物流快', emoji: '📦', path: '/pages/template/logistics' },
    { name: '金融通', emoji: '💰', path: '/pages/template/finance' },
    { name: '旅游通', emoji: '✈️', path: '/pages/template/travel' },
    { name: '酒店帮', emoji: '🏨', path: '/pages/template/hotel' }
  ],
  '电商零售': [
    { name: '零售易', emoji: '🛒', path: '/pages/template/retail' },
    { name: '商城通', emoji: '🏪', path: '/pages/template/mall' },
    { name: '团购宝', emoji: '🎫', path: '/pages/template/groupbuy' },
    { name: '社区购', emoji: '🏘️', path: '/pages/template/community' },
    { name: '生鲜达', emoji: '🥬', path: '/pages/template/fresh' },
    { name: '母婴通', emoji: '👶', path: '/pages/template/maternity' },
    { name: '美妆帮', emoji: '💄', path: '/pages/template/beauty' },
    { name: '服装城', emoji: '👗', path: '/pages/template/clothing' }
  ],
  '餐饮美食': [
    { name: '餐饮通', emoji: '🍽️', path: '/pages/template/food' },
    { name: '点餐宝', emoji: '📋', path: '/pages/template/order' },
    { name: '外卖达', emoji: '🛵', path: '/pages/template/delivery' },
    { name: '咖啡通', emoji: '☕', path: '/pages/template/coffee' },
    { name: '奶茶帮', emoji: '🧋', path: '/pages/template/tea' },
    { name: '美食街', emoji: '🍜', path: '/pages/template/foodstreet' }
  ],
  '物流服务': [
    { name: '物流快', emoji: '📦', path: '/pages/template/logistics' },
    { name: '快递通', emoji: '🚚', path: '/pages/template/express' },
    { name: '货运宝', emoji: '🚛', path: '/pages/template/freight' },
    { name: '仓储通', emoji: '🏭', path: '/pages/template/warehouse' },
    { name: '配送达', emoji: '🚲', path: '/pages/template/distribution' }
  ]
}

// 当前顶部标签对应的应用列表
const currentTopTabApps = computed(() => {
  const currentTabName = topTabs.value[currentTopTab.value]
  if (tabAppsData[currentTabName]) {
    return tabAppsData[currentTabName]
  }
  return tabAppsData['推荐'] || []
})

// 当前类目数据
const currentCategories = computed(() => {
  return allMergedCategories.value
})

// 当前二级类目
const currentSecondLevelCategories = computed(() => {
  if (currentTopTab.value < 2) {
    return []
  }
  const categoryIndex = currentTopTab.value - 2
  return currentCategories.value[categoryIndex]?.secondLevel || []
})

// 所有小程序模板
const allMiniPrograms = ref<MiniProgram[]>([
  {
    id: '1',
    name: '餐饮点餐系统',
    emoji: '🍔',
    icon: '/static/logo.jpg',
    price: '599',
    douPrice: '5990',
    isFollowed: false,
    type: 'purchase' // 新增：类型字段
  },
  {
    id: '2',
    name: '零售商城',
    emoji: '🛒',
    icon: '/static/logo.jpg',
    price: '799',
    douPrice: '7990',
    isFollowed: false,
    type: 'rent'
  },
  {
    id: '3',
    name: '在线教育平台',
    emoji: '🎓',
    icon: '/static/logo.jpg',
    price: '999',
    douPrice: '9990',
    isFollowed: false,
    type: 'cooperate'
  },
  {
    id: '4',
    name: '美业预约',
    emoji: '💅',
    icon: '/static/logo.jpg',
    price: '499',
    douPrice: '4990',
    isFollowed: false,
    type: 'purchase'
  },
  {
    id: '5',
    name: '酒店预订',
    emoji: '🏨',
    icon: '/static/logo.jpg',
    price: '699',
    douPrice: '6990',
    isFollowed: false,
    type: 'rent'
  },
  {
    id: '6',
    name: '生鲜配送',
    emoji: '🥬',
    icon: '/static/logo.jpg',
    price: '899',
    douPrice: '8990',
    isFollowed: false,
    type: 'cooperate'
  }
])

// 已关注的小程序列表
const followedPrograms = ref<MiniProgram[]>([])

// 收藏的小程序数据
const collectionData = ref<Record<string, MiniProgram[]>>({
  purchase: [],
  rent: [],
  cooperate: []
})

// 收藏的小程序ID集合（用于快速判断是否已收藏）
const collectedIds = ref<Set<string>>(new Set())

// 根据类型标签筛选小程序
const filteredMiniPrograms = computed(() => {
  // "关注"标签：显示已关注的小程序
  if (currentTopTab.value === 0) {
    return followedPrograms.value
  }

  // "推荐"标签：显示推荐的小程序
  if (currentTopTab.value === 1) {
    const allType = typeTabs.value[currentTypeTab.value].value
    const programs = allMiniPrograms.value.filter(p => p.type === allType)

    // 为"推荐"标签下的小程序添加默认分类信息
    return programs.map(p => ({
      ...p,
      isCollected: collectedIds.value.has(p.id),
      firstLevel: p.firstLevel || '推荐',
      secondLevel: p.secondLevel || '默认分类'
    }))
  }

  // 其他标签：根据当前二级类目的模板生成
  const templates = currentSecondLevelCategories.value[currentSecondLevel.value]?.templates || []

  if (templates.length === 0) {
    return []
  }

  const currentType = typeTabs.value[currentTypeTab.value].value
  const categoryName = currentSecondLevelCategories.value[currentSecondLevel.value]?.name || ''

  const currentFirstLevelCategory = currentCategories.value[currentTopTab.value - 2]
  const firstLevelName = currentFirstLevelCategory?.name || ''
  const secondLevelName = currentSecondLevelCategories.value[currentSecondLevel.value]?.name || ''

  const programs = templates.map((template, index) => {
    const programId = `${currentTopTab.value}_${currentSecondLevel.value}_${currentType}_${index}`
    return {
      id: programId,
      name: template.name,
      desc: template.desc,
      icon: '/static/logo.jpg',
      emoji: getTemplateEmoji(categoryName),
      price: Math.floor(Math.random() * 500 + 99).toString(),
      douPrice: Math.floor(Math.random() * 5000 + 990).toString(),
      isFollowed: false,
      isCollected: collectedIds.value.has(programId), // 标记是否已收藏
      type: currentType,
      firstLevel: firstLevelName, // 添加一级分类
      secondLevel: secondLevelName // 添加二级分类
    }
  })

  return programs
})

// 根据类目名称获取对应的emoji
const getTemplateEmoji = (categoryName: string) => {
  const emojiMap: Record<string, string> = {
    '收件/派件': '📦',
    '查件': '🔍',
    '装卸搬运': '📦',
    '仓储管理': '🏭',
    '快递柜': '📮',
    '货物运输': '🚚',
    '学历教育（培训机构）': '🎓',
    '在线视频课程': '📺',
    '婴幼儿教育': '👶',
    '素质教育': '🎨',
    '互联网医院': '🏥',
    '就医服务': '💊',
    '药品信息展示': '💊',
    '丽人服务': '💅',
    '家政服务': '🧹',
    '宠物医院/兽医': '🐕',
    '宠物（非医院类）': '🐾',
    '婚庆服务': '💒',
    '点餐平台': '🍜',
    '外卖平台': '🥡',
    '餐厅排队': '🔢',
    '景区服务': '🏔',
    '住宿服务': '🏨',
    '旅行社': '✈️',
    '记账': '💰',
    '日历': '📅',
    '天气': '🌤️',
    '备忘录': '📝',
    '法律服务平台': '⚖️',
    '企业管理': '💼',
    '会展服务': '🎪'
  }
  return emojiMap[categoryName] || '📱'
}

// 类型标签切换
const handleTypeTabChange = (tab: any, index: number) => {
  console.log('切换类型标签:', tab)
}

// 搜索
const handleSearch = (value: string) => {
  console.log('搜索:', value)
  uni.showToast({
    title: `搜索：${value}`,
    icon: 'none'
  })
}

// 快速入口点击
const handleAppClick = (app: QuickEntryApp) => {
  uni.showToast({
    title: `打开${app.name}`,
    icon: 'none'
  })
}

// 小程序浏览
const handleBrowseMiniPrograms = () => {
  uni.navigateTo({
    url: '/pages/mini-programs/browse'
  })
}

// 小程序卡片点击
const handleTemplateCardClick = (program: MiniProgram) => {
  console.log('点击模板卡片:', program)
  console.log('当前类型标签索引:', currentTypeTab.value)
  console.log('当前类型标签值:', typeTabs.value[currentTypeTab.value])

  // 获取当前类型（购买/租赁/合作）
  const currentType = typeTabs.value[currentTypeTab.value].value

  console.log('🎯 当前类型:', currentType)

  // 映射数据ID，根据类型使用不同的假数据
  let detailId = ''
  if (currentType === 'purchase') {
    // 销售类：使用 selling-1 或 selling-2
    detailId = program.id === '1' || program.name.includes('餐饮') ? 'selling-1' : 'selling-2'
  } else if (currentType === 'rent') {
    // 租赁类：使用 renting-1
    detailId = 'renting-1'
  } else if (currentType === 'cooperate') {
    // 合作类：使用 cooperate-1
    detailId = 'cooperate-1'
  }

  console.log('🚀 跳转到详情页:', {
    type: currentType,
    id: detailId,
    programName: program.name
  })

  // 跳转到新的通用详情页
  uni.navigateTo({
    url: `/pages/miniprogram-detail?type=${currentType}&id=${detailId}&name=${encodeURIComponent(program.name)}`
  })
}

// 加载关注的小程序
const loadFollowedPrograms = () => {
  try {
    const saved = uni.getStorageSync('followed_programs_full')
    if (saved) {
      followedPrograms.value = JSON.parse(saved) as MiniProgram[]
      console.log('已关注的小程序:', followedPrograms.value)
    } else {
      followedPrograms.value = []
    }
  } catch (e) {
    console.error('加载关注列表失败:', e)
    followedPrograms.value = []
  }
}

// 加载收藏数据
const loadCollectionData = () => {
  try {
    const saved = uni.getStorageSync('my_collection')
    if (saved) {
      collectionData.value = JSON.parse(saved)

      // 构建收藏ID集合
      collectedIds.value.clear()
      Object.values(collectionData.value).forEach((programs: MiniProgram[]) => {
        programs.forEach((program: MiniProgram) => {
          collectedIds.value.add(program.id)
        })
      })

      console.log('已收藏的小程序数量:', collectedIds.value.size)
    }
  } catch (e) {
    console.error('加载收藏数据失败:', e)
  }
}

// 保存收藏数据
const saveCollectionData = () => {
  try {
    const dataStr = JSON.stringify(collectionData.value)
    console.log('[首页] 保存收藏数据:', dataStr)
    uni.setStorageSync('my_collection', dataStr)
    console.log('[首页] 收藏数据已保存')
  } catch (e) {
    console.error('保存收藏数据失败:', e)
  }
}

// 处理收藏点击
const handleCollectClick = (program: MiniProgram) => {
  console.log('========== 点击收藏按钮 ==========')
  console.log('当前小程序:', program)
  console.log('当前类型标签索引:', currentTypeTab.value)

  const currentType = typeTabs.value[currentTypeTab.value].value
  console.log('当前类型:', currentType)

  if (program.isCollected) {
    // 取消收藏
    console.log('执行取消收藏操作')
    collectionData.value[currentType] = collectionData.value[currentType].filter(
      (p: MiniProgram) => p.id !== program.id
    )
    collectedIds.value.delete(program.id)

    uni.showToast({
      title: '已取消收藏',
      icon: 'success'
    })
  } else {
    // 添加收藏
    console.log('执行添加收藏操作')

    const collectionProgram: MiniProgram = {
      ...program,
      isCollected: true,
      collectedAt: new Date().toISOString(),
      // 确保包含分类信息
      firstLevel: program.firstLevel || '推荐',
      secondLevel: program.secondLevel || '默认分类'
    }

    console.log('准备保存的小程序:', collectionProgram)
    console.log('一级分类:', collectionProgram.firstLevel)
    console.log('二级分类:', collectionProgram.secondLevel)

    collectionData.value[currentType].push(collectionProgram)
    collectedIds.value.add(program.id)

    console.log('收藏后的数据:', collectionData.value)

    uni.showToast({
      title: '已收藏到我的宝库',
      icon: 'success'
    })
  }

  // 保存到本地存储
  console.log('准备保存到本地存储...')
  saveCollectionData()
  console.log('========== 收藏操作完成 ==========')
}

onMounted(() => {
  console.log('[首页] ========== 检查屏幕方向 ==========')

  const systemInfo = uni.getSystemInfoSync()
  const windowWidth = systemInfo.windowWidth || 0
  const windowHeight = systemInfo.windowHeight || 0

  const isLandscape = windowWidth > windowHeight
  console.log('[首页] 窗口尺寸 - 宽:', windowWidth, '高:', windowHeight)
  console.log('[首页] 当前是否横屏:', isLandscape ? '❌ 是横屏' : '✓ 是竖屏')

  if (isLandscape) {
    console.log('[首页] ⚠️⚠️⚠️ 警告:首页是横屏!')
  }

  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载所有合并的类目数据
  allMergedCategories.value = getAllMergedCategories()
  console.log('所有合并的类目数量:', allMergedCategories.value.length)

  // 加载关注的小程序列表
  loadFollowedPrograms()

  // 加载收藏数据
  loadCollectionData()
})
</script>

<style scoped lang="scss">
.index-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

// 页面整体包装器
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
  position: relative;
  will-change: transform;
  padding-top: 750rpx;
  transition: padding-top 0.3s ease;

  &.quick-entry-expanded-mode {
    padding-top: 1520rpx;
  }
}

// 顶部区域容器
.top-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  background-color: #f5f5f5;
}
</style>
