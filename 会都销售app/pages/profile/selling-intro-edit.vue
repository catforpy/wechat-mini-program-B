<template>
  <view class="selling-intro-edit-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">编辑销售介绍</text>
        <view class="nav-action" @tap="saveIntro">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 小程序基本信息 -->
      <view class="info-card">
        <text class="card-emoji">{{ formData.emoji }}</text>
        <text class="card-title">{{ formData.name }}</text>
        <text class="card-meta">{{ formData.companyName }}</text>
      </view>

      <!-- 预览切换 -->
      <view class="preview-toggle">
        <view
          class="toggle-item"
          :class="{ active: editMode === 'edit' }"
          @tap="editMode = 'edit'"
        >
          <text class="toggle-text">编辑模式</text>
        </view>
        <view
          class="toggle-item"
          :class="{ active: editMode === 'preview' }"
          @tap="editMode = 'preview'"
        >
          <text class="toggle-text">预览模式</text>
        </view>
      </view>

      <!-- 编辑模式 -->
      <view v-if="editMode === 'edit'" class="edit-mode-content">

        <!-- 轮播图管理 -->
        <view class="section-card">
          <view class="section-header">
            <text class="section-title">🖼️ 轮播图/Banner</text>
            <view class="add-btn-small" @tap="addBanner">
              <text class="add-btn-text">+ 添加</text>
            </view>
          </view>
          <scroll-view class="banner-scroll" scroll-x>
            <view class="banner-list">
              <view v-for="(banner, index) in formData.banners" :key="index" class="banner-item">
                <image v-if="banner.image" :src="banner.image" class="banner-img" mode="aspectFill" />
                <view v-else class="banner-placeholder" @tap="chooseBanner(index)">
                  <text class="placeholder-icon">+</text>
                  <text class="placeholder-text">添加图片</text>
                </view>
                <view class="banner-delete" @tap.stop="deleteBanner(index)">
                  <text class="delete-icon">×</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 小程序基本信息 -->
        <view class="section-card">
          <text class="section-title">📱 基本信息</text>
          <view class="form-item">
            <text class="form-label">小程序Logo</text>
            <view class="logo-upload" @tap="chooseLogo">
              <image v-if="formData.logo" :src="formData.logo" class="logo-img" />
              <view v-else class="upload-placeholder">
                <text class="upload-icon">+</text>
                <text class="upload-text">上传Logo</text>
              </view>
            </view>
          </view>
          <view class="form-item">
            <text class="form-label">小程序名称</text>
            <input class="form-input" v-model="formData.programName" placeholder="请输入小程序名称" />
          </view>
          <view class="form-item">
            <text class="form-label">一句话介绍</text>
            <input class="form-input" v-model="formData.tagline" placeholder="一句话描述小程序的核心价值" />
          </view>
        </view>

        <!-- 视频介绍 -->
        <view class="section-card">
          <text class="section-title">🎬 视频介绍</text>
          <view class="video-upload" @tap="chooseVideo">
            <video v-if="formData.video" :src="formData.video" class="video-preview" object-fit="contain" />
            <view v-else class="video-placeholder">
              <text class="video-icon">🎥</text>
              <text class="video-text">点击上传介绍视频</text>
              <text class="video-hint">建议时长：30秒-2分钟</text>
            </view>
            <view v-if="formData.video" class="video-delete" @tap.stop="deleteVideo">
              <text class="delete-text">删除视频</text>
            </view>
          </view>
        </view>

        <!-- 图文介绍 -->
        <view class="section-card">
          <text class="section-title">📝 详细介绍</text>
          <view class="rich-editor">
            <view class="editor-toolbar">
              <view class="toolbar-btn" @tap="insertImage">
                <text class="toolbar-icon">🖼️</text>
              </view>
              <view class="toolbar-btn" @tap="insertVideo">
                <text class="toolbar-icon">🎥</text>
              </view>
              <view class="toolbar-btn" @tap="insertText">
                <text class="toolbar-icon">📝</text>
              </view>
            </view>
            <textarea
              v-model="formData.description"
              class="rich-textarea"
              placeholder="请输入小程序的详细介绍，支持插入图片和视频..."
            ></textarea>
            <!-- 插入的媒体预览 -->
            <view v-if="formData.mediaItems.length > 0" class="media-preview">
              <view v-for="(media, index) in formData.mediaItems" :key="index" class="media-item">
                <image v-if="media.type === 'image'" :src="media.url" class="media-content" mode="aspectFill" />
                <video v-if="media.type === 'video'" :src="media.url" class="media-content" />
                <view class="media-delete" @tap="deleteMedia(index)">
                  <text class="delete-icon">×</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 经营情况 -->
        <view class="section-card">
          <text class="section-title">📊 经营情况</text>
          <view class="stats-upload" @tap="addStatsImage">
            <text class="stats-label">数据图表</text>
            <scroll-view class="stats-scroll" scroll-x>
              <view class="stats-list">
                <view v-for="(stats, index) in formData.statsImages" :key="index" class="stats-item">
                  <image :src="stats" class="stats-img" mode="aspectFill" />
                  <view class="stats-delete" @tap.stop="deleteStatsImage(index)">
                    <text class="delete-icon">×</text>
                  </view>
                </view>
                <view class="add-stats-btn" @tap.stop="addStatsImage">
                  <text class="add-icon">+</text>
                </view>
              </view>
            </scroll-view>
          </view>
          <textarea
            v-model="formData.businessStatus"
            class="form-textarea"
            placeholder="请用文字描述小程序的经营情况，如用户数量、活跃度、收入情况等"
            maxlength="300"
          ></textarea>
        </view>

        <!-- 购买资质要求 -->
        <view class="section-card">
          <text class="section-title">📋 购买资质要求</text>
          <view class="requirement-list">
            <view
              v-for="(req, index) in formData.qualifications"
              :key="index"
              class="requirement-item"
            >
              <view class="req-icon">{{ getQualificationIcon(req.type) }}</view>
              <input class="req-input" v-model="req.content" placeholder="资质要求内容" />
              <view class="req-delete" @tap="deleteQualification(index)">
                <text class="delete-icon">×</text>
              </view>
            </view>
            <view class="add-req-btn" @tap="addQualification">
              <text class="add-text">+ 添加资质要求</text>
            </view>
          </view>
        </view>

        <!-- 适合行业 -->
        <view class="section-card">
          <text class="section-title">🏢 适合行业</text>
          <view class="industry-tags">
            <view
              v-for="(industry, index) in formData.industries"
              :key="index"
              class="industry-tag"
            >
              <text class="tag-text">{{ industry }}</text>
              <text class="tag-delete" @tap.stop="deleteIndustry(index)">×</text>
            </view>
          </view>
          <view class="industry-input">
            <input
              class="industry-input-field"
              v-model="newIndustry"
              placeholder="输入适合行业后回车添加"
              @confirm="addIndustry"
            />
          </view>
          <view class="suggestion-tags">
            <text class="suggestion-label">热门推荐:</text>
            <text
              v-for="industry in popularIndustries"
              :key="industry"
              class="suggestion-tag"
              @tap="addIndustryByName(industry)"
            >
              {{ industry }}
            </text>
          </view>
        </view>

        <!-- 销售价格 -->
        <view class="section-card">
          <text class="section-title">💰 销售价格</text>
          <view class="price-config">
            <view class="price-input-wrapper">
              <text class="price-symbol">¥</text>
              <input
                class="price-input"
                v-model="formData.price"
                type="digit"
                placeholder="请输入销售价格"
              />
            </view>
            <view class="price-options">
              <view
                v-for="option in priceOptions"
                :key="option"
                class="price-option"
                :class="{ selected: formData.price === option }"
                @tap="formData.price = option"
              >
                <text class="option-text">¥{{ option }}</text>
              </view>
            </view>
          </view>
          <view class="price-note">
            <text class="note-text">💡 提示：价格设置建议根据小程序功能、市场定位等因素综合考虑</text>
          </view>
        </view>

        <!-- 核心优势 -->
        <view class="section-card">
          <text class="section-title">✨ 核心优势</text>
          <view class="advantage-list">
            <view
              v-for="(adv, index) in formData.advantages"
              :key="index"
              class="advantage-item"
            >
              <view class="adv-number">{{ index + 1 }}</view>
              <textarea
                class="adv-input"
                v-model="adv.content"
                placeholder="描述核心优势"
              />
              <view class="adv-delete" @tap="deleteAdvantage(index)">
                <text class="delete-icon">×</text>
              </view>
            </view>
            <view class="add-adv-btn" @tap="addAdvantage">
              <text class="add-text">+ 添加优势</text>
            </view>
          </view>
        </view>

        <!-- 技术支持 & 售后服务 -->
        <view class="section-card">
          <text class="section-title">🛠️ 技术支持 & 售后服务</text>

          <view class="support-item">
            <text class="support-label">技术支持内容</text>
            <view class="checkbox-group">
              <view
                v-for="support in supportOptions"
                :key="support"
                class="checkbox-item"
                :class="{ selected: formData.support.includes(support) }"
                @tap="toggleSupport(support)"
              >
                <text class="checkbox-icon">{{ formData.support.includes(support) ? '✓' : '' }}</text>
                <text class="checkbox-label">{{ support }}</text>
              </view>
            </view>
          </view>

          <view class="form-item">
            <text class="form-label">支持说明</text>
            <textarea
              v-model="formData.supportDescription"
              class="form-textarea"
              placeholder="详细说明技术支持和售后服务内容"
              maxlength="300"
            ></textarea>
          </view>

          <view class="form-item">
            <text class="form-label">服务期限</text>
            <input class="form-input" v-model="formData.servicePeriod" placeholder="如：1年免费、终身免费更新" />
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
        <!-- 预览页面将展示类似"我的宝库"中的介绍详情页 -->
        <view class="preview-placeholder">
          <text class="preview-icon">👁️</text>
          <text class="preview-title">预览模式</text>
          <text class="preview-desc">此处将展示小程序介绍详情页的最终效果</text>
          <text class="preview-hint">（包含轮播图、视频、图文混排、资质要求、价格等所有内容）</text>

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
              <text class="preview-section-title">经营数据图表区</text>
              <text class="preview-section-content">数据图表展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">购买资质要求</text>
              <text class="preview-section-content">图标 + 文字形式展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">适合行业标签</text>
              <text class="preview-section-content">标签云形式展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">销售价格</text>
              <text class="preview-section-content">醒目展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">核心优势</text>
              <text class="preview-section-content">列表形式展示</text>
            </view>

            <view class="preview-section">
              <text class="preview-section-title">技术支持 & 售后服务</text>
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
  // 经营情况
  businessStatus: '',
  statsImages: [] as string[],
  // 资质要求
  qualifications: [
    { type: 'license', content: '企业营业执照（必须）' },
    { type: 'icp', content: 'ICP备案许可证' },
    { type: 'broadcast', content: '广播电视节目制作经营许可证（如涉及直播内容）' }
  ],
  // 适合行业
  industries: ['教育培训', '在线活动'],
  // 价格
  price: '5000',
  // 核心优势
  advantages: [
    { content: '技术成熟，系统稳定' },
    { content: '支持高并发，万人同时在线' },
    { content: '功能丰富，互动性强' }
  ],
  // 技术支持
  support: ['技术文档', '安装指导', '操作培训', '7x12小时技术支持'],
  supportDescription: '',
  servicePeriod: '1年免费技术支持和系统维护，终身免费更新升级',
  // 联系方式
  phone: '',
  wechat: '',
  email: ''
})

