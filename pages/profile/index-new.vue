<template>
  <view class="profile-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-title">我的</text>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- ========== 模块1：我的注册 ========== -->
      <view class="module-section">
        <view class="module-header" @tap="toggleModule('registration')">
          <text class="module-title">我的注册</text>
          <text class="module-desc">{{ qualifications.length }}个公司/个体工商户</text>
          <text class="expand-icon">{{ expandedModules.registration ? '▼' : '▶' }}</text>
        </view>

        <view v-if="expandedModules.registration" class="module-content">
          <!-- 资质列表 -->
          <view v-if="qualifications.length > 0" class="qualification-list">
            <view
              v-for="item in qualifications"
              :key="item.id"
              class="qualification-card"
              @tap="goToCompanyDetail(item)"
              @longpress="showCardMenu(item)"
            >
              <view class="card-main">
                <view class="card-left">
                  <text class="company-name">{{ item.name }}</text>
                  <text class="company-meta">{{ item.type === 'company' ? '企业' : '个体工商户' }} · {{ item.registrationDate }}</text>
                </view>
                <view class="card-right">
                  <view class="status-badge" :class="item.status">
                    <text>{{ getStatusText(item.status) }}</text>
                  </view>
                </view>
              </view>
              <view class="card-footer">
                <text class="footer-text">{{ item.miniProgramCount }}个小程序</text>
              </view>
            </view>
          </view>

          <!-- 空状态 -->
          <view v-else class="empty-state">
            <text class="empty-text">还没有添加任何公司资质</text>
            <text class="empty-hint">添加公司资质后即可购买和管理小程序</text>
          </view>

          <!-- 添加新资质按钮 -->
          <view class="add-qualification-btn" @tap="addQualification">
            <text class="btn-text">添加新资质</text>
          </view>
        </view>
      </view>

      <!-- ========== 模块2：我的合作 ========== -->
      <view class="module-section">
        <view class="module-header" @tap="toggleModule('cooperation')">
          <text class="module-title">我的合作</text>
          <text class="module-desc">{{ cooperationApps.length }}个合作小程序</text>
          <text class="expand-icon">{{ expandedModules.cooperation ? '▼' : '▶' }}</text>
        </view>

        <view v-if="expandedModules.cooperation" class="module-content">
          <!-- 合作小程序列表 -->
          <view v-if="cooperationApps.length > 0" class="app-list">
            <view
              v-for="app in cooperationApps"
              :key="app.id"
              class="app-item"
              @tap="viewAppDetail(app)"
            >
              <view class="app-left">
                <text class="app-name">{{ app.name }}</text>
                <text class="app-meta">{{ app.role }} · {{ app.cooperationDate }}</text>
              </view>
            </view>
          </view>

          <!-- 空状态 -->
          <view v-else class="empty-state">
            <text class="empty-text">还没有参与任何合作</text>
          </view>

          <!-- 操作按钮 -->
          <view class="action-buttons">
            <view class="action-btn" @tap="addCooperationQualification">
              <text class="btn-text">添加合作资质</text>
            </view>
            <view class="action-btn primary" @tap="addCooperationApp">
              <text class="btn-text">增加合作小程序</text>
            </view>
          </view>
        </view>
      </view>

      <!-- ========== 模块3：我的租赁 ========== -->
      <view class="module-section">
        <view class="module-header" @tap="toggleModule('leasing')">
          <text class="module-title">我的租赁</text>
          <text class="module-desc">{{ leasingApps.length }}个租赁小程序</text>
          <text class="expand-icon">{{ expandedModules.leasing ? '▼' : '▶' }}</text>
        </view>

        <view v-if="expandedModules.leasing" class="module-content">
          <!-- 租赁小程序列表 -->
          <view v-if="leasingApps.length > 0" class="app-list">
            <view
              v-for="app in leasingApps"
              :key="app.id"
              class="app-item"
              @tap="viewAppDetail(app)"
            >
              <view class="app-left">
                <text class="app-name">{{ app.name }}</text>
                <text class="app-meta">{{ app.period }} · {{ app.monthlyFee }}</text>
              </view>
            </view>
          </view>

          <!-- 空状态 -->
          <view v-else class="empty-state">
            <text class="empty-text">还没有租赁任何小程序</text>
          </view>

          <!-- 操作按钮 -->
          <view class="action-buttons">
            <view class="action-btn" @tap="addLeasingQualification">
              <text class="btn-text">添加租赁资质</text>
            </view>
            <view class="action-btn primary" @tap="addLeasingApp">
              <text class="btn-text">增加租赁小程序</text>
            </view>
          </view>
        </view>
      </view>

      <!-- ========== 模块4：我的关注 ========== -->
      <view class="module-section">
        <view class="module-header" @tap="toggleModule('favorites')">
          <text class="module-title">我的关注</text>
          <text class="module-desc">{{ favorites.length }}个关注</text>
          <text class="expand-icon">{{ expandedModules.favorites ? '▼' : '▶' }}</text>
        </view>

        <view v-if="expandedModules.favorites" class="module-content">
          <view v-if="favorites.length > 0" class="favorites-grid">
            <view
              v-for="item in favorites"
              :key="item.id"
              class="favorite-card"
              :data-item="JSON.stringify(item)"
              @tap="viewFavoriteDetail(item)"
              @touchstart.stop="handleFavoriteTouchStart($event, item)"
              @touchend.stop="handleFavoriteTouchEnd($event, item)"
              @touchcancel.stop="handleFavoriteTouchEnd($event, item)"
            >
              <view class="card-icon-wrapper">
                <text class="card-emoji">{{ item.emoji || '📱' }}</text>
              </view>
              <text class="card-name">{{ item.name }}</text>
              <text class="card-type">{{ item.category }}</text>
            </view>
          </view>

          <!-- 空状态 -->
          <view v-else class="empty-state">
            <text class="empty-text">还没有关注任何内容</text>
            <text class="empty-hint">去首页发现更多精彩小程序吧~</text>
          </view>
        </view>

        <!-- 长按弹出菜单 -->
        <view v-if="showFavoriteActionMenu" class="action-menu-overlay" @tap="hideFavoriteActionMenu">
          <view
            class="action-menu"
            :style="{ top: favoriteMenuPosition.top + 'px', left: favoriteMenuPosition.left + 'px' }"
            @tap.stop
          >
            <view class="menu-item" @tap="handleFavoriteMenuAction('unfollow')">
              <text class="menu-text">取消关注</text>
            </view>
            <view class="menu-item" @tap="handleFavoriteMenuAction('register')">
              <text class="menu-text">我要申请注册</text>
            </view>
            <view class="menu-item" @tap="handleFavoriteMenuAction('cooperate')">
              <text class="menu-text">我要申请合作</text>
            </view>
            <view class="menu-item" @tap="handleFavoriteMenuAction('rent')">
              <text class="menu-text">我要申请租赁</text>
            </view>
          </view>
        </view>
      </view>

      <!-- ========== 模块5：我的钱包 ========== -->
      <view class="module-section wallet-section">
        <view class="module-header" @tap="goToWallet">
          <text class="module-title">我的钱包</text>
          <text class="wallet-balance">🌰 {{ balance.douDou }} 都达豆</text>
          <text class="expand-icon">›</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 模块展开状态
