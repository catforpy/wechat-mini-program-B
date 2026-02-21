<template>
  <view class="miniprogram-detail-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">{{ pageTitle }}</text>
        <view class="nav-action" @tap="handleCollect">
          <text class="collect-icon">{{ isCollected ? '❤️' : '🤍' }}</text>
        </view>
      </view>
    </view>

    <!-- 详情内容区域 -->
    <scroll-view class="detail-content" scroll-y :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 根据类型显示不同的详情组件 -->
      <SellingDetail v-if="detailType === 'purchase'" :data="detailData" />
      <LeasingDetail v-else-if="detailType === 'rent'" :data="detailData" />
      <CooperationDetail v-else-if="detailType === 'cooperate'" :data="detailData" />

      <!-- 占位提示 -->
      <view v-else class="placeholder-content">
        <text class="placeholder-icon">📋</text>
        <text class="placeholder-text">暂无详情信息</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import SellingDetail from '@/components/collection/SellingDetail.vue'
import LeasingDetail from '@/components/collection/LeasingDetail.vue'
import CooperationDetail from '@/components/collection/CooperationDetail.vue'

// 定义 onLoad 生命周期
onLoad((options: any) => {
  console.log('🔍 onLoad 接收到的参数:', options)

  // 获取类型和ID
  detailType.value = options.type || 'purchase'
  const id = options.id || 'selling-1'

  console.log('📋 详情类型:', detailType.value)
  console.log('📋 数据ID:', id)

  // 根据类型设置标题
  const titleMap: Record<string, string> = {
    purchase: '购买详情',
    rent: '租赁详情',
    cooperate: '合作详情'
  }
  pageTitle.value = titleMap[detailType.value] || '小程序详情'

  // 加载对应的数据
  detailData.value = mockDataMap[id] || {}

  console.log('📦 加载的数据:', detailData.value)
})

// 状态栏高度
const statusBarHeight = ref(0)

// 详情类型：purchase(购买)/rent(租赁)/cooperate(合作)
const detailType = ref('purchase')

// 页面标题
const pageTitle = ref('小程序详情')

// 是否已收藏
const isCollected = ref(false)

// 详情数据
const detailData = ref<any>({})

