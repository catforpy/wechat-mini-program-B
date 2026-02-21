<template>
  <view class="mini-admin-page">
    <!-- 顶部导航栏 -->
    <view class="admin-nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="admin-nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-info">
          <text class="nav-title">{{ miniProgramName }}</text>
          <text class="nav-subtitle">管理后台</text>
        </view>
        <view class="nav-actions">
          <text class="action-icon" @tap="showMoreMenu">⋮</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="admin-content" scroll-y :scroll-into-view="scrollIntoView">
      <!-- 仪表盘（首页） -->
      <view v-if="activeTab === 'home'" id="tab-home" class="tab-content">
        <view class="dashboard">
          <!-- 数据概览卡片 -->
          <view class="stats-cards">
            <view class="stat-card">
              <text class="stat-icon">📊</text>
              <view class="stat-info">
                <text class="stat-value">1,234</text>
                <text class="stat-label">总访问量</text>
              </view>
            </view>
            <view class="stat-card">
              <text class="stat-icon">👥</text>
              <view class="stat-info">
                <text class="stat-value">89</text>
                <text class="stat-label">用户数</text>
              </view>
            </view>
          </view>

          <view class="stats-cards">
            <view class="stat-card">
              <text class="stat-icon">📚</text>
              <view class="stat-info">
                <text class="stat-value">56</text>
                <text class="stat-label">课程数</text>
              </view>
            </view>
            <view class="stat-card">
              <text class="stat-icon">📋</text>
              <view class="stat-info">
                <text class="stat-value">23</text>
                <text class="stat-label">订单数</text>
              </view>
            </view>
          </view>

          <!-- 快捷入口 -->
          <view class="quick-actions">
            <text class="section-title">快捷操作</text>
            <view class="action-grid">
              <view class="action-item" @tap="switchTab('courses')">
                <text class="action-icon">📚</text>
                <text class="action-label">课程管理</text>
              </view>
              <view class="action-item" @tap="switchTab('orders')">
                <text class="action-icon">📋</text>
                <text class="action-label">订单管理</text>
              </view>
              <view class="action-item" @tap="switchTab('payments')">
                <text class="action-icon">💳</text>
                <text class="action-label">支付配置</text>
              </view>
              <view class="action-item" @tap="switchTab('analytics')">
                <text class="action-icon">📊</text>
                <text class="action-label">数据统计</text>
              </view>
              <view class="action-item" @tap="switchTab('settings')">
                <text class="action-icon">⚙️</text>
                <text class="action-label">小程序设置</text>
              </view>
              <view class="action-item" @tap="goToLaunchConfig">
                <text class="action-icon">🚀</text>
                <text class="action-label">App拉起</text>
              </view>
            </view>
          </view>

          <!-- 最近订单 -->
          <view class="recent-section">
            <view class="section-header">
              <text class="section-title">最近订单</text>
              <text class="section-action" @tap="switchTab('orders')">查看全部</text>
            </view>
            <view class="recent-orders">
              <view v-for="order in recentOrders" :key="order.id" class="order-item">
                <view class="order-info">
                  <text class="order-no">订单号：{{ order.orderNo }}</text>
                  <text class="order-time">{{ order.time }}</text>
                </view>
                <view class="order-amount">¥{{ order.amount }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 课程管理 -->
      <view v-else-if="activeTab === 'courses'" id="tab-courses" class="tab-content">
        <view class="section-header">
          <text class="section-title">课程仓库</text>
          <button class="add-btn" @tap="addCourse">+ 添加课程</button>
        </view>

        <!-- 分类管理Tab -->
        <view class="category-tabs">
          <view
            v-for="category in courseCategories"
            :key="category.value"
            :class="['category-tab', { active: activeCourseCategory === category.value }]"
            @tap="switchCourseCategory(category.value)"
          >
            <text class="category-icon">{{ category.icon }}</text>
            <text class="category-label">{{ category.label }}</text>
            <text class="category-count">({{ category.count }})</text>
          </view>
        </view>

        <!-- 老师分类 -->
        <view v-if="activeCourseCategory === 'teacher'" class="category-content">
          <view class="category-header">
            <text class="category-title">老师管理</text>
            <button class="small-btn" @tap="addTeacher">+ 添加老师</button>
          </view>
          <view class="teacher-list">
            <view
              v-for="teacher in teachers"
              :key="teacher.id"
              class="teacher-item"
              @tap="viewTeacherDetail(teacher)"
            >
              <view class="teacher-avatar">
                <image v-if="teacher.avatar" :src="teacher.avatar" mode="aspectFill" />
                <text v-else class="avatar-placeholder">{{ teacher.name[0] }}</text>
              </view>
              <view class="teacher-info">
                <text class="teacher-name">{{ teacher.name }}</text>
                <text class="teacher-desc">{{ teacher.title || '讲师' }}</text>
                <text class="teacher-courses">{{ teacher.courseCount }} 门课程</text>
              </view>
              <view class="teacher-status" :class="teacher.status">
                <text class="status-text">{{ teacher.status === 'active' ? '已上架' : '已下架' }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 课程分类 -->
        <view v-else-if="activeCourseCategory === 'course'" class="category-content">
          <view class="category-header">
            <text class="category-title">课程管理</text>
            <button class="small-btn" @tap="addCourse">+ 添加课程</button>
          </view>
          <view class="course-list">
            <view
              v-for="course in courses"
              :key="course.id"
              class="course-item"
              @tap="viewCourseDetail(course)"
            >
              <view class="course-cover">
                <image v-if="course.cover" :src="course.cover" mode="aspectFill" />
                <view v-else class="cover-placeholder">
                  <text class="placeholder-icon">📚</text>
                </view>
              </view>
              <view class="course-info">
                <text class="course-title">{{ course.title }}</text>
                <text class="course-teacher">{{ course.teacher }}</text>
                <view class="course-meta">
                  <text class="meta-item">{{ course.lessonCount }} 课时</text>
                  <text class="meta-item">{{ course.duration }}</text>
                  <text class="price">¥{{ course.price }}</text>
                </view>
              </view>
              <view class="course-status" :class="course.status">
                <text class="status-text">{{ course.status === 'published' ? '已上架' : '草稿' }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 系列分类 -->
        <view v-else-if="activeCourseCategory === 'series'" class="category-content">
          <view class="category-header">
            <text class="category-title">系列管理</text>
            <button class="small-btn" @tap="addSeries">+ 创建系列</button>
          </view>
          <view class="series-list">
            <view
              v-for="series in seriesList"
              :key="series.id"
              class="series-item"
              @tap="viewSeriesDetail(series)"
            >
              <view class="series-cover">
                <image v-if="series.cover" :src="series.cover" mode="aspectFill" />
                <view v-else class="cover-placeholder">
                  <text class="placeholder-icon">📦</text>
                </view>
              </view>
              <view class="series-info">
                <text class="series-title">{{ series.title }}</text>
                <text class="series-desc">{{ series.description }}</text>
                <view class="series-meta">
                  <text class="meta-item">{{ series.courseCount }} 门课程</text>
                  <text class="meta-item">{{ series.totalDuration }}</text>
                  <text class="price">¥{{ series.price }}</text>
                </view>
              </view>
              <view class="series-status" :class="series.status">
                <text class="status-text">{{ series.status === 'published' ? '已上架' : '草稿' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 订单管理 -->
      <view v-else-if="activeTab === 'orders'" id="tab-orders" class="tab-content">
        <view class="section-header">
          <text class="section-title">订单管理</text>
        </view>
        <view class="orders-list">
          <view class="empty-hint">
            <text class="hint-icon">📋</text>
            <text class="hint-text">暂无订单</text>
          </view>
        </view>
      </view>

      <!-- 支付配置 -->
      <view v-else-if="activeTab === 'payments'" id="tab-payments" class="tab-content">
        <view class="section-header">
          <text class="section-title">支付配置</text>
        </view>
        <view class="payment-config">
          <view class="config-item">
            <text class="config-label">微信支付</text>
            <switch :checked="paymentConfig.wechat" color="#667eea" />
          </view>
          <view class="config-item">
            <text class="config-label">支付宝支付</text>
            <switch :checked="paymentConfig.alipay" color="#667eea" />
          </view>
        </view>
      </view>

      <!-- 数据统计 -->
      <view v-else-if="activeTab === 'analytics'" id="tab-analytics" class="tab-content">
        <view class="section-header">
          <text class="section-title">数据统计</text>
        </view>
        <view class="analytics-content">
          <view class="chart-placeholder">
            <text class="chart-icon">📊</text>
            <text class="chart-text">数据图表开发中</text>
          </view>
        </view>
      </view>

      <!-- 小程序设置 -->
      <view v-else-if="activeTab === 'settings'" id="tab-settings" class="tab-content">
        <view class="section-header">
          <text class="section-title">小程序设置</text>
        </view>
        <view class="settings-list">
          <view class="setting-item">
            <text class="setting-label">小程序名称</text>
            <text class="setting-value">{{ miniProgramName }}</text>
          </view>
          <view class="setting-item">
            <text class="setting-label">小程序图标</text>
            <view class="setting-icon">📱</view>
          </view>
          <view class="setting-item">
            <text class="setting-label">小程序描述</text>
            <text class="setting-value">{{ miniProgramDescription }}</text>
          </view>
          <!-- App拉起配置入口 - 直接放在设置列表中 -->
          <view class="setting-item clickable" @tap="goToLaunchConfig">
            <view class="setting-label-with-icon">
              <text class="setting-icon-inline">🚀</text>
              <text class="setting-label">App拉起配置</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
        </view>

        <!-- App拉起配置入口 -->
        <view class="settings-section">
          <text class="section-title">高级功能</text>
          <view class="settings-card" @tap="goToLaunchConfig">
            <view class="card-left">
              <text class="card-icon">🚀</text>
              <view class="card-info">
                <text class="card-title">App拉起配置</text>
                <text class="card-desc">配置Android/iOS App拉起小程序</text>
              </view>
            </view>
            <text class="card-arrow">›</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <view class="admin-tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-item', { active: activeTab === tab.value }]"
        @tap="switchTab(tab.value)"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-label">{{ tab.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 状态栏高度
const statusBarHeight = ref(0)

// 小程序信息
const miniProgramId = ref('')
const miniProgramName = ref('小程序')
const miniProgramDescription = ref('暂无描述')

// 当前激活的Tab
const activeTab = ref('home')
const scrollIntoView = ref('')

// 底部导航配置
const tabs = ref([
  { label: '首页', value: 'home', icon: '🏠' },
  { label: '课程', value: 'courses', icon: '📚' },
  { label: '订单', value: 'orders', icon: '📋' },
  { label: '支付', value: 'payments', icon: '💳' },
  { label: '数据', value: 'analytics', icon: '📊' },
  { label: '设置', value: 'settings', icon: '⚙️' }
])

// 支付配置
const paymentConfig = ref({
  wechat: true,
  alipay: false
})

// 最近订单
const recentOrders = ref([
  { id: 1, orderNo: 'ORDER20250209001', time: '今天 14:30', amount: '299.00' },
  { id: 2, orderNo: 'ORDER20250208001', time: '昨天 16:20', amount: '199.00' },
  { id: 3, orderNo: 'ORDER20250207001', time: '02-07 10:15', amount: '399.00' }
])

// 课程管理
const activeCourseCategory = ref('teacher') // teacher | course | series

// 课程分类Tab
const courseCategories = ref([
  { label: '按老师', value: 'teacher', icon: '👨‍🏫', count: 8 },
  { label: '按课程', value: 'course', icon: '📚', count: 56 },
  { label: '按系列', value: 'series', icon: '📦', count: 12 }
])

// 老师列表（Mock数据）
const teachers = ref([
  {
    id: 1,
    name: '张老师',
    title: '高级讲师',
    avatar: '',
    courseCount: 12,
    status: 'active' // active | inactive
  },
  {
    id: 2,
    name: '李老师',
    title: '特级教师',
    avatar: '',
    courseCount: 8,
    status: 'active'
  },
  {
    id: 3,
    name: '王老师',
    title: '资深讲师',
    avatar: '',
    courseCount: 15,
    status: 'inactive'
  }
])

// 课程列表（Mock数据）
const courses = ref([
  {
    id: 1,
    title: 'Python编程入门',
    teacher: '张老师',
    cover: '',
    lessonCount: 24,
    duration: '12小时',
    price: '299',
    status: 'published' // published | draft
  },
  {
    id: 2,
    title: 'JavaScript高级教程',
    teacher: '李老师',
    cover: '',
    lessonCount: 36,
    duration: '18小时',
    price: '399',
    status: 'published'
  },
  {
    id: 3,
    title: 'Vue3实战开发',
    teacher: '王老师',
    cover: '',
    lessonCount: 28,
    duration: '14小时',
    price: '349',
    status: 'draft'
  }
])

// 系列列表（Mock数据）
const seriesList = ref([
  {
    id: 1,
    title: 'Web全栈开发',
    description: '从入门到精通的完整学习路径',
    cover: '',
    courseCount: 8,
    totalDuration: '60小时',
    price: '1999',
    status: 'published'
  },
  {
    id: 2,
    title: 'Python数据分析',
    description: '数据科学与机器学习实战',
    cover: '',
    courseCount: 6,
    totalDuration: '40小时',
    price: '1599',
    status: 'draft'
  }
])

// 切换课程分类
const switchCourseCategory = (category: string) => {
  activeCourseCategory.value = category
}

// 切换Tab
const switchTab = (tab: string) => {
  activeTab.value = tab
  scrollIntoView.value = `tab-${tab}`
}

// 添加课程
const addCourse = () => {
  uni.showToast({
    title: '添加课程功能开发中',
    icon: 'none'
  })
}

// 添加老师
const addTeacher = () => {
  uni.showToast({
    title: '添加老师功能开发中',
    icon: 'none'
  })
}

// 添加系列
const addSeries = () => {
  uni.showToast({
    title: '创建系列功能开发中',
    icon: 'none'
  })
}

// 查看老师详情
const viewTeacherDetail = (teacher: any) => {
  uni.showModal({
    title: teacher.name,
    content: `职称：${teacher.title}\n课程数：${teacher.courseCount}\n状态：${teacher.status === 'active' ? '已上架' : '已下架'}`,
    showCancel: false
  })
}

// 查看课程详情
const viewCourseDetail = (course: any) => {
  uni.showModal({
    title: course.title,
    content: `讲师：${course.teacher}\n课时数：${course.lessonCount}\n时长：${course.duration}\n价格：¥${course.price}\n状态：${course.status === 'published' ? '已上架' : '草稿'}`,
    showCancel: false
  })
}

// 查看系列详情
const viewSeriesDetail = (series: any) => {
  uni.showModal({
    title: series.title,
    content: `${series.description}\n课程数：${series.courseCount}\n总时长：${series.totalDuration}\n价格：¥${series.price}\n状态：${series.status === 'published' ? '已上架' : '草稿'}`,
    showCancel: false
  })
}

// 显示更多菜单
const showMoreMenu = () => {
  uni.showActionSheet({
    itemList: ['小程序信息', '退出管理后台'],
    success: (res) => {
      if (res.tapIndex === 1) {
        goBack()
      }
    }
  })
}

// 跳转到App拉起配置
const goToLaunchConfig = () => {
  uni.navigateTo({
    url: `/pages/mini-admin/launch-config?miniProgramId=${miniProgramId.value}&name=${encodeURIComponent(miniProgramName.value)}`
  })
}

// 返回上一页
const goBack = () => {
  uni.showModal({
    title: '退出管理后台',
    content: '确定要退出小程序管理后台吗？',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    }
  })
}

onLoad((options: any) => {
  console.log('[小程序管理] 页面参数:', options)
  if (options.miniProgramId) {
    miniProgramId.value = options.miniProgramId
  }
  if (options.name) {
    miniProgramName.value = decodeURIComponent(options.name)
  }
})

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.mini-admin-page {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

// 顶部导航栏
.admin-nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1000;
  flex-shrink: 0;

  .admin-nav-content {
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
    }

    .nav-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-left: 10rpx;

      .nav-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }

      .nav-subtitle {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .nav-actions {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .action-icon {
        font-size: 40rpx;
        color: #fff;
        font-weight: 300;
      }
    }
  }
}

// 主内容区域
.admin-content {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
  padding-bottom: 120rpx;
}

// Tab内容
.tab-content {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .section-action {
      font-size: 26rpx;
      color: #667eea;
    }

    .add-btn {
      padding: 12rpx 24rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border: none;
      border-radius: 40rpx;
      font-size: 26rpx;

      &::after {
        border: none;
      }
    }
  }
}

// 仪表盘
.dashboard {
  .stats-cards {
    display: flex;
    gap: 20rpx;
    margin-bottom: 30rpx;

    .stat-card {
      flex: 1;
      background: #fff;
      border-radius: 16rpx;
      padding: 30rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

      .stat-icon {
        font-size: 64rpx;
        margin-bottom: 16rpx;
      }

      .stat-info {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 48rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }

        .stat-label {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .quick-actions {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 24rpx;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30rpx;

      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20rpx 10rpx;

        .action-icon {
          font-size: 56rpx;
          margin-bottom: 12rpx;
        }

        .action-label {
          font-size: 24rpx;
          color: #666;
          text-align: center;
        }

        &:active {
          opacity: 0.7;
        }
      }
    }
  }

  .recent-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .section-action {
        font-size: 26rpx;
        color: #667eea;
      }
    }

    .recent-orders {
      .order-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .order-info {
          display: flex;
          flex-direction: column;

          .order-no {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 8rpx;
          }

          .order-time {
            font-size: 24rpx;
            color: #999;
          }
        }

        .order-amount {
          font-size: 32rpx;
          font-weight: bold;
          color: #ff5722;
        }
      }
    }
  }
}

