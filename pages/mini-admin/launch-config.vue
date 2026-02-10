<template>
  <view class="launch-config-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="nav-title">App拉起配置</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y>
      <!-- 说明文档 -->
      <view class="info-card">
        <view class="info-header">
          <text class="info-icon">📖</text>
          <text class="info-title">功能说明</text>
        </view>
        <view class="info-content">
          <text class="info-text">此功能用于测试 **App 拉起小程序**。使用 uni-app 内置的 plus.share.launchMiniProgram 接口（方法2）。</text>
          <text class="info-text">⚠️ 此 API 仅在 **App 环境**中可用（需云打包或真机运行），小程序/调试环境不支持。</text>
          <text class="info-text">当前配置的是您自己的小程序（AppId: wx1955c821fb20be63，原始ID: gh_f4a3f5dda07f）。</text>
        </view>
      </view>

      <!-- 配置项 -->
      <view class="config-section">
        <text class="section-title">配置参数</text>

        <!-- 小程序原始ID -->
        <view class="form-item">
          <text class="form-label">小程序原始ID</text>
          <text class="form-hint">以 gh_ 开头的字符串（必填）</text>
          <input
            v-model="config.userName"
            class="form-input"
            placeholder="请输入小程序原始ID"
            :disabled="!isEditing"
          />
        </view>

        <!-- 拉起路径 -->
        <view class="form-item">
          <text class="form-label">拉起路径</text>
          <text class="form-hint">小程序页面路径，如：pages/index/index</text>
          <input
            v-model="config.path"
            class="form-input"
            placeholder="留空则拉起小程序首页"
            :disabled="!isEditing"
          />
        </view>

        <!-- 小程序版本 -->
        <view class="form-item">
          <text class="form-label">小程序版本</text>
          <picker
            v-if="isEditing"
            mode="selector"
            :range="miniProgramTypes"
            :range-key="'label'"
            @change="onMiniProgramTypeChange"
          >
            <view class="picker-value">
              {{ getSelectedTypeLabel() }}
              <text class="picker-arrow">›</text>
            </view>
          </picker>
          <view v-else class="picker-value disabled">
            {{ getSelectedTypeLabel() }}
            <text class="picker-arrow">›</text>
          </view>
        </view>
      </view>

      <!-- 参数说明 -->
      <view class="info-card">
        <view class="info-header">
          <text class="info-icon">💡</text>
          <text class="info-title">参数说明</text>
        </view>
        <view class="info-content">
          <view class="param-item">
            <text class="param-label">小程序原始ID：</text>
            <text class="param-desc">小程序的原始ID，以 gh_ 开头，可在微信公众平台→设置→基本配置中找到</text>
          </view>
          <view class="param-item">
            <text class="param-label">拉起路径：</text>
            <text class="param-desc">小程序的页面路径，如 pages/index/index，留空则拉起首页。可带参数，如：pages/index/index?foo=bar</text>
          </view>
          <view class="param-item">
            <text class="param-label">小程序版本：</text>
            <text class="param-desc">0-正式版，1-开发版，2-体验版。测试时建议用体验版(2)</text>
          </view>
        </view>
      </view>

      <!-- 开发文档链接 -->
      <view class="doc-card">
        <text class="doc-title">参考文档</text>
        <view class="doc-list">
          <view class="doc-item" @tap="openDoc('https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/extended/multi-app-launch-mini-program.html')">
            <text class="doc-link">App 拉起小程序开发指南</text>
            <text class="doc-arrow">›</text>
          </view>
          <view class="doc-item" @tap="openDoc('https://developers.weixin.qq.com/doc/oplenco/MjAxNzQ5ODcxNzIxNzcxMzAwNzUyWg4NzA1NDc2ODcxNw')">
            <text class="doc-link">微信 OpenSDK Android 接入</text>
            <text class="doc-arrow">›</text>
          </view>
          <view class="doc-item" @tap="openDoc('https://developers.weixin.qq.com/doc/oplenco/MjAxNzQ4MzcwNzIxNzcxMzAwNzUyWg4NzA1NDc2ODcxNw')">
            <text class="doc-link">微信 OpenSDK iOS 接入</text>
            <text class="doc-arrow">›</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button v-if="!isEditing" class="action-btn primary" @tap="startEdit">
          编辑配置
        </button>
        <template v-else>
          <button class="action-btn secondary" @tap="cancelEdit">取消</button>
          <button class="action-btn primary" @tap="saveConfig">保存配置</button>
        </template>

        <button class="action-btn success" @tap="testLaunch">
          🚀 测试拉起
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 状态栏高度
const statusBarHeight = ref(0)

