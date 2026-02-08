<template>
  <view class="template-detail-page">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>

    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-content">
        <view class="nav-left" @click="goBack">
          <text class="back-arrow">‹</text>
        </view>
        <view class="nav-title">
          <text class="title-text">模板详情</text>
        </view>
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll">
      <!-- 加载状态 -->
      <view v-if="!templateData.baseInfo.name" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 数据加载后的内容 -->
      <template v-else>
      <!-- 1. 顶部展示区（轮播图/视频） -->
      <view class="banner-section">
        <swiper
          class="banner-swiper"
          :current="currentSwiperIndex"
          :indicator-dots="true"
          :autoplay="false"
          :interval="5000"
          :duration="300"
          indicator-color="rgba(255, 255, 255, 0.5)"
          indicator-active-color="#ffffff"
          @change="onSwiperChange"
        >
          <swiper-item v-for="(item, index) in bannerList" :key="index">
            <!-- 图片 -->
            <image
              v-if="item.type === 'image'"
              class="banner-image"
              :src="item.url"
              mode="aspectFill"
              @click="previewImage(index)"
            />
            <!-- 视频 -->
            <view v-else class="banner-video-wrapper">
              <video
                v-if="currentVideoIndex === index"
                class="banner-video"
                :src="item.url"
                :poster="item.thumbnail"
                :controls="true"
                :show-play-btn="true"
                :show-center-play-btn="true"
                @ended="onBannerVideoEnd"
              />
              <image
                v-else
                class="banner-video-thumb"
                :src="item.thumbnail"
                mode="aspectFill"
                @click="playVideo(index)"
              />
              <view v-if="currentVideoIndex !== index" class="video-play-btn">
                <text class="play-icon">▶</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 2. 基本信息卡片 -->
      <view class="info-card">
        <view class="info-header">
          <text class="template-name">{{ templateData.baseInfo.name }}</text>
        </view>
        <view class="info-tags">
          <text
            v-for="(tag, index) in templateData.baseInfo.tags"
            :key="index"
            class="tag-item"
          >
            {{ tag }}
          </text>
        </view>
        <view class="info-meta">
          <view class="meta-item">
            <text class="meta-price">💰 ¥{{ templateData.baseInfo.price }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-rating">⭐ {{ templateData.baseInfo.rating }}</text>
          </view>
        </view>
        <view class="info-footer">
          <!-- 商户端：显示代理商信息 -->
          <text v-if="userRole === 'merchant'" class="agent-info">
            代理商：{{ templateData.baseInfo.agentName }}
          </text>
          <!-- 代理商端：显示"我的模板" -->
          <text v-else-if="userRole === 'agent'" class="agent-info">
            我的模板
          </text>
          <text class="update-time">{{ templateData.baseInfo.updatedAt }}更新</text>
        </view>
      </view>

      <!-- 3. 展示模块列表 -->
      <view class="modules-section">
        <view
          v-for="(module, mIndex) in templateData.modules"
          :key="module.id"
          class="module-item"
        >
          <!-- 模块标题 -->
          <view
            class="module-header"
            @click="toggleModule(mIndex)"
          >
            <text class="module-title">{{ module.icon }} {{ module.title }}</text>
            <text class="module-toggle">{{ module.expanded ? '▲' : '▼' }}</text>
          </view>

          <!-- 模块内容 -->
          <view v-if="module.expanded" class="module-content">
            <view
              v-for="(content, cIndex) in module.contents"
              :key="cIndex"
              class="content-item"
            >
              <!-- 图片内容 -->
              <image
                v-if="content.type === 'image'"
                class="content-image"
                :src="content.url"
                mode="widthFix"
                @click="previewModuleImage(module.id, cIndex)"
              />

              <!-- 视频内容 -->
              <view v-else-if="content.type === 'video'" class="content-video">
                <view class="video-wrapper">
                  <image
                    v-if="!content.isPlaying"
                    class="video-poster"
                    :src="content.thumbnail"
                    mode="aspectFill"
                    @click="playModuleVideo(module.id, cIndex)"
                  />
                  <video
                    v-else
                    :id="`video-${module.id}-${cIndex}`"
                    class="video-player"
                    :src="content.url"
                    :poster="content.thumbnail"
                    :controls="true"
                    :enable-progress-gesture="true"
                    :show-progress="true"
                    :show-center-play-btn="true"
                    :object-fit="contain"
                    @pause="onVideoPause(module.id, cIndex)"
                    @ended="onVideoEnd(module.id, cIndex)"
                  />
                  <view v-if="!content.isPlaying" class="video-play-btn-large">
                    <text class="play-icon-large">▶</text>
                  </view>
                  <text v-if="content.title" class="content-title">{{ content.title }}</text>
                </view>
              </view>

              <!-- 文本内容 -->
              <view v-else-if="content.type === 'text'" class="content-text">
                {{ content.text }}
              </view>

              <!-- 功能列表 -->
              <view v-else-if="content.type === 'feature-list'" class="content-features">
                <text v-if="content.title" class="features-title">{{ content.title }}</text>
                <view
                  v-for="(feature, fIndex) in content.features"
                  :key="fIndex"
                  class="feature-item"
                >
                  <text class="feature-text">{{ feature }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-placeholder"></view>
      </template>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-left">
        <!-- 收藏按钮：仅商户端显示 -->
        <view v-if="userRole === 'merchant'" class="action-btn" @click="toggleFavorite">
          <text class="action-icon">{{ isFavorited ? '❤️' : '🤍' }}</text>
          <text class="action-text">{{ isFavorited ? '已收藏' : '收藏' }}</text>
        </view>
        <!-- 代理商端显示分享按钮 -->
        <view v-else-if="userRole === 'agent'" class="action-btn" @click="shareTemplate">
          <text class="action-icon">📤</text>
          <text class="action-text">分享</text>
        </view>
      </view>
      <view class="bar-right">
        <view v-if="userRole === 'merchant'" class="consult-btn" @click="contactAgent">
          <text class="consult-text">立即购买</text>
        </view>
        <view v-else-if="userRole === 'agent'" class="consult-btn" @click="viewSalesData">
          <text class="consult-text">查看销售数据</text>
        </view>
      </view>
    </view>

    <!-- 自定义资质要求弹窗 -->
    <view v-if="showQualificationModal" class="qualification-modal" @click="closeQualificationModal">
      <view class="qualification-modal-content" @click.stop>
        <view class="qualification-modal-header">
          <text class="modal-title">资质要求提示</text>
          <view class="modal-close" @click="closeQualificationModal">×</view>
        </view>

        <!-- 主体类型标签栏 -->
        <view class="entity-type-tabs">
          <view
            v-for="type in supportedEntityTypes"
            :key="type"
            :class="['entity-tab', { active: currentEntityType === type }]"
            @click="switchEntityType(type)"
          >
            <text class="entity-tab-text">
              {{ type === EntityType.COMPANY ? '企业' : type === EntityType.PERSONAL ? '个人' : '境外机构' }}
            </text>
          </view>
        </view>

        <!-- 资质要求内容 -->
        <view class="qualification-content">
          <view class="qualification-category">
            <text class="category-name">【{{ categoryInfo.secondLevel }}】</text>
            <text class="entity-type-name">（{{ currentEntityType === EntityType.COMPANY ? '企业' : currentEntityType === EntityType.PERSONAL ? '个人' : '境外机构' }}）</text>
          </view>
          <view class="qualification-text">
            <text class="qualification-label">所需资质：</text>
            <text class="qualification-detail">{{ getQualificationByType(currentEntityType) }}</text>
          </view>
          <view class="qualification-scope">
            <text class="scope-label">适用范围：</text>
            <text class="scope-detail">{{ getScopeByType(currentEntityType) }}</text>
          </view>
        </view>

        <view class="qualification-modal-footer">
          <button class="modal-btn cancel-btn" @click="closeQualificationModal">取消</button>
          <button class="modal-btn confirm-btn" @click="gotoProfile">去完善</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { UserRole } from '@/types/template'
import { qualificationApi } from '@/api'
import {
  EntityType,
  type FirstLevelCategory,
  type SecondLevelCategory,
  companyCategories,
  personalCategories,
  overseasCategories
} from '@/data/categories-by-entity'

// 页面参数
const templateId = ref<number>(0)
const userRole = ref<UserRole>('merchant')  // 用户角色，默认为商户

// 类目信息
const categoryInfo = ref({
  firstLevel: '',
  secondLevel: '',
  qualification: '',
  scope: ''
})

// 当前选中的主体类型（用于资质要求展示）
const currentEntityType = ref<EntityType>(EntityType.COMPANY)

// 支持的主体类型（根据类目动态获取）
const supportedEntityTypes = ref<EntityType[]>([EntityType.COMPANY])

// 资质弹窗显示状态
const showQualificationModal = ref(false)

// 根据主体类型获取资质要求
const getQualificationByType = (type: EntityType): string => {
  const secondLevelName = categoryInfo.value.secondLevel

  // 根据主体类型查找对应的类目
  let categories: FirstLevelCategory[]
  if (type === EntityType.COMPANY) categories = companyCategories
  else if (type === EntityType.PERSONAL) categories = personalCategories
  else if (type === EntityType.OVERSEAS) categories = overseasCategories
  else return '未知主体类型'

  // 在该主体类型的类目中查找对应的二级类目
  for (const firstLevel of categories) {
    for (const secondLevel of firstLevel.secondLevel) {
      if (secondLevel.name === secondLevelName) {
        return secondLevel.qualification || '暂无资质要求'
      }
    }
  }

  return '该主体类型不支持此类目'
}

// 根据主体类型获取适用范围
const getScopeByType = (type: EntityType): string => {
  const secondLevelName = categoryInfo.value.secondLevel

  // 根据主体类型查找对应的类目
  let categories: FirstLevelCategory[]
  if (type === EntityType.COMPANY) categories = companyCategories
  else if (type === EntityType.PERSONAL) categories = personalCategories
  else if (type === EntityType.OVERSEAS) categories = overseasCategories
  else return '未知主体类型'

  // 在该主体类型的类目中查找对应的二级类目
  for (const firstLevel of categories) {
    for (const secondLevel of firstLevel.secondLevel) {
      if (secondLevel.name === secondLevelName) {
        return secondLevel.scope || '暂无说明'
      }
    }
  }

  return '该主体类型不支持此类目'
}

// 切换主体类型
const switchEntityType = (type: EntityType) => {
  currentEntityType.value = type
}

// 打开资质弹窗
const openQualificationModal = () => {
  showQualificationModal.value = true
}

// 关闭资质弹窗
const closeQualificationModal = () => {
  showQualificationModal.value = false
}

// 跳转到我的页面
const gotoProfile = () => {
  closeQualificationModal()
  uni.switchTab({
    url: '/pages/profile/index'
  })
}

// 确定当前类目支持哪些主体类型
const determineSupportedEntityTypes = () => {
  const secondLevelName = categoryInfo.value.secondLevel

  const types: EntityType[] = []

  // 检查企业类目是否包含这个类目
  const hasCompany = companyCategories.some((firstLevel: FirstLevelCategory) =>
    firstLevel.secondLevel.some((secondLevel: SecondLevelCategory) =>
      secondLevel.name === secondLevelName
    )
  )
  if (hasCompany) types.push(EntityType.COMPANY)

  // 检查个人类目是否包含这个类目
  const hasPersonal = personalCategories.some((firstLevel: FirstLevelCategory) =>
    firstLevel.secondLevel.some((secondLevel: SecondLevelCategory) =>
      secondLevel.name === secondLevelName
    )
  )
  if (hasPersonal) types.push(EntityType.PERSONAL)

  // 检查境外类目是否包含这个类目
  const hasOverseas = overseasCategories.some((firstLevel: FirstLevelCategory) =>
    firstLevel.secondLevel.some((secondLevel: SecondLevelCategory) =>
      secondLevel.name === secondLevelName
    )
  )
  if (hasOverseas) types.push(EntityType.OVERSEAS)

  supportedEntityTypes.value = types

  // 设置默认选中的主体类型（优先选择企业）
  if (types.includes(EntityType.COMPANY)) {
    currentEntityType.value = EntityType.COMPANY
  } else if (types.length > 0) {
    currentEntityType.value = types[0]
  }

  console.log('支持的主体类型:', types)
}

// 模板数据
const templateData = ref<any>({
  baseInfo: {
    id: 0,
    name: '',
    category: '',
    price: 0,
    rating: 0,
    tags: [],
    agentName: '',
    agentId: 0,
    updatedAt: ''
  },
  banner: [],
  modules: []
})

// 轮播数据
const bannerList = ref<any[]>([])
const currentVideoIndex = ref(-1)
const currentSwiperIndex = ref(0)

// 是否已收藏
const isFavorited = ref(false)

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 播放视频
const playVideo = (index: number) => {
  currentVideoIndex.value = index
  currentSwiperIndex.value = index
}

// Swiper切换事件
const onSwiperChange = (e: any) => {
  currentSwiperIndex.value = e.detail.current
  // 如果切换到非视频页面，重置视频播放状态
  if (currentVideoIndex.value !== -1 && currentVideoIndex.value !== e.detail.current) {
    currentVideoIndex.value = -1
  }
}

// Banner视频播放结束
const onBannerVideoEnd = () => {
  // 重置视频播放状态
  currentVideoIndex.value = -1
  // 跳转到第一张图
  currentSwiperIndex.value = 0
  // 可选：显示提示
  uni.showToast({
    title: '视频播放结束',
    icon: 'none',
    duration: 1000
  })
}

// 预览轮播图
const previewImage = (index: number) => {
  const urls = bannerList.value
    .filter(item => item.type === 'image')
    .map(item => item.url)

  const currentIndex = bannerList.value
    .filter(item => item.type === 'image')
    .findIndex(item => bannerList.value.indexOf(item) === index)

  uni.previewImage({
    urls,
    current: currentIndex
  })
}

// 预览模块内的图片
const previewModuleImage = (moduleId: string, contentIndex: number) => {
  const module = templateData.value.modules.find(m => m.id === moduleId)
  if (!module) return

  const urls = module.contents
    .filter(c => c.type === 'image')
    .map(c => c.url)

  const currentImage = module.contents[contentIndex]

  uni.previewImage({
    urls,
    current: currentImage.url
  })
}

// 切换模块展开/折叠
const toggleModule = (index: number) => {
  templateData.value.modules[index].expanded = !templateData.value.modules[index].expanded
}

// 切换收藏状态
const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  // TODO: 调用收藏接口
  uni.showToast({
    title: isFavorited.value ? '收藏成功' : '取消收藏',
    icon: 'none'
  })
}

// 立即购买 - 检查资质
const contactAgent = async () => {
  try {
    console.log('=== 开始资质检查 ===')
    console.log('类目信息:', categoryInfo.value)
    console.log('模板名称:', templateData.value.baseInfo.name)

    uni.showLoading({
      title: '检查资质中...',
      mask: true
    })

    // 调用后端API检查用户资质
    const result = await qualificationApi.checkQualification({
      firstLevel: categoryInfo.value.firstLevel,
      secondLevel: categoryInfo.value.secondLevel,
      templateName: templateData.value.baseInfo.name
    })

    console.log('资质检查结果:', result)
    uni.hideLoading()

    if (result.hasQualification) {
      // 有资质，显示提示并跳转到购买页面
      uni.showToast({
        title: `资质验证通过\n使用资质：${result.matchedQualification || '相关资质'}`,
        icon: 'success',
        duration: 2000
      })

      // 延迟跳转，让用户看到提示
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/order/purchase?templateName=${encodeURIComponent(templateData.value.baseInfo.name)}`
        })
      }, 2000)
    } else {
      // 没有资质，显示自定义提示框
      openQualificationModal()
    }
  } catch (error) {
    uni.hideLoading()
    console.error('资质检查失败:', error)
    uni.showToast({
      title: '资质检查失败，请稍后重试',
      icon: 'none',
      duration: 2000
    })
  }
}

// 分享模板（代理商端）
const shareTemplate = () => {
  // TODO: 实现分享功能
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
}

// 查看销售数据（代理商端）
const viewSalesData = () => {
  // TODO: 跳转到销售数据页面
  uni.showToast({
    title: '查看销售数据',
    icon: 'none'
  })
}

// 播放模块内的视频
const playModuleVideo = (moduleId: string, contentIndex: number) => {
  const module = templateData.value.modules.find(m => m.id === moduleId)
  if (!module) return

  // 暂停其他正在播放的视频
  templateData.value.modules.forEach(m => {
    m.contents.forEach((c: any) => {
      if (c.type === 'video') {
        c.isPlaying = false
      }
    })
  })

  // 设置当前视频为播放状态
  module.contents[contentIndex].isPlaying = true
}

// 视频暂停
const onVideoPause = (moduleId: string, contentIndex: number) => {
  const module = templateData.value.modules.find(m => m.id === moduleId)
  if (!module) return

  module.contents[contentIndex].isPlaying = false
}

// 视频播放结束
const onVideoEnd = (moduleId: string, contentIndex: number) => {
  const module = templateData.value.modules.find(m => m.id === moduleId)
  if (!module) return

  module.contents[contentIndex].isPlaying = false
}

// 加载模板详情数据
const loadTemplateDetail = async () => {
  if (!templateId.value) {
    uni.showToast({
      title: '模板ID不能为空',
      icon: 'none'
    })
    return
  }

  // 开发环境：直接使用模拟数据
  console.log('加载模板详情，templateId:', templateId.value)
  loadMockData()

  // TODO: 生产环境取消注释以下代码，调用真实API
  /*
  try {
    const res = await uni.request({
      url: '/api/template/detail',
      method: 'GET',
      data: { templateId: templateId.value }
    })

    if (res.data.code === 200 && res.data.data) {
      templateData.value = res.data.data
      bannerList.value = res.data.data.banner || []
    } else {
      throw new Error(res.data.message || '获取数据失败')
    }
  } catch (error) {
    console.error('加载模板详情失败:', error)
    uni.showToast({
      title: '加载失败，请稍后重试',
      icon: 'none'
    })
    loadMockData()
  }
  */
}

// 模拟数据生成（仅开发环境使用）
const loadMockData = () => {
  // 根据 templateId 生成不同的模拟数据
  const mockTemplates: Record<number, any> = {
    1: {
      baseInfo: {
        id: 1,
        name: '在线培训小程序',
        category: '教育培训类',
        price: 9800,
        rating: 4.9,
        tags: ['在线学习', '直播授课', '考试系统'],
        agentName: '小张',
        agentId: 1,
        updatedAt: '2天前'
      },
      banner: [
        {
          type: 'image',
          url: 'https://picsum.photos/750/400?random=1',
          title: '首页截图'
        },
        {
          type: 'image',
          url: 'https://picsum.photos/750/400?random=2',
          title: '课程列表'
        },
        {
          type: 'video',
          url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          thumbnail: 'https://picsum.photos/750/400?random=3',
          title: '功能演示'
        }
      ],
      modules: [
        {
          id: 'features',
          title: '核心特色',
          icon: '✨',
          expanded: true,
          contents: [
            {
              type: 'image',
              url: 'https://picsum.photos/670/400?random=10',
              title: '学员管理'
            },
            {
              type: 'feature-list',
              title: '主要功能',
              features: [
                '学员管理系统 - 支持学员注册、信息管理、学习进度追踪',
                '在线考试系统 - 题库管理、自动组卷、在线答题、成绩统计',
                '直播授课功能 - 支持实时直播、互动答疑、录播回放'
              ]
            }
          ]
        },
        {
          id: 'overview',
          title: '功能概览',
          icon: '📋',
          expanded: false,
          contents: [
            {
              type: 'video',
              url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
              thumbnail: 'https://picsum.photos/670/400?random=11',
              title: '功能演示视频',
              isPlaying: false
            },
            {
              type: 'text',
              text: '完整的在线教育解决方案，包含课程管理、学员管理、考试系统等核心功能，助您快速搭建专业的在线教育平台。'
            }
          ]
        },
        {
          id: 'backend',
          title: '后台管理',
          icon: '⚙️',
          expanded: false,
          contents: [
            {
              type: 'image',
              url: 'https://picsum.photos/670/400?random=12',
              title: '数据看板'
            },
            {
              type: 'image',
              url: 'https://picsum.photos/670/400?random=13',
              title: '课程管理'
            },
            {
              type: 'feature-list',
              title: '后台功能',
              features: [
                '学员数据管理',
                '课程内容上传',
                '财务统计分析',
                '权限设置管理'
              ]
            }
          ]
        },
        {
          id: 'scenarios',
          title: '适用场景',
          icon: '🎯',
          expanded: false,
          contents: [
            {
              type: 'feature-list',
              features: [
                '✓ 职业技能培训机构',
                '✓ K12在线教育平台',
                '✓ 企业内训系统',
                '✓ 知识付费平台',
                '✓ 社区教育中心'
              ]
            }
          ]
        }
      ]
    },
    2: {
      baseInfo: {
        id: 2,
        name: '电商商城模板',
        category: '电商类',
        price: 12800,
        rating: 4.7,
        tags: ['商品管理', '营销活动', '会员系统'],
        agentName: '小李',
        agentId: 2,
        updatedAt: '1天前'
      },
      banner: [
        {
          type: 'image',
          url: 'https://picsum.photos/750/400?random=20',
          title: '商城首页'
        },
        {
          type: 'image',
          url: 'https://picsum.photos/750/400?random=21',
          title: '商品详情'
        },
        {
          type: 'video',
          url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          thumbnail: 'https://picsum.photos/750/400?random=22',
          title: '商城演示'
        }
      ],
      modules: [
        {
          id: 'features',
          title: '核心特色',
          icon: '✨',
          expanded: true,
          contents: [
            {
              type: 'image',
              url: 'https://picsum.photos/670/400?random=30',
              title: '商品管理'
            },
            {
              type: 'feature-list',
              title: '主要功能',
              features: [
                '商品管理 - SKU管理、库存预警、批量上架',
                '营销系统 - 满减优惠、拼团秒杀、分销推广',
                '会员系统 - 积分兑换、会员等级、专属优惠',
                '数据分析 - 销售报表、用户行为、转化分析'
              ]
            }
          ]
        },
        {
          id: 'scenarios',
          title: '适用场景',
          icon: '🎯',
          expanded: false,
          contents: [
            {
              type: 'feature-list',
              features: [
                '✓ 品牌电商',
                '✓ 社区团购',
                '✓ 直播带货',
                '✓ 跨境电商',
                '✓ 批发零售'
              ]
            }
          ]
        }
      ]
    },
    3: {
      baseInfo: {
        id: 3,
        name: '点餐平台',
        category: '点餐平台类',
        price: 8800,
        rating: 4.8,
        tags: ['在线点餐', '配送管理', '会员营销'],
        agentName: '小孙',
        agentId: 3,
        updatedAt: '3天前'
      },
      banner: [
        {
          type: 'image',
          url: 'https://picsum.photos/750/400?random=40',
          title: '外卖首页'
        },
        {
          type: 'video',
          url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          thumbnail: 'https://picsum.photos/750/400?random=41',
          title: '点餐演示'
        }
      ],
      modules: [
        {
          id: 'features',
          title: '核心特色',
          icon: '✨',
          expanded: true,
          contents: [
            {
              type: 'feature-list',
              title: '主要功能',
              features: [
                '在线点餐 - 菜品展示、购物车、在线支付',
                '配送管理 - 配送员管理、路线规划、实时追踪',
                '会员营销 - 优惠券、满减活动、积分兑换'
              ]
            }
          ]
        }
      ]
    }
  }

  // 根据 ID 返回对应数据，如果没有则返回 ID=1 的数据
  const data = mockTemplates[templateId.value] || mockTemplates[1]
  console.log('=== loadMockData ===')
  console.log('请求的 templateId:', templateId.value)
  console.log('找到的数据:', data)
  console.log('数据名称:', data?.baseInfo?.name)

  templateData.value = data
  bannerList.value = data.banner || []

  console.log('templateData 已赋值')
  console.log('bannerList 已赋值，长度:', bannerList.value.length)
}

// onLoad 生命周期（Uniapp小程序页面参数在这里获取）
onLoad((options: any) => {
  console.log('=== 模板详情页 onLoad ===')
  console.log('原始 options:', options)

  // 获取模板基本信息
  const nameParam = options?.name
  const descParam = options?.desc

  if (nameParam) {
    templateData.value.baseInfo.name = decodeURIComponent(nameParam)
  }

  if (descParam) {
    templateData.value.baseInfo.desc = decodeURIComponent(descParam)
    templateData.value.baseInfo.tags = [descParam]
  }

  // 获取用户角色
  const roleParam = options?.userRole
  if (roleParam && ['agent', 'merchant', 'admin'].includes(roleParam)) {
    userRole.value = roleParam as UserRole
  }

  // 获取类目信息
  const firstLevelParam = options?.firstLevel
  const secondLevelParam = options?.secondLevel
  const qualificationParam = options?.qualification
  const scopeParam = options?.scope

  if (firstLevelParam) {
    categoryInfo.value.firstLevel = decodeURIComponent(firstLevelParam)
  }
  if (secondLevelParam) {
    categoryInfo.value.secondLevel = decodeURIComponent(secondLevelParam)
  }
  if (qualificationParam) {
    categoryInfo.value.qualification = decodeURIComponent(qualificationParam)
  }
  if (scopeParam) {
    categoryInfo.value.scope = decodeURIComponent(scopeParam)
  }

  console.log('解析后的模板名称:', templateData.value.baseInfo.name)
  console.log('解析后的 userRole:', userRole.value)
  console.log('解析后的类目信息:', categoryInfo.value)

  // 确定支持的主体类型
  determineSupportedEntityTypes()

  // 动态生成模板数据
  generateDynamicTemplateData()

  console.log('模板数据已生成')
})

// 根据模板名称动态生成数据
const generateDynamicTemplateData = () => {
  const name = templateData.value.baseInfo.name
  const desc = templateData.value.baseInfo.desc || '小程序模板'

  // 生成价格（基于名称hash）
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const price = (hash % 50) * 100 + 2800  // 2800-7800之间的价格
  const rating = ((hash % 50) / 10 + 4.5).toFixed(1)  // 4.5-5.0

  // 更新基本信息
  templateData.value.baseInfo.price = price
  templateData.value.baseInfo.rating = parseFloat(rating)
  templateData.value.baseInfo.tags = [desc.split('、')[0] || desc]
  templateData.value.baseInfo.agentName = ['小张', '小李', '小王', '小刘'][hash % 4]
  templateData.value.baseInfo.agentId = hash % 10 + 1
  templateData.value.baseInfo.updatedAt = `${(hash % 7) + 1}天前`

  // 生成轮播图（使用随机图片）
  const imageSeeds = [hash, hash + 1, hash + 2]
  templateData.value.banner = imageSeeds.map(seed => ({
    type: 'image',
    url: `https://picsum.photos/750/400?random=${seed}`,
    title: `${name}截图${seed}`
  }))

  bannerList.value = templateData.value.banner

  // 生成展示模块
  templateData.value.modules = [
    {
      id: 'features',
      title: '核心特色',
      icon: '✨',
      expanded: true,
      contents: [
        {
          type: 'image',
          url: `https://picsum.photos/670/400?random=${hash + 10}`,
          title: '功能展示'
        },
        {
          type: 'feature-list',
          title: '主要功能',
          features: generateFeatures(name, desc)
        }
      ]
    },
    {
      id: 'overview',
      title: '功能概览',
      icon: '📋',
      expanded: false,
      contents: [
        {
          type: 'text',
          text: `${name}是一款专业的微信小程序解决方案，功能完善，操作便捷，助您快速搭建业务平台。`
        }
      ]
    },
    {
      id: 'scenarios',
      title: '适用场景',
      icon: '🎯',
      expanded: false,
      contents: [
        {
          type: 'feature-list',
          features: generateScenarios(name)
        }
      ]
    }
  ]
}

