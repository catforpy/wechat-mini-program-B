<template>
  <view class="business-license-upload">
    <!-- 已上传的图片列表 -->
    <view class="image-list">
      <view
        v-for="(image, index) in localImages"
        :key="index"
        class="image-item"
      >
        <image class="uploaded-image" :src="image" mode="aspectFill" />
        <view class="delete-btn" @tap="deleteImage(index)">
          <text class="delete-icon">×</text>
        </view>
        <view class="image-index">{{ index + 1 }}</view>
      </view>

      <!-- 上传按钮 -->
      <view
        v-if="localImages.length < maxCount"
        class="upload-btn"
        @tap="chooseImage"
      >
        <text class="upload-icon">+</text>
        <text class="upload-text">上传图片</text>
      </view>
    </view>

    <!-- 提示信息 -->
    <view class="upload-tips">
      <view class="tips-item">
        <text class="tips-icon">•</text>
        <text class="tips-text">请上传清晰的营业执照照片</text>
      </view>
      <view class="tips-item">
        <text class="tips-icon">•</text>
        <text class="tips-text">支持 jpg、png 格式，大小不超过 5MB</text>
      </view>
      <view class="tips-item">
        <text class="tips-icon">•</text>
        <text class="tips-text">最多上传 {{ maxCount }} 张图片</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  modelValue: string[]
  maxCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 3
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// 本地图片数据
const localImages = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 选择图片
const chooseImage = () => {
  const remainCount = props.maxCount - localImages.value.length

  uni.chooseImage({
    count: remainCount,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths

      // 验证文件大小（5MB限制）
      const validFiles: string[] = []
      let hasInvalidFile = false

      tempFilePaths.forEach((filePath) => {
        uni.getFileInfo({
          filePath,
          success: (fileInfo) => {
            const fileSize = fileInfo.size
            if (fileSize > 5 * 1024 * 1024) {
              hasInvalidFile = true
            } else {
              validFiles.push(filePath)
            }

            // 当所有文件都检查完毕后
            if (validFiles.length + (hasInvalidFile ? 1 : 0) === tempFilePaths.length) {
              if (hasInvalidFile) {
                uni.showToast({
                  title: '部分文件超过5MB，已跳过',
                  icon: 'none'
                })
              }

              if (validFiles.length > 0) {
                // TODO: 实际项目中这里应该上传到服务器
                // 这里暂时使用本地路径
                localImages.value = [...localImages.value, ...validFiles]

                uni.showToast({
                  title: `成功添加 ${validFiles.length} 张图片`,
                  icon: 'success'
                })
              }
            }
          },
          fail: () => {
            validFiles.push(filePath)
            if (validFiles.length === tempFilePaths.length) {
              localImages.value = [...localImages.value, ...validFiles]
            }
          }
        })
      })
    }
  })
}

// 删除图片
const deleteImage = (index: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这张图片吗？',
    success: (res) => {
      if (res.confirm) {
        localImages.value.splice(index, 1)
        uni.showToast({
          title: '已删除',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.business-license-upload {
  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 24rpx;

    .image-item {
      position: relative;
      width: 200rpx;
      height: 200rpx;

      .uploaded-image {
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
        background: #f8f8f8;
      }

      .delete-btn {
        position: absolute;
        top: -10rpx;
        right: -10rpx;
        width: 40rpx;
        height: 40rpx;
        background: #ff3b30;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;

        .delete-icon {
          font-size: 32rpx;
          color: #fff;
          line-height: 1;
          font-weight: 300;
        }

        &:active {
          opacity: 0.8;
        }
      }

      .image-index {
        position: absolute;
        bottom: 8rpx;
        left: 8rpx;
        width: 36rpx;
        height: 36rpx;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 18rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
        color: #fff;
      }
    }

    .upload-btn {
      width: 200rpx;
      height: 200rpx;
      border: 2rpx dashed #ddd;
      border-radius: 12rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fafafa;

      .upload-icon {
        font-size: 60rpx;
        color: #999;
        line-height: 1;
        margin-bottom: 12rpx;
      }

      .upload-text {
        font-size: 24rpx;
        color: #999;
      }

      &:active {
        background: #f0f0f0;
      }
    }
  }

  .upload-tips {
    background: #f8f8f8;
    border-radius: 8rpx;
    padding: 20rpx;

    .tips-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .tips-icon {
        font-size: 24rpx;
        color: #999;
        margin-right: 8rpx;
      }

      .tips-text {
        flex: 1;
        font-size: 24rpx;
        color: #999;
        line-height: 1.5;
      }
    }
  }
}
</style>
