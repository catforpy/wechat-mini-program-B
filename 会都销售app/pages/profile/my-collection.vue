<template>
  <view class="my-collection-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">我的宝库</view>
      </view>
    </view>

    <!-- 类型标签栏 -->
    <view class="tabs-container">
      <CollectionTypeTabBar
        v-model="currentTypeIndex"
        :tabs="typeTabs"
        @change="handleTypeChange"
      />
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 宝库标签：瀑布流展示所有小程序，不分组 -->
      <view v-if="currentType === 'collection' && currentTypePrograms.length > 0" class="collection-grid">
        <MiniProgramCard
          v-for="program in currentTypePrograms"
          :key="program.id"
          :program="program"
          :show-type-badge="true"
          :current-tab-type="currentType"
          :navigate-to="handleProgramClick"
          @remove="handleProgramRemove"
        />
      </view>

      <!-- 购买/租赁/合作标签：按分类分组展示 -->
      <view v-else-if="currentType !== 'collection' && groupedPrograms.length > 0" class="content-wrapper">
        <CollectionCategoryGroup
          v-for="(group, index) in groupedPrograms"
          :key="index"
          :first-level="group.firstLevel"
          :second-level="group.secondLevel"
          :programs="group.programs"
          :current-tab-type="currentType"
          @program-click="handleProgramClick"
          @program-remove="handleProgramRemove"
        />
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <text class="empty-icon">💎</text>
        <text class="empty-text">暂无收藏</text>
        <text class="empty-hint">快去首页选购小程序吧</text>
        <button class="empty-action-btn" @tap="goToIndex">去选购</button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CollectionTypeTabBar, { type TypeTab } from '@/components/collection/CollectionTypeTabBar.vue'
import CollectionCategoryGroup from '@/components/collection/CollectionCategoryGroup.vue'
import MiniProgramCard from '@/components/collection/MiniProgramCard.vue'
import type { MiniProgram } from '@/components/collection/MiniProgramCard.vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 类型标签
const currentTypeIndex = ref(0)
const typeTabs = ref<TypeTab[]>([
  { label: '宝库', value: 'collection' },
  { label: '购买', value: 'purchase' },
  { label: '租赁', value: 'rent' },
  { label: '合作', value: 'cooperate' }
])

// 收藏的小程序数据
const collectionData = ref<Record<string, MiniProgram[]>>({
  collection: [],
  purchase: [],
  rent: [],
  cooperate: []
})

// 当前类型
const currentType = computed(() => {
  return typeTabs.value[currentTypeIndex.value].value
})

// 当前类型的小程序列表
const currentTypePrograms = computed(() => {
  const type = currentType.value

  // 宝库标签：返回所有入库数据（购买+租赁+合作）
  if (type === 'collection') {
    const allPrograms: MiniProgram[] = []
    if (collectionData.value.purchase) {
      allPrograms.push(...collectionData.value.purchase)
    }
    if (collectionData.value.rent) {
      allPrograms.push(...collectionData.value.rent)
    }
    if (collectionData.value.cooperate) {
      allPrograms.push(...collectionData.value.cooperate)
    }
    return allPrograms
  }

  // 其他标签：返回对应类型的数据
  return collectionData.value[type] || []
})

// 按分类分组的小程序
interface CategoryGroup {
  firstLevel: string
  secondLevel: string
  programs: MiniProgram[]
}

const groupedPrograms = computed(() => {
  const groups: CategoryGroup[] = []
  const categoryMap = new Map<string, CategoryGroup>()

  currentTypePrograms.value.forEach((program: MiniProgram) => {
    const key = `${program.firstLevel}-${program.secondLevel}`

    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        firstLevel: program.firstLevel,
        secondLevel: program.secondLevel,
        programs: []
      })
    }

    categoryMap.get(key)!.programs.push(program)
  })

  // 转换为数组并按收藏时间排序
  categoryMap.forEach(group => {
    groups.push(group)
  })

  return groups.sort((a, b) => {
    const aTime = a.programs[0]?.collectedAt || ''
    const bTime = b.programs[0]?.collectedAt || ''
    return bTime.localeCompare(aTime)
  })
})

