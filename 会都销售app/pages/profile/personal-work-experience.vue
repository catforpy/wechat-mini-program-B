<template>
  <view class="work-experience-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">工作经历</text>
        <view class="nav-add" @tap="handleAdd">
          <text class="add-text">添加</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="experience-list">
        <!-- 空状态 -->
        <view v-if="experienceList.length === 0" class="empty-state">
          <text class="empty-icon">💼</text>
          <text class="empty-text">暂无工作经历</text>
          <text class="empty-hint">点击右上角"添加"按钮添加您的第一份工作经历</text>
        </view>

        <!-- 工作经历列表 -->
        <view
          v-for="(item, index) in experienceList"
          :key="item.id"
          class="experience-item"
          @tap="handleEdit(item)"
        >
          <view class="experience-header">
            <text class="company-name">{{ item.company }}</text>
            <view class="experience-actions">
              <view class="action-btn edit-btn" @tap.stop="handleEdit(item)">
                <text class="action-icon">✏️</text>
              </view>
              <view class="action-btn delete-btn" @tap.stop="handleDelete(index)">
                <text class="action-icon">🗑️</text>
              </view>
            </view>
          </view>

          <view class="experience-info">
            <text class="position">{{ item.position }}</text>
            <text class="time-range">{{ item.startDate }} - {{ item.endDate }}</text>
          </view>

          <text v-if="item.description" class="description">{{ item.description }}</text>
        </view>
      </view>
    </scroll-view>
  </view>

  <!-- 首次填写授权弹窗 -->
  <view v-if="showConsentModal" class="consent-modal-mask" @tap="handleDisagree">
    <view class="consent-modal-content" @tap.stop>
      <view class="consent-header">
        <text class="consent-icon">💼</text>
        <text class="consent-title">信息收集说明</text>
      </view>

      <view class="consent-body">
        <text class="consent-text">
          为了完善您的个人名片信息，展示您的职业背景，我们需要收集您的工作经历信息：
        </text>

        <view class="consent-list">
          <text class="consent-item">• 公司名称、职位：展示您的职业履历</text>
          <text class="consent-item">• 工作时间：展示您的工作年限</text>
          <text class="consent-item">• 工作描述：展示您的工作内容</text>
        </view>

        <text class="consent-notice">
          这些信息将用于您的名片展示，帮助他人了解您的专业背景和工作经验。我们承诺保护您的隐私。
        </text>
      </view>

      <view class="consent-footer">
        <view class="consent-btn disagree-btn" @tap="handleDisagree">
          <text class="consent-btn-text">不同意</text>
        </view>
        <view class="consent-btn agree-btn" @tap="handleAgree">
          <text class="consent-btn-text">同意并继续</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 编辑/添加弹窗 -->
  <view v-if="showEditModal" class="edit-modal-mask" @tap="closeEditModal">
    <view class="edit-modal-content" @tap.stop>
      <view class="edit-header">
        <text class="edit-title">{{ isEditMode ? '编辑工作经历' : '添加工作经历' }}</text>
        <view class="close-btn" @tap="closeEditModal">
          <text class="close-icon">✕</text>
        </view>
      </view>

      <scroll-view class="edit-body" scroll-y>
        <!-- 公司名称 -->
        <view class="form-item">
          <text class="form-label required">公司名称</text>
          <input
            class="form-input"
            v-model="editForm.company"
            placeholder="请输入公司名称"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 职位 -->
        <view class="form-item">
          <text class="form-label required">职位</text>
          <input
            class="form-input"
            v-model="editForm.position"
            placeholder="请输入职位"
            placeholder-style="color: #999;"
          />
        </view>

        <!-- 开始时间 -->
        <view class="form-item">
          <text class="form-label required">开始时间</text>
          <picker
            mode="date"
            :value="editForm.startDate"
            @change="handleStartDateChange"
          >
            <view class="picker-value">
              {{ editForm.startDate || '请选择开始时间' }}
            </view>
          </picker>
        </view>

        <!-- 结束时间 -->
        <view class="form-item">
          <text class="form-label">结束时间</text>
          <picker
            mode="date"
            :value="editForm.endDate"
            :end="getCurrentDate()"
            @change="handleEndDateChange"
          >
            <view class="picker-value">
              {{ editForm.endDate || '请选择结束时间' }}
            </view>
          </picker>
          <view class="checkbox-row">
            <checkbox
              :checked="isCurrentJob"
              @tap="toggleCurrentJob"
              color="#667eea"
              style="transform: scale(0.8);"
            />
            <text class="checkbox-label" @tap="toggleCurrentJob">至今</text>
          </view>
        </view>

        <!-- 工作描述 -->
        <view class="form-item textarea-item">
          <text class="form-label">工作描述</text>
          <textarea
            class="form-textarea"
            v-model="editForm.description"
            placeholder="请描述您的工作内容和职责（选填）"
            placeholder-style="color: #999;"
            :maxlength="500"
            :auto-height="true"
          />
          <text class="char-count">{{ editForm.description.length }}/500</text>
        </view>
      </scroll-view>

      <view class="edit-footer">
        <view class="edit-footer-btn cancel-btn" @tap="closeEditModal">
          <text class="edit-footer-text">取消</text>
        </view>
        <view class="edit-footer-btn confirm-btn" @tap="handleConfirm">
          <text class="edit-footer-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 工作经历列表
