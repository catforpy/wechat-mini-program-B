<template>
  <view class="company-detail-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">企业信息</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area">
      <!-- 营业执照信息 -->
      <view class="info-section">
        <view class="section-title">营业执照信息</view>

        <view class="info-card">
          <view class="info-row">
            <text class="info-label">主体类型</text>
            <text class="info-value">{{ companyInfo.entityType }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">企业名称</text>
            <text class="info-value">{{ companyInfo.companyName }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">统一社会信用代码</text>
            <text class="info-value">{{ companyInfo.creditCode }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">企业类型</text>
            <text class="info-value">{{ companyInfo.companyType }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">注册地址</text>
            <text class="info-value">{{ companyInfo.registerAddress }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">法定代表人</text>
            <text class="info-value">{{ companyInfo.legalPerson }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">成立日期</text>
            <text class="info-value">{{ companyInfo.establishDate }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">营业期限</text>
            <text class="info-value">{{ companyInfo.businessTerm }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">经营范围</text>
            <text class="info-value">{{ companyInfo.businessScope }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">营业执照照片</text>
            <view class="license-images">
              <image
                v-for="(img, index) in companyInfo.licenseImages"
                :key="index"
                :src="img"
                class="license-img"
                mode="aspectFill"
                @tap="previewImage(img, companyInfo.licenseImages)"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 银行信息 -->
      <view class="info-section">
        <view class="section-title">银行信息</view>

        <view class="info-card">
          <view class="info-row">
            <text class="info-label">开户银行</text>
            <text class="info-value">{{ bankInfo.bankName }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">银行账号</text>
            <text class="info-value">{{ bankInfo.bankAccount }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">开户行名称</text>
            <text class="info-value">{{ bankInfo.branchName }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">银行账户类型</text>
            <text class="info-value">{{ bankInfo.accountType }}</text>
          </view>
        </view>
      </view>

      <!-- 法人信息 -->
      <view class="info-section">
        <view class="section-title">法人信息</view>

        <view class="info-card">
          <view class="info-row">
            <text class="info-label">姓名</text>
            <text class="info-value">{{ legalInfo.name }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">身份证号</text>
            <text class="info-value">{{ maskIdCard(legalInfo.idCard) }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">联系电话</text>
            <text class="info-value">{{ maskPhone(legalInfo.phone) }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">身份证照片</text>
            <view class="id-images">
              <view class="id-image-item">
                <image
                  :src="legalInfo.idCardFront"
                  class="id-img"
                  mode="aspectFill"
                  @tap="previewImage(legalInfo.idCardFront, [legalInfo.idCardFront, legalInfo.idCardBack])"
                />
                <text class="id-img-label">正面</text>
              </view>
              <view class="id-image-item">
                <image
                  :src="legalInfo.idCardBack"
                  class="id-img"
                  mode="aspectFill"
                  @tap="previewImage(legalInfo.idCardBack, [legalInfo.idCardFront, legalInfo.idCardBack])"
                />
                <text class="id-img-label">反面</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 超级管理员信息 -->
      <view class="info-section">
        <view class="section-title">超级管理员（联系人）信息</view>

        <view class="info-card">
          <view class="info-row">
            <text class="info-label">姓名</text>
            <text class="info-value">{{ adminInfo.name }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">手机号</text>
            <text class="info-value">{{ adminInfo.phone }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">邮箱</text>
            <text class="info-value">{{ adminInfo.email }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">职务</text>
            <text class="info-value">{{ adminInfo.position }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">微信号</text>
            <text class="info-value">{{ adminInfo.wechatId }}</text>
          </view>
        </view>
      </view>

      <!-- 企业资质 -->
      <view class="info-section">
        <view class="section-title">企业资质</view>

        <view v-if="qualifications.length === 0" class="empty-qualifications">
          <text class="empty-icon">📄</text>
          <text class="empty-text">暂无企业资质</text>
        </view>

        <view v-else class="qualifications-list">
          <view
            v-for="qual in qualifications"
            :key="qual.id"
            class="qualification-item"
            @tap="viewQualificationDetail(qual)"
          >
            <view class="qual-header">
              <text class="qual-name">{{ qual.name }}</text>
              <view :class="['qual-status', `status-${qual.status}`]">
                {{ getQualStatusText(qual.status) }}
              </view>
            </view>

            <view class="qual-meta">
              <text class="qual-no">许可证号：{{ qual.licenseNo }}</text>
              <text class="qual-expire">有效期至：{{ qual.expireDate }}</text>
            </view>

            <view class="qual-images">
              <image
                v-for="(img, index) in qual.images"
                :key="index"
                :src="img"
                class="qual-img"
                mode="aspectFill"
                @tap.stop="previewImage(img, qual.images)"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 状态栏高度
const statusBarHeight = ref(0)

// 企业信息
const companyInfo = ref({
  entityType: '企业', // 主体类型：企业、事业单位、境外主体、个体工商户
  companyName: '上海唐极科技有限公司',
  creditCode: '91310000MA1FL3XX4X',
  companyType: '有限责任公司（自然人投资或控股）',
  registerAddress: '上海市浦东新区张江高科技园区xx路xx号',
  legalPerson: '张三',
  establishDate: '2020-01-15',
  businessTerm: '2020-01-15 至 2040-01-14',
  businessScope: '从事网络技术、计算机科技领域内的技术开发、技术咨询、技术服务、技术转让，计算机系统集成，设计、制作、代理、发布各类广告，电子商务（不得从事金融业务）。',
  licenseImages: [
    '/static/business-license.jpg'
  ]
})

// 银行信息
const bankInfo = ref({
  bankName: '中国工商银行股份有限公司',
  bankAccount: '6222 0210 0100 1234 567',
  branchName: '工行上海分行张江支行',
  accountType: '企业基本户'
})

// 法人信息
const legalInfo = ref({
  name: '张三',
  idCard: '310101199001011234',
  phone: '13800138000',
  idCardFront: '/static/legal-person-id-front.png',
  idCardBack: '/static/legal-person-id-back.png'
})

// 超级管理员信息
const adminInfo = ref({
  name: '李四',
  phone: '13900139000',
  email: 'lisi@example.com',
  position: '运营总监',
  wechatId: 'lisi_wx'
})

// 企业资质列表
const qualifications = ref([
  {
    id: 1,
    name: '电信增值业务经营许可证',
    licenseNo: '沪B1-20200001',
    status: 'approved',
    expireDate: '2025-12-31',
    images: [
      '/static/background-001.png'
    ]
  },
  {
    id: 2,
    name: '网络文化经营许可证',
    licenseNo: '沪网文〔2020〕0001号',
    status: 'approved',
    expireDate: '2025-06-30',
    images: [
      '/static/network-culture-license.png'
    ]
  },
  {
    id: 3,
    name: '广播电视节目制作经营许可证',
    licenseNo: '（沪）字第00001号',
    status: 'pending',
    expireDate: '2026-03-15',
    images: [
      '/static/background-001.png'
    ]
  }
])

// 获取资质状态文本
const getQualStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '审核中',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return statusMap[status] || '未知'
}

// 脱敏身份证号
const maskIdCard = (idCard: string) => {
  if (!idCard || idCard.length < 8) return idCard
  return idCard.substring(0, 6) + '********' + idCard.substring(idCard.length - 4)
}

// 脱敏手机号
const maskPhone = (phone: string) => {
  if (!phone || phone.length < 7) return phone
  return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4)
}

// 预览图片
const previewImage = (current: string, urls: string[]) => {
  uni.previewImage({
    current,
    urls
  })
}

// 查看资质详情
const viewQualificationDetail = (qual: any) => {
  uni.showToast({
    title: `查看${qual.name}详情`,
    icon: 'none'
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 根据公司类型推断主体类型
const inferEntityType = (companyType: string) => {
  if (companyType.includes('个体工商户') || companyType.includes('个人独资')) {
    return '个体工商户'
  } else if (companyType.includes('境外') || companyType.includes('外资')) {
    return '境外主体'
  } else if (companyType.includes('事业单位')) {
    return '事业单位'
  } else {
    return '企业'
  }
}

// onLoad 接收URL参数
onLoad((options: any) => {
  console.log('=== 公司详情页 onLoad ===')
  console.log('URL参数:', options)

  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 如果有传递的公司信息，更新显示
  if (options) {
    if (options.companyName) {
      companyInfo.value.companyName = decodeURIComponent(options.companyName)
    }
    if (options.companyType) {
      companyInfo.value.companyType = decodeURIComponent(options.companyType)
      // 自动推断主体类型
      companyInfo.value.entityType = inferEntityType(companyInfo.value.companyType)
    }
    if (options.registrationDate) {
      companyInfo.value.establishDate = decodeURIComponent(options.registrationDate)
    }
  }

  console.log('最终公司信息:', companyInfo.value)
})

onMounted(() => {
  // 获取系统信息（如果onLoad未执行）
  if (statusBarHeight.value === 0) {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 0
  }
})
</script>

<style scoped lang="scss">
.company-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
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
    position: relative;
  }

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

// 内容区域
.content-area {
  padding: calc(var(--status-bar-height) + 88rpx + 30rpx) 30rpx 30rpx;
}

// 信息区块
.info-section {
  margin-bottom: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
    padding-left: 10rpx;
    border-left: 6rpx solid #667eea;
  }
}

// 信息卡片
.info-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

// 信息行
.info-row {
  margin-bottom: 30rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .info-label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 12rpx;
  }

  .info-value {
    display: block;
    font-size: 30rpx;
    color: #333;
    line-height: 1.6;
  }
}

// 营业执照照片
.license-images {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;

  .license-img {
    width: 200rpx;
    height: 280rpx;
    border-radius: 12rpx;
    background: #f5f5f5;
  }
}

// 身份证照片
.id-images {
  display: flex;
  gap: 20rpx;

  .id-image-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;

    .id-img {
      width: 280rpx;
      height: 180rpx;
      border-radius: 12rpx;
      background: #f5f5f5;
    }

    .id-img-label {
      font-size: 24rpx;
      color: #999;
    }
  }
}

// 空状态
.empty-qualifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  background: #fff;
  border-radius: 20rpx;

  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

// 资质列表
.qualifications-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.qualification-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .qual-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .qual-name {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }

    .qual-status {
      padding: 8rpx 20rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
      font-weight: 500;

      &.status-pending {
        background: #e3f2fd;
        color: #2196f3;
      }

      &.status-approved {
        background: #e8f5e9;
        color: #07c160;
      }

      &.status-rejected {
        background: #ffebee;
        color: #f44336;
      }
    }
  }

  .qual-meta {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    margin-bottom: 20rpx;

    .qual-no,
    .qual-expire {
      font-size: 26rpx;
      color: #666;
    }
  }

  .qual-images {
    display: flex;
    gap: 15rpx;
    flex-wrap: wrap;

    .qual-img {
      width: 160rpx;
      height: 220rpx;
      border-radius: 12rpx;
      background: #f5f5f5;
    }
  }
}
</style>
