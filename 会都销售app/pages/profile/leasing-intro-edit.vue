<template>
  <view class="leasing-intro-edit-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">编辑租赁介绍</text>
        <view class="nav-action" @tap="saveIntro">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 编辑/预览模式切换 -->
    <view class="mode-toggle" :style="{ top: (statusBarHeight + 88) + 'px' }">
      <view
        class="mode-item"
        :class="{ active: editMode === 'edit' }"
        @tap="switchMode('edit')"
      >
        <text>✏️ 编辑</text>
      </view>
      <view
        class="mode-item"
        :class="{ active: editMode === 'preview' }"
        @tap="switchMode('preview')"
      >
        <text>👁️ 预览</text>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 140) + 'px' }">

      <!-- 编辑模式 -->
      <view v-if="editMode === 'edit'" class="edit-mode-content">

        <!-- 小程序基本信息 -->
        <view class="info-card">
          <text class="card-emoji">{{ formData.emoji }}</text>
          <text class="card-title">{{ formData.name }}</text>
          <text class="card-meta">{{ formData.companyName }}</text>
        </view>

        <!-- 轮播图管理 -->
        <view class="section-card">
          <text class="section-title">🎑 轮播图展示</text>
          <view class="banner-list">
            <view
              v-for="(banner, index) in formData.banners"
              :key="index"
              class="banner-item"
            >
              <view class="banner-upload" @tap="uploadBanner(index)">
                <text v-if="!banner.image" class="upload-icon">📷</text>
                <image v-else class="banner-image" :src="banner.image" mode="aspectFill"></image>
                <text class="upload-hint">点击上传{{ index + 1 }}/{{ formData.banners.length }}</text>
              </view>
              <view v-if="banner.image" class="banner-actions">
                <text class="action-btn" @tap="removeBanner(index)">删除</text>
              </view>
            </view>
          </view>
          <text class="section-hint">建议尺寸：750x400px，支持3张轮播图</text>
        </view>

        <!-- 小程序信息 -->
        <view class="section-card">
          <text class="section-title">📱 小程序信息</text>
          <view class="logo-upload" @tap="uploadLogo">
            <text v-if="!formData.logo" class="upload-icon">📷</text>
            <image v-else class="logo-image" :src="formData.logo" mode="aspectFill"></image>
            <text class="upload-hint">点击上传Logo</text>
          </view>
          <view class="form-item">
            <text class="form-label">小程序名称</text>
            <input class="form-input" v-model="formData.programName" placeholder="请输入小程序名称" />
          </view>
          <view class="form-item">
            <text class="form-label">一句话介绍</text>
            <input class="form-input" v-model="formData.tagline" placeholder="一句话描述小程序的核心价值" maxlength="50" />
          </view>
        </view>

        <!-- 视频介绍 -->
        <view class="section-card">
          <text class="section-title">🎬 视频介绍</text>
          <view class="video-upload" @tap="uploadVideo">
            <text v-if="!formData.video" class="upload-icon">📹</text>
            <view v-else class="video-preview">
              <text class="video-icon">▶️</text>
            </view>
            <text class="upload-hint">点击上传介绍视频（可选）</text>
          </view>
          <text class="section-hint">建议时长：30-90秒，展示小程序核心功能和使用场景</text>
        </view>

        <!-- 详细介绍 -->
        <view class="section-card">
          <text class="section-title">📝 详细介绍</text>
          <view class="rich-editor">
            <view class="editor-toolbar">
              <text class="toolbar-btn" @tap="insertText('图片')">📷</text>
              <text class="toolbar-btn" @tap="insertText('视频')">🎬</text>
              <text class="toolbar-btn" @tap="insertText('加粗')">B</text>
              <text class="toolbar-btn" @tap="insertText('列表')">📋</text>
            </view>
            <textarea
              v-model="formData.description"
              class="rich-textarea"
              placeholder="请输入小程序的详细介绍，支持图文混排..."
              maxlength="1000"
            ></textarea>
            <text class="char-count">{{ formData.description.length }}/1000</text>
          </view>

          <!-- 已插入的媒体项 -->
          <view v-if="formData.mediaItems.length > 0" class="media-grid">
            <view
              v-for="(item, index) in formData.mediaItems"
              :key="index"
              class="media-item"
            >
              <image v-if="item.type === 'image'" class="media-image" :src="item.url" mode="aspectFill"></image>
              <view v-else class="media-video">
                <text class="play-icon">▶️</text>
              </view>
              <text class="media-remove" @tap="removeMedia(index)">×</text>
            </view>
          </view>
        </view>

        <!-- 可租赁面板/功能 -->
        <view class="section-card">
          <text class="section-title">🔄 可租赁面板/功能</text>
          <view class="panel-list">
            <view
              v-for="(panel, index) in formData.panels"
              :key="index"
              class="panel-item"
            >
              <view class="panel-header">
                <text class="panel-number">{{ index + 1 }}</text>
                <input
                  v-model="panel.name"
                  class="panel-name-input"
                  placeholder="功能名称"
                />
                <text class="panel-remove" @tap="removePanel(index)">×</text>
              </view>
              <textarea
                v-model="panel.description"
                class="panel-desc"
                placeholder="功能描述"
                maxlength="200"
              ></textarea>
              <view class="panel-price">
                <text class="price-label">月租价格：</text>
                <input
                  v-model="panel.price"
                  class="price-input"
                  type="digit"
                  placeholder="0"
                />
                <text class="price-unit">元/月</text>
              </view>
            </view>
          </view>
          <view class="add-btn" @tap="addPanel">
            <text>+ 添加可租赁功能</text>
          </view>
        </view>

        <!-- 租赁套餐 -->
        <view class="section-card">
          <text class="section-title">📦 租赁套餐</text>
          <view class="package-selector">
            <view
              v-for="pkg in packageOptions"
              :key="pkg.value"
              class="package-option"
              :class="{ active: formData.packageType === pkg.value }"
              @tap="selectPackage(pkg.value)"
            >
              <text class="package-name">{{ pkg.label }}</text>
              <text class="package-desc">{{ pkg.desc }}</text>
            </view>
          </view>
          <view v-if="formData.packageType === 'custom'" class="custom-package">
            <input class="form-input" v-model="formData.customPackage" placeholder="请输入自定义套餐名称" />
          </view>
        </view>

        <!-- 适合场景 -->
        <view class="section-card">
          <text class="section-title">🎯 适合场景</text>
          <view class="scenario-tags">
            <view
              v-for="scenario in popularScenarios"
              :key="scenario"
              class="tag-item"
              :class="{ selected: formData.scenarios.includes(scenario) }"
              @tap="toggleScenario(scenario)"
            >
              <text class="tag-text">{{ scenario }}</text>
              <text v-if="formData.scenarios.includes(scenario)" class="tag-check">✓</text>
            </view>
          </view>
          <textarea
            v-model="formData.customScenario"
            class="form-textarea"
            placeholder="或输入其他适用场景..."
            maxlength="200"
          ></textarea>
        </view>

        <!-- 租赁说明 -->
        <view class="section-card">
          <text class="section-title">📋 租赁说明</text>
          <view class="terms-list">
            <view class="term-item">
              <text class="term-label">最低租期</text>
              <view class="term-options">
                <text
                  v-for="period in ['1个月', '3个月', '6个月', '1年']"
                  :key="period"
                  class="term-option"
                  :class="{ active: formData.minPeriod === period }"
                  @tap="formData.minPeriod = period"
                >{{ period }}</text>
              </view>
            </view>
            <view class="term-item">
              <text class="term-label">付款方式</text>
              <view class="term-options">
                <text
                  v-for="method in ['月付', '季付', '半年付', '年付']"
                  :key="method"
                  class="term-option"
                  :class="{ active: formData.paymentMethod === method }"
                  @tap="formData.paymentMethod = method"
                >{{ method }}</text>
              </view>
            </view>
            <view class="term-item">
              <text class="term-label">数据归属</text>
              <textarea
                v-model="formData.dataOwnership"
                class="form-textarea"
                placeholder="说明租赁期间数据的归属权"
                maxlength="200"
              ></textarea>
            </view>
          </view>
        </view>

        <!-- 租赁优势 -->
        <view class="section-card">
          <text class="section-title">✨ 租赁优势</text>
          <view class="advantage-list">
            <view
              v-for="(advantage, index) in formData.advantages"
              :key="index"
              class="advantage-item"
            >
              <text class="advantage-number">{{ index + 1 }}</text>
              <textarea
                v-model="advantage.content"
                class="advantage-input"
                placeholder="输入优势说明"
                maxlength="100"
              ></textarea>
              <text class="advantage-remove" @tap="removeAdvantage(index)">×</text>
            </view>
          </view>
          <view class="add-btn" @tap="addAdvantage">
            <text>+ 添加优势</text>
          </view>
        </view>

        <!-- 技术支持 -->
        <view class="section-card">
          <text class="section-title">🛠️ 技术支持</text>
          <view class="support-grid">
            <view
              v-for="support in supportOptions"
              :key="support"
              class="support-checkbox"
              :class="{ selected: formData.support.includes(support) }"
              @tap="toggleSupport(support)"
            >
              <text class="checkbox-icon">{{ formData.support.includes(support) ? '✓' : '' }}</text>
              <text class="checkbox-label">{{ support }}</text>
            </view>
          </view>
          <view class="form-item">
            <text class="form-label">支持说明</text>
            <textarea
              v-model="formData.supportDescription"
              class="form-textarea"
              placeholder="详细说明技术支持内容"
              maxlength="300"
            ></textarea>
          </view>
        </view>

        <!-- 联系方式 -->
        <view class="section-card">
          <text class="section-title">📞 联系方式</text>
          <view class="contact-item">
            <text class="contact-label">联系电话</text>
            <input class="form-input" v-model="formData.phone" placeholder="请输入联系电话" />
          </view>
          <view class="contact-item">
            <text class="contact-label">微信</text>
            <input class="form-input" v-model="formData.wechat" placeholder="请输入微信号（可选）" />
          </view>
          <view class="contact-item">
            <text class="contact-label">邮箱</text>
            <input class="form-input" v-model="formData.email" placeholder="请输入邮箱（可选）" />
          </view>
        </view>

      </view>

      <!-- 预览模式 -->
      <view v-else class="preview-mode-content">
        <view class="preview-placeholder">
          <text class="preview-icon">👁️</text>
          <text class="preview-title">预览模式</text>
          <text class="preview-desc">此处将展示小程序租赁介绍详情页的最终效果</text>
          <text class="preview-hint">（包含轮播图、视频、可租赁功能、套餐、价格等所有内容）</text>

          <view class="preview-sections">
            <view class="preview-section">
              <text class="preview-section-title">轮播图/Banner展示区</text>
              <view class="preview-banner">
                <text class="preview-placeholder-text">轮播图将在此处循环展示</text>
              </view>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">小程序信息区</text>
              <text class="preview-section-content">Logo + 名称 + 一句话介绍</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">视频介绍区</text>
              <text class="preview-section-content">视频播放器</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">详细介绍区（图文混排）</text>
              <text class="preview-section-content">支持图片、视频、文字混合编排</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">可租赁面板/功能区</text>
              <text class="preview-section-content">卡片列表形式展示各功能及价格</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">租赁套餐选择</text>
              <text class="preview-section-content">套餐卡片选择</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">适合场景标签</text>
              <text class="preview-section-content">标签云形式展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">租赁说明</text>
              <text class="preview-section-content">最低租期、付款方式、数据归属</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">租赁优势</text>
              <text class="preview-section-content">列表形式展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">技术支持</text>
              <text class="preview-section-content">图标 + 文字形式展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">联系按钮</text>
              <text class="preview-section-content">电话、微信、邮箱按钮</text>
            </view>
          </view>
        </view>
      </view>

    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 编辑模式/预览模式
