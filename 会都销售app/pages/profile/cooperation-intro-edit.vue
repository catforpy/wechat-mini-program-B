<template>
  <view class="cooperation-intro-edit-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">编辑合作介绍</text>
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
          <text class="section-hint">建议时长：30-90秒，展示小程序功能和合作模式</text>
        </view>

        <!-- 详细介绍 -->
        <view class="section-card">
          <text class="section-title">📝 小程序介绍</text>
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
              placeholder="请输入小程序的详细介绍..."
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

        <!-- 合作方式 -->
        <view class="section-card">
          <text class="section-title">🤝 合作方式</text>
          <view class="cooperation-type-selector">
            <view
              v-for="type in cooperationTypes"
              :key="type.value"
              class="type-option"
              :class="{ active: formData.cooperationType === type.value }"
              @tap="selectCooperationType(type.value)"
            >
              <text class="type-icon">{{ type.icon }}</text>
              <text class="type-label">{{ type.label }}</text>
              <text class="type-desc">{{ type.desc }}</text>
            </view>
          </view>
        </view>

        <!-- 合作内容说明 -->
        <view class="section-card">
          <text class="section-title">📋 合作内容</text>
          <view class="content-list">
            <view
              v-for="(content, index) in formData.cooperationContent"
              :key="index"
              class="content-item"
            >
              <text class="content-number">{{ index + 1 }}</text>
              <textarea
                v-model="content.text"
                class="content-textarea"
                placeholder="说明合作的具体内容"
                maxlength="200"
              ></textarea>
              <text class="content-remove" @tap="removeContent(index)">×</text>
            </view>
          </view>
          <view class="add-btn" @tap="addContent">
            <text>+ 添加合作内容</text>
          </view>
        </view>

        <!-- 适合伙伴 -->
        <view class="section-card">
          <text class="section-title">🏢 适合合作伙伴</text>
          <view class="partner-tags">
            <view
              v-for="partner in popularPartners"
              :key="partner"
              class="tag-item"
              :class="{ selected: formData.targetPartners.includes(partner) }"
              @tap="togglePartner(partner)"
            >
              <text class="tag-text">{{ partner }}</text>
              <text v-if="formData.targetPartners.includes(partner)" class="tag-check">✓</text>
            </view>
          </view>
          <textarea
            v-model="formData.customPartner"
            class="form-textarea"
            placeholder="或输入其他适合的合作伙伴..."
            maxlength="200"
          ></textarea>
        </view>

        <!-- 分成比例设置 -->
        <view class="section-card">
          <text class="section-title">💰 分成比例设置</text>
          <view class="ratio-preset">
            <text
              v-for="ratio in [20, 30, 40, 50, 60, 70]"
              :key="ratio"
              class="ratio-option"
              :class="{ active: formData.shareRatio === String(ratio) }"
              @tap="formData.shareRatio = String(ratio)"
            >{{ ratio }}%</text>
          </view>
          <view class="ratio-custom">
            <text class="ratio-label">自定义比例：</text>
            <input
              v-model="formData.shareRatio"
              class="ratio-input"
              type="digit"
              placeholder="输入比例"
            />
            <text class="ratio-unit">%</text>
          </view>
        </view>

        <!-- 结算说明 -->
        <view class="section-card">
          <text class="section-title">💳 结算说明</text>
          <view class="settlement-options">
            <view
              v-for="option in settlementOptions"
              :key="option.value"
              class="settlement-option"
              :class="{ active: formData.settlementType === option.value }"
              @tap="formData.settlementType = option.value"
            >
              <text class="settlement-label">{{ option.label }}</text>
            </view>
          </view>
          <textarea
            v-model="formData.settlementDescription"
            class="form-textarea"
            placeholder="详细说明结算方式和周期"
            maxlength="300"
          ></textarea>
        </view>

        <!-- 合作优势 -->
        <view class="section-card">
          <text class="section-title">✨ 合作优势</text>
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

        <!-- 合作要求 -->
        <view class="section-card">
          <text class="section-title">📝 合作要求</text>
          <view class="requirement-list">
            <view
              v-for="(req, index) in formData.requirements"
              :key="index"
              class="requirement-item"
            >
              <text class="req-number">{{ index + 1 }}</text>
              <textarea
                v-model="req.content"
                class="req-textarea"
                placeholder="说明对合作伙伴的要求"
                maxlength="150"
              ></textarea>
              <text class="req-remove" @tap="removeRequirement(index)">×</text>
            </view>
          </view>
          <view class="add-btn" @tap="addRequirement">
            <text>+ 添加要求</text>
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
          <text class="preview-desc">此处将展示小程序合作介绍详情页的最终效果</text>
          <text class="preview-hint">（包含轮播图、视频、合作方式、分成比例、结算说明等所有内容）</text>

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
              <text class="preview-section-title">合作方式选择</text>
              <text class="preview-section-content">卡片形式展示不同合作模式</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">合作内容说明</text>
              <text class="preview-section-content">列表形式展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">适合合作伙伴标签</text>
              <text class="preview-section-content">标签云形式展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">分成比例设置</text>
              <text class="preview-section-content">醒目展示比例</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">结算说明</text>
              <text class="preview-section-content">结算方式和周期</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">合作优势</text>
              <text class="preview-section-content">列表形式展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">合作要求</text>
              <text class="preview-section-content">列表形式展示</text>
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

