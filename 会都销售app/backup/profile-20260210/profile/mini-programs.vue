<template>
  <view class="mini-programs-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">我的小程序</view>
      </view>
    </view>

    <!-- 小程序列表 -->
    <view class="programs-list">
      <view
        v-for="program in miniPrograms"
        :key="program.id"
        class="program-item"
        @tap="handleProgramClick(program)"
      >
        <view class="program-icon-wrapper">
          <image
            v-if="program.icon"
            class="program-icon"
            :src="program.icon"
            mode="aspectFill"
          />
          <view v-else class="program-icon default">
            <text class="program-emoji">{{ program.emoji || '📱' }}</text>
          </view>

          <!-- 状态标签组 -->
          <view class="status-tags">
            <!-- 审核状态标签 -->
            <view
              v-if="program.auditStatus !== 'approved'"
              class="status-tag audit"
              :class="`status-${program.auditStatus}`"
            >
              <text class="tag-text">{{ getAuditStatusText(program.auditStatus) }}</text>
            </view>

            <!-- 开发状态标签 -->
            <view
              class="status-tag development"
              :class="`status-${program.developmentStatus}`"
            >
              <text class="tag-text">
                {{ getDevelopmentStatusText(program.developmentStatus) }}
                <text v-if="program.progress" class="progress-text">
                  {{ program.progress }}%
                </text>
              </text>
            </view>
          </view>
        </view>

        <view class="program-info">
          <text class="program-name">{{ program.name }}</text>
          <text class="program-desc">{{ program.description || '暂无描述' }}</text>

          <!-- 进度信息 -->
          <view v-if="program.auditStatus === 'reviewing'" class="audit-info">
            <text class="info-text">已提交 {{ getDaysSince(program.submitTime) }} 天</text>
            <text class="info-hint">预计1-3个工作日完成审核</text>
          </view>
          <view v-else-if="program.developmentStatus === 'developing'" class="development-info">
            <view class="progress-bar">
              <view
                class="progress-fill"
                :style="{ width: program.progress + '%' }"
              ></view>
            </view>
            <text class="info-text">
              当前阶段：{{ program.currentPhase }} ({{ program.progress }}%)
            </text>
            <text class="info-hint">预计完成：{{ program.estimatedCompletionTime }}</text>
          </view>
          <view v-else-if="program.developmentStatus === 'ready'" class="ready-info">
            <text class="ready-badge">✓ 已就绪</text>
            <text class="info-hint">可正常使用，点击进入管理后台</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="program-actions">
          <button
            v-if="program.developmentStatus === 'ready'"
            class="action-btn primary"
            @tap.stop="enterAdmin(program)"
          >
            进入管理
          </button>
          <button
            v-else
            class="action-btn"
            @tap.stop="viewDetail(program)"
          >
            查看详情
          </button>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="miniPrograms.length === 0" class="empty-state">
        <text class="empty-icon">📱</text>
        <text class="empty-text">还没有小程序</text>
        <text class="empty-hint">快去选购模板，开始创建您的小程序吧</text>
        <button class="empty-action-btn" @tap="goToIndex">去选购模板</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 小程序列表
const miniPrograms = ref([
  {
    id: 'mp_001',
    name: '张三的零售商城',
    icon: '/static/haidu.jpg',
    emoji: '🏪',
    description: '完整的电商解决方案',

    // 审核状态
    auditStatus: 'approved', // initializing, reviewing, approved, rejected
    submitTime: '2025-01-20',
    auditTime: '2025-01-22',

    // 开发状态
    developmentStatus: 'developing', // not_started, developing, ready
    progress: 60,
    currentPhase: '功能开发',
    estimatedCompletionTime: '2025-02-20',
    phases: [
      { phase: 1, name: '环境搭建', status: 'completed', progress: 100 },
      { phase: 2, name: '基础配置', status: 'completed', progress: 100 },
      { phase: 3, name: '功能开发', status: 'in_progress', progress: 60 },
      { phase: 4, name: '测试验收', status: 'pending', progress: 0 },
      { phase: 5, name: '部署上线', status: 'pending', progress: 0 }
    ]
  },
  {
    id: 'mp_002',
    name: '李四的餐饮店',
    icon: '',
    emoji: '🍔',
    description: '在线点餐、外卖配送',

    // 审核状态
    auditStatus: 'reviewing',
    submitTime: '2025-02-08',

    // 开发状态
    developmentStatus: 'not_started'
  },
  {
    id: 'mp_003',
    name: '唐极课得',
    icon: '',
    emoji: '📚',
    description: '官方认证小程序',

    // 审核状态
    auditStatus: 'approved',
    auditTime: '2025-01-15',

    // 开发状态
    developmentStatus: 'ready',
    progress: 100,

    // 拉起配置（用于App拉起测试）
    launchConfig: {
      appId: 'wx1955c821fb20be63', // 移动应用的AppId
      userName: 'gh_f4a3f5dda07f', // 小程序原始ID（从微信公众平台获取）
      miniProgramType: 'trial' // 体验版
    }
  }
])

// 获取审核状态文本
const getAuditStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    initializing: '初始化中',
    reviewing: '审核中',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return statusMap[status] || '未知'
}