const editMode = ref('edit')

// 表单数据
const formData = ref({
  id: '',
  name: '',
  emoji: '',
  companyName: '',
  // 轮播图
  banners: [{ image: '' }, { image: '' }, { image: '' }],
  // 基本信息
  logo: '',
  programName: '',
  tagline: '',
  // 视频
  video: '',
  // 图文介绍
  description: '',
  mediaItems: [] as any[],
  // 可租赁面板
  panels: [
    { name: '扫码点餐', description: '顾客扫码自助点餐，支持菜品分类、规格选择', price: '200' },
    { name: '外卖配送', description: '支持外卖订单、配送管理、骑手调度', price: '300' }
  ],
  // 套餐
  packageType: 'basic',
  customPackage: '',
  // 适合场景
  scenarios: ['临时活动', '短期促销'],
  customScenario: '',
  // 租赁说明
  minPeriod: '1个月',
  paymentMethod: '月付',
  dataOwnership: '租赁期间数据归租户所有，退租后可导出',
  // 优势
  advantages: [
    { content: '快速部署，即租即用' },
    { content: '无需购买，降低成本' },
    { content: '灵活租期，按需使用' }
  ],
  // 技术支持
  support: ['操作培训', '7x12小时技术支持', '免费系统维护'],
  supportDescription: '提供完整的操作培训、7x12小时技术支持、免费系统维护和定期功能更新',
  // 联系方式
  phone: '',
  wechat: '',
  email: ''
})