// 合作方式选项
const cooperationTypes = [
  { label: '利润分成', value: 'profit', icon: '💰', desc: '按收益比例分成' },
  { label: '推广合作', value: 'promotion', icon: '📢', desc: '负责推广运营' },
  { label: '运营合作', value: 'operation', icon: '⚙️', desc: '负责日常运营' },
  { label: '开发合作', value: 'development', icon: '👨‍💻', desc: '技术联合开发' },
  { label: '内容合作', value: 'content', icon: '📝', desc: '内容创作供应' }
]

// 热门合作伙伴推荐
const popularPartners = [
  '渠道商', '内容创作者', '电商卖家', '社交媒体博主',
  '电商平台', '服务商', '企业用户', '开发者'
]

// 结算选项
const settlementOptions = [
  { label: '按月结算', value: 'monthly' },
  { label: '按季结算', value: 'quarterly' },
  { label: '按年结算', value: 'yearly' },
  { label: '实时结算', value: 'realtime' }
]

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
  // 合作
  cooperationType: 'profit',
  cooperationContent: [
    { text: '合作伙伴负责推广和运营' },
    { text: '我方提供技术和产品支持' }
  ],
  targetPartners: ['渠道商', '内容创作者'],
  customPartner: '',
  shareRatio: '30',
  settlementType: 'monthly',
  settlementDescription: '每月5号结算上月收益',
  // 优势
  advantages: [
    { content: '产品成熟，稳定可靠' },
    { content: '分成比例合理，收益可观' },
    { content: '技术支持完善，运营无忧' }
  ],
  // 要求
  requirements: [
    { content: '具备一定的销售渠道或客户资源' },
    { content: '认同产品理念和合作模式' }
  ],
  // 联系方式
  phone: '',
  wechat: '',
  email: ''
})

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

// 选择合作方式
const selectCooperationType = (type: string) => {
  formData.value.cooperationType = type
}

// 添加合作内容
const addContent = () => {
  formData.value.cooperationContent.push({ text: '' })
}

// 删除合作内容
const removeContent = (index: number) => {
  formData.value.cooperationContent.splice(index, 1)
}

// 切换合作伙伴
const togglePartner = (partner: string) => {
  const index = formData.value.targetPartners.indexOf(partner)
  if (index > -1) {
    formData.value.targetPartners.splice(index, 1)
  } else {
    formData.value.targetPartners.push(partner)
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

// 添加要求
const addRequirement = () => {
  formData.value.requirements.push({ content: '' })
}

// 删除要求
const removeRequirement = (index: number) => {
  formData.value.requirements.splice(index, 1)
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

  if (!formData.value.cooperationType) {
    uni.showToast({
      title: '请选择合作方式',
      icon: 'none'
    })
    return
  }

  console.log('保存合作介绍:', formData.value)

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

  // 根据ID获取合作数据
  if (id === 'coop-001') {
    formData.value = {
      id: 'coop-001',
      name: '优选商城系统',
      emoji: '🛒',
      companyName: '优选商城',
      banners: [{ image: '' }, { image: '' }, { image: '' }],
      logo: '',
      programName: '优选商城系统',
      tagline: '功能完善的电商小程序，合作共赢',
      video: '',
      description: '优选商城系统是一款功能完善的电商小程序，支持商品展示、在线交易、订单管理、会员系统等功能。系统稳定可靠，用户体验优秀，适合各类商家使用。我们诚邀合作伙伴加入，共创商业价值。',
      mediaItems: [],
      cooperationType: 'profit',
      cooperationContent: [
        { text: '合作伙伴负责推广和运营，获取客户资源' },
        { text: '我方提供完整的技术支持和产品维护' },
        { text: '双方按照约定比例分成收益，合作期限灵活' },
        { text: '共享市场资源，互利共赢' }
      ],
      targetPartners: ['渠道商', '电商平台', '内容创作者', '社交媒体博主', '电商服务商'],
      customPartner: '',
      shareRatio: '30',
      settlementType: 'monthly',
      settlementDescription: '每月5号结算上月收益，通过银行转账方式支付，提供详细的收益报表',
      advantages: [
        { content: '产品成熟，稳定可靠' },
        { content: '分成比例合理，收益可观' },
        { content: '技术支持完善，运营无忧' },
        { content: '灵活合作，风险共担' },
        { content: '资源共享，互利共赢' }
      ],
      requirements: [
        { content: '具备一定的销售渠道或客户资源' },
        { content: '认同产品理念和合作模式' },
        { content: '积极推广，配合运营' },
        { content: '遵守合作协议和规则' }
      ],
      phone: '',
      wechat: '',
      email: ''
    }
  }
})
</script>

<style scoped lang="scss">
.cooperation-intro-edit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
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
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
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
      border-color: #4caf50;
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
      border-color: #4caf50;
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

// 合作方式选择器
.cooperation-type-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;

  .type-option {
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 12rpx;
    text-align: center;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
    }

    .type-icon {
      font-size: 36rpx;
      display: block;
      margin-bottom: 8rpx;
    }

    .type-label {
      font-size: 26rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 4rpx;
    }

    .type-desc {
      font-size: 22rpx;
      color: #999;
      display: block;
    }

    &.active {
      border-color: #4caf50;
      background: rgba(76, 175, 80, 0.1);

      .type-label {
        color: #4caf50;
      }
    }
  }
}

