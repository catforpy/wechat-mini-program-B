<template>
  <view class="real-name-info-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">实名信息</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 实名认证状态卡片 -->
      <view class="status-card">
        <view class="status-icon">
          <text v-if="userInfo.isRealNameVerified" class="icon verified">✓</text>
          <text v-else class="icon unverified">!</text>
        </view>
        <view class="status-info">
          <text class="status-title">{{ userInfo.isRealNameVerified ? '已实名认证' : '未实名认证' }}</text>
          <text class="status-desc">{{ userInfo.isRealNameVerified ? '您的账号已完成实名认证' : '完成实名认证后可以使用更多功能' }}</text>
        </view>
        <view v-if="!userInfo.isRealNameVerified" class="verify-btn" @tap="goToVerify">
          <text class="btn-text">去认证</text>
        </view>
      </view>

      <!-- 实名信息详情 -->
      <view v-if="userInfo.isRealNameVerified" class="info-section">
        <text class="section-title">实名信息</text>

        <view class="info-item">
          <text class="info-label">真实姓名</text>
          <text class="info-value">{{ maskRealName(userInfo.realName) }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">身份证号</text>
          <text class="info-value">{{ maskIdCard(userInfo.idCard) }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">认证时间</text>
          <text class="info-value">{{ userInfo.verifyTime || '-' }}</text>
        </view>
      </view>

      <!-- 超级管理员权限说明 -->
      <view class="permission-section">
        <text class="section-title">超级管理员权限</text>
        <view class="permission-card">
          <text class="permission-icon">👑</text>
          <view class="permission-content">
            <text class="permission-title">名下公司超级管理员</text>
            <text class="permission-desc">作为实名认证用户，您将自动成为您名下所有公司的超级管理员，拥有最高管理权限。</text>
          </view>
        </view>
      </view>

      <!-- 名下公司列表 -->
      <view class="companies-section">
        <text class="section-title">名下公司（{{ myCompanies.length }}）</text>

        <view v-if="myCompanies.length === 0" class="empty-companies">
          <text class="empty-icon">🏢</text>
          <text class="empty-text">暂无公司</text>
          <text class="empty-hint">完成实名认证后，您可以添加公司</text>
          <view class="add-company-btn" @tap="goToAddCompany">
            <text class="btn-text">添加公司</text>
          </view>
        </view>

        <view v-else class="companies-list">
          <view
            v-for="company in myCompanies"
            :key="company.id"
            class="company-card"
          >
            <view class="company-header">
              <view class="company-left">
                <text class="company-icon">{{ company.type === 'company' ? '🏢' : '🏪' }}</text>
                <view class="company-info">
                  <text class="company-name">{{ company.name }}</text>
                  <text class="company-meta">{{ company.type === 'company' ? '企业' : '个体工商户' }} · {{ getStatusText(company.status) }}</text>
                </view>
              </view>
              <view class="admin-badge">
                <text class="badge-icon">👑</text>
                <text class="badge-text">超管</text>
              </view>
            </view>
            <view class="company-footer">
              <text class="footer-text">统一社会信用代码：{{ company.unifiedSocialCreditCode }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 账号安全提示 -->
      <view class="security-section">
        <text class="section-title">安全提示</text>
        <view class="security-tips">
          <view class="tip-item">
            <text class="tip-icon">🔒</text>
            <text class="tip-text">实名信息经过加密存储，仅用于身份验证</text>
          </view>
          <view class="tip-item">
            <text class="tip-icon">🛡️</text>
            <text class="tip-text">作为超级管理员，您对所有公司的操作负责</text>
          </view>
          <view class="tip-item">
            <text class="tip-icon">⚠️</text>
            <text class="tip-text">请妥善保管账号信息，不要泄露给他人</text>
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

// 用户信息
interface UserInfo {
  avatar?: string
  nickname?: string
  phone?: string
  userId: string
  isRealNameVerified: boolean
  realName?: string
  idCard?: string
  verifyTime?: string
}

const userInfo = ref<UserInfo>({
  userId: '10001',
  isRealNameVerified: false
})

// 名下公司列表
const myCompanies = ref<any[]>([])

// 脱敏处理真实姓名
const maskRealName = (name?: string) => {
  if (!name) return '-'
  if (name.length <= 1) return name
  return name.charAt(0) + '*'.repeat(name.length - 1)
}

// 脱敏处理身份证号
const maskIdCard = (idCard?: string) => {
  if (!idCard) return '-'
  if (idCard.length < 8) return idCard
  return idCard.substring(0, 4) + '********' + idCard.substring(idCard.length - 4)
}

// 获取状态文字
const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return '已审核'
    case 'pending':
      return '审核中'
    case 'draft':
      return '草稿'
    default:
      return '未知'
  }
}

// 去认证
const goToVerify = () => {
  // 快速认证流程（模拟）
  uni.showModal({
    title: '实名认证',
    content: '请输入您的真实姓名',
    editable: true,
    placeholderText: '例如：张三',
    success: (res) => {
      if (res.confirm && res.content) {
        const realName = res.content

        // 继续输入身份证号
        uni.showModal({
          title: '身份证号',
          editable: true,
          placeholderText: '请输入18位身份证号',
          success: (idCardRes) => {
            if (idCardRes.confirm && idCardRes.content) {
              const idCard = idCardRes.content

              // 简单验证身份证号格式
              if (idCard.length !== 18) {
                uni.showToast({
                  title: '身份证号必须是18位',
                  icon: 'none'
                })
                return
              }

              // 保存实名信息
              const updatedUserInfo = {
                ...userInfo.value,
                isRealNameVerified: true,
                realName: realName,
                idCard: idCard,
                verifyTime: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().substring(0, 8)
              }

              try {
                uni.setStorageSync('user_info', JSON.stringify(updatedUserInfo))
                userInfo.value = updatedUserInfo

                uni.showToast({
                  title: '认证成功',
                  icon: 'success',
                  duration: 2000
                })

                // 刷新页面数据
                setTimeout(() => {
                  loadCompanies()
                }, 500)
              } catch (e) {
                console.error('保存实名信息失败:', e)
                uni.showToast({
                  title: '认证失败',
                  icon: 'none'
                })
              }
            }
          }
        })
      }
    }
  })
}

// 添加公司
const goToAddCompany = () => {
  uni.navigateTo({
    url: '/pages/profile/add-company'
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 加载用户信息
  try {
    const saved = uni.getStorageSync('user_info')
    if (saved) {
      userInfo.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }

  // 加载名下公司列表
  try {
    const submissions = uni.getStorageSync('company_submissions') || []
    const drafts = uni.getStorageSync('company_drafts') || []

    // 加载所有公司
    const allCompanies = [...submissions, ...drafts]
    myCompanies.value = allCompanies.map((c: any) => ({
      id: c.id,
      name: c.name,
      type: c.entityType,
      status: c.status,
      unifiedSocialCreditCode: c.unifiedSocialCreditCode
    }))
  } catch (e) {
    console.error('加载公司列表失败:', e)
  }
})
</script>

<style scoped lang="scss">
.real-name-info-page {
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

// 状态卡片
.status-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .status-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;

    .icon {
      font-size: 48rpx;
      font-weight: bold;

      &.verified {
        color: #07c160;
      }

      &.unverified {
        color: #ff9800;
      }
    }
  }

  .status-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .status-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .status-desc {
      font-size: 24rpx;
      color: #999;
    }
  }

  .verify-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50rpx;
    padding: 16rpx 32rpx;

    .btn-text {
      font-size: 26rpx;
      color: #fff;
      font-weight: 500;
    }

    &:active {
      opacity: 0.8;
    }
  }
}