const experienceList = ref<any[]>([])

// 授权弹窗
const showConsentModal = ref(false)

// 编辑弹窗
const showEditModal = ref(false)
const isEditMode = ref(false)
const isCurrentJob = ref(false)

// 编辑表单
const editForm = ref({
  id: '',
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  description: ''
})

// 检查是否首次填写
const checkFirstTime = () => {
  const hasAgreed = uni.getStorageSync('work_experience_consented')
  if (!hasAgreed) {
    showConsentModal.value = true
  }
}

// 同意授权
const handleAgree = () => {
  uni.setStorageSync('work_experience_consented', true)
  showConsentModal.value = false
}

// 不同意授权
const handleDisagree = () => {
  showConsentModal.value = false
  uni.navigateBack()
}

// 添加工作经历
const handleAdd = () => {
  isEditMode.value = false
  editForm.value = {
    id: Date.now().toString(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  }
  isCurrentJob.value = false
  showEditModal.value = true
}

// 编辑工作经历
const handleEdit = (item: any) => {
  isEditMode.value = true
  editForm.value = { ...item }
  isCurrentJob.value = item.endDate === '至今'
  showEditModal.value = true
}

// 删除工作经历
const handleDelete = (index: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条工作经历吗？',
    success: (res) => {
      if (res.confirm) {
        experienceList.value.splice(index, 1)
        saveToList()
      }
    }
  })
}

// 关闭编辑弹窗
const closeEditModal = () => {
  showEditModal.value = false
}

// 切换"至今"状态
const toggleCurrentJob = () => {
  isCurrentJob.value = !isCurrentJob.value
  if (isCurrentJob.value) {
    editForm.value.endDate = '至今'
  } else {
    editForm.value.endDate = ''
  }
}

// 开始时间变化
const handleStartDateChange = (e: any) => {
  editForm.value.startDate = e.detail.value
}

// 结束时间变化
const handleEndDateChange = (e: any) => {
  editForm.value.endDate = e.detail.value
  isCurrentJob.value = false
}

// 获取当前日期
const getCurrentDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 确认添加/编辑
const handleConfirm = () => {
  // 验证必填项
  if (!editForm.value.company) {
    uni.showToast({
      title: '请输入公司名称',
      icon: 'none'
    })
    return
  }

  if (!editForm.value.position) {
    uni.showToast({
      title: '请输入职位',
      icon: 'none'
    })
    return
  }

  if (!editForm.value.startDate) {
    uni.showToast({
      title: '请选择开始时间',
      icon: 'none'
    })
    return
  }

  if (!isCurrentJob.value && !editForm.value.endDate) {
    uni.showToast({
      title: '请选择结束时间',
      icon: 'none'
    })
    return
  }

  if (isEditMode.value) {
    // 编辑模式，更新现有数据
    const index = experienceList.value.findIndex(item => item.id === editForm.value.id)
    if (index !== -1) {
      experienceList.value[index] = { ...editForm.value }
    }
  } else {
    // 添加模式，添加新数据
    experienceList.value.unshift({ ...editForm.value })
  }

  saveToList()
  closeEditModal()

  uni.showToast({
    title: isEditMode.value ? '修改成功' : '添加成功',
    icon: 'success'
  })
}

// 保存到本地存储
const saveToList = () => {
  uni.setStorageSync('personal_work_experience', JSON.stringify(experienceList.value))
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载已保存的数据
  const savedData = uni.getStorageSync('personal_work_experience')
  if (savedData) {
    try {
      experienceList.value = JSON.parse(savedData)
    } catch (e) {
      console.error('读取工作经历失败:', e)
    }
  }

  // 检查是否首次填写
  checkFirstTime()
})
</script>

