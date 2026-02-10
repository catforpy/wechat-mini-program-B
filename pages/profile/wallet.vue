<template>
  <view class="wallet-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">我的钱包</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 余额显示 -->
      <view class="balance-section">
        <view class="balance-card">
          <view class="balance-item">
            <text class="balance-label">都达豆</text>
            <text class="balance-value">{{ balance.douDou }}</text>
          </view>
          <view class="balance-divider">
            <text class="divider-text">10:1</text>
          </view>
          <view class="balance-item">
            <text class="balance-label">人民币</text>
            <text class="balance-value">{{ balance.rmb }}</text>
          </view>
        </view>
      </view>

      <!-- 可购买的小程序列表 -->
      <view class="section">
        <text class="section-title">小程序商城</text>
        <view class="mini-program-grid">
          <view
            v-for="(program, index) in miniPrograms"
            :key="index"
            class="mini-program-card"
            @tap="handleCardClick(program)"
            @longpress="handleCardLongPress(program, $event)"
          >
            <view class="program-icon">
              <text v-if="program.emoji" class="program-emoji">{{ program.emoji }}</text>
              <image v-else-if="program.icon" :src="program.icon" mode="aspectFill" class="program-image" />
              <text v-else class="program-placeholder">{{ program.name[0] }}</text>
            </view>
            <text class="program-name">{{ program.name }}</text>
            <view class="program-price-row">
              <text class="program-price">¥{{ program.price }}</text>
              <text class="program-price-dou">{{ program.price }}0都达豆</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 长按弹出菜单 -->
      <view v-if="showActionMenu" class="action-menu-overlay" @tap="hideActionMenu">
        <view
          class="action-menu"
          :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
          @tap.stop
        >
          <view
            v-if="!selectedProgram?.isFollowed"
            class="menu-item"
            @tap="handleMenuAction('follow')"
          >
            <text class="menu-text">关注</text>
          </view>
          <view
            v-else
            class="menu-item"
            @tap="handleMenuAction('unfollow')"
          >
            <text class="menu-text">取消关注</text>
          </view>
          <view class="menu-item" @tap="handleMenuAction('register')">
            <text class="menu-text">我要申请注册</text>
          </view>
          <view class="menu-item" @tap="handleMenuAction('cooperate')">
            <text class="menu-text">我要申请合作</text>
          </view>
          <view class="menu-item" @tap="handleMenuAction('rent')">
            <text class="menu-text">我要申请租赁</text>
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

// 余额数据
const balance = ref({
  douDou: 10000,  // 都达豆
  rmb: 1000       // 人民币
})

// 小程序列表
interface MiniProgram {
  id: string
  name: string
  emoji?: string
  icon?: string
  price: string
  isFollowed: boolean
}

const miniPrograms = ref<MiniProgram[]>([
  {
    id: '1',
    name: '餐饮点餐系统',
    emoji: '🍔',
    price: '599',
    isFollowed: false
  },
  {
    id: '2',
    name: '零售商城',
    emoji: '🛒',
    price: '799',
    isFollowed: false
  },
  {
    id: '3',
    name: '在线教育平台',
    emoji: '🎓',
    price: '999',
    isFollowed: false
  },
  {
    id: '4',
    name: '美业预约',
    emoji: '💅',
    price: '499',
    isFollowed: false
  },
  {
    id: '5',
    name: '酒店预订',
    emoji: '🏨',
    price: '699',
    isFollowed: false
  },
  {
    id: '6',
    name: '生鲜配送',
    emoji: '🥬',
    price: '899',
    isFollowed: false
  },
  {
    id: '7',
    name: '宠物服务',
    emoji: '🐕',
    price: '399',
    isFollowed: false
  },
  {
    id: '8',
    name: '家政服务',
    emoji: '🏠',
    price: '599',
    isFollowed: false
  },
  {
    id: '9',
    name: '健身预约',
    emoji: '💪',
    price: '699',
    isFollowed: false
  }
])

// 长按菜单状态
const showActionMenu = ref(false)
const menuPosition = ref({ top: 0, left: 0 })
const selectedProgram = ref<MiniProgram | null>(null)

// 点击卡片
const handleCardClick = (program: MiniProgram) => {
  console.log('点击小程序:', program)
  uni.showToast({
    title: program.name,
    icon: 'none'
  })
  // TODO: 打开小程序详情或购买页面
}