// 价格预设选项
const priceOptions = ['2999', '3999', '4999', '5999', '9999']

// 热门行业推荐
const popularIndustries = [
  '教育培训', '在线活动', '电商', '内容创作', '直播', '社交',
  '企业服务', '医疗', '金融', '旅游', '本地生活'
]

// 新增行业输入
const newIndustry = ref('')

// 资质类型图标
const getQualificationIcon = (type: string) => {
  const icons: Record<string, string> = {
    license: '📄',
    icp: '📜',
    broadcast: '📺',
    food: '🍜',
    medical: '🏥',
    drug: '💊'
  }
  return icons[type] || '📋'
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 轮播图相关
const addBanner = () => {
  formData.value.banners.push({ image: '' })
}

const chooseBanner = (index: number) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.banners[index].image = res.tempFilePaths[0]
    }
  })
}

const deleteBanner = (index: number) => {
  formData.value.banners.splice(index, 1)
}

// Logo上传
const chooseLogo = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.logo = res.tempFilePaths[0]
    }
  })
}

// 视频相关
const chooseVideo = () => {
  uni.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 120,
    success: (res) => {
      formData.value.video = res.tempFilePath
    }
  })
}

const deleteVideo = () => {
  formData.value.video = ''
}

// 富文本编辑器
const insertImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      formData.value.mediaItems.push({
        type: 'image',
        url: res.tempFilePaths[0]
      })
    }
  })
}

