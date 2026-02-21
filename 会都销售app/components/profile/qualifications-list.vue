<template>
  <view class="qualifications-list">
    <!-- 已添加的资质列表 -->
    <view v-if="localQualifications.length > 0" class="qualification-list">
      <view
        v-for="(qualification, index) in localQualifications"
        :key="index"
        class="qualification-item"
      >
        <view class="item-header">
          <view class="item-left">
            <text class="qualification-type">{{ qualification.type }}</text>
            <text v-if="qualification.certificateNumber" class="cert-number">
              证号：{{ qualification.certificateNumber }}
            </text>
          </view>
          <view class="delete-btn" @tap="deleteQualification(index)">
            <text class="delete-icon">🗑</text>
          </view>
        </view>

        <!-- 资质图片 -->
        <view v-if="qualification.images.length > 0" class="images-row">
          <view
            v-for="(image, imgIndex) in qualification.images"
            :key="imgIndex"
            class="image-item"
            @tap="previewImage(qualification.images, imgIndex)"
          >
            <image class="qualification-image" :src="image" mode="aspectFill" />
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text class="empty-icon">📄</text>
      <text class="empty-text">暂无资质信息</text>
      <text class="empty-hint">根据业务需求添加相应资质</text>
    </view>

    <!-- 添加资质按钮 -->
    <view class="add-qualification-btn" @tap="showQualificationSelector">
      <text class="add-icon">+</text>
      <text class="add-text">添加资质</text>
    </view>

    <!-- 推荐资质（根据服务类型） -->
    <view v-if="recommendedQualificationIds.length > 0" class="recommended-section">
      <view class="recommended-title">
        <text class="title-icon">💡</text>
        <text class="title-text">根据「{{ serviceType }}」业务推荐</text>
      </view>
      <view class="recommended-list">
        <view
          v-for="qualId in recommendedQualificationIds"
          :key="qualId"
          class="recommended-item"
          @tap="selectRecommendedQualification(qualId)"
        >
          <text class="recommended-icon">{{ getQualificationById(qualId)?.icon }}</text>
          <text class="recommended-name">{{ getQualificationById(qualId)?.name }}</text>
          <text class="recommended-arrow">→</text>
        </view>
      </view>
    </view>

    <!-- 提示信息 -->
    <view class="tips-section">
      <view class="tips-item">
        <text class="tips-icon">ℹ</text>
        <text class="tips-text">如需经营特殊业务，请添加相应资质许可证</text>
      </view>
      <view class="tips-item">
        <text class="tips-icon">ℹ</text>
        <text class="tips-text">资质信息将加快审核通过速度</text>
      </view>
    </view>

    <!-- 资质选择器弹窗 -->
    <view v-if="showSelector" class="selector-mask" @tap="hideSelector">
      <view class="selector-panel" @tap.stop>
        <view class="panel-header">
          <text class="panel-title">选择资质类型</text>
          <view class="close-btn" @tap="hideSelector">
            <text class="close-icon">×</text>
          </view>
        </view>

        <!-- 常用资质 -->
        <view class="section-title">常用资质</view>
        <view class="qualification-options">
          <view
            v-for="qual in commonQualifications"
            :key="qual.id"
            class="option-item"
            @tap="selectQualification(qual)"
          >
            <text class="option-icon">{{ qual.icon }}</text>
            <text class="option-name">{{ qual.name }}</text>
          </view>
        </view>

        <!-- 其他资质 -->
        <view class="section-title">其他资质</view>
        <view class="qualification-options">
          <view
            v-for="qual in otherQualifications"
            :key="qual.id"
            class="option-item"
            @tap="selectQualification(qual)"
          >
            <text class="option-icon">{{ qual.icon }}</text>
            <text class="option-name">{{ qual.name }}</text>
          </view>
        </view>

        <!-- 自定义 -->
        <view class="custom-option" @tap="showCustomInput">
          <text class="custom-icon">✏️</text>
          <text class="custom-text">自定义资质名称</text>
        </view>
      </view>
    </view>

    <!-- 资质详情弹窗 -->
    <view v-if="showDetailDialog" class="dialog-mask" @tap="hideDetailDialog">
      <view class="dialog-panel" @tap.stop>
        <view class="dialog-header">
          <text class="dialog-title">添加{{ currentQualification?.name }}</text>
        </view>

        <view class="dialog-content">
          <!-- 证件号码 -->
          <view class="form-item">
            <view class="item-label">证件号码</view>
            <input
              class="item-input"
              placeholder="请输入证件号码（选填）"
              v-model="certificateNumber"
              placeholder-class="input-placeholder"
            />
          </view>

          <!-- 上传图片 -->
          <view class="form-item">
            <view class="item-label">
              <text>资质图片</text>
              <text class="required">*</text>
            </view>
            <view class="image-upload">
              <view
                v-for="(image, index) in tempImages"
                :key="index"
                class="upload-image-item"
              >
                <image class="upload-image" :src="image" mode="aspectFill" />
                <view class="image-delete" @tap="deleteTempImage(index)">
                  <text class="delete-icon">×</text>
                </view>
              </view>

              <view
                v-if="tempImages.length < 3"
                class="upload-button"
                @tap="chooseQualificationImage"
              >
                <text class="upload-icon">+</text>
                <text class="upload-text">上传图片</text>
              </view>
            </view>
          </view>
        </view>

        <view class="dialog-footer">
          <view class="footer-btn cancel" @tap="hideDetailDialog">
            <text>取消</text>
          </view>
          <view class="footer-btn confirm" @tap="confirmQualification">
            <text>确定</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 自定义资质输入弹窗 -->
    <view v-if="showCustomDialog" class="dialog-mask" @tap="hideCustomDialog">
      <view class="dialog-panel small" @tap.stop>
        <view class="dialog-header">
          <text class="dialog-title">自定义资质</text>
        </view>

        <view class="dialog-content">
          <input
            class="custom-input"
            placeholder="请输入资质名称"
            v-model="customQualificationName"
            placeholder-class="input-placeholder"
            :focus="showCustomDialog"
          />
        </view>

        <view class="dialog-footer">
          <view class="footer-btn cancel" @tap="hideCustomDialog">
            <text>取消</text>
          </view>
          <view class="footer-btn confirm" @tap="confirmCustomQualification">
            <text>确定</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 服务类型与推荐资质的映射