// 长按卡片
const handleCardLongPress = (program: MiniProgram, event: any) => {
  console.log('长按小程序:', program, event)

  // 获取触摸位置
  const touch = event.touches?.[0] || event.changedTouches?.[0]
  if (touch) {
    const x = touch.clientX || 0
    const y = touch.clientY || 0

    // 获取系统信息（屏幕宽度）
    const systemInfo = uni.getSystemInfoSync()
    const screenWidth = systemInfo.screenWidth || 375
    const screenHeight = systemInfo.screenHeight || 667

    // 菜单宽度（rpx转px）
    const menuWidth = 280 // 菜单宽度 rpx
    const rpxToPx = screenWidth / 750
    const menuWidthPx = menuWidth * rpxToPx

    // 计算菜单位置，确保不超出屏幕边界
    let menuLeft = x - menuWidthPx / 2 // 默认居中

    // 左边界检测：菜单不能超出屏幕左侧
    if (menuLeft < 20) {
      menuLeft = 20
    }

    // 右边界检测：菜单不能超出屏幕右侧
    if (menuLeft + menuWidthPx > screenWidth - 20) {
      menuLeft = screenWidth - menuWidthPx - 20
    }

    // 上边界检测：菜单不能超出屏幕顶部
    const menuHeightPx = 250 // 估算菜单高度
    let menuTop = y - 100
    if (menuTop < 80) { // 留出顶部状态栏空间
      menuTop = 80
    }

    // 下边界检测：菜单不能超出屏幕底部
    if (menuTop + menuHeightPx > screenHeight - 20) {
      menuTop = screenHeight - menuHeightPx - 20
    }

    menuPosition.value = {
      top: menuTop,
      left: menuLeft
    }
  }

  selectedProgram.value = program
  showActionMenu.value = true

  // 震动反馈
  uni.vibrateShort()
}

// 隐藏菜单
const hideActionMenu = () => {
  showActionMenu.value = false
  selectedProgram.value = null
}

// 处理菜单操作
const handleMenuAction = (action: string) => {
  const program = selectedProgram.value
  if (!program) return

  console.log('菜单操作:', action, program)

  switch (action) {
    case 'follow':
      // 关注
      program.isFollowed = true
      uni.showToast({
        title: `已关注 ${program.name}`,
        icon: 'success'
      })
      break

    case 'unfollow':
      // 取消关注
      program.isFollowed = false
      uni.showToast({
        title: `已取消关注 ${program.name}`,
        icon: 'none'
      })
      break

    case 'register':
      // 我要注册 - 检查企业资质
      handleRegister(program)
      break

    case 'cooperate':
      // 我要合作 - 检查合作信息
      handleCooperate(program)
      break

    case 'rent':
      // 我要租赁 - 检查租赁信息
      handleRent(program)
      break
  }

  hideActionMenu()
}

