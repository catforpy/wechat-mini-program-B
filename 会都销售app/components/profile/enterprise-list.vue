<template>
  <view class="enterprise-list">
    <!-- 非个人主体企业列表 -->
    <view v-if="nonPersonalCompanies.length > 0" class="enterprise-group">
      <view class="group-header">
        <view class="group-left">
          <picker :value="selectedEntityType" :range="entityTypes" @change="onEntityTypeChange">
            <view class="entity-type-selector">
              <text class="selector-text">{{ entityTypes[selectedEntityType] }}</text>
              <text class="selector-arrow">▼</text>
            </view>
          </picker>
        </view>
        <view v-if="nonPersonalCompanies.length > 1" class="more-btn" @tap="toggleEnterpriseList('nonPersonal')">
          <text class="more-text">{{ enterpriseLists.nonPersonal.expanded ? '收起' : '更多' }}</text>
          <text class="more-icon">{{ enterpriseLists.nonPersonal.expanded ? '△' : '▽' }}</text>
        </view>
      </view>
      <view
        v-for="(company, index) in enterpriseLists.nonPersonal.expanded ? nonPersonalCompanies : nonPersonalCompanies.slice(0, 1)"
        :key="index"
        class="enterprise-item"
        @tap="handleCompanyClick(company)"
      >
        <view class="company-info">
          <text class="company-name">{{ company.name }}</text>
          <view class="company-meta">
            <text class="company-type">{{ company.type }}</text>
            <text class="company-date">{{ company.registrationDate }}</text>
          </view>
        </view>
        <view class="status-badge" :class="company.status">
          <text class="status-text">{{ getCompanyStatusText(company.status) }}</text>
        </view>
      </view>
    </view>

    <!-- 个人主体企业列表 -->
    <view v-if="personalCompanies.length > 0" class="enterprise-group">
      <view class="group-header">
        <text class="group-title">个人主体</text>
        <view v-if="personalCompanies.length > 1" class="more-btn" @tap="toggleEnterpriseList('personal')">
          <text class="more-text">{{ enterpriseLists.personal.expanded ? '收起' : '更多' }}</text>
          <text class="more-icon">{{ enterpriseLists.personal.expanded ? '△' : '▽' }}</text>
        </view>
      </view>
      <view
        v-for="(company, index) in enterpriseLists.personal.expanded ? personalCompanies : personalCompanies.slice(0, 1)"
        :key="index"
        class="enterprise-item"
        @tap="handleCompanyClick(company)"
      >
        <view class="company-info">
          <text class="company-name">{{ company.name }}</text>
          <view class="company-meta">
            <text class="company-type">{{ company.type }}</text>
            <text class="company-date">{{ company.registrationDate }}</text>
          </view>
        </view>
        <view class="status-badge" :class="company.status">
          <text class="status-text">{{ getCompanyStatusText(company.status) }}</text>
        </view>
      </view>
    </view>

    <!-- 境外主体企业列表 -->
    <view v-if="overseasCompanies.length > 0" class="enterprise-group">
      <view class="group-header">
        <text class="group-title">境外主体</text>
        <view v-if="overseasCompanies.length > 1" class="more-btn" @tap="toggleEnterpriseList('overseas')">
          <text class="more-text">{{ enterpriseLists.overseas.expanded ? '收起' : '更多' }}</text>
          <text class="more-icon">{{ enterpriseLists.overseas.expanded ? '△' : '▽' }}</text>
        </view>
      </view>
      <view
        v-for="(company, index) in enterpriseLists.overseas.expanded ? overseasCompanies : overseasCompanies.slice(0, 1)"
        :key="index"
        class="enterprise-item"
        @tap="handleCompanyClick(company)"
      >
        <view class="company-info">
          <text class="company-name">{{ company.name }}</text>
          <view class="company-meta">
            <text class="company-type">{{ company.type }}</text>
            <text class="company-date">{{ company.registrationDate }}</text>
          </view>
        </view>
        <view class="status-badge" :class="company.status">
          <text class="status-text">{{ getCompanyStatusText(company.status) }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="nonPersonalCompanies.length === 0 && personalCompanies.length === 0 && overseasCompanies.length === 0" class="empty-state">
      <text class="empty-icon">🏢</text>
      <text class="empty-text">还没有注册企业</text>
      <text class="empty-hint">点击下方注册开始注册</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 企业数据接口
export interface Company {
  name: string
  type: string
  registrationDate: string
  status: 'active' | 'pending' | 'draft'
  id: string
}

// Props
interface Props {
  nonPersonalCompanies?: Company[]
  personalCompanies?: Company[]
  overseasCompanies?: Company[]
}

const props = withDefaults(defineProps<Props>(), {
  nonPersonalCompanies: () => [],
  personalCompanies: () => [],
  overseasCompanies: () => []
})

// Emits
const emit = defineEmits<{
  companyClick: [company: Company]
}>()

// 主体类型选择
const entityTypes = ['事业单位', '国有企业', '民营企业']
const selectedEntityType = ref(0)

// 企业列表展开状态
const enterpriseLists = ref({
  nonPersonal: { expanded: false },
  personal: { expanded: false },
  overseas: { expanded: false }
})

// 切换企业主体类型
const onEntityTypeChange = (e: any) => {
  selectedEntityType.value = e.detail.value
  uni.showToast({
    title: `切换为：${entityTypes[selectedEntityType.value]}`,
    icon: 'none'
  })
}

// 切换企业列表展开/收起
const toggleEnterpriseList = (type: keyof typeof enterpriseLists.value) => {
  enterpriseLists.value[type].expanded = !enterpriseLists.value[type].expanded
}

// 点击企业 - 跳转到企业详情页
const handleCompanyClick = (company: Company) => {
  // 只有已审核的公司才能查看详情
  if (company.status !== 'active') {
    uni.showToast({
      title: '只有已审核的企业才能查看详情',
      icon: 'none'
    })
    return
  }
  emit('companyClick', company)
}

// 获取企业状态文本
const getCompanyStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return '✓ 已审核'
    case 'pending':
      return '审核中'
    case 'draft':
      return '草稿'
    default:
      return '未知'
  }
}
</script>

