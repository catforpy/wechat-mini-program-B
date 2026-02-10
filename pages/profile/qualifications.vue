<template>
  <view class="qualifications-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">资质管理</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area">
      <!-- 营业执照信息 -->
      <view class="qual-section">
        <view class="section-header">
          <text class="section-title">营业执照信息</text>
          <view class="section-status" :class="`status-${businessLicense.status}`">
            {{ getQualStatusText(businessLicense.status) }}
          </view>
        </view>

        <view class="qual-card">
          <view class="qual-row">
            <text class="qual-label">企业名称</text>
            <text class="qual-value">{{ businessLicense.companyName }}</text>
          </view>

          <view class="qual-row">
            <text class="qual-label">统一社会信用代码</text>
            <text class="qual-value">{{ businessLicense.creditCode }}</text>
          </view>

          <view class="qual-row">
            <text class="qual-label">法定代表人</text>
            <text class="qual-value">{{ businessLicense.legalPerson }}</text>
          </view>

          <view class="qual-row">
            <text class="qual-label">营业执照照片</text>
          </view>

          <view class="qual-images">
            <view
              v-for="(img, index) in businessLicense.images"
              :key="index"
              class="qual-image-item"
            >
              <image
                :src="img"
                class="qual-img"
                mode="aspectFill"
                @tap="previewImage(img, businessLicense.images)"
              />
              <view v-if="index === businessLicense.images.length - 1" class="img-add-btn" @tap="addImage('businessLicense')">
                <text class="add-icon">+</text>
              </view>
            </view>
          </view>

          <view class="qual-actions">
            <button class="action-btn" @tap="editQualification('businessLicense')">修改</button>
          </view>
        </view>
      </view>

      <!-- 法人身份证信息 -->
      <view class="qual-section">
        <view class="section-header">
          <text class="section-title">法人身份证信息</text>
          <view class="section-status" :class="`status-${legalIdCard.status}`">
            {{ getQualStatusText(legalIdCard.status) }}
          </view>
        </view>

        <view class="qual-card">
          <view class="qual-row">
            <text class="qual-label">姓名</text>
            <text class="qual-value">{{ legalIdCard.name }}</text>
          </view>

          <view class="qual-row">
            <text class="qual-label">身份证号</text>
            <text class="qual-value">{{ maskIdCard(legalIdCard.idCard) }}</text>
          </view>

          <view class="qual-row">
            <text class="qual-label">身份证照片</text>
          </view>

          <view class="qual-images">
            <view class="id-card-group">
              <image
                :src="legalIdCard.frontImage"
                class="id-img"
                mode="aspectFill"
                @tap="previewImage(legalIdCard.frontImage, [legalIdCard.frontImage, legalIdCard.backImage])"
              />
              <text class="id-label">正面</text>
            </view>

            <view class="id-card-group">
              <image
                :src="legalIdCard.backImage"
                class="id-img"
                mode="aspectFill"
                @tap="previewImage(legalIdCard.backImage, [legalIdCard.frontImage, legalIdCard.backImage])"
              />
              <text class="id-label">反面</text>
            </view>
          </view>

          <view class="qual-actions">
            <button class="action-btn" @tap="editQualification('legalIdCard')">修改</button>
          </view>
        </view>
      </view>

      <!-- 其他企业资质 -->
      <view class="qual-section">
        <view class="section-header">
          <text class="section-title">企业资质</text>
          <button class="add-btn" @tap="addQualification">
            <text class="add-icon">+</text>
            <text>添加资质</text>
          </button>
        </view>

        <view v-if="otherQualifications.length === 0" class="empty-state">
          <text class="empty-icon">📄</text>
          <text class="empty-text">暂无其他资质</text>
        </view>

        <view v-else class="qual-list">
          <view
            v-for="qual in otherQualifications"
            :key="qual.id"
            class="qual-item"
          >
            <view class="qual-item-header">
              <text class="qual-item-name">{{ qual.name }}</text>
              <view :class="['qual-item-status', `status-${qual.status}`]">
                {{ getQualStatusText(qual.status) }}
              </view>
            </view>

            <view class="qual-item-meta">
              <text class="qual-item-no">许可证号：{{ qual.licenseNo }}</text>
              <text class="qual-item-expire">有效期至：{{ qual.expireDate }}</text>
            </view>

            <view class="qual-item-images">
              <image
                v-for="(img, index) in qual.images"
                :key="index"
                :src="img"
                class="qual-item-img"
                mode="aspectFill"
                @tap="previewImage(img, qual.images)"
              />
            </view>

            <view class="qual-item-actions">
              <button class="item-action-btn" @tap="editQualification('other', qual)">编辑</button>
              <button class="item-action-btn delete" @tap="deleteQualification(qual)">删除</button>
            </view>
          </view>
        </view>
      </view>

      <!-- 添加资质提示 -->
      <view class="tips-card">
        <view class="tips-header">
          <text class="tips-icon">💡</text>
          <text class="tips-title">温馨提示</text>
        </view>
        <view class="tips-content">
          <text class="tips-text">• 营业执照和法人身份证为必填项</text>
          <text class="tips-text">• 根据您的经营类型，可能需要上传以下资质之一：</text>
          <text class="tips-text">  - 电信增值业务经营许可证</text>
          <text class="tips-text">  - 网络文化经营许可证</text>
          <text class="tips-text">  - 广播电视节目制作经营许可证</text>
          <text class="tips-text">  - 食品经营许可证</text>
          <text class="tips-text">  - 药品经营许可证</text>
          <text class="tips-text">• 所有资质证书需在有效期内</text>
          <text class="tips-text">• 图片支持 jpg、png 格式，大小不超过 5MB</text>
        </view>
      </view>
    </view>

    <!-- 添加资质弹窗 -->
    <view v-if="showAddModal" class="modal-overlay" @tap="closeAddModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">选择资质类型</text>
          <view class="modal-close" @tap="closeAddModal">✕</view>
        </view>

        <view class="qual-types">
          <view
            v-for="type in qualificationTypes"
            :key="type.value"
            class="qual-type-item"
            @tap="selectQualType(type)"
          >
            <text class="type-icon">{{ type.icon }}</text>
            <text class="type-name">{{ type.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(0)

// 是否显示添加弹窗
const showAddModal = ref(false)

// 营业执照信息
const businessLicense = ref({
  status: 'approved',
  companyName: '上海唐极科技有限公司',
  creditCode: '91310000MA1FL3XX4X',
  legalPerson: '张三',
  images: [
    '/static/business-license.jpg'
  ]
})

// 法人身份证信息
const legalIdCard = ref({
  status: 'approved',
  name: '张三',
  idCard: '310101199001011234',
  frontImage: '/static/legal-person-id-front.png',
  backImage: '/static/legal-person-id-back.png'
})

// 其他企业资质
const otherQualifications = ref([
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

// 资质类型列表
const qualificationTypes = [
  { label: '电信增值业务经营许可证', value: 'telecom', icon: '📡' },
  { label: '网络文化经营许可证', value: 'network_culture', icon: '🎬' },
  { label: '广播电视节目制作经营许可证', value: 'broadcast', icon: '📺' },
  { label: '食品经营许可证', value: 'food', icon: '🍔' },
  { label: '药品经营许可证', value: 'medicine', icon: '💊' },
  { label: '医疗器械经营许可证', value: 'medical_device', icon: '🏥' },
  { label: '出版物经营许可证', value: 'publication', icon: '📚' },
  { label: '其他资质', value: 'other', icon: '📄' }
]

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

// 预览图片
const previewImage = (current: string, urls: string[]) => {
  uni.previewImage({
    current,
    urls
  })
}

// 添加图片
const addImage = (type: string) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      uni.showToast({
        title: '图片选择成功',
        icon: 'success'
      })
      // TODO: 上传图片到服务器
    }
  })
}

