<template>
  <view class="management-team-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">管理团队</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 公司信息卡片 -->
    <view v-if="companyInfo" class="company-card">
      <view class="company-header">
        <text class="company-icon">{{ companyInfo.type === 'company' ? '🏢' : '🏪' }}</text>
        <view class="company-info">
          <text class="company-name">{{ companyInfo.name }}</text>
          <text class="company-meta">{{ companyInfo.type === 'company' ? '企业' : '个体工商户' }}</text>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 成员角色标签 -->
      <view class="role-tabs">
        <view
          v-for="(tab, index) in roleTabs"
          :key="index"
          :class="['role-tab', { active: currentRoleTab === index }]"
          @tap="switchRoleTab(index)"
        >
          <text class="tab-text">{{ tab.label }}</text>
          <view v-if="getRoleCount(tab.role) > 0" class="tab-count">{{ getRoleCount(tab.role) }}</view>
        </view>
      </view>

      <!-- 超级管理员列表 -->
      <view v-if="currentRoleTab === 0" class="member-section">
        <view v-if="superAdmins.length === 0" class="empty-state">
          <text class="empty-icon">👑</text>
          <text class="empty-text">暂无超级管理员</text>
        </view>
        <view v-else class="member-list">
          <view
            v-for="(member, index) in superAdmins"
            :key="index"
            class="member-card super-admin"
          >
            <view class="member-info">
              <text class="member-icon">👑</text>
              <view class="member-details">
                <text class="member-name">{{ member.name }}</text>
                <text class="member-meta">超级管理员 · {{ member.joinTime }}</text>
              </view>
            </view>
            <view class="admin-badge">
              <text class="badge-text">超管</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 管理成员列表 -->
      <view v-if="currentRoleTab === 1" class="member-section">
        <view v-if="managers.length === 0 && managerApplications.length === 0" class="empty-state">
          <text class="empty-icon">👥</text>
          <text class="empty-text">暂无管理成员</text>
        </view>

        <!-- 待审批的申请 -->
        <view v-if="managerApplications.length > 0" class="applications-section">
          <text class="section-title">待审批申请 ({{ managerApplications.length }})</text>
          <view
            v-for="(app, index) in managerApplications"
            :key="'app-' + index"
            class="application-card"
          >
            <view class="app-header">
              <text class="app-name">{{ maskName(app.applicantName) }}</text>
              <text class="app-time">{{ formatTime(app.applyTime) }}</text>
            </view>
            <view class="app-details">
              <text class="app-role">申请角色：管理成员</text>
              <text class="app-reason" v-if="app.reason">申请理由：{{ app.reason }}</text>
              <text v-if="app.idCard" class="app-info">身份证：{{ maskIdCard(app.idCard) }}</text>
              <text v-if="app.phone" class="app-info">电话：{{ maskPhone(app.phone) }}</text>
            </view>
            <view class="app-actions">
              <view class="reject-btn" @tap="handleApplication(app.id, 'reject', app)">
                <text class="btn-text">拒绝</text>
              </view>
              <view class="approve-btn" @tap="handleApplication(app.id, 'approve', app)">
                <text class="btn-text">同意</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 现有管理成员 -->
        <view v-if="managers.length > 0" class="members-section">
          <text class="section-title">现有成员 ({{ managers.length }})</text>
          <view class="member-list">
            <view
              v-for="(member, index) in managers"
              :key="'member-' + index"
              class="member-card manager"
            >
              <view class="member-info">
                <text class="member-icon">👤</text>
                <view class="member-details">
                  <text class="member-name">{{ member.name }}</text>
                  <text class="member-meta">管理成员 · {{ member.joinTime }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 联系人员列表 -->
      <view v-if="currentRoleTab === 2" class="member-section">
        <view v-if="contacts.length === 0 && contactApplications.length === 0" class="empty-state">
          <text class="empty-icon">📞</text>
          <text class="empty-text">暂无联系人员</text>
        </view>

        <!-- 待审批的申请 -->
        <view v-if="contactApplications.length > 0" class="applications-section">
          <text class="section-title">待审批申请 ({{ contactApplications.length }})</text>
          <view
            v-for="(app, index) in contactApplications"
            :key="'app-contact-' + index"
            class="application-card"
          >
            <view class="app-header">
              <text class="app-name">{{ maskName(app.applicantName) }}</text>
              <text class="app-time">{{ formatTime(app.applyTime) }}</text>
            </view>
            <view class="app-details">
              <text class="app-role">申请角色：联系人员</text>
              <text class="app-reason" v-if="app.reason">申请理由：{{ app.reason }}</text>
              <text v-if="app.idCard" class="app-info">身份证：{{ maskIdCard(app.idCard) }}</text>
              <text v-if="app.phone" class="app-info">电话：{{ maskPhone(app.phone) }}</text>
            </view>
            <view class="app-actions">
              <view class="reject-btn" @tap="handleApplication(app.id, 'reject', app)">
                <text class="btn-text">拒绝</text>
              </view>
              <view class="approve-btn" @tap="handleApplication(app.id, 'approve', app)">
                <text class="btn-text">同意</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 现有联系人员 -->
        <view v-if="contacts.length > 0" class="members-section">
          <text class="section-title">现有成员 ({{ contacts.length }})</text>
          <view class="member-list">
            <view
              v-for="(member, index) in contacts"
              :key="'contact-' + index"
              class="member-card contact"
            >
              <view class="member-info">
                <text class="member-icon">📞</text>
                <view class="member-details">
                  <text class="member-name">{{ member.name }}</text>
                  <text class="member-meta">联系人员 · {{ member.joinTime }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="tips-section">
        <text class="tips-title">📋 角色说明</text>
        <text class="tips-item">• <text class="role-name">超级管理员：</text>拥有最高权限，可以审批加入申请，管理公司所有业务</text>
        <text class="tips-item">• <text class="role-name">管理成员：</text>可以管理公司的日常业务，查看订单和数据</text>
        <text class="tips-item">• <text class="role-name">联系人员：</text>作为公司的联系方式，可以接收业务咨询</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 状态栏高度
const statusBarHeight = ref(0)

// 公司信息
const companyInfo = ref<any>(null)

// 角色标签
const roleTabs = ref([
  { label: '超级管理员', role: 'super_admin' },
  { label: '管理成员', role: 'manager' },
  { label: '联系人员', role: 'contact' }
])

const currentRoleTab = ref(0)

// 超级管理员列表
const superAdmins = ref<any[]>([])

// 管理成员列表
const managers = ref<any[]>([])

// 管理成员申请
const managerApplications = ref<any[]>([])

// 联系人员列表
const contacts = ref<any[]>([])

// 联系人员申请
const contactApplications = ref<any[]>([])

// 切换角色标签
const switchRoleTab = (index: number) => {
  currentRoleTab.value = index
}

// 获取角色数量
const getRoleCount = (role: string) => {
  switch (role) {
    case 'super_admin':
      return superAdmins.value.length
    case 'manager':
      return managers.value.length + managerApplications.value.length
    case 'contact':
      return contacts.value.length + contactApplications.value.length
    default:
      return 0
  }
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

// 姓名脱敏
const maskName = (name: string) => {
  if (!name) return '-'
  if (name.length <= 1) return name
  if (name.length === 2) return name.charAt(0) + '*'
  return name.charAt(0) + '*' + name.charAt(name.length - 1)
}

// 身份证号脱敏
const maskIdCard = (idCard: string) => {
  if (!idCard) return '-'
  if (idCard.length < 8) return idCard
  return idCard.substring(0, 4) + '********' + idCard.substring(idCard.length - 4)
}

// 手机号脱敏
const maskPhone = (phone: string) => {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 处理申请
const handleApplication = (applicationId: number, action: 'approve' | 'reject', application: any) => {
  const actionText = action === 'approve' ? '同意' : '拒绝'

  uni.showModal({
    title: `确认${actionText}`,
    content: `确认${actionText}「${maskName(application.applicantName)}」的加入申请吗？`,
    confirmText: '确认',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 移除申请
        if (application.role === 'manager') {
          const index = managerApplications.value.findIndex(a => a.id === applicationId)
          if (index > -1) {
            managerApplications.value.splice(index, 1)
          }

          if (action === 'approve') {
            // 添加到管理成员列表
            managers.value.push({
              id: applicationId,
              name: application.applicantName,
              joinTime: new Date().toISOString().split('T')[0]
            })
          }
        } else if (application.role === 'contact') {
          const index = contactApplications.value.findIndex(a => a.id === applicationId)
          if (index > -1) {
            contactApplications.value.splice(index, 1)
          }

          if (action === 'approve') {
            // 添加到联系人员列表
            contacts.value.push({
              id: applicationId,
              name: application.applicantName,
              joinTime: new Date().toISOString().split('T')[0]
            })
          }
        }

        // 保存到本地存储
        saveTeamData()

        uni.showToast({
          title: `${actionText}成功`,
          icon: 'success'
        })
      }
    }
  })
}

// 保存团队数据
const saveTeamData = () => {
  const teamData = {
    companyId: companyInfo.value?.id,
    superAdmins: superAdmins.value,
    managers: managers.value,
    contacts: contacts.value,
    managerApplications: managerApplications.value,
    contactApplications: contactApplications.value
  }

  // TODO: 发送到服务器
  console.log('保存团队数据:', teamData)
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onLoad((options: any) => {
  console.log('管理团队页面参数:', options)

  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 获取公司信息
  if (options.companyId) {
    try {
      const submissions = uni.getStorageSync('company_submissions') || []
      const company = submissions.find((c: any) => c.id == options.companyId)
      if (company) {
        companyInfo.value = company
      }
    } catch (e) {
      console.error('加载公司信息失败:', e)
    }
  }

  // 加载团队数据（Mock数据）
  loadTeamData()
})

// 加载团队数据
const loadTeamData = () => {
  try {
    // 尝试从本地存储加载
    const saved = uni.getStorageSync('team_data_' + companyInfo.value?.id)
    if (saved) {
      const teamData = JSON.parse(saved)
      superAdmins.value = teamData.superAdmins || []
      managers.value = teamData.managers || []
      contacts.value = teamData.contacts || []
      managerApplications.value = teamData.managerApplications || []
      contactApplications.value = teamData.contactApplications || []
    } else {
      // Mock数据
      superAdmins.value = [
        {
          id: 1,
          name: '张三',
          joinTime: '2025-01-15'
        }
      ]

      managers.value = [
        {
          id: 2,
          name: '李四',
          joinTime: '2025-02-01'
        }
      ]

      managerApplications.value = [
        {
          id: Date.now(),
          applicantName: '王五',
          role: 'manager',
          reason: '负责公司的日常运营管理',
          applyTime: new Date().toISOString()
        }
      ]
    }
  } catch (e) {
    console.error('加载团队数据失败:', e)
  }
}
</script>

<style scoped lang="scss">
.management-team-page {
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

// 公司卡片
.company-card {
  background: #fff;
  margin: 20rpx 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .company-header {
    display: flex;
    align-items: center;

    .company-icon {
      font-size: 56rpx;
      margin-right: 20rpx;
    }

    .company-info {
      display: flex;
      flex-direction: column;

      .company-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .company-meta {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 主内容区域
.main-content {
  padding: 0 30rpx 30rpx;
}

// 角色标签
.role-tabs {
  display: flex;
  background: #fff;
  border-radius: 20rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .role-tab {
    flex: 1;
    position: relative;
    padding: 20rpx 16rpx;
    text-align: center;
    border-radius: 16rpx;
    transition: all 0.3s;

    .tab-text {
      font-size: 28rpx;
      color: #666;
      font-weight: 500;
    }

    .tab-count {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      background: #ff5722;
      color: #fff;
      font-size: 20rpx;
      font-weight: 600;
      min-width: 32rpx;
      height: 32rpx;
      line-height: 32rpx;
      text-align: center;
      border-radius: 16rpx;
      padding: 0 8rpx;
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      .tab-text {
        color: #fff;
      }

      .tab-count {
        background: #fff;
        color: #667eea;
      }
    }
  }
}

// 成员区域
.member-section {
  margin-bottom: 20rpx;
}

// 空状态
.empty-state {
  background: #fff;
  border-radius: 20rpx;
  padding: 80rpx 30rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .empty-icon {
    font-size: 100rpx;
    display: block;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    display: block;
  }
}

// 成员列表
.member-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

// 成员卡片
.member-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .member-info {
    display: flex;
    align-items: center;
    flex: 1;

    .member-icon {
      font-size: 48rpx;
      margin-right: 20rpx;
    }

    .member-details {
      display: flex;
      flex-direction: column;

      .member-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .member-meta {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .admin-badge {
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    border-radius: 20rpx;
    padding: 8rpx 16rpx;

    .badge-text {
      font-size: 24rpx;
      color: #fff;
      font-weight: 500;
    }
  }

  &.super-admin {
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
    border: 2rpx solid #ff9800;
  }

  &.manager {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border: 2rpx solid #667eea;
  }

  &.contact {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%);
    border: 2rpx solid #4caf50;
  }
}

// 申请区域
.applications-section,
.members-section {
  margin-bottom: 30rpx;

  .section-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
  }
}

// 申请卡片
.application-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
    padding-bottom: 16rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .app-name {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
    }

    .app-time {
      font-size: 24rpx;
      color: #999;
    }
  }

  .app-details {
    margin-bottom: 20rpx;

    .app-role {
      font-size: 26rpx;
      color: #667eea;
      display: block;
      margin-bottom: 8rpx;
    }

    .app-reason {
      font-size: 24rpx;
      color: #666;
      line-height: 1.6;
      display: block;
      margin-bottom: 8rpx;
    }

    .app-info {
      font-size: 24rpx;
      color: #666;
      line-height: 1.6;
      display: block;
    }
  }

  .app-actions {
    display: flex;
    gap: 16rpx;

    .reject-btn,
    .approve-btn {
      flex: 1;
      padding: 20rpx;
      border-radius: 12rpx;
      text-align: center;
      font-size: 28rpx;
      font-weight: 500;

      .btn-text {
        color: #fff;
      }

      &:active {
        opacity: 0.8;
      }
    }

    .reject-btn {
      background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
    }

    .approve-btn {
      background: linear-gradient(135deg, #07c160 0%, #0bbd87 100%);
    }
  }
}

// 提示信息
.tips-section {
  background: #fffbf0;
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
  border-left: 4rpx solid #ffc107;
  margin-top: 20rpx;

  .tips-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #ff9800;
    margin-bottom: 16rpx;
    display: block;
  }

  .tips-item {
    font-size: 24rpx;
    color: #666;
    line-height: 1.8;
    display: block;

    .role-name {
      color: #667eea;
      font-weight: 500;
    }
  }
}
</style>
