<template>
  <view class="cooperation-application-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">申请合作</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 申请的小程序信息 -->
      <view class="form-section">
        <text class="section-title">申请合作的小程序</text>
        <view v-if="targetProgram" class="program-card">
          <view class="program-left">
            <image v-if="targetProgram.icon" :src="targetProgram.icon" class="program-icon" mode="aspectFill" />
            <text v-else class="program-emoji">{{ targetProgram.emoji || '📱' }}</text>
            <view class="program-info">
              <text class="program-name">{{ targetProgram.name }}</text>
              <text class="program-category">{{ targetProgram.category || '未分类' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 选择申请主体 -->
      <view class="form-section">
        <text class="section-title required">申请主体</text>

        <!-- 未实名提示 -->
        <view v-if="!isRealNameVerified" class="unverified-notice">
          <text class="notice-icon">⚠️</text>
          <view class="notice-content">
            <text class="notice-title">需要先完成实名认证</text>
            <text class="notice-desc">申请合作需要先完成实名认证，实名后可以使用个人身份或公司主体进行申请</text>
          </view>
          <view class="verify-btn" @tap="goToRealNameVerify">
            <text class="btn-text">去实名</text>
          </view>
        </view>

        <!-- 已实名，显示选择项 -->
        <view v-else class="company-selector">
          <!-- 个人实名选项 -->
          <view
            :class="['company-option', 'personal-option', { selected: formData.applicantType === 'personal' }]"
            @tap="selectPersonal"
          >
            <view class="company-left">
              <text class="company-icon">👤</text>
              <view class="company-info">
                <text class="company-name">{{ userRealName || '个人实名' }}</text>
                <text class="company-meta">个人实名认证</text>
              </view>
            </view>
            <view class="check-icon">
              <text v-if="formData.applicantType === 'personal'">✓</text>
            </view>
          </view>

          <!-- 公司主体选项 -->
          <view
            v-for="company in myCompanies"
            :key="company.id"
            :class="['company-option', { selected: formData.companyId === company.id }]"
            @tap="selectCompany(company)"
          >
            <view class="company-left">
              <text class="company-icon">{{ company.type === 'company' ? '🏢' : '🏪' }}</text>
              <view class="company-info">
                <text class="company-name">{{ company.name }}</text>
                <text class="company-meta">{{ company.type === 'company' ? '企业' : '个体工商户' }}</text>
              </view>
            </view>
            <view v-if="company.status !== 'active'" class="status-badge">
              <text class="badge-text">{{ getStatusText(company.status) }}</text>
            </view>
            <view v-else class="check-icon">
              <text v-if="formData.companyId === company.id">✓</text>
            </view>
          </view>

          <!-- 添加公司按钮 -->
          <view class="add-company-option" @tap="goToAddCompany">
            <text class="add-icon">+</text>
            <text class="add-text">添加公司主体</text>
          </view>
        </view>
      </view>

      <!-- 合作方式 -->
      <view class="form-section">
        <text class="section-title required">合作方式</text>
        <view class="cooperation-modes">
          <view
            v-for="mode in cooperationModes"
            :key="mode.value"
            :class="['mode-option', { selected: formData.cooperationMode === mode.value }]"
            @tap="selectCooperationMode(mode.value)"
          >
            <text class="mode-icon">{{ mode.icon }}</text>
            <text class="mode-name">{{ mode.label }}</text>
            <text class="mode-desc">{{ mode.description }}</text>
          </view>
        </view>
      </view>

      <!-- 申请目的 -->
      <view class="form-section">
        <text class="section-title required">申请目的</text>
        <textarea
          v-model="formData.purpose"
          class="form-textarea"
          placeholder="请详细描述您的合作目的和期望..."
          :maxlength="500"
          @input="onFieldChange"
        />
        <text class="char-count">{{ formData.purpose.length }}/500</text>
      </view>

      <!-- 期望开始时间 -->
      <view class="form-section">
        <text class="section-title">期望开始时间</text>
        <view class="date-picker" @tap="showStartDatePicker">
          <text v-if="formData.expectedStartDate" class="date-text">{{ formData.expectedStartDate }}</text>
          <text v-else class="date-placeholder">请选择期望开始时间</text>
          <text class="date-icon">📅</text>
        </view>
      </view>

      <!-- 补充说明 -->
      <view class="form-section">
        <text class="section-title">补充说明</text>
        <textarea
          v-model="formData.additionalInfo"
          class="form-textarea"
          placeholder="其他需要说明的内容（选填）"
          :maxlength="300"
          @input="onFieldChange"
        />
        <text class="char-count">{{ formData.additionalInfo.length }}/300</text>
      </view>

      <!-- 申请说明 -->
      <view class="notice-section">
        <text class="notice-title">📋 申请说明</text>
        <text class="notice-item">• 提交申请后，将先由平台审核您的资质</text>
        <text class="notice-item">• 平台审核通过后，将转发给小程序主体公司</text>
        <text class="notice-item">• 小程序主体公司审批通过后，即可开始合作</text>
        <text class="notice-item">• 整个过程预计需要3-7个工作日</text>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <view class="submit-btn" @tap="submitApplication">
          <text class="btn-text">提交申请</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 状态栏高度
const statusBarHeight = ref(0)

// 目标小程序信息
const targetProgram = ref<any>(null)

// 我的公司列表
const myCompanies = ref<any[]>([])

// 合作方式选项
const cooperationModes = [
  { value: 'strategic', label: '战略合作', icon: '🤝', description: '深度长期合作' },
  { value: 'technical', label: '技术合作', icon: '💻', description: '技术开发支持' },
  { value: 'operational', label: '运营合作', icon: '📊', description: '运营推广合作' },
  { value: 'resource', label: '资源共享', icon: '🔗', description: '资源互换合作' }
]

// 表单数据
interface CooperationApplication {
  applicantType: 'personal' | 'company'  // 申请主体类型
  companyId: string | null               // 公司ID（当applicantType为company时）
  cooperationMode: string                // 合作方式
  purpose: string                        // 申请目的
  expectedStartDate: string              // 期望开始时间
  additionalInfo: string                 // 补充说明
}

const formData = ref<CooperationApplication>({
  applicantType: 'personal',             // 默认个人实名
  companyId: null,
  cooperationMode: 'strategic',
  purpose: '',
  expectedStartDate: '',
  additionalInfo: ''
})

// 用户实名状态
const isRealNameVerified = ref(false)
const userRealName = ref('')

// 表单是否有修改
const hasChanges = ref(false)

// 选择个人实名
const selectPersonal = () => {
  formData.value.applicantType = 'personal'
  formData.value.companyId = null
  onFieldChange()
}

// 选择公司
const selectCompany = (company: any) => {
  if (company.status !== 'active') {
    uni.showToast({
      title: '该主体未通过审核，无法使用',
      icon: 'none'
    })
    return
  }
  formData.value.applicantType = 'company'
  formData.value.companyId = company.id
  onFieldChange()
}

// 选择合作方式
const selectCooperationMode = (mode: string) => {
  formData.value.cooperationMode = mode
  onFieldChange()
}

// 显示开始日期选择器
const showStartDatePicker = () => {
  const currentDate = new Date()
  const minDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // 明天

  uni.showModal({
    title: '选择日期',
    editable: true,
    placeholderText: '格式：2025-02-10',
    success: (res) => {
      if (res.confirm && res.content) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (dateRegex.test(res.content)) {
          formData.value.expectedStartDate = res.content
          onFieldChange()
        } else {
          uni.showToast({
            title: '日期格式不正确',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 表单字段变化
const onFieldChange = () => {
  hasChanges.value = true
}

// 验证表单
const validateForm = (): { valid: boolean; message?: string } => {
  // 如果是公司主体申请，必须选择公司
  if (formData.value.applicantType === 'company' && !formData.value.companyId) {
    return { valid: false, message: '请选择公司主体' }
  }

  if (!formData.value.purpose.trim()) {
    return { valid: false, message: '请填写申请目的' }
  }

  if (formData.value.purpose.length < 10) {
    return { valid: false, message: '申请目的至少需要10个字' }
  }

  return { valid: true }
}

// 获取状态文字
const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return '已审核'
    case 'pending':
      return '审核中'
    case 'draft':
      return '草稿'
    default:
      return '未知'
  }
}

// 提交申请
const submitApplication = () => {
  // 验证表单
  const validation = validateForm()
  if (!validation.valid) {
    uni.showToast({
      title: validation.message || '请完善信息',
      icon: 'none'
    })
    return
  }

  // 根据申请类型确定申请主体信息
  let applicantName = ''
  let applicantInfo: any = {}

  if (formData.value.applicantType === 'personal') {
    // 个人实名申请
    applicantName = userRealName.value || '个人实名'
    applicantInfo = {
      type: 'personal',
      name: applicantName,
      id: 'personal'
    }
  } else {
    // 公司主体申请
    const selectedCompany = myCompanies.value.find(c => c.id === formData.value.companyId)
    if (!selectedCompany) {
      uni.showToast({
        title: '请选择公司主体',
        icon: 'none'
      })
      return
    }
    applicantName = selectedCompany.name
    applicantInfo = {
      type: selectedCompany.type,
      name: selectedCompany.name,
      id: selectedCompany.id
    }
  }

  uni.showModal({
    title: '确认提交',
    content: `确认向「${targetProgram.value.name}」提交合作申请吗？\n\n申请主体：${applicantName}\n合作方式：${cooperationModes.find(m => m.value === formData.value.cooperationMode)?.label}`,
    confirmText: '确认提交',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 保存申请到本地存储
        const applications = uni.getStorageSync('cooperation_applications') || []

        const newApplication = {
          id: Date.now(),
          targetProgram: {
            id: targetProgram.value.id,
            name: targetProgram.value.name,
            icon: targetProgram.value.icon,
            emoji: targetProgram.value.emoji,
            category: targetProgram.value.category
          },
          applicantInfo: applicantInfo,
          cooperationMode: formData.value.cooperationMode,
          purpose: formData.value.purpose,
          expectedStartDate: formData.value.expectedStartDate,
          additionalInfo: formData.value.additionalInfo,
          status: 'platform_review',  // 平台审核中
          submitTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        }

        applications.push(newApplication)
        uni.setStorageSync('cooperation_applications', applications)

        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}

// 添加公司主体
// 添加公司主体
const goToAddCompany = () => {
  uni.navigateTo({
    url: '/pages/profile/add-company'
  })
}

// 去实名认证
const goToRealNameVerify = () => {
  uni.showModal({
    title: '需要实名认证',
    content: '请先完成实名认证后再申请合作',
    confirmText: '去认证',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.navigateTo({
          url: '/pages/profile/profile-settings'
        })
      }
    }
  })
}

// 返回上一页
const goBack = () => {
  if (hasChanges.value) {
    uni.showModal({
      title: '确认返回',
      content: '当前有未保存的修改，确定要返回吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.navigateBack()
        }
      }
    })
  } else {
    uni.navigateBack()
  }
}

onLoad((options: any) => {
  console.log('合作申请页面参数:', options)

  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取目标小程序信息
  if (options.program) {
    try {
      targetProgram.value = JSON.parse(decodeURIComponent(options.program))
      console.log('目标小程序:', targetProgram.value)
    } catch (e) {
      console.error('解析小程序信息失败:', e)
    }
  }

  // 加载用户实名信息
  try {
    const saved = uni.getStorageSync('user_info')
    if (saved) {
      const userData = JSON.parse(saved)
      isRealNameVerified.value = userData.isRealNameVerified || false
      userRealName.value = userData.realName || ''
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }

  // 加载我的公司列表（从"我的注册"中获取已审核通过的公司）
  try {
    // 从 my_qualifications 加载（这是 index-new.vue 中保存的资质列表）
    const qualificationsData = uni.getStorageSync('my_qualifications')

    if (qualificationsData) {
      const qualifications = JSON.parse(qualificationsData) as any[]

      // 只加载已审核通过的公司
      myCompanies.value = qualifications
        .filter((q: any) => q.status === 'active')
        .map((q: any) => ({
          id: q.id,
          name: q.name,
          type: q.type,
          status: q.status
        }))

      console.log('我的公司列表:', myCompanies.value)
    } else {
      // 如果没有数据，尝试从旧的存储加载
      const submissions = uni.getStorageSync('company_submissions') || []
      const drafts = uni.getStorageSync('company_drafts') || []

      const allCompanies = [...submissions, ...drafts]
      myCompanies.value = allCompanies
        .filter((c: any) => c.status === 'active')
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          type: c.entityType,
          status: c.status
        }))

      console.log('从旧存储加载的公司列表:', myCompanies.value)
    }
  } catch (e) {
    console.error('加载公司列表失败:', e)
  }
})
</script>

<style scoped lang="scss">
.cooperation-application-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 20rpx;

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    height: 88rpx;

    .back-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .nav-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .placeholder {
      width: 60rpx;
    }
  }
}

// 主内容区域
.main-content {
  padding: 20rpx;
  padding-bottom: 40rpx;
}

// 表单区块
.form-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
    display: block;

    &.required::before {
      content: '*';
      color: #ff5722;
      margin-right: 4rpx;
    }
  }
}

