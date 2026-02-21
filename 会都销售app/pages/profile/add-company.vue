<template>
  <view class="add-company-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">{{ isEditMode ? '编辑公司' : '添加公司' }}</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 模板信息提示 -->
    <view v-if="pageParams.templateName" class="template-info-bar">
      <text class="info-text">正在为模板「{{ pageParams.templateName }}」注册企业</text>
      <text v-if="pageParams.firstLevel || pageParams.secondLevel" class="category-text">
        类目：{{ pageParams.firstLevel }} > {{ pageParams.secondLevel }}
      </text>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 主体类型选择 -->
      <view class="form-section">
        <text class="section-title">主体类型</text>
        <view class="entity-type-selector">
          <view
            :class="['entity-type-option', { selected: formData.entityType === 'company' }]"
            @tap="selectEntityType('company')"
          >
            <text class="type-icon">🏢</text>
            <text class="type-name">企业</text>
          </view>
          <view
            :class="['entity-type-option', { selected: formData.entityType === 'individual' }]"
            @tap="selectEntityType('individual')"
          >
            <text class="type-icon">🏪</text>
            <text class="type-name">个体工商户</text>
          </view>
          <view
            :class="['entity-type-option', { selected: formData.entityType === 'overseas' }]"
            @tap="selectEntityType('overseas')"
          >
            <text class="type-icon">🌍</text>
            <text class="type-name">境外主体</text>
          </view>
        </view>
      </view>

      <!-- 基本信息 -->
      <view class="form-section">
        <text class="section-title">基本信息</text>

        <!-- 企业/个体名称 -->
        <view class="form-item">
          <text class="form-label required">{{
            formData.entityType === 'company' ? '企业名称' :
            formData.entityType === 'individual' ? '个体工商户名称' :
            '主体名称'
          }}</text>
          <input
            v-model="formData.name"
            class="form-input"
            :placeholder="formData.entityType === 'company' ? '请输入企业营业执照上的名称' : formData.entityType === 'individual' ? '请输入个体工商户名称' : '请输入主体名称'"
            @input="onFieldChange"
          />
        </view>

        <!-- 统一社会信用代码 -->
        <view class="form-item">
          <text class="form-label required">统一社会信用代码</text>
          <input
            v-model="formData.unifiedSocialCreditCode"
            class="form-input"
            placeholder="请输入统一社会信用代码"
            maxlength="18"
            @input="onFieldChange"
          />
        </view>

        <!-- 法定代表人/经营者 -->
        <view class="form-item">
          <text class="form-label required">{{
            formData.entityType === 'company' ? '法定代表人' :
            formData.entityType === 'individual' ? '经营者' :
            '负责人'
          }}</text>
          <input
            v-model="formData.legalPerson"
            class="form-input"
            :placeholder="formData.entityType === 'company' ? '请输入法定代表人姓名' : formData.entityType === 'individual' ? '请输入经营者姓名' : '请输入负责人姓名'"
            @input="onFieldChange"
          />
        </view>

        <!-- 注册地址 -->
        <view class="form-item">
          <text class="form-label required">注册地址</text>
          <input
            v-model="formData.address"
            class="form-input"
            placeholder="请输入详细地址"
            @input="onFieldChange"
          />
        </view>

        <!-- 经营范围 -->
        <view class="form-item">
          <text class="form-label">经营范围</text>
          <textarea
            v-model="formData.businessScope"
            class="form-textarea"
            placeholder="请输入经营范围（选填）"
            :maxlength="500"
            @input="onFieldChange"
          />
        </view>
      </view>

      <!-- 营业执照上传 -->
      <view class="form-section">
        <text class="section-title">营业执照</text>
        <view class="upload-section">
          <view v-if="formData.businessLicense" class="uploaded-image">
            <image class="license-image" :src="formData.businessLicense" mode="aspectFit" />
            <view class="delete-btn" @tap="deleteBusinessLicense">
              <text class="delete-icon">×</text>
            </view>
          </view>
          <view v-else class="upload-btn" @tap="uploadBusinessLicense">
            <text class="upload-icon">📷</text>
            <text class="upload-text">上传营业执照</text>
            <text class="upload-hint">支持jpg、png格式，大小不超过5MB</text>
          </view>
        </view>
      </view>

      <!-- 对公账户信息 -->
      <view class="form-section">
        <text class="section-title">对公账户</text>

        <!-- 开户银行 -->
        <view class="form-item">
          <text class="form-label">开户银行</text>
          <input
            v-model="formData.bankName"
            class="form-input"
            placeholder="请输入开户银行名称"
            @input="onFieldChange"
          />
        </view>

        <!-- 银行账号 -->
        <view class="form-item">
          <text class="form-label">银行账号</text>
          <input
            v-model="formData.bankAccount"
            class="form-input"
            placeholder="请输入银行账号"
            type="digit"
            @input="onFieldChange"
          />
        </view>

        <!-- 开户行名称 -->
        <view class="form-item">
          <text class="form-label">开户行名称</text>
          <input
            v-model="formData.bankBranch"
            class="form-input"
            placeholder="请输入开户行具体名称（如：XX银行XX分行XX支行）"
            @input="onFieldChange"
          />
        </view>
      </view>

      <!-- 资质证书 -->
      <view class="form-section">
        <text class="section-title">资质证书</text>
        <view v-if="formData.qualifications.length === 0" class="empty-qualifications">
          <text class="empty-text">暂无资质证书</text>
          <view class="add-qualification-btn" @tap="addQualification">
            <text class="btn-text">+ 添加资质</text>
          </view>
        </view>
        <view v-else class="qualifications-list">
          <view
            v-for="(qual, index) in formData.qualifications"
            :key="index"
            class="qualification-item"
          >
            <view class="qualification-info">
              <text class="qual-name">{{ qual.name }}</text>
              <text class="qual-number">编号：{{ qual.number }}</text>
            </view>
            <view class="qualification-actions">
              <view class="action-btn delete" @tap="deleteQualification(index)">
                <text class="action-text">删除</text>
              </view>
            </view>
          </view>
          <view class="add-qualification-btn" @tap="addQualification">
            <text class="btn-text">+ 添加资质</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="save-draft-btn" @tap="saveDraft">
          <text class="btn-text">保存草稿</text>
        </view>
        <view class="submit-btn" @tap="submitForReview">
          <text class="btn-text">提交审核</text>
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