const serviceTypeQualificationMap: Record<string, string[]> = {
  '物流服务': ['logistics'],
  '教育服务': ['book'],
  '医疗服务': ['medical'],
  '金融业': ['telecom'],
  '餐饮服务': ['food', 'health'],
  '旅游服务': ['travel'],
  '电商平台': ['telecom'],
  '文娱': ['culture'],
  '工具': [],
  '体育': [],
  '汽车服务': [],
  '咨询': [],
  '房地产服务': [],
  '生活服务': ['health'],
  'IT科技': ['telecom'],
  '交通服务': ['logistics'],
  '商业服务': [],
  '社交': ['telecom'],
  '快递业与邮政': ['logistics'],
  '出行与交通': ['logistics'],
  '本地服务': ['health']
}

// 资质数据接口
export interface Qualification {
  type: string
  certificateNumber: string
  images: string[]
}

// Props
interface Props {
  entityType: '企业' | '个人' | '境外'
  serviceType?: string // 服务类型（如：物流服务、教育服务等）
  modelValue: Qualification[]
}

const props = withDefaults(defineProps<Props>(), {
  serviceType: ''
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Qualification[]]
}>()

// 本地数据
const localQualifications = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 显示选择器
const showSelector = ref(false)
const showDetailDialog = ref(false)
const showCustomDialog = ref(false)

// 当前选中的资质
const currentQualification = ref<{ id: string; name: string; icon: string } | null>(null)

// 证件号码
const certificateNumber = ref('')

// 临时图片列表
const tempImages = ref<string[]>([])

