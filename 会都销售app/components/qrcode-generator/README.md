# 二维码组件使用说明

## 组件列表

1. **qrcode-generator** - 二维码生成组件
2. **qrcode-scanner** - 二维码扫描组件

## 安装依赖

### 方案一：使用 uQRCode 插件（推荐）

1. 安装 uQRCode 插件：
   ```bash
   # 在 HBuilderX 中通过插件市场安装
   # 或者下载插件：https://ext.dcloud.net.cn/plugin?id=39
   ```

2. 在 `pages.json` 或 `manifest.json` 中配置：
   ```json
   {
     "easycom": {
       "autoscan": true,
       "custom": {
         "^uqrcode": "@/components/uqrcode/uqrcode.vue"
       }
     }
   }
   ```

### 方案二：使用其他二维码库

- **weapp-qrcode**: https://github.com/davidshimjs/qrcodejs
- **qrcode.vue**: Vue 3 二维码组件

## qrcode-generator 组件

### 使用方法

```vue
<template>
  <view>
    <qrcode-generator
      :content="qrcodeData"
      :size="200"
      :color-dark="'#000000'"
      :color-light="'#ffffff'"
      canvas-id="my-qrcode"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QrcodeGenerator from '@/components/qrcode-generator/qrcode-generator.vue'

const qrcodeData = ref('https://example.com')
</script>
```

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | - | 二维码内容（必填） |
| size | number | 200 | 二维码尺寸（px） |
| colorDark | string | '#000000' | 二维码前景色 |
| colorLight | string | '#ffffff' | 二维码背景色 |
| correctLevel | number | 2 | 容错级别（0-3） |
| canvasId | string | 'qrcode' | Canvas ID |

## qrcode-scanner 组件

### 使用方法

```vue
<template>
  <view>
    <qrcode-scanner
      @scan="onScanSuccess"
      @cancel="onCancel"
      @error="onError"
    />
  </view>
</template>

<script setup lang="ts">
import QrcodeScanner from '@/components/qrcode-scanner/qrcode-scanner.vue'

const onScanSuccess = (result: string) => {
  console.log('扫码结果:', result)
  uni.showToast({
    title: `扫码成功: ${result}`,
    icon: 'none'
  })
}

const onCancel = () => {
  uni.navigateBack()
}

const onError = (error: any) => {
  console.error('扫码错误:', error)
}
</script>
```

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| scan | result: string | 扫码成功，返回结果 |
| cancel | - | 用户取消扫码 |
| error | error: any | 扫码出错 |

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| tipText | string | '将二维码放入框内，即可自动扫描' | 提示文字 |
| autoScan | boolean | true | 是否自动扫描 |

## 权限配置

在 `manifest.json` 中添加相机权限：

```json
{
  "mp-weixin": {
    "permission": {
      "scope.camera": {
        "desc": "需要使用您的相机来扫描二维码"
      }
    }
  }
}
```

## 注意事项

1. **生成二维码**：需要安装 uQRCode 插件或其他二维码库
2. **扫描二维码**：需要相机权限
3. **Canvas ID**：同一页面多个二维码时需使用不同的 canvasId
4. **尺寸单位**：组件使用 px 作为单位，需要注意 rpx 转换

## 实际应用示例

### 我的二维码页面

参考 `pages/profile/my-qrcode.vue`：

```vue
<template>
  <view class="qrcode-page">
    <!-- 用户信息 -->
    <view class="user-card">
      <image :src="userInfo.avatar" class="avatar" />
      <text>{{ userInfo.nickname }}</text>
    </view>

    <!-- 二维码 -->
    <qrcode-generator
      :content="qrcodeContent"
      :size="200"
      canvas-id="my-qrcode"
    />

    <text class="tip">扫码添加我</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const userInfo = ref({
  userId: '10001',
  nickname: '用户昵称',
  avatar: '/static/logo.jpg'
})

const qrcodeContent = computed(() => {
  return `HDUDU://user/${userInfo.value.userId}?name=${encodeURIComponent(userInfo.value.nickname)}`
})
</script>
```

### 扫码添加好友

```vue
<template>
  <view>
    <button @tap="startScan">扫一扫</button>

    <qrcode-scanner
      v-if="showScanner"
      @scan="onScanSuccess"
      @cancel="showScanner = false"
    />
  </view>
</template>

<script setup lang="ts">
const showScanner = ref(false)

const startScan = () => {
  showScanner.value = true
}

const onScanSuccess = (result: string) => {
  showScanner.value = false

  // 解析二维码内容
  // 格式：HDUDU://user/{userId}?name={nickname}
  if (result.startsWith('HDUDU://user/')) {
    const url = new URL(result)
    const userId = url.pathname.replace('/user/', '')
    const name = url.searchParams.get('name')

    // 跳转到好友详情页或发送好友请求
    uni.navigateTo({
      url: `/pages/user/detail?userId=${userId}&name=${encodeURIComponent(name || '')}`
    })
  } else {
    uni.showToast({
      title: '无效的二维码',
      icon: 'none'
    })
  }
}
</script>
```

## 常见问题

### 1. 二维码不显示

- 检查是否安装了 uQRCode 插件
- 检查 content 参数是否有值
- 检查 canvasId 是否重复

### 2. 扫码无法启动

- 检查是否配置了相机权限
- 检查真机是否支持相机
- 检查小程序是否授权了相机权限

### 3. 二维码识别失败

- 确保二维码清晰可见
- 确保光线充足
- 尝试调整扫码距离