const insertVideo = () => {
  uni.chooseVideo({
    success: (res) => {
      formData.value.mediaItems.push({
        type: 'video',
        url: res.tempFilePath
      })
    }
  })
}

const insertText = () => {
  // 打开文字输入弹窗
  uni.showModal({
    title: '添加文字',
    editable: true,
    placeholderText: '请输入文字内容',
    success: (res) => {
      if (res.confirm && res.content) {
        formData.value.description += res.content + '\n'
      }
    }
  })
}

const deleteMedia = (index: number) => {
  formData.value.mediaItems.splice(index, 1)
}

// 经营数据图表
const addStatsImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      formData.value.statsImages.push(res.tempFilePaths[0])
    }
  })
}

const deleteStatsImage = (index: number) => {
  formData.value.statsImages.splice(index, 1)
}

// 资质要求
const addQualification = () => {
  uni.showActionSheet({
    itemList: ['企业营业执照', 'ICP备案许可证', '广播电视节目制作经营许可证', '食品经营许可证', '医疗器械经营许可证', '药品经营许可证'],
    success: (res) => {
      if (res.tapIndex >= 0) {
        const types = ['license', 'icp', 'broadcast', 'food', 'medical', 'drug']
        formData.value.qualifications.push({
          type: types[res.tapIndex],
          content: ''
        })
      }
    }
  })
}