const expandedModules = ref({
  registration: true,    // 默认展开我的注册
  cooperation: false,    // 默认折叠我的合作
  leasing: false,        // 默认折叠我的租赁
  favorites: false       // 默认折叠我的关注
})

// ========== 我的注册：公司/个体工商户资质列表 ==========
const qualifications = ref([
  {
    id: 1,
    name: '上海XX科技有限公司',
    type: 'company',                      // company | individual
    status: 'active',                     // active | pending | draft
    unifiedSocialCreditCode: '91310000XXXXXXXXXX',
    registrationDate: '2020-01-15',
    miniProgramCount: 3,                  // 该公司名下的小程序数量
    businessScope: '软件开发、小程序开发'  // 经营范围
  },
  {
    id: 2,
    name: '浦东新区XX餐饮店',
    type: 'individual',
    status: 'active',
    unifiedSocialCreditCode: '92310000XXXXXXXXXX',
    registrationDate: '2021-06-20',
    miniProgramCount: 1,
    businessScope: '餐饮服务'
  },
  {
    id: 3,
    name: 'XX教育培训中心',
    type: 'company',
    status: 'pending',  // 正在审核中
    unifiedSocialCreditCode: '91310000YYYYYYYYYY',
    registrationDate: '2024-01-10',
    miniProgramCount: 0,
    businessScope: '教育培训、在线课程'
  },
  {
    id: 4,
    name: 'XX商贸有限公司',
    type: 'company',
    status: 'draft',  // 草稿 - 未提交但保存了
    unifiedSocialCreditCode: '91310000ZZZZZZZZ',
    registrationDate: '2024-02-08',
    miniProgramCount: 0,
    businessScope: '日用百货、零售'
  }
])