// 根据模板名称生成功能列表
const generateFeatures = (name: string, desc: string): string[] => {
  const featureTemplates = [
    `${name} - 核心功能模块`,
    '用户管理系统 - 支持用户注册、信息管理、数据统计',
    '内容管理系统 - 快速发布和更新内容',
    '订单管理系统 - 完整的订单流程处理',
    '数据分析系统 - 实时监控业务数据',
    '消息通知系统 - 重要消息及时提醒'
  ]
  return featureTemplates.slice(0, 4)
}

// 根据模板名称生成适用场景
const generateScenarios = (name: string): string[] => {
  return [
    `✓ ${name}行业`,
    `✓ 微信小程序生态`,
    `✓ 移动端用户`,
    `✓ 快速上线部署`
  ]
}

onMounted(() => {
  // 其他初始化逻辑
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.template-detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $bg-color;
}

.status-bar {
  height: var(--status-bar-height);
  background-color: #ffffff;
}

.navbar {
  background-color: #ffffff;
  border-bottom: 1rpx solid $border-color;
  position: sticky;
  top: 0;
  z-index: 100;

  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 $spacing-md;
  }

  .nav-left {
    width: 80rpx;
    display: flex;
    align-items: center;

    .back-arrow {
      font-size: 60rpx;
      color: $text-color;
      font-weight: 300;
      line-height: 1;
    }
  }

  .nav-title {
    flex: 1;
    text-align: center;

    .title-text {
      font-size: $font-size-xl;
      font-weight: bold;
      color: $text-color;
    }
  }

  .nav-right {
    width: 80rpx;
  }
}

