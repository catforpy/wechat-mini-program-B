<template>
  <view class="browse-page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <view class="navbar-title">
          <text class="title-text">浏览页面</text>
        </view>
        <view class="navbar-placeholder"></view>
      </view>
    </view>

    <!-- 页面内容区域 -->
    <view class="page-content" :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- 一级类目标签栏 -->
      <view class="first-level-tabs">
        <scroll-view scroll-x class="first-tabs-scroll" show-scrollbar="false">
          <view class="first-tabs-wrapper">
            <view
              v-for="(category, index) in allCategories"
              :key="index"
              :class="['first-tab-item', { active: currentFirstLevel === index }]"
              @tap="handleFirstLevelChange(index)"
            >
              <text class="tab-text">{{ category.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 二级类目标签栏 -->
      <view class="second-level-tabs">
        <scroll-view scroll-x class="second-tabs-scroll" show-scrollbar="false">
          <view class="second-tabs-wrapper">
            <view
              v-for="(secondLevel, index) in currentSecondLevelCategories"
              :key="index"
              :class="['second-tab-item', { active: currentSecondLevel === index }]"
              @tap="handleSecondLevelChange(Number(index))"
            >
              <text class="tab-text">{{ secondLevel.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 主内容区（时间轴 + 小程序卡片） -->
      <view class="main-content">
        <!-- 左侧时间轴侧边栏 -->
        <scroll-view class="timeline-sidebar" scroll-y>
          <view class="timeline-content">
            <!-- 时间分组 -->
            <view
              v-for="(timeGroup, index) in timelineGroups"
              :key="index"
              :class="['timeline-group', { active: selectedTimeIndex === index }]"
              @tap="handleTimeGroupSelect(index)"
            >
              <view class="time-label">
                <text class="time-text">{{ timeGroup.label }}</text>
              </view>
              <view class="time-count">
                <text class="count-text">{{ timeGroup.count }}个</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- 右侧小程序卡片网格 -->
        <scroll-view class="mini-programs-content" scroll-y>
          <view class="programs-wrapper">
            <view class="current-time-title">
              <text class="time-title-text">{{ currentTimeGroupLabel }}</text>
            </view>

            <!-- 小程序卡片网格 -->
            <view class="mini-program-grid">
              <view
                v-for="(program, index) in currentTimelinePrograms"
                :key="index"
                class="mini-program-card"
                @tap="handleProgramClick(program)"
              >
                <view class="program-image">
                  <image :src="program.programIcon || '/static/haidu.jpg'" class="icon-img" mode="aspectFill" />
                </view>
                <text class="program-name">{{ program.programName }}</text>
              </view>
            </view>

            <!-- 空状态 -->
            <view v-if="currentTimelinePrograms.length === 0" class="empty-state">
              <text class="empty-icon">📂</text>
              <text class="empty-text">该时间段暂无浏览记录</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllMergedCategories } from '@/data/categories-by-entity'

// 状态栏高度
const statusBarHeight = ref(0)

// 所有类目
const allCategories = ref<any[]>([])

// 当前选中的一级类目索引
const currentFirstLevel = ref(0)

// 当前选中的二级类目索引
const currentSecondLevel = ref(0)

// 当前选中的时间索引（默认0表示今天）
const selectedTimeIndex = ref(0)

// 浏览历史数据（假数据）
interface BrowseRecord {
  id: string
  firstLevel: string
  secondLevel: string
  programId: string
  programName: string
  programIcon: string
  browseTime: Date
}

interface TimelineGroup {
  label: string
  count: number
  programs: BrowseRecord[]
}

const browseHistory = ref<BrowseRecord[]>([
  // ============ 物流服务 - 今天的浏览记录 ============
  {
    id: '1',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp001',
    programName: '快递寄件小程序',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T10:30:00')
  },
  {
    id: '2',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp002',
    programName: '智能物流管理',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T09:15:00')
  },
  {
    id: '3',
    firstLevel: '物流服务',
    secondLevel: '查件',
    programId: 'mp003',
    programName: '实时查件助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T14:20:00')
  },
  {
    id: '4',
    firstLevel: '物流服务',
    secondLevel: '装卸搬运',
    programId: 'mp004',
    programName: '搬运调度平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T11:00:00')
  },
  {
    id: '5',
    firstLevel: '物流服务',
    secondLevel: '仓储管理',
    programId: 'mp005',
    programName: '智能仓储系统',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T15:30:00')
  },
  {
    id: '6',
    firstLevel: '物流服务',
    secondLevel: '货物运输',
    programId: 'mp006',
    programName: '运输管理系统',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T13:45:00')
  },
  // ============ 物流服务 - 昨天的浏览记录 ============
  {
    id: '7',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp007',
    programName: '包裹追踪系统',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T16:45:00')
  },
  {
    id: '8',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp008',
    programName: '快递员助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T14:20:00')
  },
  {
    id: '9',
    firstLevel: '物流服务',
    secondLevel: '查件',
    programId: 'mp009',
    programName: '全网物流查询',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T10:15:00')
  },
  {
    id: '10',
    firstLevel: '物流服务',
    secondLevel: '装卸搬运',
    programId: 'mp010',
    programName: '装卸调度助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T11:20:00')
  },
  // ============ 物流服务 - 2.7的浏览记录 ============
  {
    id: '11',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp011',
    programName: '配送优化工具',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T13:30:00')
  },
  {
    id: '12',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp012',
    programName: '智能分拣系统',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T09:00:00')
  },
  {
    id: '13',
    firstLevel: '物流服务',
    secondLevel: '货物运输',
    programId: 'mp013',
    programName: '车队调度系统',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T10:00:00')
  },
  {
    id: '14',
    firstLevel: '物流服务',
    secondLevel: '查件',
    programId: 'mp014',
    programName: '物流查询平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T15:45:00')
  },
  {
    id: '15',
    firstLevel: '物流服务',
    secondLevel: '仓储管理',
    programId: 'mp015',
    programName: '库存管理助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T14:30:00')
  },
  // ============ 物流服务 - 2.6的浏览记录 ============
  {
    id: '16',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp016',
    programName: '智能快递柜',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-06T16:00:00')
  },
  {
    id: '17',
    firstLevel: '物流服务',
    secondLevel: '装卸搬运',
    programId: 'mp017',
    programName: '货物搬运助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-06T11:30:00')
  },
  // ============ 物流服务 - 2.5的浏览记录 ============
  {
    id: '18',
    firstLevel: '物流服务',
    secondLevel: '货物运输',
    programId: 'mp018',
    programName: '运输路径规划',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-05T10:15:00')
  },
  {
    id: '19',
    firstLevel: '物流服务',
    secondLevel: '仓储管理',
    programId: 'mp019',
    programName: '出入库管理',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-05T14:20:00')
  },
  {
    id: '20',
    firstLevel: '物流服务',
    secondLevel: '查件',
    programId: 'mp020',
    programName: '快递状态追踪',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-05T09:45:00')
  },
  // ============ 物流服务 - 一周前的浏览记录 ============
  {
    id: '21',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp021',
    programName: '快递网点管理',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-02T14:20:00')
  },
  {
    id: '22',
    firstLevel: '物流服务',
    secondLevel: '装卸搬运',
    programId: 'mp022',
    programName: '货物追踪助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-28T11:00:00')
  },
  {
    id: '23',
    firstLevel: '物流服务',
    secondLevel: '查件',
    programId: 'mp023',
    programName: '跨境物流平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-25T16:30:00')
  },
  {
    id: '24',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp024',
    programName: '智能寄件助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-22T13:00:00')
  },
  {
    id: '25',
    firstLevel: '物流服务',
    secondLevel: '货物运输',
    programId: 'mp025',
    programName: '物流信息平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-18T10:30:00')
  },
  // ============ 物流服务 - 一个月前的浏览记录 ============
  {
    id: '26',
    firstLevel: '物流服务',
    secondLevel: '收件/派件',
    programId: 'mp026',
    programName: '智能快递柜',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-10T10:00:00')
  },
  {
    id: '27',
    firstLevel: '物流服务',
    secondLevel: '货物运输',
    programId: 'mp027',
    programName: '大宗物流管理',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2025-12-15T09:30:00')
  },
  {
    id: '28',
    firstLevel: '物流服务',
    secondLevel: '仓储管理',
    programId: 'mp028',
    programName: '云仓管理系统',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2025-12-01T13:00:00')
  },

  // ============ 教育服务 - 今天的浏览记录 ============
  {
    id: '29',
    firstLevel: '教育服务',
    secondLevel: '在线视频课程',
    programId: 'edu001',
    programName: '在线培训平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T11:30:00')
  },
  {
    id: '30',
    firstLevel: '教育服务',
    secondLevel: '在线视频课程',
    programId: 'edu002',
    programName: '职业技能提升',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T14:00:00')
  },
  {
    id: '31',
    firstLevel: '教育服务',
    secondLevel: '婴幼儿教育',
    programId: 'edu003',
    programName: '启蒙教育平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T09:00:00')
  },
  {
    id: '32',
    firstLevel: '教育服务',
    secondLevel: '素质教育',
    programId: 'edu004',
    programName: '艺术培训中心',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T16:30:00')
  },
  // ============ 教育服务 - 昨天的浏览记录 ============
  {
    id: '33',
    firstLevel: '教育服务',
    secondLevel: '在线视频课程',
    programId: 'edu005',
    programName: '网课学习助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T10:45:00')
  },
  {
    id: '34',
    firstLevel: '教育服务',
    secondLevel: '婴幼儿教育',
    programId: 'edu006',
    programName: '亲子互动平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T15:20:00')
  },
  {
    id: '35',
    firstLevel: '教育服务',
    secondLevel: '学历教育（培训机构）',
    programId: 'edu007',
    programName: '职业资格培训',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T13:00:00')
  },
  // ============ 教育服务 - 2.7的浏览记录 ============
  {
    id: '36',
    firstLevel: '教育服务',
    secondLevel: '在线视频课程',
    programId: 'edu008',
    programName: '直播授课平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T11:15:00')
  },
  {
    id: '37',
    firstLevel: '教育服务',
    secondLevel: '素质教育',
    programId: 'edu009',
    programName: '音乐学习中心',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T14:30:00')
  },
  {
    id: '38',
    firstLevel: '教育服务',
    secondLevel: '婴幼儿教育',
    programId: 'edu010',
    programName: '儿童启蒙课程',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T09:30:00')
  },
  // ============ 教育服务 - 一周前的浏览记录 ============
  {
    id: '39',
    firstLevel: '教育服务',
    secondLevel: '在线视频课程',
    programId: 'edu011',
    programName: '知识付费平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-01T16:00:00')
  },
  {
    id: '40',
    firstLevel: '教育服务',
    secondLevel: '学历教育（培训机构）',
    programId: 'edu012',
    programName: '成人教育中心',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-27T10:30:00')
  },

  // ============ 医疗服务 - 今天的浏览记录 ============
  {
    id: '41',
    firstLevel: '医疗服务',
    secondLevel: '互联网医院',
    programId: 'med001',
    programName: '在线问诊平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T12:00:00')
  },
  {
    id: '42',
    firstLevel: '医疗服务',
    secondLevel: '互联网医院',
    programId: 'med002',
    programName: '电子处方助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T15:45:00')
  },
  // ============ 医疗服务 - 昨天的浏览记录 ============
  {
    id: '43',
    firstLevel: '医疗服务',
    secondLevel: '就医服务',
    programId: 'med003',
    programName: '在线挂号平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T09:30:00')
  },
  {
    id: '44',
    firstLevel: '医疗服务',
    secondLevel: '互联网医院',
    programId: 'med004',
    programName: '远程医疗平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T14:15:00')
  },
  // ============ 医疗服务 - 2.7的浏览记录 ============
  {
    id: '45',
    firstLevel: '医疗服务',
    secondLevel: '药品信息展示',
    programId: 'med005',
    programName: '药品查询平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T10:00:00')
  },
  {
    id: '46',
    firstLevel: '医疗服务',
    secondLevel: '互联网医院',
    programId: 'med006',
    programName: '健康咨询中心',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T13:20:00')
  },
  // ============ 医疗服务 - 一周前的浏览记录 ============
  {
    id: '47',
    firstLevel: '医疗服务',
    secondLevel: '就医服务',
    programId: 'med007',
    programName: '体检预约平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-30T11:00:00')
  },
  {
    id: '48',
    firstLevel: '医疗服务',
    secondLevel: '互联网医院',
    programId: 'med008',
    programName: '慢病管理平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-26T15:30:00')
  },

  // ============ 生活服务 - 今天的浏览记录 ============
  {
    id: '49',
    firstLevel: '生活服务',
    secondLevel: '丽人服务',
    programId: 'life001',
    programName: '美甲服务预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T10:00:00')
  },
  {
    id: '50',
    firstLevel: '生活服务',
    secondLevel: '丽人服务',
    programId: 'life002',
    programName: '美容护理平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T14:30:00')
  },
  {
    id: '51',
    firstLevel: '生活服务',
    secondLevel: '丽人服务',
    programId: 'life003',
    programName: '美发沙龙预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T16:00:00')
  },
  {
    id: '52',
    firstLevel: '生活服务',
    secondLevel: '家政服务',
    programId: 'life004',
    programName: '家政服务预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T11:30:00')
  },
  {
    id: '53',
    firstLevel: '生活服务',
    secondLevel: '婚庆服务',
    programId: 'life005',
    programName: '婚庆策划平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T15:00:00')
  },
  // ============ 生活服务 - 昨天的浏览记录 ============
  {
    id: '54',
    firstLevel: '生活服务',
    secondLevel: '宠物医院/兽医',
    programId: 'life006',
    programName: '宠物医疗预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T09:45:00')
  },
  {
    id: '55',
    firstLevel: '生活服务',
    secondLevel: '家政服务',
    programId: 'life007',
    programName: '保洁服务预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T13:30:00')
  },
  {
    id: '56',
    firstLevel: '生活服务',
    secondLevel: '丽人服务',
    programId: 'life008',
    programName: '瑜伽课程预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T16:15:00')
  },
  // ============ 生活服务 - 2.7的浏览记录 ============
  {
    id: '57',
    firstLevel: '生活服务',
    secondLevel: '家政服务',
    programId: 'life009',
    programName: '月嫂服务预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T10:30:00')
  },
  {
    id: '58',
    firstLevel: '生活服务',
    secondLevel: '婚庆服务',
    programId: 'life010',
    programName: '婚纱摄影预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T14:00:00')
  },
  {
    id: '59',
    firstLevel: '生活服务',
    secondLevel: '宠物（非医院类）',
    programId: 'life011',
    programName: '宠物美容预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T11:00:00')
  },
  // ============ 生活服务 - 一周前的浏览记录 ============
  {
    id: '60',
    firstLevel: '生活服务',
    secondLevel: '家政服务',
    programId: 'life012',
    programName: '家电维修服务',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-01T15:00:00')
  },
  {
    id: '61',
    firstLevel: '生活服务',
    secondLevel: '丽人服务',
    programId: 'life013',
    programName: '美睫服务预约',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-29T10:15:00')
  },
  {
    id: '62',
    firstLevel: '生活服务',
    secondLevel: '婚庆服务',
    programId: 'life014',
    programName: '婚礼策划案例',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-24T13:45:00')
  },

  // ============ 餐饮服务 - 今天的浏览记录 ============
  {
    id: '63',
    firstLevel: '餐饮服务',
    secondLevel: '点餐平台',
    programId: 'food001',
    programName: '外卖点餐平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T11:45:00')
  },
  {
    id: '64',
    firstLevel: '餐饮服务',
    secondLevel: '外卖平台',
    programId: 'food002',
    programName: '美食外卖平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T12:30:00')
  },
  {
    id: '65',
    firstLevel: '餐饮服务',
    secondLevel: '餐厅排队',
    programId: 'food003',
    programName: '餐厅排队系统',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T13:00:00')
  },
  // ============ 餐饮服务 - 昨天的浏览记录 ============
  {
    id: '66',
    firstLevel: '餐饮服务',
    secondLevel: '点餐平台',
    programId: 'food004',
    programName: '在线点餐助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T11:00:00')
  },
  {
    id: '67',
    firstLevel: '餐饮服务',
    secondLevel: '外卖平台',
    programId: 'food005',
    programName: '美食配送平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T12:15:00')
  },
  // ============ 餐饮服务 - 2.7的浏览记录 ============
  {
    id: '68',
    firstLevel: '餐饮服务',
    secondLevel: '餐厅排队',
    programId: 'food006',
    programName: '取号排队助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T11:30:00')
  },
  {
    id: '69',
    firstLevel: '餐饮服务',
    secondLevel: '点餐平台',
    programId: 'food007',
    programName: '智慧餐厅系统',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T12:00:00')
  },
  // ============ 餐饮服务 - 一周前的浏览记录 ============
  {
    id: '70',
    firstLevel: '餐饮服务',
    secondLevel: '外卖平台',
    programId: 'food008',
    programName: '快餐外卖平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-30T11:15:00')
  },

  // ============ 旅游服务 - 今天的浏览记录 ============
  {
    id: '71',
    firstLevel: '旅游服务',
    secondLevel: '景区服务',
    programId: 'travel001',
    programName: '景区预订平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T10:30:00')
  },
  {
    id: '72',
    firstLevel: '旅游服务',
    secondLevel: '住宿服务',
    programId: 'travel002',
    programName: '酒店预订小程序',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T14:00:00')
  },
  {
    id: '73',
    firstLevel: '旅游服务',
    secondLevel: '景区服务',
    programId: 'travel003',
    programName: '景点门票预订',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T11:15:00')
  },
  // ============ 旅游服务 - 昨天的浏览记录 ============
  {
    id: '74',
    firstLevel: '旅游服务',
    secondLevel: '住宿服务',
    programId: 'travel004',
    programName: '民宿预订平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T09:00:00')
  },
  {
    id: '75',
    firstLevel: '旅游服务',
    secondLevel: '景区服务',
    programId: 'travel005',
    programName: '旅游攻略平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T15:30:00')
  },
  // ============ 旅游服务 - 2.7的浏览记录 ============
  {
    id: '76',
    firstLevel: '旅游服务',
    secondLevel: '旅行社',
    programId: 'travel006',
    programName: '跟团游平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T10:45:00')
  },
  {
    id: '77',
    firstLevel: '旅游服务',
    secondLevel: '住宿服务',
    programId: 'travel007',
    programName: '度假村预订',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T13:15:00')
  },
  // ============ 旅游服务 - 一周前的浏览记录 ============
  {
    id: '78',
    firstLevel: '旅游服务',
    secondLevel: '景区服务',
    programId: 'travel008',
    programName: '导游服务平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-02T11:30:00')
  },

  // ============ 工具 - 今天的浏览记录 ============
  {
    id: '79',
    firstLevel: '工具',
    secondLevel: '记账',
    programId: 'tool001',
    programName: '记账理财小程序',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T08:00:00')
  },
  {
    id: '80',
    firstLevel: '工具',
    secondLevel: '日历',
    programId: 'tool002',
    programName: '日历待办工具',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T09:30:00')
  },
  {
    id: '81',
    firstLevel: '工具',
    secondLevel: '天气',
    programId: 'tool003',
    programName: '天气预报',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T07:45:00')
  },
  {
    id: '82',
    firstLevel: '工具',
    secondLevel: '备忘录',
    programId: 'tool004',
    programName: '备忘录',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T10:15:00')
  },
  // ============ 工具 - 昨天的浏览记录 ============
  {
    id: '83',
    firstLevel: '工具',
    secondLevel: '记账',
    programId: 'tool005',
    programName: '收支记录工具',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T08:30:00')
  },
  {
    id: '84',
    firstLevel: '工具',
    secondLevel: '日历',
    programId: 'tool006',
    programName: '日程管理助手',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T09:00:00')
  },
  {
    id: '85',
    firstLevel: '工具',
    secondLevel: '信息查询',
    programId: 'tool007',
    programName: '信息查询工具',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T14:30:00')
  },
  // ============ 工具 - 2.7的浏览记录 ============
  {
    id: '86',
    firstLevel: '工具',
    secondLevel: '计算器',
    programId: 'tool008',
    programName: '计算器工具',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T10:00:00')
  },
  {
    id: '87',
    firstLevel: '工具',
    secondLevel: '报价/比价',
    programId: 'tool009',
    programName: '商品比价工具',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T11:15:00')
  },
  // ============ 工具 - 一周前的浏览记录 ============
  {
    id: '88',
    firstLevel: '工具',
    secondLevel: '健康管理',
    programId: 'tool010',
    programName: '健康记录工具',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-29T08:15:00')
  },
  {
    id: '89',
    firstLevel: '工具',
    secondLevel: '预约/报名',
    programId: 'tool011',
    programName: '活动报名平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-25T10:45:00')
  },

  // ============ 商业服务 - 今天的浏览记录 ============
  {
    id: '90',
    firstLevel: '商业服务',
    secondLevel: '法律服务平台',
    programId: 'biz001',
    programName: '法律咨询平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T13:00:00')
  },
  {
    id: '91',
    firstLevel: '商业服务',
    secondLevel: '企业管理',
    programId: 'biz002',
    programName: '企业办公管理',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T15:15:00')
  },
  {
    id: '92',
    firstLevel: '商业服务',
    secondLevel: '会展服务',
    programId: 'biz003',
    programName: '会展服务小程序',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-09T11:30:00')
  },
  // ============ 商业服务 - 昨天的浏览记录 ============
  {
    id: '93',
    firstLevel: '商业服务',
    secondLevel: '企业管理',
    programId: 'biz004',
    programName: '办公协作平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T14:00:00')
  },
  {
    id: '94',
    firstLevel: '商业服务',
    secondLevel: '广告/设计',
    programId: 'biz005',
    programName: '设计服务平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-08T10:30:00')
  },
  // ============ 商业服务 - 2.7的浏览记录 ============
  {
    id: '95',
    firstLevel: '商业服务',
    secondLevel: '法律服务平台',
    programId: 'biz006',
    programName: '法律文书平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T09:15:00')
  },
  {
    id: '96',
    firstLevel: '商业服务',
    secondLevel: '会展服务',
    programId: 'biz007',
    programName: '展会信息平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-02-07T13:45:00')
  },
  // ============ 商业服务 - 一周前的浏览记录 ============
  {
    id: '97',
    firstLevel: '商业服务',
    secondLevel: '企业管理',
    programId: 'biz008',
    programName: '人力资源系统',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-31T11:00:00')
  },
  {
    id: '98',
    firstLevel: '商业服务',
    secondLevel: '公关/推广/市场调查',
    programId: 'biz009',
    programName: '市场调研平台',
    programIcon: '/static/haidu.jpg',
    browseTime: new Date('2026-01-27T14:20:00')
  }
])

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载所有类目数据
  allCategories.value = getAllMergedCategories()
  console.log('加载的类目数量:', allCategories.value.length)
})

