<template>
  <view class="index-page">
    <!-- 顶部区域容器（包含标签栏、搜索框、快速入口） -->
    <view class="top-area">
      <!-- 顶部横向标签栏（关注、推荐、一级类目） -->
      <view class="top-tabs-container" :style="{ paddingTop: statusBarHeight + 'px' }">
        <scroll-view
          scroll-x
          class="top-tabs-scroll"
          show-scrollbar="false"
          :scroll-left="scrollLeft"
          :scroll-with-animation="true"
          :enhanced="true"
          :bounces="false"
          @scroll="handleTopTabScroll"
          @touchstart.stop="handleTouchStart"
          @touchend.stop="handleTouchEnd"
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
        <view
          class="quick-entry-scroll"
          @touchstart.stop
          @touchmove.stop
          @touchend.stop
          @touchcancel.stop
        >
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
        <scroll-view
          scroll-x
          class="tabs-scroll"
          show-scrollbar={false}
          @touchstart.stop
          @touchmove.stop
          @touchend.stop
          @touchcancel.stop
        >
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
    </view>

    <!-- 页面整体内容容器 -->
    <view class="page-wrapper">
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
          <scroll-view
            scroll-y
            class="panel-scroll"
            show-scrollbar={false}
            @touchstart.stop
            @touchmove.stop
            @touchend.stop
            @touchcancel.stop
          >
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
        <scroll-view
          scroll-y
          class="content-scroll"
          show-scrollbar={false}
          @touchstart.stop
          @touchmove.stop
          @touchend.stop
          @touchcancel.stop
        >
          <view class="category-title">{{ currentSecondLevelCategories[currentSecondLevel]?.name }}</view>
          <view class="mini-program-grid">
            <view
              v-for="(program, index) in currentMiniPrograms"
              :key="index"
              class="mini-program-card"
              :data-program="JSON.stringify(program)"
              @click="handleMiniProgramClick(program)"
              @touchstart.stop="handleCardTouchStart($event, program)"
              @touchend.stop="handleCardTouchEnd($event, program)"
              @touchcancel.stop="handleCardTouchEnd($event, program)"
            >
              <view class="program-icon-wrapper">
                <image v-if="program.icon" :src="program.icon" mode="aspectFill" class="program-icon" />
                <text v-else class="program-emoji">{{ program.emoji || '📱' }}</text>
                <view v-if="program.isFollowed" class="follow-badge">⭐</view>
              </view>
              <text class="program-name">{{ program.name }}</text>
              <view class="program-price-row">
                <text class="program-price">¥{{ program.price }}</text>
                <text class="program-price-dou">{{ program.price }}0都达豆</text>
              </view>
            </view>
          </view>

          <!-- 长按弹出菜单 -->
          <view v-if="showActionMenu" class="action-menu-overlay" @tap="hideActionMenu">
            <view
              class="action-menu"
              :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
              @tap.stop
            >
              <view
                v-if="!selectedProgram?.isFollowed"
                class="menu-item"
                @tap="handleMenuAction('follow')"
              >
                <text class="menu-text">关注</text>
              </view>
              <view
                v-else
                class="menu-item"
                @tap="handleMenuAction('unfollow')"
              >
                <text class="menu-text">取消关注</text>
              </view>
              <view class="menu-item" @tap="handleMenuAction('register')">
                <text class="menu-text">我要申请注册</text>
              </view>
              <view class="menu-item" @tap="handleMenuAction('cooperate')">
                <text class="menu-text">我要申请合作</text>
              </view>
              <view class="menu-item" @tap="handleMenuAction('rent')">
                <text class="menu-text">我要申请租赁</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    </view>

    <!-- ========== 小程序容器相关代码（已注释 - 2025-02-09） ========== -->
    <!-- 详情请查看文档：docs/disabled-mini-program-container.md -->

    <!-- 下拉进度指示器（微信风格） -->
    <!--
    <view v-if="pullDownProgress > 0 && !showAppContainer" class="pull-down-indicator" :style="{
      opacity: pullDownProgress,
      transform: `translate(-50%, ${pullDownProgress * 80}px) scale(${0.8 + pullDownProgress * 0.4})`
    }">
      <view class="indicator-circle" :style="{
        borderColor: pullDownProgress >= 0.5 ? '#07c160' : 'rgba(0, 0, 0, 0.1)',
        transform: `rotate(${pullDownProgress * 360}deg)`
      }">
        <text class="indicator-icon" :style="{ color: pullDownProgress >= 0.5 ? '#07c160' : '#999' }">⟳</text>
      </view>
      <text class="indicator-text" :style="{ color: pullDownProgress >= 0.5 ? '#07c160' : '#999' }">
        {{ pullDownProgress >= 0.5 ? '释放进入小程序' : '继续下拉' }}
      </text>
    </view>
    -->

    <!-- 模糊背景层（下拉时显示） -->
    <!--
    <view v-if="pullDownProgress > 0 && !showAppContainer" class="blur-background" :style="{
      opacity: pullDownProgress * 0.5
    }"></view>
    -->

    <!-- 小程序容器弹窗（下拉触发） -->
    <!--
    <view
      :class="['app-container-modal', { show: showAppContainer }]"
      :style="{
        paddingTop: statusBarHeight + 'px',
        backgroundColor: showAppContainer ? 'rgba(0, 0, 0, 0.75)' : `rgba(0, 0, 0, ${pullDownProgress * 0.75})`,
        opacity: showAppContainer ? 1 : pullDownProgress,
        backdropFilter: showAppContainer || pullDownProgress > 0.5 ? 'blur(20rpx)' : 'none',
        WebkitBackdropFilter: showAppContainer || pullDownProgress > 0.5 ? 'blur(20rpx)' : 'none'
      }"
    >
      <view class="modal-close-layer" @tap="hideAppContainer"></view>

      <view
        class="app-container-content"
        :style="{
          transform: `translateY(-${100 * (1 - pullDownProgress * 0.6)}%)`,
          opacity: showAppContainer ? 1 : pullDownProgress,
          transition: (showAppContainer && !isClosing) || isClosing ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
        }"
      >
        <view class="app-search-bar">
          <view class="search-input-wrapper">
            <text class="search-icon">🔍</text>
            <input class="search-input" type="text" placeholder="搜索小程序" />
          </view>
        </view>

        <view class="app-section">
          <view class="section-header">
            <text class="section-title">最近使用</text>
            <view class="section-action">
              <text class="action-icon">✏️</text>
              <text class="action-text">编辑</text>
            </view>
          </view>
          <view class="app-grid">
            <view
              v-for="(app, index) in recentApps"
              :key="index"
              class="app-item"
              @click="openApp(app)"
            >
              <view class="app-icon">
                <image v-if="app.icon" :src="app.icon" mode="aspectFit" class="app-icon-image" />
                <text v-else class="app-emoji">{{ app.emoji || '📱' }}</text>
              </view>
              <text class="app-name-text">{{ app.name }}</text>
            </view>
          </view>
        </view>

        <view class="app-section discover-section">
          <view class="discover-card">
            <view class="discover-icon">🎯</view>
            <view class="discover-content">
              <text class="discover-title">发现</text>
              <text class="discover-desc">探索更多优质小程序</text>
            </view>
          </view>
        </view>

        <view class="app-section">
          <view class="section-header">
            <text class="section-title">我的小程序</text>
            <view class="section-action">
              <text class="action-text">更多</text>
              <text class="action-icon">›</text>
            </view>
          </view>
          <view class="app-grid">
            <view
              v-for="(app, index) in myApps"
              :key="index"
              class="app-item"
              @click="openApp(app)"
            >
              <view class="app-icon">
                <image v-if="app.icon" :src="app.icon" mode="aspectFit" class="app-icon-image" />
                <text v-else class="app-emoji">{{ app.emoji || '📱' }}</text>
              </view>
              <text class="app-name-text">{{ app.name }}</text>
            </view>
          </view>
        </view>

        <view class="bottom-tip">
          <text class="tip-text">{{ showAppContainer ? '点击空白处关闭' : '向下拉动以打开小程序容器' }}</text>
        </view>
      </view>
    </view>
    -->
    <!-- ========== 小程序容器相关代码结束 ========== -->
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