<style scoped lang="scss">
.work-experience-page {
  min-height: 100vh;
  background: #f5f5f5;
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
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
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

    .nav-add {
      padding: 12rpx 24rpx;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 24rpx;

      .add-text {
        font-size: 28rpx;
        color: #667eea;
        font-weight: 600;
      }

      &:active {
        background: rgba(255, 255, 255, 1);
      }
    }
  }
}

// 主内容区域
.content-scroll {
  height: 100vh;
  padding-top: calc(var(--status-bar-height) + 88rpx);
}

.experience-list {
  padding: 30rpx;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 60rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 24rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #999;
    margin-bottom: 16rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #bbb;
    text-align: center;
  }
}

// 工作经历项
.experience-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  &:active {
    background: #f8f9fa;
  }

  .experience-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;

    .company-name {
      font-size: 32rpx;
      color: #333;
      font-weight: 600;
      flex: 1;
    }

    .experience-actions {
      display: flex;
      gap: 16rpx;

      .action-btn {
        width: 56rpx;
        height: 56rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        &:active {
          opacity: 0.6;
        }

        .action-icon {
          font-size: 28rpx;
        }
      }

      .edit-btn {
        background: #e6f7ff;
      }

      .delete-btn {
        background: #fff1f0;
      }
    }
  }

  .experience-info {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 12rpx;

    .position {
      font-size: 28rpx;
      color: #667eea;
      font-weight: 500;
    }

    .time-range {
      font-size: 24rpx;
      color: #999;
    }
  }

  .description {
    display: block;
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
  }
}

// 授权弹窗
.consent-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.consent-modal-content {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  animation: scaleIn 0.3s;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.consent-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32rpx;

  .consent-icon {
    font-size: 80rpx;
    margin-bottom: 16rpx;
  }

  .consent-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.consent-body {
  margin-bottom: 40rpx;

  .consent-text {
    display: block;
    font-size: 28rpx;
    color: #666;
    line-height: 1.8;
    margin-bottom: 24rpx;
  }

  .consent-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-bottom: 24rpx;

    .consent-item {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
      padding-left: 8rpx;
    }
  }

  .consent-notice {
    display: block;
    font-size: 24rpx;
    color: #999;
    line-height: 1.6;
    padding: 20rpx;
    background: #f7f8fa;
    border-radius: 12rpx;
  }
}

.consent-footer {
  display: flex;
  gap: 20rpx;

  .consent-btn {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 48rpx;
    font-size: 28rpx;
    font-weight: 500;
    transition: all 0.3s;

    &:active {
      transform: scale(0.96);
    }

    .consent-btn-text {
      font-size: 28rpx;
      font-weight: 600;
    }
  }

  .disagree-btn {
    background: #f5f5f5;

    .consent-btn-text {
      color: #666;
    }
  }

  .agree-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    .consent-btn-text {
      color: #fff;
    }
  }
}

// 编辑弹窗
.edit-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2500;
  display: flex;
  align-items: flex-end;
}

.edit-modal-content {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .edit-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333;
  }

  .close-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .close-icon {
      font-size: 36rpx;
      color: #999;
    }

    &:active {
      background: #f5f5f5;
      border-radius: 50%;
    }
  }
}

.edit-body {
  flex: 1;
  padding: 30rpx;
  overflow-y: auto;
}

.form-item {
  background: #f7f8fa;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
  margin-bottom: 20rpx;

  .form-label {
    display: block;
    font-size: 26rpx;
    color: #666;
    margin-bottom: 12rpx;

    &.required::after {
      content: '*';
      color: #ff4d4f;
      margin-left: 4rpx;
    }
  }

  .form-input {
    width: 100%;
    font-size: 28rpx;
    color: #333;
  }

  .picker-value {
    font-size: 28rpx;
    color: #333;
  }

  .form-textarea {
    width: 100%;
    min-height: 120rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
  }

  .char-count {
    display: block;
    text-align: right;
    font-size: 22rpx;
    color: #999;
    margin-top: 8rpx;
  }

  .checkbox-row {
    display: flex;
    align-items: center;
    margin-top: 12rpx;

    .checkbox-label {
      font-size: 26rpx;
      color: #666;
      margin-left: 8rpx;
    }
  }
}

.edit-footer {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #f0f0f0;

  .edit-footer-btn {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 48rpx;
    font-size: 28rpx;

    &:active {
      opacity: 0.8;
    }

    .edit-footer-text {
      font-size: 28rpx;
      font-weight: 600;
    }
  }

  .cancel-btn {
    background: #f5f5f5;

    .edit-footer-text {
      color: #666;
    }
  }

  .confirm-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    .edit-footer-text {
      color: #fff;
    }
  }
}
</style>