// 当前一级类目
const currentFirstLevelCategory = computed(() => {
  return allCategories.value[currentFirstLevel.value]
})

// 当前一级类目下的所有二级类目
const currentSecondLevelCategories = computed(() => {
  return currentFirstLevelCategory.value?.secondLevel || []
})

// 当前选中的一级和二级类目名称
const currentFirstLevelName = computed(() => {
  return currentFirstLevelCategory.value?.name || ''
})

const currentSecondLevelName = computed(() => {
  return currentSecondLevelCategories.value[currentSecondLevel.value]?.name || ''
})

// 时间轴分组（根据当前选中的一级+二级类目过滤）
const timelineGroups = computed(() => {
  const groups: TimelineGroup[] = []
  const today = new Date('2026-02-09') // 假设今天是2026.2.9

  // 过滤出当前选中类目的浏览记录
  const currentRecords = browseHistory.value.filter(record => {
    return record.firstLevel === currentFirstLevelName.value &&
           record.secondLevel === currentSecondLevelName.value
  })

  // 按时间分组
  const todayRecords: BrowseRecord[] = []
  const yesterdayRecords: BrowseRecord[] = []
  const thisWeekRecords: BrowseRecord[] = []
  const lastWeekRecords: BrowseRecord[] = []
  const lastMonthRecords: BrowseRecord[] = []

  currentRecords.forEach(record => {
    const diffTime = today.getTime() - record.browseTime.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      todayRecords.push(record)
    } else if (diffDays === 1) {
      yesterdayRecords.push(record)
    } else if (diffDays < 7) {
      thisWeekRecords.push(record)
    } else if (diffDays < 30) {
      lastWeekRecords.push(record)
    } else {
      lastMonthRecords.push(record)
    }
  })

  // 构建分组
  if (todayRecords.length > 0) {
    groups.push({ label: '今天', count: todayRecords.length, programs: todayRecords })
  }
  if (yesterdayRecords.length > 0) {
    groups.push({ label: '昨天', count: yesterdayRecords.length, programs: yesterdayRecords })
  }

  // 添加一周内的具体日期
  const specificDates: { [key: string]: BrowseRecord[] } = {}
  thisWeekRecords.forEach(record => {
    const dateKey = `${record.browseTime.getMonth() + 1}.${record.browseTime.getDate()}`
    if (!specificDates[dateKey]) {
      specificDates[dateKey] = []
    }
    specificDates[dateKey].push(record)
  })

  Object.keys(specificDates).sort().reverse().forEach(dateKey => {
    groups.push({
      label: dateKey,
      count: specificDates[dateKey].length,
      programs: specificDates[dateKey]
    })
  })

  if (lastWeekRecords.length > 0) {
    groups.push({ label: '一周前', count: lastWeekRecords.length, programs: lastWeekRecords })
  }
  if (lastMonthRecords.length > 0) {
    groups.push({ label: '一个月前', count: lastMonthRecords.length, programs: lastMonthRecords })
  }

  return groups
})