// 套餐选项
const packageOptions = [
  { label: '基础版', value: 'basic', desc: '核心功能，适合小型店铺' },
  { label: '标准版', value: 'standard', desc: '完整功能，适合中型店铺' },
  { label: '高级版', value: 'premium', desc: '全部功能，适合连锁店铺' },
  { label: '自定义', value: 'custom', desc: '按需选择功能模块' }
]

// 热门场景推荐
const popularScenarios = [
  '临时活动', '短期促销', '功能测试', '开业试用', '季节性经营',
  '临时营业', '展会活动', '体验使用'
]

// 技术支持选项
const supportOptions = [
  '操作培训', '7x12小时技术支持', '免费系统维护', '定期功能更新',
  '数据备份', '安全防护', '性能优化', '定制开发'
]

// 切换模式
const switchMode = (mode: string) => {
  editMode.value = mode
}

// 上传轮播图
const uploadBanner = (index: number) => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      formData.value.banners[index].image = res.tempFilePaths[0]
    }
  })
}

// 删除轮播图
const removeBanner = (index: number) => {
  formData.value.banners[index].image = ''
}

// 上传Logo
const uploadLogo = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      formData.value.logo = res.tempFilePaths[0]
    }
  })
}

// 上传视频
const uploadVideo = () => {
  uni.chooseVideo({
    success: (res) => {
      formData.value.video = res.tempFilePath
    }
  })
}