// URL参数
const pageParams = ref<{
  templateId?: string
  templateName?: string
  entityType?: string
  firstLevel?: string
  secondLevel?: string
}>({})

// 是否为编辑模式
const isEditMode = ref(false)

// 表单数据
interface Qualification {
  name: string
  number: string
  image?: string
}

interface CompanyFormData {
  entityType: 'company' | 'individual' | 'overseas'  // 主体类型
  name: string                           // 企业/个体名称
  unifiedSocialCreditCode: string        // 统一社会信用代码
  legalPerson: string                    // 法定代表人/经营者
  address: string                        // 注册地址
  businessScope: string                  // 经营范围
  businessLicense: string                // 营业执照图片
  bankName: string                       // 开户银行
  bankAccount: string                    // 银行账号
  bankBranch: string                     // 开户行名称
  qualifications: Qualification[]        // 资质证书列表
}

const formData = ref<CompanyFormData>({
  entityType: 'company',
  name: '',
  unifiedSocialCreditCode: '',
  legalPerson: '',
  address: '',
  businessScope: '',
  businessLicense: '',
  bankName: '',
  bankAccount: '',
  bankBranch: '',
  qualifications: []
})

// 表单是否有修改
const hasChanges = ref(false)

// 选择主体类型
const selectEntityType = (type: 'company' | 'individual' | 'overseas') => {
  formData.value.entityType = type
  onFieldChange()
}

// 表单字段变化
const onFieldChange = () => {
  hasChanges.value = true
}

// 上传营业执照
const uploadBusinessLicense = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]

      // TODO: 实际项目中应该上传到服务器
      // 这里先使用本地路径
      formData.value.businessLicense = tempFilePath
      onFieldChange()

      uni.showToast({
        title: '上传成功',
        icon: 'success'
      })
    },
    fail: () => {
      uni.showToast({
        title: '上传失败',
        icon: 'none'
      })
    }
  })
}

// 删除营业执照
const deleteBusinessLicense = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除已上传的营业执照吗？',
    success: (res) => {
      if (res.confirm) {
        formData.value.businessLicense = ''
        onFieldChange()
      }
    }
  })
}

// 添加资质
const addQualification = () => {
  uni.showModal({
    title: '添加资质',
    editable: true,
    placeholderText: '请输入资质名称（如：食品经营许可证）',
    success: (res) => {
      if (res.confirm && res.content) {
        const qualName = res.content

        // 再输入资质编号
        uni.showModal({
          title: '资质编号',
          editable: true,
          placeholderText: '请输入资质编号',
          success: (numberRes) => {
            if (numberRes.confirm && numberRes.content) {
              formData.value.qualifications.push({
                name: qualName,
                number: numberRes.content
              })
              onFieldChange()
            }
          }
        })
      }
    }
  })
}