// 当前选中时间分组的小程序列表
const currentTimelinePrograms = computed(() => {
  if (selectedTimeIndex.value >= 0 && timelineGroups.value[selectedTimeIndex.value]) {
    return timelineGroups.value[selectedTimeIndex.value].programs
  }
  return []
})

// 当前选中时间分组的标签
const currentTimeGroupLabel = computed(() => {
  if (selectedTimeIndex.value >= 0 && timelineGroups.value[selectedTimeIndex.value]) {
    return timelineGroups.value[selectedTimeIndex.value].label
  }
  return '请选择时间段'
})

// 切换一级类目
const handleFirstLevelChange = (index: number) => {
  currentFirstLevel.value = index
  currentSecondLevel.value = 0 // 重置二级类目选择
  selectedTimeIndex.value = 0 // 重置时间选择
  console.log('切换一级类目:', allCategories.value[index].name)
}

// 切换二级类目
const handleSecondLevelChange = (index: number) => {
  currentSecondLevel.value = index
  selectedTimeIndex.value = 0 // 重置时间选择
  console.log('切换二级类目:', currentSecondLevelCategories.value[index].name)
}

// 选择时间分组
const handleTimeGroupSelect = (index: number) => {
  selectedTimeIndex.value = index
  console.log('选择时间分组:', timelineGroups.value[index].label)
}