// 最小滚动边界（"推荐"标签位置），作为滚动限制
const minScrollLeft = ref(0)

// 标记用户是否正在触摸（用于区分用户滑动和惯性滚动）
const isUserTouching = ref(false)

// 记录边界锁定状态（防止连续触发修正）
const isBoundaryLocked = ref(false)

// ========== 小程序容器相关代码（已注释 - 2025-02-09） ==========
/*
// 小程序容器相关状态
const showAppContainer = ref(false)
const isClosing = ref(false) // 是否正在关闭
const pullDownProgress = ref(0)
const isSwipingUpToClose = ref(false) // 是否正在上滑关闭小程序容器
let swipeUpStartX = 0 // 上滑起始位置 X
let swipeUpStartY = 0 // 上滑起始位置 Y

// 最近使用的小程序
const recentApps = ref([
  { name: '会都', icon: '/static/haidu.jpg', emoji: '🏪', path: '/pages/template/retail' },
  { name: '达管', icon: '/static/daguan.png', emoji: '📊', path: '/pages/template/education' },
  { name: '都达', icon: '/static/douda.png', emoji: '🚚', path: '/pages/template/logistics' },
  { name: '金达', icon: '/static/jinda.jpg', emoji: '💰', path: '/pages/template/finance' },
  { name: '教育通', icon: '', emoji: '📚', path: '/pages/template/education' },
  { name: '医疗帮', icon: '', emoji: '🏥', path: '/pages/template/medical' },
  { name: '政务通', icon: '', emoji: '🏛️', path: '/pages/template/government' },
  { name: '餐饮易', icon: '', emoji: '🍽️', path: '/pages/template/food' }
])

// 我的小程序
const myApps = ref([
  { name: '零售通', icon: '', emoji: '🛒', path: '/pages/template/retail' },
  { name: '物流宝', icon: '', emoji: '📦', path: '/pages/template/logistics' },
  { name: '生活圈', icon: '', emoji: '🌟', path: '/pages/template/life' },
  { name: '优教', icon: '', emoji: '🎓', path: '/pages/template/education' },
  { name: '健康', icon: '', emoji: '💊', path: '/pages/template/medical' },
  { name: '美食', icon: '', emoji: '🍜', path: '/pages/template/food' }
])
*/
// ========== 小程序容器相关代码结束 ==========