// 当前选中的资质卡片（用于长按操作）
const selectedQualification = ref<any>(null)

// ========== 我的合作：合作小程序 ==========
const cooperationApps = ref([
  {
    id: 1,
    name: 'XX连锁餐饮点餐系统',
    emoji: '🍔',
    role: '战略合作方',
    cooperationDate: '2024-01-01'
  }
])

// ========== 我的租赁：租赁小程序 ==========
const leasingApps = ref([
  {
    id: 1,
    name: '零售商城小程序',
    emoji: '🛒',
    period: '2024-01 ~ 2024-12',
    monthlyFee: '¥299/月'
  }
])

// ========== 我的关注 ==========
const favorites = ref([
  {
    id: 1,
    name: '餐饮点餐模板',
    category: '餐饮点餐',
    emoji: '🍔'
  },
  {
    id: 2,
    name: '零售商城',
    category: '零售电商',
    emoji: '🛒'
  }
])

// 关注项长按菜单状态
const showFavoriteActionMenu = ref(false)
const favoriteMenuPosition = ref({ top: 0, left: 0 })
const selectedFavorite = ref<any>(null)
const favoriteTouchTimers = ref<Map<string, any>>(new Map())

// ========== 我的钱包 ==========
const balance = ref({
  douDou: 10000,  // 都达豆
  rmb: 1000       // 人民币（10000都达豆 = 1000人民币）
})

// ========== 方法 ==========

// 切换模块展开/折叠
const toggleModule = (moduleName: keyof typeof expandedModules.value) => {
  expandedModules.value[moduleName] = !expandedModules.value[moduleName]
}

// 进入公司详情页（就是当前的"我的"页面）
// 不同的公司对应不同的companyId，页面会根据companyId加载对应的小程序数据
const goToCompanyDetail = (qualification: any) => {
  console.log('进入公司详情:', qualification.name, 'ID:', qualification.id)

  uni.navigateTo({
    url: `/pages/profile/index?companyId=${qualification.id}&name=${encodeURIComponent(qualification.name)}&type=${qualification.type}`
  })
}

// 添加新资质
const addQualification = () => {
  uni.showModal({
    title: '添加新资质',
    content: '功能开发中...\n\n支持添加：\n- 企业资质\n- 个体工商户资质',
    showCancel: false
  })
}

// 添加合作资质
const addCooperationQualification = () => {
  uni.showModal({
    title: '添加合作资质',
    content: '功能开发中...',
    showCancel: false
  })
}

// 增加合作小程序
const addCooperationApp = () => {
  uni.showModal({
    title: '增加合作小程序',
    content: '功能开发中...',
    showCancel: false
  })
}

// 添加租赁资质
const addLeasingQualification = () => {
  uni.showModal({
    title: '添加租赁资质',
    content: '功能开发中...',
    showCancel: false
  })
}

// 增加租赁小程序
const addLeasingApp = () => {
  uni.showModal({
    title: '增加租赁小程序',
    content: '功能开发中...',
    showCancel: false
  })
}

// 查看小程序详情
const viewAppDetail = (app: any) => {
  uni.showModal({
    title: app.name,
    content: '功能开发中...',
    showCancel: false
  })
}

// 查看关注详情
const viewFavoriteDetail = (item: any) => {
  uni.showModal({
    title: item.name,
    content: `类型：${item.type}`,
    showCancel: false
  })
}

// 取消关注
const cancelFavorite = (item: any) => {
  uni.showModal({
    title: '取消关注',
    content: `确定取消关注"${item.name}"吗？`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 取消关注逻辑
        console.log('取消关注:', item.name)
      }
    }
  })
}