.content-scroll {
  flex: 1;
  height: 0;
}

// 顶部展示区
.banner-section {
  width: 100%;
  background-color: #000000;

  .banner-swiper {
    width: 100%;
    height: 400rpx;

    .banner-image {
      width: 100%;
      height: 100%;
    }

    .banner-video-wrapper {
      width: 100%;
      height: 100%;
      position: relative;

      .banner-video,
      .banner-video-thumb {
        width: 100%;
        height: 100%;
      }

      .video-play-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100rpx;
        height: 100rpx;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .play-icon {
          font-size: 40rpx;
          color: #ffffff;
          margin-left: 8rpx;
        }
      }
    }
  }
}

// 基本信息卡片
.info-card {
  background-color: #ffffff;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;

  .info-header {
    margin-bottom: $spacing-md;

    .template-name {
      font-size: $font-size-xxl;
      font-weight: bold;
      color: $text-color;
    }
  }

  .info-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;

    .tag-item {
      padding: 6rpx 16rpx;
      background-color: $primary-color;
      color: #ffffff;
      font-size: $font-size-sm;
      border-radius: 20rpx;
    }
  }

  .info-meta {
    display: flex;
    gap: $spacing-lg;
    margin-bottom: $spacing-md;

    .meta-item {
      .meta-price,
      .meta-rating {
        font-size: $font-size-lg;
        font-weight: bold;
        color: $primary-color;
      }
    }
  }

  .info-footer {
    display: flex;
    justify-content: space-between;
    padding-top: $spacing-sm;
    border-top: 1rpx solid $border-color;

    .agent-info,
    .update-time {
      font-size: $font-size-sm;
      color: $text-color-secondary;
    }
  }
}