// 空提示
.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;

  .hint-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
  }

  .hint-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 10rpx;
  }

  .hint-action {
    font-size: 24rpx;
    color: #667eea;
  }
}

// 支付配置
.payment-config {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .config-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .config-label {
      font-size: 30rpx;
      color: #333;
    }
  }
}

// 数据统计
.analytics-content {
  .chart-placeholder {
    background: #fff;
    border-radius: 16rpx;
    padding: 80rpx 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

    .chart-icon {
      font-size: 100rpx;
      margin-bottom: 20rpx;
      opacity: 0.5;
    }

    .chart-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

// 设置列表
.settings-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 30rpx;

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &.clickable {
      &:active {
        background: #f5f5f5;
      }
    }

    .setting-label-with-icon {
      display: flex;
      align-items: center;
      flex: 1;

      .setting-icon-inline {
        font-size: 32rpx;
        margin-right: 12rpx;
      }
    }

    .setting-label {
      font-size: 30rpx;
      color: #333;
    }

    .setting-value {
      font-size: 28rpx;
      color: #666;
    }

    .setting-icon {
      font-size: 48rpx;
    }

    .setting-arrow {
      font-size: 40rpx;
      color: #ccc;
    }
  }
}

// 高级功能区域
.settings-section {
  margin-bottom: 30rpx;

  .section-title {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 16rpx;
    padding: 0 10rpx;
  }

  .settings-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

    .card-left {
      display: flex;
      align-items: center;
      flex: 1;

      .card-icon {
        font-size: 48rpx;
        margin-right: 20rpx;
      }

      .card-info {
        display: flex;
        flex-direction: column;

        .card-title {
          font-size: 30rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 8rpx;
        }

        .card-desc {
          font-size: 24rpx;
          color: #999;
        }
      }
    }

    .card-arrow {
      font-size: 40rpx;
      color: #ccc;
    }

    &:active {
      opacity: 0.7;
    }
  }
}

