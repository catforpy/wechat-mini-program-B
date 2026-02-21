<template>
  <view class="qrcode-generator">
    <!-- 使用 image 标签显示二维码 -->
    <image
      v-if="qrcodeUrl"
      :src="qrcodeUrl"
      :style="{ width: size + 'px', height: size + 'px' }"
      class="qrcode-image"
      mode="aspectFit"
    />
    <!-- 加载中状态 -->
    <view v-else class="qrcode-loading" :style="{ width: size + 'px', height: size + 'px' }">
      <text class="loading-text">生成中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  // 二维码内容
  content: string
  // 二维码尺寸（单位：px）
  size?: number
  // 是否使用 API 生成（推荐）
  useApi?: boolean
  // API 地址（可选，不传则使用默认 API）
  apiUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  useApi: true,
  apiUrl: ''
})

const qrcodeUrl = ref('')

// 使用公共 API 生成二维码
const generateByApi = () => {
  if (!props.content) {
    console.warn('二维码内容不能为空')
    return
  }

  // 使用免费的公共二维码生成 API
  const apiUrl = props.apiUrl || `https://api.qrserver.com/v1/create-qr-code/?size=${props.size}x${props.size}&data=${encodeURIComponent(props.content)}`

  qrcodeUrl.value = apiUrl
  console.log('二维码生成成功（使用 API）:', apiUrl)
}

// 使用后端 API 生成二维码（推荐用于生产环境）
const generateByBackend = () => {
  if (!props.content) {
    console.warn('二维码内容不能为空')
    return
  }

  // TODO: 调用后端接口生成二维码
  // 示例代码：
  // uni.request({
  //   url: 'https://your-api.com/api/qrcode/generate',
  //   method: 'POST',
  //   data: {
  //     content: props.content,
  //     size: props.size
  //   },
  //   success: (res) => {
  //     qrcodeUrl.value = res.data.qrcodeUrl
  //   }
  // })

  // 临时使用公共 API
  generateByApi()
}

// 生成本地二维码（需要安装 weapp-qrcode 库）
const generateLocal = () => {
  // TODO: 安装 weapp-qrcode 库后使用
  // 1. 安装：npm install weapp-qrcode
  // 2. 使用：
  // import drawQrcode from 'weapp-qrcode'
  //
  // const canvasId = 'qrcode-canvas'
  // drawQrcode({
  //   width: props.size,
  //   height: props.size,
  //   canvasId: canvasId,
  //   text: props.content,
  //   _this: this
  // })

  // 临时使用公共 API
  generateByApi()
}

// 生成二维码
const generateQRCode = () => {
  if (props.useApi) {
    generateByApi()
  } else {
    generateLocal()
  }
}

// 监听内容变化
watch(() => props.content, () => {
  generateQRCode()
})

onMounted(() => {
  generateQRCode()
})

// 暴露方法供父组件调用
defineExpose({
  regenerate: generateQRCode
})
</script>

<style scoped lang="scss">
.qrcode-generator {
  display: inline-block;

  .qrcode-image {
    display: block;
    background: #fff;
  }

  .qrcode-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;

    .loading-text {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>