// 插入内容
const insertText = (type: string) => {
  uni.showToast({
    title: `插入${type}`,
    icon: 'none'
  })
}

// 删除媒体项
const removeMedia = (index: number) => {
  formData.value.mediaItems.splice(index, 1)
}

// 添加面板
const addPanel = () => {
  formData.value.panels.push({ name: '', description: '', price: '' })
}

// 删除面板
const removePanel = (index: number) => {
  formData.value.panels.splice(index, 1)
}

// 选择套餐
const selectPackage = (value: string) => {
  formData.value.packageType = value
}

// 切换场景
const toggleScenario = (scenario: string) => {
  const index = formData.value.scenarios.indexOf(scenario)
  if (index > -1) {
    formData.value.scenarios.splice(index, 1)
  } else {
    formData.value.scenarios.push(scenario)
  }
}

// 添加优势
const addAdvantage = () => {
  formData.value.advantages.push({ content: '' })
}

// 删除优势
const removeAdvantage = (index: number) => {
  formData.value.advantages.splice(index, 1)
}

// 切换技术支持
const toggleSupport = (support: string) => {
  const index = formData.value.support.indexOf(support)
  if (index > -1) {
    formData.value.support.splice(index, 1)
  } else {
    formData.value.support.push(support)
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 保存介绍
const saveIntro = () => {
  // 验证必填项
  if (!formData.value.description) {
    uni.showToast({
      title: '请输入小程序介绍',
      icon: 'none'
    })
    return
  }

  if (formData.value.panels.length === 0) {
    uni.showToast({
      title: '请至少添加一个可租赁功能',
      icon: 'none'
    })
    return
  }

  console.log('保存租赁介绍:', formData.value)

  uni.showToast({
    title: '保存成功',
    icon: 'success',
    success: () => {
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}
  const id = options.id

  // 根据ID获取租赁数据
  if (id === 'lease-001') {
    formData.value = {
      id: 'lease-001',
      name: '王记点餐系统',
      emoji: '🍜',
      companyName: '王记小吃店',
      banners: [{ image: '' }, { image: '' }, { image: '' }],
      logo: '',
      programName: '王记点餐系统',
      tagline: '专业餐饮点餐解决方案，即租即用',
      video: '',
      description: '王记点餐系统是一款专业的餐饮点餐小程序，支持扫码点餐、外卖配送、会员管理等功能。系统操作简单，用户体验优秀，适合各类餐饮店铺使用。租赁模式让您无需高额购买成本，按需使用，灵活租期。',
      mediaItems: [],
      panels: [
        { name: '扫码点餐', description: '顾客扫码自助点餐，支持菜品分类、规格选择、订单备注', price: '200' },
        { name: '外卖配送', description: '支持外卖订单、配送管理、骑手调度、配送费设置', price: '300' },
        { name: '会员管理', description: '会员积分、等级权益、优惠券发放', price: '150' },
        { name: '数据统计', description: '营业报表、热销菜品、客流量分析', price: '200' }
      ],
      packageType: 'standard',
      customPackage: '',
      scenarios: ['临时活动', '短期促销', '开业试用', '季节性经营'],
      customScenario: '',
      minPeriod: '1个月',
      paymentMethod: '月付',
      dataOwnership: '租赁期间数据归租户所有，退租后可导出数据',
      advantages: [
        { content: '快速部署，即租即用' },
        { content: '无需购买，降低成本' },
        { content: '功能完整，操作简单' },
        { content: '灵活租期，按需使用' },
        { content: '免费维护，省心省力' }
      ],
      support: ['操作培训', '7x12小时技术支持', '免费系统维护'],
      supportDescription: '提供完整的操作培训、7x12小时技术支持、免费系统维护和定期功能更新',
      phone: '',
      wechat: '',
      email: ''
    }
  }
})
</script>

<style scoped lang="scss">
.leasing-intro-edit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
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

    .nav-action {
      padding: 10rpx 20rpx;

      .save-text {
        font-size: 28rpx;
        color: #fff;
        font-weight: 500;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }
}

// 模式切换
.mode-toggle {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: #fff;
  border-radius: 40rpx;
  padding: 6rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 999;

  .mode-item {
    padding: 12rpx 40rpx;
    border-radius: 32rpx;
    font-size: 26rpx;
    color: #666;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      color: #fff;
      font-weight: 600;
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

// 主内容区域
.main-content {
  height: 100vh;
  padding: 20rpx 30rpx;
  padding-bottom: 40rpx;
}

// 信息卡片
.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;

  .card-emoji {
    font-size: 72rpx;
  }

  .card-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }

  .card-meta {
    font-size: 24rpx;
    color: #999;
  }
}

// 区域卡片
.section-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }

  .section-hint {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-top: 12rpx;
  }
}

// 表单项
.form-item {
  margin-bottom: 24rpx;

  .form-label {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
  }

  .form-input {
    width: 100%;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    background: #fafafa;

    &:focus {
      border-color: #ff9800;
      background: #fff;
    }
  }

  .form-textarea {
    width: 100%;
    min-height: 160rpx;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    background: #fafafa;

    &:focus {
      border-color: #ff9800;
      background: #fff;
    }
  }
}

// 轮播图上传
.banner-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  .banner-item {
    .banner-upload {
      width: 100%;
      height: 200rpx;
      border: 2rpx dashed #e5e5e5;
      border-radius: 12rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fafafa;

      .upload-icon {
        font-size: 48rpx;
        margin-bottom: 12rpx;
      }

      .banner-image {
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
      }

      .upload-hint {
        font-size: 24rpx;
        color: #999;
      }
    }

    .banner-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8rpx;

      .action-btn {
        font-size: 26rpx;
        color: #ff4d4f;
        padding: 8rpx 16rpx;
      }
    }
  }
}

