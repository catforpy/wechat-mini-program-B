<template>
  <view class="join-company-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">申请加入公司</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 公司信息 -->
      <view v-if="companyInfo" class="company-card">
        <view class="company-header">
          <text class="company-icon">{{ companyInfo.type === 'company' ? '🏢' : '🏪' }}</text>
          <view class="company-info">
            <text class="company-name">{{ companyInfo.name }}</text>
            <text class="company-meta">{{ companyInfo.type === 'company' ? '企业' : '个体工商户' }}</text>
          </view>
        </view>
      </view>

      <!-- 申请角色选择 -->
      <view class="form-section">
        <text class="section-title required">申请角色</text>
        <view class="role-selector">
          <view
            v-for="role in roles"
            :key="role.value"
            :class="['role-option', { selected: formData.role === role.value }]"
            @tap="selectRole(role.value)"
          >
            <text class="role-icon">{{ role.icon }}</text>
            <text class="role-name">{{ role.label }}</text>
            <text class="role-desc">{{ role.description }}</text>
          </view>
        </view>
      </view>

      <!-- 申请人信息 -->
      <view class="form-section">
        <text class="section-title required">申请人信息</text>

        <view class="info-item">
          <text class="info-label">真实姓名</text>
          <input
            v-model="formData.applicantName"
            class="info-input"
            type="text"
            placeholder="请输入您的真实姓名"
            @input="onFieldChange"
          />
        </view>

        <view class="info-item">
          <text class="info-label">身份证号</text>
          <input
            v-model="formData.idCard"
            class="info-input"
            type="idcard"
            placeholder="请输入您的身份证号"
            :maxlength="18"
            @input="onFieldChange"
          />
        </view>
      </view>

      <!-- 申请理由 -->
      <view class="form-section">
        <text class="section-title required">申请理由</text>
        <textarea
          v-model="formData.reason"
          class="reason-textarea"
          placeholder="请简述您申请加入该公司的理由和您的相关经验..."
          :maxlength="200"
          @input="onFieldChange"
        />
        <text class="char-count">{{ formData.reason.length }}/200</text>
      </view>

      <!-- 联系方式 -->
      <view class="form-section">
        <text class="section-title">联系方式（选填）</text>
        <view class="info-item">
          <text class="info-label">手机号</text>
          <input
            v-model="formData.phone"
            class="info-input"
            type="number"
            placeholder="请输入您的手机号"
            :maxlength="11"
            @input="onFieldChange"
          />
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="notice-section">
        <text class="notice-title">📋 申请说明</text>
        <text class="notice-item">• 提交申请后，公司的超级管理员将对您的信息进行审核</text>
        <text class="notice-item">• 审核通过后，您将以所选角色加入该公司的管理团队</text>
        <text class="notice-item">• 管理成员：可管理公司业务，查看订单和数据</text>
        <text class="notice-item">• 联系人员：作为公司的业务联系人，接收业务咨询</text>
        <text class="notice-item">• 审核过程通常需要1-3个工作日</text>
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

// 公司信息
const companyInfo = ref<any>(null)

// 角色选项
const roles = [
  { value: 'manager', label: '管理成员', icon: '👤', description: '管理业务和数据' },
  { value: 'contact', label: '联系人员', icon: '📞', description: '接收业务咨询' }
]

// 表单数据
interface JoinApplication {
  role: string              // 申请角色
  applicantName: string     // 申请人姓名
  idCard: string            // 身份证号
  reason: string            // 申请理由
  phone: string             // 手机号
}

const formData = ref<JoinApplication>({
  role: 'manager',
  applicantName: '',
  idCard: '',
  reason: '',
  phone: ''
})

// 表单是否有修改
const hasChanges = ref(false)

// 选择角色
const selectRole = (role: string) => {
  formData.value.role = role
  onFieldChange()
}

// 表单字段变化
const onFieldChange = () => {
  hasChanges.value = true
}