// 点击小程序卡片
const handleProgramClick = (program: BrowseRecord) => {
  console.log('点击小程序:', program.programName)
  uni.showToast({
    title: `打开${program.programName}`,
    icon: 'none'
  })
  // TODO: 跳转到小程序详情页
}

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    delta: 1
  })
}
</script>

<style scoped lang="scss">
.browse-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

// 自定义导航栏
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #ff9500 0%, #ff6a00 100%);
  box-shadow: 0 2rpx 8rpx rgba(255, 106, 0, 0.1);

  .navbar-content {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
  }

  .back-btn {
    display: flex;
    align-items: center;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    background-color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s;

    .back-icon {
      font-size: 40rpx;
      color: #ffffff;
      font-weight: bold;
      margin-right: 4rpx;
    }

    .back-text {
      font-size: 28rpx;
      color: #ffffff;
      font-weight: 500;
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.3);
      transform: scale(0.95);
    }
  }

  .navbar-title {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .title-text {
      font-size: 36rpx;
      font-weight: bold;
      color: #ffffff;
    }
  }

  .navbar-placeholder {
    width: 120rpx;
  }
}

// 页面内容区域
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// 一级类目标签栏
.first-level-tabs {
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;

  .first-tabs-scroll {
    width: 100%;
    white-space: nowrap;
  }

  .first-tabs-wrapper {
    display: inline-flex;
    padding: 0 20rpx;
  }

  .first-tab-item {
    flex-shrink: 0;
    padding: 28rpx 32rpx;
    transition: all 0.3s;

    .tab-text {
      font-size: 30rpx;
      color: #666;
      font-weight: 500;
    }

    &.active {
      .tab-text {
        color: #ff6a00;
        font-weight: bold;
      }
    }
  }
}