// 自定义资质名称
const customQualificationName = ref('')

// 根据服务类型获取推荐资质
const recommendedQualificationIds = computed(() => {
  if (!props.serviceType) return []
  return serviceTypeQualificationMap[props.serviceType] || []
})

// 企业常用资质
const commonQualifications = [
  { id: 'telecom', name: '增值电信业务经营许可证', icon: '📡' },
  { id: 'culture', name: '网络文化经营许可证', icon: '🎭' },
  { id: 'food', name: '食品经营许可证', icon: '🍜' },
  { id: 'medical', name: '医疗器械经营许可证', icon: '💊' },
  { id: 'book', name: '出版物经营许可证', icon: '📚' },
  { id: 'travel', name: '旅行社业务经营许可证', icon: '✈️' }
]

// 其他资质
const otherQualifications = [
  { id: 'health', name: '食品健康证', icon: '🏥' },
  { id: 'fire', name: '消防许可证', icon: '🔥' },
  { id: 'environment', name: '环保许可证', icon: '🌿' },
  { id: 'ad', name: '广告经营许可证', icon: '📺' },
  { id: 'logistics', name: '道路运输经营许可证', icon: '🚚' },
  { id: 'construction', name: '建筑资质证书', icon: '🏗️' }
]

// 显示资质选择器
const showQualificationSelector = () => {
  showSelector.value = true
}

// 隐藏选择器
const hideSelector = () => {
  showSelector.value = false
}

// 选择资质
const selectQualification = (qual: { id: string; name: string; icon: string }) => {
  currentQualification.value = qual
  certificateNumber.value = ''
  tempImages.value = []
  showSelector.value = false
  showDetailDialog.value = true
}

// 显示自定义输入
const showCustomInput = () => {
  customQualificationName.value = ''
  showSelector.value = false
  showCustomDialog.value = true
}

// 隐藏自定义弹窗
const hideCustomDialog = () => {
  showCustomDialog.value = false
}

// 确认自定义资质
const confirmCustomQualification = () => {
  if (!customQualificationName.value.trim()) {
    uni.showToast({
      title: '请输入资质名称',
      icon: 'none'
    })
    return
  }

  currentQualification.value = {
    id: 'custom',
    name: customQualificationName.value,
    icon: '📄'
  }
  certificateNumber.value = ''
  tempImages.value = []
  showCustomDialog.value = false
  showDetailDialog.value = true
}

// 隐藏详情弹窗
const hideDetailDialog = () => {
  showDetailDialog.value = false
  currentQualification.value = null
  certificateNumber.value = ''
  tempImages.value = []
}

// 选择资质图片
const chooseQualificationImage = () => {
  const remainCount = 3 - tempImages.value.length

  uni.chooseImage({
    count: remainCount,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths

      // 验证文件大小
      const validFiles: string[] = []

      tempFilePaths.forEach((filePath) => {
        uni.getFileInfo({
          filePath,
          success: (fileInfo) => {
            if (fileInfo.size <= 5 * 1024 * 1024) {
              validFiles.push(filePath)
            }

            if (validFiles.length === tempFilePaths.length) {
              tempImages.value = [...tempImages.value, ...validFiles]
            }
          },
          fail: () => {
            validFiles.push(filePath)
            if (validFiles.length === tempFilePaths.length) {
              tempImages.value = [...tempImages.value, ...validFiles]
            }
          }
        })
      })
    }
  })
}

// 删除临时图片
const deleteTempImage = (index: number) => {
  tempImages.value.splice(index, 1)
}

// 确认添加资质
const confirmQualification = () => {
  if (!currentQualification.value) return

  if (tempImages.value.length === 0) {
    uni.showToast({
      title: '请至少上传一张资质图片',
      icon: 'none'
    })
    return
  }

  const newQualification: Qualification = {
    type: currentQualification.value.name,
    certificateNumber: certificateNumber.value,
    images: [...tempImages.value]
  }

  localQualifications.value = [...localQualifications.value, newQualification]

  hideDetailDialog()

  uni.showToast({
    title: '添加成功',
    icon: 'success'
  })
}

