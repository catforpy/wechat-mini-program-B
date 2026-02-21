<template>
  <view class="qrcode-scanner">
    <!-- 摄像头预览区域 -->
    <camera
      v-if="showCamera"
      :device-position="cameraPosition"
      :flash="flashMode"
      class="camera-preview"
      @scancode="onScanCode"
      @error="onError"
    >
      <!-- 扫码框 -->
      <cover-view class="scan-container">
        <cover-view class="scan-box">
          <cover-view class="scan-corner top-left"></cover-view>
          <cover-view class="scan-corner top-right"></cover-view>
          <cover-view class="scan-corner bottom-left"></cover-view>
          <cover-view class="scan-corner bottom-right"></cover-view>
          <cover-view class="scan-line"></cover-view>
        </cover-view>
        <cover-view class="scan-tip">{{ tipText }}</cover-view>
      </cover-view>
    </camera>

    <!-- 控制栏 -->
    <view class="control-bar">
      <!-- 返回按钮 -->
      <view class="control-btn" @tap="handleCancel">
        <text class="btn-text">取消</text>
      </view>

      <!-- 闪光灯切换 -->
      <view class="control-btn" @tap="toggleFlash">
        <text class="btn-icon">{{ flashMode === 'off' ? '🔦' : '💡' }}</text>
      </view>

      <!-- 相机切换 -->
      <view class="control-btn" @tap="toggleCamera">
        <text class="btn-icon">🔄</text>
      </view>

      <!-- 从相册选择 -->
      <view class="control-btn" @tap="chooseFromAlbum">
        <text class="btn-text">相册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  // 提示文字
  tipText?: string
  // 是否自动扫描
  autoScan?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tipText: '将二维码放入框内，即可自动扫描',
  autoScan: true
})

const emit = defineEmits<{
  scan: [result: string]
  cancel: []
  error: [error: any]
}>()

// 是否显示相机
const showCamera = ref(true)
// 相机位置 front/back
const cameraPosition = ref<'front' | 'back'>('back')
// 闪光灯模式 off/on/torch
const flashMode = ref<'off' | 'on' | 'torch'>('off')

// 扫码成功回调
const onScanCode = (e: any) => {
  console.log('扫码结果:', e)
  const result = e.detail?.result

  if (result) {
    emit('scan', result)

    // 震动反馈
    uni.vibrateShort({
      type: 'light'
    })
  }
}

// 相机错误回调
const onError = (e: any) => {
  console.error('相机错误:', e)
  emit('error', e)

  uni.showToast({
    title: '相机启动失败',
    icon: 'none'
  })
}

// 取消扫码
const handleCancel = () => {
  emit('cancel')
}

// 切换闪光灯
const toggleFlash = () => {
  const modes: Array<'off' | 'on' | 'torch'> = ['off', 'on', 'torch']
  const currentIndex = modes.indexOf(flashMode.value)
  flashMode.value = modes[(currentIndex + 1) % modes.length]

  uni.showToast({
    title: flashMode.value === 'off' ? '已关闭闪光灯' : '已开启闪光灯',
    icon: 'none',
    duration: 1500
  })
}

// 切换相机
const toggleCamera = () => {
  cameraPosition.value = cameraPosition.value === 'back' ? 'front' : 'back'
}

// 从相册选择
const chooseFromAlbum = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original'],
    sourceType: ['album'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      if (tempFilePaths && tempFilePaths.length > 0) {
        // 调用扫码API识别图片中的二维码
        uni.scanCode({
          onlyFromCamera: false,
          success: (scanRes) => {
            console.log('识别成功:', scanRes)
            emit('scan', scanRes.result)
          },
          fail: (err) => {
            console.error('识别失败:', err)
            uni.showToast({
              title: '未识别到二维码',
              icon: 'none'
            })
          }
        })
      }
    }
  })
}

onMounted(() => {
  // 请求相机权限
  uni.authorize({
    scope: 'scope.camera',
    success: () => {
      console.log('相机权限已授权')
    },
    fail: () => {
      console.warn('相机权限未授权')
      uni.showModal({
        title: '权限提示',
        content: '需要相机权限才能扫码',
        showCancel: false
      })
    }
  })
})
</script>

<style scoped lang="scss">
.qrcode-scanner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 9999;

  .camera-preview {
    width: 100%;
    height: 100%;
    position: relative;

    .scan-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .scan-box {
        width: 500rpx;
        height: 500rpx;
        position: relative;
        background: rgba(0, 0, 0, 0.3);

        .scan-corner {
          position: absolute;
          width: 80rpx;
          height: 80rpx;
          border: 4rpx solid #667eea;

          &.top-left {
            top: 0;
            left: 0;
            border-right: none;
            border-bottom: none;
          }

          &.top-right {
            top: 0;
            right: 0;
            border-left: none;
            border-bottom: none;
          }

          &.bottom-left {
            bottom: 0;
            left: 0;
            border-right: none;
            border-top: none;
          }

          &.bottom-right {
            bottom: 0;
            right: 0;
            border-left: none;
            border-top: none;
          }
        }

        .scan-line {
          position: absolute;
          top: 0;
          left: 20rpx;
          right: 20rpx;
          height: 4rpx;
          background: #667eea;
          animation: scanAnimation 2s linear infinite;
        }

        @keyframes scanAnimation {
          0% {
            top: 20rpx;
          }
          50% {
            top: calc(100% - 20rpx);
          }
          100% {
            top: 20rpx;
          }
        }
      }

      .scan-tip {
        margin-top: 60rpx;
        font-size: 28rpx;
        color: #fff;
        text-align: center;
        text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
      }
    }
  }

  .control-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 40rpx 30rpx;
    padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
    background: rgba(0, 0, 0, 0.5);

    .control-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);

      .btn-text {
        font-size: 26rpx;
        color: #fff;
      }

      .btn-icon {
        font-size: 40rpx;
      }

      &:active {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>