const deleteQualification = (index: number) => {
  formData.value.qualifications.splice(index, 1)
}

// 行业标签
const addIndustry = () => {
  if (newIndustry.value.trim()) {
    formData.value.industries.push(newIndustry.value.trim())
    newIndustry.value = ''
  }
}

const addIndustryByName = (industry: string) => {
  if (!formData.value.industries.includes(industry)) {
    formData.value.industries.push(industry)
  }
}

const deleteIndustry = (index: number) => {
  formData.value.industries.splice(index, 1)
}

// 核心优势
const addAdvantage = () => {
  formData.value.advantages.push({ content: '' })
}

const deleteAdvantage = (index: number) => {
  formData.value.advantages.splice(index, 1)
}

// 技术支持选项
const supportOptions = [
  '技术文档',
  '安装部署指导',
  '操作培训',
  '7x12小时技术支持',
  '免费系统维护',
  '定期功能更新'
]

const toggleSupport = (support: string) => {
  const index = formData.value.support.indexOf(support)
  if (index > -1) {
    formData.value.support.splice(index, 1)
  } else {
    formData.value.support.push(support)
  }
}

// 保存介绍
const saveIntro = () => {
  // 验证必填项
  if (!formData.value.programName) {
    uni.showToast({
      title: '请输入小程序名称',
      icon: 'none'
    })
    return
  }

  if (!formData.value.description) {
    uni.showToast({
      title: '请输入详细介绍',
      icon: 'none'
    })
    return
  }

  if (formData.value.qualifications.length === 0) {
    uni.showToast({
      title: '请添加至少一项资质要求',
      icon: 'none'
    })
    return
  }

  if (!formData.value.price) {
    uni.showToast({
      title: '请输入销售价格',
      icon: 'none'
    })
    return
  }

  // 保存逻辑（这里需要调用API）
  console.log('保存销售介绍:', formData.value)

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

  // 根据ID获取数据（模拟数据）
  if (id === 'sell-001') {
    formData.value = {
      id: 'sell-001',
      name: '太湖直播',
      emoji: '📺',
      companyName: '太湖学院',
      banners: [
        { image: '' },
        { image: '' },
        { image: '' }
      ],
      logo: '',
      programName: '太湖直播系统',
      tagline: '专业的直播互动解决方案',
      video: '',
      description: '太湖直播系统是一款专业的直播互动平台，支持多人实时音视频互动，适用于教育培训、企业会议、在线活动等多种场景。\n\n\n系统采用先进的音视频编解码技术，确保高清流畅的直播体验。同时提供丰富的互动功能，包括弹幕、礼物、连麦、红包等，有效提升用户参与度。',
      mediaItems: [],
      businessStatus: '目前已有12家客户购买使用，系统运行稳定，用户反馈良好。月均活跃用户超过5000人。',
      statsImages: [],
      qualifications: [
        { type: 'license', content: '企业营业执照（必须）' },
        { type: 'icp', content: 'ICP备案许可证' },
        { type: 'broadcast', content: '广播电视节目制作经营许可证（如涉及直播内容）' }
      ],
      industries: ['教育培训', '企业内训', '在线活动'],
      price: '5000',
      advantages: [
        { content: '技术成熟，系统稳定可靠' },
        { content: '支持高并发，万人同时在线' },
        { content: '功能丰富，互动性强' },
        { content: '界面美观，用户体验好' },
        { content: '快速部署，3天内即可上线' }
      ],
      support: ['技术文档', '安装部署指导', '操作培训', '7x12小时技术支持'],
      supportDescription: '我们提供完整的技术文档、一对一的安装部署指导、专业的操作培训，以及7x12小时的技术支持服务。',
      servicePeriod: '1年免费技术支持和系统维护，终身免费更新升级',
      phone: '',
      wechat: '',
      email: ''
    }
  }
})
</script>

