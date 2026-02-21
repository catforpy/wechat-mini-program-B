<template>
  <view class="business-scope-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">经营范围</text>
        <view class="nav-save" @tap="handleSave">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="form-container">
        <!-- 经营范围输入 -->
        <view class="form-item textarea-item">
          <text class="form-label">经营范围</text>
          <textarea
            class="form-textarea"
            v-model="businessScope"
            placeholder="请输入经营范围内容..."
            placeholder-style="color: #999;"
            :maxlength="2000"
            :auto-height="true"
          />
          <text class="char-count">{{ businessScope.length }}/2000</text>
        </view>

        <!-- 常用经营范围模板 -->
        <view class="template-section">
          <view class="section-title">
            <text class="title-icon">📋</text>
            <text class="title-text">常用模板</text>
          </view>

          <view class="template-list">
            <view
              v-for="(template, index) in scopeTemplates"
              :key="index"
              class="template-item"
              @tap="handleUseTemplate(template)"
            >
              <text class="template-name">{{ template.name }}</text>
              <text class="template-arrow">›</text>
            </view>
          </view>
        </view>

        <!-- 提示信息 -->
        <view class="tips-section">
          <text class="tips-icon">💡</text>
          <view class="tips-content">
            <text class="tips-text">经营范围应简明扼要地描述企业的主要业务内容，建议：</text>
            <text class="tips-text">• 按业务重要程度排列</text>
            <text class="tips-text">• 使用规范的行业术语</text>
            <text class="tips-text">• 与营业执照保持一致</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>

  <!-- 首次填写授权弹窗 -->
  <view v-if="showConsentModal" class="consent-modal-mask" @tap="handleDisagree">
    <view class="consent-modal-content" @tap.stop>
      <view class="consent-header">
        <text class="consent-icon">📄</text>
        <text class="consent-title">信息收集说明</text>
      </view>

      <view class="consent-body">
        <text class="consent-text">
          为了完善您的企业/个体名片信息，展示您的业务范围，我们需要收集经营范围信息：
        </text>

        <view class="consent-list">
          <text class="consent-item">• 经营范围内容：展示您的业务领域</text>
          <text class="consent-item">• 业务分类：帮助他人快速了解您的业务</text>
        </view>

        <text class="consent-notice">
          经营范围将显示在您的名片上，帮助潜在客户和合作伙伴了解您的业务能力。我们承诺保护您的隐私。
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 经营范围内容
const businessScope = ref('')

// 经营范围模板
const scopeTemplates = ref([
  {
    name: '技术开发类',
    content: '技术开发、技术咨询、技术服务、技术转让；计算机系统服务；软件开发；数据处理；产品设计。'
  },
  {
    name: '商贸服务类',
    content: '销售日用百货、工艺美术品、文化用品；电子商务；货物进出口；技术进出口。'
  },
  {
    name: '咨询服务类',
    content: '经济信息咨询；商务信息咨询；企业管理咨询；市场策划；企业形象策划。'
  },
  {
    name: '设计服务类',
    content: '平面设计；包装设计；品牌策划；企业形象设计；广告设计、制作、代理、发布。'
  },
  {
    name: '教育培训类',
    content: '教育咨询；培训服务；文化艺术交流活动策划；会议服务；展览服务。'
  }
])

// 授权弹窗
const showConsentModal = ref(false)

// 检查是否首次填写
const checkFirstTime = () => {
  const hasAgreed = uni.getStorageSync('business_scope_consented')
  if (!hasAgreed) {
    showConsentModal.value = true
  }
}

// 同意授权
const handleAgree = () => {
  uni.setStorageSync('business_scope_consented', true)
  showConsentModal.value = false
}

// 不同意授权
const handleDisagree = () => {
  showConsentModal.value = false
  uni.navigateBack()
}

// 使用模板
const handleUseTemplate = (template: any) => {
  uni.showModal({
    title: '使用模板',
    content: `确定要使用「${template.name}」模板吗？这将替换当前已输入的内容。`,
    success: (res) => {
      if (res.confirm) {
        businessScope.value = template.content
        uni.showToast({
          title: '已应用模板',
          icon: 'success'
        })
      }
    }
  })
}

// 保存
const handleSave = () => {
  if (!businessScope.value.trim()) {
    uni.showToast({
      title: '请输入经营范围',
      icon: 'none'
    })
    return
  }

  // 保存到本地存储
  uni.setStorageSync('business_scope_content', businessScope.value)

  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })

  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
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
  const savedData = uni.getStorageSync('business_scope_content')
  if (savedData) {
    businessScope.value = savedData
  }

  // 检查是否首次填写
  checkFirstTime()
})
</script>

<style scoped lang="scss">
.business-scope-page {
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

    .nav-save {
      padding: 12rpx 24rpx;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 24rpx;

      .save-text {
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

.form-container {
  padding: 30rpx;
}

// 表单项
.form-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 20rpx;

  .form-label {
    display: block;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 16rpx;
  }

  .form-textarea {
    width: 100%;
    min-height: 200rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.8;
  }

  .char-count {
    display: block;
    text-align: right;
    font-size: 22rpx;
    color: #999;
    margin-top: 12rpx;
  }
}

// 模板区域
.template-section {
  margin-top: 30rpx;

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .title-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
    }

    .title-text {
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
    }
  }

  .template-list {
    .template-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-radius: 16rpx;
      padding: 24rpx;
      margin-bottom: 16rpx;
      transition: all 0.3s;

      &:active {
        background: #f8f9fa;
        transform: scale(0.98);
      }

      .template-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }

      .template-arrow {
        font-size: 32rpx;
        color: #999;
        font-weight: 300;
      }
    }
  }
}

// 提示信息
.tips-section {
  display: flex;
  align-items: flex-start;
  padding: 24rpx;
  background: #e6f7ff;
  border-radius: 12rpx;
  margin-top: 30rpx;

  .tips-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
  }

  .tips-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .tips-text {
      font-size: 24rpx;
      color: #1890ff;
      line-height: 1.6;
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
</style>