// 关注项触摸开始（用于检测长按）
const handleFavoriteTouchStart = (event: any, item: any) => {
  console.log('关注项触摸开始:', item.name)

  // 清除该卡片之前的定时器
  const itemId = `fav-${item.id}`
  if (favoriteTouchTimers.value.has(itemId)) {
    clearTimeout(favoriteTouchTimers.value.get(itemId))
  }

  // 800ms后触发长按
  const timer = setTimeout(() => {
    console.log('关注项触发长按:', item.name)

    // 获取触摸位置
    const touch = event.changedTouches?.[0] || event.touches?.[0]
    if (touch) {
      const x = touch.clientX || touch.x || 0
      const y = touch.clientY || touch.y || 0

      // 获取系统信息（屏幕宽度）
      const systemInfo = uni.getSystemInfoSync()
      const screenWidth = systemInfo.screenWidth || 375
      const screenHeight = systemInfo.screenHeight || 667

      // 菜单宽度（rpx转px）
      const menuWidth = 280
      const rpxToPx = screenWidth / 750
      const menuWidthPx = menuWidth * rpxToPx

      // 计算菜单位置，确保不超出屏幕边界
      let menuLeft = x - menuWidthPx / 2

      // 左边界检测
      if (menuLeft < 20) {
        menuLeft = 20
      }

      // 右边界检测
      if (menuLeft + menuWidthPx > screenWidth - 20) {
        menuLeft = screenWidth - menuWidthPx - 20
      }

      // 上边界检测
      const menuHeightPx = 250
      let menuTop = y - 100
      if (menuTop < 80) {
        menuTop = 80
      }

      // 下边界检测
      if (menuTop + menuHeightPx > screenHeight - 20) {
        menuTop = screenHeight - menuHeightPx - 20
      }

      favoriteMenuPosition.value = {
        top: menuTop,
        left: menuLeft
      }
    }

    selectedFavorite.value = item
    showFavoriteActionMenu.value = true

    // 震动反馈
    uni.vibrateShort()
  }, 800)

  favoriteTouchTimers.value.set(itemId, timer)
}

// 关注项触摸结束（取消长按）
const handleFavoriteTouchEnd = (_event: any, item: any) => {
  const itemId = `fav-${item.id}`
  if (favoriteTouchTimers.value.has(itemId)) {
    clearTimeout(favoriteTouchTimers.value.get(itemId))
    favoriteTouchTimers.value.delete(itemId)
  }
}

// 隐藏关注项菜单
const hideFavoriteActionMenu = () => {
  showFavoriteActionMenu.value = false
  selectedFavorite.value = null
}

// 处理关注项菜单操作
const handleFavoriteMenuAction = (action: string) => {
  const item = selectedFavorite.value
  if (!item) return

  console.log('关注项菜单操作:', action, item)

  switch (action) {
    case 'unfollow':
      // 取消关注
      uni.showModal({
        title: '取消关注',
        content: `确定取消关注"${item.name}"吗？`,
        success: (res) => {
          if (res.confirm) {
            // 从列表中移除
            const index = favorites.value.findIndex(f => f.id === item.id)
            if (index > -1) {
              favorites.value.splice(index, 1)
            }
            // 更新本地存储
            const followed = favorites.value.map(f => ({
              id: f.id.toString(),
              name: f.name,
              category: f.category,
              emoji: f.emoji
            }))
            uni.setStorageSync('followed_programs', JSON.stringify(followed))
            uni.showToast({
              title: '已取消关注',
              icon: 'success'
            })
          }
        }
      })
      break

    case 'register':
      // 我要申请注册
      handleFavoriteRegister(item)
      break

    case 'cooperate':
      // 我要申请合作
      handleFavoriteCooperate(item)
      break

    case 'rent':
      // 我要申请租赁
      handleFavoriteRent(item)
      break
  }

  hideFavoriteActionMenu()
}