// 验证表单
const validateForm = (): { valid: boolean; message?: string } => {
  if (!formData.value.applicantName.trim()) {
    return { valid: false, message: '请输入真实姓名' }
  }

  if (!formData.value.idCard.trim()) {
    return { valid: false, message: '请输入身份证号' }
  }

  // 验证身份证号格式
  const idCardPattern = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
  if (!idCardPattern.test(formData.value.idCard)) {
    return { valid: false, message: '身份证号格式不正确' }
  }

  if (!formData.value.reason.trim()) {
    return { valid: false, message: '请填写申请理由' }
  }

  if (formData.value.reason.length < 10) {
    return { valid: false, message: '申请理由至少需要10个字' }
  }

  return { valid: true }
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

  const roleText = roles.find(r => r.value === formData.value.role)?.label

  uni.showModal({
    title: '确认提交',
    content: `确认申请加入「${companyInfo.value.name}」吗？\n\n申请角色：${roleText}\n申请人：${formData.value.applicantName}`,
    confirmText: '确认提交',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 保存申请到本地存储
        const applications = uni.getStorageSync('join_applications') || []

        const newApplication = {
          id: Date.now(),
          companyId: companyInfo.value?.id,
          companyName: companyInfo.value?.name,
          role: formData.value.role,
          applicantName: formData.value.applicantName,
          idCard: formData.value.idCard,
          reason: formData.value.reason,
          phone: formData.value.phone,
          status: 'pending',           // 待审核
          applyTime: new Date().toISOString()
        }

        applications.push(newApplication)
        uni.setStorageSync('join_applications', applications)

        // 同时添加到对应公司的管理团队申请中
        const teamKey = 'team_data_' + companyInfo.value?.id
        const existingTeam = uni.getStorageSync(teamKey) || {}

        if (formData.value.role === 'manager') {
          existingTeam.managerApplications = existingTeam.managerApplications || []
          existingTeam.managerApplications.push({
            id: newApplication.id,
            applicantName: formData.value.applicantName,
            role: 'manager',
            reason: formData.value.reason,
            applyTime: newApplication.applyTime
          })
        } else if (formData.value.role === 'contact') {
          existingTeam.contactApplications = existingTeam.contactApplications || []
          existingTeam.contactApplications.push({
            id: newApplication.id,
            applicantName: formData.value.applicantName,
            role: 'contact',
            reason: formData.value.reason,
            applyTime: newApplication.applyTime
          })
        }

        uni.setStorageSync(teamKey, existingTeam)

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
  console.log('申请加入公司页面参数:', options)

  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取公司信息
  if (options.companyId) {
    try {
      const submissions = uni.getStorageSync('company_submissions') || []
      const company = submissions.find((c: any) => c.id == options.companyId)
      if (company) {
        companyInfo.value = company
      }
    } catch (e) {
      console.error('加载公司信息失败:', e)
    }
  }

  // 如果有用户信息，自动填充
  try {
    const saved = uni.getStorageSync('user_info')
    if (saved) {
      const userData = JSON.parse(saved)
      formData.value.applicantName = userData.realName || ''
      formData.value.idCard = userData.idCard || ''
      formData.value.phone = userData.phone || ''
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
})
</script>

<style scoped lang="scss">
.join-company-page {
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
  padding: 20rpx 30rpx 40rpx;
}

// 公司卡片
.company-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid #667eea;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .company-header {
    display: flex;
    align-items: center;

    .company-icon {
      font-size: 56rpx;
      margin-right: 20rpx;
    }

    .company-info {
      display: flex;
      flex-direction: column;

      .company-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #667eea;
        margin-bottom: 8rpx;
      }

      .company-meta {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
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

// 角色选择器
.role-selector {
  display: flex;
  gap: 16rpx;

  .role-option {
    flex: 1;
    background: #f8f8f8;
    border: 2rpx solid #e0e0e0;
    border-radius: 16rpx;
    padding: 28rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s;

    .role-icon {
      font-size: 56rpx;
      margin-bottom: 12rpx;
    }

    .role-name {
      font-size: 26rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 6rpx;
    }

    .role-desc {
      font-size: 22rpx;
      color: #999;
    }

    &.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-color: #667eea;

      .role-name {
        color: #667eea;
      }
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

// 信息项
.info-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 28rpx;
    color: #666;
    width: 180rpx;
  }

  .info-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
}

// 理由输入
.reason-textarea {
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

// 提示信息
.notice-section {
  background: #fffbf0;
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
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