// 编辑资质
const editQualification = (type: string, qual?: any) => {
  uni.showToast({
    title: qual ? `编辑${qual.name}` : '编辑资质',
    icon: 'none'
  })
  // TODO: 跳转到编辑页面或弹出编辑表单
}

// 添加资质
const addQualification = () => {
  showAddModal.value = true
}

// 关闭添加弹窗
const closeAddModal = () => {
  showAddModal.value = false
}

// 选择资质类型
const selectQualType = (type: any) => {
  closeAddModal()
  uni.showToast({
    title: `添加${type.label}`,
    icon: 'none'
  })
  // TODO: 跳转到资质填写页面
}

// 删除资质
const deleteQualification = (qual: any) => {
  uni.showModal({
    title: '删除资质',
    content: `确定要删除${qual.name}吗？`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用删除接口
        const index = otherQualifications.value.findIndex(q => q.id === qual.id)
        if (index > -1) {
          otherQualifications.value.splice(index, 1)
        }
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }
    }
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
</script>

<style scoped lang="scss">
.qualifications-page {
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

// 资质区块
.qual-section {
  margin-bottom: 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      padding-left: 10rpx;
      border-left: 6rpx solid #667eea;
    }

    .section-status {
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

    .add-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 20rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 40rpx;
      font-size: 26rpx;
      color: #fff;

      .add-icon {
        font-size: 32rpx;
        font-weight: bold;
      }
    }
  }
}