// Logo上传
.logo-upload {
  width: 160rpx;
  height: 160rpx;
  border: 2rpx dashed #e5e5e5;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  margin-bottom: 24rpx;

  .upload-icon {
    font-size: 48rpx;
    margin-bottom: 8rpx;
  }

  .logo-image {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
  }

  .upload-hint {
    font-size: 22rpx;
    color: #999;
    text-align: center;
  }
}

// 视频上传
.video-upload {
  width: 100%;
  height: 200rpx;
  border: 2rpx dashed #e5e5e5;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;

  .upload-icon {
    font-size: 48rpx;
    margin-bottom: 12rpx;
  }

  .video-preview {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    border-radius: 12rpx;

    .video-icon {
      font-size: 64rpx;
    }
  }

  .upload-hint {
    font-size: 24rpx;
    color: #999;
  }
}

// 富文本编辑器
.rich-editor {
  .editor-toolbar {
    display: flex;
    gap: 16rpx;
    padding: 12rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    margin-bottom: 12rpx;

    .toolbar-btn {
      padding: 8rpx 16rpx;
      background: #fff;
      border-radius: 8rpx;
      font-size: 24rpx;
    }
  }

  .rich-textarea {
    width: 100%;
    min-height: 200rpx;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 12rpx;
    font-size: 28rpx;
    line-height: 1.6;
  }

  .char-count {
    display: block;
    text-align: right;
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
  }
}