// 小程序卡片
.program-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16rpx;
  padding: 24rpx;
  border: 2rpx solid #667eea;

  .program-left {
    display: flex;
    align-items: center;
    flex: 1;

    .program-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 16rpx;
      margin-right: 20rpx;
    }

    .program-emoji {
      font-size: 64rpx;
      margin-right: 20rpx;
    }

    .program-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .program-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .program-category {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 公司选择器
.company-selector {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  .company-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f8f8;
    border: 2rpx solid #e0e0e0;
    border-radius: 16rpx;
    padding: 24rpx;
    transition: all 0.3s;

    &.personal-option {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-color: #667eea;

      .company-name {
        color: #667eea;
        font-weight: 600;
      }
    }

    .company-left {
      display: flex;
      align-items: center;
      flex: 1;

      .company-icon {
        font-size: 48rpx;
        margin-right: 16rpx;
      }

      .company-info {
        display: flex;
        flex-direction: column;

        .company-name {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 6rpx;
        }

        .company-meta {
          font-size: 24rpx;
          color: #999;
        }
      }
    }

    .status-badge {
      padding: 6rpx 12rpx;
      border-radius: 8rpx;
      background: #fff3e0;

      .badge-text {
        font-size: 22rpx;
        color: #ff9800;
      }
    }

    .check-icon {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 28rpx;
      font-weight: bold;
    }

    &.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-color: #667eea;
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

.empty-companies {
  text-align: center;
  padding: 60rpx 0;

  .empty-text {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin-bottom: 30rpx;
  }

  .add-company-btn {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50rpx;
    padding: 20rpx 40rpx;

    .btn-text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 500;
    }

    &:active {
      opacity: 0.8;
    }
  }
}

// 未实名提示
.unverified-notice {
  background: #fff3e0;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
  border-left: 4rpx solid #ff9800;

  .notice-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
  }

  .notice-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .notice-title {
      font-size: 28rpx;
      font-weight: 600;
      color: #ff9800;
      margin-bottom: 12rpx;
    }

    .notice-desc {
      font-size: 24rpx;
      color: #666;
      line-height: 1.6;
    }
  }

  .verify-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50rpx;
    padding: 16rpx 32rpx;

    .btn-text {
      font-size: 26rpx;
      color: #fff;
      font-weight: 500;
    }

    &:active {
      opacity: 0.8;
    }
  }
}

