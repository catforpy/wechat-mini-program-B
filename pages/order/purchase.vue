<template>
  <view class="purchase-page">
    <!-- 头部导航（透明背景） -->
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="title">购买模板</text>
      </view>
    </view>

    <!-- 横向滑动标签栏 -->
    <view class="tabs-container" :style="{ top: (statusBarHeight + 88) + 'px' }">
      <scroll-view scroll-x class="tabs-scroll" show-scrollbar="false">
        <view class="tabs-wrapper">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            class="tab-item"
            :class="{ active: currentTab === index }"
            @click="switchTab(index)"
          >
            <text class="tab-text">{{ tab }}</text>
            <view v-if="currentTab === index" class="tab-underline"></view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 占位元素 -->
    <view :style="{ height: statusBarHeight + 88 + 100 + 'px' }"></view>

    <!-- 滚动内容区 -->
    <scroll-view scroll-y class="content-scroll">
      <!-- 模板信息 -->
      <view class="section">
        <view class="section-title">模板信息</view>
        <view class="info-card">
          <view class="info-item">
            <text class="label">模板名称</text>
            <text class="value">{{ templateName }}</text>
          </view>
          <view class="info-item">
            <text class="label">类目</text>
            <text class="value">{{ categoryName }}</text>
          </view>
          <view class="info-item">
            <text class="label">价格</text>
            <text class="value price">¥{{ price }}</text>
          </view>
        </view>
      </view>

      <!-- 申请人资质 -->
      <view class="section">
        <view class="section-title">
          申请人资质
          <text class="edit-section-btn" @click="editApplicantType">切换类型</text>
        </view>
        <view class="info-card">
          <!-- 公司类型 -->
          <template v-if="applicantType === 'company'">
            <view class="info-item clickable" @click="editField('companyName', '公司名称', companyInfo.name)">
              <text class="label">公司名称</text>
              <view class="value-with-arrow">
                <text class="value">{{ companyInfo.name }}</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view class="info-item clickable" @click="editField('licenseNumber', '营业执照编号', companyInfo.licenseNumber)">
              <text class="label">营业执照编号</text>
              <view class="value-with-arrow">
                <text class="value">{{ companyInfo.licenseNumber }}</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view class="info-item clickable" @click="editField('address', '注册地址', companyInfo.address)">
              <text class="label">注册地址</text>
              <view class="value-with-arrow">
                <text class="value">{{ companyInfo.address }}</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view class="info-item clickable" @click="editField('startDate', '起始时间', companyInfo.startDate)">
              <text class="label">起始时间</text>
              <view class="value-with-arrow">
                <text class="value">{{ companyInfo.startDate }}</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view class="info-item clickable" @click="editField('endDate', '终止时间', companyInfo.endDate)">
              <text class="label">终止时间</text>
              <view class="value-with-arrow">
                <text class="value">{{ companyInfo.endDate }}</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view class="upload-item">
              <text class="label">营业执照</text>
              <view class="upload-area" @click="chooseImage('licenseImage', '营业执照')">
                <image v-if="companyInfo.licenseImage" :src="companyInfo.licenseImage" mode="aspectFit" class="upload-image" />
                <view v-else class="upload-placeholder">
                  <text class="upload-icon">+</text>
                  <text class="upload-text">点击上传营业执照</text>
                </view>
              </view>
            </view>
          </template>

          <!-- 个体工商户类型 -->
          <template v-else>
            <view class="info-item clickable" @click="editField('individualName', '个体工商户名称', individualInfo.name)">
              <text class="label">个体工商户名称</text>
              <view class="value-with-arrow">
                <text class="value">{{ individualInfo.name }}</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view class="info-item clickable" @click="editField('individualLicenseNumber', '营业执照编号', individualInfo.licenseNumber)">
              <text class="label">营业执照编号</text>
              <view class="value-with-arrow">
                <text class="value">{{ individualInfo.licenseNumber }}</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view class="upload-item">
              <text class="label">营业执照</text>
              <view class="upload-area" @click="chooseImage('individualLicenseImage', '营业执照')">
                <image v-if="individualInfo.licenseImage" :src="individualInfo.licenseImage" mode="aspectFit" class="upload-image" />
                <view v-else class="upload-placeholder">
                  <text class="upload-icon">+</text>
                  <text class="upload-text">点击上传营业执照</text>
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>

      <!-- 对公账户信息 -->
      <view class="section">
        <view class="section-title">
          {{ applicantType === 'company' ? '对公账户信息' : '个体工商户账户信息' }}
        </view>
        <view class="info-card">
          <view class="info-item clickable" @click="editField('bank', '开户银行', accountInfo.bank)">
            <text class="label">开户银行</text>
            <view class="value-with-arrow">
              <text class="value">{{ accountInfo.bank }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
          <view class="info-item clickable" @click="editField('accountName', '账户名称', accountInfo.accountName)">
            <text class="label">账户名称</text>
            <view class="value-with-arrow">
              <text class="value">{{ accountInfo.accountName }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
          <view class="info-item clickable" @click="editField('accountNumber', '银行账号', accountInfo.accountNumber)">
            <text class="label">银行账号</text>
            <view class="value-with-arrow">
              <text class="value">{{ accountInfo.accountNumber }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 超级管理员信息 -->
      <view class="section">
        <view class="section-title">超级管理员信息</view>
        <view class="info-card">
          <view class="info-item clickable" @click="editField('adminName', '姓名', adminInfo.name)">
            <text class="label">姓名</text>
            <view class="value-with-arrow">
              <text class="value">{{ adminInfo.name }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
          <view class="info-item clickable" @click="editField('idCard', '身份证号', adminInfo.idCard)">
            <text class="label">身份证号</text>
            <view class="value-with-arrow">
              <text class="value">{{ adminInfo.idCard }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
          <view class="info-item clickable" @click="editField('adminAddress', '住址', adminInfo.address)">
            <text class="label">住址</text>
            <view class="value-with-arrow">
              <text class="value">{{ adminInfo.address }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
          <view class="info-item clickable" @click="editField('idStartDate', '有效期起始', adminInfo.startDate)">
            <text class="label">有效期起始</text>
            <view class="value-with-arrow">
              <text class="value">{{ adminInfo.startDate }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
          <view class="info-item clickable" @click="editField('idEndDate', '有效期终止', adminInfo.endDate)">
            <text class="label">有效期终止</text>
            <view class="value-with-arrow">
              <text class="value">{{ adminInfo.endDate }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
          <view class="upload-item">
            <text class="label">身份证正面</text>
            <view class="upload-area" @click="chooseImage('idCardFront', '身份证正面')">
              <image v-if="adminInfo.idCardFront" :src="adminInfo.idCardFront" mode="aspectFit" class="upload-image" />
              <view v-else class="upload-placeholder">
                <text class="upload-icon">+</text>
                <text class="upload-text">点击上传身份证正面</text>
              </view>
            </view>
          </view>
          <view class="upload-item">
            <text class="label">身份证反面</text>
            <view class="upload-area" @click="chooseImage('idCardBack', '身份证反面')">
              <image v-if="adminInfo.idCardBack" :src="adminInfo.idCardBack" mode="aspectFit" class="upload-image" />
              <view v-else class="upload-placeholder">
                <text class="upload-icon">+</text>
                <text class="upload-text">点击上传身份证反面</text>
              </view>
            </view>
          </view>
          <view class="info-item clickable" @click="editPhone">
            <text class="label">手机号</text>
            <view class="value-with-arrow">
              <text class="value">{{ adminInfo.phone }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view style="height: 180rpx;"></view>
    </scroll-view>

    <!-- 购买按钮 -->
    <view class="action-area">
      <button class="buy-btn" @click="handlePurchase">立即购买</button>
    </view>

    <!-- 编辑弹窗 -->
    <view v-if="showEditModal" class="modal-mask" @click="closeEditModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">编辑{{ editFieldTitle }}</text>
          <text class="modal-close" @click="closeEditModal">×</text>
        </view>
        <view class="modal-body">
          <textarea
            v-if="editFieldType === 'textarea'"
            v-model="editValue"
            class="edit-textarea"
            :placeholder="'请输入' + editFieldTitle"
            :maxlength="500"
            auto-height
            confirm-type="done"
          />
          <input
            v-else
            v-model="editValue"
            class="edit-input"
            :placeholder="'请输入' + editFieldTitle"
            :focus="true"
            confirm-type="done"
          />
        </view>
        <view class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeEditModal">取消</button>
          <button class="modal-btn confirm-btn" @click="saveEdit">保存</button>
        </view>
      </view>
    </view>

    <!-- 切换申请人类型弹窗 -->
    <view v-if="showTypeModal" class="modal-mask" @click="closeTypeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择申请人类型</text>
          <text class="modal-close" @click="closeTypeModal">×</text>
        </view>
        <view class="modal-body">
          <view class="type-option" :class="{ active: applicantType === 'company' }" @click="selectApplicantType('company')">
            <view class="type-radio">
              <view v-if="applicantType === 'company'" class="radio-checked"></view>
            </view>
            <text class="type-label">企业</text>
          </view>
          <view class="type-option" :class="{ active: applicantType === 'individual' }" @click="selectApplicantType('individual')">
            <view class="type-radio">
              <view v-if="applicantType === 'individual'" class="radio-checked"></view>
            </view>
            <text class="type-label">个体工商户</text>
          </view>
          <view class="type-option" :class="{ active: applicantType === 'personal' }" @click="selectApplicantType('personal')">
            <view class="type-radio">
              <view v-if="applicantType === 'personal'" class="radio-checked"></view>
            </view>
            <text class="type-label">个人</text>
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

// 标签栏数据
const tabs = ['关注', '推荐', '物流服务', '教育服务', '医疗服务', '政务民生']
const currentTab = ref(1) // 默认选中"推荐"

// 模板信息
const templateName = ref('')
const categoryName = ref('小程序模板')
const price = ref(2980)

// 申请人类型：company-企业, individual-个体工商户, personal-个人
const applicantType = ref('company')

// 公司类型信息
const companyInfo = ref({
  name: '成都都达网络科技有限公司',
  licenseNumber: '91510100MA61U7Y42X',
  address: '成都市武侯区天府三街218号',
  startDate: '2018-01-15',
  endDate: '2038-01-14',
  licenseImage: '/static/business-license.jpg'
})

// 个体工商户信息
const individualInfo = ref({
  name: '成都武侯区XX个体工商户',
  licenseNumber: '92510100MA61U7Y42X',
  licenseImage: '/static/business-license.jpg'
})

// 对公账户信息
const accountInfo = ref({
  bank: '中国工商银行股份有限公司成都高新支行',
  accountName: '成都都达网络科技有限公司',
  accountNumber: '4402244010222234567'
})

// 超级管理员信息
const adminInfo = ref({
  name: '张三',
  idCard: '510107199001011234',
  address: '成都市武侯区天府三街218号',
  startDate: '2020-01-01',
  endDate: '2030-01-01',
  idCardFront: '/static/法人身份证正面.png',
  idCardBack: '/static/法人身份证反面.png',
  phone: '15190311094'
})

// 编辑弹窗
const showEditModal = ref(false)
const editFieldTitle = ref('')
const editFieldName = ref('')
const editValue = ref('')
const editFieldType = ref('input') // input 或 textarea

// 切换类型弹窗
const showTypeModal = ref(false)

onLoad((options: any) => {
  if (options?.templateName) {
    templateName.value = decodeURIComponent(options.templateName)
  }

  // 根据模板名称生成价格
  const hash = templateName.value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  price.value = (hash % 50) * 100 + 2800

  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})

onMounted(() => {
  // TODO: 从后端获取申请人资质信息
  loadApplicantInfo()
})

// 加载申请人信息
const loadApplicantInfo = () => {
  // TODO: 调用后端API获取真实的申请人资质信息
  console.log('加载申请人资质信息')
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 切换标签
const switchTab = (index: number) => {
  currentTab.value = index
  console.log('切换到标签:', tabs[index])
}

// 编辑字段
const editField = (fieldName: string, title: string, value: string) => {
  editFieldName.value = fieldName
  editFieldTitle.value = title
  editValue.value = value
  editFieldType.value = fieldName.includes('Address') || fieldName.includes('address') ? 'textarea' : 'input'
  showEditModal.value = true
}

// 关闭编辑弹窗
const closeEditModal = () => {
  showEditModal.value = false
  editValue.value = ''
}

// 保存编辑
const saveEdit = () => {
  if (!editValue.value.trim()) {
    uni.showToast({
      title: '内容不能为空',
      icon: 'none'
    })
    return
  }

  // 根据字段名更新对应的数据
  const field = editFieldName.value
  const value = editValue.value.trim()

  if (field === 'companyName') companyInfo.value.name = value
  else if (field === 'licenseNumber') companyInfo.value.licenseNumber = value
  else if (field === 'address') companyInfo.value.address = value
  else if (field === 'startDate') companyInfo.value.startDate = value
  else if (field === 'endDate') companyInfo.value.endDate = value
  else if (field === 'individualName') individualInfo.value.name = value
  else if (field === 'individualLicenseNumber') individualInfo.value.licenseNumber = value
  else if (field === 'bank') accountInfo.value.bank = value
  else if (field === 'accountName') accountInfo.value.accountName = value
  else if (field === 'accountNumber') accountInfo.value.accountNumber = value
  else if (field === 'adminName') adminInfo.value.name = value
  else if (field === 'idCard') adminInfo.value.idCard = value
  else if (field === 'adminAddress') adminInfo.value.address = value
  else if (field === 'idStartDate') adminInfo.value.startDate = value
  else if (field === 'idEndDate') adminInfo.value.endDate = value

  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })

  closeEditModal()
}

// 选择图片
const chooseImage = (fieldName: string, title: string) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]

      // TODO: 上传图片到服务器
      // 这里暂时使用本地路径
      if (fieldName === 'licenseImage') {
        companyInfo.value.licenseImage = tempFilePath
      } else if (fieldName === 'individualLicenseImage') {
        individualInfo.value.licenseImage = tempFilePath
      } else if (fieldName === 'idCardFront') {
        adminInfo.value.idCardFront = tempFilePath
      } else if (fieldName === 'idCardBack') {
        adminInfo.value.idCardBack = tempFilePath
      }

      uni.showToast({
        title: '上传成功',
        icon: 'success'
      })
    }
  })
}

// 编辑手机号
const editPhone = () => {
  uni.showModal({
    title: '验证手机号',
    content: '我们将发送验证码到 ' + adminInfo.value.phone,
    confirmText: '发送验证码',
    success: (res) => {
      if (res.confirm) {
        // TODO: 发送验证码
        // 模拟发送验证码
        uni.showModal({
          title: '输入验证码',
          editable: true,
          placeholderText: '请输入验证码',
          success: (res) => {
            if (res.confirm && res.content) {
              // TODO: 验证验证码
              if (res.content === '123456') {
                // 模拟验证成功，允许修改
                editField('phone', '手机号', adminInfo.value.phone)
              } else {
                uni.showToast({
                  title: '验证码错误',
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

// 切换申请人类型
const editApplicantType = () => {
  showTypeModal.value = true
}

// 关闭类型弹窗
const closeTypeModal = () => {
  showTypeModal.value = false
}

// 选择申请人类型
const selectApplicantType = (type: string) => {
  applicantType.value = type
  closeTypeModal()
  uni.showToast({
    title: type === 'company' ? '已切换为企业' : type === 'individual' ? '已切换为个体工商户' : '已切换为个人',
    icon: 'none'
  })
}

// 立即购买
const handlePurchase = async () => {
  uni.showLoading({
    title: '检查资质状态...',
    mask: true
  })

  // TODO: 调用后端API检查资质审核状态
  // 模拟：用户已经上传了资质并通过审核
  const qualificationStatus = 'approved' // approved: 已通过, pending: 审核中, rejected: 未通过, none: 未上传

  uni.hideLoading()

  if (qualificationStatus === 'approved') {
    // 资质已审核通过，可以直接购买
    uni.showModal({
      title: '购买确认',
      content: `您的资质已审核通过！\n\n确认购买 ${templateName.value} 模板？\n价格：¥${price.value}\n\n提交后将由工作人员联系您完成购买流程。`,
      confirmText: '确认购买',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // TODO: 提交购买申请到后端
          uni.showLoading({
            title: '提交中...',
            mask: true
          })

          setTimeout(() => {
            uni.hideLoading()
            uni.showModal({
              title: '提交成功',
              content: `购买申请已提交！\n\n工作人员将在1-2个工作日内联系您。\n\n模板：${templateName.value}\n价格：¥${price.value}`,
              showCancel: false,
              success: () => {
                // 返回首页
                uni.switchTab({
                  url: '/pages/index/index'
                })
              }
            })
          }, 1000)
        }
      }
    })
  } else if (qualificationStatus === 'pending') {
    // 资质审核中
    uni.showModal({
      title: '资质审核中',
      content: '您提交的资质正在审核中，请耐心等待审核通过后再购买。\n\n预计审核时间：1-3个工作日',
      showCancel: false,
      success: () => {
        uni.switchTab({
          url: '/pages/profile/index'
        })
      }
    })
  } else if (qualificationStatus === 'none') {
    // 未上传资质
    uni.showModal({
      title: '请先上传资质',
      content: '购买模板需要先上传相关资质信息。\n\n请前往"我的"页面完成资质上传。',
      confirmText: '去上传',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.switchTab({
            url: '/pages/profile/index'
          })
        }
      }
    })
  } else {
    // 资质审核未通过
    uni.showModal({
      title: '资质未通过',
      content: '您提交的资质审核未通过。\n\n请前往"我的"页面查看审核意见并重新提交。',
      confirmText: '去查看',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.switchTab({
            url: '/pages/profile/index'
          })
        }
      }
    })
  }
}
</script>

<style scoped lang="scss">
.purchase-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  background-image: url('/static/background-001.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

// 头部导航（透明）
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: transparent;
  z-index: 1000;
}

.header-content {
  position: relative;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: 30rpx;
  padding: 10rpx;
}

.back-icon {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: bold;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}

// 横向滑动标签栏
.tabs-container {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  background: transparent;
}

.tabs-scroll {
  width: 100%;
  white-space: nowrap;
}

.tabs-wrapper {
  display: inline-flex;
  padding: 0 30rpx;
}

.tab-item {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 30rpx;
  margin-right: 10rpx;
}

.tab-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s;
  white-space: nowrap;
}

.tab-item.active .tab-text {
  color: #ffffff;
  font-weight: bold;
}

.tab-underline {
  position: absolute;
  bottom: 10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background-color: #ffffff;
  border-radius: 3rpx;
}

// 滚动内容区
.content-scroll {
  height: calc(100vh - 180rpx);
}

// 通用区块
.section {
  margin: 30rpx;
}

.section-title {
  position: relative;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-left: 10rpx;
  border-left: 6rpx solid #667eea;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-section-btn {
  font-size: 24rpx;
  color: #667eea;
  padding: 8rpx 20rpx;
  border: 1rpx solid #667eea;
  border-radius: 30rpx;
}

.info-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 25rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background-color: #ffffff;

  &.clickable {
    &:active {
      background-color: #f8f8f8;
    }
  }

  &:last-child {
    border-bottom: none;
  }
}

.label {
  width: 180rpx;
  font-size: 28rpx;
  color: #666;
  flex-shrink: 0;
}

.value-with-arrow {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  word-break: break-all;

  &.price {
    font-size: 36rpx;
    font-weight: bold;
    color: #ff4444;
  }
}

.arrow {
  font-size: 40rpx;
  color: #999;
  margin-left: 10rpx;
}

// 上传区域
.upload-item {
  padding: 25rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.upload-area {
  margin-top: 20rpx;
  width: 100%;
  height: 400rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #f5f5f5;
  border: 2rpx dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-image {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 80rpx;
  color: #999;
}

.upload-text {
  font-size: 26rpx;
  color: #999;
  margin-top: 20rpx;
}

// 底部购买按钮
.action-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.buy-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  border-radius: 44rpx;

  &::after {
    border: none;
  }
}

// 弹窗样式
.modal-mask {
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

.modal-content {
  width: 600rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
}

.modal-header {
  position: relative;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.modal-body {
  padding: 30rpx;
  position: relative;
  z-index: 2001;
}

.edit-input,
.edit-textarea {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  background-color: #ffffff;
  color: #333;
  position: relative;
  z-index: 2002;
  box-sizing: border-box;
}

.edit-input {
  height: 80rpx;
  line-height: 40rpx;
}

.edit-textarea {
  min-height: 200rpx;
  line-height: 40rpx;
}

.modal-footer {
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

  &::after {
    border: none;
  }
}

.cancel-btn {
  color: #666;
  background-color: #ffffff;
  border-right: 1rpx solid #f0f0f0;
}

.confirm-btn {
  color: #667eea;
  font-weight: bold;
  background-color: #ffffff;
}

// 类型选择
.type-option {
  display: flex;
  align-items: center;
  padding: 25rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &.active {
    background-color: #f0f5ff;
  }
}

.type-radio {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #ddd;
  border-radius: 50%;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-checked {
  width: 24rpx;
  height: 24rpx;
  background-color: #667eea;
  border-radius: 50%;
}

.type-label {
  font-size: 28rpx;
  color: #333;
}
</style>