// 处理关注项的注册申请
const handleFavoriteRegister = (item: any) => {
  try {
    const saved = uni.getStorageSync('my_qualifications')
    if (!saved) {
      uni.showModal({
        title: '提示',
        content: '注册小程序需要先完善企业资质信息\n\n是否前往"我的"页面添加资质？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 已经在"我的"页面，不需要跳转
            uni.showToast({
              title: '请在下方"我的注册"中添加资质',
              icon: 'none'
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
        content: '注册小程序需要先完善企业资质信息\n\n是否前往"我的注册"添加资质？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '请在下方"我的注册"中添加资质',
              icon: 'none'
            })
          }
        }
      })
      return
    }

    if (qualifications.length === 1) {
      const company = qualifications[0]
      uni.showModal({
        title: '确认注册',
        content: `使用"${company.name}"注册${item.name}？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '注册申请已提交',
              icon: 'success'
            })
          }
        }
      })
    } else {
      const companyNames = qualifications.map(q => q.name)
      uni.showActionSheet({
        itemList: companyNames,
        success: (res) => {
          const selectedCompany = qualifications[res.tapIndex]
          uni.showModal({
            title: '确认注册',
            content: `使用"${selectedCompany.name}"注册${item.name}？`,
            success: (res2) => {
              if (res2.confirm) {
                uni.showToast({
                  title: '注册申请已提交',
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

// 处理关注项的合作申请
const handleFavoriteCooperate = (item: any) => {
  try {
    const saved = uni.getStorageSync('my_cooperations')
    if (!saved) {
      uni.showModal({
        title: '提示',
        content: '合作小程序需要先完善合作信息\n\n是否前往"我的合作"添加信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            expandedModules.value.cooperation = true
          }
        }
      })
      return
    }

    const cooperations = JSON.parse(saved) as any[]
    if (cooperations.length === 0) {
      uni.showModal({
        title: '提示',
        content: '合作小程序需要先完善合作信息\n\n是否前往"我的合作"添加信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            expandedModules.value.cooperation = true
          }
        }
      })
      return
    }

    uni.showToast({
      title: '合作申请已提交',
      icon: 'success'
    })
  } catch (e) {
    console.error('读取合作信息失败:', e)
  }
}

// 处理关注项的租赁申请
const handleFavoriteRent = (item: any) => {
  try {
    const saved = uni.getStorageSync('my_leasings')
    if (!saved) {
      uni.showModal({
        title: '提示',
        content: '租赁小程序需要先完善租赁信息\n\n是否前往"我的租赁"添加信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            expandedModules.value.leasing = true
          }
        }
      })
      return
    }

    const leasings = JSON.parse(saved) as any[]
    if (leasings.length === 0) {
      uni.showModal({
        title: '提示',
        content: '租赁小程序需要先完善租赁信息\n\n是否前往"我的租赁"添加信息？',
        confirmText: '前往',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            expandedModules.value.leasing = true
          }
        }
      })
      return
    }

    uni.showToast({
      title: '租赁申请已提交',
      icon: 'success'
    })
  } catch (e) {
    console.error('读取租赁信息失败:', e)
  }
}

// 跳转到钱包详情页
const goToWallet = () => {
  uni.navigateTo({
    url: '/pages/profile/wallet'
  })
}

// 从本地存储加载关注列表
const loadFavorites = () => {
  try {
    const saved = uni.getStorageSync('followed_programs')
    if (saved) {
      const programs = JSON.parse(saved) as any[]
      // 将小程序数据转换为 favorites 格式
      favorites.value = programs.map(p => ({
        id: parseInt(p.id),
        name: p.name,
        category: p.category,
        emoji: p.emoji || '📱'
      }))
    }
  } catch (e) {
    console.error('加载关注列表失败:', e)
  }
}

// 保存企业资质到本地存储
const saveQualifications = () => {
  try {
    uni.setStorageSync('my_qualifications', JSON.stringify(qualifications.value))
    console.log('保存企业资质成功')
  } catch (e) {
    console.error('保存企业资质失败:', e)
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return '✓ 已审核'
    case 'pending':
      return '正在审核中'
    case 'draft':
      return '草稿'
    default:
      return '未知状态'
  }
}

// 显示卡片操作菜单（长按触发）
const showCardMenu = (qualification: any) => {
  selectedQualification.value = qualification

  const itemList = ['修改', '删除']

  uni.showActionSheet({
    itemList: itemList,
    success: (res) => {
      const tapIndex = res.tapIndex
      if (tapIndex === 0) {
        // 修改
        modifyQualification(qualification)
      } else if (tapIndex === 1) {
        // 删除
        deleteQualification(qualification)
      }
    }
  })
}

// 修改资质
const modifyQualification = (qualification: any) => {
  console.log('修改资质:', qualification.name)

  // 根据状态判断是否可以修改
  if (qualification.status === 'pending') {
    uni.showToast({
      title: '审核中无法修改',
      icon: 'none',
      duration: 2000
    })
    return
  }

  // 跳转到修改页面（或者弹出修改表单）
  uni.showModal({
    title: '修改资质',
    content: `即将修改：${qualification.name}\n\n功能开发中...`,
    showCancel: true,
    confirmText: '确定',
    cancelText: '取消'
  })
}

// 删除资质
const deleteQualification = (qualification: any) => {
  console.log('删除资质:', qualification.name)

  // 根据状态判断是否可以删除
  if (qualification.status === 'pending') {
    uni.showToast({
      title: '审核中无法删除',
      icon: 'none',
      duration: 2000
    })
    return
  }

  // 已审核且有小程序的，提示无法删除
  if (qualification.status === 'active' && qualification.miniProgramCount > 0) {
    uni.showModal({
      title: '无法删除',
      content: `该公司名下有 ${qualification.miniProgramCount} 个小程序，请先处理小程序后再删除。`,
      showCancel: false
    })
    return
  }

  // 确认删除
  uni.showModal({
    title: '确认删除',
    content: `确定要删除"${qualification.name}"吗？\n\n此操作不可恢复。`,
    confirmText: '删除',
    confirmColor: '#ff5722',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 从列表中删除
        const index = qualifications.value.findIndex(item => item.id === qualification.id)
        if (index > -1) {
          qualifications.value.splice(index, 1)

          uni.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })

          // TODO: 调用后端API删除数据
          console.log('已删除资质ID:', qualification.id)
        }
      }
    }
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载关注列表
  loadFavorites()

  // 保存企业资质到本地存储（供首页使用）
  saveQualifications()
})
</script>

<style scoped lang="scss">
.profile-page {
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
    justify-content: center;
    height: 88rpx;
    padding: 0 30rpx;

    .nav-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #fff;
    }
  }
}

// 主内容区域
.main-content {
  padding-top: calc(var(--status-bar-height) + 88rpx + 20rpx);
  padding-bottom: 30rpx;
  min-height: 100vh;
}

// 模块区域
.module-section {
  background: #fff;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .module-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;
    cursor: pointer;

    .module-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }

    .module-desc {
      font-size: 24rpx;
      color: #999;
      margin-left: auto;
      margin-right: 16rpx;
    }

    .expand-icon {
      font-size: 20rpx;
      color: #999;
    }

    &:active {
      background: #fafafa;
    }
  }

  .module-content {
    padding: 20rpx 30rpx 30rpx;
  }
}

// 资质卡片
.qualification-list {
  .qualification-card {
    background: #fafafa;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    margin-left: 20rpx;
    border-left: 4rpx solid #e0e0e0;
    transition: all 0.2s;

    &:last-child {
      margin-bottom: 0;
    }

    &:active {
      background: #f0f0f0;
      border-left-color: #667eea;
    }

    .card-main {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12rpx;

      .card-left {
        flex: 1;

        .company-name {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          display: block;
          margin-bottom: 8rpx;
        }

        .company-meta {
          font-size: 24rpx;
          color: #999;
          display: block;
        }
      }

      .card-right {
        flex-shrink: 0;
        margin-left: 16rpx;

        .status-badge {
          padding: 6rpx 12rpx;
          border-radius: 4rpx;
          font-size: 22rpx;
          white-space: nowrap;

          &.active {
            background: #e8f5e9;
            color: #07c160;
          }

          &.pending {
            background: #fff3e0;
            color: #ff9800;
          }

          &.draft {
            background: #e3f2fd;
            color: #2196f3;
          }
        }
      }
    }

    .card-footer {
      padding-top: 12rpx;
      border-top: 1rpx solid #e5e5e5;

      .footer-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// 添加按钮
.add-qualification-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 20rpx;
  margin-left: 20rpx;

  .btn-text {
    font-size: 26rpx;
    font-weight: 500;
  }

  &:active {
    opacity: 0.8;
  }
}

// 应用列表
.app-list {
  margin-bottom: 20rpx;

  .app-item {
    background: #fafafa;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    margin-left: 20rpx;
    border-left: 4rpx solid #e0e0e0;
    transition: all 0.2s;

    &:last-child {
      margin-bottom: 0;
    }

    .app-left {
      flex: 1;

      .app-name {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }

      .app-meta {
        font-size: 24rpx;
        color: #999;
        display: block;
      }
    }

    &:active {
      background: #f0f0f0;
      border-left-color: #667eea;
    }
  }
}

// 操作按钮组
.action-buttons {
  display: flex;
  gap: 16rpx;

  .action-btn {
    flex: 1;
    background: #f5f5f5;
    color: #666;
    border-radius: 10rpx;
    padding: 18rpx;
    text-align: center;

    .btn-text {
      font-size: 26rpx;
    }

    &.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    &:active {
      opacity: 0.8;
    }
  }
}

// 关注列表（网格布局）
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 0 20rpx;

  .favorite-card {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    transition: all 0.3s;

    .card-icon-wrapper {
      width: 80rpx;
      height: 80rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin-bottom: 16rpx;
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.25);

      .card-emoji {
        font-size: 48rpx;
      }
    }

    .card-name {
      font-size: 26rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    .card-type {
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

// 兼容旧的列表样式（如果需要）
.favorite-list {
  .favorite-item {
    display: flex;
    align-items: center;
    background: #fafafa;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    margin-left: 20rpx;
    border-left: 4rpx solid #e0e0e0;
    transition: all 0.2s;

    &:last-child {
      margin-bottom: 0;
    }

    .favorite-left {
      flex: 1;

      .favorite-name {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }

      .favorite-type {
        font-size: 24rpx;
        color: #999;
        display: block;
      }
    }

    .favorite-action {
      .cancel-btn {
        font-size: 24rpx;
        color: #999;
        padding: 8rpx 16rpx;
        background: #fff;
        border-radius: 6rpx;
        border: 1rpx solid #e0e0e0;
      }
    }

    &:active {
      background: #f0f0f0;
      border-left-color: #667eea;
    }
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 60rpx 30rpx;
  margin-left: 20rpx;

  .empty-text {
    font-size: 26rpx;
    color: #999;
    display: block;
    margin-bottom: 10rpx;
  }

  .empty-hint {
    font-size: 24rpx;
    color: #bbb;
    display: block;
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

// 钱包模块（简洁文字样式）
.wallet-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  margin: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.25);

  .module-header {
    padding: 32rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;

    .module-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
    }

    .wallet-balance {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .expand-icon {
      font-size: 32rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .wallet-content {
    .balance-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 16rpx;
      padding: 40rpx 30rpx;
      margin-bottom: 20rpx;

      .balance-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        &.dou {
          .balance-icon {
            font-size: 48rpx;
            margin-bottom: 12rpx;
          }

          .balance-value {
            font-size: 48rpx;
            font-weight: 700;
            color: #fff;
            margin-bottom: 8rpx;
          }

          .balance-label {
            font-size: 24rpx;
            color: rgba(255, 255, 255, 0.8);
          }
        }

        &.rmb {
          .balance-icon {
            font-size: 48rpx;
            margin-bottom: 12rpx;
          }

          .balance-value {
            font-size: 48rpx;
            font-weight: 700;
            color: #fff;
            margin-bottom: 8rpx;
          }

          .balance-label {
            font-size: 24rpx;
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }

      .balance-divider {
        width: 2rpx;
        height: 80rpx;
        background: rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;

        .exchange-rate {
          writing-mode: vertical-rl;
          font-size: 20rpx;
          color: rgba(255, 255, 255, 0.6);
          padding: 10rpx 0;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8rpx;
        }
      }
    }

    .wallet-actions {
      display: flex;
      gap: 16rpx;

      .wallet-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 16rpx;
        padding: 30rpx 20rpx;

        .btn-icon {
          font-size: 48rpx;
          margin-bottom: 12rpx;
        }

        .btn-text {
          font-size: 26rpx;
          font-weight: 500;
        }

        &.recharge {
          background: #e8f5e9;
          color: #07c160;
        }

        &.withdraw {
          background: #fff3e0;
          color: #ff9800;
        }

        &.records {
          background: #e3f2fd;
          color: #2196f3;
        }

        &:active {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
