<template>
  <view class="company-shop-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">我的公司 (版体1)</view>
        <view class="nav-action" @tap="addCompany">
          <text class="add-icon">+</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 按公司类型分组 -->
      <view v-for="(group, groupIndex) in groupedCompanies" :key="groupIndex" class="company-group">
        <!-- 类型标题 -->
        <view class="group-header">
          <text class="group-title">{{ group.typeName }}</text>
          <text class="group-count">{{ group.companies.length }}个</text>
        </view>

        <!-- 该类型下的公司列表 -->
        <view class="company-list">
          <view
            v-for="(company, companyIndex) in group.companies"
            :key="companyIndex"
            class="company-item"
            @tap="toggleCompanyExpand(groupIndex, companyIndex)"
          >
            <!-- 公司头部 -->
            <view class="company-header">
              <view class="company-info">
                <text class="company-name">{{ company.name }}</text>
                <view class="company-tags">
                  <text class="tag-type">{{ company.typeLabel }}</text>
                  <text class="tag-count">{{ company.miniPrograms.length }}/{{ company.maxPrograms }}小程序</text>
                </view>
              </view>
              <text class="expand-icon">{{ company.expanded ? '△' : '▽' }}</text>
            </view>

            <!-- 小程序列表（展开时显示） -->
            <view v-if="company.expanded" class="mini-programs-list">
              <view
                v-for="(program, programIndex) in company.miniPrograms"
                :key="programIndex"
                class="mini-program-item"
                @tap.stop="handleProgramClick(program)"
              >
                <view class="program-icon">
                  <text class="program-emoji">{{ program.emoji || '📱' }}</text>
                </view>
                <view class="program-info">
                  <text class="program-name">{{ program.name }}</text>
                  <view class="program-meta">
                    <text class="program-category">{{ program.category }}</text>
                    <text :class="['program-status', `status-${program.status}`]">{{ program.statusText }}</text>
                  </view>
                </view>
                <text class="program-arrow">›</text>
              </view>

              <!-- 添加小程序按钮 - 内联样式 -->
              <view
                v-if="company.miniPrograms.length < company.maxPrograms"
                class="add-program-btn-inline"
                @tap.stop="openAddProgramModal"
              >
                <text class="add-icon">+</text>
                <text class="add-text">添加小程序</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="groupedCompanies.length === 0" class="empty-state">
        <text class="empty-icon">🏢</text>
        <text class="empty-text">暂无公司</text>
        <text class="empty-hint">点击右上角添加您的第一个公司</text>
      </view>
    </scroll-view>

    <!-- 使用可复用的弹窗组件 -->
    <AddProgramModal
      v-model:show="showAddProgramModal"
      :authenticated-companies="authenticatedCompanies"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AddProgramModal from '@/components/company/AddProgramModal.vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 小程序接口
interface MiniProgram {
  id: string
  name: string
  emoji: string
  category: string
  status: 'approving' | 'certifying' | 'developing' | 'publishing' | 'accepting' | 'accepted' | 'updating'
  statusText: string
}

// 公司接口
interface Company {
  id: string
  name: string
  type: 'enterprise' | 'individual' | 'shop' | 'ecommerce'
  typeLabel: string
  maxPrograms: number
  miniPrograms: MiniProgram[]
  expanded: boolean
}

// 已认证企业接口
interface AuthenticatedCompany {
  id: string
  name: string
  type: string
  typeLabel: string
}

// 所有公司数据
const allCompanies = ref<Company[]>([
  {
    id: '1',
    name: '太湖学院',
    type: 'enterprise',
    typeLabel: '企业',
    maxPrograms: 50,
    expanded: true,
    miniPrograms: [
      { id: '1-1', name: '太湖直播', emoji: '📺', category: '直播服务', status: 'accepted', statusText: '验收通过' },
      { id: '1-2', name: '太湖教学', emoji: '🎓', category: '教育培训', status: 'developing', statusText: '开发中' },
      { id: '1-3', name: '太湖专项', emoji: '📚', category: '专项课程', status: 'approving', statusText: '审批中' }
    ]
  },
  {
    id: '2',
    name: '王记小吃店',
    type: 'individual',
    typeLabel: '个体工商户',
    maxPrograms: 5,
    expanded: false,
    miniPrograms: [
      { id: '2-1', name: '王记点餐', emoji: '🍜', category: '点餐平台', status: 'publishing', statusText: '上架中' },
      { id: '2-2', name: '王记外卖', emoji: '🛵', category: '外卖配送', status: 'certifying', statusText: '认证中' }
    ]
  },
  {
    id: '3',
    name: '优选商城',
    type: 'ecommerce',
    typeLabel: '电子商务',
    maxPrograms: 50,
    expanded: false,
    miniPrograms: [
      { id: '3-1', name: '优选购物', emoji: '🛒', category: '电商平台', status: 'accepted', statusText: '验收通过' },
      { id: '3-2', name: '优选团购', emoji: '🎫', category: '团购服务', status: 'updating', statusText: '更新中' },
      { id: '3-3', name: '优选社区', emoji: '🏘️', category: '社区团购', status: 'accepting', statusText: '可验收' }
    ]
  }
])

// 已认证企业列表（假数据）
const authenticatedCompanies = ref<AuthenticatedCompany[]>([
  { id: '1', name: '太湖学院', type: 'enterprise', typeLabel: '企业' },
  { id: '2', name: '科技创新有限公司', type: 'enterprise', typeLabel: '企业' },
  { id: '3', name: '王记小吃店', type: 'individual', typeLabel: '个体工商户' },
  { id: '4', name: '优选商城', type: 'ecommerce', typeLabel: '电子商务' }
])

