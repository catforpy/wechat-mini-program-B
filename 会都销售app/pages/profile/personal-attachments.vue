<template>
  <view class="attachments-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">附件管理</text>
        <view class="nav-add" @tap="handleAdd">
          <text class="add-text">添加</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="attachments-list">
        <!-- 空状态 -->
        <view v-if="attachmentsList.length === 0" class="empty-state">
          <text class="empty-icon">📎</text>
          <text class="empty-text">暂无附件</text>
          <text class="empty-hint">点击右上角"添加"按钮上传附件</text>
        </view>

        <!-- 附件列表 -->
        <view
          v-for="(item, index) in attachmentsList"
          :key="item.id"
          class="attachment-item"
        >
          <view class="attachment-icon-wrapper">
            <text class="attachment-icon">{{ getFileIcon(item.type) }}</text>
          </view>

          <view class="attachment-info" @tap="handlePreview(item)">
            <text class="attachment-name">{{ item.name }}</text>
            <text class="attachment-size">{{ formatFileSize(item.size) }}</text>
          </view>

          <view class="attachment-actions">
            <view class="action-btn download-btn" @tap="handleDownload(item)">
              <text class="action-icon">⬇️</text>
            </view>
            <view class="action-btn delete-btn" @tap="handleDelete(index)">
              <text class="action-icon">🗑️</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>

  <!-- 首次填写授权弹窗 -->
  <view v-if="showConsentModal" class="consent-modal-mask" @tap="handleDisagree">
    <view class="consent-modal-content" @tap.stop>
      <view class="consent-header">
        <text class="consent-icon">📎</text>
        <text class="consent-title">信息收集说明</text>
      </view>

      <view class="consent-body">
        <text class="consent-text">
          为了完善您的个人名片信息，方便他人查阅您的相关资料，我们需要收集您的附件信息：
        </text>

        <view class="consent-list">
          <text class="consent-item">• 简历附件：用于展示个人详细简历</text>
          <text class="consent-item">• 学历证书：用于证明教育背景</text>
          <text class="consent-item">• 身份证件：用于身份验证</text>
          <text class="consent-item">• 其他资料：其他相关证明文件</text>
        </view>

        <text class="consent-notice">
          这些附件将存储在您的名片中，方便他人查看和下载。我们承诺保护您的文件隐私安全。
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

  <!-- 添加附件弹窗 -->
  <view v-if="showAddModal" class="add-modal-mask" @tap="closeAddModal">
    <view class="add-modal-content" @tap.stop>
      <view class="add-header">
        <text class="add-title">选择附件类型</text>
        <view class="close-btn" @tap="closeAddModal">
          <text class="close-icon">✕</text>
        </view>
      </view>

      <view class="add-body">
        <view class="type-grid">
          <view
            v-for="type in attachmentTypes"
            :key="type.value"
            class="type-item"
            @tap="handleSelectType(type.value)"
          >
            <text class="type-icon">{{ type.icon }}</text>
            <text class="type-name">{{ type.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 附件列表
const attachmentsList = ref<any[]>([])

// 附件类型选项
const attachmentTypes = [
  { label: '简历', value: 'resume', icon: '📄' },
  { label: '学历证书', value: 'education', icon: '🎓' },
  { label: '身份证件', value: 'identity', icon: '📇' },
  { label: '其他', value: 'other', icon: '📁' }
]

// 授权弹窗
const showConsentModal = ref(false)

// 添加弹窗
const showAddModal = ref(false)

// 检查是否首次填写
const checkFirstTime = () => {
  const hasAgreed = uni.getStorageSync('attachments_consented')
  if (!hasAgreed) {
    showConsentModal.value = true
  }
}

// 同意授权
const handleAgree = () => {
  uni.setStorageSync('attachments_consented', true)
  showConsentModal.value = false
}

// 不同意授权
const handleDisagree = () => {
  showConsentModal.value = false
  uni.navigateBack()
}

// 添加附件
const handleAdd = () => {
  showAddModal.value = true
}

// 选择附件类型
const handleSelectType = (type: string) => {
  closeAddModal()

  // 根据类型选择文件
  chooseFile(type)
}

// 选择文件
const chooseFile = (type: string) => {
  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    success: (res) => {
      const file = res.tempFiles[0]

      // 添加到列表
      const newAttachment = {
        id: Date.now().toString(),
        name: file.name,
        type: type,
        path: file.path,
        size: file.size,
        uploadTime: new Date().toISOString()
      }

      attachmentsList.value.unshift(newAttachment)
      saveToList()

      uni.showToast({
        title: '添加成功',
        icon: 'success'
      })
    }
  })
}

// 删除附件
const handleDelete = (index: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个附件吗？',
    success: (res) => {
      if (res.confirm) {
        attachmentsList.value.splice(index, 1)
        saveToList()
      }
    }
  })
}

// 预览附件
const handlePreview = (item: any) => {
  uni.showLoading({
    title: '加载中...'
  })

  // TODO: 实际预览逻辑需要根据文件类型处理
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '预览功能开发中',
      icon: 'none'
    })
  }, 500)
}

// 下载附件
const handleDownload = (item: any) => {
  uni.showLoading({
    title: '下载中...'
  })

  // TODO: 实际下载逻辑
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '下载功能开发中',
      icon: 'none'
    })
  }, 500)
}

// 关闭添加弹窗
const closeAddModal = () => {
  showAddModal.value = false
}

// 获取文件图标
const getFileIcon = (type: string) => {
  const typeMap: Record<string, string> = {
    'resume': '📄',
    'education': '🎓',
    'identity': '📇',
    'other': '📁'
  }
  return typeMap[type] || '📎'
}

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  }
}

// 保存到本地存储
const saveToList = () => {
  uni.setStorageSync('personal_attachments', JSON.stringify(attachmentsList.value))
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
  const savedData = uni.getStorageSync('personal_attachments')
  if (savedData) {
    try {
      attachmentsList.value = JSON.parse(savedData)
    } catch (e) {
      console.error('读取附件失败:', e)
    }
  }

  // 检查是否首次填写
  checkFirstTime()
})
</script>

<style scoped lang="scss">
.attachments-page {
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

.attachments-list {
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

// 附件项
.attachment-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .attachment-icon-wrapper {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f8fa;
    border-radius: 12rpx;
    margin-right: 20rpx;

    .attachment-icon {
      font-size: 48rpx;
    }
  }

  .attachment-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    min-width: 0;

    .attachment-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .attachment-size {
      font-size: 24rpx;
      color: #999;
    }
  }

  .attachment-actions {
    display: flex;
    gap: 12rpx;

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

    .download-btn {
      background: #e6f7ff;
    }

    .delete-btn {
      background: #fff1f0;
    }
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

// 添加附件弹窗
.add-modal-mask {
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

.add-modal-content {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  max-height: 60vh;
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

.add-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .add-title {
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

.add-body {
  flex: 1;
  padding: 40rpx 30rpx;
  overflow-y: auto;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;

  .type-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx 20rpx;
    background: #f7f8fa;
    border-radius: 16rpx;
    transition: all 0.3s;

    &:active {
      background: #e8e9eb;
      transform: scale(0.96);
    }

    .type-icon {
      font-size: 64rpx;
      margin-bottom: 16rpx;
    }

    .type-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
  }
}
</style>