// ========== 小程序容器相关代码（已注释 - 2025-02-09） ==========
/*
// 页面滚动位置跟踪
const isAtPageTop = ref(true) // 是否在页面顶部

// 下拉触摸起始位置和方向判定
let touchStartX = 0
let touchStartY = 0
let touchCurrentX = 0
let touchCurrentY = 0
let touchDirection: 'horizontal' | 'vertical' | null = null // 滑动方向锁定
const isPullingDown = ref(false)
const DIRECTION_LOCK_THRESHOLD = 10 // 方向锁定阈值（px）

// 页面级别的下拉手势处理
// 动态计算下拉阈值（屏幕高度的1/3）
const PULL_THRESHOLD = ref(100) // 初始值，会在 onMounted 中更新

// 检查触摸是否在可滚动容器内
const isTouchInScrollableArea = (e: any): boolean => {
  let target = e.target
  if (!target) return false

  // 可滚动的类名列表
  const scrollableClasses = [
    'panel-scroll',      // 二级菜单滚动
    'content-scroll',     // 三级内容滚动
    'top-tabs-scroll',    // 顶部标签滚动
    'tabs-scroll',        // 一级类目标签滚动
    'quick-entry-scroll', // 快速入口滚动
    'panel-content',      // 二级菜单内容区
    'main-content',       // 三级类目内容区
    'second-level-panel'  // 二级面板
  ]

  // 递归向上检查父元素(最多检查5层)
  let depth = 0
  while (target && depth < 5) {
    const className = target.className || ''
    // 处理各种类型的 className
    const classStr = typeof className === 'string' ? className :
                     Array.isArray(className) ? className.join(' ') :
                     String(className)

    // 检查是否包含任何可滚动类名
    for (const scrollableClass of scrollableClasses) {
      if (classStr.includes(scrollableClass)) {
        console.log('[页面下拉] 触摸在可滚动区域内:', scrollableClass)
        return true
      }
    }

    // 向上检查父元素
    target = target.parentElement
    depth++
  }

  return false
}
*/

// ========== 小程序容器相关代码（已注释 - 2025-02-09） ==========
/*
// 页面触摸开始
const handlePageTouchStart = (e: any) => {
  // 如果小程序容器已显示，准备处理上滑关闭
  if (showAppContainer.value) {
    isSwipingUpToClose.value = false
    swipeUpStartX = e.touches[0].clientX
    swipeUpStartY = e.touches[0].clientY
    touchDirection = null
    console.log('[上滑关闭] 触摸开始, X:', swipeUpStartX, 'Y:', swipeUpStartY)
    return
  }

  // 检查触摸是否在可滚动区域内
  if (isTouchInScrollableArea(e)) {
    console.log('[页面下拉] 触摸在滚动区域,忽略下拉')
    return
  }

  // 重置所有状态
  isPullingDown.value = false
  touchDirection = null

  // 记录起始位置
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  touchCurrentX = touchStartX
  touchCurrentY = touchStartY

  console.log('[页面下拉] 触摸开始, X:', touchStartX, 'Y:', touchStartY, '阈值:', PULL_THRESHOLD.value)
}

// 页面触摸移动
const handlePageTouchMove = (e: any) => {
  // 如果小程序容器已显示，处理上滑关闭手势
  if (showAppContainer.value) {
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const deltaX = Math.abs(currentX - swipeUpStartX)
    const deltaY = currentY - swipeUpStartY

    // 方向判定
    if (!touchDirection) {
      if (deltaX > DIRECTION_LOCK_THRESHOLD || Math.abs(deltaY) > DIRECTION_LOCK_THRESHOLD) {
        touchDirection = Math.abs(deltaY) > deltaX ? 'vertical' : 'horizontal'
        console.log('[上滑关闭] 方向锁定为:', touchDirection)
      }
    }

    // 如果锁定为横向滑动，不处理
    if (touchDirection === 'horizontal') {
      return
    }

    // 只处理向上滑动（deltaY < 0）
    if (deltaY < 0) {
      isSwipingUpToClose.value = true

      // 计算上滑距离（绝对值）
      const absDeltaY = Math.abs(deltaY)
      const threshold = PULL_THRESHOLD.value

      // 使用阻尼效果，让手指滑动距离和滑动距离基本匹配
      let dampenedDeltaY = absDeltaY
      if (absDeltaY > threshold * 0.4) {
        const excess = absDeltaY - threshold * 0.4
        dampenedDeltaY = threshold * 0.4 + excess * 0.3
      }

      // 计算反向进度 (从1递减到0)
      const progress = Math.max(0, Math.min(1 - dampenedDeltaY / threshold, 1))
      pullDownProgress.value = progress

      console.log('[上滑关闭] 上滑距离:', absDeltaY, '阻尼后:', dampenedDeltaY, '进度:', progress)
    }
    return
  }

  // 检查触摸是否在可滚动区域内
  if (isTouchInScrollableArea(e)) {
    return
  }

  touchCurrentX = e.touches[0].clientX
  touchCurrentY = e.touches[0].clientY

  const deltaX = Math.abs(touchCurrentX - touchStartX)
  const deltaY = touchCurrentY - touchStartY

  // 方向判定：如果没有锁定方向，先判定方向
  if (!touchDirection) {
    if (deltaX > DIRECTION_LOCK_THRESHOLD || Math.abs(deltaY) > DIRECTION_LOCK_THRESHOLD) {
      // 哪个方向移动距离大，就锁定为哪个方向
      touchDirection = deltaX > Math.abs(deltaY) ? 'horizontal' : 'vertical'
      console.log('[页面下拉] 方向锁定为:', touchDirection)
    }
  }

  // 如果锁定为横向滑动，不处理纵向下拉
  if (touchDirection === 'horizontal') {
    return
  }

  // 只在锁定为纵向滑动、在页面顶部、且向下拉动时，才处理下拉
  if (!isAtPageTop.value || deltaY <= 0) {
    return
  }

  // 使用更强的阻尼效果：手指滑动距离和下拉距离要基本匹配
  // 前40%是1:1，40%之后使用更小的阻尼系数(增加粘滞性)
  let dampenedDeltaY = deltaY
  if (deltaY > PULL_THRESHOLD.value * 0.4) {
    const excess = deltaY - PULL_THRESHOLD.value * 0.4
    dampenedDeltaY = PULL_THRESHOLD.value * 0.4 + excess * 0.3
  }

  // 实时计算下拉进度 (0-1)
  const progress = Math.max(0, Math.min(dampenedDeltaY / PULL_THRESHOLD.value, 1))
  pullDownProgress.value = progress

  // 标记为正在下拉
  isPullingDown.value = true

  console.log('[页面下拉] 拉动距离:', deltaY, '阻尼后:', dampenedDeltaY, '进度:', progress)
}

// 页面触摸结束
const handlePageTouchEnd = () => {
  // 如果小程序容器已显示
  if (showAppContainer.value) {
    console.log('[上滑关闭] 触摸结束, 进度:', pullDownProgress.value, '是否上滑:', isSwipingUpToClose.value)

    // 重置方向锁定
    touchDirection = null

    // 如果正在上滑且进度小于等于50%，关闭小程序容器
    if (isSwipingUpToClose.value && pullDownProgress.value <= 0.5) {
      console.log('[上滑关闭] 达到关闭阈值，关闭小程序容器')
      hideAppContainer()
    } else {
      // 未达到关闭阈值，恢复显示（进度回到1）
      console.log('[上滑关闭] 未达到关闭阈值，恢复显示')
      pullDownProgress.value = 1
    }

    isSwipingUpToClose.value = false
    return
  }

  console.log('[页面下拉] 触摸结束, 进度:', pullDownProgress.value, '方向:', touchDirection)

  // 重置方向锁定
  touchDirection = null

  // 重置关闭状态
  isClosing.value = false

  // 如果下拉进度超过阈值（50%），显示小程序容器
  if (pullDownProgress.value >= 0.5) {
    console.log('[页面下拉] 达到阈值，显示小程序容器')
    showAppContainer.value = true
    // 显示后保持进度为1，避免弹窗消失
    pullDownProgress.value = 1
  } else {
    // 未达到阈值，弹窗退回去（进度归零）
    console.log('[页面下拉] 未达到阈值，弹窗退回')
    pullDownProgress.value = 0
  }

  isPullingDown.value = false
}

// 主内容滚动事件处理
const handleMainContentScroll = (e: any) => {
  const scrollTop = e.detail.scrollTop
  isAtPageTop.value = scrollTop <= 0
}

// 隐藏小程序容器
const hideAppContainer = (e?: any) => {
  console.log('[小程序容器] ========== hideAppContainer 被调用 ==========')
  console.log('[小程序容器] 当前状态 showAppContainer:', showAppContainer.value)
  console.log('[小程序容器] 当前进度 pullDownProgress:', pullDownProgress.value)
  console.log('[小程序容器] 事件对象:', e)

  if (isClosing.value) return

  // 开始关闭动画
  isClosing.value = true
  pullDownProgress.value = 0
  showAppContainer.value = false

  console.log('[小程序容器] 已设置 isClosing = true')

  // 等待关闭动画完成后重置标志
  setTimeout(() => {
    isClosing.value = false
    console.log('[小程序容器] 已重置 isClosing = false')
  }, 300)
}

// 打开小程序
const openApp = (app: any) => {
  console.log('打开小程序:', app.name)
  uni.showToast({
    title: `打开${app.name}`,
    icon: 'none'
  })
  // TODO: 跳转到对应小程序
}
*/
// ========== 小程序容器相关代码结束 ==========