// 弹窗状态
const showAddProgramModal = ref(false)

// 按类型分组的公司
interface CompanyGroup {
  typeName: string
  companies: Company[]
}

const groupedCompanies = computed((): CompanyGroup[] => {
  const groups: CompanyGroup[] = [
    { typeName: '企业', companies: [] },
    { typeName: '个体工商户', companies: [] },
    { typeName: '店铺类型', companies: [] },
    { typeName: '电子商务', companies: [] }
  ]

  allCompanies.value.forEach(company => {
    if (company.type === 'enterprise') {
      groups[0].companies.push(company)
    } else if (company.type === 'individual') {
      groups[1].companies.push(company)
    } else if (company.type === 'shop') {
      groups[2].companies.push(company)
    } else if (company.type === 'ecommerce') {
      groups[3].companies.push(company)
    }
  })

  // 只返回有公司的组
  return groups.filter(g => g.companies.length > 0)
})

// 切换公司展开/收起
const toggleCompanyExpand = (groupIndex: number, companyIndex: number) => {
  const company = groupedCompanies.value[groupIndex].companies[companyIndex]
  company.expanded = !company.expanded
}

// 小程序点击
const handleProgramClick = (program: MiniProgram) => {
  console.log('点击小程序:', program)
  uni.showToast({
    title: `打开${program.name}`,
    icon: 'none'
  })
}

// 添加公司
const addCompany = () => {
  uni.navigateTo({
    url: '/pages/profile/company-registration-list'
  })
}

// 打开添加小程序弹窗
const openAddProgramModal = () => {
  showAddProgramModal.value = true
}

// 弹窗确认处理
const handleModalConfirm = (useNewCompany: boolean, companyIndex: number) => {
  if (useNewCompany) {
    // 使用新注册企业
    uni.navigateTo({
      url: '/pages/profile/company-registration-list'
    })
  } else {
    // 使用已认证企业
    const company = authenticatedCompanies.value[companyIndex]
    uni.showToast({
      title: `使用"${company.name}"添加小程序`,
      icon: 'success'
    })
  }
}

// 弹窗取消处理
const handleModalCancel = () => {
  console.log('用户取消添加小程序')
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
.company-shop-page {
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
    justify-content: space-between;
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

    .nav-action {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .add-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
  padding-bottom: 30rpx;
}

// 公司分组
.company-group {
  margin-bottom: 20rpx;
}

// 分组标题
.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx 10rpx;

  .group-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #666;
  }

  .group-count {
    font-size: 24rpx;
    color: #999;
  }
}

// 公司列表
.company-list {
  padding: 0 30rpx;
}

// 公司项
.company-item {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  // 公司头部
  .company-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .company-info {
      flex: 1;

      .company-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 12rpx;
        display: block;
      }

      .company-tags {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .tag-type {
          font-size: 22rpx;
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
        }

        .tag-count {
          font-size: 22rpx;
          color: #999;
        }
      }
    }

    .expand-icon {
      font-size: 24rpx;
      color: #999;
      margin-left: 20rpx;
    }
  }

  // 小程序列表
  .mini-programs-list {
    padding: 0 20rpx 20rpx;
  }

  // 小程序项
  .mini-program-item {
    display: flex;
    align-items: center;
    padding: 20rpx 10rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .program-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 16rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      flex-shrink: 0;

      .program-emoji {
        font-size: 48rpx;
      }
    }

    .program-info {
      flex: 1;

      .program-name {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }

      .program-meta {
        display: flex;
        align-items: center;
        gap: 12rpx;
      }

      .program-category {
        font-size: 22rpx;
        color: #999;
      }

      .program-status {
        font-size: 20rpx;
        padding: 2rpx 8rpx;
        border-radius: 6rpx;
        font-weight: 500;

        // 审批中 - 橙色
        &.status-approving {
          color: #ff9800;
          background: rgba(255, 152, 0, 0.1);
        }

        // 认证中 - 蓝色
        &.status-certifying {
          color: #2196f3;
          background: rgba(33, 150, 243, 0.1);
        }

        // 开发中 - 紫色
        &.status-developing {
          color: #9c27b0;
          background: rgba(156, 39, 176, 0.1);
        }

        // 上架中 - 青色
        &.status-publishing {
          color: #00bcd4;
          background: rgba(0, 188, 212, 0.1);
        }

        // 可验收 - 棕色
        &.status-accepting {
          color: #795548;
          background: rgba(121, 85, 72, 0.1);
        }

        // 验收通过 - 绿色
        &.status-accepted {
          color: #4caf50;
          background: rgba(76, 175, 80, 0.1);
        }

        // 更新中 - 粉色
        &.status-updating {
          color: #e91e63;
          background: rgba(233, 30, 99, 0.1);
        }
      }
    }

    .program-arrow {
      font-size: 32rpx;
      color: #ccc;
      font-weight: 300;
    }

    &:active {
      background: #f5f5f5;
    }
  }

  // 内联添加小程序按钮
  .add-program-btn-inline {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx;
    margin-top: 10rpx;
    border: 2rpx dashed #ddd;
    border-radius: 12rpx;

    .add-icon {
      font-size: 32rpx;
      color: #667eea;
      margin-right: 8rpx;
    }

    .add-text {
      font-size: 26rpx;
      color: #667eea;
    }

    &:active {
      background: rgba(102, 126, 234, 0.05);
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 30rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 500;
  }

  .empty-hint {
    font-size: 24rpx;
    color: #999;
    text-align: center;
  }
}
</style>