<style scoped lang="scss">
.selling-intro-edit-page {
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
      font-size: 32rpx;
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

// 预览切换
.preview-toggle {
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  .toggle-item {
    flex: 1;
    padding: 16rpx;
    text-align: center;
    border-radius: 8rpx;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
    }

    .toggle-text {
      font-size: 26rpx;
      color: #666;
    }

    &.active {
      background: #667eea;

      .toggle-text {
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

// 区块卡片通用样式
.section-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .section-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .add-btn-small {
      padding: 8rpx 16rpx;
      background: #667eea;
      border-radius: 8rpx;

      &:active {
        opacity: 0.8;
      }

      .add-btn-text {
        font-size: 22rpx;
        color: #fff;
      }
    }
  }
}

// 轮播图管理
.banner-scroll {
  width: 100%;
  white-space: nowrap;

  .banner-list {
    display: inline-flex;
    gap: 16rpx;

    .banner-item {
      position: relative;
      width: 240rpx;
      height: 180rpx;
      flex-shrink: 0;
      border-radius: 12rpx;
      overflow: hidden;

      .banner-img {
        width: 100%;
        height: 100%;
      }

      .banner-placeholder {
        width: 100%;
        height: 100%;
        background: #f5f5f5;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8rpx;

        .placeholder-icon {
          font-size: 48rpx;
          color: #ccc;
        }

        .placeholder-text {
          font-size: 22rpx;
          color: #999;
        }
      }

      .banner-delete {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 32rpx;
        height: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;

        .delete-icon {
          font-size: 24rpx;
          color: #fff;
        }
      }
    }
  }
}

// 表单项
.form-item {
  margin-bottom: 24rpx;

  .form-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 12rpx;
    display: block;
  }

  .form-input {
    width: 100%;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    background: #fff;
  }

  .form-textarea {
    width: 100%;
    min-height: 180rpx;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    background: #fff;
  }
}

// Logo上传
.logo-upload {
  width: 120rpx;
  height: 120rpx;
  border: 2rpx dashed #e5e5e5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo-img {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;

    .upload-icon {
      font-size: 40rpx;
      color: #ccc;
    }

    .upload-text {
      font-size: 20rpx;
      color: #999;
    }
  }
}