// 加载收藏数据
const loadCollection = () => {
  try {
    const saved = uni.getStorageSync('my_collection')
    if (saved) {
      collectionData.value = JSON.parse(saved)
      console.log('[我的宝库] 加载收藏数据:', collectionData.value)
      console.log('[我的宝库] 宝库数量:', collectionData.value.collection?.length || 0)
      console.log('[我的宝库] 购买数量:', collectionData.value.purchase?.length || 0)
      console.log('[我的宝库] 租赁数量:', collectionData.value.rent?.length || 0)
      console.log('[我的宝库] 合作数量:', collectionData.value.cooperate?.length || 0)
    } else {
      console.log('[我的宝库] 没有收藏数据')
    }
  } catch (e) {
    console.error('加载收藏数据失败:', e)
  }
}

// 保存收藏数据
const saveCollection = () => {
  try {
    uni.setStorageSync('my_collection', JSON.stringify(collectionData.value))
  } catch (e) {
    console.error('保存收藏数据失败:', e)
  }
}

// 类型标签切换
const handleTypeChange = (tab: TypeTab) => {
  console.log('切换类型标签:', tab)
}

// 小程序点击
const handleProgramClick = (program: MiniProgram) => {
  console.log('点击小程序:', program)

  // 跳转到详情页
  uni.navigateTo({
    url: `/pages/template/detail/index?templateId=${program.id}&templateName=${encodeURIComponent(program.name)}&templateIcon=${encodeURIComponent(program.icon || '')}&templatePrice=${program.price}&firstLevel=${encodeURIComponent(program.firstLevel)}&secondLevel=${encodeURIComponent(program.secondLevel)}&type=${getTypeLabel(program.type)}`
  })
}

// 取消收藏
const handleProgramRemove = (program: MiniProgram) => {
  console.log('取消收藏:', program)

  const currentType = typeTabs.value[currentTypeIndex.value].value

  // 从数据中移除
  if (currentType === 'collection') {
    // 宝库标签：从对应类型的数组中删除
    const programType = program.type || 'purchase'
    collectionData.value[programType] = collectionData.value[programType].filter(
      (p: MiniProgram) => p.id !== program.id
    )
  } else {
    // 其他标签：从当前类型的数组中删除
    collectionData.value[currentType] = collectionData.value[currentType].filter(
      (p: MiniProgram) => p.id !== program.id
    )
  }

  // 保存到本地存储
  saveCollection()

  uni.showToast({
    title: '已取消收藏',
    icon: 'success'
  })
}

// 获取类型标签文本
const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    collection: '宝库',
    purchase: '购买',
    rent: '租赁',
    cooperate: '合作'
  }
  return typeMap[type] || type
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到首页
const goToIndex = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载收藏数据
  loadCollection()
})
</script>

<style scoped lang="scss">
.my-collection-page {
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
    height: 88rpx;
    padding: 0 20rpx;

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
  }
}

// 标签容器
.tabs-container {
  position: fixed;
  top: calc(var(--status-bar-height) + 88rpx);
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
}

// 主内容区域
.main-content {
  padding-top: calc(var(--status-bar-height) + 88rpx + 130rpx);
  padding-bottom: 30rpx;
  min-height: 100vh;
}

// 宝库横向布局
.collection-grid {
  padding: 10rpx 16rpx 30rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.collection-grid .mini-program-card {
  width: 100%;
}

.content-wrapper {
  padding-top: 30rpx;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 32rpx;
    color: #666;
    margin-bottom: 10rpx;
    font-weight: 500;
  }

  .empty-hint {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 40rpx;
  }

  .empty-action-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 48rpx;
    padding: 20rpx 48rpx;
    font-size: 28rpx;

    &::after {
      border: none;
    }
  }
}
</style>