// 合作内容列表
.content-list {
  .content-item {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    margin-bottom: 16rpx;
    padding: 16rpx;
    background: #f8f8f8;
    border-radius: 12rpx;

    .content-number {
      width: 40rpx;
      height: 40rpx;
      background: #4caf50;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      font-weight: 600;
      flex-shrink: 0;
    }

    .content-textarea {
      flex: 1;
      min-height: 40rpx;
      padding: 8rpx 12rpx;
      background: #fff;
      border-radius: 8rpx;
      font-size: 28rpx;
    }

    .content-remove {
      width: 40rpx;
      color: #ff4d4f;
      font-size: 32rpx;
      text-align: center;
    }
  }
}

// 添加按钮
.add-btn {
  margin-top: 16rpx;
  padding: 20rpx;
  border: 1rpx dashed #4caf50;
  border-radius: 12rpx;
  text-align: center;
  color: #4caf50;
  font-size: 28rpx;
}

// 合作伙伴标签
.partner-tags {
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
      color: #4caf50;
    }

    &.selected {
      background: rgba(76, 175, 80, 0.15);
      border: 1rpx solid #4caf50;

      .tag-text {
        color: #4caf50;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

// 分成比例预设
.ratio-preset {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;

  .ratio-option {
    padding: 12rpx 24rpx;
    background: #f5f5f5;
    border-radius: 24rpx;
    font-size: 26rpx;
    color: #666;
    transition: all 0.3s;

    &.active {
      background: #4caf50;
      color: #fff;
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.ratio-custom {
  display: flex;
  align-items: center;
  gap: 12rpx;

  .ratio-label {
    font-size: 28rpx;
    color: #666;
  }

  .ratio-input {
    flex: 1;
    padding: 12rpx;
    background: #fafafa;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    font-size: 28rpx;
  }

  .ratio-unit {
    font-size: 28rpx;
    color: #4caf50;
    font-weight: 600;
  }
}

// 结算选项
.settlement-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;

  .settlement-option {
    padding: 12rpx 24rpx;
    background: #f5f5f5;
    border-radius: 24rpx;
    font-size: 26rpx;
    color: #666;
    transition: all 0.3s;

    &.active {
      background: #4caf50;
      color: #fff;
    }

    &:active {
      transform: scale(0.95);
    }

    .settlement-label {
      font-size: 26rpx;
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
      background: #4caf50;
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

// 要求列表
.requirement-list {
  .requirement-item {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    margin-bottom: 16rpx;
    padding: 16rpx;
    background: #f8f8f8;
    border-radius: 12rpx;

    .req-number {
      width: 40rpx;
      height: 40rpx;
      background: #999;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      font-weight: 600;
      flex-shrink: 0;
    }

    .req-textarea {
      flex: 1;
      min-height: 40rpx;
      padding: 8rpx 12rpx;
      background: #fff;
      border-radius: 8rpx;
      font-size: 28rpx;
    }

    .req-remove {
      width: 40rpx;
      color: #ff4d4f;
      font-size: 32rpx;
      text-align: center;
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
          color: #4caf50;
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