<style scoped lang="scss">
.enterprise-list {
  .enterprise-group {
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .group-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16rpx;

      .group-left {
        display: flex;
        align-items: center;
        gap: 16rpx;
      }

      .group-title {
        font-size: 28rpx;
        font-weight: 500;
        color: #666;
      }

      .entity-type-selector {
        display: flex;
        align-items: center;
        padding: 6rpx 16rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
        gap: 6rpx;

        .selector-text {
          font-size: 24rpx;
          color: #667eea;
        }

        .selector-arrow {
          font-size: 18rpx;
          color: #667eea;
        }
      }

      .more-btn {
        display: flex;
        align-items: center;
        gap: 4rpx;
        padding: 6rpx 12rpx;

        .more-text {
          font-size: 24rpx;
          color: #999;
        }

        .more-icon {
          font-size: 20rpx;
          color: #999;
        }

        &:active {
          opacity: 0.6;
        }
      }
    }

    .enterprise-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f8f8f8;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 12rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .company-info {
        flex: 1;

        .company-name {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
          display: block;
          margin-bottom: 8rpx;
        }

        .company-meta {
          display: flex;
          gap: 16rpx;

          .company-type {
            font-size: 22rpx;
            color: #999;
          }

          .company-date {
            font-size: 22rpx;
            color: #999;
          }
        }
      }

      .status-badge {
        padding: 6rpx 16rpx;
        border-radius: 8rpx;
        flex-shrink: 0;

        &.active {
          background: rgba(7, 193, 96, 0.1);

          .status-text {
            font-size: 22rpx;
            color: #07c160;
          }
        }

        &.pending {
          background: rgba(255, 193, 7, 0.1);

          .status-text {
            font-size: 22rpx;
            color: #ffc107;
          }
        }

        &.draft {
          background: rgba(0, 0, 0, 0.05);

          .status-text {
            font-size: 22rpx;
            color: #999;
          }
        }
      }

      &:active {
        background: #f0f0f0;
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 60rpx 30rpx;

    .empty-icon {
      display: block;
      font-size: 80rpx;
      margin-bottom: 16rpx;
    }

    .empty-text {
      display: block;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 8rpx;
    }

    .empty-hint {
      display: block;
      font-size: 22rpx;
      color: #999;
    }
  }
}
</style>
