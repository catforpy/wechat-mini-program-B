<template>
  <view class="company-shop-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">我的公司</view>
        <view class="nav-action" @tap="addCompany">
          <text class="add-icon">+</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 - 使用版体1组件 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <CompanyListLayout1
        :companies="allCompanies"
        :authenticated-companies="authenticatedCompanies"
        @program-click="handleProgramClick"
        @add-program="handleAddProgram"
      />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CompanyListLayout1 from '@/components/company/CompanyListLayout1.vue'
import type { Company, MiniProgram, AuthenticatedCompany } from '@/components/company/CompanyListLayout1.vue'

// 状态栏高度
const statusBarHeight = ref(0)

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

// 处理小程序点击
const handleProgramClick = (program: MiniProgram) => {
  console.log('点击小程序:', program)
  uni.showToast({
    title: `打开${program.name}`,
    icon: 'none'
  })
}

// 处理添加小程序
const handleAddProgram = (
  useNewCompany: boolean,
  company: AuthenticatedCompany | null,
  targetCompany: Company
) => {
  if (useNewCompany) {
    // 使用新注册企业
    uni.navigateTo({
      url: '/pages/profile/company-registration-list'
    })
  } else {
    // 使用已认证企业
    uni.showModal({
      title: '确认添加',
      content: `为"${targetCompany.name}"使用"${company!.name}"添加小程序？`,
      success: (res) => {
        if (res.confirm) {
          uni.showToast({
            title: '添加成功',
            icon: 'success'
          })
          // TODO: 调用API添加小程序
        }
      }
    })
  }
}

// 添加公司
const addCompany = () => {
  uni.navigateTo({
    url: '/pages/profile/company-registration-list'
  })
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
</style>