// 课程管理
.category-tabs {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;

  .category-tab {
    flex: 1;
    background: #fff;
    border-radius: 12rpx;
    padding: 20rpx 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
    transition: all 0.3s;

    .category-icon {
      font-size: 40rpx;
      margin-bottom: 8rpx;
    }

    .category-label {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 4rpx;
    }

    .category-count {
      font-size: 22rpx;
      color: #999;
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      .category-icon,
      .category-label,
      .category-count {
        color: #fff;
      }
    }

    &:active {
      opacity: 0.8;
    }
  }
}

.category-content {
  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .category-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }

    .small-btn {
      padding: 10rpx 20rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border: none;
      border-radius: 32rpx;
      font-size: 24rpx;

      &::after {
        border: none;
      }
    }
  }
}

// 老师列表
.teacher-list {
  .teacher-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);

    .teacher-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 20rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 100%;
        height: 100%;
      }

      .avatar-placeholder {
        font-size: 40rpx;
        color: #fff;
        font-weight: 600;
      }
    }

    .teacher-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .teacher-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .teacher-desc {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 6rpx;
      }

      .teacher-courses {
        font-size: 22rpx;
        color: #999;
      }
    }

    .teacher-status {
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;

      &.active {
        background: #e8f5e9;
        .status-text {
          color: #07c160;
        }
      }

      &.inactive {
        background: #f5f5f5;
        .status-text {
          color: #999;
        }
      }
    }

    &:active {
      opacity: 0.8;
    }
  }
}