// 是否在编辑状态
const isEditing = ref(false)

// 小程序版本类型
const miniProgramTypes = [
  { label: '开发版', value: 'develop' },
  { label: '体验版', value: 'trial' },
  { label: '正式版', value: 'release' }
]

// 配置数据
const config = ref({
  appId: 'wx1955c821fb20be63', // 您的小程序AppId
  userName: 'gh_f4a3f5dda07f', // 您的小程序原始ID（从微信公众平台获取）
  path: '',
  query: '',
  miniProgramType: 'trial' // 体验版
})

// 获取选中的类型标签
const getSelectedTypeLabel = () => {
  const type = miniProgramTypes.find(t => t.value === config.value.miniProgramType)
  return type ? type.label : '体验版'
}

// 选择小程序版本
const onMiniProgramTypeChange = (e: any) => {
  config.value.miniProgramType = e.detail.value
}

// 开始编辑
const startEdit = () => {
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  // 恢复原始配置
  config.value = {
    appId: 'wx1955c821fb20be63',
    userName: 'gh_f4a3f5dda07f', // 正确的原始ID
    path: '',
    query: '',
    miniProgramType: 'trial'
  }
}

// 保存配置
const saveConfig = () => {
  console.log('[App拉起配置] 保存配置:', config.value)

  // TODO: 保存到本地存储或服务器
  uni.setStorageSync('miniProgramLaunchConfig', JSON.stringify(config.value))

  isEditing.value = false
  uni.showToast({
    title: '配置已保存',
    icon: 'success'
  })
}