// 媒体网格
.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin-top: 16rpx;

  .media-item {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    border-radius: 12rpx;
    overflow: hidden;

    .media-image,
    .media-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .media-video {
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;

      .play-icon {
        font-size: 48rpx;
      }
    }

    .media-remove {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      width: 40rpx;
      height: 40rpx;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 28rpx;
    }
  }
}

// 可租赁面板列表
.panel-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  .panel-item {
    background: #f8f8f8;
    border-radius: 12rpx;
    padding: 20rpx;

    .panel-header {
      display: flex;
      align-items: center;
      gap: 12rpx;
      margin-bottom: 12rpx;

      .panel-number {
        width: 40rpx;
        height: 40rpx;
        background: #ff9800;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: 600;
      }

      .panel-name-input {
        flex: 1;
        padding: 12rpx;
        background: #fff;
        border-radius: 8rpx;
        font-size: 28rpx;
      }

      .panel-remove {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ff4d4f;
        font-size: 32rpx;
      }
    }

    .panel-desc {
      width: 100%;
      min-height: 80rpx;
      padding: 12rpx;
      background: #fff;
      border-radius: 8rpx;
      font-size: 26rpx;
      margin-bottom: 12rpx;
    }

    .panel-price {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .price-label {
        font-size: 26rpx;
        color: #666;
      }

      .price-input {
        width: 120rpx;
        padding: 8rpx 12rpx;
        background: #fff;
        border-radius: 8rpx;
        font-size: 28rpx;
      }

      .price-unit {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 添加按钮
.add-btn {
  margin-top: 16rpx;
  padding: 20rpx;
  border: 1rpx dashed #ff9800;
  border-radius: 12rpx;
  text-align: center;
  color: #ff9800;
  font-size: 28rpx;
}

// 套餐选择
.package-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;

  .package-option {
    padding: 20rpx;
    border: 2rpx solid #e5e5e5;
    border-radius: 12rpx;
    text-align: center;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
    }

    .package-name {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 8rpx;
    }

    .package-desc {
      font-size: 24rpx;
      color: #999;
      display: block;
    }

    &.active {
      border-color: #ff9800;
      background: rgba(255, 152, 0, 0.1);

      .package-name {
        color: #ff9800;
      }
    }
  }
}

.custom-package {
  margin-top: 16rpx;
}

// 场景标签
.scenario-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;

  .tag-item {
    padding: 12rpx 20rpx;
    background: #f5f5f5;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    transition: all 0.3s;

    .tag-text {
      font-size: 26rpx;
      color: #666;
    }

    .tag-check {
      font-size: 20rpx;
      color: #ff9800;
    }

    &.selected {
      background: rgba(255, 152, 0, 0.15);
      border: 1rpx solid #ff9800;

      .tag-text {
        color: #ff9800;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

// 租赁说明
.terms-list {
  .term-item {
    margin-bottom: 20rpx;

    .term-label {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
    }

    .term-options {
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;

      .term-option {
        padding: 12rpx 24rpx;
        background: #f5f5f5;
        border-radius: 24rpx;
        font-size: 26rpx;
        color: #666;
        transition: all 0.3s;

        &.active {
          background: #ff9800;
          color: #fff;
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}

// 优势列表
.advantage-list {
  .advantage-item {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    margin-bottom: 16rpx;
    padding: 16rpx;
    background: #f8f8f8;
    border-radius: 12rpx;

    .advantage-number {
      width: 40rpx;
      height: 40rpx;
      background: #ff9800;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      font-weight: 600;
      flex-shrink: 0;
    }

    .advantage-input {
      flex: 1;
      min-height: 40rpx;
      padding: 8rpx 12rpx;
      background: #fff;
      border-radius: 8rpx;
      font-size: 28rpx;
    }

    .advantage-remove {
      width: 40rpx;
      color: #ff4d4f;
      font-size: 32rpx;
      text-align: center;
    }
  }
}

// 技术支持网格
.support-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
  margin-bottom: 16rpx;

  .support-checkbox {
    padding: 16rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
    }

    .checkbox-icon {
      width: 36rpx;
      height: 36rpx;
      border: 2rpx solid #e5e5e5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20rpx;
      color: #fff;
    }

    .checkbox-label {
      flex: 1;
      font-size: 26rpx;
      color: #666;
    }

    &.selected {
      border-color: #ff9800;
      background: rgba(255, 152, 0, 0.1);

      .checkbox-icon {
        background: #ff9800;
        border-color: #ff9800;
      }

      .checkbox-label {
        color: #ff9800;
      }
    }
  }
}

// 联系方式
.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;

  .contact-label {
    width: 140rpx;
    font-size: 28rpx;
    color: #666;
  }

  .form-input {
    flex: 1;
  }
}

// 预览模式
.preview-mode-content {
  .preview-placeholder {
    background: #fff;
    border-radius: 16rpx;
    padding: 60rpx 40rpx;
    text-align: center;

    .preview-icon {
      font-size: 96rpx;
      display: block;
      margin-bottom: 20rpx;
    }

    .preview-title {
      font-size: 40rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 16rpx;
    }

    .preview-desc {
      font-size: 28rpx;
      color: #666;
      display: block;
      margin-bottom: 12rpx;
    }

    .preview-hint {
      font-size: 24rpx;
      color: #999;
      display: block;
      margin-bottom: 40rpx;
    }

    .preview-sections {
      text-align: left;

      .preview-section {
        background: #f8f8f8;
        border-radius: 12rpx;
        padding: 24rpx;
        margin-bottom: 16rpx;

        .preview-section-title {
          font-size: 28rpx;
          font-weight: 600;
          color: #ff9800;
          display: block;
          margin-bottom: 12rpx;
        }

        .preview-section-content {
          font-size: 26rpx;
          color: #666;
          display: block;
        }

        .preview-banner {
          height: 160rpx;
          background: #e5e5e5;
          border-radius: 8rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .preview-placeholder-text {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