// 展示模块
.modules-section {
  padding: $spacing-md;

  .module-item {
    background-color: #ffffff;
    border-radius: $border-radius-md;
    margin-bottom: $spacing-md;
    overflow: hidden;

    .module-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-lg;
      border-bottom: 1rpx solid $border-color;

      .module-title {
        font-size: $font-size-lg;
        font-weight: bold;
        color: $text-color;
      }

      .module-toggle {
        font-size: $font-size-sm;
        color: $text-color-secondary;
      }
    }

    .module-content {
      padding: $spacing-md;

      .content-item {
        margin-bottom: $spacing-md;

        &:last-child {
          margin-bottom: 0;
        }

        .content-image {
          width: 100%;
          border-radius: $border-radius-sm;
        }

        .content-video {
          .video-wrapper {
            position: relative;
            width: 100%;
            border-radius: $border-radius-sm;
            overflow: hidden;

            .video-poster {
              width: 100%;
              display: block;
            }

            .video-player {
              width: 100%;
              display: block;
              position: relative;
              z-index: 1;
            }

            .video-play-btn-large {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100rpx;
              height: 100rpx;
              background-color: rgba(0, 0, 0, 0.7);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 2;

              .play-icon-large {
                font-size: 40rpx;
                color: #ffffff;
                margin-left: 6rpx;
              }
            }
          }

          .content-title {
            display: block;
            margin-top: $spacing-sm;
            font-size: $font-size-base;
            color: $text-color;
          }
        }

        .content-text {
          font-size: $font-size-base;
          color: $text-color;
          line-height: 1.6;
        }

        .content-features {
          .features-title {
            display: block;
            font-size: $font-size-lg;
            font-weight: bold;
            color: $text-color;
            margin-bottom: $spacing-sm;
          }

          .feature-item {
            margin-bottom: $spacing-sm;

            &:last-child {
              margin-bottom: 0;
            }

            .feature-text {
              font-size: $font-size-base;
              color: $text-color;
              line-height: 1.6;
            }
          }
        }
      }
    }
  }
}