// 假数据映射
const mockDataMap: Record<string, any> = {
  // 销售类假数据
  'selling-1': {
    id: 'selling-1',
    name: '餐饮点餐系统',
    emoji: '🍔',
    companyName: '优选餐饮科技',
    logo: '',
    programName: '餐饮点餐系统',
    tagline: '专业的餐饮点餐解决方案，提升餐厅效率',
    video: '',
    description: '这是一款功能完善的餐饮点餐小程序，支持扫码点餐、外卖配送、会员管理、营销活动等功能。系统稳定可靠，用户体验优秀，适合各类餐饮店铺使用。',
    mediaItems: [],
    banners: [
      { image: 'https://picsum.photos/750/400?random=1' },
      { image: 'https://picsum.photos/750/400?random=2' },
      { image: 'https://picsum.photos/750/400?random=3' }
    ],
    businessStatus: '已服务1000+餐饮企业，客户满意度98%',
    statsImages: [],
    qualifications: [
      { type: 'license', content: '企业营业执照（必须）' },
      { type: 'icp', content: 'ICP备案许可证' }
    ],
    industries: ['餐饮美食', '快餐连锁', '火锅店', '奶茶店', '咖啡店'],
    price: '4999',
    advantages: [
      { content: '技术成熟，系统稳定可靠' },
      { content: '支持高并发，万人同时在线' },
      { content: '功能丰富，包含扫码点餐、外卖、会员等' },
      { content: '快速部署，3天内即可上线' },
      { content: '界面美观，用户体验好' }
    ],
    support: ['技术文档', '安装部署指导', '操作培训', '7x12小时技术支持'],
    supportDescription: '我们提供完整的技术文档、一对一的安装部署指导、专业的操作培训，以及7x12小时的技术支持服务。',
    servicePeriod: '1年免费技术支持和系统维护，终身免费更新升级',
    phone: '400-123-4567',
    wechat: 'canyin_system',
    email: 'contact@canyin.com'
  },
  'selling-2': {
    id: 'selling-2',
    name: '在线教育平台',
    emoji: '📚',
    companyName: '智慧教育科技',
    logo: '',
    programName: '在线教育平台',
    tagline: '专业的在线教育解决方案，助力教育机构数字化转型',
    video: '',
    description: '这是一款功能完善的在线教育小程序，支持直播授课、录播课程、在线答疑、作业批改、考试测评等功能。适合各类教育培训机构使用。',
    mediaItems: [],
    banners: [],
    qualifications: [
      { type: 'license', content: '企业营业执照（必须）' },
      { type: 'icp', content: 'ICP备案许可证' },
      { type: 'broadcast', content: '网络文化经营许可证（涉及直播需办理）' }
    ],
    industries: ['教育培训', '在线辅导', '技能培训', '语言学习'],
    price: '8999',
    advantages: [
      { content: '支持直播和录播两种教学模式' },
      { content: '完整的学员管理系统' },
      { content: '丰富的互动功能提升学习效果' },
      { content: '数据分析功能帮助优化教学' }
    ],
    support: ['技术文档', '安装指导', '操作培训', '7x12小时技术支持'],
    supportDescription: '提供完整的技术支持服务，包括部署、培训和后期维护。',
    servicePeriod: '1年免费技术支持，终身免费更新',
    phone: '400-234-5678',
    wechat: 'edu_platform',
    email: 'contact@edu.com'
  },
  // 租赁类假数据
  'renting-1': {
    id: 'renting-1',
    name: '王记点餐系统',
    emoji: '🍜',
    companyName: '王记小吃店',
    logo: '',
    programName: '王记点餐系统',
    tagline: '专业餐饮点餐解决方案，即租即用',
    video: '',
    description: '王记点餐系统是一款专业的餐饮点餐小程序，支持扫码点餐、外卖配送、会员管理等功能。系统操作简单，用户体验优秀，适合各类餐饮店铺使用。租赁模式让您无需高额购买成本，按需使用，灵活租期。',
    mediaItems: [],
    banners: [],
    panels: [
      { name: '扫码点餐', description: '顾客扫码自助点餐，支持菜品分类、规格选择、订单备注', price: '200' },
      { name: '外卖配送', description: '支持外卖订单、配送管理、骑手调度、配送费设置', price: '300' },
      { name: '会员管理', description: '会员积分、等级权益、优惠券发放', price: '150' }
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
      { content: '灵活租期，按需使用' }
    ],
    support: ['操作培训', '7x12小时技术支持', '免费系统维护'],
    supportDescription: '提供完整的操作培训、7x12小时技术支持、免费系统维护和定期功能更新',
    phone: '400-345-6789',
    wechat: 'wangji_order',
    email: 'contact@wangji.com'
  },
  // 合作类假数据
  'cooperate-1': {
    id: 'cooperate-1',
    name: '优选商城系统',
    emoji: '🛒',
    companyName: '优选商城',
    logo: '',
    programName: '优选商城系统',
    tagline: '功能完善的电商小程序，合作共赢',
    video: '',
    description: '优选商城系统是一款功能完善的电商小程序，支持商品展示、在线交易、订单管理、会员系统等功能。系统稳定可靠，用户体验优秀，适合各类商家使用。我们诚邀合作伙伴加入，共创商业价值。',
    mediaItems: [],
    banners: [],
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
    phone: '400-456-7890',
    wechat: 'youxuan_mall',
    email: 'contact@youxuan.com'
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 收藏处理
const handleCollect = () => {
  isCollected.value = !isCollected.value
  uni.showToast({
    title: isCollected.value ? '已收藏' : '已取消收藏',
    icon: 'success'
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.miniprogram-detail-page {
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
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .nav-action {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .collect-icon {
        font-size: 36rpx;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }
}

// 详情内容区域
.detail-content {
  height: 100vh;
}

// 占位内容
.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;

  .placeholder-icon {
    font-size: 96rpx;
    margin-bottom: 24rpx;
  }

  .placeholder-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