// 课程列表
.course-list {
  .course-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);

    .course-cover {
      width: 160rpx;
      height: 120rpx;
      border-radius: 12rpx;
      overflow: hidden;
      margin-right: 20rpx;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      image {
        width: 100%;
        height: 100%;
      }

      .cover-placeholder {
        .placeholder-icon {
          font-size: 56rpx;
        }
      }
    }

    .course-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .course-title {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .course-teacher {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 10rpx;
      }

      .course-meta {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .meta-item {
          font-size: 22rpx;
          color: #999;
        }

        .price {
          font-size: 28rpx;
          font-weight: 600;
          color: #ff5722;
          margin-left: auto;
        }
      }
    }

    .course-status {
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      flex-shrink: 0;

      &.published {
        background: #e8f5e9;
        .status-text {
          color: #07c160;
        }
      }

      &.draft {
        background: #fff3e0;
        .status-text {
          color: #ff9800;
        }
      }
    }

    &:active {
      opacity: 0.8;
    }
  }
}

// 系列列表
.series-list {
  .series-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);

    .series-cover {
      width: 160rpx;
      height: 120rpx;
      border-radius: 12rpx;
      overflow: hidden;
      margin-right: 20rpx;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      image {
        width: 100%;
        height: 100%;
      }

      .cover-placeholder {
        .placeholder-icon {
          font-size: 56rpx;
        }
      }
    }

    .series-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .series-title {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .series-desc {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 10rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .series-meta {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .meta-item {
          font-size: 22rpx;
          color: #999;
        }

        .price {
          font-size: 28rpx;
          font-weight: 600;
          color: #ff5722;
          margin-left: auto;
        }
      }
    }

    .series-status {
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      flex-shrink: 0;

      &.published {
        background: #e8f5e9;
        .status-text {
          color: #07c160;
        }
      }

      &.draft {
        background: #fff3e0;
        .status-text {
          color: #ff9800;
        }
      }
    }

    &:active {
      opacity: 0.8;
    }
  }
}

// 底部导航栏
.admin-tab-bar {
  background: #fff;
  border-top: 1rpx solid #e5e5e5;
  padding: 16rpx 0 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  display: flex;
  justify-content: space-around;
  flex-shrink: 0;
  box-shadow: 0 -4rpx 10rpx rgba(0, 0, 0, 0.05);

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;

    .tab-icon {
      font-size: 44rpx;
      margin-bottom: 6rpx;
    }

    .tab-label {
      font-size: 22rpx;
      color: #666;
    }

    &.active {
      .tab-icon {
        transform: scale(1.1);
      }

      .tab-label {
        color: #667eea;
        font-weight: 500;
      }
    }
  }
}
</style>