// 删除资质
const deleteQualification = (index: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个资质吗？',
    success: (res) => {
      if (res.confirm) {
        localQualifications.value.splice(index, 1)
        uni.showToast({
          title: '已删除',
          icon: 'success'
        })
      }
    }
  })
}

// 预览图片
const previewImage = (images: string[], currentIndex: number) => {
  uni.previewImage({
    urls: images,
    current: currentIndex
  })
}

// 根据ID获取资质
const getQualificationById = (id: string) => {
  return [...commonQualifications, ...otherQualifications].find(q => q.id === id)
}

// 选择推荐资质
const selectRecommendedQualification = (qualId: string) => {
  const qual = getQualificationById(qualId)
  if (qual) {
    selectQualification(qual)
  }
}
</script>

<style scoped lang="scss">
.qualifications-list {
  // 资质列表
  .qualification-list {
    margin-bottom: 20rpx;

    .qualification-item {
      background: #f8f8f8;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16rpx;

        .item-left {
          flex: 1;
          display: flex;
          flex-direction: column;

          .qualification-type {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 6rpx;
          }

          .cert-number {
            font-size: 24rpx;
            color: #999;
          }
        }

        .delete-btn {
          padding: 8rpx;

          .delete-icon {
            font-size: 32rpx;
          }

          &:active {
            opacity: 0.6;
          }
        }
      }

      .images-row {
        display: flex;
        gap: 12rpx;

        .image-item {
          width: 120rpx;
          height: 120rpx;
          border-radius: 8rpx;
          overflow: hidden;

          .qualification-image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  // 空状态
  .empty-state {
    text-align: center;
    padding: 60rpx 30rpx;

    .empty-icon {
      display: block;
      font-size: 80rpx;
      margin-bottom: 16rpx;
    }

    .empty-text {
      display: block;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 8rpx;
    }

    .empty-hint {
      display: block;
      font-size: 22rpx;
      color: #999;
    }
  }

  // 添加按钮
  .add-qualification-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border: 2rpx dashed #667eea;
    border-radius: 12rpx;
    margin-bottom: 20rpx;

    .add-icon {
      font-size: 32rpx;
      color: #667eea;
      margin-right: 8rpx;
    }

    .add-text {
      font-size: 28rpx;
      color: #667eea;
    }

    &:active {
      opacity: 0.7;
    }
  }

  // 推荐资质区域
  .recommended-section {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    border: 1rpx solid rgba(102, 126, 234, 0.2);

    .recommended-title {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .title-icon {
        font-size: 28rpx;
        margin-right: 8rpx;
      }

      .title-text {
        font-size: 26rpx;
        color: #667eea;
        font-weight: 600;
      }
    }

    .recommended-list {
      display: flex;
      flex-direction: column;
      gap: 12rpx;

      .recommended-item {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 10rpx;
        padding: 20rpx 24rpx;

        .recommended-icon {
          font-size: 40rpx;
          margin-right: 16rpx;
        }

        .recommended-name {
          flex: 1;
          font-size: 28rpx;
          color: #333;
        }

        .recommended-arrow {
          font-size: 28rpx;
          color: #667eea;
          font-weight: 300;
        }

        &:active {
          background: #f8f8f8;
        }
      }
    }
  }

  // 提示信息
  .tips-section {
    .tips-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .tips-icon {
        width: 32rpx;
        height: 32rpx;
        background: #667eea;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
        color: #fff;
        margin-right: 12rpx;
        flex-shrink: 0;
      }

      .tips-text {
        flex: 1;
        font-size: 24rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }

  // 选择器弹窗
  .selector-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    align-items: flex-end;

    .selector-panel {
      width: 100%;
      max-height: 80vh;
      background: #fff;
      border-radius: 24rpx 24rpx 0 0;
      padding: 30rpx;
      overflow-y: auto;

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30rpx;

        .panel-title {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }

        .close-btn {
          width: 48rpx;
          height: 48rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .close-icon {
            font-size: 48rpx;
            color: #999;
            line-height: 1;
          }
        }
      }

      .section-title {
        font-size: 26rpx;
        color: #999;
        margin-bottom: 16rpx;
      }

      .qualification-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20rpx;
        margin-bottom: 30rpx;

        .option-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20rpx 10rpx;
          background: #f8f8f8;
          border-radius: 12rpx;

          .option-icon {
            font-size: 48rpx;
            margin-bottom: 8rpx;
          }

          .option-name {
            font-size: 22rpx;
            color: #333;
            text-align: center;
            line-height: 1.4;
          }

          &:active {
            background: #f0f0f0;
          }
        }
      }

      .custom-option {
        display: flex;
        align-items: center;
        padding: 24rpx;
        background: #f8f8f8;
        border-radius: 12rpx;
        margin-bottom: 20rpx;

        .custom-icon {
          font-size: 32rpx;
          margin-right: 12rpx;
        }

        .custom-text {
          flex: 1;
          font-size: 28rpx;
          color: #333;
        }

        &:active {
          background: #f0f0f0;
        }
      }
    }
  }

  // 详情弹窗
  .dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30rpx;

    .dialog-panel {
      width: 100%;
      max-width: 600rpx;
      background: #fff;
      border-radius: 16rpx;
      overflow: hidden;

      &.small {
        max-width: 500rpx;
      }

      .dialog-header {
        padding: 30rpx;
        border-bottom: 1rpx solid #f0f0f0;

        .dialog-title {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          text-align: center;
        }
      }

      .dialog-content {
        padding: 30rpx;

        .form-item {
          margin-bottom: 30rpx;

          &:last-child {
            margin-bottom: 0;
          }

          .item-label {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 16rpx;
            display: flex;
            align-items: center;

            .required {
              color: #ff3b30;
              margin-left: 4rpx;
            }
          }

          .item-input {
            width: 100%;
            height: 80rpx;
            background: #f8f8f8;
            border-radius: 12rpx;
            padding: 0 24rpx;
            font-size: 28rpx;
            color: #333;
            box-sizing: border-box;
          }

          .custom-input {
            width: 100%;
            height: 80rpx;
            background: #f8f8f8;
            border-radius: 12rpx;
            padding: 0 24rpx;
            font-size: 28rpx;
            color: #333;
            box-sizing: border-box;
          }

          .image-upload {
            display: flex;
            gap: 16rpx;

            .upload-image-item {
              position: relative;
              width: 160rpx;
              height: 160rpx;

              .upload-image {
                width: 100%;
                height: 100%;
                border-radius: 12rpx;
                background: #f8f8f8;
              }

              .image-delete {
                position: absolute;
                top: -8rpx;
                right: -8rpx;
                width: 36rpx;
                height: 36rpx;
                background: #ff3b30;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;

                .delete-icon {
                  font-size: 28rpx;
                  color: #fff;
                  line-height: 1;
                }
              }
            }

            .upload-button {
              width: 160rpx;
              height: 160rpx;
              border: 2rpx dashed #ddd;
              border-radius: 12rpx;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: #fafafa;

              .upload-icon {
                font-size: 48rpx;
                color: #999;
                line-height: 1;
                margin-bottom: 8rpx;
              }

              .upload-text {
                font-size: 22rpx;
                color: #999;
              }
            }
          }
        }

        .input-placeholder {
          color: #999;
        }
      }

      .dialog-footer {
        display: flex;
        border-top: 1rpx solid #f0f0f0;

        .footer-btn {
          flex: 1;
          height: 88rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;

          &.cancel {
            color: #666;
            border-right: 1rpx solid #f0f0f0;
          }

          &.confirm {
            color: #667eea;
            font-weight: 600;
          }

          &:active {
            opacity: 0.7;
          }
        }
      }
    }
  }
}
</style>