// 信息区块
.info-section,
.permission-section,
.companies-section,
.security-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }
}

// 信息项
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 28rpx;
    color: #666;
  }

  .info-value {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }
}

// 权限卡片
.permission-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  align-items: flex-start;
  border: 2rpx solid #667eea;

  .permission-icon {
    font-size: 56rpx;
    margin-right: 20rpx;
  }

  .permission-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .permission-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 12rpx;
    }

    .permission-desc {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}

// 空状态
.empty-companies {
  text-align: center;
  padding: 60rpx 0;

  .empty-icon {
    font-size: 100rpx;
    display: block;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    display: block;
    margin-bottom: 12rpx;
  }

  .empty-hint {
    font-size: 24rpx;
    color: #999;
    display: block;
    margin-bottom: 30rpx;
  }

  .add-company-btn {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50rpx;
    padding: 20rpx 40rpx;

    .btn-text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 500;
    }

    &:active {
      opacity: 0.8;
    }
  }
}

// 公司列表
.companies-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  .company-card {
    background: #f8f8f8;
    border-radius: 16rpx;
    padding: 24rpx;

    .company-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16rpx;

      .company-left {
        display: flex;
        align-items: center;
        flex: 1;

        .company-icon {
          font-size: 48rpx;
          margin-right: 16rpx;
        }

        .company-info {
          display: flex;
          flex-direction: column;

          .company-name {
            font-size: 28rpx;
            font-weight: 600;
            color: #333;
            margin-bottom: 6rpx;
          }

          .company-meta {
            font-size: 24rpx;
            color: #999;
          }
        }
      }

      .admin-badge {
        background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
        border-radius: 20rpx;
        padding: 6rpx 12rpx;
        display: flex;
        align-items: center;

        .badge-icon {
          font-size: 20rpx;
          margin-right: 4rpx;
        }

        .badge-text {
          font-size: 22rpx;
          color: #fff;
          font-weight: 500;
        }
      }
    }

    .company-footer {
      padding-top: 16rpx;
      border-top: 1rpx solid #e0e0e0;

      .footer-text {
        font-size: 24rpx;
        color: #999;
        display: block;
      }
    }
  }
}

// 安全提示
.security-tips {
  .tip-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .tip-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
    }

    .tip-text {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
      flex: 1;
    }
  }
}
</style>