// 获取开发状态文本
const getDevelopmentStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    not_started: '未开始',
    developing: '开发中',
    ready: '已就绪'
  }
  return statusMap[status] || '未知'
}

// 计算天数差
const getDaysSince = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

// 处理小程序卡片点击
const handleProgramClick = (program: any) => {
  console.log('[小程序管理] 点击小程序:', program.name, '审核状态:', program.auditStatus, '开发状态:', program.developmentStatus)

  // 已就绪的小程序，直接进入管理后台
  if (program.developmentStatus === 'ready') {
    enterAdmin(program)
    return
  }

  // 其他状态，显示详情弹窗
  viewDetail(program)
}

// 查看详情
const viewDetail = (program: any) => {
  if (program.auditStatus === 'reviewing') {
    uni.showModal({
      title: '小程序审核状态',
      content: `您的「${program.name}」正在审核中\n\n提交时间：${program.submitTime}\n已等待：${getDaysSince(program.submitTime)} 天\n预计完成：1-3个工作日`,
      showCancel: false
    })
  } else if (program.developmentStatus === 'developing') {
    uni.showModal({
      title: '小程序开发进度',
      content: `您的「${program.name}」正在开发中\n\n当前进度：${program.progress}%\n当前阶段：${program.currentPhase}\n预计完成：${program.estimatedCompletionTime}`,
      showCancel: false
    })
  }
}

// 进入管理后台
const enterAdmin = (program: any) => {
  console.log('[小程序管理] 进入管理后台:', program.name)
  uni.navigateTo({
    url: `/pages/mini-admin/index?miniProgramId=${program.id}&name=${encodeURIComponent(program.name)}`
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到首页
const goToIndex = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.mini-programs-page {
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
    height: 88rpx;
    padding: 0 20rpx;

    .nav-back {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .back-icon {
        font-size: 40rpx;
        color: #fff;
        font-weight: bold;
      }
    }

    .nav-title {
      flex: 1;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
      margin-right: 60rpx;
    }
  }
}

// 小程序列表
.programs-list {
  padding: calc(var(--status-bar-height) + 88rpx + 30rpx) 30rpx 30rpx;
}

.program-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .program-icon-wrapper {
    position: relative;
    margin-bottom: 20rpx;

    .program-icon {
      width: 120rpx;
      height: 120rpx;
      border-radius: 20rpx;
      overflow: hidden;

      &.default {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;

        .program-emoji {
          font-size: 64rpx;
        }
      }
    }

    .status-tags {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      display: flex;
      flex-direction: column;
      gap: 6rpx;

      .status-tag {
        padding: 6rpx 12rpx;
        border-radius: 12rpx;
        font-size: 20rpx;
        white-space: nowrap;
        line-height: 1.4;

        .progress-text {
          font-size: 18rpx;
          opacity: 0.8;
        }

        &.audit {
          background: rgba(33, 150, 243, 0.9);
          color: #fff;

          &.status-reviewing {
            background: rgba(33, 150, 243, 0.9);
          }

          &.status-approved {
            background: rgba(7, 193, 96, 0.9);
          }

          &.status-rejected {
            background: rgba(255, 59, 48, 0.9);
          }
        }

        &.development {
          background: rgba(255, 149, 0, 0.9);
          color: #fff;

          &.status-not_started {
            background: rgba(153, 153, 153, 0.9);
          }

          &.status-developing {
            background: rgba(255, 149, 0, 0.9);
          }

          &.status-ready {
            background: rgba(7, 193, 96, 0.9);
          }
        }
      }
    }
  }

  .program-info {
    .program-name {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 10rpx;
    }

    .program-desc {
      display: block;
      font-size: 26rpx;
      color: #999;
      margin-bottom: 20rpx;
    }

    .audit-info,
    .development-info,
    .ready-info {
      margin-top: 16rpx;

      .info-text {
        display: block;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 8rpx;
      }

      .info-hint {
        display: block;
        font-size: 24rpx;
        color: #999;
      }

      .ready-badge {
        display: inline-block;
        padding: 8rpx 20rpx;
        background: #e8f5e9;
        color: #07c160;
        border-radius: 20rpx;
        font-size: 24rpx;
        font-weight: 500;
        margin-bottom: 8rpx;
      }
    }

    .development-info {
      .progress-bar {
        width: 100%;
        height: 12rpx;
        background: #f0f0f0;
        border-radius: 6rpx;
        overflow: hidden;
        margin-bottom: 12rpx;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff9500 0%, #ff6a00 100%);
          transition: width 0.3s;
        }
      }
    }
  }

  .program-actions {
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .action-btn {
      width: 100%;
      height: 72rpx;
      line-height: 72rpx;
      text-align: center;
      background: #f5f5f5;
      color: #666;
      border: none;
      border-radius: 12rpx;
      font-size: 28rpx;

      &.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        font-weight: 500;
      }

      &::after {
        border: none;
      }
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 10rpx;
  }

  .empty-hint {
    font-size: 24rpx;
    color: #ccc;
    margin-bottom: 40rpx;
  }

  .empty-action-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 48rpx;
    padding: 20rpx 48rpx;
    font-size: 28rpx;
  }
}
</style>