// 删除资质
const deleteQualification = (index: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该资质证书吗？',
    success: (res) => {
      if (res.confirm) {
        formData.value.qualifications.splice(index, 1)
        onFieldChange()
      }
    }
  })
}

// 验证表单
const validateForm = (): { valid: boolean; message?: string } => {
  const data = formData.value

  if (!data.name.trim()) {
    return {
      valid: false,
      message: `请输入${
        data.entityType === 'company' ? '企业名称' :
        data.entityType === 'individual' ? '个体工商户名称' :
        '主体名称'
      }`
    }
  }

  if (!data.unifiedSocialCreditCode.trim()) {
    return { valid: false, message: '请输入统一社会信用代码' }
  }

  // 验证统一社会信用代码格式（18位）
  const creditCodePattern = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
  if (!creditCodePattern.test(data.unifiedSocialCreditCode)) {
    return { valid: false, message: '统一社会信用代码格式不正确' }
  }

  if (!data.legalPerson.trim()) {
    return {
      valid: false,
      message: `请输入${
        data.entityType === 'company' ? '法定代表人' :
        data.entityType === 'individual' ? '经营者' :
        '负责人'
      }姓名`
    }
  }

  if (!data.address.trim()) {
    return { valid: false, message: '请输入注册地址' }
  }

  if (!data.businessLicense) {
    return { valid: false, message: '请上传营业执照' }
  }

  return { valid: true }
}

// 保存草稿
const saveDraft = () => {
  // 草稿可以不填写必填项
  const data = formData.value

  // 检查是否有任何内容
  const hasContent = data.name.trim() ||
                     data.unifiedSocialCreditCode.trim() ||
                     data.legalPerson.trim() ||
                     data.address.trim() ||
                     data.businessLicense ||
                     data.qualifications.length > 0

  if (!hasContent) {
    uni.showToast({
      title: '请至少填写一项信息',
      icon: 'none'
    })
    return
  }

  // 保存到本地存储
  const drafts = uni.getStorageSync('company_drafts') || []
  const newDraft = {
    id: Date.now(),
    ...data,
    status: 'draft',
    updateTime: new Date().toISOString()
  }

  drafts.push(newDraft)
  uni.setStorageSync('company_drafts', drafts)

  uni.showToast({
    title: '草稿已保存',
    icon: 'success'
  })

  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}

// 提交审核
const submitForReview = () => {
  // 验证必填项
  const validation = validateForm()
  if (!validation.valid) {
    uni.showToast({
      title: validation.message || '请完善必填信息',
      icon: 'none'
    })
    return
  }

  uni.showModal({
    title: '确认提交',
    content: '确认提交公司信息进行审核吗？\n提交后将进入审核流程，审核期间无法修改。',
    confirmText: '确认提交',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 提交到本地存储（实际应该提交到服务器）
        const submissions = uni.getStorageSync('company_submissions') || []
        const newSubmission = {
          id: Date.now(),
          ...formData.value,
          status: 'pending',
          submitTime: new Date().toISOString()
        }

        submissions.push(newSubmission)
        uni.setStorageSync('company_submissions', submissions)

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

// 接收页面参数
onLoad((options: any) => {
  console.log('企业注册页面参数:', options)

  // 接收并保存参数
  if (options.templateId) pageParams.value.templateId = decodeURIComponent(options.templateId)
  if (options.templateName) pageParams.value.templateName = decodeURIComponent(options.templateName)
  if (options.entityType) pageParams.value.entityType = options.entityType
  if (options.firstLevel) pageParams.value.firstLevel = decodeURIComponent(options.firstLevel)
  if (options.secondLevel) pageParams.value.secondLevel = decodeURIComponent(options.secondLevel)
})

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 根据URL参数设置默认主体类型
  if (pageParams.value.entityType) {
    // 如果URL中指定了主体类型，设置为默认值
    formData.value.entityType = pageParams.value.entityType as 'company' | 'individual'
    console.log('设置默认主体类型:', formData.value.entityType)
  }

  // 检查用户实名状态
  try {
    const saved = uni.getStorageSync('user_info')
    if (saved) {
      const userData = JSON.parse(saved)
      if (!userData.isRealNameVerified) {
        // 未实名，提示并返回
        uni.showModal({
          title: '需要实名认证',
          content: '注册公司需要先完成实名认证。实名认证后，您将自动成为注册公司的超级管理员。',
          showCancel: false,
          confirmText: '去认证',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/profile/profile-settings'
              })
            }
          }
        })
      }
    } else {
      // 未找到用户信息，提示去实名
      uni.showModal({
        title: '需要实名认证',
        content: '注册公司需要先完成实名认证。实名认证后，您将自动成为注册公司的超级管理员。',
        showCancel: false,
        confirmText: '去认证',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/profile/profile-settings'
            })
          }
        }
      })
    }
  } catch (e) {
    console.error('检查用户实名状态失败:', e)
  }

  // TODO: 如果是编辑模式，加载现有数据
  // const pages = getCurrentPages()
  // const currentPage = pages[pages.length - 1]
  // const options = currentPage.options
  // if (options.companyId) {
  //   isEditMode.value = true
  //   loadCompanyData(options.companyId)
  // }
})
</script>