// 添加公司选项
.add-company-option {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 2rpx dashed #667eea;
  border-radius: 16rpx;
  padding: 24rpx;
  transition: all 0.3s;

  .add-icon {
    font-size: 48rpx;
    color: #667eea;
    margin-right: 12rpx;
  }

  .add-text {
    font-size: 28rpx;
    color: #667eea;
    font-weight: 500;
  }

  &:active {
    background: rgba(102, 126, 234, 0.15);
  }
}

// 合作方式选择器
.cooperation-modes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;

  .mode-option {
    background: #f8f8f8;
    border: 2rpx solid #e0e0e0;
    border-radius: 16rpx;
    padding: 24rpx 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s;

    .mode-icon {
      font-size: 56rpx;
      margin-bottom: 12rpx;
    }

    .mode-name {
      font-size: 26rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 6rpx;
    }

    .mode-desc {
      font-size: 22rpx;
      color: #999;
    }

    &.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-color: #667eea;

      .mode-name {
        color: #667eea;
        font-weight: 600;
      }
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

// 表单输入
.form-textarea {
  width: 100%;
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #333;
  min-height: 160rpx;
  box-sizing: border-box;
}

.char-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  display: block;
  margin-top: 8rpx;
}

// 日期选择器
.date-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 24rpx;

  .date-text {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }

  .date-placeholder {
    font-size: 28rpx;
    color: #999;
  }

  .date-icon {
    font-size: 36rpx;
  }

  &:active {
    background: #f0f0f0;
  }
}

// 申请说明
.notice-section {
  background: #fffbf0;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  border-left: 4rpx solid #ffc107;

  .notice-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #ff9800;
    margin-bottom: 16rpx;
    display: block;
  }

  .notice-item {
    font-size: 24rpx;
    color: #666;
    line-height: 1.8;
    display: block;
  }
}

// 提交按钮
.submit-section {
  margin-top: 20rpx;

  .submit-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50rpx;
    padding: 32rpx;
    text-align: center;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);

    .btn-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
