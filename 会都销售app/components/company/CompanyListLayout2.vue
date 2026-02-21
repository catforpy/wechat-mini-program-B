<template>
  <view class="company-list-layout2">
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
          :class="{ expanded: company.expanded }"
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

    <!-- 悬浮添加小程序按钮 - 页面级别 -->
    <view class="add-program-floating-btn" @tap="openAddProgramModal">
      <text class="btn-icon">+</text>
      <text class="btn-label">添加小程序</text>
    </view>

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
import { ref, computed } from 'vue'
import AddProgramModal from './AddProgramModal.vue'

// 小程序接口
export interface MiniProgram {
  id: string
  name: string
  emoji: string
  category: string
  status: 'approving' | 'certifying' | 'developing' | 'publishing' | 'accepting' | 'accepted' | 'updating'
  statusText: string
}

// 公司接口
export interface Company {
  id: string
  name: string
  type: 'enterprise' | 'individual' | 'shop' | 'ecommerce'
  typeLabel: string
  maxPrograms: number
  miniPrograms: MiniProgram[]
  expanded: boolean
}

// 已认证企业接口
export interface AuthenticatedCompany {
  id: string
  name: string
  type: string
  typeLabel: string
}

interface Props {
  companies: Company[]
  authenticatedCompanies: AuthenticatedCompany[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'programClick': [program: MiniProgram]
  'addProgram': [useNewCompany: boolean, company: AuthenticatedCompany | null]
}>()

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

  props.companies.forEach(company => {
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
  emit('programClick', program)
}

// 打开添加小程序弹窗
const openAddProgramModal = () => {
  showAddProgramModal.value = true
}

// 弹窗确认处理
const handleModalConfirm = (useNewCompany: boolean, companyIndex: number) => {
  if (useNewCompany) {
    // 使用新注册企业
    emit('addProgram', true, null)
  } else {
    // 使用已认证企业（根据所选企业的类型来归类）
    const company = props.authenticatedCompanies[companyIndex]
    emit('addProgram', false, company)
  }
}

// 弹窗取消处理
const handleModalCancel = () => {
  console.log('用户取消添加小程序')
}
</script>

<style scoped lang="scss">
.company-list-layout2 {
  width: 100%;
  position: relative;
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

// 悬浮添加小程序按钮 - 页面级别
.add-program-floating-btn {
  position: fixed;
  bottom: 80rpx;
  right: 30rpx;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 28rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  transition: all 0.3s;

  .btn-icon {
    font-size: 36rpx;
    color: #fff;
    font-weight: bold;
    line-height: 1;
  }

  .btn-label {
    font-size: 26rpx;
    color: #fff;
    font-weight: 500;
    white-space: nowrap;
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
  }
}
</style>