// 处理注册逻辑
const handleRegister = (program: MiniProgram) => {
  try {
    const saved = uni.getStorageSync('my_qualifications')
    if (!saved) {
      // 没有企业资质，提示用户去完善
      uni.showModal({
        title: '提示',
        content: '注册小程序需要先完善企业资质信息\n\n是否前往"我的"页面添加资质？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    const qualifications = JSON.parse(saved) as any[]
    if (qualifications.length === 0) {
      uni.showModal({
        title: '提示',
        content: '注册小程序需要先完善企业资质信息\n\n是否前往"我的"页面添加资质？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    if (qualifications.length === 1) {
      // 只有一个资质，直接使用
      const company = qualifications[0]
      uni.showModal({
        title: '确认注册',
        content: `使用"${company.name}"注册${program.name}？`,
        success: (res) => {
          if (res.confirm) {
            // TODO: 调用注册API
            uni.showToast({
              title: '注册成功',
              icon: 'success'
            })
          }
        }
      })
    } else {
      // 多个资质，弹出选择框
      const companyNames = qualifications.map(q => q.name)
      uni.showActionSheet({
        itemList: companyNames,
        success: (res) => {
          const selectedCompany = qualifications[res.tapIndex]
          uni.showModal({
            title: '确认注册',
            content: `使用"${selectedCompany.name}"注册${program.name}？`,
            success: (res2) => {
              if (res2.confirm) {
                // TODO: 调用注册API
                uni.showToast({
                  title: '注册成功',
                  icon: 'success'
                })
              }
            }
          })
        }
      })
    }
  } catch (e) {
    console.error('读取企业资质失败:', e)
    uni.showToast({
      title: '读取资质信息失败',
      icon: 'none'
    })
  }
}

// 处理合作逻辑
const handleCooperate = (program: MiniProgram) => {
  try {
    const saved = uni.getStorageSync('my_cooperations')
    if (!saved) {
      uni.showModal({
        title: '提示',
        content: '合作小程序需要先完善合作信息\n\n是否前往"我的"页面添加合作信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    const cooperations = JSON.parse(saved) as any[]
    if (cooperations.length === 0) {
      uni.showModal({
        title: '提示',
        content: '合作小程序需要先完善合作信息\n\n是否前往"我的"页面添加合作信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    // TODO: 显示合作信息列表让用户选择
    uni.showToast({
      title: '选择合作主体',
      icon: 'none'
    })
  } catch (e) {
    console.error('读取合作信息失败:', e)
  }
}

// 处理租赁逻辑
const handleRent = (program: MiniProgram) => {
  try {
    const saved = uni.getStorageSync('my_leasings')
    if (!saved) {
      uni.showModal({
        title: '提示',
        content: '租赁小程序需要先完善租赁信息\n\n是否前往"我的"页面添加租赁信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    const leasings = JSON.parse(saved) as any[]
    if (leasings.length === 0) {
      uni.showModal({
        title: '提示',
        content: '租赁小程序需要先完善租赁信息\n\n是否前往"我的"页面添加租赁信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/profile/index-new'
            })
          }
        }
      })
      return
    }

    // TODO: 显示租赁信息列表让用户选择
    uni.showToast({
      title: '选择租赁主体',
      icon: 'none'
    })
  } catch (e) {
    console.error('读取租赁信息失败:', e)
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.wallet-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

// 顶部导航栏
.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 20rpx;

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    height: 88rpx;

    .back-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;

      .back-icon {
        font-size: 48rpx;
        color: #fff;
        font-weight: 300;
      }

      &:active {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .nav-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }

    .placeholder {
      width: 60rpx;
    }
  }
}

// 主内容区域
.main-content {
  padding: 20rpx;
  padding-bottom: 40rpx;
}

// 余额区域
.balance-section {
  margin-bottom: 30rpx;

  .balance-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);

    .balance-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .balance-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 8rpx;
      }

      .balance-value {
        font-size: 48rpx;
        font-weight: 700;
        color: #fff;
      }
    }

    .balance-divider {
      width: 2rpx;
      height: 60rpx;
      background: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;

      .divider-text {
        writing-mode: vertical-rl;
        font-size: 20rpx;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}

// 小程序网格
.section {
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
    padding: 0 10rpx;
  }
}

.mini-program-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;

  .mini-program-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    transition: all 0.3s;

    .program-icon {
      width: 88rpx;
      height: 88rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin-bottom: 16rpx;

      .program-emoji {
        font-size: 52rpx;
      }

      .program-image {
        width: 100%;
        height: 100%;
        border-radius: 16rpx;
      }

      .program-placeholder {
        font-size: 48rpx;
        font-weight: 600;
        color: #fff;
      }
    }

    .program-name {
      font-size: 26rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 8rpx;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    .program-price-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4rpx;
    }

    .program-price {
      font-size: 28rpx;
      font-weight: 600;
      color: #ff5722;
      text-align: center;
    }

    .program-price-dou {
      font-size: 22rpx;
      color: #999;
      text-align: center;
    }

    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    }
  }
}

// 长按弹出菜单
.action-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
}

.action-menu {
  position: fixed;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 12rpx 0;
  min-width: 280rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  z-index: 10000;
  animation: menuSlideIn 0.2s ease-out;

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28rpx 32rpx;
    transition: background 0.2s;

    &:active {
      background: #f5f5f5;
    }

    &:not(:last-child) {
      border-bottom: 1rpx solid #f0f0f0;
    }

    .menu-text {
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
    }
  }
}

@keyframes menuSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