/**
 * 计算并滚动到指定标签
 */
const scrollTabIntoView = (index: number) => {
  console.log('>>> scrollTabIntoView 被调用，目标索引:', index, '标签名:', topTabs.value[index])

  nextTick(() => {
    setTimeout(() => {
      const query = uni.createSelectorQuery()

      // 查询所有标签元素（用于计算累积宽度）
      const tabElements = topTabs.value.map((_, i) => `#tab-${i}`)

      console.log('准备查询的标签元素:', tabElements)

      // 为每个标签添加查询
      tabElements.forEach(selector => {
        query.select(selector).boundingClientRect()
      })

      // 查询容器的位置信息
      query.select('.top-tabs-scroll').boundingClientRect()

      query.exec((res) => {
        console.log('>>> query.exec 结果返回，res 长度:', res?.length)

        if (!res || res.length < tabElements.length + 1) {
          console.log('=== 查询失败：结果数量不足 ===')
          console.log('期望数量:', tabElements.length + 1, '实际数量:', res?.length)
          return
        }

        console.log('=== 滚动到标签 ===')
        console.log('目标索引:', index, '标签名:', topTabs.value[index])

        // 获取系统信息，用于rpx到px的转换
        const systemInfo = uni.getSystemInfoSync()
        const screenWidth = systemInfo.screenWidth || 375
        const rpxToPx = screenWidth / 750 // rpx转px的比例

        // 计算目标标签之前所有标签的总宽度（包括 gap）
        let accumulatedWidth = 0
        const gapWidthRpx = 10 // CSS 中定义的 gap: 10rpx
        const gapWidthPx = gapWidthRpx * rpxToPx // 转换为px

        for (let i = 0; i < index; i++) {
          const rect = res[i] as any
          if (rect) {
            accumulatedWidth += rect.width
            // 加上 gap（除了最后一个元素）
            if (i < index - 1) {
              accumulatedWidth += gapWidthPx
            }
            console.log(`标签 ${i} (${topTabs.value[i]}) 宽度:`, rect.width, '累积:', accumulatedWidth)
          } else {
            console.log(`标签 ${i} 查询结果为空`)
          }
        }

        // 取整，避免浮点数问题
        const targetScrollLeft = Math.round(accumulatedWidth)

        console.log('需要滚动的距离:', targetScrollLeft)
        console.log('rpx转px比例:', rpxToPx, 'gap宽度(px):', gapWidthPx)
        console.log('当前 scrollLeft:', scrollLeft.value)

        // 如果是"推荐"标签（索引1），保存为最小滚动边界
        if (index === 1) {
          minScrollLeft.value = targetScrollLeft
          console.log('=== 设置最小滚动边界:', minScrollLeft.value)
        }

        // 标记为程序化滚动
        isProgrammaticScroll.value = true
        scrollLeft.value = targetScrollLeft

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
 * 处理触摸开始事件
 */
const handleTouchStart = () => {
  isUserTouching.value = true
  isBoundaryLocked.value = false
  console.log('[触摸开始] 用户开始触摸')
}

/**
 * 处理触摸结束事件
 */
const handleTouchEnd = () => {
  isUserTouching.value = false
  console.log('[触摸结束] 用户松开，开始惯性滚动')

  // 延迟检查，如果惯性滚动导致超过边界，进行修正
  setTimeout(() => {
    if (scrollLeft.value < minScrollLeft.value) {
      console.log('[触摸结束后修正] 惯性滚动超过边界，修正到:', minScrollLeft.value)
      isBoundaryLocked.value = true
      isProgrammaticScroll.value = true
      scrollLeft.value = minScrollLeft.value

      // 持续修正一段时间，确保惯性滚动被阻止
      let correctionCount = 0
      const maxCorrections = 10

      const correctScroll = () => {
        if (scrollLeft.value < minScrollLeft.value && correctionCount < maxCorrections) {
          scrollLeft.value = minScrollLeft.value
          correctionCount++
          setTimeout(correctScroll, 50)
        } else {
          // 停止修正
          isBoundaryLocked.value = false
          isProgrammaticScroll.value = false
          console.log('[修正完成] 滚动已锁定在边界')
        }
      }

      setTimeout(correctScroll, 100)
    }
  }, 100)
}

/**
 * 处理顶部标签滚动事件
 * 实现滚动边界：用户不能向右滚动超过"推荐"标签（最小边界）
 */
const handleTopTabScroll = (e: any) => {
  const currentScrollLeft = e.detail.scrollLeft

  // 如果是程序化滚动，不处理
  if (isProgrammaticScroll.value) {
    console.log('[程序化滚动] 位置:', currentScrollLeft)
    return
  }

  // 如果边界已锁定，持续修正
  if (isBoundaryLocked.value) {
    console.log('[边界锁定中] 持续修正滚动位置')
    scrollLeft.value = minScrollLeft.value
    return
  }

  // 检查是否超过最小边界（只在用户非触摸状态下触发修正）
  if (currentScrollLeft < minScrollLeft.value && !isUserTouching.value) {
    console.log(`=== 超过最小边界（惯性滚动），触发边界锁定 ===`)
    console.log(`当前滚动位置: ${currentScrollLeft}, 最小边界: ${minScrollLeft.value}`)

    // 锁定边界并修正
    isBoundaryLocked.value = true
    isProgrammaticScroll.value = true
    scrollLeft.value = minScrollLeft.value

    // 100ms后解锁程序化滚动标记，但保持边界锁定
    setTimeout(() => {
      isProgrammaticScroll.value = false
    }, 100)

    // 500ms后完全解除边界锁定
    setTimeout(() => {
      isBoundaryLocked.value = false
      console.log('[边界解锁] 允许自由滚动')
    }, 500)

    return
  }

  // 用户手动滚动，在允许范围内
  if (isUserTouching.value) {
    console.log('[用户滚动中] 位置:', currentScrollLeft, '最小边界:', minScrollLeft.value)
  } else {
    console.log('[惯性滚动] 位置:', currentScrollLeft, '最小边界:', minScrollLeft.value)
  }
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
  console.log('[首页] ========== 检查屏幕方向 ==========')

  const systemInfo = uni.getSystemInfoSync()
  const windowWidth = systemInfo.windowWidth || 0
  const windowHeight = systemInfo.windowHeight || 0
  const screenWidth = systemInfo.screenWidth || 0
  const screenHeight = systemInfo.screenHeight || 0

  const isLandscape = windowWidth > windowHeight
  console.log('[首页] 窗口尺寸 - 宽:', windowWidth, '高:', windowHeight)
  console.log('[首页] 屏幕尺寸 - 宽:', screenWidth, '高:', screenHeight)
  console.log('[首页] 当前是否横屏:', isLandscape ? '❌ 是横屏' : '✓ 是竖屏')

  if (isLandscape) {
    console.log('[首页] ⚠️⚠️⚠️ 警告:首页是横屏!')
  }

  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // ========== 小程序容器相关代码（已注释 - 2025-02-09） ==========
  /*
  // 计算下拉阈值：屏幕高度的 1/3
  PULL_THRESHOLD.value = Math.floor(screenHeight / 3)
  console.log('[页面下拉] 屏幕高度:', screenHeight, '下拉阈值:', PULL_THRESHOLD.value)
  */
  // ========== 小程序容器相关代码结束 ==========

  // 加载所有合并的类目数据
  allMergedCategories.value = getAllMergedCategories()
  console.log('所有合并的类目数量:', allMergedCategories.value.length)

  // 加载关注的小程序列表
  loadFollowedPrograms()

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
      icon: '/static/haidu.jpg',
      path: '/pages/template/retail'
    },
    {
      name: '达管',
      icon: '/static/daguan.png',
      path: '/pages/template/education'
    },
    {
      name: '都达',
      icon: '/static/douda.png',
      path: '/pages/template/food'
    },
    {
      name: '金达',
      icon: '/static/jinda.jpg',
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
      icon: '/static/haidu.jpg',
      path: '/pages/template/retail'
    },
    {
      name: '达管',
      icon: '/static/daguan.png',
      path: '/pages/template/education'
    },
    {
      name: '都达',
      icon: '/static/douda.png',
      path: '/pages/template/food'
    },
    {
      name: '金达',
      icon: '/static/jinda.jpg',
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

// 小程序卡片数据（模拟已上架的小程序）
interface MiniProgram {
  id: string
  name: string
  emoji?: string
  icon?: string
  price: string
  isFollowed: boolean
}

const currentMiniPrograms = ref<MiniProgram[]>([
  {
    id: '1',
    name: '餐饮点餐系统',
    emoji: '🍔',
    price: '599',
    isFollowed: false
  },
  {
    id: '2',
    name: '零售商城',
    emoji: '🛒',
    price: '799',
    isFollowed: false
  },
  {
    id: '3',
    name: '在线教育平台',
    emoji: '🎓',
    price: '999',
    isFollowed: false
  },
  {
    id: '4',
    name: '美业预约',
    emoji: '💅',
    price: '499',
    isFollowed: false
  },
  {
    id: '5',
    name: '酒店预订',
    emoji: '🏨',
    price: '699',
    isFollowed: false
  },
  {
    id: '6',
    name: '生鲜配送',
    emoji: '🥬',
    price: '899',
    isFollowed: false
  }
])

// 长按菜单状态
const showActionMenu = ref(false)
const menuPosition = ref({ top: 0, left: 0 })
const selectedProgram = ref<MiniProgram | null>(null)

// 卡片长按相关状态
const cardTouchTimers = ref<Map<string, any>>(new Map())

// 点击小程序卡片
const handleMiniProgramClick = (program: MiniProgram) => {
  console.log('点击小程序:', program)
  // 如果菜单正在显示，不处理点击
  if (showActionMenu.value) {
    hideActionMenu()
    return
  }
  uni.showToast({
    title: `打开${program.name}`,
    icon: 'none'
  })
  // TODO: 打开小程序或跳转到详情页
}

// 卡片触摸开始（用于检测长按）
const handleCardTouchStart = (event: any, program: MiniProgram) => {
  console.log('========== 卡片触摸开始 ==========')
  console.log('小程序:', program.name)

  // 清除该卡片之前的定时器
  const cardId = program.id
  if (cardTouchTimers.value.has(cardId)) {
    clearTimeout(cardTouchTimers.value.get(cardId))
  }

  // 800ms后触发长按
  const timer = setTimeout(() => {
    console.log('========== 触发长按 ==========')
    console.log('长按的小程序:', program.name)

    // 获取触摸位置
    const touch = event.changedTouches?.[0] || event.touches?.[0]
    if (touch) {
      const x = touch.clientX || touch.x || 0
      const y = touch.clientY || touch.y || 0

      // 获取系统信息（屏幕宽度）
      const systemInfo = uni.getSystemInfoSync()
      const screenWidth = systemInfo.screenWidth || 375
      const screenHeight = systemInfo.screenHeight || 667

      // 菜单宽度（rpx转px）
      const menuWidth = 280 // 菜单宽度 rpx
      const rpxToPx = screenWidth / 750
      const menuWidthPx = menuWidth * rpxToPx

      // 计算菜单位置，确保不超出屏幕边界
      let menuLeft = x - menuWidthPx / 2 // 默认居中

      // 左边界检测：菜单不能超出屏幕左侧
      if (menuLeft < 20) {
        menuLeft = 20
      }

      // 右边界检测：菜单不能超出屏幕右侧
      if (menuLeft + menuWidthPx > screenWidth - 20) {
        menuLeft = screenWidth - menuWidthPx - 20
      }

      // 上边界检测：菜单不能超出屏幕顶部
      const menuHeightPx = 250 // 估算菜单高度
      let menuTop = y - 100
      if (menuTop < 80) { // 留出顶部状态栏空间
        menuTop = 80
      }

      // 下边界检测：菜单不能超出屏幕底部
      if (menuTop + menuHeightPx > screenHeight - 20) {
        menuTop = screenHeight - menuHeightPx - 20
      }

      menuPosition.value = {
        top: menuTop,
        left: menuLeft
      }
      console.log('菜单位置:', menuPosition.value)
      console.log('屏幕尺寸:', screenWidth, 'x', screenHeight)
    }

    selectedProgram.value = program
    showActionMenu.value = true

    // 震动反馈
    uni.vibrateShort()
    console.log('========== 长按处理完成 ==========')
  }, 800)

  cardTouchTimers.value.set(cardId, timer)
}

// 卡片触摸结束（取消长按）
const handleCardTouchEnd = (_event: any, program: MiniProgram) => {
  console.log('卡片触摸结束:', program.name)

  // 清除该卡片的定时器
  const cardId = program.id
  if (cardTouchTimers.value.has(cardId)) {
    clearTimeout(cardTouchTimers.value.get(cardId))
    cardTouchTimers.value.delete(cardId)
  }
}

// 长按小程序卡片（保留用于直接调用）
const handleMiniProgramLongPress = (program: MiniProgram, event: any) => {
  console.log('========== 长按小程序触发 ==========')
  console.log('小程序信息:', program)
  console.log('事件对象:', event)

  // 获取触摸位置
  const touch = event.changedTouches?.[0] || event.touches?.[0] || event.detail?.touches?.[0]
  console.log('触摸位置信息:', touch)

  if (touch) {
    const x = touch.clientX || touch.x || 0
    const y = touch.clientY || touch.y || 0
    menuPosition.value = {
      top: y - 100,
      left: x - 150
    }
    console.log('菜单位置设置:', menuPosition.value)
  }

  selectedProgram.value = program
  showActionMenu.value = true
  console.log('菜单显示状态:', showActionMenu.value)

  // 震动反馈
  uni.vibrateShort()
  console.log('========== 长按处理完成 ==========')
}

// 隐藏菜单
const hideActionMenu = () => {
  showActionMenu.value = false
  selectedProgram.value = null
}

// 处理菜单操作
const handleMenuAction = (action: string) => {
  const program = selectedProgram.value
  if (!program) return

  console.log('菜单操作:', action, program)

  switch (action) {
    case 'follow':
      // 关注
      program.isFollowed = true
      uni.showToast({
        title: `已关注 ${program.name}`,
        icon: 'success'
      })
      // 保存到本地存储
      saveFollowedPrograms()
      break

    case 'unfollow':
      // 取消关注
      program.isFollowed = false
      uni.showToast({
        title: `已取消关注 ${program.name}`,
        icon: 'none'
      })
      saveFollowedPrograms()
      break

    case 'register':
      // 我要注册 - 检查企业资质
      handleRegister(program)
      break

    case 'cooperate':
      // 我要合作 - 检查合作信息
      handleCooperate(program)
      break

    case 'rent':
      // 我要租赁 - 检查租赁信息
      handleRent(program)
      break
  }

  hideActionMenu()
}

// 处理注册逻辑
const handleRegister = (program: MiniProgram) => {
  try {
    const saved = uni.getStorageSync('my_qualifications')
    if (!saved) {
      // 没有企业资质，提示用户去完善
      uni.showModal({
        title: '提示',
        content: '注册小程序需要先完善企业资质信息\n\n是否前往"我的"页面添加资质？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    const qualifications = JSON.parse(saved) as any[]
    if (qualifications.length === 0) {
      uni.showModal({
        title: '提示',
        content: '注册小程序需要先完善企业资质信息\n\n是否前往"我的"页面添加资质？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    if (qualifications.length === 1) {
      // 只有一个资质，直接使用
      const company = qualifications[0]
      uni.showModal({
        title: '确认注册',
        content: `使用"${company.name}"注册${program.name}？`,
        success: (res) => {
          if (res.confirm) {
            // TODO: 调用注册API
            uni.showToast({
              title: '注册成功',
              icon: 'success'
            })
          }
        }
      })
    } else {
      // 多个资质，弹出选择框
      const companyNames = qualifications.map(q => q.name)
      uni.showActionSheet({
        itemList: companyNames,
        success: (res) => {
          const selectedCompany = qualifications[res.tapIndex]
          uni.showModal({
            title: '确认注册',
            content: `使用"${selectedCompany.name}"注册${program.name}？`,
            success: (res2) => {
              if (res2.confirm) {
                // TODO: 调用注册API
                uni.showToast({
                  title: '注册成功',
                  icon: 'success'
                })
              }
            }
          })
        }
      })
    }
  } catch (e) {
    console.error('读取企业资质失败:', e)
    uni.showToast({
      title: '读取资质信息失败',
      icon: 'none'
    })
  }
}

// 处理合作逻辑
const handleCooperate = (program: MiniProgram) => {
  try {
    const saved = uni.getStorageSync('my_cooperations')
    if (!saved) {
      uni.showModal({
        title: '提示',
        content: '合作小程序需要先完善合作信息\n\n是否前往"我的"页面添加合作信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    const cooperations = JSON.parse(saved) as any[]
    if (cooperations.length === 0) {
      uni.showModal({
        title: '提示',
        content: '合作小程序需要先完善合作信息\n\n是否前往"我的"页面添加合作信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    // TODO: 显示合作信息列表让用户选择
    uni.showToast({
      title: '选择合作主体',
      icon: 'none'
    })
  } catch (e) {
    console.error('读取合作信息失败:', e)
  }
}

// 处理租赁逻辑
const handleRent = (program: MiniProgram) => {
  try {
    const saved = uni.getStorageSync('my_leasings')
    if (!saved) {
      uni.showModal({
        title: '提示',
        content: '租赁小程序需要先完善租赁信息\n\n是否前往"我的"页面添加租赁信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    const leasings = JSON.parse(saved) as any[]
    if (leasings.length === 0) {
      uni.showModal({
        title: '提示',
        content: '租赁小程序需要先完善租赁信息\n\n是否前往"我的"页面添加租赁信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    // TODO: 显示租赁信息列表让用户选择
    uni.showToast({
      title: '选择租赁主体',
      icon: 'none'
    })
  } catch (e) {
    console.error('读取租赁信息失败:', e)
  }
}

// 保存关注的小程序到本地存储
const saveFollowedPrograms = () => {
  const followed = currentMiniPrograms.value.filter(p => p.isFollowed)
  uni.setStorageSync('followed_programs', JSON.stringify(followed))
}

// 从本地存储加载关注的小程序
const loadFollowedPrograms = () => {
  try {
    const saved = uni.getStorageSync('followed_programs')
    if (saved) {
      const followed = JSON.parse(saved) as string[]
      currentMiniPrograms.value.forEach(program => {
        if (followed.includes(program.id)) {
          program.isFollowed = true
        }
      })
    }
  } catch (e) {
    console.error('加载关注列表失败:', e)
  }
}

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

// 页面整体包装器
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
  position: relative;
  will-change: transform;
  // 为固定定位的顶部区域留出空间（约280rpx）
  padding-top: 280rpx;
}

// 顶部区域容器（包含橙色导航栏、搜索框、快速入口）
.top-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  background-color: #f5f5f5;
}

// ========== 小程序容器相关样式（已注释 - 2025-02-09） ==========
/*
// 小程序容器弹窗
.app-container-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.75);
  transition: opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1),
              background-color 0.5s cubic-bezier(0.32, 0.72, 0, 1),
              backdrop-filter 0.5s cubic-bezier(0.32, 0.72, 0, 1);
  visibility: visible;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);

  &:not(.show) {
    pointer-events: none;
  }
}

// 透明关闭层（z-index 最高，覆盖所有区域）
.modal-close-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.app-container-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-height: 100%;
  background: transparent; // 透明背景
  padding: 0 30rpx;
  overflow-y: auto;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
  pointer-events: none; // 让整个内容区域不响应点击
}

// 可交互元素需要提升层级并启用点击
.app-item,
.app-search-bar,
.section-header,
.section-action,
.discover-card,
.bottom-tip {
  position: relative;
  z-index: 1000;
  pointer-events: auto; // 这些元素可以响应点击
}

// 顶部搜索栏
.app-search-bar {
  padding: 30rpx 0;
  position: sticky;
  top: 0;
  background: transparent;
  z-index: 10;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  height: 72rpx;
  background-color: #ffffff;
  border-radius: 36rpx;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

  .search-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
  }

  .search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
}

// 小程序区块
.app-section {
  margin-bottom: 40rpx;

  &.discover-section {
    margin-bottom: 20rpx;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding: 0 10rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff; // 白色文字
}

.section-action {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8); // 半透明白色

  .action-icon {
    margin-left: 4rpx;
  }

  .action-text {
    margin-right: 4rpx;
  }
}

// 小程序网格
.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx 20rpx;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  border-radius: 16rpx;
  transition: all 0.3s;
  background-color: rgba(255, 255, 255, 0.15); // 半透明白色背景
  backdrop-filter: blur(20rpx); // 毛玻璃效果
  border: 1rpx solid rgba(255, 255, 255, 0.1); // 添加边框让卡片更清晰

  &:active {
    background-color: rgba(255, 255, 255, 0.25);
    transform: scale(0.95);
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

  .app-name-text {
    font-size: 24rpx;
    color: #ffffff; // 白色文字
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
}

// 发现卡片
.discover-card {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);

  .discover-icon {
    width: 80rpx;
    height: 80rpx;
    font-size: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
  }

  .discover-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .discover-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 8rpx;
  }

  .discover-desc {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

// 底部提示
.bottom-tip {
  padding: 40rpx 0;
  text-align: center;

  .tip-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6); // 半透明白色
  }
}

// 下拉进度指示器（微信风格）
.pull-down-indicator {
  position: fixed;
  top: 550rpx; // 在快速入口容器和一级类目标签下方
  left: 50%;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  pointer-events: none; // 确保不会阻挡触摸事件
}

// 模糊背景层（下拉时显示）
.blur-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9997;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  pointer-events: none; // 确保不会阻挡触摸事件
  transition: opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.pull-down-indicator {
  .indicator-circle {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    margin-bottom: 20rpx;
    transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);

    .indicator-icon {
      font-size: 56rpx;
      font-weight: 300;
      transition: color 0.4s cubic-bezier(0.32, 0.72, 0, 1);
    }
  }

  .indicator-text {
    font-size: 28rpx;
    font-weight: 500;
    letter-spacing: 1rpx;
    transition: color 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  }
}
*/
// ========== 小程序容器相关样式结束 ==========

// 搜索框区域（透明背景）
.search-container {
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
  margin-bottom: 0; // 移除底部间距，因为已经在固定区域内

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

// 顶部固定区域容器（包含标签栏、搜索框、快速入口，整个区域都可以下拉触发小程序）
.top-fixed-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #f5f5f5; // 添加背景色，避免透明导致看到下方内容
}

// 顶部横向标签栏（淘宝风格，浅橙色渐变背景）
.top-tabs-container {
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

// 一级类目横向标签（参与下拉动画）
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

  // 小程序卡片网格（新样式）
  .mini-program-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    padding-bottom: 40rpx;

    .mini-program-card {
      background: #ffffff;
      border-radius: 20rpx;
      padding: 24rpx 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
      transition: all 0.3s;
      position: relative;

      &:active {
        transform: scale(0.95);
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
      }

      .program-icon-wrapper {
        width: 96rpx;
        height: 96rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin-bottom: 16rpx;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);

        .program-icon {
          width: 100%;
          height: 100%;
        }

        .program-emoji {
          font-size: 56rpx;
        }

        .follow-badge {
          position: absolute;
          top: 4rpx;
          right: 4rpx;
          font-size: 20rpx;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          width: 32rpx;
          height: 32rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
        }
      }

      .program-name {
        font-size: 26rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }

      .program-price-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4rpx;
      }

      .program-price {
        font-size: 28rpx;
        font-weight: 600;
        color: #ff5722;
        text-align: center;
      }

      .program-price-dou {
        font-size: 22rpx;
        color: #999;
        text-align: center;
      }
    }
  }

  // 长按弹出菜单
  .action-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 9999;
  }

  .action-menu {
    position: fixed;
    background: #ffffff;
    border-radius: 20rpx;
    padding: 12rpx 0;
    min-width: 280rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: menuSlideIn 0.2s ease-out;

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 28rpx 32rpx;
      transition: background 0.2s;

      &:active {
        background: #f5f5f5;
      }

      &:not(:last-child) {
        border-bottom: 1rpx solid #f0f0f0;
      }

      .menu-text {
        font-size: 30rpx;
        color: #333;
        font-weight: 500;
      }
    }
  }

  @keyframes menuSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20rpx);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
}
</style>