// 资质卡片
.qual-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

// 资质信息行
.qual-row {
  margin-bottom: 25rpx;

  .qual-label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
  }

  .qual-value {
    display: block;
    font-size: 30rpx;
    color: #333;
  }
}

// 资质图片
.qual-images {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
  margin-bottom: 20rpx;

  .qual-image-item {
    position: relative;
    width: 200rpx;
    height: 280rpx;

    .qual-img {
      width: 100%;
      height: 100%;
      border-radius: 12rpx;
      background: #f5f5f5;
    }

    .img-add-btn {
      position: absolute;
      bottom: -10rpx;
      right: -10rpx;
      width: 60rpx;
      height: 60rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 10rpx rgba(102, 126, 234, 0.3);

      .add-icon {
        color: #fff;
        font-size: 40rpx;
        font-weight: bold;
        line-height: 1;
      }
    }
  }

  .id-card-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;

    .id-img {
      width: 280rpx;
      height: 180rpx;
      border-radius: 12rpx;
      background: #f5f5f5;
    }

    .id-label {
      font-size: 24rpx;
      color: #999;
    }
  }
}

// 资质操作按钮
.qual-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;

  .action-btn {
    padding: 16rpx 40rpx;
    background: #fff;
    border: 1rpx solid #667eea;
    border-radius: 40rpx;
    font-size: 28rpx;
    color: #667eea;
  }
}

// 空状态
.empty-state {
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
.qual-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.qual-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .qual-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .qual-item-name {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }

    .qual-item-status {
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

  .qual-item-meta {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    margin-bottom: 20rpx;

    .qual-item-no,
    .qual-item-expire {
      font-size: 26rpx;
      color: #666;
    }
  }

  .qual-item-images {
    display: flex;
    gap: 15rpx;
    flex-wrap: wrap;
    margin-bottom: 20rpx;

    .qual-item-img {
      width: 160rpx;
      height: 220rpx;
      border-radius: 12rpx;
      background: #f5f5f5;
    }
  }

  .qual-item-actions {
    display: flex;
    gap: 20rpx;
    justify-content: flex-end;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .item-action-btn {
      padding: 14rpx 32rpx;
      border-radius: 40rpx;
      font-size: 26rpx;
      background: #fff;
      border: 1rpx solid #ddd;
      color: #666;

      &.delete {
        border-color: #f44336;
        color: #f44336;
      }
    }
  }
}

// 温馨提示
.tips-card {
  background: #fff8e1;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;

  .tips-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 20rpx;

    .tips-icon {
      font-size: 36rpx;
    }

    .tips-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #f57c00;
    }
  }

  .tips-content {
    display: flex;
    flex-direction: column;
    gap: 10rpx;

    .tips-text {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}

// 添加资质弹窗
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 30rpx;
}

.modal-content {
  width: 100%;
  max-width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  max-height: 80vh;
  overflow-y: auto;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .modal-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .modal-close {
      width: 50rpx;
      height: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
      color: #999;
    }
  }

  .qual-types {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;

    .qual-type-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30rpx 20rpx;
      background: #f5f5f5;
      border-radius: 16rpx;
      gap: 15rpx;
      transition: all 0.3s;

      &:active {
        background: #e8eaf6;
        transform: scale(0.98);
      }

      .type-icon {
        font-size: 60rpx;
      }

      .type-name {
        font-size: 26rpx;
        color: #333;
        text-align: center;
      }
    }
  }
}
</style>