.bottom-placeholder {
  height: 120rpx;
}

// 底部操作栏
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  background-color: #ffffff;
  border-top: 1rpx solid $border-color;
  padding-bottom: calc(#{$spacing-md} + constant(safe-area-inset-bottom));
  padding-bottom: calc(#{$spacing-md} + env(safe-area-inset-bottom));
  z-index: 999;

  .bar-left {
    display: flex;
    gap: $spacing-lg;

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4rpx;

      .action-icon {
        font-size: 40rpx;
      }

      .action-text {
        font-size: $font-size-xs;
        color: $text-color-secondary;
      }
    }
  }

  .bar-right {
    .consult-btn {
      padding: 16rpx 48rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 40rpx;

      .consult-text {
        font-size: $font-size-base;
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400rpx;

  .loading-text {
    font-size: $font-size-lg;
    color: $text-color-secondary;
  }
}

// 资质要求弹窗
.qualification-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.qualification-modal-content {
  width: 600rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
}

.qualification-modal-header {
  position: relative;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .modal-close {
    position: absolute;
    right: 30rpx;
    font-size: 50rpx;
    color: #999;
    line-height: 1;
  }
}

// 主体类型标签栏
.entity-type-tabs {
  display: flex;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.entity-tab {
  flex: 1;
  padding: 16rpx;
  text-align: center;
  border-radius: 8rpx;
  margin: 0 5rpx;
  background-color: #f5f5f5;
  transition: all 0.3s;

  &.active {
    background-color: #667eea;

    .entity-tab-text {
      color: #ffffff;
    }
  }

  .entity-tab-text {
    font-size: 26rpx;
    color: #666;
  }
}

// 资质内容区域
.qualification-content {
  padding: 30rpx;
  max-height: 600rpx;
  overflow-y: auto;
}

.qualification-category {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  flex-wrap: wrap;

  .category-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-right: 10rpx;
  }

  .entity-type-name {
    font-size: 24rpx;
    color: #667eea;
    background-color: #f0f5ff;
    padding: 4rpx 12rpx;
    border-radius: 4rpx;
  }
}

.qualification-text,
.qualification-scope {
  margin-bottom: 20rpx;
  line-height: 1.8;

  .qualification-label,
  .scope-label {
    font-size: 26rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
  }

  .qualification-detail,
  .scope-detail {
    font-size: 26rpx;
    color: #666;
    white-space: pre-wrap;
  }
}

.qualification-modal-footer {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.modal-btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 28rpx;
  border: none;
  border-radius: 0;
  background-color: #ffffff;

  &::after {
    border: none;
  }
}

.cancel-btn {
  color: #666;
  border-right: 1rpx solid #f0f0f0;
}

.confirm-btn {
  color: #667eea;
  font-weight: bold;
}
</style>