// 二级类目标签栏
.second-level-tabs {
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;

  .second-tabs-scroll {
    width: 100%;
    white-space: nowrap;
  }

  .second-tabs-wrapper {
    display: inline-flex;
    padding: 0 20rpx;
  }

  .second-tab-item {
    flex-shrink: 0;
    padding: 24rpx 28rpx;
    transition: all 0.3s;

    .tab-text {
      font-size: 28rpx;
      color: #666;
    }

    &.active {
      .tab-text {
        color: #ff6a00;
        font-weight: bold;
      }
    }
  }
}

// 主内容区
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// 左侧时间轴侧边栏
.timeline-sidebar {
  width: 200rpx;
  background-color: #ffffff;
  border-right: 1rpx solid #e0e0e0;

  .timeline-content {
    padding: 20rpx 0;
  }

  .timeline-group {
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    transition: all 0.3s;

    &:last-child {
      border-bottom: none;
    }

    &.active {
      background-color: #fff3e0;

      .time-text {
        color: #ff6a00 !important;
        font-weight: bold !important;
      }
    }

    .time-label {
      margin-bottom: 8rpx;

      .time-text {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
    }

    .time-count {
      .count-text {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 右侧小程序内容
.mini-programs-content {
  flex: 1;
  background-color: #f5f5f5;
}

.programs-wrapper {
  padding: 30rpx;
  min-height: 100%;
}

.current-time-title {
  margin-bottom: 30rpx;

  .time-title-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

// 小程序卡片网格
.mini-program-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding-bottom: 40rpx;

  .mini-program-card {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
    }

    .program-image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 16rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      .icon-img {
        width: 100%;
        height: 100%;
      }
    }

    .program-name {
      font-size: 26rpx;
      font-weight: 500;
      color: #333;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 60rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 40rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
