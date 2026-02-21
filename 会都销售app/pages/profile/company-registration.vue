<template>
  <view class="registration-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-button" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">{{ getPageTitle }}</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 企业基本信息 -->
      <view class="form-section">
        <view class="section-title">基本信息</view>
        <enterprise-basic-info
          :entity-type="entityType"
          :entity-sub-type="entitySubType"
          v-model="basicInfo"
        />
      </view>

      <!-- 营业执照上传 -->
      <view class="form-section">
        <view class="section-title">
          <text>营业执照</text>
          <text class="required-mark">*</text>
        </view>
        <business-license-upload v-model="businessLicenses" />
      </view>

      <!-- 对公账户信息 -->
      <view class="form-section">
        <view class="section-title">
          <text>对公账户信息</text>
          <text class="optional-mark">(可选填)</text>
        </view>
        <view class="section-hint">如需开通小程序，请完善对公账户信息</view>
        <bank-account-info
          :entity-type="entityType"
          v-model="bankInfo"
        />
      </view>

      <!-- 超级联系人信息 -->
      <view class="form-section">
        <view class="section-title">
          <text>超级联系人</text>
          <text class="required-mark">*</text>
        </view>
        <contact-person-info
          :auto-name="userRealName"
          :auto-phone="userPhone"
          v-model="contactInfo"
        />
      </view>

      <!-- 资质管理 -->
      <view class="form-section">
        <view class="section-title">资质信息</view>
        <view class="section-hint" v-if="serviceType">
          根据「{{ serviceType }}」业务要求，建议添加相应资质
        </view>
        <view class="section-hint" v-else>
          如需经营特殊业务，请添加相应资质
        </view>
        <qualifications-list
          :entity-type="entityType"
          :service-type="serviceType"
          v-model="qualifications"
        />
      </view>
    </scroll-view>

    <!-- 底部提交按钮 -->
    <view class="submit-bar">
      <button class="submit-btn" @tap="handleSubmit">提交注册</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import EnterpriseBasicInfo from '@/components/profile/enterprise-basic-info.vue'
import BusinessLicenseUpload from '@/components/profile/business-license-upload.vue'
import BankAccountInfo from '@/components/profile/bank-account-info.vue'
import ContactPersonInfo from '@/components/profile/contact-person-info.vue'
import QualificationsList from '@/components/profile/qualifications-list.vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 页面参数
const entityType = ref<'企业' | '个人' | '境外'>('企业')
const entitySubType = ref('')
const serviceType = ref('') // 服务类型（如：物流服务、教育服务等）

// 用户信息（自动识别）
const userRealName = ref('') // 从全局状态或缓存获取
const userPhone = ref('') // 从全局状态或缓存获取

// 表单数据
const basicInfo = ref({
  name: '',
  legalPerson: '',
  registrationDate: '',
  address: '',
  businessScope: '',
  creditCode: ''
})

const businessLicenses = ref<string[]>([])
const bankInfo = ref({
  accountName: '',
  accountNumber: '',
  bankName: '',
  bankBranch: '',
  isLegalPersonAccount: false // 个人主体时可以选择法人账户
})

const contactInfo = ref({
  name: '',
  phone: '',
  idCard: ''
})

const qualifications = ref<Array<{
  type: string
  certificateNumber: ''
  images: string[]
}>>([])

// 计算页面标题
const getPageTitle = computed(() => {
  let title = ''
  if (entityType.value === '个人') {
    title = '个体工商户注册'
  } else if (entityType.value === '境外') {
    title = '境外主体注册'
  } else {
    title = '企业注册'
  }

  // 如果有服务类型，追加到标题
  if (serviceType.value) {
    title += ` - ${serviceType.value}`
  }

  return title
})

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 提交注册
const handleSubmit = () => {
  // 表单验证
  if (!basicInfo.value.name) {
    uni.showToast({
      title: '请输入主体名称',
      icon: 'none'
    })
    return
  }

  if (businessLicenses.value.length === 0) {
    uni.showToast({
      title: '请上传营业执照',
      icon: 'none'
    })
    return
  }

  if (!contactInfo.value.name) {
    uni.showToast({
      title: '请填写超级联系人信息',
      icon: 'none'
    })
    return
  }

  // 提交数据
  const formData = {
    entityType: entityType.value,
    entitySubType: entitySubType.value,
    basicInfo: basicInfo.value,
    businessLicenses: businessLicenses.value,
    bankInfo: bankInfo.value,
    contactInfo: contactInfo.value,
    qualifications: qualifications.value
  }

  console.log('提交注册信息:', formData)

  uni.showModal({
    title: '确认提交',
    content: '请确认填写的信息无误，提交后将进入审核流程',
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用API提交注册信息
        uni.showToast({
          title: '提交成功，等待审核',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options as any

  if (options.entityType) {
    entityType.value = options.entityType
  }
  if (options.entitySubType) {
    entitySubType.value = decodeURIComponent(options.entitySubType)
  }
  if (options.serviceType) {
    serviceType.value = decodeURIComponent(options.serviceType)
  }

  // TODO: 从全局状态或缓存获取用户实名信息
  // 这里暂时使用模拟数据
  userRealName.value = '张三'
  userPhone.value = '138****8888'

  // 自动填充超级联系人信息
  contactInfo.value.name = userRealName.value
  contactInfo.value.phone = userPhone.value
})
</script>

<style scoped lang="scss">
.registration-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
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
    padding: 0 30rpx;

    .back-button {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .nav-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .nav-placeholder {
      width: 60rpx;
    }
  }
}

// 主内容区域
.main-content {
  height: auto;
  padding-bottom: 0;
}

// 表单区块
.form-section {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
    display: flex;
    align-items: center;

    .required-mark {
      color: #ff3b30;
      margin-left: 4rpx;
    }

    .optional-mark {
      font-size: 24rpx;
      color: #999;
      font-weight: 400;
      margin-left: 8rpx;
    }
  }

  .section-hint {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 20rpx;
  }
}

// 底部提交按钮
.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
  z-index: 999;

  .submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 44rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    border: none;

    &::after {
      border: none;
    }
  }
}
</style>
