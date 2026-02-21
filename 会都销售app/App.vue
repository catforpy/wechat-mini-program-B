<script lang="ts">
/**
 * 应用主组件
 * Uniapp App.vue 使用 Options API
 */
import { useAppStore, useUserStore } from './stores'
import mockDataManager from './mock/manager'
import { isMockEnabled } from './config/mock'

export default {
  onLaunch() {
    console.log('App Launch')
    console.log('应用版本: 1.0.0')

    // 强制锁定为竖屏
    this.lockPortraitOrientation()

    // 初始化应用
    this.initApp()
  },

  onShow() {
    console.log('App Show')
  },

  onHide() {
    console.log('App Hide')
  },

  methods: {
    /**
     * 强制锁定为竖屏
     */
    lockPortraitOrientation() {
      console.log('[屏幕方向] ========== 开始强制锁定竖屏 ==========')

      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync()
      console.log('[屏幕方向] 当前系统信息:', systemInfo)

      const windowWidth = systemInfo.windowWidth || 0
      const windowHeight = systemInfo.windowHeight || 0
      const screenWidth = systemInfo.screenWidth || 0
      const screenHeight = systemInfo.screenHeight || 0

      console.log('[屏幕方向] 窗口尺寸 - 宽:', windowWidth, '高:', windowHeight)
      console.log('[屏幕方向] 屏幕尺寸 - 宽:', screenWidth, '高:', screenHeight)

      // 判断当前屏幕方向
      const isLandscape = windowWidth > windowHeight
      console.log('[屏幕方向] 当前是否横屏:', isLandscape ? '是横屏❌' : '是竖屏✓')

      if (isLandscape) {
        console.log('[屏幕方向] ⚠️ 警告:当前是横屏,尝试强制切换为竖屏')
      }

      // 🔥 关键：使用 HTML5+ API 强制锁定屏幕方向
      // 只在 App 环境中生效
      // @ts-ignore
      if (typeof plus !== 'undefined' && plus.screen && plus.screen.lockOrientation) {
        try {
          // 锁定为竖屏（正向）
          plus.screen.lockOrientation('portrait-primary')
          console.log('[屏幕方向] ✅ 已调用 plus.screen.lockOrientation("portrait-primary")')

          // 验证是否锁定成功
          // @ts-ignore
          const currentOrientation = plus.screen.orientation
          console.log('[屏幕方向] 当前屏幕方向:', currentOrientation)
        } catch (error) {
          console.error('[屏幕方向] ❌ 锁定屏幕方向失败:', error)
        }
      } else {
        console.log('[屏幕方向] ⚠️ 当前环境不支持 plus.screen API')
      }

      try {
        // 监听窗口尺寸变化
        uni.onWindowResize && uni.onWindowResize((res) => {
          console.log('[屏幕方向] ========== 窗口尺寸变化 ==========')
          console.log('[屏幕方向] 新尺寸 - 宽:', res.size.windowWidth, '高:', res.size.windowHeight)

          const newIsLandscape = res.size.windowWidth > res.size.windowHeight
          console.log('[屏幕方向] 变化后是否横屏:', newIsLandscape ? '是横屏❌' : '是竖屏✓')

          if (newIsLandscape) {
            console.log('[屏幕方向] ⚠️⚠️⚠️ 检测到横屏,尝试强制切换回竖屏')
            // 重新锁定
            // @ts-ignore
            if (typeof plus !== 'undefined' && plus.screen && plus.screen.lockOrientation) {
              plus.screen.lockOrientation('portrait-primary')
              console.log('[屏幕方向] ✅ 已重新锁定竖屏')
            }
            uni.setStorageSync('force_portrait', true)
          }
        })

        console.log('[屏幕方向] ✓ 窗口尺寸监听已设置')
      } catch (error) {
        console.log('[屏幕方向] 监听窗口尺寸失败:', error)
      }

      // 打印配置信息
      console.log('[屏幕方向] manifest.json 中已配置 pageOrientation: portrait')
      console.log('[屏幕方向] pages.json 中已配置 pageOrientation: portrait')
      console.log('[屏幕方向] ========== 强制锁定竖屏完成 ==========')
    },

    /**
     * 初始化应用
     */
    async initApp() {
      console.log('初始化应用...')

      // 1. 初始化 Mock 数据
      if (isMockEnabled()) {
        try {
          await mockDataManager.init()
          console.log('[App] Mock 数据初始化成功')
        } catch (error) {
          console.error('[App] Mock 数据初始化失败:', error)
        }
      }

      // 2. 初始化状态管理
      try {
        const appStore = useAppStore()
        await appStore.init()
        console.log('[App] 应用状态初始化成功')
      } catch (error) {
        console.error('[App] 应用状态初始化失败:', error)
      }

      // 3. 初始化用户状态
      try {
        const userStore = useUserStore()
        await userStore.init()
        console.log('[App] 用户状态初始化成功')
      } catch (error) {
        console.error('[App] 用户状态初始化失败:', error)
      }

      console.log('[App] 应用初始化完成')
    }
  }
}
</script>

<style lang="scss">
/* 全局样式已移至 src/styles/index.scss */
</style>