<style scoped lang="scss">
.add-company-page {
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

// 模板信息提示栏
.template-info-bar {
  background-color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .info-text {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
  }

  .category-text {
    font-size: 24rpx;
    color: #667eea;
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
  }
}

// 主体类型选择器
.entity-type-selector {
  display: flex;
  gap: 20rpx;

  .entity-type-option {
    flex: 1;
    background: #f8f8f8;
    border: 2rpx solid #e0e0e0;
    border-radius: 16rpx;
    padding: 30rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s;

    .type-icon {
      font-size: 64rpx;
      margin-bottom: 12rpx;
    }

    .type-name {
      font-size: 28rpx;
      color: #666;
      font-weight: 500;
    }

    &.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-color: #667eea;

      .type-name {
        color: #667eea;
        font-weight: 600;
      }
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

// 表单项
.form-item {
  margin-bottom: 30rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .form-label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
    font-weight: 500;
  }

  .form-input {
    width: 100%;
    background: #f8f8f8;
    border-radius: 12rpx;
    padding: 24rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
  }

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

  .required::before {
    content: '*';
    color: #ff5722;
    margin-right: 4rpx;
  }
}

// 上传区域
.upload-section {
  .uploaded-image {
    position: relative;
    width: 100%;
    height: 400rpx;
    background: #f8f8f8;
    border-radius: 16rpx;
    overflow: hidden;

    .license-image {
      width: 100%;
      height: 100%;
    }

    .delete-btn {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      width: 60rpx;
      height: 60rpx;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .delete-icon {
        font-size: 48rpx;
        color: #fff;
        line-height: 1;
      }

      &:active {
        background: rgba(0, 0, 0, 0.8);
      }
    }
  }

  .upload-btn {
    background: #f8f8f8;
    border: 2rpx dashed #d0d0d0;
    border-radius: 16rpx;
    padding: 60rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s;

    .upload-icon {
      font-size: 80rpx;
      margin-bottom: 16rpx;
    }

    .upload-text {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 8rpx;
    }

    .upload-hint {
      font-size: 24rpx;
      color: #999;
    }

    &:active {
      background: #f0f0f0;
    }
  }
}

// 资质证书列表
.empty-qualifications {
  text-align: center;
  padding: 60rpx 0;

  .empty-text {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin-bottom: 30rpx;
  }

  .add-qualification-btn {
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

.qualifications-list {
  .qualification-item {
    background: #f8f8f8;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .qualification-info {
      flex: 1;

      .qual-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        display: block;
        margin-bottom: 8rpx;
      }

      .qual-number {
        font-size: 24rpx;
        color: #999;
        display: block;
      }
    }

    .qualification-actions {
      .action-btn {
        padding: 12rpx 24rpx;
        border-radius: 8rpx;
        font-size: 24rpx;

        &.delete {
          background: #ffebee;
          color: #f44336;

          .action-text {
            color: #f44336;
          }
        }

        &:active {
          opacity: 0.8;
        }
      }
    }
  }

  .add-qualification-btn {
    background: #f0f0f0;
    border-radius: 12rpx;
    padding: 24rpx;
    text-align: center;
    display: block;

    .btn-text {
      font-size: 28rpx;
      color: #667eea;
      font-weight: 500;
    }

    &:active {
      background: #e0e0e0;
    }
  }
}

// 操作按钮
.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;

  .save-draft-btn,
  .submit-btn {
    flex: 1;
    border-radius: 50rpx;
    padding: 32rpx;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  .save-draft-btn {
    background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
    box-shadow: 0 8rpx 24rpx rgba(158, 158, 158, 0.3);
  }

  .submit-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  }
}
</style>
