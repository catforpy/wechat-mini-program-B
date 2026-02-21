<template>
  <view class="intentions-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">意向项目</text>
        <CitySelector @city-change="handleCityChange" />
      </view>
    </view>

    <!-- 主内容区域 -->
    <view class="main-content" :style="{ top: (statusBarHeight + 52) + 'px' }">
      <!-- 标题行 -->
      <view class="title-row">
        <text class="title-text">行业</text>
        <text class="title-text">项目</text>
      </view>

      <!-- 左侧：分类滑动栏 -->
      <scroll-view
        class="sidebar"
        scroll-y
        :scroll-into-view="sidebarScrollId"
        :scroll-with-animation="true"
      >
        <view class="category-list">
          <view
            v-for="(category, index) in categories"
            :key="index"
            :id="'category-' + index"
            class="category-item"
            :class="{ active: activeCategoryIndex === index }"
            @tap="handleCategoryClick(index)"
          >
            <text class="category-name">{{ category }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 右侧：所有 app 列表 -->
      <scroll-view
        class="content-area"
        scroll-y
        @scroll="handleRightScroll"
        :scroll-into-view="rightScrollId"
        :scroll-with-animation="true"
      >
        <!-- 按分类显示所有 app -->
        <view
          v-for="(categoryApps, categoryIndex) in appsByCategory"
          :key="categoryIndex"
          :id="'section-' + categoryIndex"
          class="category-section"
        >
          <!-- 分类标题 -->
          <view class="category-header">
            <text class="category-title">{{ categories[categoryIndex] }}</text>
          </view>

          <!-- 该分类下的 app 卡片列表 -->
          <view class="app-list">
            <view
              v-for="app in categoryApps"
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
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CitySelector from '@/components/common/CitySelector.vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 当前选择的城市
const selectedCity = ref('全国')

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

// 当前高亮的分类索引（由右侧滚动位置决定）
const activeCategoryIndex = ref(0)

// 左侧滚动到的位置
const sidebarScrollId = ref('')

// 右侧滚动到的位置
const rightScrollId = ref('')

// 防抖定时器
let scrollTimer: number | null = null

// 模拟 app 数据
interface App {
  id: string
  name: string
  emoji?: string
  icon?: string
  category: string
}

const allApps = ref<App[]>([
  { id: '1', name: '智能配送项目', emoji: '🚚', icon: '', category: '物流服务' },
  { id: '2', name: '仓储管理系统', emoji: '📦', icon: '', category: '物流服务' },
  { id: '3', name: '冷链物流项目', emoji: '❄️', icon: '', category: '物流服务' },
  { id: '4', name: '在线教育平台', emoji: '📚', icon: '', category: '教育服务' },
  { id: '5', name: '职业技能培训', emoji: '🎓', icon: '', category: '教育服务' },
  { id: '6', name: '在线问诊系统', emoji: '⚕️', icon: '', category: '医疗服务' },
  { id: '7', name: '健康管理系统', emoji: '🏥', icon: '', category: '医疗服务' },
  { id: '8', name: '政务服务大厅', emoji: '🏛️', icon: '', category: '政务民生' },
  { id: '9', name: '移动支付系统', emoji: '💰', icon: '', category: '金融业' },
  { id: '10', name: '理财产品平台', emoji: '💳', icon: '', category: '金融业' },
  { id: '11', name: '网约车调度系统', emoji: '🚗', icon: '', category: '交通服务' },
  { id: '12', name: '房屋租售平台', emoji: '🏠', icon: '', category: '房地产服务' },
  { id: '13', name: '本地生活服务', emoji: '🍜', icon: '', category: '生活服务' },
  { id: '14', name: '家政服务平台', emoji: '🧹', icon: '', category: '生活服务' },
  { id: '15', name: '企业协作平台', emoji: '💻', icon: '', category: 'IT科技' },
  { id: '16', name: '办公自动化系统', emoji: '📊', icon: '', category: 'IT科技' },
  { id: '17', name: '外卖订餐平台', emoji: '🍱', icon: '', category: '餐饮服务' },
  { id: '18', name: '餐厅管理系统', emoji: '🍽️', icon: '', category: '餐饮服务' },
  { id: '19', name: '旅游线路规划', emoji: '✈️', icon: '', category: '旅游服务' },
  { id: '20', name: '酒店预订系统', emoji: '🏨', icon: '', category: '旅游服务' },
  { id: '21', name: '新闻资讯平台', emoji: '🔔', icon: '', category: '时政信息' },
  { id: '22', name: '音乐流媒体平台', emoji: '🎵', icon: '', category: '文娱' },
  { id: '23', name: '短视频平台', emoji: '🎬', icon: '', category: '文娱' },
  { id: '24', name: '效率工具集合', emoji: '🔧', icon: '', category: '工具' },
  { id: '25', name: '电商平台系统', emoji: '🛒', icon: '', category: '电商平台' },
  { id: '26', name: '社区团购项目', emoji: '🛍️', icon: '', category: '电商平台' },
  { id: '27', name: '社交电商平台', emoji: '📱', icon: '', category: '电商平台' },
  { id: '28', name: '品牌商城系统', emoji: '🏪', icon: '', category: '商家自营' },
  { id: '29', name: '企业服务平台', emoji: '💼', icon: '', category: '商业服务' },
  { id: '30', name: '公益募捐平台', emoji: '❤', icon: '', category: '公益' },
  { id: '31', name: '即时通讯系统', emoji: '💚', icon: '', category: '社交' },
  { id: '32', name: '社区交友平台', emoji: '👥', icon: '', category: '社交' },
  { id: '33', name: '车辆养护服务', emoji: '🚗', icon: '', category: '汽车服务' },
  { id: '34', name: '知识付费平台', emoji: '🧠', icon: '', category: '咨询' },
  { id: '35', name: 'AI内容生成', emoji: '✂', icon: '', category: '深度合成' },
  { id: '36', name: '测试管理平台', emoji: '🧪', icon: '', category: '内测' },
  { id: '37', name: '快递寄送系统', emoji: '📮', icon: '', category: '快递业与邮政' },
  { id: '38', name: '在线课程平台', emoji: '📚', icon: '', category: '教育' },
  { id: '39', name: '共享出行平台', emoji: '🚕', icon: '', category: '出行与交通' },
  { id: '40', name: '房产中介系统', emoji: '🏠', icon: '', category: '房地产' },
  { id: '41', name: '美食点评平台', emoji: '🍜', icon: '', category: '餐饮' },
  { id: '42', name: '自驾游服务', emoji: '🚖', icon: '', category: '汽车' },
  { id: '43', name: '便民服务中心', emoji: '📞', icon: '', category: '公共服务' },
  { id: '44', name: '海淘购物平台', emoji: '🛒', icon: '', category: '跨境电商' },
  { id: '45', name: '同城服务平台', emoji: '📍', icon: '', category: '本地服务' }
])

// 按分类分组的 app 数据
const appsByCategory = computed(() => {
  const result: App[][] = []
  categories.value.forEach(category => {
    const apps = allApps.value.filter(app => app.category === category)
    result.push(apps)
  })
  return result
})

// 点击左侧分类
const handleCategoryClick = (index: number) => {
  // 更新高亮索引
  activeCategoryIndex.value = index

  // 右侧滚动到对应分类
  rightScrollId.value = 'section-' + index

  // 确保左侧分类也在可见区域
  sidebarScrollId.value = 'category-' + index

  console.log('点击分类:', categories.value[index])
}

// 处理右侧滚动
const handleRightScroll = (e: any) => {
  // 使用节流避免频繁计算
  if (scrollTimer) {
    return
  }

  scrollTimer = setTimeout(() => {
    scrollTimer = null
    updateActiveCategory()
  }, 100)
}

// 更新高亮的分类（根据右侧滚动位置）
const updateActiveCategory = () => {
  // 获取所有分类区块的位置信息
  const query = uni.createSelectorQuery()

  // 查询所有 section 的位置
  categories.value.forEach((_, index) => {
    query.select('#section-' + index).boundingClientRect()
  })

  query.exec((res: any[]) => {
    if (!res) return

    // 找到当前滚动到的分类（第一个可见的 section）
    let newActiveIndex = 0
    for (let i = 0; i < res.length; i++) {
      const rect = res[i]
      if (rect && rect.top <= 100) { // 100px 是阈值，表示顶部可见区域
        newActiveIndex = i
      } else {
        break
      }
    }

    // 更新高亮索引
    if (activeCategoryIndex.value !== newActiveIndex) {
      activeCategoryIndex.value = newActiveIndex

      // 左侧滚动到对应分类（确保在可见区域）
      sidebarScrollId.value = 'category-' + newActiveIndex
    }
  })
}

// 点击项目卡片
const handleAppClick = (app: App) => {
  console.log('点击项目:', app.name, '分类:', app.category)
  // TODO: 跳转到项目详情页面（待设计）
  uni.showToast({
    title: `查看项目：${app.name}`,
    icon: 'none'
  })
}

// 图片加载失败
const handleImageError = (e: any) => {
  console.warn('[图标加载失败]', e)
}

// 城市改变
const handleCityChange = (city: string) => {
  console.log('城市改变:', city)
  selectedCity.value = city
  // 这里可以根据城市过滤 app 数据
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
.intentions-page {
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
}

// 主内容区域
.main-content {
  display: flex;
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 80rpx;
  box-sizing: border-box;
}

// 标题行
.title-row {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80rpx;
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;

  .title-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-child {
      width: 200rpx;
      border-right: 1rpx solid #e5e5e5;
    }

    &:last-child {
      flex: 1;
    }
  }
}

// 左侧分类滑动栏 - 独立滚动容器
.sidebar {
  width: 200rpx;
  height: 100%;
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
          color: #fff;
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

// 右侧内容区域 - 独立滚动容器
.content-area {
  flex: 1;
  height: 100%;
  background: #f5f5f5;
  padding-left: 20rpx;
  box-sizing: border-box;
}

// 分类区块
.category-section {
  margin-bottom: 20rpx;
}

// 分类标题
.category-header {
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 10;

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