// 视频上传
.video-upload {
  position: relative;
  width: 100%;
  height: 400rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #f5f5f5;

  .video-preview {
    width: 100%;
    height: 100%;
  }

  .video-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .video-icon {
      font-size: 80rpx;
      margin-bottom: 16rpx;
    }

    .video-text {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 8rpx;
    }

    .video-hint {
      font-size: 22rpx;
      color: #999;
    }
  }

  .video-delete {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    padding: 8rpx 16rpx;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8rpx;

    .delete-text {
      font-size: 22rpx;
      color: #fff;
    }
  }
}

// 富文本编辑器
.rich-editor {
  .editor-toolbar {
    display: flex;
    gap: 12rpx;
    padding: 12rpx;
    background: #f8f8f8;
    border-radius: 8rpx 8rpx 0 8rpx;
    margin-bottom: 0;

    .toolbar-btn {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-radius: 8rpx;

      &:active {
        background: #e8e8e8;
      }

      .toolbar-icon {
        font-size: 28rpx;
      }
    }
  }

  .rich-textarea {
    width: 100%;
    min-height: 300rpx;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 0 0 8rpx 8rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    background: #fff;
  }

  .media-preview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;
    margin-top: 16rpx;

    .media-item {
      position: relative;
      width: 100%;
      height: 200rpx;
      border-radius: 8rpx;
      overflow: hidden;

      .media-content {
        width: 100%;
        height: 100%;
      }

      .media-delete {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 28rpx;
        height: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;

        .delete-icon {
          font-size: 20rpx;
          color: #fff;
        }
      }
    }
  }
}

// 经营数据图表
.stats-upload {
  .stats-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 16rpx;
  }

  .stats-scroll {
    width: 100%;
    white-space: nowrap;

    .stats-list {
      display: inline-flex;
      gap: 16rpx;

      .stats-item {
        position: relative;
        width: 200rpx;
        height: 150rpx;
        flex-shrink: 0;
        border-radius: 8rpx;
        overflow: hidden;

        .stats-img {
          width: 100%;
          height: 100%;
        }

        .stats-delete {
          position: absolute;
          top: 8rpx;
          right: 8rpx;
          width: 28rpx;
          height: 28rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 50%;

          .delete-icon {
            font-size: 20rpx;
            color: #fff;
          }
        }
      }

      .add-stats-btn {
        width: 200rpx;
        height: 150rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border: 2rpx dashed #667eea;
        border-radius: 8rpx;

        .add-icon {
          font-size: 48rpx;
          color: #667eea;
        }
      }
    }
  }
}

// 资质要求列表
.requirement-list {
  .requirement-item {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 16rpx;

    .req-icon {
      font-size: 32rpx;
    }

    .req-input {
      flex: 1;
      padding: 16rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 8rpx;
      font-size: 26rpx;
    }

    .req-delete {
      width: 32rpx;
      height: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ff6b6b;
      border-radius: 8rpx;

      .delete-icon {
        font-size: 20rpx;
        color: #fff;
      }
    }
  }

  .add-req-btn {
    padding: 16rpx;
    border: 2rpx dashed #667eea;
    border-radius: 8rpx;
    text-align: center;

    .add-text {
      font-size: 26rpx;
      color: #667eea;
    }
  }
}