// 测试拉起
const testLaunch = () => {
  console.log('[App拉起配置] 开始测试拉起小程序')
  console.log('[App拉起配置] 配置参数:', JSON.stringify(config.value))

  // 验证必要参数
  if (!config.value.userName) {
    console.error('[App拉起配置] 错误: 缺少小程序原始ID')
    uni.showToast({
      title: '请先配置小程序原始ID',
      icon: 'none',
      duration: 2000
    })
    return
  }

  // 显示加载提示
  uni.showLoading({
    title: '正在拉起...',
    mask: true
  })

  // 获取小程序版本类型对应的数值
  // 0-正式版，1-开发版，2-体验版
  const miniProgramTypeMap: Record<string, number> = {
    'release': 0,  // 正式版
    'develop': 1,  // 开发版
    'trial': 2     // 体验版
  }

  const miniProgramType = miniProgramTypeMap[config.value.miniProgramType] ?? 2

  console.log('[App拉起配置] 调用 wx.miniapp.launchMiniProgram')
  console.log('[App拉起配置] userName:', config.value.userName)
  console.log('[App拉起配置] path:', config.value.path || '(空，使用首页)')
  console.log('[App拉起配置] miniProgramType:', miniProgramType, `(${config.value.miniProgramType})`)
  console.log('[App拉起配置] 当前运行环境:', uni.getSystemInfoSync().uniPlatform)

  // 检测当前运行环境
  const systemInfo = uni.getSystemInfoSync()
  const platform = systemInfo.uniPlatform

  console.log('[App拉起配置] uniPlatform:', platform)

  // 检查是否在 App 环境
  if (platform !== 'app') {
    console.error('[App拉起配置] ✗ 当前不在 App 环境，无法测试 wx.miniapp.launchMiniProgram')
    console.error('[App拉起配置] 当前环境:', platform)
    uni.hideLoading()

    uni.showModal({
      title: '环境不支持',
      content: `wx.miniapp.launchMiniProgram 只在 App 环境中可用\n\n当前运行环境: ${platform}\n\n请使用真机 App 或云打包后的 App 进行测试\n\n小程序/调试环境不支持此API`,
      showCancel: false
    })
    return
  }

  // 检查 API 是否可用
  // 在 uni-app App 环境中，使用 plus API 调用微信 OpenSDK
  console.log('[App拉起配置] 检查 API 可用性...')
  console.log('[App拉起配置] typeof plus:', typeof plus)
  console.log('[App拉起配置] typeof plus.share:', typeof plus?.share)
  console.log('[App拉起配置] typeof wx:', typeof wx)
  console.log('[App拉起配置] typeof wx.miniapp:', typeof wx?.miniapp)

  // 尝试使用 uni-app 的方式调用
  // 方案1: 使用 plus.share (微信分享SDK)
  // 方案2: 使用 wx.miniapp (如果可用)
  // 方案3: 使用原生插件

  // 【方法2】使用 plus.share.ShareService.launchMiniProgram (HTML5+ API)
  if (typeof plus !== 'undefined' && plus?.share) {
    console.log('[App拉起配置] ✓ 检测到 plus.share API')
    console.log('[App拉起配置] 正在获取微信分享服务...')

    try {
      // 获取分享服务列表
      plus.share.getServices((services) => {
        console.log('[App拉起配置] 分享服务列表:', services)

        // 查找微信服务
        let weixinService = null
        for (let i = 0; i < services.length; i++) {
          const service = services[i]
          console.log(`[App拉起配置] 服务 ${i}:`, service.id, service.name, service.description)

          if (service.id === 'weixin') {
            weixinService = service
            break
          }
        }

        if (!weixinService) {
          console.error('[App拉起配置] ✗ 未找到微信分享服务')
          uni.hideLoading()
          uni.showModal({
            title: '服务不可用',
            content: '未找到微信分享服务\n\n请确保:\n1. manifest.json 已配置微信SDK\n2. App 已安装微信\n3. 已正确打包 App',
            showCancel: false
          })
          return
        }

        console.log('[App拉起配置] ✓ 找到微信服务:', weixinService)

        // 检查微信服务是否有 launchMiniProgram 方法
        if (typeof weixinService.launchMiniProgram !== 'function') {
          console.error('[App拉起配置] ✗ 微信服务不支持 launchMiniProgram')
          console.error('[App拉起配置] 微信服务可用方法:', Object.keys(weixinService))
          uni.hideLoading()
          uni.showModal({
            title: '方法不支持',
            content: '当前微信分享服务不支持 launchMiniProgram 方法\n\n可能原因:\n1. 微信SDK版本过旧\n2. manifest.json 配置不正确',
            showCancel: false
          })
          return
        }

        console.log('[App拉起配置] 调用微信服务 launchMiniProgram')
        console.log('[App拉起配置] 参数:', {
          id: config.value.appId,
          type: miniProgramType,
          path: config.value.path || '(空)'
        })

        // 调用微信服务的 launchMiniProgram 方法
        weixinService.launchMiniProgram({
          id: config.value.appId,        // 小程序AppID
          type: miniProgramType,         // 0-正式版 1-开发版 2-体验版
          path: config.value.path || ''  // 拉起路径（可选）
        }, (result) => {
          // 成功回调
          console.log('[App拉起配置] ✓ 拉起成功!', result)
          console.log('[App拉起配置] 返回数据:', JSON.stringify(result))
          uni.hideLoading()

          uni.showToast({
            title: '拉起成功',
            icon: 'success',
            duration: 2000
          })
        }, (error) => {
          // 失败回调
          console.error('[App拉起配置] ✗ 拉起失败!', error)
          console.error('[App拉起配置] 错误信息:', JSON.stringify(error))
          uni.hideLoading()

          const errorMsg = error?.message || error?.errMsg || JSON.stringify(error)
          uni.showModal({
            title: '拉起失败',
            content: `错误信息:\n${errorMsg}\n\n详细错误请查看控制台日志`,
            showCancel: false
          })
        })

        console.log('[App拉起配置] API 调用已发送')
      }, (error) => {
        // getServices 失败回调
        console.error('[App拉起配置] ✗ 获取分享服务失败!', error)
        uni.hideLoading()

        const errorMsg = error?.message || error?.errMsg || JSON.stringify(error)
        uni.showModal({
          title: '服务获取失败',
          content: `错误信息:\n${errorMsg}\n\n可能原因:\n1. manifest.json 未配置微信分享模块\n2. 未云打包/真机运行`,
          showCancel: false
        })
      })

      return
    } catch (err) {
      console.error('[App拉起配置] ✗ 调用异常:', err)
      uni.hideLoading()

      uni.showModal({
        title: '调用异常',
        content: `异常信息: ${JSON.stringify(err)}\n\n可能原因:\n1. manifest.json 未配置微信SDK\n2. 未云打包/真机运行\n3. 微信未安装`,
        showCancel: false
      })
      return
    }
  }

  // 使用 wx.miniapp.launchMiniProgram (如果可用)
  if (typeof wx?.miniapp?.launchMiniProgram === 'function') {
    console.log('[App拉起配置] 使用 wx.miniapp.launchMiniProgram')

    wx.miniapp.launchMiniProgram({
      userName: config.value.userName,
      path: config.value.path || '',
      miniprogramType: miniProgramType,
      success: (res) => {
        console.log('[App拉起配置] ✓ 拉起成功!', res)
        console.log('[App拉起配置] 返回数据:', JSON.stringify(res))
        uni.hideLoading()
        uni.showToast({
          title: '拉起成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (err) => {
        console.error('[App拉起配置] ✗ 拉起失败!', err)
        console.error('[App拉起配置] 错误信息:', JSON.stringify(err))

        uni.hideLoading()

        const errorMsg = err?.errMsg || err?.errorMessage || JSON.stringify(err)
        uni.showModal({
          title: '拉起失败',
          content: `错误信息:\n${errorMsg}\n\n详细错误请查看控制台日志`,
          showCancel: false
        })
      }
    })

    console.log('[App拉起配置] API 调用已发送')
    return
  }

  // 如果上面的 API 都不可用，提示用户并给出详细解决方案
  console.error('[App拉起配置] ✗ 所有 API 都不可用')
  console.error('[App拉起配置] wx.miniapp:', typeof wx?.miniapp)
  console.error('[App拉起配置] plus.share:', typeof plus?.share)
  uni.hideLoading()

  uni.showModal({
    title: 'API 不可用 - 需要配置',
    content: `wx.miniapp.launchMiniProgram 不存在\n\n当前环境:\n- 平台: ${platform}\n- wx.miniapp: ${typeof wx?.miniapp}\n- plus.share: ${typeof plus?.share}\n\n解决方案:\n\n【推荐】使用 DCloud 原生插件\n1. 访问 DCloud 插件市场\n2. 搜索 "小程序跳转" 或 "launchMiniProgram"\n3. 导入插件到项目\n4. 在 manifest.json 中引用\n\n【方案2】自建原生插件\n1. 创建 uni-app 原生插件\n2. 在 Android/iOS 原生代码中\n   调用微信 OpenSDK\n3. 封装成 uni-app 插件\n\n【方案3】配置 manifest.json\n在 app-plus → distribute → sdkConfigs 中\n添加微信 OAuth 配置\n\n详细日志请查看控制台`,
    showCancel: false
  })
}

// 打开文档
const openDoc = (url: string) => {
  console.log('[App拉起配置] 打开文档:', url)

  // 在HBuilderX中，可以使用plus.runtime.openURL()打开外部链接
  // 但在普通环境中可能不支持
  uni.showModal({
    title: '打开文档',
    content: `即将打开链接：\n${url}\n\n提示：部分环境可能不支持直接打开外部链接`,
    confirmText: '复制链接',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: url,
          success: () => {
            uni.showToast({
              title: '链接已复制到剪贴板',
              icon: 'success'
            })
          }
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

  // 尝试从本地存储加载配置
  const savedConfig = uni.getStorageSync('miniProgramLaunchConfig')
  if (savedConfig) {
    try {
      config.value = JSON.parse(savedConfig)
    } catch (e) {
      console.error('[App拉起配置] 加载配置失败:', e)
    }
  }
})
</script>

<style scoped lang="scss">
.launch-config-page {
  min-height: 100vh;
  background-color: #f5f5f5;
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
    }
  }
}

// 内容区域
.content {
  padding: calc(var(--status-bar-height) + 88rpx + 30rpx) 30rpx 30rpx;
  padding-bottom: 120rpx;
}

// 说明卡片
.info-card, .doc-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .info-header, .doc-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .info-icon, .doc-icon {
      font-size: 40rpx;
      margin-right: 12rpx;
    }

    .info-title, .doc-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .info-content {
    .info-text {
      display: block;
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .doc-list {
    .doc-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .doc-link {
        font-size: 28rpx;
        color: #667eea;
      }

      .doc-arrow {
        font-size: 32rpx;
        color: #ccc;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }
}

// 参数说明
.info-content {
  .param-item {
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .param-label {
      display: block;
      font-size: 26rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .param-desc {
      display: block;
      font-size: 24rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}

// 配置区域
.config-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
  }

  .form-item {
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 12rpx;
    }

    .form-hint {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-bottom: 12rpx;
    }

    .form-input {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      padding: 0 24rpx;
      background: #f5f5f5;
      border-radius: 12rpx;
      font-size: 28rpx;
      color: #333;
      box-sizing: border-box;

      &[disabled] {
        background: #f0f0f0;
        color: #999;
      }
    }

    .picker-value {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 80rpx;
      padding: 0 24rpx;
      background: #f5f5f5;
      border-radius: 12rpx;
      font-size: 28rpx;
      color: #333;

      &.disabled {
        background: #f0f0f0;
        color: #999;
      }

      .picker-arrow {
        font-size: 40rpx;
        color: #999;
      }
    }
  }
}

// 操作按钮
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .action-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    border-radius: 12rpx;
    font-size: 30rpx;
    font-weight: 500;
    border: none;

    &.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    &.secondary {
      background: #f5f5f5;
      color: #666;
    }

    &.success {
      background: linear-gradient(135deg, #07c160 0%, #06ae56 100%);
      color: #fff;
    }

    &::after {
      border: none;
    }
  }
}
</style>