// 行业标签
.industry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;

  .industry-tag {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 8rpx 16rpx;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 20rpx;

    .tag-text {
      font-size: 24rpx;
      color: #667eea;
    }

    .tag-delete {
      font-size: 28rpx;
      color: #999;
      margin-left: 4rpx;

      &:active {
        color: #666;
      }
    }
  }
}

.industry-input {
  .industry-input-field {
    flex: 1;
    padding: 16rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    font-size: 26rpx;
  }
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 12rpx;

  .suggestion-label {
    font-size: 24rpx;
    color: #999;
  }

  .suggestion-tag {
    padding: 6rpx 12rpx;
    background: #f5f5f5;
    border-radius: 16rpx;
    font-size: 22rpx;
    color: #666;

    &:active {
      background: rgba(102, 126, 234, 0.1);
    }
  }
}

// 价格配置
.price-config {
  .price-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 16rpx;

    .price-symbol {
      font-size: 36rpx;
      color: #667eea;
      font-weight: 600;
    }

    .price-input {
      flex: 1;
      padding: 20rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 12rpx;
      font-size: 32rpx;
      color: #333;
    }
  }

  .price-options {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .price-option {
      padding: 12rpx 24rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 8rpx;
      text-align: center;

      &.selected {
        background: #667eea;
        border-color: #667eea;

        .option-text {
          color: #fff;
        }
      }

      .option-text {
        font-size: 26rpx;
        color: #666;
      }
    }
  }

  .price-note {
    margin-top: 16rpx;
    padding: 16rpx;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 8rpx;

    .note-text {
      font-size: 22rpx;
      color: #667eea;
    }
  }
}

// 核心优势列表
.advantage-list {
  .advantage-item {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    margin-bottom: 16rpx;

    .adv-number {
      width: 32rpx;
      height: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #667eea;
      color: #fff;
      border-radius: 50%;
      font-size: 20rpx;
      flex-shrink: 0;
    }

    .adv-input {
      flex: 1;
      min-height: 80rpx;
      padding: 16rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 8rpx;
      font-size: 26rpx;
    }

    .adv-delete {
      width: 32rpx;
      height: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ff6b6b;
      border-radius: 8rpx;

      .delete-icon {
        font-size: 20rpx;
        color: #fff;
      }
    }
  }

  .add-adv-btn {
    padding: 16rpx;
    border: 2rpx dashed #667eea;
    border-radius: 8rpx;
    text-align: center;

    .add-text {
      font-size: 26rpx;
      color: #667eea;
    }
  }
}

// 技术支持复选框
.support-item {
  margin-bottom: 24rpx;

  .support-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 12rpx;
  }

  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 10rpx 16rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 8rpx;

      &.selected {
        background: rgba(102, 126, 234, 0.1);
        border-color: #667eea;
      }

      .checkbox-icon {
        font-size: 28rpx;
        color: #ccc;

        &.selected {
          color: #667eea;
        }
      }

      .checkbox-label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// 联系方式
.contact-item {
  margin-bottom: 20rpx;
}

// 预览模式样式
.preview-mode-content {
  .preview-placeholder {
    background: #fff;
    border-radius: 16rpx;
    padding: 60rpx 40rpx;
    text-align: center;

    .preview-icon {
      font-size: 120rpx;
      display: block;
      margin-bottom: 20rpx;
    }

    .preview-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 12rpx;
    }

    .preview-desc {
      font-size: 26rpx;
      color: #666;
      display: block;
      margin-bottom: 40rpx;
    }

    .preview-hint {
      font-size: 24rpx;
      color: #999;
      display: block;
      margin-bottom: 60rpx;
    }

    .preview-sections {
      text-align: left;

      .preview-section {
        background: #f8f8f8;
        border-radius: 12rpx;
        padding: 24rpx;
        margin-bottom: 16rpx;

        .preview-section-title {
          font-size: 24rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 8rpx;
        }

        .preview-section-content {
          font-size: 22rpx;
          color: #666;
        }

        .preview-banner {
          height: 180rpx;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .preview-placeholder-text {
            font-size: 24rpx;
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }
    }
  }
}
</style>
